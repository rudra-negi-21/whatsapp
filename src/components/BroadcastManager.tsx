'use client';

import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  Send,
  Users,
  CheckCircle,
  Eye,
  CheckCheck,
} from 'lucide-react';
import { BroadcastCampaign } from '../types/whatsapp';

interface BroadcastManagerProps {
  campaigns: BroadcastCampaign[];
  onSendCampaign: (campaign: Omit<BroadcastCampaign, 'id' | 'createdAt' | 'sentCount' | 'deliveredCount' | 'readCount'>) => void;
}

export default function BroadcastManager({
  campaigns,
  onSendCampaign,
}: BroadcastManagerProps) {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [templateName, setTemplateName] = useState('summer_promo_v2');
  const [targetAudience, setTargetAudience] = useState('all');
  const [customCount, setCustomCount] = useState(500);

  const templates = [
    {
      id: 'summer_promo_v2',
      name: 'Summer Promo & Discount (Marketing)',
      body: 'Hi {{1}}, our Summer Flash Sale has arrived! ☀️ Enjoy up to 30% OFF everything with code SUMMER30. Valid until Sunday.',
    },
    {
      id: 'abandoned_cart_reminder',
      name: 'Abandoned Cart Recovery (Utility)',
      body: 'Hello {{1}}, you left items in your shopping cart! 🛒 Complete your order today and get free express shipping.',
    },
    {
      id: 'order_update_template',
      name: 'Shipment & Order Status (Transactional)',
      body: 'Good news {{1}}! Your order #{{2}} has been dispatched and is currently on its way. Track live with link: {{3}}.',
    },
    {
      id: 'satisfaction_survey',
      name: 'Customer Feedback Survey (Service)',
      body: 'Hi {{1}}, thank you for shopping with us! How was your experience? Reply 1 for Great, 2 for Good, 3 for Needs Improvement.',
    },
  ];

  const selectedTemplate =
    templates.find((t) => t.id === templateName) || templates[0];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const count = Math.max(1, Number(customCount) || 500);

    onSendCampaign({
      name: name.trim(),
      templateName,
      targetCount: count,
      status: 'sending',
    });

    setName('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-emerald-500" />
            WhatsApp Broadcasts & Campaigns
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Send template messages and notifications to targeted customer segments
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow transition"
        >
          <Plus className="w-4 h-4" />
          New Broadcast
        </button>
      </div>

      {/* Campaigns Table / Cards */}
      <div className="grid grid-cols-1 gap-4">
        {campaigns.map((camp) => {
          const deliveryRate =
            camp.sentCount > 0
              ? Math.round((camp.deliveredCount / camp.sentCount) * 100)
              : 0;
          const readRate =
            camp.deliveredCount > 0
              ? Math.round((camp.readCount / camp.deliveredCount) * 100)
              : 0;

          return (
            <div
              key={camp.id}
              className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                      {camp.name}
                    </h3>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                        camp.status === 'completed'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                      }`}
                    >
                      {camp.status}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5 font-mono">
                    Template: {camp.templateName} • Created {camp.createdAt}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="text-right">
                    <div className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1 justify-end">
                      <Users className="w-3.5 h-3.5 text-zinc-400" />
                      {camp.targetCount.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-zinc-400">Target Contacts</div>
                  </div>
                </div>
              </div>

              {/* Progress & Stat Columns */}
              <div className="grid grid-cols-3 gap-3 bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg text-xs">
                <div>
                  <div className="flex items-center gap-1 text-zinc-500 mb-1">
                    <Send className="w-3.5 h-3.5 text-blue-500" />
                    <span>Sent</span>
                  </div>
                  <div className="font-bold text-zinc-900 dark:text-zinc-100">
                    {camp.sentCount.toLocaleString()}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1 text-zinc-500 mb-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Delivered ({deliveryRate}%)</span>
                  </div>
                  <div className="font-bold text-zinc-900 dark:text-zinc-100">
                    {camp.deliveredCount.toLocaleString()}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1 text-zinc-500 mb-1">
                    <Eye className="w-3.5 h-3.5 text-[#53bdeb]" />
                    <span>Read ({readRate}%)</span>
                  </div>
                  <div className="font-bold text-zinc-900 dark:text-zinc-100">
                    {camp.readCount.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Broadcast Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              Create & Send Broadcast Campaign
            </h3>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">
                  Campaign Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Weekend Flash Sale"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">
                  Meta Approved Template
                </label>
                <select
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Template Preview */}
              <div>
                <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">
                  Template Body Preview
                </label>
                <div className="bg-[#E7FFDB] dark:bg-[#005c4b] text-zinc-900 dark:text-zinc-100 p-3 rounded-lg border border-emerald-300/40 text-xs leading-relaxed">
                  {selectedTemplate.body}
                  <div className="flex justify-end text-[10px] text-zinc-400 mt-1">
                    <CheckCheck className="w-3 h-3 text-[#53bdeb]" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">
                    Target Segment
                  </label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="all">All Contacts</option>
                    <option value="active">Active in Last 30 Days</option>
                    <option value="buyers">Previous Buyers</option>
                    <option value="leads">Unconverted Leads</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">
                    Recipients Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={customCount}
                    onChange={(e) => setCustomCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Launch Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
