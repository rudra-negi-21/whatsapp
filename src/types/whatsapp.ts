export type MessageSender = 'user' | 'bot';

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  buttons?: string[];
  listItems?: { title: string; description?: string }[];
  media?: {
    type: 'image' | 'document' | 'audio';
    url: string;
    caption?: string;
  };
  isAiGenerated?: boolean;
}

export type MatchType = 'exact' | 'contains' | 'regex';
export type RuleCategory = 'onboarding' | 'sales' | 'support' | 'general';

export interface BotRule {
  id: string;
  title: string;
  keywords: string[];
  matchType: MatchType;
  responseText: string;
  quickReplies?: string[];
  active: boolean;
  triggerCount: number;
  category: RuleCategory;
}

export interface AnalyticsMetric {
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
}

export interface KeywordStat {
  keyword: string;
  hits: number;
  category: RuleCategory;
}

export interface BroadcastCampaign {
  id: string;
  name: string;
  templateName: string;
  targetCount: number;
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  status: 'draft' | 'sending' | 'completed';
  createdAt: string;
}

export interface WebhookLog {
  id: string;
  timestamp: string;
  event: 'messages' | 'message_status' | 'verification';
  senderPhone?: string;
  payload: Record<string, unknown>;
  status: 'success' | 'warning' | 'error';
}

export interface BotSettings {
  botName: string;
  phoneNumber: string;
  wabaId: string;
  phoneNumberId: string;
  verifyToken: string;
  permanentToken: string;
  simulatedLatencyMs: number;
  defaultFallbackReply: string;
}

// ChakraHQ Suite Types
export interface TeamAgent {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'agent' | 'supervisor';
  status: 'online' | 'busy' | 'offline';
}

export interface InternalNote {
  id: string;
  agentId: string;
  agentName: string;
  text: string;
  timestamp: string;
}

export interface TeamInboxMessage {
  id: string;
  sender: 'customer' | 'bot' | 'agent';
  agentName?: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  isAiGenerated?: boolean;
}

export type ConversationStatus = 'open' | 'pending' | 'resolved';

export interface TeamInboxConversation {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAvatar?: string;
  assignedAgentId?: string;
  status: ConversationStatus;
  unreadCount: number;
  tags: string[];
  coexistenceSynced: boolean;
  lastMessage: {
    text: string;
    timestamp: string;
    sender: 'customer' | 'bot' | 'agent';
  };
  messages: TeamInboxMessage[];
  notes: InternalNote[];
}

export type CoexistenceRoutingMode = 'dual_delivery' | 'bot_first' | 'agent_first';

export interface CoexistenceConfig {
  isEnabled: boolean;
  routingMode: CoexistenceRoutingMode;
  mobileLinkedNumber: string;
  lastSyncedAt: string;
  activeSessions: number;
  syncChatHistory: boolean;
}

export interface ChakraApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  role: 'Full Admin' | 'Marketing' | 'Operations' | 'Read Only';
  createdAt: string;
  lastUsed: string;
  isActive: boolean;
}

export type AiProvider = 'gemini' | 'openai' | 'chakra_ai' | 'custom';

export interface AiConfig {
  enabled: boolean;
  provider: AiProvider;
  apiKey: string;
  model: string;
  temperature: number;
  systemPrompt: string;
  businessContext: string;
  useAiFallback: boolean;
}
