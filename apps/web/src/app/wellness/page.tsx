"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Heart,
  TrendingUp,
  TrendingDown,
  Moon,
  Zap,
  Smile,
  Scale,
  FileText,
  Minus,
} from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWellnessStore } from "@/stores/wellness";
import type { WellnessEntry } from "@/types";
import clsx from "clsx";

// ── Constants ──

const MOOD_OPTIONS = [
  { value: 1, emoji: "\uD83D\uDE29", label: "Awful" },
  { value: 2, emoji: "\uD83D\uDE1E", label: "Bad" },
  { value: 3, emoji: "\uD83D\uDE10", label: "Ok" },
  { value: 4, emoji: "\uD83D\uDE0A", label: "Good" },
  { value: 5, emoji: "\uD83D\uDE04", label: "Great" },
] as const;

const ENERGY_OPTIONS = [
  { value: 1, emoji: "\uD83E\uDEAB", label: "Dead" },
  { value: 2, emoji: "\uD83D\uDE34", label: "Low" },
  { value: 3, emoji: "\uD83D\uDE42", label: "Ok" },
  { value: 4, emoji: "\u26A1", label: "Good" },
  { value: 5, emoji: "\uD83D\uDD25", label: "Wired" },
] as const;

const SLEEP_QUALITY_OPTIONS = [
  { value: 1, emoji: "\uD83D\uDE35", label: "Terrible" },
  { value: 2, emoji: "\uD83D\uDE1F", label: "Poor" },
  { value: 3, emoji: "\uD83D\uDE34", label: "Fair" },
  { value: 4, emoji: "\uD83D\uDE0C", label: "Good" },
  { value: 5, emoji: "\uD83C\uDF1F", label: "Perfect" },
] as const;

const RANGE_OPTIONS = [7, 14, 30, 90] as const;
type RangeDays = (typeof RANGE_OPTIONS)[number];

const CHART_COLORS = {
  mood: "#00ff88",
  energy: "#ffaa00",
  sleepQuality: "#00d4ff",
  weight: "#ff6b35",
  sleepHours: "#00d4ff",
} as const;

// ── Helpers ──

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDateLabel(dateStr: string): string {
  const [, m, d] = dateStr.split("-");
  return `${parseInt(m)}/${parseInt(d)}`;
}

// ── Canvas Chart Drawing ──

interface ChartLine {
  readonly label: string;
  readonly color: string;
  readonly data: readonly (number | null)[];
}

function drawLineChart(
  canvas: HTMLCanvasElement,
  labels: readonly string[],
  lines: readonly ChartLine[],
  yMin: number,
  yMax: number,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const w = rect.width;
  const h = rect.height;
  const padLeft = 38;
  const padRight = 12;
  const padTop = 12;
  const padBottom = 28;
  const chartW = w - padLeft - padRight;
  const chartH = h - padTop - padBottom;

  // Clear
  ctx.clearRect(0, 0, w, h);

  // Grid lines
  const ySteps = 5;
  ctx.strokeStyle = "rgba(255,255,255,0.04)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= ySteps; i++) {
    const y = padTop + (chartH / ySteps) * i;
    ctx.beginPath();
    ctx.moveTo(padLeft, y);
    ctx.lineTo(w - padRight, y);
    ctx.stroke();

    // Y labels
    const val = yMax - ((yMax - yMin) / ySteps) * i;
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.font = "10px system-ui, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(
      Number.isInteger(val) ? String(val) : val.toFixed(1),
      padLeft - 6,
      y + 3,
    );
  }

  // X labels
  const maxXLabels = Math.min(labels.length, 15);
  const labelStep = Math.max(1, Math.floor(labels.length / maxXLabels));
  ctx.fillStyle = "rgba(255,255,255,0.25)";
  ctx.font = "10px system-ui, sans-serif";
  ctx.textAlign = "center";
  for (let i = 0; i < labels.length; i += labelStep) {
    const x = padLeft + (chartW / Math.max(labels.length - 1, 1)) * i;
    ctx.fillText(labels[i], x, h - 6);
  }

  // Draw each line
  for (const line of lines) {
    const points: { x: number; y: number }[] = [];
    for (let i = 0; i < line.data.length; i++) {
      const val = line.data[i];
      if (val === null) continue;
      const x = padLeft + (chartW / Math.max(line.data.length - 1, 1)) * i;
      const yNorm = (val - yMin) / (yMax - yMin || 1);
      const y = padTop + chartH - yNorm * chartH;
      points.push({ x, y });
    }

    if (points.length < 2) continue;

    // Gradient fill
    const gradient = ctx.createLinearGradient(0, padTop, 0, padTop + chartH);
    gradient.addColorStop(0, line.color + "30");
    gradient.addColorStop(1, line.color + "00");

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpx = (prev.x + curr.x) / 2;
      ctx.bezierCurveTo(cpx, prev.y, cpx, curr.y, curr.x, curr.y);
    }
    // Close for fill
    ctx.lineTo(points[points.length - 1].x, padTop + chartH);
    ctx.lineTo(points[0].x, padTop + chartH);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpx = (prev.x + curr.x) / 2;
      ctx.bezierCurveTo(cpx, prev.y, cpx, curr.y, curr.x, curr.y);
    }
    ctx.strokeStyle = line.color;
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();

    // Dot markers
    for (const pt of points) {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = line.color;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = "#0d0d1a";
      ctx.fill();
    }
  }
}

// ── Scale Selector Component ──

function ScaleSelector({
  options,
  value,
  onChange,
  activeColor,
}: {
  readonly options: readonly { readonly value: number; readonly emoji: string; readonly label: string }[];
  readonly value: number;
  readonly onChange: (v: number) => void;
  readonly activeColor: string;
}) {
  return (
    <div className="flex gap-2">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={clsx(
              "flex-1 flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl border text-center transition-all duration-200",
              active
                ? "border-transparent"
                : "border-dc-border hover:border-white/10 hover:bg-dc-surface-alt/40",
            )}
            style={
              active
                ? {
                    backgroundColor: `${activeColor}15`,
                    borderColor: `${activeColor}40`,
                    boxShadow: `0 0 16px ${activeColor}20`,
                  }
                : undefined
            }
          >
            <span className="text-lg leading-none">{opt.emoji}</span>
            <span
              className={clsx(
                "text-[10px] font-medium",
                active ? "text-dc-text" : "text-dc-text-muted",
              )}
            >
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ── Chart Wrapper Component ──

function WellnessChart({
  entries,
  lines,
  yMin,
  yMax,
}: {
  readonly entries: readonly WellnessEntry[];
  readonly lines: readonly {
    readonly label: string;
    readonly color: string;
    readonly key: keyof WellnessEntry;
  }[];
  readonly yMin: number;
  readonly yMax: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    if (!canvasRef.current || entries.length === 0) return;
    const labels = entries.map((e) => formatDateLabel(e.date));
    const chartLines: ChartLine[] = lines.map((l) => ({
      label: l.label,
      color: l.color,
      data: entries.map((e) => {
        const v = e[l.key];
        return typeof v === "number" ? v : null;
      }),
    }));
    drawLineChart(canvasRef.current, labels, chartLines, yMin, yMax);
  }, [entries, lines, yMin, yMax]);

  useEffect(() => {
    draw();
    const handleResize = () => draw();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [draw]);

  if (entries.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-dc-text-faint text-sm">
        No data yet. Log your first entry above.
      </div>
    );
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        className="w-full h-48"
        style={{ display: "block" }}
      />
      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-dc-border">
        {lines.map((l) => (
          <div key={l.key} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: l.color }}
            />
            <span className="text-[10px] text-dc-text-muted">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Snapshot Card Component ──

function SnapshotCard({
  label,
  todayVal,
  avgVal,
  unit,
  color,
  icon: Icon,
}: {
  readonly label: string;
  readonly todayVal: number | null;
  readonly avgVal: number | null;
  readonly unit: string;
  readonly color: string;
  readonly icon: typeof Heart;
}) {
  const diff =
    todayVal !== null && avgVal !== null && avgVal !== 0
      ? todayVal - avgVal
      : null;

  return (
    <Card>
      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}15` }}
        >
          <Icon className="w-4.5 h-4.5" style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-dc-text-muted uppercase tracking-wide">
            {label}
          </p>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span
              className="text-xl font-bold leading-none mono"
              style={{ color: todayVal !== null ? color : undefined }}
            >
              {todayVal !== null ? todayVal : "--"}
            </span>
            <span className="text-[10px] text-dc-text-faint">{unit}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[9px] text-dc-text-faint">
              7d avg: {avgVal !== null ? avgVal : "--"}
            </span>
            {diff !== null && diff !== 0 && (
              <span
                className={clsx(
                  "text-[9px] font-medium mono flex items-center gap-0.5",
                  diff > 0 ? "text-dc-neon-green" : "text-dc-danger",
                )}
              >
                {diff > 0 ? (
                  <TrendingUp className="w-2.5 h-2.5" />
                ) : (
                  <TrendingDown className="w-2.5 h-2.5" />
                )}
                {diff > 0 ? "+" : ""}
                {Math.round(diff * 10) / 10}
              </span>
            )}
            {diff === null || diff === 0 ? (
              <span className="text-[9px] text-dc-text-faint flex items-center gap-0.5">
                <Minus className="w-2.5 h-2.5" />
                same
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Main Page ──

export default function WellnessPage() {
  const { addEntry, getEntriesForRange, getTodayEntry, getAverages } =
    useWellnessStore();

  const [range, setRange] = useState<RangeDays>(14);
  const [logSuccess, setLogSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Form state
  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [sleepQuality, setSleepQuality] = useState(3);
  const [sleepHours, setSleepHours] = useState("");
  const [weight, setWeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [notes, setNotes] = useState("");

  // Hydration guard for SSR + localStorage
  useEffect(() => setMounted(true), []);

  const entries = mounted ? getEntriesForRange(range) : [];
  const todayEntry = mounted ? getTodayEntry() : undefined;
  const avg7 = mounted ? getAverages(7) : null;

  // Pre-fill form with today's entry
  useEffect(() => {
    if (todayEntry) {
      setMood(todayEntry.mood);
      setEnergy(todayEntry.energy);
      setSleepQuality(todayEntry.sleepQuality);
      setSleepHours(String(todayEntry.sleepHours));
      setWeight(todayEntry.weight !== null ? String(todayEntry.weight) : "");
      setBodyFat(
        todayEntry.bodyFat !== null ? String(todayEntry.bodyFat) : "",
      );
      setNotes(todayEntry.notes);
    }
  }, [todayEntry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedSleepHours = parseFloat(sleepHours);
    if (isNaN(parsedSleepHours) || parsedSleepHours < 0 || parsedSleepHours > 16) return;

    addEntry({
      date: todayStr(),
      mood,
      energy,
      sleepQuality,
      sleepHours: parsedSleepHours,
      weight: weight ? parseFloat(weight) : null,
      bodyFat: bodyFat ? parseFloat(bodyFat) : null,
      notes,
    });

    setLogSuccess(true);
    setTimeout(() => setLogSuccess(false), 3000);
  };

  // Compute averages for charts
  const rangeAvg = mounted ? getAverages(range) : null;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,107,53,0.2) 0%, rgba(0,255,136,0.1) 100%)",
          }}
        >
          <Heart className="w-5 h-5 text-dc-accent" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-dc-text tracking-tight">
            Wellness Tracker
          </h1>
          <p className="text-xs text-dc-text-muted">
            Track mood, energy, sleep & body metrics daily
          </p>
        </div>
      </div>

      {/* Today's Snapshot Cards */}
      {mounted && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <SnapshotCard
            label="Mood"
            todayVal={todayEntry?.mood ?? null}
            avgVal={avg7?.mood ?? null}
            unit="/5"
            color={CHART_COLORS.mood}
            icon={Smile}
          />
          <SnapshotCard
            label="Energy"
            todayVal={todayEntry?.energy ?? null}
            avgVal={avg7?.energy ?? null}
            unit="/5"
            color={CHART_COLORS.energy}
            icon={Zap}
          />
          <SnapshotCard
            label="Sleep Quality"
            todayVal={todayEntry?.sleepQuality ?? null}
            avgVal={avg7?.sleepQuality ?? null}
            unit="/5"
            color={CHART_COLORS.sleepQuality}
            icon={Moon}
          />
          <SnapshotCard
            label="Sleep Hours"
            todayVal={todayEntry?.sleepHours ?? null}
            avgVal={avg7?.sleepHours ?? null}
            unit="hrs"
            color={CHART_COLORS.sleepHours}
            icon={Moon}
          />
          <SnapshotCard
            label="Weight"
            todayVal={todayEntry?.weight ?? null}
            avgVal={avg7?.weight ?? null}
            unit="lbs"
            color={CHART_COLORS.weight}
            icon={Scale}
          />
          <SnapshotCard
            label="Body Fat"
            todayVal={todayEntry?.bodyFat ?? null}
            avgVal={avg7?.bodyFat ?? null}
            unit="%"
            color="#b366ff"
            icon={TrendingDown}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Charts */}
        <div className="lg:col-span-2 space-y-5">
          {/* Range Toggle + Overview Chart */}
          <Card>
            <div className="flex items-center justify-between mb-5">
              <div>
                <CardTitle>Wellness Trends</CardTitle>
                <p className="text-xs text-dc-text-muted mt-0.5">
                  Mood, energy & sleep quality over time
                </p>
              </div>
              <div className="flex items-center gap-1 p-1 rounded-xl bg-dc-surface border border-dc-border">
                {RANGE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setRange(opt)}
                    className={clsx(
                      "px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all",
                      range === opt
                        ? "bg-dc-accent/15 text-dc-accent"
                        : "text-dc-text-muted hover:text-dc-text",
                    )}
                  >
                    {opt}d
                  </button>
                ))}
              </div>
            </div>

            {mounted && (
              <WellnessChart
                entries={entries}
                lines={[
                  { label: "Mood", color: CHART_COLORS.mood, key: "mood" },
                  {
                    label: "Energy",
                    color: CHART_COLORS.energy,
                    key: "energy",
                  },
                  {
                    label: "Sleep Qlty",
                    color: CHART_COLORS.sleepQuality,
                    key: "sleepQuality",
                  },
                ]}
                yMin={0}
                yMax={5.5}
              />
            )}

            {/* Averages bar */}
            {mounted && rangeAvg && entries.length > 0 && (
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-dc-border">
                <span className="text-[9px] text-dc-text-faint uppercase tracking-wide">
                  {range}d Avg:
                </span>
                {[
                  { label: "Mood", val: rangeAvg.mood, color: CHART_COLORS.mood },
                  { label: "Energy", val: rangeAvg.energy, color: CHART_COLORS.energy },
                  { label: "Sleep", val: rangeAvg.sleepQuality, color: CHART_COLORS.sleepQuality },
                ].map((m) => (
                  <Badge key={m.label} variant="neutral" size="xs">
                    <span className="mr-1" style={{ color: m.color }}>
                      {m.val}
                    </span>
                    {m.label}
                  </Badge>
                ))}
              </div>
            )}
          </Card>

          {/* Weight Chart */}
          <Card>
            <div className="flex items-center justify-between mb-5">
              <div>
                <CardTitle>Weight Trend</CardTitle>
                <p className="text-xs text-dc-text-muted mt-0.5">
                  Body weight over {range} days
                </p>
              </div>
              {mounted && rangeAvg !== null && rangeAvg.weight !== null && (
                <Badge variant="neutral" size="xs">
                  Avg:{" "}
                  <span className="text-dc-accent ml-1 font-bold">
                    {rangeAvg.weight} lbs
                  </span>
                </Badge>
              )}
            </div>

            {mounted && (
              <WellnessChart
                entries={entries}
                lines={[
                  {
                    label: "Weight (lbs)",
                    color: CHART_COLORS.weight,
                    key: "weight",
                  },
                ]}
                yMin={
                  Math.floor(
                    Math.min(
                      ...entries
                        .map((e) => e.weight)
                        .filter((v): v is number => v !== null),
                      200,
                    ) - 5,
                  )
                }
                yMax={
                  Math.ceil(
                    Math.max(
                      ...entries
                        .map((e) => e.weight)
                        .filter((v): v is number => v !== null),
                      200,
                    ) + 5,
                  )
                }
              />
            )}
          </Card>

          {/* Sleep Hours Chart */}
          <Card>
            <div className="flex items-center justify-between mb-5">
              <div>
                <CardTitle>Sleep Duration</CardTitle>
                <p className="text-xs text-dc-text-muted mt-0.5">
                  Hours of sleep over {range} days
                </p>
              </div>
              {mounted && rangeAvg && (
                <Badge variant="neutral" size="xs">
                  Avg:{" "}
                  <span className="text-dc-neon-cyan ml-1 font-bold">
                    {rangeAvg.sleepHours} hrs
                  </span>
                </Badge>
              )}
            </div>

            {mounted && (
              <WellnessChart
                entries={entries}
                lines={[
                  {
                    label: "Sleep (hrs)",
                    color: CHART_COLORS.sleepHours,
                    key: "sleepHours",
                  },
                ]}
                yMin={0}
                yMax={12}
              />
            )}
          </Card>
        </div>

        {/* Right: Entry Form */}
        <div className="space-y-5">
          <Card>
            <div className="flex items-center gap-2 mb-5">
              <FileText className="w-4.5 h-4.5 text-dc-accent" />
              <CardTitle>
                {todayEntry ? "Update Today" : "Log Today"}
              </CardTitle>
              {todayEntry && (
                <Badge variant="success" size="xs">
                  Logged
                </Badge>
              )}
            </div>

            {logSuccess && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-dc-neon-green/10 border border-dc-neon-green/20 mb-4 text-dc-neon-green text-sm">
                <Heart className="w-4 h-4" />
                Entry saved successfully!
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Mood */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-dc-text-muted uppercase tracking-wide flex items-center gap-1.5">
                  <Smile className="w-3 h-3" style={{ color: CHART_COLORS.mood }} />
                  Mood
                </label>
                <ScaleSelector
                  options={MOOD_OPTIONS}
                  value={mood}
                  onChange={setMood}
                  activeColor={CHART_COLORS.mood}
                />
              </div>

              {/* Energy */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-dc-text-muted uppercase tracking-wide flex items-center gap-1.5">
                  <Zap className="w-3 h-3" style={{ color: CHART_COLORS.energy }} />
                  Energy
                </label>
                <ScaleSelector
                  options={ENERGY_OPTIONS}
                  value={energy}
                  onChange={setEnergy}
                  activeColor={CHART_COLORS.energy}
                />
              </div>

              {/* Sleep Quality */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-dc-text-muted uppercase tracking-wide flex items-center gap-1.5">
                  <Moon className="w-3 h-3" style={{ color: CHART_COLORS.sleepQuality }} />
                  Sleep Quality
                </label>
                <ScaleSelector
                  options={SLEEP_QUALITY_OPTIONS}
                  value={sleepQuality}
                  onChange={setSleepQuality}
                  activeColor={CHART_COLORS.sleepQuality}
                />
              </div>

              {/* Sleep Hours */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-dc-text-muted uppercase tracking-wide">
                  Sleep Hours
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="16"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(e.target.value)}
                  required
                  placeholder="7.5"
                  className="w-full px-3 py-2.5 rounded-xl text-sm text-dc-text bg-dc-surface border border-dc-border placeholder:text-dc-text-muted/40 focus:outline-none focus:border-dc-accent focus:ring-2 focus:ring-dc-accent/15 transition-all"
                />
              </div>

              {/* Weight + Body Fat */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-dc-text-muted uppercase tracking-wide">
                    Weight (lbs)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="50"
                    max="500"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="185"
                    className="w-full px-3 py-2.5 rounded-xl text-sm text-dc-text bg-dc-surface border border-dc-border placeholder:text-dc-text-muted/40 focus:outline-none focus:border-dc-accent focus:ring-2 focus:ring-dc-accent/15 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-dc-text-muted uppercase tracking-wide">
                    Body Fat %
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="2"
                    max="60"
                    value={bodyFat}
                    onChange={(e) => setBodyFat(e.target.value)}
                    placeholder="15"
                    className="w-full px-3 py-2.5 rounded-xl text-sm text-dc-text bg-dc-surface border border-dc-border placeholder:text-dc-text-muted/40 focus:outline-none focus:border-dc-accent focus:ring-2 focus:ring-dc-accent/15 transition-all"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-dc-text-muted uppercase tracking-wide">
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="How are you feeling today?"
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl text-sm text-dc-text bg-dc-surface border border-dc-border placeholder:text-dc-text-muted/40 focus:outline-none focus:border-dc-accent focus:ring-2 focus:ring-dc-accent/15 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all hover:brightness-110"
                style={{
                  background:
                    "linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%)",
                  boxShadow: "0 4px 16px rgba(255,107,53,0.25)",
                }}
              >
                <Heart className="w-4 h-4" />
                {todayEntry ? "Update Entry" : "Log Entry"}
              </button>
            </form>
          </Card>

          {/* Recent Entries */}
          {mounted && entries.length > 0 && (
            <Card>
              <CardTitle className="mb-4">Recent Entries</CardTitle>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {entries
                  .toReversed()
                  .slice(0, 10)
                  .map((entry) => (
                    <div
                      key={entry.id}
                      className={clsx(
                        "flex items-center justify-between px-3 py-2.5 rounded-xl border transition-colors",
                        entry.date === todayStr()
                          ? "bg-dc-accent/5 border-dc-accent/20"
                          : "border-dc-border hover:bg-dc-surface-alt/40",
                      )}
                    >
                      <div>
                        <p className="text-xs font-medium text-dc-text">
                          {formatDateLabel(entry.date)}
                          {entry.date === todayStr() && (
                            <span className="text-dc-accent ml-1.5 text-[9px]">
                              today
                            </span>
                          )}
                        </p>
                        {entry.notes && (
                          <p className="text-[9px] text-dc-text-faint mt-0.5 truncate max-w-[140px]">
                            {entry.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] mono" style={{ color: CHART_COLORS.mood }}>
                          {MOOD_OPTIONS[entry.mood - 1]?.emoji}
                        </span>
                        <span className="text-[10px] mono" style={{ color: CHART_COLORS.energy }}>
                          {ENERGY_OPTIONS[entry.energy - 1]?.emoji}
                        </span>
                        <span className="text-[10px] mono text-dc-text-muted">
                          {entry.sleepHours}h
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
