"use client";

import Link from "next/link";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Layers,
  ClipboardCheck,
  BarChart3,
  Calculator,
  TrendingDown,
  Moon,
  Flame,
  Activity,
  ArrowRight,
} from "lucide-react";
import { MOCK_DAILY_DOSES, MOCK_OUTCOMES, MOCK_INSIGHTS, MOCK_PROTOCOLS } from "@/lib/mock-data";

const QUICK_LINKS = [
  { label: "Peptide Library", href: "/library", icon: BookOpen, color: "#00d4ff" },
  { label: "Protocols", href: "/protocols", icon: Layers, color: "#ff6b35" },
  { label: "Daily Log", href: "/log", icon: ClipboardCheck, color: "#00ff88" },
  { label: "Insights", href: "/insights", icon: BarChart3, color: "#b366ff" },
  { label: "Calculator", href: "/calculator", icon: Calculator, color: "#ffaa00" },
] as const;

export default function DashboardPage() {
  const today = MOCK_OUTCOMES[MOCK_OUTCOMES.length - 1];
  const yesterday = MOCK_OUTCOMES[MOCK_OUTCOMES.length - 2];
  const dosesCompleted = MOCK_DAILY_DOSES.filter((d) => d.taken).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Hero */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-dc-text">
          Welcome back<span className="text-dc-accent">.</span>
        </h1>
        <p className="text-dc-text-muted">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-dc-accent/10 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-dc-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dc-text">{today?.weight}</p>
              <p className="text-xs text-dc-text-muted">
                Weight{" "}
                {today && yesterday && (
                  <span className="text-dc-neon-green">
                    {(today.weight! - yesterday.weight!).toFixed(1)}
                  </span>
                )}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-dc-neon-purple/10 flex items-center justify-center">
              <Moon className="w-5 h-5 text-dc-neon-purple" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dc-text">{today?.sleep}/10</p>
              <p className="text-xs text-dc-text-muted">Sleep Score</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-dc-neon-green/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-dc-neon-green" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dc-text">{today?.mood}/10</p>
              <p className="text-xs text-dc-text-muted">Mood Score</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-dc-clinical/10 flex items-center justify-center">
              <Flame className="w-5 h-5 text-dc-clinical" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dc-text">
                {dosesCompleted}/{MOCK_DAILY_DOSES.length}
              </p>
              <p className="text-xs text-dc-text-muted">Doses Today</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Nav */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {QUICK_LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href}>
              <Card hoverable className="flex flex-col items-center gap-2 text-center py-6">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${link.color}15` }}
                >
                  <Icon className="w-6 h-6" style={{ color: link.color }} />
                </div>
                <span className="text-sm font-medium text-dc-text">{link.label}</span>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Protocols */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Active Protocols</CardTitle>
            <Link
              href="/protocols"
              className="text-xs text-dc-accent hover:text-dc-accent-hover flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <CardContent>
            <div className="space-y-3">
              {MOCK_PROTOCOLS.slice(0, 2).map((protocol) => (
                <div
                  key={protocol.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-dc-surface-alt/50"
                >
                  <div>
                    <p className="text-sm font-medium text-dc-text">{protocol.hookTitle}</p>
                    <p className="text-xs text-dc-text-muted mt-0.5">
                      {protocol.peptides.length} compounds &middot; {protocol.duration}
                    </p>
                  </div>
                  <Badge variant={protocol.intensity as "conservative" | "standard" | "aggressive"} size="sm">
                    {protocol.intensity}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Latest Insights */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Latest Insights</CardTitle>
            <Link
              href="/insights"
              className="text-xs text-dc-accent hover:text-dc-accent-hover flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <CardContent>
            <div className="space-y-3">
              {MOCK_INSIGHTS.slice(0, 3).map((insight) => (
                <div
                  key={insight.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-dc-surface-alt/50"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
                    style={{
                      backgroundColor:
                        insight.type === "positive"
                          ? "#00ff8815"
                          : insight.type === "warning"
                            ? "#ffaa0015"
                            : "#00d4ff15",
                      color:
                        insight.type === "positive"
                          ? "#00ff88"
                          : insight.type === "warning"
                            ? "#ffaa00"
                            : "#00d4ff",
                    }}
                  >
                    {insight.change.slice(0, 4)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-dc-text">{insight.title}</p>
                    <p className="text-xs text-dc-text-muted mt-0.5 line-clamp-2">
                      {insight.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
