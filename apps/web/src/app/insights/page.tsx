"use client";

import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { OutcomeChart } from "@/components/insights/outcome-chart";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, Sparkles, Calendar } from "lucide-react";
import {
  MOCK_TIME_SERIES,
  MOCK_PROTOCOL_TIMELINES,
  MOCK_INSIGHTS,
} from "@/lib/mock-data";

export default function InsightsPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Chart */}
      <Card>
        <CardTitle>Outcome Trends</CardTitle>
        <p className="text-sm text-dc-text-muted mt-1 mb-4">
          Track how your metrics change over time. Toggle metrics to compare.
        </p>
        <OutcomeChart data={MOCK_TIME_SERIES} />
      </Card>

      {/* Protocol Timeline */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-dc-accent" />
          <CardTitle>Protocol Timeline</CardTitle>
        </div>
        <CardContent>
          <div className="space-y-3">
            {MOCK_PROTOCOL_TIMELINES.map((timeline) => (
              <div key={timeline.protocolId} className="flex items-center gap-4">
                <div className="w-32 text-sm font-medium text-dc-text truncate">
                  {timeline.name}
                </div>
                <div className="flex-1 relative h-8">
                  {/* Track */}
                  <div className="absolute inset-0 bg-dc-surface-alt rounded-full" />
                  {/* Bar */}
                  <div
                    className="absolute top-0 bottom-0 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: `${timeline.color}20`,
                      border: `1px solid ${timeline.color}50`,
                      left: "0%",
                      right: "20%",
                    }}
                  >
                    <span className="text-[10px] font-medium" style={{ color: timeline.color }}>
                      {timeline.startDate.slice(5)} — {timeline.endDate.slice(5)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-dc-accent" />
          <h2 className="text-lg font-bold text-dc-text">AI Insights</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_INSIGHTS.map((insight) => {
            const Icon =
              insight.type === "positive"
                ? TrendingUp
                : insight.type === "warning"
                  ? TrendingDown
                  : Minus;
            const iconColor =
              insight.type === "positive"
                ? "#00ff88"
                : insight.type === "warning"
                  ? "#ffaa00"
                  : "#00d4ff";

            return (
              <Card
                key={insight.id}
                glowColor={
                  insight.type === "positive"
                    ? "green"
                    : insight.type === "warning"
                      ? "accent"
                      : "cyan"
                }
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${iconColor}15` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: iconColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-dc-text">{insight.title}</h3>
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
                    <p className="text-xs text-dc-text-muted leading-relaxed">
                      {insight.description}
                    </p>
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
