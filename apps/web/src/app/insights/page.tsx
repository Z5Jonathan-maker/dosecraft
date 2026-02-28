"use client";

import { useState, useMemo } from "react";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OutcomeChart } from "@/components/insights/outcome-chart";
import {
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import {
  MOCK_TIME_SERIES,
  MOCK_INSIGHTS,
  MOCK_OUTCOMES,
  MOCK_PROTOCOL_TIMELINES,
} from "@/lib/mock-data";

const INSIGHT_ICON: Record<string, typeof TrendingUp> = {
  positive: TrendingUp,
  warning: AlertTriangle,
  neutral: Lightbulb,
};

const INSIGHT_COLOR: Record<string, string> = {
  positive: "#00ff88",
  warning: "#ffaa00",
  neutral: "#00d4ff",
};

const RANGE_OPTIONS = [
  { label: "7d", days: 7 },
  { label: "14d", days: 14 },
  { label: "All", days: 999 },
] as const;

function computeStat(
  values: (number | null)[],
): { avg: number; trend: number } {
  const valid = values.filter((v): v is number => v !== null);
  if (valid.length === 0) return { avg: 0, trend: 0 };
  const avg = valid.reduce((a, b) => a + b, 0) / valid.length;
  if (valid.length < 2) return { avg, trend: 0 };
  const half = Math.ceil(valid.length / 2);
  const first = valid.slice(0, half);
  const second = valid.slice(half);
  const avgFirst = first.reduce((a, b) => a + b, 0) / first.length;
  const avgSecond = second.reduce((a, b) => a + b, 0) / second.length;
  return { avg, trend: avgSecond - avgFirst };
}

export default function InsightsPage() {
  const [range, setRange] = useState(14);

  const filteredData = useMemo(
    () => MOCK_TIME_SERIES.slice(-range),
    [range],
  );

  const filteredOutcomes = useMemo(
    () => MOCK_OUTCOMES.slice(-range),
    [range],
  );

  const stats = useMemo(() => {
    const o = filteredOutcomes;
    return {
      weight: computeStat(o.map((x) => x.weight)),
      bodyFat: computeStat(o.map((x) => x.bodyFat)),
      mood: computeStat(o.map((x) => x.mood)),
      sleep: computeStat(o.map((x) => x.sleep)),
      energy: computeStat(o.map((x) => x.energy)),
      soreness: computeStat(o.map((x) => x.soreness)),
    };
  }, [filteredOutcomes]);

  const SUMMARY_CARDS = [
    {
      label: "Avg Weight",
      value: `${stats.weight.avg.toFixed(1)} lbs`,
      trend: stats.weight.trend,
      color: "#ff6b35",
      invertTrend: true,
    },
    {
      label: "Avg Body Fat",
      value: `${stats.bodyFat.avg.toFixed(1)}%`,
      trend: stats.bodyFat.trend,
      color: "#00d4ff",
      invertTrend: true,
    },
    {
      label: "Avg Mood",
      value: `${stats.mood.avg.toFixed(1)}/10`,
      trend: stats.mood.trend,
      color: "#00ff88",
      invertTrend: false,
    },
    {
      label: "Avg Sleep",
      value: `${stats.sleep.avg.toFixed(1)}/10`,
      trend: stats.sleep.trend,
      color: "#b366ff",
      invertTrend: false,
    },
    {
      label: "Avg Energy",
      value: `${stats.energy.avg.toFixed(1)}/10`,
      trend: stats.energy.trend,
      color: "#ffaa00",
      invertTrend: false,
    },
    {
      label: "Avg Soreness",
      value: `${stats.soreness.avg.toFixed(1)}/10`,
      trend: stats.soreness.trend,
      color: "#ff4444",
      invertTrend: true,
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dc-text">Insights</h1>
          <p className="text-sm text-dc-text-muted mt-1">
            Trends, correlations, and AI-generated observations from your logs.
          </p>
        </div>
        <div className="flex gap-1 p-1 bg-dc-surface rounded-lg border border-dc-border">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              onClick={() => setRange(opt.days)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                range === opt.days
                  ? "bg-dc-accent/10 text-dc-accent"
                  : "text-dc-text-muted hover:text-dc-text"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {SUMMARY_CARDS.map((card) => {
          const isPositive = card.invertTrend
            ? card.trend < 0
            : card.trend > 0;
          const isNeutral = Math.abs(card.trend) < 0.1;
          const TrendIcon = isNeutral
            ? Minus
            : isPositive
              ? ArrowUpRight
              : ArrowDownRight;
          const trendColor = isNeutral
            ? "#8888a0"
            : isPositive
              ? "#00ff88"
              : "#ff4444";

          return (
            <Card key={card.label}>
              <p className="text-[10px] uppercase tracking-wide text-dc-text-muted mb-1">
                {card.label}
              </p>
              <p
                className="text-xl font-bold font-mono"
                style={{ color: card.color }}
              >
                {card.value}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <TrendIcon
                  className="w-3 h-3"
                  style={{ color: trendColor }}
                />
                <span
                  className="text-[10px] font-medium"
                  style={{ color: trendColor }}
                >
                  {Math.abs(card.trend).toFixed(1)}
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Chart */}
      <Card>
        <CardTitle>Outcome Trends</CardTitle>
        <p className="text-xs text-dc-text-muted mt-1 mb-4">
          Toggle metrics to compare. Left axis: weight/body fat. Right axis:
          scores (1-10).
        </p>
        <CardContent>
          <OutcomeChart data={filteredData} />
        </CardContent>
      </Card>

      {/* Protocol Timeline */}
      <Card>
        <CardTitle>Active Protocol Timeline</CardTitle>
        <CardContent>
          <div className="space-y-3 mt-3">
            {MOCK_PROTOCOL_TIMELINES.map((timeline) => {
              const start = new Date(timeline.startDate);
              const end = new Date(timeline.endDate);
              const now = new Date();
              const totalDays =
                (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
              const elapsed = Math.max(
                0,
                (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
              );
              const progress = Math.min(100, (elapsed / totalDays) * 100);

              return (
                <div
                  key={timeline.protocolId}
                  className="p-4 rounded-lg bg-dc-surface-alt/50 border border-dc-border"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-dc-text">
                      {timeline.name}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-dc-text-muted">
                      <Calendar className="w-3 h-3" />
                      {timeline.startDate} to {timeline.endDate}
                    </div>
                  </div>
                  <div className="w-full h-2 bg-dc-surface rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: timeline.color,
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-dc-text-muted">
                      Day {Math.ceil(elapsed)} of {Math.ceil(totalDays)}
                    </span>
                    <span
                      className="text-[10px] font-medium"
                      style={{ color: timeline.color }}
                    >
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* AI Insight Cards */}
      <div>
        <h2 className="text-lg font-semibold text-dc-text mb-4">
          AI Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_INSIGHTS.map((insight) => {
            const Icon = INSIGHT_ICON[insight.type] ?? Lightbulb;
            const color = INSIGHT_COLOR[insight.type] ?? "#00d4ff";
            return (
              <Card key={insight.id} hoverable>
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${color}15` }}
                  >
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-semibold text-dc-text">
                        {insight.title}
                      </h3>
                      <Badge
                        variant={
                          insight.type === "positive"
                            ? "success"
                            : insight.type === "warning"
                              ? "warning"
                              : "default"
                        }
                        size="sm"
                      >
                        {insight.change}
                      </Badge>
                    </div>
                    <p className="text-sm text-dc-text-muted leading-relaxed">
                      {insight.description}
                    </p>
                    <Badge variant="default" size="sm" className="mt-2">
                      {insight.metric}
                    </Badge>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
