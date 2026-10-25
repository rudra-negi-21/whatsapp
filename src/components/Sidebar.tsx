'use client';

import React from 'react';
import {
  MessageSquare,
  Zap,
  Activity,
  Megaphone,
  Terminal,
  Settings,
  Bot,
  Radio,
  Users,
  Layers,
} from 'lucide-react';

export type ActiveTab =
  | 'simulator'
  | 'rules'
  | 'chakra-inbox'
  | 'chakra-gateway'
  | 'analytics'
  | 'broadcast'
  | 'logs'
  | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  ruleCount: number;
  openChatCount?: number;
}

export default function Sidebar({
  activeTab,
  onTabChange,
  ruleCount,
  openChatCount = 3,
}: SidebarProps) {
  const navItems = [
    {
      id: 'simulator' as ActiveTab,
      label: 'Chat Simulator',
      icon: MessageSquare,
      badge: 'Live',
    },
    {
      id: 'rules' as ActiveTab,
      label: 'Bot Rules & Flows',
      icon: Zap,
      badge: `${ruleCount}`,
    },
    {
      id: 'chakra-inbox' as ActiveTab,
      label: 'Chakra Team Inbox',
      icon: Users,
      badge: `${openChatCount}`,
    },
    {
      id: 'chakra-gateway' as ActiveTab,
      label: 'ChakraHQ Gateway',
      icon: Layers,
      badge: 'Coexist',
    },
    {
      id: 'analytics' as ActiveTab,
      label: 'Analytics & Traffic',
      icon: Activity,
    },
    {
      id: 'broadcast' as ActiveTab,
      label: 'Broadcast Campaigns',
      icon: Megaphone,
    },
    {
      id: 'logs' as ActiveTab,
      label: 'Webhook Inspector',
      icon: Terminal,
    },
    {
      id: 'settings' as ActiveTab,
      label: 'API & Settings',
      icon: Settings,
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col justify-between shrink-0 select-none">
      <div>
        {/* Brand / Logo */}
        <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 tracking-tight leading-none">
              WhatsApp Bot
            </h1>
            <span className="text-[11px] text-zinc-400 font-medium">
              Control & Simulator Hub
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-[#075E54] dark:text-[#25D366] font-semibold shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive
                        ? 'text-[#25D366]'
                        : 'text-zinc-400 group-hover:text-zinc-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                      isActive
                        ? 'bg-[#25D366] text-white'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Connection Status */}
      <div className="p-4 border-t border-zinc-100 dark:border-zinc-800">
        <div className="bg-zinc-50 dark:bg-zinc-800/60 rounded-xl p-3 border border-zinc-200/50 dark:border-zinc-700/50">
          <div className="flex items-center justify-between mb-1 text-xs">
            <span className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              Cloud API Engine
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
              READY
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 leading-tight">
            Webhook ready on port 3000
          </p>
        </div>
      </div>
    </aside>
  );
}
