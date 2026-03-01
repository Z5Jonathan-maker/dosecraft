"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { LANE_CONFIG } from "@/components/peptide/lane-badge";
import type { EvidenceLane } from "@/types";

// ── Types ────────────────────────────────────────────────────────────────────

type TimeView = "daily" | "weekly";

interface CompoundCurve {
  readonly name: string;
  readonly halfLifeHours: number;
  readonly injectionHours: readonly number[];
  readonly lane: EvidenceLane;
}

interface HalfLifeChartProps {
  readonly compounds: readonly CompoundCurve[];
  readonly defaultView?: TimeView;
  readonly className?: string;
}

interface SingleCompoundChartProps {
  readonly name: string;
  readonly halfLifeHours: number;
  readonly lane: EvidenceLane;
  readonly doseCount?: number;
  readonly intervalHours?: number;
  readonly className?: string;
}

interface TooltipData {
  readonly x: number;
  readonly y: number;
  readonly timeHours: number;
  readonly concentrations: readonly { name: string; value: number; color: string }[];
}

// ── Half-life Parser ─────────────────────────────────────────────────────────

/**
 * Parses half-life strings like "4-6 hours", "~24 hours", "6-8 days",
 * "~30 minutes", "CJC-1295: 6-8 days (DAC) | Ipamorelin: 2 hours", etc.
 * Returns the midpoint in hours.
 */
export function parseHalfLifeToHours(raw: string): number {
  const normalized = raw
    .replace(/\u2013/g, "-") // en-dash to hyphen
    .replace(/~/g, "")
    .trim()
    .toLowerCase();

  // Handle pipe-separated compounds (e.g., CJC/Ipa) — take the first one
  const segments = normalized.split("|");
  const segment = segments[0]?.trim() ?? normalized;

  // Strip prefix label like "cjc-1295:"
  const cleaned = segment.replace(/^[^:]*:\s*/, "").trim();

  // Try "X-Y unit" or "X unit"
  const rangeMatch = cleaned.match(
    /(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)\s*(hours?|hrs?|days?|minutes?|mins?|seconds?|secs?)/,
  );
  if (rangeMatch) {
    const low = parseFloat(rangeMatch[1] ?? "0");
    const high = parseFloat(rangeMatch[2] ?? "0");
    const mid = (low + high) / 2;
    return convertToHours(mid, rangeMatch[3] ?? "hours");
  }

  const singleMatch = cleaned.match(
    /(\d+(?:\.\d+)?)\s*(hours?|hrs?|days?|minutes?|mins?|seconds?|secs?)/,
  );
  if (singleMatch) {
    return convertToHours(parseFloat(singleMatch[1] ?? "0"), singleMatch[2] ?? "hours");
  }

  // Fallback: if it contains "hours" guess 4, "days" guess 24, "minutes" guess 0.5
  if (cleaned.includes("day")) return 24;
  if (cleaned.includes("hour")) return 4;
  if (cleaned.includes("min")) return 0.5;

  return 4; // default fallback
}

function convertToHours(value: number, unit: string): number {
  if (unit.startsWith("day")) return value * 24;
  if (unit.startsWith("min")) return value / 60;
  if (unit.startsWith("sec")) return value / 3600;
  return value; // hours
}

// ── Timing Parser ────────────────────────────────────────────────────────────

/**
 * Parses timing strings like "Morning + Evening", "30 min before bed",
 * "Monday + Thursday", etc. into injection hours within a given view.
 */
export function parseTimingToHours(timing: string, frequency: string, view: TimeView): number[] {
  const t = timing.toLowerCase();
  const f = frequency.toLowerCase();

  if (view === "daily") {
    return parseDailyTiming(t, f);
  }
  return parseWeeklyTiming(t, f);
}

function parseDailyTiming(timing: string, frequency: string): number[] {
  // "Morning + Evening" / "2x daily" / "AM/PM"
  if (timing.includes("morning") && timing.includes("evening")) return [8, 20];
  if (timing.includes("morning") && timing.includes("bedtime")) return [8, 22];
  if (timing.includes("am") && timing.includes("pm")) return [8, 20];
  if (frequency.includes("2x daily")) return [8, 20];
  if (frequency.includes("3x daily")) return [8, 14, 22];

  // "30 min before bed" / "bedtime"
  if (timing.includes("bed")) return [22];
  // "Post-workout or morning"
  if (timing.includes("morning") || timing.includes("post-workout")) return [8];
  // "Nightly"
  if (frequency.includes("nightly") || timing.includes("night")) return [22];

  // Default: once in the morning
  return [8];
}

function parseWeeklyTiming(timing: string, frequency: string): number[] {
  const hours: number[] = [];

  // Day mapping (hour offsets from start of week)
  const dayMap: Record<string, number> = {
    monday: 0,
    tuesday: 24,
    wednesday: 48,
    thursday: 72,
    friday: 96,
    saturday: 120,
    sunday: 144,
  };

  // Check for specific days mentioned
  const mentionedDays: number[] = [];
  for (const [day, offset] of Object.entries(dayMap)) {
    if (timing.includes(day)) {
      mentionedDays.push(offset);
    }
  }
  if (timing.includes("sunday morning")) {
    return [144 + 8];
  }

  if (mentionedDays.length > 0) {
    // For each mentioned day, parse the time-of-day
    const dailyHours = parseDailyTimingOfDay(timing);
    for (const dayOffset of mentionedDays) {
      for (const h of dailyHours) {
        hours.push(dayOffset + h);
      }
    }
    return hours;
  }

  // "Weekly" / "Same day each week"
  if (frequency.includes("weekly") || timing.includes("same day each week")) {
    const dailyHours = parseDailyTimingOfDay(timing);
    for (const h of dailyHours) {
      hours.push(h); // Monday by default
    }
    return hours;
  }

  // "2x per week"
  if (frequency.includes("2x per week") || frequency.includes("2x/week")) {
    const dailyHours = parseDailyTimingOfDay(timing);
    for (const h of dailyHours) {
      hours.push(0 + h);  // Monday
      hours.push(72 + h); // Thursday
    }
    return hours;
  }

  // "Daily" / "2x daily" / "Nightly"
  if (
    frequency.includes("daily") ||
    frequency.includes("nightly") ||
    frequency.includes("1x daily")
  ) {
    const dailyHours = parseDailyTimingOfDay(timing);
    for (let day = 0; day < 7; day++) {
      for (const h of dailyHours) {
        hours.push(day * 24 + h);
      }
    }
    return hours;
  }

  // Fallback: once Monday morning
  return [8];
}

function parseDailyTimingOfDay(timing: string): number[] {
  if (timing.includes("morning") && timing.includes("evening")) return [8, 20];
  if (timing.includes("morning") && timing.includes("bedtime")) return [8, 22];
  if (timing.includes("bed")) return [22];
  if (timing.includes("morning") || timing.includes("post-workout")) return [8];
  if (timing.includes("night")) return [22];
  return [8];
}

// ── Pharmacokinetic Math ─────────────────────────────────────────────────────

/** Exponential decay constant from half-life */
function decayConstant(halfLifeHours: number): number {
  return Math.LN2 / halfLifeHours;
}

/**
 * Concentration at time t from a single injection at time inj.
 * Uses a simple absorption-elimination model:
 * C(t) = (e^(-k_e * dt) - e^(-k_a * dt)) * normalization
 * where k_a is absorption rate (typically 3-5x elimination rate for subQ)
 */
function concentrationAtTime(
  t: number,
  injectionTime: number,
  halfLifeHours: number,
): number {
  const dt = t - injectionTime;
  if (dt < 0) return 0;

  const ke = decayConstant(halfLifeHours);
  // Absorption rate: faster than elimination, proportional to half-life
  const ka = ke * 5;

  // Two-compartment model (simplified)
  const elimComponent = Math.exp(-ke * dt);
  const absorbComponent = Math.exp(-ka * dt);
  const raw = elimComponent - absorbComponent;

  // Normalize so peak = 1.0
  // Peak time: t_peak = ln(ka/ke) / (ka - ke)
  const tPeak = Math.log(ka / ke) / (ka - ke);
  const peakVal = Math.exp(-ke * tPeak) - Math.exp(-ka * tPeak);

  return peakVal > 0 ? Math.max(0, raw / peakVal) : 0;
}

/** Total concentration from multiple injections */
function totalConcentration(
  t: number,
  injectionTimes: readonly number[],
  halfLifeHours: number,
): number {
  let total = 0;
  for (const inj of injectionTimes) {
    total += concentrationAtTime(t, inj, halfLifeHours);
  }
  return total;
}

// ── SVG Path Generation ──────────────────────────────────────────────────────

function generateCurvePath(
  points: readonly { x: number; y: number }[],
): string {
  if (points.length < 2) return "";

  let d = `M ${points[0]!.x} ${points[0]!.y}`;

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]!;
    const curr = points[i]!;
    const cpx = (prev.x + curr.x) / 2;
    d += ` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`;
  }

  return d;
}

function generateFillPath(
  points: readonly { x: number; y: number }[],
  baselineY: number,
): string {
  if (points.length < 2) return "";

  const curvePath = generateCurvePath(points);
  const lastPoint = points[points.length - 1]!;
  const firstPoint = points[0]!;

  return `${curvePath} L ${lastPoint.x} ${baselineY} L ${firstPoint.x} ${baselineY} Z`;
}

// ── Chart Dimensions ─────────────────────────────────────────────────────────

const CHART = {
  width: 800,
  height: 300,
  padding: { top: 30, right: 20, bottom: 40, left: 50 },
  get plotWidth() {
    return this.width - this.padding.left - this.padding.right;
  },
  get plotHeight() {
    return this.height - this.padding.top - this.padding.bottom;
  },
} as const;

// ── Multi-Compound Chart ─────────────────────────────────────────────────────

export function HalfLifeChart({
  compounds,
  defaultView = "daily",
  className = "",
}: HalfLifeChartProps) {
  const [view, setView] = useState<TimeView>(defaultView);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const totalHours = view === "daily" ? 24 : 168;
  const numSamples = view === "daily" ? 240 : 336;

  const xScale = useCallback(
    (hours: number) =>
      CHART.padding.left + (hours / totalHours) * CHART.plotWidth,
    [totalHours],
  );

  const yScale = useCallback(
    (concentration: number, maxConc: number) => {
      const clampedMax = Math.max(maxConc, 0.01);
      return (
        CHART.padding.top +
        CHART.plotHeight * (1 - Math.min(concentration / clampedMax, 1))
      );
    },
    [],
  );

  // Precompute all curve data
  const curveData = useMemo(() => {
    // Find global max concentration for normalization
    let globalMax = 0;

    const curveSamples = compounds.map((compound) => {
      const samples: { t: number; c: number }[] = [];
      for (let i = 0; i <= numSamples; i++) {
        const t = (i / numSamples) * totalHours;
        const c = totalConcentration(
          t,
          compound.injectionHours,
          compound.halfLifeHours,
        );
        samples.push({ t, c });
        if (c > globalMax) globalMax = c;
      }
      return samples;
    });

    return { curveSamples, globalMax };
  }, [compounds, totalHours, numSamples]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const svg = svgRef.current;
      if (!svg) return;

      const rect = svg.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * CHART.width;
      const mouseY = ((e.clientY - rect.top) / rect.height) * CHART.height;

      // Check if within plot area
      if (
        mouseX < CHART.padding.left ||
        mouseX > CHART.width - CHART.padding.right ||
        mouseY < CHART.padding.top ||
        mouseY > CHART.height - CHART.padding.bottom
      ) {
        setTooltip(null);
        return;
      }

      const timeHours =
        ((mouseX - CHART.padding.left) / CHART.plotWidth) * totalHours;

      const concentrations = compounds.map((compound) => {
        const c = totalConcentration(
          timeHours,
          compound.injectionHours,
          compound.halfLifeHours,
        );
        return {
          name: compound.name,
          value: c,
          color: LANE_CONFIG[compound.lane].color,
        };
      });

      setTooltip({
        x: mouseX,
        y: mouseY,
        timeHours,
        concentrations,
      });
    },
    [compounds, totalHours],
  );

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  // Time axis labels
  const timeLabels = useMemo(() => {
    if (view === "daily") {
      return [0, 4, 8, 12, 16, 20, 24].map((h) => ({
        hours: h,
        label: `${h.toString().padStart(2, "0")}:00`,
      }));
    }
    return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
      (day, i) => ({
        hours: i * 24 + 12,
        label: day,
      }),
    );
  }, [view]);

  // Grid lines
  const gridLines = useMemo(() => {
    if (view === "daily") {
      return [0, 4, 8, 12, 16, 20, 24];
    }
    return [0, 24, 48, 72, 96, 120, 144, 168];
  }, [view]);

  return (
    <div className={className}>
      {/* View toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5">
          {(["daily", "weekly"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background:
                  view === v ? "rgba(255, 107, 53, 0.15)" : "transparent",
                color: view === v ? "#ff6b35" : "#8888a0",
                border:
                  view === v
                    ? "1px solid rgba(255, 107, 53, 0.3)"
                    : "1px solid transparent",
              }}
            >
              {v === "daily" ? "24h" : "7 days"}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 flex-wrap">
          {compounds.map((compound) => {
            const config = LANE_CONFIG[compound.lane];
            return (
              <div key={compound.name} className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: config.color,
                    boxShadow: `0 0 6px ${config.color}60`,
                  }}
                />
                <span className="text-[10px] text-dc-text-muted">
                  {compound.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative w-full overflow-hidden rounded-xl">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${CHART.width} ${CHART.height}`}
          className="w-full h-auto"
          style={{ minHeight: 200 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            {/* Gradient fills for each compound */}
            {compounds.map((compound, idx) => {
              const color = LANE_CONFIG[compound.lane].color;
              return (
                <linearGradient
                  key={`fill-${idx}`}
                  id={`curve-fill-${idx}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={color} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              );
            })}

            {/* Glow filter */}
            <filter id="curve-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Therapeutic window gradient */}
            <linearGradient id="therapeutic-band" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00ff88" stopOpacity={0.06} />
              <stop offset="50%" stopColor="#00ff88" stopOpacity={0.1} />
              <stop offset="100%" stopColor="#00ff88" stopOpacity={0.06} />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {gridLines.map((h) => (
            <line
              key={`grid-${h}`}
              x1={xScale(h)}
              y1={CHART.padding.top}
              x2={xScale(h)}
              y2={CHART.height - CHART.padding.bottom}
              stroke="#2a2a3e"
              strokeWidth={0.5}
              strokeDasharray="4 4"
            />
          ))}

          {/* Horizontal grid */}
          {[0.25, 0.5, 0.75, 1.0].map((frac) => (
            <line
              key={`hgrid-${frac}`}
              x1={CHART.padding.left}
              y1={yScale(frac * curveData.globalMax, curveData.globalMax)}
              x2={CHART.width - CHART.padding.right}
              y2={yScale(frac * curveData.globalMax, curveData.globalMax)}
              stroke="#2a2a3e"
              strokeWidth={0.5}
              strokeDasharray="4 4"
            />
          ))}

          {/* Therapeutic window band (40%-80% of peak) */}
          <rect
            x={CHART.padding.left}
            y={yScale(0.8 * curveData.globalMax, curveData.globalMax)}
            width={CHART.plotWidth}
            height={
              yScale(0.4 * curveData.globalMax, curveData.globalMax) -
              yScale(0.8 * curveData.globalMax, curveData.globalMax)
            }
            fill="url(#therapeutic-band)"
            rx={4}
          />

          {/* Therapeutic window label */}
          <text
            x={CHART.width - CHART.padding.right - 4}
            y={
              yScale(0.6 * curveData.globalMax, curveData.globalMax) + 3
            }
            textAnchor="end"
            fill="#00ff88"
            fontSize={9}
            opacity={0.4}
            fontFamily="monospace"
          >
            therapeutic window
          </text>

          {/* Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1.0].map((frac) => (
            <text
              key={`ylabel-${frac}`}
              x={CHART.padding.left - 8}
              y={yScale(frac * curveData.globalMax, curveData.globalMax) + 3}
              textAnchor="end"
              fill="#4a4a6a"
              fontSize={9}
              fontFamily="monospace"
            >
              {Math.round(frac * 100)}%
            </text>
          ))}

          {/* X-axis labels */}
          {timeLabels.map((tl) => (
            <text
              key={`xlabel-${tl.hours}`}
              x={xScale(tl.hours)}
              y={CHART.height - CHART.padding.bottom + 16}
              textAnchor="middle"
              fill="#4a4a6a"
              fontSize={10}
              fontFamily="monospace"
            >
              {tl.label}
            </text>
          ))}

          {/* Y-axis title */}
          <text
            x={14}
            y={CHART.height / 2}
            textAnchor="middle"
            fill="#4a4a6a"
            fontSize={9}
            fontFamily="monospace"
            transform={`rotate(-90, 14, ${CHART.height / 2})`}
          >
            Concentration
          </text>

          {/* Injection time markers */}
          {compounds.map((compound, compIdx) => {
            const color = LANE_CONFIG[compound.lane].color;
            return compound.injectionHours
              .filter((h) => h >= 0 && h <= totalHours)
              .map((h, i) => (
                <g key={`inj-${compIdx}-${i}`}>
                  <line
                    x1={xScale(h)}
                    y1={CHART.padding.top}
                    x2={xScale(h)}
                    y2={CHART.height - CHART.padding.bottom}
                    stroke={color}
                    strokeWidth={1}
                    strokeDasharray="3 6"
                    opacity={0.35}
                  />
                  {/* Injection dot */}
                  <circle
                    cx={xScale(h)}
                    cy={CHART.height - CHART.padding.bottom}
                    r={3}
                    fill={color}
                    opacity={0.7}
                  />
                  {/* Tiny triangle marker */}
                  <polygon
                    points={`${xScale(h)},${CHART.height - CHART.padding.bottom - 6} ${xScale(h) - 3},${CHART.height - CHART.padding.bottom} ${xScale(h) + 3},${CHART.height - CHART.padding.bottom}`}
                    fill={color}
                    opacity={0.5}
                  />
                </g>
              ));
          })}

          {/* Curve fills */}
          {compounds.map((compound, compIdx) => {
            const samples = curveData.curveSamples[compIdx] ?? [];
            const points = samples.map((s) => ({
              x: xScale(s.t),
              y: yScale(s.c, curveData.globalMax),
            }));

            return (
              <path
                key={`fill-${compIdx}`}
                d={generateFillPath(
                  points,
                  CHART.height - CHART.padding.bottom,
                )}
                fill={`url(#curve-fill-${compIdx})`}
              />
            );
          })}

          {/* Curve lines */}
          {compounds.map((compound, compIdx) => {
            const color = LANE_CONFIG[compound.lane].color;
            const samples = curveData.curveSamples[compIdx] ?? [];
            const points = samples.map((s) => ({
              x: xScale(s.t),
              y: yScale(s.c, curveData.globalMax),
            }));

            return (
              <path
                key={`curve-${compIdx}`}
                d={generateCurvePath(points)}
                fill="none"
                stroke={color}
                strokeWidth={2}
                filter="url(#curve-glow)"
                strokeLinecap="round"
              />
            );
          })}

          {/* Peak labels */}
          {compounds.map((compound, compIdx) => {
            const color = LANE_CONFIG[compound.lane].color;
            const samples = curveData.curveSamples[compIdx] ?? [];
            // Find peak sample
            let peakSample = samples[0] ?? { t: 0, c: 0 };
            for (const s of samples) {
              if (s.c > peakSample.c) peakSample = s;
            }

            if (peakSample.c < 0.01) return null;

            const px = xScale(peakSample.t);
            const py = yScale(peakSample.c, curveData.globalMax);

            return (
              <g key={`label-${compIdx}`}>
                <circle
                  cx={px}
                  cy={py}
                  r={3}
                  fill={color}
                  stroke="#0a0a0f"
                  strokeWidth={1.5}
                />
                <text
                  x={px}
                  y={py - 10}
                  textAnchor="middle"
                  fill={color}
                  fontSize={9}
                  fontWeight={600}
                  fontFamily="Inter, sans-serif"
                >
                  {compound.name}
                </text>
              </g>
            );
          })}

          {/* Hover crosshair */}
          {tooltip && (
            <>
              <line
                x1={tooltip.x}
                y1={CHART.padding.top}
                x2={tooltip.x}
                y2={CHART.height - CHART.padding.bottom}
                stroke="#e8e8f0"
                strokeWidth={0.5}
                opacity={0.3}
                strokeDasharray="2 2"
              />
              {/* Hover dots on each curve */}
              {tooltip.concentrations.map((c, i) => {
                const cy = yScale(
                  c.value * curveData.globalMax,
                  curveData.globalMax,
                );
                return c.value > 0.001 ? (
                  <circle
                    key={`hover-dot-${i}`}
                    cx={tooltip.x}
                    cy={cy}
                    r={4}
                    fill={c.color}
                    stroke="#0a0a0f"
                    strokeWidth={1.5}
                  />
                ) : null;
              })}
            </>
          )}

          {/* Axes */}
          <line
            x1={CHART.padding.left}
            y1={CHART.height - CHART.padding.bottom}
            x2={CHART.width - CHART.padding.right}
            y2={CHART.height - CHART.padding.bottom}
            stroke="#2a2a3e"
            strokeWidth={1}
          />
          <line
            x1={CHART.padding.left}
            y1={CHART.padding.top}
            x2={CHART.padding.left}
            y2={CHART.height - CHART.padding.bottom}
            stroke="#2a2a3e"
            strokeWidth={1}
          />
        </svg>

        {/* HTML Tooltip overlay */}
        {tooltip && (
          <div
            className="absolute pointer-events-none z-10"
            style={{
              left: `${(tooltip.x / CHART.width) * 100}%`,
              top: `${(tooltip.y / CHART.height) * 100}%`,
              transform: `translate(${tooltip.x > CHART.width * 0.7 ? "-110%" : "10%"}, -50%)`,
            }}
          >
            <div
              className="rounded-lg px-3 py-2 text-[10px] border shadow-xl"
              style={{
                background: "rgba(10, 10, 15, 0.95)",
                borderColor: "rgba(42, 42, 62, 0.8)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div className="text-dc-text-muted font-mono mb-1.5">
                {formatTime(tooltip.timeHours, view)}
              </div>
              {tooltip.concentrations.map((c) => (
                <div
                  key={c.name}
                  className="flex items-center gap-2 py-0.5"
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: c.color }}
                  />
                  <span className="text-dc-text-muted">{c.name}</span>
                  <span
                    className="font-mono font-semibold ml-auto pl-3"
                    style={{ color: c.color }}
                  >
                    {Math.round(c.value * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Single Compound Chart (Accumulation View) ────────────────────────────────

export function SingleCompoundChart({
  name,
  halfLifeHours,
  lane,
  doseCount = 3,
  intervalHours,
  className = "",
}: SingleCompoundChartProps) {
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    timeHours: number;
    concentration: number;
  } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Default interval: dose every 2 half-lives (reasonable for accumulation demo)
  const interval = intervalHours ?? Math.max(halfLifeHours * 1.5, 4);

  const injectionTimes = useMemo(() => {
    return Array.from({ length: doseCount }, (_, i) => i * interval);
  }, [doseCount, interval]);

  // Total time: enough to show last dose decay to ~10%
  const totalHours = useMemo(() => {
    const lastInjection = injectionTimes[injectionTimes.length - 1] ?? 0;
    return lastInjection + halfLifeHours * 5;
  }, [injectionTimes, halfLifeHours]);

  const numSamples = 300;
  const color = LANE_CONFIG[lane].color;

  const xScale = useCallback(
    (hours: number) =>
      CHART.padding.left + (hours / totalHours) * CHART.plotWidth,
    [totalHours],
  );

  // Compute curve data
  const { samples, maxConc } = useMemo(() => {
    let peak = 0;
    const pts: { t: number; c: number }[] = [];
    for (let i = 0; i <= numSamples; i++) {
      const t = (i / numSamples) * totalHours;
      const c = totalConcentration(t, injectionTimes, halfLifeHours);
      pts.push({ t, c });
      if (c > peak) peak = c;
    }
    return { samples: pts, maxConc: peak };
  }, [totalHours, injectionTimes, halfLifeHours]);

  const yScale = useCallback(
    (concentration: number) => {
      const cMax = Math.max(maxConc, 0.01);
      return (
        CHART.padding.top +
        CHART.plotHeight * (1 - Math.min(concentration / cMax, 1))
      );
    },
    [maxConc],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const svg = svgRef.current;
      if (!svg) return;

      const rect = svg.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * CHART.width;
      const mouseY = ((e.clientY - rect.top) / rect.height) * CHART.height;

      if (
        mouseX < CHART.padding.left ||
        mouseX > CHART.width - CHART.padding.right
      ) {
        setTooltip(null);
        return;
      }

      const timeHours =
        ((mouseX - CHART.padding.left) / CHART.plotWidth) * totalHours;
      const concentration =
        totalConcentration(timeHours, injectionTimes, halfLifeHours) / maxConc;

      setTooltip({
        x: mouseX,
        y: mouseY,
        timeHours,
        concentration,
      });
    },
    [totalHours, injectionTimes, halfLifeHours, maxConc],
  );

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  const points = samples.map((s) => ({
    x: xScale(s.t),
    y: yScale(s.c),
  }));

  // Time labels: auto-generate based on total hours
  const timeLabels = useMemo(() => {
    const labels: { hours: number; label: string }[] = [];
    const step = totalHours <= 24 ? 4 : totalHours <= 72 ? 12 : totalHours <= 168 ? 24 : 48;
    for (let h = 0; h <= totalHours; h += step) {
      if (totalHours <= 48) {
        labels.push({ hours: h, label: `${h}h` });
      } else {
        const days = Math.floor(h / 24);
        const rem = h % 24;
        labels.push({
          hours: h,
          label: rem === 0 ? `Day ${days}` : `${days}d ${rem}h`,
        });
      }
    }
    return labels;
  }, [totalHours]);

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-1.5">
          <div
            className="w-2 h-2 rounded-full"
            style={{
              background: color,
              boxShadow: `0 0 6px ${color}60`,
            }}
          />
          <span className="text-xs text-dc-text-muted font-medium">
            {doseCount} doses &middot; every{" "}
            {interval < 24
              ? `${Math.round(interval)}h`
              : `${(interval / 24).toFixed(1)}d`}
          </span>
        </div>
        <span className="text-[10px] text-dc-text-faint">
          t&frac12; = {halfLifeHours < 1 ? `${Math.round(halfLifeHours * 60)}min` : halfLifeHours < 24 ? `${halfLifeHours.toFixed(1)}h` : `${(halfLifeHours / 24).toFixed(1)}d`}
        </span>
      </div>

      {/* SVG */}
      <div className="relative w-full overflow-hidden rounded-xl">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${CHART.width} ${CHART.height}`}
          className="w-full h-auto"
          style={{ minHeight: 180 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            <linearGradient
              id="single-curve-fill"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
            <filter
              id="single-curve-glow"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient
              id="single-therapeutic-band"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor="#00ff88" stopOpacity={0.06} />
              <stop offset="50%" stopColor="#00ff88" stopOpacity={0.1} />
              <stop offset="100%" stopColor="#00ff88" stopOpacity={0.06} />
            </linearGradient>
          </defs>

          {/* Vertical grid */}
          {timeLabels.map((tl) => (
            <line
              key={`grid-${tl.hours}`}
              x1={xScale(tl.hours)}
              y1={CHART.padding.top}
              x2={xScale(tl.hours)}
              y2={CHART.height - CHART.padding.bottom}
              stroke="#2a2a3e"
              strokeWidth={0.5}
              strokeDasharray="4 4"
            />
          ))}

          {/* Horizontal grid */}
          {[0.25, 0.5, 0.75, 1.0].map((frac) => (
            <line
              key={`hgrid-${frac}`}
              x1={CHART.padding.left}
              y1={yScale(frac * maxConc)}
              x2={CHART.width - CHART.padding.right}
              y2={yScale(frac * maxConc)}
              stroke="#2a2a3e"
              strokeWidth={0.5}
              strokeDasharray="4 4"
            />
          ))}

          {/* Therapeutic window */}
          <rect
            x={CHART.padding.left}
            y={yScale(0.8 * maxConc)}
            width={CHART.plotWidth}
            height={yScale(0.4 * maxConc) - yScale(0.8 * maxConc)}
            fill="url(#single-therapeutic-band)"
            rx={4}
          />

          <text
            x={CHART.width - CHART.padding.right - 4}
            y={yScale(0.6 * maxConc) + 3}
            textAnchor="end"
            fill="#00ff88"
            fontSize={9}
            opacity={0.4}
            fontFamily="monospace"
          >
            therapeutic window
          </text>

          {/* Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1.0].map((frac) => (
            <text
              key={`ylabel-${frac}`}
              x={CHART.padding.left - 8}
              y={yScale(frac * maxConc) + 3}
              textAnchor="end"
              fill="#4a4a6a"
              fontSize={9}
              fontFamily="monospace"
            >
              {Math.round(frac * 100)}%
            </text>
          ))}

          {/* X-axis labels */}
          {timeLabels.map((tl) => (
            <text
              key={`xlabel-${tl.hours}`}
              x={xScale(tl.hours)}
              y={CHART.height - CHART.padding.bottom + 16}
              textAnchor="middle"
              fill="#4a4a6a"
              fontSize={10}
              fontFamily="monospace"
            >
              {tl.label}
            </text>
          ))}

          {/* Injection markers */}
          {injectionTimes.map((h, i) => (
            <g key={`inj-${i}`}>
              <line
                x1={xScale(h)}
                y1={CHART.padding.top}
                x2={xScale(h)}
                y2={CHART.height - CHART.padding.bottom}
                stroke={color}
                strokeWidth={1}
                strokeDasharray="3 6"
                opacity={0.4}
              />
              <polygon
                points={`${xScale(h)},${CHART.height - CHART.padding.bottom - 6} ${xScale(h) - 3},${CHART.height - CHART.padding.bottom} ${xScale(h) + 3},${CHART.height - CHART.padding.bottom}`}
                fill={color}
                opacity={0.6}
              />
              <text
                x={xScale(h)}
                y={CHART.height - CHART.padding.bottom + 28}
                textAnchor="middle"
                fill={color}
                fontSize={8}
                fontFamily="monospace"
                opacity={0.7}
              >
                Dose {i + 1}
              </text>
            </g>
          ))}

          {/* Curve fill */}
          <path
            d={generateFillPath(
              points,
              CHART.height - CHART.padding.bottom,
            )}
            fill="url(#single-curve-fill)"
          />

          {/* Curve line */}
          <path
            d={generateCurvePath(points)}
            fill="none"
            stroke={color}
            strokeWidth={2.5}
            filter="url(#single-curve-glow)"
            strokeLinecap="round"
          />

          {/* Accumulation label at peaks */}
          {injectionTimes.map((injTime, i) => {
            // Find peak near this injection
            const searchStart = injTime;
            const searchEnd = i < injectionTimes.length - 1 ? injectionTimes[i + 1]! : totalHours;
            let peakC = 0;
            let peakT = injTime;
            for (const s of samples) {
              if (s.t >= searchStart && s.t <= searchEnd && s.c > peakC) {
                peakC = s.c;
                peakT = s.t;
              }
            }

            if (peakC < 0.01 || i === 0) return null;
            const accumulationPct = Math.round((peakC / (samples.find(s => {
              // Find first peak
              const firstEnd = injectionTimes[1] ?? totalHours;
              return s.t > injectionTimes[0]! && s.t < firstEnd;
            })?.c ?? peakC)) * 100);

            if (accumulationPct <= 105) return null;

            return (
              <text
                key={`acc-${i}`}
                x={xScale(peakT)}
                y={yScale(peakC) - 10}
                textAnchor="middle"
                fill={color}
                fontSize={9}
                fontWeight={600}
                fontFamily="Inter, sans-serif"
              >
                {accumulationPct}%
              </text>
            );
          })}

          {/* Hover crosshair */}
          {tooltip && (
            <>
              <line
                x1={tooltip.x}
                y1={CHART.padding.top}
                x2={tooltip.x}
                y2={CHART.height - CHART.padding.bottom}
                stroke="#e8e8f0"
                strokeWidth={0.5}
                opacity={0.3}
                strokeDasharray="2 2"
              />
              <circle
                cx={tooltip.x}
                cy={yScale(tooltip.concentration * maxConc)}
                r={4}
                fill={color}
                stroke="#0a0a0f"
                strokeWidth={1.5}
              />
            </>
          )}

          {/* Axes */}
          <line
            x1={CHART.padding.left}
            y1={CHART.height - CHART.padding.bottom}
            x2={CHART.width - CHART.padding.right}
            y2={CHART.height - CHART.padding.bottom}
            stroke="#2a2a3e"
            strokeWidth={1}
          />
          <line
            x1={CHART.padding.left}
            y1={CHART.padding.top}
            x2={CHART.padding.left}
            y2={CHART.height - CHART.padding.bottom}
            stroke="#2a2a3e"
            strokeWidth={1}
          />
        </svg>

        {/* HTML Tooltip */}
        {tooltip && (
          <div
            className="absolute pointer-events-none z-10"
            style={{
              left: `${(tooltip.x / CHART.width) * 100}%`,
              top: `${(tooltip.y / CHART.height) * 100}%`,
              transform: `translate(${tooltip.x > CHART.width * 0.7 ? "-110%" : "10%"}, -50%)`,
            }}
          >
            <div
              className="rounded-lg px-3 py-2 text-[10px] border shadow-xl"
              style={{
                background: "rgba(10, 10, 15, 0.95)",
                borderColor: "rgba(42, 42, 62, 0.8)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div className="text-dc-text-muted font-mono mb-1">
                {formatHoursCompact(tooltip.timeHours)}
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: color }}
                />
                <span className="text-dc-text-muted">{name}</span>
                <span
                  className="font-mono font-semibold ml-auto pl-3"
                  style={{ color }}
                >
                  {Math.round(tooltip.concentration * 100)}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(hours: number, view: TimeView): string {
  if (view === "daily") {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  }
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dayIndex = Math.min(Math.floor(hours / 24), 6);
  const dayHour = hours % 24;
  const h = Math.floor(dayHour);
  return `${days[dayIndex]} ${h.toString().padStart(2, "0")}:00`;
}

function formatHoursCompact(hours: number): string {
  if (hours < 24) {
    return `${hours.toFixed(1)}h`;
  }
  const days = Math.floor(hours / 24);
  const rem = hours % 24;
  return `Day ${days}, ${Math.floor(rem)}h`;
}
