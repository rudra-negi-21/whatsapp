'use client';

import React, { useState, useEffect } from 'react';
import Sidebar, { ActiveTab } from '../components/Sidebar';
import Simulator from '../components/Simulator';
import RuleManager from '../components/RuleManager';
import AnalyticsView from '../components/AnalyticsView';
import BroadcastManager from '../components/BroadcastManager';
import WebhookLogs from '../components/WebhookLogs';
import SettingsView from '../components/SettingsView';
import ChakraTeamInbox from '../components/ChakraTeamInbox';
import ChakraGateway from '../components/ChakraGateway';

import {
  DEFAULT_BOT_RULES,
  DEFAULT_BOT_SETTINGS,
  DEFAULT_CAMPAIGNS,
  INITIAL_CHAT_MESSAGES,
  SAMPLE_WEBHOOK_LOGS,
  DEFAULT_TEAM_AGENTS,
  DEFAULT_INBOX_CONVERSATIONS,
  DEFAULT_COEXISTENCE_CONFIG,
  DEFAULT_CHAKRA_API_KEYS,
} from '../data/defaultRules';
import {
  BotRule,
  BotSettings,
  BroadcastCampaign,
  ChatMessage,
  WebhookLog,
  TeamAgent,
  TeamInboxConversation,
  TeamInboxMessage,
  CoexistenceConfig,
  ChakraApiKey,
} from '../types/whatsapp';

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('simulator');
  const [isLoaded, setIsLoaded] = useState(false);

  // Core application states
  const [rules, setRules] = useState<BotRule[]>(DEFAULT_BOT_RULES);
  const [settings, setSettings] = useState<BotSettings>(DEFAULT_BOT_SETTINGS);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [campaigns, setCampaigns] = useState<BroadcastCampaign[]>(DEFAULT_CAMPAIGNS);
  const [logs, setLogs] = useState<WebhookLog[]>(SAMPLE_WEBHOOK_LOGS);
  const [isTyping, setIsTyping] = useState(false);

  // ChakraHQ Suite states
  const [conversations, setConversations] = useState<TeamInboxConversation[]>(DEFAULT_INBOX_CONVERSATIONS);
  const [agents] = useState<TeamAgent[]>(DEFAULT_TEAM_AGENTS);
  const [currentAgent] = useState<TeamAgent>(DEFAULT_TEAM_AGENTS[0]);
  const [coexistenceConfig, setCoexistenceConfig] = useState<CoexistenceConfig>(DEFAULT_COEXISTENCE_CONFIG);
  const [apiKeys, setApiKeys] = useState<ChakraApiKey[]>(DEFAULT_CHAKRA_API_KEYS);

  // Load from localStorage on mount (async to avoid cascading renders warning)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const savedRules = localStorage.getItem('wa_bot_rules');
        if (savedRules) {
          const parsed = JSON.parse(savedRules);
          if (Array.isArray(parsed)) {
            setRules(
              parsed.map((r) => ({
                id: r.id || `rule-${Date.now()}-${Math.random()}`,
                title: r.title || 'Untitled Rule',
                keywords: Array.isArray(r.keywords)
                  ? r.keywords.map(String).map((k: string) => k.trim()).filter(Boolean)
                  : [],
                matchType: ['exact', 'contains', 'regex'].includes(r.matchType)
                  ? r.matchType
                  : 'contains',
                responseText: r.responseText || '',
                quickReplies: Array.isArray(r.quickReplies) ? r.quickReplies : undefined,
                active: typeof r.active === 'boolean' ? r.active : true,
                triggerCount:
                  typeof r.triggerCount === 'number' && !isNaN(r.triggerCount)
                    ? r.triggerCount
                    : 0,
                category: ['onboarding', 'sales', 'support', 'general'].includes(r.category)
                  ? r.category
                  : 'general',
              }))
            );
          }
        }

        const savedSettings = localStorage.getItem('wa_bot_settings');
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          if (parsed && typeof parsed === 'object') {
            setSettings({
              ...DEFAULT_BOT_SETTINGS,
              ...parsed,
              simulatedLatencyMs:
                typeof parsed.simulatedLatencyMs === 'number' && !isNaN(parsed.simulatedLatencyMs)
                  ? parsed.simulatedLatencyMs
                  : DEFAULT_BOT_SETTINGS.simulatedLatencyMs,
            });
          }
        }

        const savedCampaigns = localStorage.getItem('wa_bot_campaigns');
        if (savedCampaigns) {
          const parsed = JSON.parse(savedCampaigns);
          if (Array.isArray(parsed)) {
            setCampaigns(parsed);
          }
        }

        const savedConversations = localStorage.getItem('wa_chakra_conversations');
        if (savedConversations) {
          const parsed = JSON.parse(savedConversations);
          if (Array.isArray(parsed)) {
            setConversations(parsed);
          }
        }

        const savedCoexistence = localStorage.getItem('wa_chakra_coexistence');
        if (savedCoexistence) {
          const parsed = JSON.parse(savedCoexistence);
          if (parsed && typeof parsed === 'object') {
            setCoexistenceConfig(parsed);
          }
        }

        const savedApiKeys = localStorage.getItem('wa_chakra_api_keys');
        if (savedApiKeys) {
          const parsed = JSON.parse(savedApiKeys);
          if (Array.isArray(parsed)) {
            setApiKeys(parsed);
          }
        }
      } catch {
        // Ignore fallback if storage is restricted or corrupted
      }
      setIsLoaded(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('wa_bot_rules', JSON.stringify(rules));
      localStorage.setItem('wa_bot_settings', JSON.stringify(settings));
      localStorage.setItem('wa_bot_campaigns', JSON.stringify(campaigns));
      localStorage.setItem('wa_chakra_conversations', JSON.stringify(conversations));
      localStorage.setItem('wa_chakra_coexistence', JSON.stringify(coexistenceConfig));
      localStorage.setItem('wa_chakra_api_keys', JSON.stringify(apiKeys));
    } catch {
      // Ignore
    }
  }, [rules, settings, campaigns, conversations, coexistenceConfig, apiKeys, isLoaded]);

  const getCurrentTimeString = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Chat message submission handler
  const handleSendMessage = (userText: string) => {
    if (!userText || typeof userText !== 'string' || !userText.trim()) {
      return;
    }

    const trimmedUserText = userText.trim();
    const time = getCurrentTimeString();
    const userMsgId = `usr-${Date.now()}`;

    // 1. Add user message
    const newMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: trimmedUserText,
      timestamp: time,
      status: 'read',
    };

    setMessages((prev) => [...prev, newMsg]);

    // 2. Generate simulated WhatsApp Cloud API webhook log
    const incomingWebhook: WebhookLog = {
      id: `wh-${Date.now()}`,
      timestamp: 'Just now',
      event: 'messages',
      senderPhone: '+1 (555) 382-9104',
      status: 'success',
      payload: {
        object: 'whatsapp_business_account',
        entry: [
          {
            id: settings.wabaId,
            changes: [
              {
                value: {
                  messaging_product: 'whatsapp',
                  metadata: {
                    display_phone_number: settings.phoneNumber.replace(/\D/g, ''),
                    phone_number_id: settings.phoneNumberId,
                  },
                  contacts: [{ profile: { name: 'Customer' }, wa_id: '15553829104' }],
                  messages: [
                    {
                      from: '15553829104',
                      id: `wamid.${userMsgId}`,
                      timestamp: Math.floor(Date.now() / 1000).toString(),
                      text: { body: trimmedUserText },
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
    };

    setLogs((prev) => [incomingWebhook, ...prev.slice(0, 19)]);
    setIsTyping(true);

    // 3. Find matching bot rule
    const normalizedInput = trimmedUserText.toLowerCase();
    const matchedRule = rules.find((r) => {
      if (!r.active) return false;
      const validKeywords = (r.keywords || [])
        .map((k) => k.trim().toLowerCase())
        .filter((k) => k.length > 0);

      if (validKeywords.length === 0) return false;

      if (r.matchType === 'exact') {
        return validKeywords.some((k) => k === normalizedInput);
      }
      if (r.matchType === 'contains') {
        return validKeywords.some((k) => normalizedInput.includes(k));
      }
      if (r.matchType === 'regex') {
        try {
          return validKeywords.some((k) => new RegExp(k, 'i').test(normalizedInput));
        } catch {
          return false;
        }
      }
      return false;
    });

    // 4. Trigger bot response after simulated latency
    setTimeout(() => {
      let botResponseText = settings.defaultFallbackReply;
      let quickReplies: string[] | undefined = undefined;

      if (matchedRule) {
        botResponseText = matchedRule.responseText;
        quickReplies = matchedRule.quickReplies;

        // Increment trigger count for analytics
        setRules((prevRules) =>
          prevRules.map((r) =>
            r.id === matchedRule.id
              ? { ...r, triggerCount: r.triggerCount + 1 }
              : r
          )
        );
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botResponseText,
        timestamp: getCurrentTimeString(),
        status: 'read',
        buttons: quickReplies,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);

      // Add delivery status log
      const statusWebhook: WebhookLog = {
        id: `wh-stat-${Date.now()}`,
        timestamp: 'Just now',
        event: 'message_status',
        senderPhone: '+1 (555) 382-9104',
        status: 'success',
        payload: {
          object: 'whatsapp_business_account',
          entry: [
            {
              id: settings.wabaId,
              changes: [
                {
                  value: {
                    messaging_product: 'whatsapp',
                    statuses: [
                      {
                        id: `wamid.bot_${Date.now()}`,
                        status: 'delivered',
                        timestamp: Math.floor(Date.now() / 1000).toString(),
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
      };

      setLogs((prev) => [statusWebhook, ...prev.slice(0, 19)]);
    }, settings.simulatedLatencyMs);
  };

  const handleResetChat = () => {
    setMessages(INITIAL_CHAT_MESSAGES);
  };

  const handleTestRule = (keyword: string) => {
    if (!keyword || typeof keyword !== 'string' || !keyword.trim()) return;
    setActiveTab('simulator');
    setTimeout(() => {
      handleSendMessage(keyword.trim());
    }, 150);
  };

  const handleAddRule = (newRuleData: Omit<BotRule, 'id' | 'triggerCount'>) => {
    const newRule: BotRule = {
      ...newRuleData,
      id: `rule-${Date.now()}`,
      triggerCount: 0,
    };
    setRules((prev) => [newRule, ...prev]);
  };

  const handleUpdateRule = (id: string, updated: Partial<BotRule>) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updated } : r))
    );
  };

  const handleDeleteRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const handleSendCampaign = (
    campaignData: Omit<
      BroadcastCampaign,
      'id' | 'createdAt' | 'sentCount' | 'deliveredCount' | 'readCount'
    >
  ) => {
    const newCamp: BroadcastCampaign = {
      ...campaignData,
      id: `camp-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      sentCount: campaignData.targetCount,
      deliveredCount: Math.round(campaignData.targetCount * 0.97),
      readCount: Math.round(campaignData.targetCount * 0.86),
      status: 'completed',
    };
    setCampaigns((prev) => [newCamp, ...prev]);

    // Simulated broadcast webhook dispatch event
    const broadcastWebhook: WebhookLog = {
      id: `wh-bcast-${Date.now()}`,
      timestamp: 'Just now',
      event: 'messages',
      senderPhone: settings.phoneNumber,
      status: 'success',
      payload: {
        object: 'whatsapp_business_account',
        entry: [
          {
            id: settings.wabaId,
            changes: [
              {
                value: {
                  messaging_product: 'whatsapp',
                  template: {
                    name: campaignData.templateName,
                    language: { code: 'en_US' },
                  },
                  broadcast_campaign: {
                    name: campaignData.name,
                    target_recipients: campaignData.targetCount,
                    delivered: Math.round(campaignData.targetCount * 0.97),
                    status: 'completed',
                  },
                },
                field: 'messages',
              },
            ],
          },
        ],
      },
    };
    setLogs((prev) => [broadcastWebhook, ...prev.slice(0, 19)]);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  const handleResetAllData = () => {
    try {
      localStorage.removeItem('wa_bot_rules');
      localStorage.removeItem('wa_bot_settings');
      localStorage.removeItem('wa_bot_campaigns');
      localStorage.removeItem('wa_chakra_conversations');
      localStorage.removeItem('wa_chakra_coexistence');
      localStorage.removeItem('wa_chakra_api_keys');
    } catch {
      // Ignore
    }
    setRules(DEFAULT_BOT_RULES);
    setSettings(DEFAULT_BOT_SETTINGS);
    setCampaigns(DEFAULT_CAMPAIGNS);
    setMessages(INITIAL_CHAT_MESSAGES);
    setLogs(SAMPLE_WEBHOOK_LOGS);
    setConversations(DEFAULT_INBOX_CONVERSATIONS);
    setCoexistenceConfig(DEFAULT_COEXISTENCE_CONFIG);
    setApiKeys(DEFAULT_CHAKRA_API_KEYS);
  };

  // ChakraHQ Suite Handlers
  const handleUpdateConversation = (updated: TeamInboxConversation) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
  };

  const handleSendTeamMessage = (
    conversationId: string,
    text: string,
    sender: 'agent'
  ) => {
    const time = getCurrentTimeString();
    const newMsg: TeamInboxMessage = {
      id: `tm-${Date.now()}`,
      sender,
      agentName: currentAgent.name,
      text,
      timestamp: time,
      status: 'sent',
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== conversationId) return c;
        return {
          ...c,
          messages: [...c.messages, newMsg],
          lastMessage: {
            text,
            timestamp: time,
            sender,
          },
        };
      })
    );

    // Simulated webhook log for Chakra Coexistence sync
    const agentWebhook: WebhookLog = {
      id: `wh-agent-${Date.now()}`,
      timestamp: 'Just now',
      event: 'messages',
      senderPhone: settings.phoneNumber,
      status: 'success',
      payload: {
        object: 'whatsapp_business_account',
        entry: [
          {
            id: settings.wabaId,
            changes: [
              {
                value: {
                  messaging_product: 'whatsapp',
                  chakra_coexistence: {
                    event: 'agent_reply_dispatched',
                    agent: currentAgent.name,
                    synced_to_mobile: coexistenceConfig.isEnabled,
                    routing_mode: coexistenceConfig.routingMode,
                  },
                  messages: [
                    {
                      id: `wamid.agent_${Date.now()}`,
                      timestamp: Math.floor(Date.now() / 1000).toString(),
                      text: { body: text },
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
    };
    setLogs((prev) => [agentWebhook, ...prev.slice(0, 19)]);
  };

  const handleAddNote = (conversationId: string, noteText: string) => {
    const time = getCurrentTimeString();
    const newNote = {
      id: `note-${Date.now()}`,
      agentId: currentAgent.id,
      agentName: currentAgent.name,
      text: noteText,
      timestamp: time,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== conversationId) return c;
        return {
          ...c,
          notes: [...c.notes, newNote],
        };
      })
    );
  };

  const handleAddApiKey = (
    newKeyData: Omit<ChakraApiKey, 'id' | 'createdAt' | 'lastUsed'>
  ) => {
    const newKey: ChakraApiKey = {
      ...newKeyData,
      id: `key-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
    };
    setApiKeys((prev) => [newKey, ...prev]);
  };

  const handleDeleteApiKey = (id: string) => {
    setApiKeys((prev) => prev.filter((k) => k.id !== id));
  };

  const openChatCount = conversations.filter((c) => c.status !== 'resolved').length;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans antialiased">
      {/* Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        ruleCount={rules.length}
        openChatCount={openChatCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-screen">
        {activeTab === 'simulator' && (
          <Simulator
            rules={rules}
            settings={settings}
            messages={messages}
            onSendMessage={handleSendMessage}
            onResetChat={handleResetChat}
            isTyping={isTyping}
          />
        )}

        {activeTab === 'rules' && (
          <RuleManager
            rules={rules}
            onAddRule={handleAddRule}
            onUpdateRule={handleUpdateRule}
            onDeleteRule={handleDeleteRule}
            onTestRule={handleTestRule}
          />
        )}

        {activeTab === 'chakra-inbox' && (
          <ChakraTeamInbox
            conversations={conversations}
            agents={agents}
            currentAgent={currentAgent}
            onUpdateConversation={handleUpdateConversation}
            onSendMessage={handleSendTeamMessage}
            onAddNote={handleAddNote}
          />
        )}

        {activeTab === 'chakra-gateway' && (
          <ChakraGateway
            coexistenceConfig={coexistenceConfig}
            onUpdateCoexistence={setCoexistenceConfig}
            apiKeys={apiKeys}
            onAddApiKey={handleAddApiKey}
            onDeleteApiKey={handleDeleteApiKey}
          />
        )}

        {activeTab === 'analytics' && <AnalyticsView rules={rules} />}

        {activeTab === 'broadcast' && (
          <BroadcastManager
            campaigns={campaigns}
            onSendCampaign={handleSendCampaign}
          />
        )}

        {activeTab === 'logs' && (
          <WebhookLogs logs={logs} onClearLogs={handleClearLogs} />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            onUpdateSettings={setSettings}
            onResetAllData={handleResetAllData}
          />
        )}
      </main>
    </div>
  );
}
