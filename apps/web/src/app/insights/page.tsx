"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { TrendingUp, TrendingDown, Brain, AlertTriangle, CheckCircle2, Zap } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { OutcomeChart } from "@/components/insights/outcome-chart";
import { MOCK_TIME_SERIES, MOCK_COMPLIANCE, MOCK_INSIGHTS, MOCK_OUTCOMES } from "@/lib/mock-data";
import clsx from "clsx";

const SCORE_CATEGORIES = [
  { key: "energy",   label: "Energy",   color: "#00d4ff" },
  { key: "sleep",    label: "Sleep",    color: "#b366ff" },
  { key: "mood",     label: "Mood",     color: "#00ff88" },
  { key: "recovery", label: "Recovery", color: "#ffaa00" },
] as const;

const CustomComplianceTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-3 py-2.5 border border-dc-border shadow-xl">
      <p className="text-xs font-medium text-dc-text-muted mb-1">{label}</p>
      <p className="text-sm font-bold text-dc-accent mono">{payload[0].value}%</p>
    </div>
  );
};

export default function InsightsPage() {
  const latest = MOCK_OUTCOMES[MOCK_OUTCOMES.length - 1];
  const weekAgo = MOCK_OUTCOMES[MOCK_OUTCOMES.length - 8];
  const monthStart = MOCK_OUTCOMES[0];

  const avgCompliance = Math.round(MOCK_COMPLIANCE.reduce((a, d) => a + d.compliance, 0) / MOCK_COMPLIANCE.length);

  const deltas = SCORE_CATEGORIES.map((cat) => {
    const now = latest[cat.key as keyof typeof latest] as number;
    const then = weekAgo?.[cat.key as keyof typeof weekAgo] as number;
    return {
      ...cat,
      current: now,
      delta: then ? now - then : 0,
    };
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "Weight Lost (30d)",
            value: `${((monthStart.weight ?? 0) - (latest.weight ?? 0)).toFixed(1)} lbs`,
            icon: TrendingDown,
            color: "#00ff88",
            positive: true,
          },
          {
            label: "Body Fat Change (30d)",
            value: `${((monthStart.bodyFat ?? 0) - (latest.bodyFat ?? 0)).toFixed(1)}%`,
            icon: TrendingDown,
            color: "#00d4ff",
            positive: true,
          },
          {
            label: "Avg. Compliance",
            value: `${avgCompliance}%`,
            icon: CheckCircle2,
            color: "#ff6b35",
            positive: avgCompliance >= 80,
          },
          {
            label: "Sleep Score (Avg)",
            value: `${(MOCK_OUTCOMES.slice(-7).reduce((a, d) => a + (d.sleep ?? 0), 0) / 7).toFixed(1)}/10`,
            icon: Zap,
            color: "#b366ff",
            positive: true,
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${stat.color}15` }}>
                  <Icon className="w-4.5 h-4.5" style={{ color: stat.color }} />
                </div>
                <div>
                  <p className="text-xl font-bold text-dc-text stat-number leading-none" style={{ color: stat.positive ? stat.color : "#ff4444" }}>
                    {stat.value}
                  </p>
                  <p className="text-[10px] text-dc-text-muted mt-1">{stat.label}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main Chart */}
        <div className="lg:col-span-2 space-y-5">
          {/* 30-Day Outcome Chart */}
          <Card>
            <div className="flex items-center justify-between mb-5">
              <div>
                <CardTitle>30-Day Outcome Trends</CardTitle>
                <p className="text-xs text-dc-text-muted mt-0.5">Sleep, energy, mood & recovery over time</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-dc-text-muted">
                <div className="w-2 h-2 rounded-full bg-dc-accent animate-pulse-glow" />
                Live tracking
              </div>
            </div>
            <OutcomeChart data={MOCK_TIME_SERIES} />
          </Card>

          {/* Weekly Compliance */}
          <Card>
            <div className="flex items-center justify-between mb-5">
              <div>
                <CardTitle>Weekly Dose Compliance</CardTitle>
                <p className="text-xs text-dc-text-muted mt-0.5">Doses taken vs. scheduled this week</p>
              </div>
              <span
                className={clsx(
                  "text-sm font-bold mono",
                  avgCompliance >= 80 ? "text-dc-neon-green" : "text-dc-warning",
                )}
              >
                {avgCompliance}% avg
              </span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={[...MOCK_COMPLIANCE]} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,42,62,0.8)" vertical={false} />
                <XAxis dataKey="day" stroke="#4a4a6a" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} stroke="#4a4a6a" fontSize={11} tickLine={false} axisLine={false} ticks={[0, 50, 100]} />
                <Tooltip content={<CustomComplianceTooltip />} />
                <Bar dataKey="compliance" radius={[6, 6, 0, 0]} maxBarSize={48}>
                  {MOCK_COMPLIANCE.map((entry) => (
                    <Cell
                      key={entry.day}
                      fill={entry.compliance === 100 ? "#00ff88" : entry.compliance >= 80 ? "#ffaa00" : entry.compliance > 0 ? "#ff6b35" : "#2a2a3e"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Right Panel */}
        <div className="space-y-5">
          {/* Today's Scores */}
          <Card>
            <CardTitle className="mb-4">Today&apos;s Scores</CardTitle>
            <div className="space-y-4">
              {deltas.map((cat) => (
                <div key={cat.key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-dc-text-muted">{cat.label}</span>
                    <div className="flex items-center gap-2">
                      {cat.delta !== 0 && (
                        <span className={clsx("text-[10px] font-medium mono", cat.delta > 0 ? "text-dc-neon-green" : "text-dc-danger")}>
                          {cat.delta > 0 ? "+" : ""}{cat.delta}
                        </span>
                      )}
                      <span className="text-sm font-bold text-dc-text mono">{cat.current}/10</span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-dc-surface overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${(cat.current / 10) * 100}%`,
                        background: `linear-gradient(90deg, ${cat.color}80, ${cat.color})`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-dc-border">
              <div className="flex items-center justify-between">
                <span className="text-xs text-dc-text-muted">Overall Score</span>
                <span className="text-lg font-bold text-dc-neon-green mono">
                  {Math.round(deltas.reduce((a, d) => a + d.current, 0) / deltas.length)}/10
                </span>
              </div>
              <p className="text-[10px] text-dc-text-muted mt-1">Best 30-day window recorded</p>
            </div>
          </Card>

          {/* AI Insights */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-4.5 h-4.5 text-dc-neon-purple" />
              <CardTitle>AI Observations</CardTitle>
            </div>
            <div className="space-y-3">
              {MOCK_INSIGHTS.map((insight) => {
                const isWarning = insight.type === "warning";
                const isPositive = insight.type === "positive";
                return (
                  <div
                    key={insight.id}
                    className={clsx(
                      "p-3.5 rounded-xl border",
                      isPositive ? "bg-dc-neon-green/5 border-dc-neon-green/15" : isWarning ? "bg-dc-warning/5 border-dc-warning/15" : "bg-dc-neon-cyan/5 border-dc-neon-cyan/15",
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      {isPositive ? (
                        <TrendingUp className="w-3.5 h-3.5 text-dc-neon-green" />
                      ) : isWarning ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-dc-warning" />
                      ) : (
                        <Brain className="w-3.5 h-3.5 text-dc-neon-cyan" />
                      )}
                      <span
                        className={clsx(
                          "text-xs font-semibold",
                          isPositive ? "text-dc-neon-green" : isWarning ? "text-dc-warning" : "text-dc-neon-cyan",
                        )}
                      >
                        {insight.change}
                      </span>
                      <span className="text-xs font-medium text-dc-text ml-1">{insight.title}</span>
                    </div>
                    <p className="text-[10px] text-dc-text-muted leading-relaxed">{insight.description}</p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
