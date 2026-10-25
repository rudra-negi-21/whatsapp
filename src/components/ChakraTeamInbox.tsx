'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  Send,
  CheckCheck,
  Check,
  Smartphone,
  Tag,
  StickyNote,
  Sparkles,
  Bot,
  User,
  Plus,
  Radio,
} from 'lucide-react';
import {
  TeamAgent,
  TeamInboxConversation,
  ConversationStatus,
} from '../types/whatsapp';
import { DEFAULT_CANNED_RESPONSES } from '../data/defaultRules';

interface ChakraTeamInboxProps {
  conversations: TeamInboxConversation[];
  agents: TeamAgent[];
  currentAgent: TeamAgent;
  onUpdateConversation: (updated: TeamInboxConversation) => void;
  onSendMessage: (conversationId: string, text: string, sender: 'agent') => void;
  onAddNote: (conversationId: string, noteText: string) => void;
}

export default function ChakraTeamInbox({
  conversations,
  agents,
  currentAgent,
  onUpdateConversation,
  onSendMessage,
  onAddNote,
}: ChakraTeamInboxProps) {
  const [selectedConvId, setSelectedConvId] = useState<string>(
    conversations[0]?.id || ''
  );
  const [filterTab, setFilterTab] = useState<'all' | 'mine' | 'unassigned' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [isNoteMode, setIsNoteMode] = useState(false);
  const [showCannedPicker, setShowCannedPicker] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');

  const selectedConv =
    conversations.find((c) => c.id === selectedConvId) || conversations[0];

  // Filtering conversations
  const filteredConversations = conversations.filter((c) => {
    const matchesSearch =
      c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.customerPhone.includes(searchQuery) ||
      c.lastMessage.text.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterTab === 'mine') {
      return c.assignedAgentId === currentAgent.id && c.status !== 'resolved';
    }
    if (filterTab === 'unassigned') {
      return !c.assignedAgentId && c.status !== 'resolved';
    }
    if (filterTab === 'resolved') {
      return c.status === 'resolved';
    }
    return c.status !== 'resolved'; // 'all' displays all active
  });

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageInput.trim() || !selectedConv) return;

    if (isNoteMode) {
      onAddNote(selectedConv.id, messageInput.trim());
      setMessageInput('');
      setIsNoteMode(false);
    } else {
      onSendMessage(selectedConv.id, messageInput.trim(), 'agent');
      setMessageInput('');
    }
  };

  const handleStatusChange = (status: ConversationStatus) => {
    if (!selectedConv) return;
    onUpdateConversation({
      ...selectedConv,
      status,
    });
  };

  const handleAssignAgent = (agentId: string) => {
    if (!selectedConv) return;
    onUpdateConversation({
      ...selectedConv,
      assignedAgentId: agentId === 'unassigned' ? undefined : agentId,
    });
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagInput.trim() || !selectedConv) return;
    const tag = newTagInput.trim();
    if (!selectedConv.tags.includes(tag)) {
      onUpdateConversation({
        ...selectedConv,
        tags: [...selectedConv.tags, tag],
      });
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!selectedConv) return;
    onUpdateConversation({
      ...selectedConv,
      tags: selectedConv.tags.filter((t) => t !== tagToRemove),
    });
  };

  const insertCannedResponse = (text: string) => {
    const personalized = text
      .replace('{{agent_name}}', currentAgent.name)
      .replace('{{amount}}', '$49.99');
    setMessageInput(personalized);
    setShowCannedPicker(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] max-w-7xl mx-auto space-y-4">
      {/* Chakra Header Banner */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                ChakraHQ Shared Team Inbox
              </h2>
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-300/40">
                Coexistence Active
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Multi-agent collaboration workspace with seamless WhatsApp Business mobile app sync
            </p>
          </div>
        </div>

        {/* Current Active Agent Status */}
        <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-800/60 px-3 py-1.5 rounded-xl border border-zinc-200/60 dark:border-zinc-700/60 text-xs">
          <div className="relative">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
              {currentAgent.avatar}
            </div>
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-white dark:border-zinc-900"></span>
          </div>
          <div>
            <div className="font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
              {currentAgent.name}
            </div>
            <div className="text-[10px] text-zinc-500 capitalize">{currentAgent.role} • Online</div>
          </div>
        </div>
      </div>

      {/* 3-Column Main Workspace */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 overflow-hidden min-h-[580px]">
        {/* Column 1: Conversations List (3.5 cols) */}
        <div className="md:col-span-4 lg:col-span-3.5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col shadow-xs overflow-hidden">
          {/* Search & Tabs */}
          <div className="p-3 border-b border-zinc-100 dark:border-zinc-800 space-y-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search chats, contacts, messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 text-xs">
              {[
                { id: 'all', label: 'All Open' },
                { id: 'mine', label: 'Mine' },
                { id: 'unassigned', label: 'Unassigned' },
                { id: 'resolved', label: 'Resolved' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterTab(tab.id as typeof filterTab)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition text-[11px] whitespace-nowrap ${
                    filterTab === tab.id
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Conversations Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800">
            {filteredConversations.map((conv) => {
              const isSelected = selectedConv?.id === conv.id;
              const assignedAgent = agents.find((a) => a.id === conv.assignedAgentId);

              return (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConvId(conv.id)}
                  className={`p-3 cursor-pointer transition flex items-start gap-3 select-none ${
                    isSelected
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-l-4 border-emerald-500'
                      : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                  }`}
                >
                  {/* Customer Avatar */}
                  <div className="relative shrink-0">
                    <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-200 font-bold text-xs">
                      {conv.customerAvatar || conv.customerName.slice(0, 2).toUpperCase()}
                    </div>
                    {conv.coexistenceSynced && (
                      <span
                        title="Synced via WhatsApp Coexistence"
                        className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-900 text-white"
                      >
                        <Smartphone className="w-2 h-2" />
                      </span>
                    )}
                  </div>

                  {/* Conversation Meta */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 truncate">
                        {conv.customerName}
                      </h4>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {conv.lastMessage.timestamp}
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mb-1.5">
                      {conv.lastMessage.sender === 'bot' && (
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium mr-1">
                          [Bot]
                        </span>
                      )}
                      {conv.lastMessage.sender === 'agent' && (
                        <span className="text-blue-600 dark:text-blue-400 font-medium mr-1">
                          [Agent]
                        </span>
                      )}
                      {conv.lastMessage.text}
                    </p>

                    <div className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5">
                        {assignedAgent ? (
                          <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-1.5 py-0.5 rounded font-medium">
                            {assignedAgent.name.split(' ')[0]}
                          </span>
                        ) : (
                          <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded font-medium">
                            Unassigned
                          </span>
                        )}

                        {conv.notes.length > 0 && (
                          <span className="text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                            <StickyNote className="w-2.5 h-2.5" />
                            {conv.notes.length}
                          </span>
                        )}
                      </div>

                      {conv.unreadCount > 0 && (
                        <span className="bg-[#25D366] text-white font-bold px-1.5 py-0.2 rounded-full text-[9px]">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredConversations.length === 0 && (
              <div className="p-8 text-center text-zinc-400 text-xs">
                No conversations match this view.
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Active Chat Thread (5.5 cols) */}
        <div className="md:col-span-5 lg:col-span-5.5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col shadow-xs overflow-hidden">
          {selectedConv ? (
            <>
              {/* Chat Thread Header */}
              <div className="p-3.5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/60 dark:bg-zinc-800/40">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-xs">
                    {selectedConv.customerAvatar || selectedConv.customerName.slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                      {selectedConv.customerName}
                      <span className="text-[10px] font-mono text-zinc-400 font-normal">
                        {selectedConv.customerPhone}
                      </span>
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <Smartphone className="w-3 h-3" />
                        Coexistence Linked
                      </span>
                      <span>•</span>
                      <span className="capitalize">{selectedConv.status} Ticket</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleStatusChange(
                        selectedConv.status === 'resolved' ? 'open' : 'resolved'
                      )
                    }
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                      selectedConv.status === 'resolved'
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                        : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    }`}
                  >
                    <Check className="w-3 h-3" />
                    {selectedConv.status === 'resolved' ? 'Reopen Ticket' : 'Resolve'}
                  </button>
                </div>
              </div>

              {/* Message Feed Body */}
              <div
                className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f0f2f5]/40 dark:bg-[#0b141a]/60"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, rgba(0, 0, 0, 0.03) 1px, transparent 1px)',
                  backgroundSize: '16px 16px',
                }}
              >
                {/* Coexistence Header Tag */}
                <div className="flex justify-center my-1">
                  <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-[10px] px-3 py-1 rounded-full shadow-xs flex items-center gap-1.5 font-medium">
                    <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
                    ChakraHQ Coexistence: Messages sync to official WhatsApp Business App
                  </div>
                </div>

                {selectedConv.messages.map((m) => {
                  const isCustomer = m.sender === 'customer';
                  const isBot = m.sender === 'bot';
                  const isAgent = m.sender === 'agent';

                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'}`}
                    >
                      <div
                        className={`max-w-[78%] rounded-xl px-3.5 py-2 text-xs shadow-xs relative leading-relaxed ${
                          isCustomer
                            ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-tl-none border border-zinc-200/50 dark:border-zinc-700/50'
                            : isAgent
                            ? 'bg-blue-600 text-white rounded-tr-none'
                            : 'bg-emerald-600 text-white rounded-tr-none'
                        }`}
                      >
                        {/* Header badge if agent or bot */}
                        {(isAgent || isBot) && (
                          <div className="flex items-center gap-1 text-[9px] opacity-80 mb-0.5 font-semibold uppercase tracking-wider">
                            {isAgent ? (
                              <>
                                <User className="w-2.5 h-2.5" />
                                {m.agentName || currentAgent.name}
                              </>
                            ) : (
                              <>
                                <Bot className="w-2.5 h-2.5" />
                                Automated Bot
                              </>
                            )}
                          </div>
                        )}

                        <div className="whitespace-pre-wrap">{m.text}</div>

                        <div
                          className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                            isCustomer ? 'text-zinc-400' : 'text-blue-100/80'
                          }`}
                        >
                          <span>{m.timestamp}</span>
                          {!isCustomer && <CheckCheck className="w-3 h-3 text-cyan-200" />}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Display Internal Notes within thread */}
                {selectedConv.notes.map((note) => (
                  <div key={note.id} className="flex justify-center my-2">
                    <div className="bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 rounded-xl p-2.5 max-w-sm text-xs shadow-xs">
                      <div className="flex items-center justify-between text-[10px] text-amber-700 dark:text-amber-300 font-semibold mb-1">
                        <span className="flex items-center gap-1">
                          <StickyNote className="w-3 h-3 text-amber-600" />
                          Internal Note from {note.agentName}
                        </span>
                        <span className="font-mono text-zinc-400">{note.timestamp}</span>
                      </div>
                      <p className="text-zinc-800 dark:text-zinc-200 text-[11px] leading-relaxed">
                        {note.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Composer & Mode Switcher */}
              <div className="border-t border-zinc-200 dark:border-zinc-800 p-3 bg-white dark:bg-zinc-900 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  {/* Mode Selector */}
                  <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setIsNoteMode(false)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                        !isNoteMode
                          ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                          : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                      }`}
                    >
                      Reply to Customer
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsNoteMode(true)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition flex items-center gap-1 ${
                        isNoteMode
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                      }`}
                    >
                      <StickyNote className="w-3 h-3" />
                      Internal Note
                    </button>
                  </div>

                  {/* Canned Responses */}
                  <button
                    type="button"
                    onClick={() => setShowCannedPicker(!showCannedPicker)}
                    className="text-emerald-600 dark:text-emerald-400 hover:underline text-[11px] font-medium flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Canned Responses
                  </button>
                </div>

                {/* Canned Responses Quick Picker Menu */}
                {showCannedPicker && (
                  <div className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-2.5 rounded-xl space-y-1.5 shadow-sm">
                    <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-1">
                      Insert Pre-Approved Canned Response
                    </div>
                    {DEFAULT_CANNED_RESPONSES.map((cr, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => insertCannedResponse(cr.text)}
                        className="w-full text-left p-1.5 hover:bg-white dark:hover:bg-zinc-700 rounded text-xs flex justify-between items-center transition"
                      >
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                          {cr.title}
                        </span>
                        <span className="text-[10px] text-zinc-400 truncate max-w-xs ml-2">
                          {cr.text}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Input Form */}
                <form onSubmit={handleSend} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder={
                      isNoteMode
                        ? 'Type an internal team note (hidden from customer)...'
                        : 'Reply as human agent (syncs to mobile WhatsApp)...'
                    }
                    className={`flex-1 text-xs px-3.5 py-2 rounded-xl outline-none transition border ${
                      isNoteMode
                        ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800 focus:ring-1 focus:ring-amber-500'
                        : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-1 focus:ring-blue-500'
                    }`}
                  />

                  <button
                    type="submit"
                    disabled={!messageInput.trim()}
                    className={`p-2.5 rounded-xl text-white transition shadow disabled:opacity-50 ${
                      isNoteMode
                        ? 'bg-amber-500 hover:bg-amber-600'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-zinc-400 text-xs">
              Select a conversation to view chat history.
            </div>
          )}
        </div>

        {/* Column 3: Customer Details & Coexistence Control (3 cols) */}
        <div className="md:col-span-3 lg:col-span-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 flex flex-col justify-between shadow-xs overflow-y-auto space-y-4">
          {selectedConv ? (
            <>
              <div className="space-y-4 text-xs">
                {/* Customer Profile Card */}
                <div>
                  <div className="flex items-center gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                      {selectedConv.customerAvatar || selectedConv.customerName.slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                        {selectedConv.customerName}
                      </h4>
                      <div className="text-zinc-500 font-mono text-[11px]">
                        {selectedConv.customerPhone}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ChakraHQ Coexistence Badge Card */}
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 p-3 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-semibold text-xs">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp Coexistence</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 leading-tight">
                    This phone contact is simultaneously synchronized with your official WhatsApp
                    Business mobile application.
                  </p>
                  <div className="text-[10px] text-emerald-900 dark:text-emerald-300 font-mono pt-1">
                    Status: Dual Delivery Active
                  </div>
                </div>

                {/* Agent Assignment Selector */}
                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">
                    Assigned Human Agent
                  </label>
                  <select
                    value={selectedConv.assignedAgentId || 'unassigned'}
                    onChange={(e) => handleAssignAgent(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="unassigned">-- Unassigned --</option>
                    {agents.map((agent) => (
                      <option key={agent.id} value={agent.id}>
                        {agent.name} ({agent.status})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tags Management */}
                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">
                    Tags & Labels
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {selectedConv.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2 py-0.5 rounded-md border border-zinc-200/60 dark:border-zinc-700/60"
                      >
                        <Tag className="w-2.5 h-2.5 text-zinc-400" />
                        {t}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(t)}
                          className="hover:text-rose-500 ml-0.5"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  <form onSubmit={handleAddTag} className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="Add tag..."
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      className="flex-1 px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 outline-none"
                    />
                    <button
                      type="submit"
                      className="px-2.5 py-1 bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-lg hover:bg-zinc-300 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              </div>

              {/* Footer Information */}
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 text-[10px] text-zinc-400 space-y-1">
                <div className="flex justify-between">
                  <span>Ticket Created:</span>
                  <span className="font-mono">Today, 10:39 AM</span>
                </div>
                <div className="flex justify-between">
                  <span>Routing Engine:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    ChakraHQ Flow
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-zinc-400 text-xs">No details available.</div>
          )}
        </div>
      </div>
    </div>
  );
}
