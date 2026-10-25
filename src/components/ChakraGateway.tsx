'use client';

import React, { useState } from 'react';
import {
  Layers,
  Smartphone,
  Key,
  ShieldCheck,
  Code2,
  Copy,
  Check,
  Plus,
  RefreshCw,
  ExternalLink,
  Zap,
  CheckCircle2,
  Trash2,
  Percent,
} from 'lucide-react';
import { CoexistenceConfig, ChakraApiKey } from '../types/whatsapp';

interface ChakraGatewayProps {
  coexistenceConfig: CoexistenceConfig;
  onUpdateCoexistence: (config: CoexistenceConfig) => void;
  apiKeys: ChakraApiKey[];
  onAddApiKey: (key: Omit<ChakraApiKey, 'id' | 'createdAt' | 'lastUsed'>) => void;
  onDeleteApiKey: (id: string) => void;
}

export default function ChakraGateway({
  coexistenceConfig,
  onUpdateCoexistence,
  apiKeys,
  onAddApiKey,
  onDeleteApiKey,
}: ChakraGatewayProps) {
  const [selectedSnippetLang, setSelectedSnippetLang] = useState<'curl' | 'node' | 'python'>('curl');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [pingStatus, setPingStatus] = useState<string | null>(null);

  // New API Key Modal State
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyRole, setNewKeyRole] = useState<'Full Admin' | 'Marketing' | 'Operations' | 'Read Only'>('Full Admin');

  // HMAC Signature Tester state
  const [hmacSecret, setHmacSecret] = useState('chakra_sec_9934182934');
  const [hmacPayload, setHmacPayload] = useState('{"event":"message","from":"15553829104","text":"Hello"}');
  const [computedSignature, setComputedSignature] = useState('sha256=a89f3e9c70281b37dd19024f923485ba81239c09');

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleTestPing = () => {
    setPingStatus('Testing coexistence handshake...');
    setTimeout(() => {
      setPingStatus('Success: WhatsApp Business App (Android/iOS) + Chakra Cloud API synced! Latency: 24ms');
      setTimeout(() => setPingStatus(null), 4000);
    }, 800);
  };

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    onAddApiKey({
      name: newKeyName.trim(),
      keyPrefix: `chk_${newKeyRole.toLowerCase().slice(0, 3)}_${Math.random().toString(36).substring(2, 9)}...`,
      role: newKeyRole,
      isActive: true,
    });

    setNewKeyName('');
    setShowKeyModal(false);
  };

  const computeSimulatedHmac = () => {
    const fakeHash = Math.abs(
      (hmacSecret + hmacPayload).split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0)
    ).toString(16);
    setComputedSignature(`sha256=${fakeHash.padStart(32, '0')}7f198b2`);
  };

  const codeSnippets = {
    curl: `curl -X POST "https://api.chakrahq.com/v1/messages/send" \\
  -H "Authorization: Bearer ${apiKeys[0]?.keyPrefix || 'chk_live_key'}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+15553829104",
    "type": "text",
    "text": { "body": "Hello from ChakraHQ API!" },
    "coexistence": { "deliver_to_mobile_app": true }
  }'`,
    node: `import { ChakraClient } from '@chakrahq/whatsapp-sdk';

const chakra = new ChakraClient({
  apiKey: '${apiKeys[0]?.keyPrefix || 'chk_live_key'}',
  coexistenceMode: true,
});

await chakra.messages.send({
  to: '+15553829104',
  text: 'Hello from ChakraHQ API!',
  routing: '${coexistenceConfig.routingMode}',
});`,
    python: `import requests

url = "https://api.chakrahq.com/v1/messages/send"
headers = {
    "Authorization": "Bearer ${apiKeys[0]?.keyPrefix || 'chk_live_key'}",
    "Content-Type": "application/json"
}
payload = {
    "to": "+15553829104",
    "text": {"body": "Hello from ChakraHQ API!"},
    "routing_mode": "${coexistenceConfig.routingMode}"
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`,
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-500" />
              ChakraHQ Developer Gateway & Coexistence
            </h2>
            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-300/40">
              Official Meta Partner
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Manage WhatsApp Coexistence, role-scoped API credentials, zero-markup routing, and HMAC security
          </p>
        </div>

        <a
          href="https://chakrahq.com"
          target="_blank"
          rel="noreferrer"
          className="bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
        >
          <span>ChakraHQ Docs</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Flagship Feature: WhatsApp Coexistence Engine */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                WhatsApp Coexistence Engine
                <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-mono px-2 py-0.5 rounded border border-emerald-200/50 dark:border-emerald-800/40 font-semibold">
                  CHAKRA EXCLUSIVE
                </span>
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Operate both the official WhatsApp Business Mobile App and the WhatsApp Cloud API on the exact same phone number simultaneously.
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              {coexistenceConfig.isEnabled ? 'Coexistence Active' : 'Coexistence Disabled'}
            </span>
            <button
              type="button"
              onClick={() =>
                onUpdateCoexistence({
                  ...coexistenceConfig,
                  isEnabled: !coexistenceConfig.isEnabled,
                })
              }
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition ${
                coexistenceConfig.isEnabled ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                  coexistenceConfig.isEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Coexistence Controls & Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Linked Mobile Device */}
          <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800 space-y-1">
            <span className="text-zinc-500 text-[11px] block">Linked Mobile App Phone</span>
            <div className="font-bold text-zinc-900 dark:text-zinc-100 font-mono text-sm">
              {coexistenceConfig.mobileLinkedNumber}
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 pt-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Mobile Session Connected</span>
            </div>
          </div>

          {/* Routing Policy Selector */}
          <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800 space-y-1">
            <span className="text-zinc-500 text-[11px] block">Inbound Routing Policy</span>
            <select
              value={coexistenceConfig.routingMode}
              onChange={(e) =>
                onUpdateCoexistence({
                  ...coexistenceConfig,
                  routingMode: e.target.value as CoexistenceConfig['routingMode'],
                })
              }
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-zinc-900 dark:text-zinc-100 outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
            >
              <option value="dual_delivery">Dual Delivery (Simultaneous API + Mobile)</option>
              <option value="bot_first">Bot First (Handoff to Mobile App)</option>
              <option value="agent_first">Mobile App First (Bot as Fallback)</option>
            </select>
            <span className="text-[10px] text-zinc-400 block pt-0.5">
              Messages duplicate to mobile phone & web portal
            </span>
          </div>

          {/* Sync Health & Ping */}
          <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800 flex flex-col justify-between">
            <div>
              <span className="text-zinc-500 text-[11px] block">Sync Health & Latency</span>
              <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                {coexistenceConfig.lastSyncedAt}
              </div>
            </div>
            <button
              type="button"
              onClick={handleTestPing}
              className="mt-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition"
            >
              <RefreshCw className="w-3 h-3" />
              Test Coexistence Handshake
            </button>
          </div>
        </div>

        {pingStatus && (
          <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs p-3 rounded-xl animate-fade-in font-medium">
            ⚡ {pingStatus}
          </div>
        )}
      </div>

      {/* Zero Markup & Benefits Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Zero-Markup Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
            <Percent className="w-4 h-4" />
            <span>ChakraHQ Zero-Markup Guarantee</span>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Unlike legacy BSPs that charge up to 30% markups on WhatsApp conversations, ChakraHQ passes through official Meta conversation fees with 0% extra per-message markup.
          </p>
          <div className="bg-zinc-50 dark:bg-zinc-800/50 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
            <span className="text-zinc-500">Effective Platform Fee:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              Meta Direct Rates Only ($0 Markup)
            </span>
          </div>
        </div>

        {/* High Throughput SLA Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
            <Zap className="w-4 h-4" />
            <span>High-Throughput Distributed Gateway</span>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Built on a cloud-native queue system delivering up to 1,000 messages per second with automatic retries, rate limiting compliance, and guaranteed delivery order.
          </p>
          <div className="bg-zinc-50 dark:bg-zinc-800/50 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
            <span className="text-zinc-500">Gateway Uptime SLA:</span>
            <span className="font-bold text-zinc-900 dark:text-zinc-100">
              99.95% Enterprise SLA
            </span>
          </div>
        </div>
      </div>

      {/* Role-Scoped API Keys Manager */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Key className="w-4 h-4 text-emerald-500" />
              Role-Scoped Chakra API Keys
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Securely authenticate your backend services and CRM integrations
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowKeyModal(true)}
            className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Generate New Key
          </button>
        </div>

        {/* API Keys Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 font-medium border-b border-zinc-100 dark:border-zinc-800">
              <tr>
                <th className="py-2.5 px-3">Key Name</th>
                <th className="py-2.5 px-3">Prefix & Token</th>
                <th className="py-2.5 px-3">Permission Role</th>
                <th className="py-2.5 px-3">Created</th>
                <th className="py-2.5 px-3">Last Active</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {apiKeys.map((key) => (
                <tr key={key.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                  <td className="py-3 px-3 font-semibold text-zinc-900 dark:text-zinc-100">
                    {key.name}
                  </td>
                  <td className="py-3 px-3 font-mono text-zinc-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1">
                      {key.keyPrefix}
                      <button
                        type="button"
                        onClick={() => handleCopyText(key.keyPrefix, key.id)}
                        className="hover:text-zinc-800 dark:hover:text-zinc-200 transition"
                        title="Copy Key"
                      >
                        {copiedKey === key.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2 py-0.5 rounded text-[10px] font-medium">
                      {key.role}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-zinc-400">{key.createdAt}</td>
                  <td className="py-3 px-3 text-zinc-400 font-mono">{key.lastUsed}</td>
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => onDeleteApiKey(key.id)}
                      className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition"
                      title="Revoke Key"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* HMAC SHA-256 Webhook Security Tester */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-xs space-y-4">
        <div>
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            HMAC-SHA256 Webhook Signature Validator
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            ChakraHQ signs every inbound webhook event with an HMAC SHA-256 hash in the{' '}
            <code className="text-emerald-600 dark:text-emerald-400 font-mono">X-Chakra-Signature</code> header.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">
              Chakra Webhook Signing Secret
            </label>
            <input
              type="text"
              value={hmacSecret}
              onChange={(e) => {
                setHmacSecret(e.target.value);
                computeSimulatedHmac();
              }}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono outline-none"
            />
          </div>

          <div>
            <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">
              Computed Header Signature (X-Chakra-Signature)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={computedSignature}
                className="flex-1 px-3 py-2 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 font-mono outline-none"
              />
              <button
                type="button"
                onClick={() => handleCopyText(computedSignature, 'hmac')}
                className="p-2 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              >
                {copiedKey === 'hmac' ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4 text-zinc-400" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1 text-xs">
            Sample Incoming JSON Webhook Body
          </label>
          <textarea
            rows={2}
            value={hmacPayload}
            onChange={(e) => {
              setHmacPayload(e.target.value);
              computeSimulatedHmac();
            }}
            className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono text-xs outline-none"
          />
        </div>
      </div>

      {/* Live Developer Code Generator */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-emerald-500" />
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
              Interactive ChakraHQ SDK & REST Snippets
            </h3>
          </div>

          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl text-xs">
            {(['curl', 'node', 'python'] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setSelectedSnippetLang(lang)}
                className={`px-3 py-1 rounded-lg capitalize font-medium transition ${
                  selectedSnippetLang === lang
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div className="relative bg-zinc-950 rounded-xl p-4 text-xs font-mono text-emerald-400 overflow-x-auto border border-zinc-800">
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(codeSnippets[selectedSnippetLang]);
              setCopiedSnippet(true);
              setTimeout(() => setCopiedSnippet(false), 2000);
            }}
            className="absolute top-3 right-3 p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 transition"
            title="Copy snippet"
          >
            {copiedSnippet ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
          <pre>{codeSnippets[selectedSnippetLang]}</pre>
        </div>
      </div>

      {/* Generate API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 text-xs">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              Generate New Chakra API Key
            </h3>

            <form onSubmit={handleCreateKey} className="space-y-4">
              <div>
                <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">
                  Key Label / Service Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mobile App Backend"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">
                  Access Role
                </label>
                <select
                  value={newKeyRole}
                  onChange={(e) =>
                    setNewKeyRole(
                      e.target.value as 'Full Admin' | 'Marketing' | 'Operations' | 'Read Only'
                    )
                  }
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Full Admin">Full Admin (All API Routes)</option>
                  <option value="Operations">Operations (Messages & Inbox Handoff)</option>
                  <option value="Marketing">Marketing (Templates & Broadcasts Only)</option>
                  <option value="Read Only">Read Only (Analytics & Webhooks)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold"
                >
                  Create Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
