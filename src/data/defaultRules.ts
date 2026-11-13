import {
  BotRule,
  BotSettings,
  ChatMessage,
  WebhookLog,
} from '../types/whatsapp';

export const DEFAULT_BOT_SETTINGS: BotSettings = {
  botName: 'WhatsApp Smart Assistant',
  phoneNumber: '+1 (555) 019-2834',
  wabaId: 'waba_948271039581023',
  phoneNumberId: 'phone_284719284710293',
  verifyToken: 'my_secure_webhook_token_2026',
  permanentToken: 'EAAG...whatsapp_cloud_api_token',
  simulatedLatencyMs: 650,
  defaultFallbackReply:
    "I didn't quite understand that. 🤔\n\nType *help* or *menu* to see available options, or type *agent* to connect with human support.",
};

export const DEFAULT_BOT_RULES: BotRule[] = [
  {
    id: 'rule-welcome',
    title: 'Welcome & Greeting',
    keywords: ['hi', 'hello', 'hey', 'start', 'good morning', 'namaste'],
    matchType: 'contains',
    responseText:
      'Hello there! 👋 Welcome to our WhatsApp Assistant.\n\nI can help you explore services, check order statuses, or connect with our support team.\n\nHow can I help you today?',
    quickReplies: ['View Services 📋', 'Track Order 📦', 'Talk to Agent 👤'],
    active: true,
    triggerCount: 342,
    category: 'onboarding',
  },
  {
    id: 'rule-menu',
    title: 'Main Services Menu',
    keywords: ['menu', 'services', 'view services', 'options', 'help'],
    matchType: 'contains',
    responseText:
      'Here are our most popular services:\n\n1️⃣ *Product Catalog*\n2️⃣ *Track Existing Order*\n3️⃣ *Pricing & Discounts*\n4️⃣ *Business Inquiries*\n5️⃣ *Live Human Support*\n\nTap a quick reply or reply with the keyword!',
    quickReplies: ['Product Catalog', 'Pricing & Discounts', 'Live Support'],
    active: true,
    triggerCount: 289,
    category: 'general',
  },
  {
    id: 'rule-pricing',
    title: 'Pricing & Special Offers',
    keywords: ['pricing', 'plans', 'cost', 'discount', 'price', 'offer'],
    matchType: 'contains',
    responseText:
      '💰 *Our Current Plans:*\n\n• *Starter*: $29/mo (Up to 1,000 monthly chats)\n• *Growth*: $79/mo (Up to 10,000 chats + CRM sync)\n• *Enterprise*: Custom solutions & dedicated SLA\n\n🎉 *Special Offer*: Use promo code *WHATSAPP20* for 20% off your first 3 months!',
    quickReplies: ['Start Free Trial 🚀', 'Contact Sales 📞'],
    active: true,
    triggerCount: 198,
    category: 'sales',
  },
  {
    id: 'rule-tracking',
    title: 'Order Status & Tracking',
    keywords: ['track', 'order', 'status', 'shipment', 'delivery', 'package'],
    matchType: 'contains',
    responseText:
      '📦 *Order Status Lookup:*\n\nYour order *#WB-94821* is currently *Out for Delivery* via Express Courier! 🚚\n\n• Estimated Delivery: *Today by 6:00 PM*\n• Driver: Alex M. (+1 555-0144)\n• Destination: Brooklyn, NY',
    quickReplies: ['Change Delivery Time', 'Contact Courier'],
    active: true,
    triggerCount: 154,
    category: 'support',
  },
  {
    id: 'rule-agent',
    title: 'Live Human Handoff',
    keywords: ['agent', 'human', 'representative', 'support', 'live support', 'talk to agent'],
    matchType: 'contains',
    responseText:
      'Connecting you to our next available customer support specialist... ⏳\n\n• Estimated wait: *under 2 minutes*\n• Ticket ID: *#SUP-88219*\n\nA representative has been notified and will reply right here.',
    quickReplies: ['Cancel Request', 'Leave Voice Note'],
    active: true,
    triggerCount: 87,
    category: 'support',
  },
  {
    id: 'rule-hours',
    title: 'Business Hours & Location',
    keywords: ['hours', 'timing', 'time', 'open', 'location', 'address', 'store'],
    matchType: 'contains',
    responseText:
      '📍 *Office & Support Hours:*\n\n• Monday – Friday: 9:00 AM – 8:00 PM EST\n• Saturday: 10:00 AM – 4:00 PM EST\n• Sunday: Closed (Bot available 24/7)\n\n🏢 Headquarters: 500 Market St, Suite 400, San Francisco, CA.',
    quickReplies: ['Main Menu', 'Send Email'],
    active: true,
    triggerCount: 63,
    category: 'general',
  },
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'user',
    text: 'Hello!',
    timestamp: '10:30 AM',
    status: 'read',
  },
  {
    id: 'msg-2',
    sender: 'bot',
    text: 'Hello there! 👋 Welcome to our WhatsApp Assistant.\n\nI can help you explore services, check order statuses, or connect with our support team.\n\nHow can I help you today?',
    timestamp: '10:30 AM',
    status: 'read',
    buttons: ['View Services 📋', 'Track Order 📦', 'Talk to Agent 👤'],
  },
];

export const SAMPLE_WEBHOOK_LOGS: WebhookLog[] = [
  {
    id: 'wh-1',
    timestamp: 'Just now',
    event: 'messages',
    senderPhone: '+1 (555) 382-9104',
    status: 'success',
    payload: {
      object: 'whatsapp_business_account',
      entry: [
        {
          id: 'waba_948271039581023',
          changes: [
            {
              value: {
                messaging_product: 'whatsapp',
                metadata: {
                  display_phone_number: '15550192834',
                  phone_number_id: '284719284710293',
                },
                contacts: [{ profile: { name: 'Customer' }, wa_id: '15553829104' }],
                messages: [
                  {
                    from: '15553829104',
                    id: 'wamid.HBgLMTU1NTM4MjkxMDQVAgASGBQzQUJDMUQyRTNGNEc1SDZJ',
                    timestamp: '1782638492',
                    text: { body: 'What are your pricing plans?' },
                    type: 'text',
                  },
                ],
              },
              field: 'messages',
            },
          ],
        },
      ],
    },
  },
  {
    id: 'wh-2',
    timestamp: '2 mins ago',
    event: 'message_status',
    senderPhone: '+1 (555) 382-9104',
    status: 'success',
    payload: {
      object: 'whatsapp_business_account',
      entry: [
        {
          id: 'waba_948271039581023',
          changes: [
            {
              value: {
                messaging_product: 'whatsapp',
                statuses: [
                  {
                    id: 'wamid.HBgLMTU1NTM4MjkxMDQVAgASGBQzQUJDMUQyRTNGNEc1SDZJ',
                    status: 'read',
                    timestamp: '1782638510',
                    recipient_id: '15553829104',
                  },
                ],
              },
              field: 'messages',
            },
          ],
        },
      ],
    },
  },
  {
    id: 'wh-3',
    timestamp: '5 mins ago',
    event: 'verification',
    status: 'success',
    payload: {
      status: 'verified',
      mode: 'subscribe',
      challenge: '1158201492',
    },
  },
];
