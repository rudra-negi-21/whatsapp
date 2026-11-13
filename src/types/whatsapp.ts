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

export type AiProvider = 'gemini' | 'openai' | 'custom';

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
