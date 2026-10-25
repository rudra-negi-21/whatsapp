'use client';

import React, { useState } from 'react';
import {
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Play,
  Trash2,
  Edit2,
  Tag,
  Zap,
} from 'lucide-react';
import { BotRule, MatchType, RuleCategory } from '../types/whatsapp';

interface RuleManagerProps {
  rules: BotRule[];
  onAddRule: (rule: Omit<BotRule, 'id' | 'triggerCount'>) => void;
  onUpdateRule: (id: string, updated: Partial<BotRule>) => void;
  onDeleteRule: (id: string) => void;
  onTestRule: (keyword: string) => void;
}

export default function RuleManager({
  rules,
  onAddRule,
  onUpdateRule,
  onDeleteRule,
  onTestRule,
}: RuleManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRule, setEditingRule] = useState<BotRule | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [keywordsText, setKeywordsText] = useState('');
  const [matchType, setMatchType] = useState<MatchType>('contains');
  const [responseText, setResponseText] = useState('');
  const [quickRepliesText, setQuickRepliesText] = useState('');
  const [category, setCategory] = useState<RuleCategory>('general');

  const filteredRules = rules.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.keywords.some((k) => k.toLowerCase().includes(searchTerm.toLowerCase())) ||
      r.responseText.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat =
      selectedCategory === 'all' || r.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const openAddModal = () => {
    setEditingRule(null);
    setTitle('');
    setKeywordsText('');
    setMatchType('contains');
    setResponseText('');
    setQuickRepliesText('');
    setCategory('general');
    setShowAddModal(true);
  };

  const openEditModal = (rule: BotRule) => {
    setEditingRule(rule);
    setTitle(rule.title);
    setKeywordsText(rule.keywords.join(', '));
    setMatchType(rule.matchType);
    setResponseText(rule.responseText);
    setQuickRepliesText(rule.quickReplies ? rule.quickReplies.join(', ') : '');
    setCategory(rule.category);
    setShowAddModal(true);
  };

  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !keywordsText.trim() || !responseText.trim()) return;

    const keywords = keywordsText
      .split(',')
      .map((k) => k.trim().toLowerCase())
      .filter((k) => k.length > 0);

    if (keywords.length === 0) {
      alert('Please provide at least one valid keyword.');
      return;
    }

    const quickReplies = quickRepliesText
      .split(',')
      .map((q) => q.trim())
      .filter(Boolean);

    if (editingRule) {
      onUpdateRule(editingRule.id, {
        title: title.trim(),
        keywords,
        matchType,
        responseText: responseText.trim(),
        quickReplies: quickReplies.length > 0 ? quickReplies : undefined,
        category,
      });
    } else {
      onAddRule({
        title: title.trim(),
        keywords,
        matchType,
        responseText: responseText.trim(),
        quickReplies: quickReplies.length > 0 ? quickReplies : undefined,
        active: true,
        category,
      });
    }

    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-500" />
            Automated Keyword Rules
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Configure triggers and bot responses for user queries
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow transition"
        >
          <Plus className="w-4 h-4" />
          Create New Rule
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search keywords, titles, or replies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['all', 'onboarding', 'general', 'sales', 'support'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-lg capitalize font-medium transition ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRules.map((rule) => (
          <div
            key={rule.id}
            className={`p-5 rounded-xl border transition bg-white dark:bg-zinc-900 shadow-xs flex flex-col justify-between ${
              rule.active
                ? 'border-zinc-200 dark:border-zinc-800 hover:border-emerald-300 dark:hover:border-emerald-800'
                : 'border-zinc-200 dark:border-zinc-800 opacity-60 bg-zinc-50 dark:bg-zinc-950'
            }`}
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <div>
                  <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                    {rule.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                      {rule.category}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      match: {rule.matchType}
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
                      🔥 {rule.triggerCount} hits
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onUpdateRule(rule.id, { active: !rule.active })}
                    title={rule.active ? 'Rule is Active' : 'Rule is Disabled'}
                    className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                  >
                    {rule.active ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-zinc-400" />
                    )}
                  </button>
                  <button
                    onClick={() => openEditModal(rule)}
                    className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition"
                    title="Edit Rule"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteRule(rule.id)}
                    className="p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500 transition"
                    title="Delete Rule"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Keywords Tag List */}
              <div className="flex flex-wrap gap-1.5 my-3">
                {rule.keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 text-[11px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-800/40"
                  >
                    <Tag className="w-2.5 h-2.5" />
                    {kw}
                  </span>
                ))}
              </div>

              {/* Reply Preview */}
              <div className="bg-zinc-50 dark:bg-zinc-800/60 p-3 rounded-lg text-xs text-zinc-700 dark:text-zinc-300 font-sans whitespace-pre-wrap line-clamp-4 border border-zinc-100 dark:border-zinc-800">
                {rule.responseText}
              </div>

              {/* Quick Replies if available */}
              {rule.quickReplies && rule.quickReplies.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2.5">
                  {rule.quickReplies.map((qr, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-zinc-200/70 dark:bg-zinc-700/60 text-zinc-700 dark:text-zinc-300 px-2 py-0.5 rounded-full"
                    >
                      {qr}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Test Trigger Button */}
            <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
              {rule.keywords && rule.keywords.length > 0 && rule.keywords[0]?.trim() ? (
                <button
                  type="button"
                  onClick={() => onTestRule(rule.keywords[0].trim())}
                  className={`text-xs font-semibold flex items-center gap-1 transition ${
                    rule.active
                      ? 'text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300'
                      : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-600'
                  }`}
                  title={rule.active ? 'Test this rule in simulator' : 'Rule is currently disabled'}
                >
                  <Play className="w-3.5 h-3.5" />
                  Test in Simulator (&ldquo;{rule.keywords[0].trim()}&rdquo;)
                  {!rule.active && <span className="text-[10px] text-amber-500 ml-1">(Disabled)</span>}
                </button>
              ) : (
                <span className="text-[11px] text-zinc-400 italic">No keyword set</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredRules.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <p className="text-zinc-500 text-sm">No rules match your search.</p>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              {editingRule ? 'Edit Bot Rule' : 'Create New Bot Rule'}
            </h3>

            <form onSubmit={handleSaveRule} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">
                  Rule Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Return Policy"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as RuleCategory)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="general">General</option>
                    <option value="onboarding">Onboarding</option>
                    <option value="sales">Sales</option>
                    <option value="support">Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">
                    Matching Strategy
                  </label>
                  <select
                    value={matchType}
                    onChange={(e) => setMatchType(e.target.value as MatchType)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="contains">Contains Keyword</option>
                    <option value="exact">Exact Match</option>
                    <option value="regex">Regular Expression</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">
                  Trigger Keywords (Comma separated)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. return, exchange, refund, policy"
                  value={keywordsText}
                  onChange={(e) => setKeywordsText(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">
                  WhatsApp Bot Reply Text (Supports Markdown *bold*, _italic_)
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Enter the automated response message..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">
                  Quick Reply Action Buttons (Optional, comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Start Return, Talk to Agent"
                  value={quickRepliesText}
                  onChange={(e) => setQuickRepliesText(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold"
                >
                  Save Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
