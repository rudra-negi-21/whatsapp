'use client';

import React, { useState, useEffect } from 'react';
import Sidebar, { ActiveTab } from '../components/Sidebar';
import Simulator from '../components/Simulator';
import RuleManager from '../components/RuleManager';
import WebhookLogs from '../components/WebhookLogs';
import SettingsView from '../components/SettingsView';

import {
  DEFAULT_BOT_RULES,
  DEFAULT_BOT_SETTINGS,
  INITIAL_CHAT_MESSAGES,
  SAMPLE_WEBHOOK_LOGS,
} from '../data/defaultRules';
import {
  BotRule,
  BotSettings,
  ChatMessage,
  WebhookLog,
} from '../types/whatsapp';

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('simulator');
  const [isLoaded, setIsLoaded] = useState(false);

  // Core application states
  const [rules, setRules] = useState<BotRule[]>(DEFAULT_BOT_RULES);
  const [settings, setSettings] = useState<BotSettings>(DEFAULT_BOT_SETTINGS);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [logs, setLogs] = useState<WebhookLog[]>(SAMPLE_WEBHOOK_LOGS);
  const [isTyping, setIsTyping] = useState(false);

  // Load from localStorage on mount
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
    } catch {
      // Ignore
    }
  }, [rules, settings, isLoaded]);

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

        // Increment trigger count
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

  const handleClearLogs = () => {
    setLogs([]);
  };

  const handleResetAllData = () => {
    try {
      localStorage.removeItem('wa_bot_rules');
      localStorage.removeItem('wa_bot_settings');
    } catch {
      // Ignore
    }
    setRules(DEFAULT_BOT_RULES);
    setSettings(DEFAULT_BOT_SETTINGS);
    setMessages(INITIAL_CHAT_MESSAGES);
    setLogs(SAMPLE_WEBHOOK_LOGS);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans antialiased">
      {/* Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        ruleCount={rules.length}
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
