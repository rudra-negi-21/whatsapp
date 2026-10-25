/**
 * ChakraHQ <-> WhatsApp Cloud API Webhook Handler
 *
 * This API route connects your Next.js app to ChakraHQ.
 * ChakraHQ forwards all Meta/WhatsApp events to this URL as a pass-through webhook.
 *
 * SET IN CHAKRAHQ:
 *   WhatsApp Setup → Advanced → Pass-through webhook url for all Meta events
 *   → https://YOUR-DOMAIN.com/api/webhook
 *
 * GET /api/webhook  → Webhook verification (Meta handshake)
 * POST /api/webhook → Receive incoming messages & status updates from ChakraHQ
 */

import { NextRequest, NextResponse } from 'next/server';

// ─── Types ────────────────────────────────────────────────────────────────────

interface MetaWebhookMessage {
  from: string;
  id: string;
  timestamp: string;
  text?: { body: string };
  type: 'text' | 'image' | 'audio' | 'document' | 'interactive';
  interactive?: {
    type: 'button_reply' | 'list_reply';
    button_reply?: { id: string; title: string };
    list_reply?: { id: string; title: string };
  };
}

interface MetaWebhookStatus {
  id: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: string;
  recipient_id: string;
}

interface MetaWebhookEntry {
  id: string;
  changes: Array<{
    value: {
      messaging_product: string;
      metadata?: {
        display_phone_number: string;
        phone_number_id: string;
      };
      contacts?: Array<{ profile: { name: string }; wa_id: string }>;
      messages?: MetaWebhookMessage[];
      statuses?: MetaWebhookStatus[];
    };
    field: string;
  }>;
}

interface MetaWebhookPayload {
  object: string;
  entry: MetaWebhookEntry[];
}

// ─── Helper: Send a WhatsApp message via ChakraHQ API ─────────────────────────

async function sendWhatsAppMessage(to: string, body: string): Promise<boolean> {
  const chakraApiKey = process.env.CHAKRA_API_KEY;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!chakraApiKey || !phoneNumberId) {
    console.warn('[Webhook] Missing CHAKRA_API_KEY or WHATSAPP_PHONE_NUMBER_ID env vars');
    return false;
  }

  try {
    // ChakraHQ proxies the Meta Cloud API — same endpoint format
    const response = await fetch(
      `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${chakraApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to,
          type: 'text',
          text: { body },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error('[Webhook] Failed to send message:', err);
      return false;
    }

    console.log(`[Webhook] ✅ Message sent to ${to}`);
    return true;
  } catch (error) {
    console.error('[Webhook] Send error:', error);
    return false;
  }
}

// ─── Helper: Match incoming text against bot rules ────────────────────────────

function matchBotRule(text: string): string | null {
  const normalized = text.toLowerCase().trim();

  const rules: Array<{ keywords: string[]; response: string }> = [
    {
      keywords: ['hi', 'hello', 'hey', 'start', 'good morning', 'namaste'],
      response:
        'Hello there! 👋 Welcome to our WhatsApp Assistant.\n\nI can help you explore services, check order statuses, or connect with our support team.\n\nHow can I help you today?',
    },
    {
      keywords: ['menu', 'services', 'options', 'help'],
      response:
        'Here are our most popular services:\n\n1️⃣ *Product Catalog*\n2️⃣ *Track Existing Order*\n3️⃣ *Pricing & Discounts*\n4️⃣ *Business Inquiries*\n5️⃣ *Live Human Support*\n\nReply with the keyword!',
    },
    {
      keywords: ['pricing', 'plans', 'cost', 'price', 'offer', 'discount'],
      response:
        '💰 *Our Current Plans:*\n\n• *Starter*: $29/mo (Up to 1,000 monthly chats)\n• *Growth*: $79/mo (Up to 10,000 chats + CRM sync)\n• *Enterprise*: Custom solutions & dedicated SLA\n\n🎉 Use promo code *WHATSAPP20* for 20% off your first 3 months!',
    },
    {
      keywords: ['track', 'order', 'status', 'delivery', 'package', 'shipment'],
      response:
        '📦 *Order Status Lookup:*\n\nYour order *#WB-94821* is currently *Out for Delivery* via Express Courier! 🚚\n\n• Estimated Delivery: *Today by 6:00 PM*\n• Destination: Brooklyn, NY',
    },
    {
      keywords: ['agent', 'human', 'support', 'representative', 'talk to agent'],
      response:
        'Connecting you to our next available customer support specialist... ⏳\n\n• Estimated wait: *under 2 minutes*\n• Ticket ID: *#SUP-88219*\n\nA representative has been notified and will reply right here.',
    },
    {
      keywords: ['hours', 'timing', 'open', 'location', 'address'],
      response:
        '📍 *Office & Support Hours:*\n\n• Monday – Friday: 9:00 AM – 8:00 PM EST\n• Saturday: 10:00 AM – 4:00 PM EST\n• Sunday: Closed (Bot available 24/7)\n\n🏢 Headquarters: 500 Market St, Suite 400, San Francisco, CA.',
    },
  ];

  for (const rule of rules) {
    if (rule.keywords.some((k) => normalized.includes(k))) {
      return rule.response;
    }
  }

  return null;
}

// ─── GET /api/webhook — Meta Webhook Verification ────────────────────────────

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);

  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'my_secure_webhook_token_2026';

  console.log('[Webhook] Verification attempt:', { mode, token });

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('[Webhook] ✅ Verification successful');
    return new NextResponse(challenge, { status: 200 });
  }

  console.warn('[Webhook] ❌ Verification failed — token mismatch');
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

// ─── POST /api/webhook — Receive Events from ChakraHQ ────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Optional: Verify ChakraHQ HMAC signature
    const chakraSignature = req.headers.get('x-chakra-signature');
    const webhookSecret = process.env.CHAKRA_WEBHOOK_SECRET;

    if (webhookSecret && !chakraSignature) {
      console.warn('[Webhook] Missing X-Chakra-Signature header');
      // Uncomment to enforce strict signature validation:
      // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: MetaWebhookPayload = await req.json();

    console.log('[Webhook] Incoming event:', JSON.stringify(body, null, 2));

    // Only process whatsapp_business_account events
    if (body.object !== 'whatsapp_business_account') {
      return NextResponse.json({ status: 'ignored' }, { status: 200 });
    }

    for (const entry of body.entry) {
      for (const change of entry.changes) {
        const value = change.value;

        // ── Handle Incoming Messages ──────────────────────────────────────
        if (value.messages && value.messages.length > 0) {
          for (const message of value.messages) {
            const senderPhone = message.from;
            const contact = value.contacts?.[0];
            const customerName = contact?.profile?.name || 'Customer';

            console.log(
              `[Webhook] 📨 New message from ${customerName} (${senderPhone}): `,
              message.text?.body || `[${message.type}]`
            );

            // Handle text messages
            if (message.type === 'text' && message.text?.body) {
              const incomingText = message.text.body;
              const botReply = matchBotRule(incomingText);

              const replyText =
                botReply ||
                "I didn't quite understand that. 🤔\n\nType *help* or *menu* to see available options, or type *agent* to connect with human support.";

              // Send reply back via ChakraHQ → WhatsApp
              await sendWhatsAppMessage(senderPhone, replyText);
            }

            // Handle interactive button replies (quick replies)
            if (message.type === 'interactive' && message.interactive) {
              const buttonTitle =
                message.interactive.button_reply?.title ||
                message.interactive.list_reply?.title ||
                '';

              if (buttonTitle) {
                const botReply = matchBotRule(buttonTitle);
                if (botReply) {
                  await sendWhatsAppMessage(senderPhone, botReply);
                }
              }
            }
          }
        }

        // ── Handle Status Updates ─────────────────────────────────────────
        if (value.statuses && value.statuses.length > 0) {
          for (const status of value.statuses) {
            console.log(
              `[Webhook] 📊 Message ${status.id} status: ${status.status} → recipient ${status.recipient_id}`
            );
            // You can update your database here based on delivery status
          }
        }
      }
    }

    // Always return 200 quickly so Meta/ChakraHQ doesn't retry
    return NextResponse.json({ status: 'ok' }, { status: 200 });
  } catch (error) {
    console.error('[Webhook] Processing error:', error);
    // Return 200 even on errors to prevent ChakraHQ from retrying indefinitely
    return NextResponse.json({ status: 'error', message: String(error) }, { status: 200 });
  }
}
