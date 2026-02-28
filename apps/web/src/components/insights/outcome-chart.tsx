"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import type { TimeSeriesPoint } from "@/types";

interface OutcomeChartProps {
  readonly data: readonly TimeSeriesPoint[];
  readonly compact?: boolean;
}

const METRICS = [
  { key: "sleep",    label: "Sleep",    color: "#b366ff", yAxisId: "scores", defaultOn: true },
  { key: "energy",   label: "Energy",   color: "#00d4ff", yAxisId: "scores", defaultOn: true },
  { key: "mood",     label: "Mood",     color: "#00ff88", yAxisId: "scores", defaultOn: true },
  { key: "recovery", label: "Recovery", color: "#ffaa00", yAxisId: "scores", defaultOn: false },
  { key: "weight",   label: "Weight",   color: "#ff6b35", yAxisId: "weight", defaultOn: false },
  { key: "bodyFat",  label: "Body Fat", color: "#ff4444", yAxisId: "weight", defaultOn: false },
] as const;

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string; dataKey: string }>;
  label?: string;
}) => {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="glass rounded-xl px-4 py-3 border border-dc-border shadow-2xl min-w-[160px]">
      <p className="text-xs text-dc-text-muted mb-2 font-medium">{label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center justify-between gap-4 py-0.5">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-xs text-dc-text-muted">{entry.name}</span>
          </div>
          <span className="text-xs font-semibold text-dc-text mono">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export function OutcomeChart({ data, compact = false }: OutcomeChartProps) {
  const [activeMetrics, setActiveMetrics] = useState<Set<string>>(
    new Set(METRICS.filter((m) => m.defaultOn).map((m) => m.key)),
  );

  const toggleMetric = (key: string) => {
    setActiveMetrics((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const chartData = data.map((point) => ({
    ...point,
    date: point.date.slice(5), // MM-DD
  }));

  return (
    <div>
      {/* Metric toggles */}
      {!compact && (
        <div className="flex flex-wrap gap-2 mb-5">
          {METRICS.map((metric) => {
            const isActive = activeMetrics.has(metric.key);
            return (
              <button
                key={metric.key}
                onClick={() => toggleMetric(metric.key)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200"
                style={{
                  backgroundColor: isActive ? `${metric.color}12` : "transparent",
                  borderColor: isActive ? `${metric.color}40` : "rgba(42,42,62,0.8)",
                  color: isActive ? metric.color : "#8888a0",
                }}
              >
                <span
                  className="w-2 h-2 rounded-full transition-opacity"
                  style={{ backgroundColor: metric.color, opacity: isActive ? 1 : 0.3 }}
                />
                {metric.label}
              </button>
            );
          })}
        </div>
      )}

      <ResponsiveContainer width="100%" height={compact ? 180 : 300}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,42,62,0.8)" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#4a4a6a"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            interval={compact ? 6 : 4}
          />
          <YAxis
            yAxisId="scores"
            domain={[0, 10]}
            stroke="#4a4a6a"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            ticks={[0, 5, 10]}
          />
          <YAxis
            yAxisId="weight"
            orientation="right"
            stroke="#4a4a6a"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            domain={["auto", "auto"]}
            hide={!activeMetrics.has("weight") && !activeMetrics.has("bodyFat")}
          />
          <Tooltip content={<CustomTooltip />} />
          {!compact && <Legend wrapperStyle={{ fontSize: "10px", color: "#8888a0", paddingTop: "12px" }} />}
          {METRICS.filter((m) => activeMetrics.has(m.key)).map((metric) => (
            <Line
              key={metric.key}
              type="monotone"
              dataKey={metric.key}
              name={metric.label}
              stroke={metric.color}
              strokeWidth={compact ? 1.5 : 2}
              yAxisId={metric.yAxisId}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0, fill: metric.color }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
