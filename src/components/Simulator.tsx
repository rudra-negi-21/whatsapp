'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  RotateCcw,
  CheckCheck,
  Bot,
  Paperclip,
  Smile,
  Phone,
  Video,
  MoreVertical,
  Zap,
} from 'lucide-react';
import { BotRule, BotSettings, ChatMessage } from '../types/whatsapp';

interface SimulatorProps {
  rules: BotRule[];
  settings: BotSettings;
  messages: ChatMessage[];
  onSendMessage: (userText: string) => void;
  onResetChat: () => void;
  isTyping: boolean;
}

export default function Simulator({
  rules,
  settings,
  messages,
  onSendMessage,
  onResetChat,
  isTyping,
}: SimulatorProps) {
  const [inputValue, setInputValue] = useState('');
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const showSimNotice = (msg: string) => {
    setNoticeMessage(msg);
    setTimeout(() => setNoticeMessage(null), 3000);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isTyping) return;
    const text = inputValue.trim();
    setInputValue('');
    onSendMessage(text);
  };

  const handleQuickPrompt = (prompt: string) => {
    if (isTyping) return;
    onSendMessage(prompt);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full max-w-6xl mx-auto">
      {/* WhatsApp Device Mockup */}
      <div className="flex-1 flex flex-col bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden min-h-[620px] max-h-[750px]">
        {/* WhatsApp Header */}
        <div className="bg-[#075E54] dark:bg-[#1f2c34] text-white px-4 py-3 flex items-center justify-between shadow-md select-none">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white font-bold shadow-inner">
                <Bot className="w-6 h-6" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#075E54] dark:border-[#1f2c34] rounded-full"></span>
            </div>
            <div>
              <h3 className="font-semibold text-sm tracking-wide flex items-center gap-1.5">
                {settings.botName}
                <span className="text-[10px] bg-emerald-700/60 px-1.5 py-0.5 rounded font-mono">
                  BOT
                </span>
              </h3>
              <p className="text-xs text-emerald-200">
                {isTyping ? 'typing...' : 'online'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-emerald-100">
            <button
              type="button"
              onClick={() => showSimNotice('Voice Call: This is an automated WhatsApp Bot.')}
              title="Voice Call (Simulated)"
              className="p-1.5 hover:bg-emerald-800/40 rounded-full transition"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => showSimNotice('Video Call: Video streams are handled by human agents.')}
              title="Video Call (Simulated)"
              className="p-1.5 hover:bg-emerald-800/40 rounded-full transition"
            >
              <Video className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onResetChat}
              title="Restart Conversation"
              className="p-1.5 hover:bg-emerald-800/40 rounded-full transition flex items-center gap-1 text-xs"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => showSimNotice(`Connected to: ${settings.phoneNumber}`)}
              className="p-1.5 hover:bg-emerald-800/40 rounded-full transition"
              title="More Options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {noticeMessage && (
          <div className="bg-emerald-800 text-white text-[11px] px-3 py-1.5 text-center transition-all animate-fade-in font-medium">
            🔔 {noticeMessage}
          </div>
        )}

        {/* WhatsApp Chat Body */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#EFEAE2] dark:bg-[#0b141a] transition-colors"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(0, 0, 0, 0.04) 1px, transparent 1px)',
            backgroundSize: '18px 18px',
          }}
        >
          {/* Security Banner */}
          <div className="flex justify-center my-2">
            <div className="bg-[#FFEECD] dark:bg-[#182229] text-[#54656F] dark:text-[#8696A0] text-[11px] px-3 py-1.5 rounded-lg shadow-xs text-center max-w-sm border border-amber-200/50 dark:border-zinc-700/50">
              🔒 Messages are end-to-end simulated via WhatsApp Cloud API Webhooks.
            </div>
          </div>

          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} transition-all`}
              >
                <div
                  className={`max-w-[82%] sm:max-w-[70%] rounded-lg px-3.5 py-2 text-sm shadow-xs relative leading-relaxed ${
                    isUser
                      ? 'bg-[#E7FFDB] dark:bg-[#005c4b] text-zinc-900 dark:text-zinc-100 rounded-tr-none'
                      : 'bg-white dark:bg-[#202c33] text-zinc-900 dark:text-zinc-100 rounded-tl-none border border-zinc-200/40 dark:border-zinc-700/30'
                  }`}
                >
                  {/* Message Content */}
                  <div className="whitespace-pre-wrap font-sans">{msg.text}</div>

                  {/* Message Timestamp & Status */}
                  <div
                    className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                      isUser
                        ? 'text-zinc-500 dark:text-emerald-200/80'
                        : 'text-zinc-400 dark:text-zinc-400'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {isUser && (
                      <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                    )}
                  </div>
                </div>

                {/* Interactive Action Buttons if attached */}
                {msg.buttons && msg.buttons.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1.5 max-w-[82%] sm:max-w-[70%]">
                    {msg.buttons.map((btn, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuickPrompt(btn)}
                        disabled={isTyping}
                        className="bg-white dark:bg-[#202c33] hover:bg-emerald-50 dark:hover:bg-[#005c4b]/50 text-[#075E54] dark:text-[#25D366] text-xs font-medium px-3 py-1.5 rounded-full shadow-xs border border-emerald-200 dark:border-emerald-800/40 transition disabled:opacity-50"
                      >
                        {btn}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator Bubble */}
          {isTyping && (
            <div className="flex items-start">
              <div className="bg-white dark:bg-[#202c33] rounded-lg rounded-tl-none px-4 py-2.5 shadow-xs border border-zinc-200/40 dark:border-zinc-700/30 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#F0F2F5] dark:bg-[#202c33] px-3 py-2.5 flex items-center gap-2 border-t border-zinc-200 dark:border-zinc-800"
        >
          <button
            type="button"
            className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-1.5"
            title="Emojis"
          >
            <Smile className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-1.5"
            title="Attach Document/Media"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message or trigger keyword..."
            disabled={isTyping}
            className="flex-1 bg-white dark:bg-[#2a3942] text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 text-sm px-4 py-2 rounded-lg outline-none focus:ring-1 focus:ring-[#25D366] transition disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="bg-[#25D366] hover:bg-[#20bd5a] text-white p-2.5 rounded-full transition shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Quick Testing & Triggers Panel */}
      <div className="w-full lg:w-80 flex flex-col gap-4">
        {/* Info Box */}
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm mb-2">
            <Zap className="w-4 h-4" />
            <span>Interactive Simulator</span>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Test how your WhatsApp Bot reacts to incoming messages and keywords in
            real time with instant simulated Cloud API payloads.
          </p>
        </div>

        {/* Quick Trigger Suggestions */}
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs flex-1">
          <h4 className="font-semibold text-xs text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-3 flex items-center justify-between">
            <span>Quick Test Prompts</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </h4>

          <div className="space-y-2">
            {[
              { text: 'Hi', label: 'Greeting Flow', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' },
              { text: 'Menu', label: 'Services Menu', color: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300' },
              { text: 'Pricing', label: 'Pricing Plans', color: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300' },
              { text: 'Track Order', label: 'Shipment Tracking', color: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300' },
              { text: 'Talk to Agent', label: 'Live Support Handoff', color: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300' },
              { text: 'Store Hours', label: 'Location & Timing', color: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300' },
              { text: 'Random unknown query', label: 'Fallback Response', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickPrompt(item.text)}
                disabled={isTyping}
                className="w-full flex items-center justify-between p-2 rounded-lg text-left text-xs border border-zinc-100 dark:border-zinc-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-xs transition group"
              >
                <div>
                  <div className="font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-[#25D366] transition">
                    &ldquo;{item.text}&rdquo;
                  </div>
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
                    {item.label}
                  </div>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${item.color}`}>
                  Send
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Active Rules Counter */}
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-xl p-3.5 flex items-center justify-between text-xs">
          <div>
            <div className="font-semibold text-emerald-900 dark:text-emerald-200">
              {rules.filter((r) => r.active).length} Rules Active
            </div>
            <div className="text-emerald-700 dark:text-emerald-400 text-[11px]">
              {settings.simulatedLatencyMs}ms response latency
            </div>
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
        </div>
      </div>
    </div>
  );
}
