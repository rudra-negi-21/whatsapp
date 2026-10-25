'use client';

import React, { useState } from 'react';
import {
  Terminal,
  CheckCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { WebhookLog } from '../types/whatsapp';

interface WebhookLogsProps {
  logs: WebhookLog[];
  onClearLogs: () => void;
}

export default function WebhookLogs({ logs, onClearLogs }: WebhookLogsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(logs[0]?.id || null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, payload: Record<string, unknown>) => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-500" />
            Live Webhook & Cloud API Logs
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Inspect raw incoming and outgoing WhatsApp Cloud API events
          </p>
        </div>

        <button
          onClick={onClearLogs}
          className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Clear Log History
        </button>
      </div>

      {/* Log Feed */}
      <div className="space-y-3">
        {logs.map((log) => {
          const isExpanded = expandedId === log.id;
          return (
            <div
              key={log.id}
              className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs overflow-hidden transition"
            >
              {/* Header row */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : log.id)}
                className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/40 select-none text-xs"
              >
                <div className="flex items-center gap-2.5">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-zinc-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-zinc-400" />
                  )}

                  <CheckCircle className="w-4 h-4 text-emerald-500" />

                  <span className="font-mono uppercase font-bold text-[11px] bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-700 dark:text-zinc-300">
                    {log.event}
                  </span>

                  {log.senderPhone && (
                    <span className="text-zinc-600 dark:text-zinc-400 font-mono text-[11px]">
                      From: {log.senderPhone}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-zinc-400">
                  <span className="text-[11px]">{log.timestamp}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(log.id, log.payload);
                    }}
                    className="p-1 hover:text-zinc-700 dark:hover:text-zinc-200 transition"
                    title="Copy Payload JSON"
                  >
                    {copiedId === log.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* JSON Payload viewer */}
              {isExpanded && (
                <div className="p-4 bg-zinc-950 text-emerald-400 font-mono text-[11px] overflow-x-auto border-t border-zinc-800">
                  <pre>{JSON.stringify(log.payload, null, 2)}</pre>
                </div>
              )}
            </div>
          );
        })}

        {logs.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-500 text-sm">No webhook logs available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
