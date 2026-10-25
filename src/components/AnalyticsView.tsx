'use client';

import React from 'react';
import {
  MessageSquare,
  Bot,
  Clock,
  UserCheck,
  TrendingUp,
  Activity,
  Zap,
} from 'lucide-react';
import { BotRule } from '../types/whatsapp';

interface AnalyticsViewProps {
  rules: BotRule[];
}

export default function AnalyticsView({ rules }: AnalyticsViewProps) {
  const totalTriggers = rules.reduce((acc, r) => acc + (Number(r.triggerCount) || 0), 0);

  const metrics = [
    {
      title: 'Total Messages Handled',
      value: (totalTriggers * 12 + 1240).toLocaleString(),
      change: '+18.4% this week',
      isPositive: true,
      icon: MessageSquare,
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40',
    },
    {
      title: 'Bot Auto-Resolution Rate',
      value: '89.2%',
      change: '+3.1% vs last month',
      isPositive: true,
      icon: Bot,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40',
    },
    {
      title: 'Average Response Time',
      value: '580 ms',
      change: '-140 ms faster',
      isPositive: true,
      icon: Clock,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40',
    },
    {
      title: 'Live Agent Handoffs',
      value: '10.8%',
      change: '-2.4% reduced load',
      isPositive: true,
      icon: UserCheck,
      color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40',
    },
  ];

  // Hourly traffic mockup
  const hourlyData = [
    { hour: '00:00', count: 12 },
    { hour: '02:00', count: 8 },
    { hour: '04:00', count: 5 },
    { hour: '06:00', count: 24 },
    { hour: '08:00', count: 82 },
    { hour: '10:00', count: 145 },
    { hour: '12:00', count: 180 },
    { hour: '14:00', count: 165 },
    { hour: '16:00', count: 195 },
    { hour: '18:00', count: 130 },
    { hour: '20:00', count: 90 },
    { hour: '22:00', count: 45 },
  ];
  const maxHourly = Math.max(...hourlyData.map((d) => d.count));

  // Category statistics
  const categories = ['onboarding', 'general', 'sales', 'support'] as const;
  const categoryStats = categories.map((cat) => {
    const catRules = rules.filter((r) => r.category === cat);
    const count = catRules.reduce((acc, r) => acc + (Number(r.triggerCount) || 0), 0);
    return {
      category: cat,
      count,
      ruleCount: catRules.length,
      percentage: totalTriggers > 0 ? Math.round((count / totalTriggers) * 100) : 0,
    };
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-500" />
          Bot Performance & Analytics
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Real-time metrics on user engagements, automated responses, and keyword performance
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {metric.title}
                </span>
                <div className={`p-2 rounded-lg ${metric.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  {metric.value}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                  <TrendingUp className="w-3 h-3" />
                  {metric.change}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Volume Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                Today&apos;s Message Activity
              </h3>
              <p className="text-xs text-zinc-500">Hourly incoming chat traffic</p>
            </div>
            <span className="text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold px-2.5 py-1 rounded-md">
              Live Stream
            </span>
          </div>

          <div className="h-44 flex items-end justify-between gap-2 pt-4">
            {hourlyData.map((item, i) => {
              const heightPct = Math.round((item.count / maxHourly) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="text-[10px] text-zinc-400 opacity-0 group-hover:opacity-100 transition">
                    {item.count}
                  </div>
                  <div
                    style={{ height: `${Math.max(heightPct, 8)}%` }}
                    className="w-full bg-emerald-400/80 hover:bg-emerald-500 dark:bg-emerald-600/70 dark:hover:bg-emerald-500 rounded-t transition-all"
                  />
                  <span className="text-[9px] text-zinc-400 font-mono">
                    {item.hour.split(':')[0]}h
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 mb-1">
              Traffic by Category
            </h3>
            <p className="text-xs text-zinc-500 mb-4">Distribution of triggered flows</p>

            <div className="space-y-3">
              {categoryStats.map((item, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between text-zinc-700 dark:text-zinc-300 capitalize font-medium">
                    <span>{item.category}</span>
                    <span className="text-zinc-500">{item.percentage}% ({item.count})</span>
                  </div>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        item.category === 'onboarding'
                          ? 'bg-blue-500'
                          : item.category === 'sales'
                          ? 'bg-amber-500'
                          : item.category === 'support'
                          ? 'bg-purple-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500 flex items-center justify-between">
            <span>Total Rules Configured</span>
            <span className="font-bold text-zinc-900 dark:text-zinc-100">{rules.length}</span>
          </div>
        </div>
      </div>

      {/* Top Performing Triggers */}
      <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
        <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 mb-1 flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-500" />
          Top Triggered Bot Keywords
        </h3>
        <p className="text-xs text-zinc-500 mb-4">
          Most frequently matched keywords across user conversations
        </p>

        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {rules
            .slice()
            .sort((a, b) => (Number(b.triggerCount) || 0) - (Number(a.triggerCount) || 0))
            .map((rule, idx) => (
              <div key={rule.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-5 font-mono text-zinc-400 font-bold">
                    #{idx + 1}
                  </span>
                  <div>
                    <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {rule.title}
                    </div>
                    <div className="text-[11px] text-zinc-400 font-mono">
                      Keywords: {rule.keywords.slice(0, 3).join(', ')}
                      {rule.keywords.length > 3 && ` +${rule.keywords.length - 3} more`}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-zinc-900 dark:text-zinc-100">
                    {rule.triggerCount} triggers
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 capitalize font-medium">
                    {rule.category}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
