"use client";

import Link from "next/link";
import {
  BookOpen,
  Layers,
  ClipboardCheck,
  BarChart3,
  Calculator,
  TrendingDown,
  TrendingUp,
  Moon,
  Flame,
  Activity,
  ArrowRight,
  Zap,
  Target,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DoseChecklist } from "@/components/tracking/dose-checklist";
import { OutcomeChart } from "@/components/insights/outcome-chart";
import { LaneBadge } from "@/components/peptide/lane-badge";
import {
  MOCK_DAILY_DOSES,
  MOCK_OUTCOMES,
  MOCK_INSIGHTS,
  MOCK_PROTOCOLS,
  MOCK_TIME_SERIES,
  MOCK_DASHBOARD_STATS,
} from "@/lib/mock-data";

const QUICK_LINKS = [
  { label: "Library",    href: "/library",    icon: BookOpen,       color: "#00d4ff" },
  { label: "Protocols",  href: "/protocols",  icon: Layers,         color: "#ff6b35" },
  { label: "Daily Log",  href: "/log",         icon: ClipboardCheck, color: "#00ff88" },
  { label: "Insights",   href: "/insights",   icon: BarChart3,      color: "#b366ff" },
  { label: "Calculator", href: "/calculator", icon: Calculator,     color: "#ffaa00" },
] as const;

const INSIGHT_ICON: Record<string, { color: string; bg: string }> = {
  positive: { color: "#00ff88", bg: "rgba(0,255,136,0.1)" },
  neutral:  { color: "#00d4ff", bg: "rgba(0,212,255,0.1)" },
  warning:  { color: "#ffaa00", bg: "rgba(255,170,0,0.1)" },
};

export default function DashboardPage() {
  const today = MOCK_OUTCOMES[MOCK_OUTCOMES.length - 1];
  const weekAgo = MOCK_OUTCOMES[MOCK_OUTCOMES.length - 8];
  const dosesCompleted = MOCK_DAILY_DOSES.filter((d) => d.taken).length;
  const totalDoses = MOCK_DAILY_DOSES.length;
  const stats = MOCK_DASHBOARD_STATS;

  const recentSeries = MOCK_TIME_SERIES.slice(-7);

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs text-dc-text-muted uppercase tracking-wide mb-1">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <h1 className="text-2xl font-bold text-dc-text">
            Good morning<span className="text-dc-accent">.</span>
          </h1>
          <p className="text-sm text-dc-text-muted mt-1">
            {dosesCompleted} of {totalDoses} doses logged today &middot; {stats.streakDays}-day streak
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/log">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white transition-all"
              style={{ background: "linear-gradient(135deg, #ff6b35 0%, #ff8555 100%)", boxShadow: "0 4px 16px rgba(255,107,53,0.25)" }}>
              <CheckCircle2 className="w-4 h-4" />
              Log Dose
            </button>
          </Link>
          <Link href="/protocols/builder">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm text-dc-text bg-dc-surface border border-dc-border hover:border-dc-accent/30 transition-all">
              <Zap className="w-4 h-4 text-dc-text-muted" />
              New Protocol
            </button>
          </Link>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "Active Protocols",
            value: stats.activeProtocols.toString(),
            icon: Layers,
            color: "#ff6b35",
            sub: "Running now",
          },
          {
            label: "Doses This Week",
            value: stats.dosesThisWeek.toString(),
            icon: Activity,
            color: "#00d4ff",
            sub: `${stats.complianceRate}% compliance`,
          },
          {
            label: "Current Body Fat",
            value: `${today?.bodyFat}%`,
            icon: TrendingDown,
            color: "#00ff88",
            sub: weekAgo ? `${(today.bodyFat! - weekAgo.bodyFat!).toFixed(1)}% vs last week` : "7-day trend",
          },
          {
            label: "Today's Sleep",
            value: `${today?.sleep}/10`,
            icon: Moon,
            color: "#b366ff",
            sub: "Score",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="group hover:translate-y-[-2px] transition-all duration-200">
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${stat.color}15`, boxShadow: `0 0 16px ${stat.color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <div className="min-w-0">
                  <p className="text-xl font-bold text-dc-text stat-number leading-none">{stat.value}</p>
                  <p className="text-[10px] text-dc-text-muted mt-1 truncate">{stat.label}</p>
                  <p className="text-[10px] text-dc-text-faint mt-0.5">{stat.sub}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Nav */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
        {QUICK_LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href}>
              <Card hoverable className="flex flex-col items-center gap-2 py-5 text-center group">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110"
                  style={{ background: `${link.color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color: link.color }} />
                </div>
                <span className="text-xs font-medium text-dc-text-muted group-hover:text-dc-text transition-colors">{link.label}</span>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left column — Today's Doses + Chart */}
        <div className="lg:col-span-2 space-y-5">
          {/* 7-day Trend Chart */}
          <Card>
            <div className="flex items-center justify-between mb-5">
              <div>
                <CardTitle>7-Day Trend</CardTitle>
                <p className="text-xs text-dc-text-muted mt-0.5">Sleep, energy & mood this week</p>
              </div>
              <Link href="/insights" className="flex items-center gap-1 text-xs text-dc-accent hover:text-dc-accent-hover transition-colors">
                Full insights <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <OutcomeChart data={recentSeries} compact />
          </Card>

          {/* Today's Doses */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle>Today&apos;s Doses</CardTitle>
                <p className="text-xs text-dc-text-muted mt-0.5">Tap to mark as taken</p>
              </div>
              <Link href="/log" className="flex items-center gap-1 text-xs text-dc-accent hover:text-dc-accent-hover transition-colors">
                Full log <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <DoseChecklist doses={MOCK_DAILY_DOSES} />
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Active Protocols */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <CardTitle>Active Protocols</CardTitle>
              <Link href="/protocols" className="flex items-center gap-1 text-xs text-dc-accent hover:text-dc-accent-hover transition-colors">
                All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {MOCK_PROTOCOLS.filter((p) => p.progress !== undefined).map((protocol) => (
                <div key={protocol.id} className="p-3.5 rounded-xl bg-dc-surface-alt/50 border border-dc-border/50">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="text-sm font-medium text-dc-text leading-snug">{protocol.hookTitle}</p>
                      <p className="text-[10px] text-dc-text-muted mt-0.5">{protocol.peptides.length} compounds &middot; {protocol.duration}</p>
                    </div>
                    <LaneBadge lane={protocol.contentAngle} showLabel size="xs" />
                  </div>
                  {protocol.progress !== undefined && (
                    <div>
                      <div className="flex justify-between text-[10px] text-dc-text-muted mb-1.5">
                        <span>Progress</span>
                        <span className="font-medium text-dc-text mono">{protocol.progress}%</span>
                      </div>
                      <div className="progress-track">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${protocol.progress}%`,
                            background: protocol.contentAngle === "clinical"
                              ? "#00d4ff"
                              : protocol.contentAngle === "expert"
                              ? "#ff6b35"
                              : "#b366ff",
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* AI Insights */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <CardTitle>AI Insights</CardTitle>
              <Link href="/insights" className="flex items-center gap-1 text-xs text-dc-accent hover:text-dc-accent-hover transition-colors">
                All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-2.5">
              {MOCK_INSIGHTS.slice(0, 4).map((insight) => {
                const style = INSIGHT_ICON[insight.type];
                return (
                  <div key={insight.id} className="flex items-start gap-3">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-[9px] font-bold"
                      style={{ background: style.bg, color: style.color }}
                    >
                      {insight.change.length <= 5 ? insight.change : insight.type === "positive" ? "+" : "!"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-dc-text leading-snug">{insight.title}</p>
                      <p className="text-[10px] text-dc-text-muted mt-0.5 line-clamp-2 leading-relaxed">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Body Stats */}
          <Card>
            <CardTitle className="mb-3">Body Metrics</CardTitle>
            <div className="space-y-2">
              {[
                { label: "Weight", value: `${today?.weight} lbs`, icon: TrendingDown, color: "#ff6b35", delta: weekAgo ? `${(today.weight! - weekAgo.weight!).toFixed(1)} lbs` : undefined },
                { label: "Body Fat", value: `${today?.bodyFat}%`, icon: Target, color: "#00d4ff", delta: weekAgo ? `${(today.bodyFat! - weekAgo.bodyFat!).toFixed(1)}%` : undefined },
                { label: "Energy", value: `${today?.energy}/10`, icon: Flame, color: "#00ff88", delta: weekAgo ? `+${today.energy! - weekAgo.energy!}` : undefined },
                { label: "Streak", value: `${stats.streakDays} days`, icon: Clock, color: "#ffaa00", delta: "going strong" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                      <span className="text-xs text-dc-text-muted">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.delta && (
                        <span className={`text-[10px] mono ${item.delta.startsWith("-") ? "text-dc-neon-green" : item.delta.startsWith("+") && item.delta !== "+0" ? "text-dc-neon-green" : "text-dc-text-muted"}`}>
                          {item.delta}
                        </span>
                      )}
                      <span className="text-xs font-semibold text-dc-text mono">{item.value}</span>
                    </div>
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
