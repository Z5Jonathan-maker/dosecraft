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
} from "recharts";
import type { TimeSeriesPoint } from "@/types";

interface OutcomeChartProps {
  readonly data: readonly TimeSeriesPoint[];
}

const METRICS = [
  { key: "weight", label: "Weight (lbs)", color: "#ff6b35", yAxisId: "left" },
  { key: "bodyFat", label: "Body Fat %", color: "#00d4ff", yAxisId: "left" },
  { key: "mood", label: "Mood", color: "#00ff88", yAxisId: "right" },
  { key: "sleep", label: "Sleep", color: "#b366ff", yAxisId: "right" },
  { key: "energy", label: "Energy", color: "#ffaa00", yAxisId: "right" },
] as const;

export function OutcomeChart({ data }: OutcomeChartProps) {
  const [activeMetrics, setActiveMetrics] = useState<Set<string>>(
    new Set(["weight", "sleep", "mood"]),
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
      <div className="flex flex-wrap gap-2 mb-4">
        {METRICS.map((metric) => (
          <button
            key={metric.key}
            onClick={() => toggleMetric(metric.key)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200"
            style={{
              backgroundColor: activeMetrics.has(metric.key)
                ? `${metric.color}15`
                : "transparent",
              borderColor: activeMetrics.has(metric.key) ? `${metric.color}50` : "#2a2a3e",
              color: activeMetrics.has(metric.key) ? metric.color : "#8888a0",
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: metric.color }}
            />
            {metric.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
          <XAxis
            dataKey="date"
            stroke="#8888a0"
            fontSize={11}
            tickLine={false}
          />
          <YAxis
            yAxisId="left"
            stroke="#8888a0"
            fontSize={11}
            tickLine={false}
            domain={["auto", "auto"]}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#8888a0"
            fontSize={11}
            tickLine={false}
            domain={[0, 10]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#12121a",
              border: "1px solid #2a2a3e",
              borderRadius: "8px",
              color: "#e8e8f0",
              fontSize: "12px",
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: "11px", color: "#8888a0" }}
          />
          {METRICS.filter((m) => activeMetrics.has(m.key)).map((metric) => (
            <Line
              key={metric.key}
              type="monotone"
              dataKey={metric.key}
              name={metric.label}
              stroke={metric.color}
              strokeWidth={2}
              yAxisId={metric.yAxisId}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
