import {
  BotRule,
  BotSettings,
  BroadcastCampaign,
  ChatMessage,
  WebhookLog,
  TeamAgent,
  TeamInboxConversation,
  CoexistenceConfig,
  ChakraApiKey,
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

export const DEFAULT_CAMPAIGNS: BroadcastCampaign[] = [
  {
    id: 'camp-1',
    name: 'Summer Flash Sale 2026',
    templateName: 'summer_promo_v2',
    targetCount: 1250,
    sentCount: 1250,
    deliveredCount: 1218,
    readCount: 1084,
    status: 'completed',
    createdAt: '2026-06-20',
  },
  {
    id: 'camp-2',
    name: 'Cart Recovery Broadcast',
    templateName: 'abandoned_cart_reminder',
    targetCount: 430,
    sentCount: 430,
    deliveredCount: 422,
    readCount: 395,
    status: 'completed',
    createdAt: '2026-06-24',
  },
  {
    id: 'camp-3',
    name: 'Product Update & Feature Announcement',
    templateName: 'new_feature_broadcast',
    targetCount: 2800,
    sentCount: 1400,
    deliveredCount: 1350,
    readCount: 920,
    status: 'sending',
    createdAt: '2026-06-27',
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
                contacts: [{ profile: { name: 'Sarah Jenkins' }, wa_id: '15553829104' }],
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

export const DEFAULT_TEAM_AGENTS: TeamAgent[] = [
  {
    id: 'agent-1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@company.com',
    avatar: 'SJ',
    role: 'supervisor',
    status: 'online',
  },
  {
    id: 'agent-2',
    name: 'Alex Rivera',
    email: 'alex.r@company.com',
    avatar: 'AR',
    role: 'agent',
    status: 'online',
  },
  {
    id: 'agent-3',
    name: 'David Kim',
    email: 'david.k@company.com',
    avatar: 'DK',
    role: 'agent',
    status: 'busy',
  },
  {
    id: 'agent-4',
    name: 'Elena Rostova',
    email: 'elena.r@company.com',
    avatar: 'ER',
    role: 'agent',
    status: 'offline',
  },
];

export const DEFAULT_COEXISTENCE_CONFIG: CoexistenceConfig = {
  isEnabled: true,
  routingMode: 'dual_delivery',
  mobileLinkedNumber: '+1 (555) 019-2834',
  lastSyncedAt: 'Just now (Continuous Sync)',
  activeSessions: 3,
  syncChatHistory: true,
};

export const DEFAULT_CHAKRA_API_KEYS: ChakraApiKey[] = [
  {
    id: 'key-1',
    name: 'Production Node Gateway',
    keyPrefix: 'chk_live_89b21f98...',
    role: 'Full Admin',
    createdAt: '2026-04-12',
    lastUsed: 'Just now',
    isActive: true,
  },
  {
    id: 'key-2',
    name: 'CRM Webhook Dispatcher',
    keyPrefix: 'chk_ops_41a87c12...',
    role: 'Operations',
    createdAt: '2026-05-01',
    lastUsed: '12 mins ago',
    isActive: true,
  },
  {
    id: 'key-3',
    name: 'Marketing Campaign Scheduler',
    keyPrefix: 'chk_mkt_33c90e55...',
    role: 'Marketing',
    createdAt: '2026-06-18',
    lastUsed: '2 days ago',
    isActive: true,
  },
];

export const DEFAULT_CANNED_RESPONSES = [
  {
    title: 'Warm Welcome',
    text: 'Hello! Thanks for reaching out. My name is {{agent_name}}, and I will be happy to assist you today.',
  },
  {
    title: 'Order Status Inquiry',
    text: 'I am pulling up your order in our system right now. Could you please confirm your shipping zip code?',
  },
  {
    title: 'Refund Processed',
    text: 'Great news! Your refund of {{amount}} has been processed and will appear on your statement in 2-3 business days.',
  },
  {
    title: 'Handoff to Specialist',
    text: 'I am transferring your request to our senior technical team. They will continue right here within 5 minutes.',
  },
];

export const DEFAULT_INBOX_CONVERSATIONS: TeamInboxConversation[] = [
  {
    id: 'conv-1',
    customerName: 'Marcus Vance',
    customerPhone: '+1 (555) 438-9201',
    customerAvatar: 'MV',
    assignedAgentId: 'agent-1',
    status: 'open',
    unreadCount: 1,
    tags: ['VIP Client', 'Order Issue', 'Coexistence'],
    coexistenceSynced: true,
    lastMessage: {
      text: 'Can you please check why my package #WB-94821 is delayed?',
      timestamp: '10:42 AM',
      sender: 'customer',
    },
    messages: [
      {
        id: 'm-1',
        sender: 'customer',
        text: 'Hi there, I placed an express order yesterday.',
        timestamp: '10:39 AM',
        status: 'read',
      },
      {
        id: 'm-2',
        sender: 'bot',
        text: 'Hello there! 👋 Welcome to our WhatsApp Assistant. How can I help you today?',
        timestamp: '10:39 AM',
        status: 'read',
      },
      {
        id: 'm-3',
        sender: 'customer',
        text: 'Can you please check why my package #WB-94821 is delayed?',
        timestamp: '10:42 AM',
        status: 'delivered',
      },
    ],
    notes: [
      {
        id: 'n-1',
        agentId: 'agent-1',
        agentName: 'Sarah Jenkins',
        text: 'Customer has spent over $1,200 this quarter. Priority handling required.',
        timestamp: '10:43 AM',
      },
    ],
  },
  {
    id: 'conv-2',
    customerName: 'Aisha Al-Mansoor',
    customerPhone: '+1 (555) 819-3372',
    customerAvatar: 'AM',
    assignedAgentId: 'agent-2',
    status: 'pending',
    unreadCount: 0,
    tags: ['Sales Inquiry', 'Enterprise'],
    coexistenceSynced: true,
    lastMessage: {
      text: 'I have sent the enterprise contract details to your email.',
      timestamp: '09:15 AM',
      sender: 'agent',
    },
    messages: [
      {
        id: 'm-21',
        sender: 'customer',
        text: 'We are looking for pricing on 50 seats for our support team.',
        timestamp: '08:55 AM',
        status: 'read',
      },
      {
        id: 'm-22',
        sender: 'agent',
        agentName: 'Alex Rivera',
        text: 'Hello Aisha! Our enterprise tier includes dedicated account management and custom SLA.',
        timestamp: '09:02 AM',
        status: 'read',
      },
      {
        id: 'm-23',
        sender: 'agent',
        agentName: 'Alex Rivera',
        text: 'I have sent the enterprise contract details to your email.',
        timestamp: '09:15 AM',
        status: 'delivered',
      },
    ],
    notes: [
      {
        id: 'n-2',
        agentId: 'agent-2',
        agentName: 'Alex Rivera',
        text: 'Waiting for procurement committee review tomorrow morning.',
        timestamp: '09:16 AM',
      },
    ],
  },
  {
    id: 'conv-3',
    customerName: 'Liam O’Connor',
    customerPhone: '+1 (555) 293-1184',
    customerAvatar: 'LO',
    assignedAgentId: undefined,
    status: 'open',
    unreadCount: 2,
    tags: ['Billing', 'Needs Handoff'],
    coexistenceSynced: false,
    lastMessage: {
      text: 'I was double charged on invoice #INV-2041. Please refund immediately.',
      timestamp: '11:05 AM',
      sender: 'customer',
    },
    messages: [
      {
        id: 'm-31',
        sender: 'customer',
        text: 'I was double charged on invoice #INV-2041. Please refund immediately.',
        timestamp: '11:05 AM',
        status: 'delivered',
      },
    ],
    notes: [],
  },
  {
    id: 'conv-4',
    customerName: 'Chloe Bennett',
    customerPhone: '+1 (555) 749-0023',
    customerAvatar: 'CB',
    assignedAgentId: 'agent-1',
    status: 'resolved',
    unreadCount: 0,
    tags: ['Resolved', 'Product FAQ'],
    coexistenceSynced: true,
    lastMessage: {
      text: 'Thank you Sarah, you have been super helpful!',
      timestamp: 'Yesterday',
      sender: 'customer',
    },
    messages: [
      {
        id: 'm-41',
        sender: 'customer',
        text: 'Do your waterproof cases fit the latest Pro model?',
        timestamp: 'Yesterday',
        status: 'read',
      },
      {
        id: 'm-42',
        sender: 'agent',
        agentName: 'Sarah Jenkins',
        text: 'Yes Chloe! All our 2026 cases are precision engineered for the latest Pro dimensions.',
        timestamp: 'Yesterday',
        status: 'read',
      },
      {
        id: 'm-43',
        sender: 'customer',
        text: 'Thank you Sarah, you have been super helpful!',
        timestamp: 'Yesterday',
        status: 'read',
      },
    ],
    notes: [
      {
        id: 'n-41',
        agentId: 'agent-1',
        agentName: 'Sarah Jenkins',
        text: 'Customer satisfied, closed ticket.',
        timestamp: 'Yesterday',
      },
    ],
  },
];
