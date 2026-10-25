/**
 * ChakraHQ <-> WhatsApp Cloud API Webhook Handler
 *
 * This API route connects your Next.js app to ChakraHQ.
 * Supports:
 * 1. Meta Webhook format (Pass-through webhook)
 * 2. ChakraHQ native event webhook format (Inbound Messages, Outbound Statuses)
 * 3. Two-way dispatch: ChakraHQ Gateway API or Meta Cloud Graph API
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
      messaging_product?: string;
      metadata?: {
        display_phone_number?: string;
        phone_number_id?: string;
      };
      contacts?: Array<{ profile: { name: string }; wa_id: string }>;
      messages?: MetaWebhookMessage[];
      statuses?: MetaWebhookStatus[];
    };
    field?: string;
  }>;
}

interface WebhookPayload {
  object?: string;
  entry?: MetaWebhookEntry[];
  // ChakraHQ Native Payload Support
  event?: string;
  from?: string;
  to?: string;
  phone?: string;
  senderPhone?: string;
  text?: string | { body?: string };
  message?: {
    id?: string;
    from?: string;
    text?: { body?: string } | string;
    type?: string;
  };
}

// ─── Helper: Send Outbound WhatsApp Message ───────────────────────────────────

async function sendWhatsAppMessage(to: string, body: string): Promise<boolean> {
  const chakraApiKey = process.env.CHAKRA_API_KEY;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const metaPermanentToken = process.env.WHATSAPP_PERMANENT_TOKEN;

  // Option 1: Send via ChakraHQ Gateway if API Key is configured
  if (chakraApiKey && !chakraApiKey.includes('your_real_key_here')) {
    try {
      console.log(`[Webhook] Dispatching reply via ChakraHQ Gateway to ${to}...`);
      const chakraRes = await fetch('https://api.chakrahq.com/v1/messages/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${chakraApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          type: 'text',
          text: { body },
          coexistence: { deliver_to_mobile_app: true },
        }),
      });

      if (chakraRes.ok) {
        console.log(`[Webhook] ✅ Message successfully sent via ChakraHQ Gateway to ${to}`);
        return true;
      }
      const chakraErr = await chakraRes.text();
      console.warn(`[Webhook] ChakraHQ Gateway returned ${chakraRes.status}: ${chakraErr}`);
    } catch (err) {
      console.error('[Webhook] ChakraHQ Gateway request error:', err);
    }
  }

  // Option 2: Direct Meta Graph API fallback if Meta token is provided
  if (metaPermanentToken && phoneNumberId && metaPermanentToken.startsWith('EAA')) {
    try {
      console.log(`[Webhook] Dispatching reply via Meta Graph API to ${to}...`);
      const metaRes = await fetch(
        `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${metaPermanentToken}`,
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

      if (metaRes.ok) {
        console.log(`[Webhook] ✅ Message successfully sent via Meta Graph API to ${to}`);
        return true;
      }
      const metaErr = await metaRes.text();
      console.error(`[Webhook] Meta Graph API returned ${metaRes.status}: ${metaErr}`);
    } catch (err) {
      console.error('[Webhook] Meta Graph API request error:', err);
    }
  }

  console.log(`[Webhook] ℹ️ Simulated reply generated for ${to}: "${body.substring(0, 40)}..." (Configure CHAKRA_API_KEY or WHATSAPP_PERMANENT_TOKEN to dispatch live)`);
  return true;
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

// ─── GET /api/webhook — Meta & Chakra Webhook Verification ─────────────────────

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);

  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'my_secure_webhook_token_2026';

  console.log('[Webhook] Verification attempt:', { mode, token });

  // Verification handshake match
  if (mode === 'subscribe' && token === verifyToken) {
    console.log('[Webhook] ✅ Verification successful');
    return new NextResponse(challenge, { status: 200 });
  }

  // Health check query fallback
  if (searchParams.get('health') === 'true') {
    return NextResponse.json({ status: 'ok', service: 'whatsapp-bot-webhook' }, { status: 200 });
  }

  console.warn('[Webhook] ❌ Verification failed — token mismatch');
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

// ─── POST /api/webhook — Receive Events from ChakraHQ / Meta ──────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const rawBody = await req.json();
    console.log('[Webhook] Incoming event payload:', JSON.stringify(rawBody, null, 2));

    const body = rawBody as WebhookPayload;

    // ── CASE 1: Meta Cloud API Format (Pass-through webhook) ──────────────────
    if (body.object === 'whatsapp_business_account' && Array.isArray(body.entry)) {
      for (const entry of body.entry) {
        for (const change of entry.changes || []) {
          const value = change.value;
          if (!value) continue;

          // Process inbound messages
          if (Array.isArray(value.messages)) {
            for (const message of value.messages) {
              const senderPhone = message.from;
              let incomingText = '';

              if (message.type === 'text' && message.text?.body) {
                incomingText = message.text.body;
              } else if (message.type === 'interactive' && message.interactive) {
                incomingText =
                  message.interactive.button_reply?.title ||
                  message.interactive.list_reply?.title ||
                  '';
              }

              if (incomingText && senderPhone) {
                console.log(`[Webhook] 📨 Received message from ${senderPhone}: "${incomingText}"`);
                const botReply =
                  matchBotRule(incomingText) ||
                  "I didn't quite understand that. 🤔\n\nType *help* or *menu* to see available options, or type *agent* to connect with human support.";

                await sendWhatsAppMessage(senderPhone, botReply);
              }
            }
          }

          // Process statuses
          if (Array.isArray(value.statuses)) {
            for (const status of value.statuses) {
              console.log(`[Webhook] 📊 Message status update: ${status.id} -> ${status.status}`);
            }
          }
        }
      }
      return NextResponse.json({ status: 'ok' }, { status: 200 });
    }

    // ── CASE 2: ChakraHQ Native Event Webhook Format ──────────────────────────
    const chakraSender =
      body.from ||
      body.phone ||
      body.senderPhone ||
      body.message?.from;

    let chakraText = '';
    if (typeof body.text === 'string') {
      chakraText = body.text;
    } else if (body.text?.body) {
      chakraText = body.text.body;
    } else if (typeof body.message?.text === 'string') {
      chakraText = body.message.text;
    } else if (body.message?.text?.body) {
      chakraText = body.message.text.body;
    }

    if (chakraSender && chakraText) {
      console.log(`[Webhook] 📨 ChakraHQ Native Event from ${chakraSender}: "${chakraText}"`);
      const botReply =
        matchBotRule(chakraText) ||
        "I didn't quite understand that. 🤔\n\nType *help* or *menu* to see available options, or type *agent* to connect with human support.";

      await sendWhatsAppMessage(chakraSender, botReply);
      return NextResponse.json({ status: 'ok', handled: 'chakra_native' }, { status: 200 });
    }

    // Acknowledge all other events
    return NextResponse.json({ status: 'ok', message: 'Event acknowledged' }, { status: 200 });
  } catch (error) {
    console.error('[Webhook] Processing error:', error);
    // Always respond 200 to webhook dispatchers to avoid retry floods
    return NextResponse.json({ status: 'error', error: String(error) }, { status: 200 });
  }
}
