/**
 * ChakraHQ <-> WhatsApp Cloud API Webhook Handler
 * Powered by Google Gemini AI Engine & Official ChakraHQ Delivery Gateway
 */

import { NextRequest, NextResponse } from 'next/server';

// ─── Constants ────────────────────────────────────────────────────────────────

const CHAKRA_PLUGIN_ID = process.env.CHAKRA_PLUGIN_ID || '837dc97a-d006-48fa-9a5f-8cc092a71a56';
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || '1334685153051584';

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
  event?: string;
  payload?: {
    message?: {
      from?: string;
      text?: { body?: string } | string;
      type?: string;
    };
    contacts?: Array<{ profile?: { name?: string }; wa_id?: string }>;
  };
  from?: string;
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

// ─── Helper: Generate AI Response via Google Gemini ───────────────────────────

async function generateGeminiReply(userPrompt: string): Promise<string | null> {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) return null;

  try {
    const systemPrompt = `You are an intelligent, polite, and helpful WhatsApp Assistant for our business.
Keep your replies concise, friendly, and formatted nicely for WhatsApp (use *bold* and bullet points if appropriate).
Max length: 2 short paragraphs. If the user asks for human support, tell them they can type "agent" anytime.`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nCustomer Message: ${userPrompt}` }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 250,
          },
        }),
      }
    );

    if (!res.ok) {
      console.warn('[Gemini] API returned error:', await res.text());
      return null;
    }

    const data = await res.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return reply ? reply.trim() : null;
  } catch (err) {
    console.error('[Gemini] Request failed:', err);
    return null;
  }
}

// ─── Helper: Send Outbound WhatsApp Message via Official ChakraHQ Endpoint ────

async function sendWhatsAppMessage(to: string, body: string): Promise<boolean> {
  const chakraApiKey = process.env.CHAKRA_API_KEY;
  const cleanPhone = to.replace(/\D/g, '');

  if (chakraApiKey) {
    try {
      const url = `https://api.chakrahq.com/v1/ext/plugin/whatsapp/${CHAKRA_PLUGIN_ID}/api/v22.0/${WHATSAPP_PHONE_ID}/messages`;
      console.log(`[Webhook] Dispatching reply via ChakraHQ to ${cleanPhone}...`);

      const chakraRes = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${chakraApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: cleanPhone,
          type: 'text',
          text: { body },
        }),
      });

      if (chakraRes.ok) {
        const data = await chakraRes.json();
        console.log(`[Webhook] ✅ Message successfully sent via ChakraHQ to ${cleanPhone}! ID:`, data?._data?.whatsappMessageId);
        return true;
      }

      const errText = await chakraRes.text();
      console.warn(`[Webhook] ChakraHQ Gateway response ${chakraRes.status}: ${errText}`);
    } catch (err) {
      console.error('[Webhook] ChakraHQ Gateway request error:', err);
    }
  }

  return false;
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
        'Here are our most popular services:\n\n1️⃣ *Product Catalog*\n2️⃣ *Track Existing Order*\n3️⃣ *Pricing & Discounts*\n4️⃣ *Business Inquiries*\n5️⃣ *Live Human Support*\n\nReply with any keyword or ask me any question!',
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

// ─── GET /api/webhook — Verification ──────────────────────────────────────────

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);

  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'my_secure_webhook_token_2026';

  if (mode === 'subscribe' && token === verifyToken) {
    return new NextResponse(challenge, { status: 200 });
  }

  if (searchParams.get('health') === 'true') {
    return NextResponse.json({ status: 'ok', service: 'whatsapp-bot-webhook' }, { status: 200 });
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

// ─── POST /api/webhook — Process Inbound Messages ─────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const rawBody = await req.json();
    const body = rawBody as WebhookPayload;

    // ── CASE 1: Meta Cloud API Format (Pass-through webhook) ──────────────────
    if (body.object === 'whatsapp_business_account' && Array.isArray(body.entry)) {
      for (const entry of body.entry) {
        for (const change of entry.changes || []) {
          const value = change.value;
          if (!value) continue;

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

                let botReply = matchBotRule(incomingText);
                if (!botReply) {
                  console.log(`[Webhook] 🤖 Invoking Gemini AI for query: "${incomingText}"`);
                  const aiReply = await generateGeminiReply(incomingText);
                  botReply =
                    aiReply ||
                    "I didn't quite understand that. 🤔\n\nType *help* or *menu* to see available options, or type *agent* to connect with human support.";
                }

                await sendWhatsAppMessage(senderPhone, botReply);
              }
            }
          }
        }
      }
      return NextResponse.json({ status: 'ok' }, { status: 200 });
    }

    // ── CASE 2: ChakraHQ Native Event Format ──────────────────────────────────
    const chakraSender =
      body.payload?.message?.from ||
      body.message?.from ||
      body.from ||
      body.phone ||
      body.senderPhone;

    let chakraText = '';
    if (typeof body.payload?.message?.text === 'string') {
      chakraText = body.payload.message.text;
    } else if (body.payload?.message?.text?.body) {
      chakraText = body.payload.message.text.body;
    } else if (typeof body.message?.text === 'string') {
      chakraText = body.message.text;
    } else if (body.message?.text?.body) {
      chakraText = body.message.text.body;
    } else if (typeof body.text === 'string') {
      chakraText = body.text;
    } else if (body.text?.body) {
      chakraText = body.text.body;
    }

    if (chakraSender && chakraText) {
      console.log(`[Webhook] 📨 ChakraHQ Native Event from ${chakraSender}: "${chakraText}"`);

      let botReply = matchBotRule(chakraText);
      if (!botReply) {
        console.log(`[Webhook] 🤖 Invoking Gemini AI for query: "${chakraText}"`);
        const aiReply = await generateGeminiReply(chakraText);
        botReply =
          aiReply ||
          "I didn't quite understand that. 🤔\n\nType *help* or *menu* to see available options, or type *agent* to connect with human support.";
      }

      await sendWhatsAppMessage(chakraSender, botReply);
      return NextResponse.json({ status: 'ok', handled: 'chakra_native' }, { status: 200 });
    }

    return NextResponse.json({ status: 'ok', message: 'Event acknowledged' }, { status: 200 });
  } catch (error) {
    console.error('[Webhook] Processing error:', error);
    return NextResponse.json({ status: 'error', error: String(error) }, { status: 200 });
  }
}
