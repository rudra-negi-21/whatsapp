'use client';

import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Save,
  Check,
  Key,
  Sliders,
  Radio,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { BotSettings } from '../types/whatsapp';

interface SettingsViewProps {
  settings: BotSettings;
  onUpdateSettings: (newSettings: BotSettings) => void;
  onResetAllData?: () => void;
}

export default function SettingsView({
  settings,
  onUpdateSettings,
  onResetAllData,
}: SettingsViewProps) {
  const [formData, setFormData] = useState<BotSettings>(settings);
  const [prevSettings, setPrevSettings] = useState<BotSettings>(settings);
  const [isSaved, setIsSaved] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (settings !== prevSettings) {
    setPrevSettings(settings);
    setFormData(settings);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Settings className="w-5 h-5 text-emerald-500" />
          WhatsApp Bot & API Configuration
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Manage Meta Cloud API credentials, webhook verification, and bot behavior
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Status Card */}
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#25D366] text-white rounded-lg shadow-xs">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-emerald-900 dark:text-emerald-200">
                WhatsApp Cloud API Webhook: Active
              </h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">
                Simulator is listening for real-time messages and status updates
              </p>
            </div>
          </div>

          <a
            href="https://developers.facebook.com/docs/whatsapp/cloud-api"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold hover:underline flex items-center gap-1"
          >
            Meta Docs
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Credentials Form */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
          <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2 pb-2 border-b border-zinc-100 dark:border-zinc-800">
            <Key className="w-4 h-4 text-emerald-500" />
            Meta WhatsApp Cloud API Credentials
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">
                Bot Display Name
              </label>
              <input
                type="text"
                value={formData.botName}
                onChange={(e) =>
                  setFormData({ ...formData, botName: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">
                Display Phone Number
              </label>
              <input
                type="text"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">
                WhatsApp Business Account ID (WABA ID)
              </label>
              <input
                type="text"
                value={formData.wabaId}
                onChange={(e) =>
                  setFormData({ ...formData, wabaId: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">
                Phone Number ID
              </label>
              <input
                type="text"
                value={formData.phoneNumberId}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumberId: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">
                Webhook Verify Token
              </label>
              <input
                type="text"
                value={formData.verifyToken}
                onChange={(e) =>
                  setFormData({ ...formData, verifyToken: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">
                System User Permanent Access Token
              </label>
              <input
                type="password"
                value={formData.permanentToken}
                onChange={(e) =>
                  setFormData({ ...formData, permanentToken: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Simulation and Behavior Settings */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
          <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2 pb-2 border-b border-zinc-100 dark:border-zinc-800">
            <Sliders className="w-4 h-4 text-emerald-500" />
            Simulator & Response Behavior
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-zinc-700 dark:text-zinc-300 font-medium">
                  Simulated Typing Delay
                </label>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  {formData.simulatedLatencyMs} ms
                </span>
              </div>
              <input
                type="range"
                min="200"
                max="2500"
                step="50"
                value={formData.simulatedLatencyMs}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    simulatedLatencyMs: Number(e.target.value),
                  })
                }
                className="w-full accent-[#25D366]"
              />
            </div>

            <div>
              <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">
                Default Fallback Message (When no keyword rules match)
              </label>
              <textarea
                rows={3}
                value={formData.defaultFallbackReply}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    defaultFallbackReply: e.target.value,
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Settings saved automatically to local storage</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {onResetAllData && (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Defaults
              </button>
            )}

            <button
              type="submit"
              className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow transition"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  Settings Saved!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 text-xs">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              Reset All Bot Data?
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-5 leading-relaxed">
              This will restore default rules, settings, and campaigns. Custom rules will be reset to defaults.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowResetConfirm(false);
                  onResetAllData?.();
                }}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
