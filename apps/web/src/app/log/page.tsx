"use client";

import { useState } from "react";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DoseChecklist } from "@/components/tracking/dose-checklist";
import {
  CalendarDays,
  TrendingDown,
  Activity,
  Moon,
  Zap,
  Dumbbell,
  Save,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { MOCK_DAILY_DOSES, MOCK_OUTCOMES } from "@/lib/mock-data";

const METRIC_SLIDERS = [
  { key: "mood", label: "Mood", icon: Activity, color: "#00ff88", max: 10 },
  { key: "sleep", label: "Sleep Quality", icon: Moon, color: "#b366ff", max: 10 },
  { key: "energy", label: "Energy", icon: Zap, color: "#ffaa00", max: 10 },
  { key: "soreness", label: "Soreness", icon: Dumbbell, color: "#ff4444", max: 10 },
] as const;

interface OutcomeEntry {
  weight: string;
  bodyFat: string;
  mood: number;
  sleep: number;
  energy: number;
  soreness: number;
  notes: string;
}

function loadOutcome(dateStr: string): OutcomeEntry {
  const existing = MOCK_OUTCOMES.find((o) => o.date === dateStr);
  return {
    weight: existing?.weight?.toString() ?? "",
    bodyFat: existing?.bodyFat?.toString() ?? "",
    mood: existing?.mood ?? 5,
    sleep: existing?.sleep ?? 5,
    energy: existing?.energy ?? 5,
    soreness: existing?.soreness ?? 5,
    notes: existing?.notes ?? "",
  };
}

export default function LogPage() {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [saved, setSaved] = useState(false);

  const dateStr = selectedDate.toISOString().slice(0, 10);
  const isToday = dateStr === today.toISOString().slice(0, 10);

  const [outcome, setOutcome] = useState<OutcomeEntry>(
    loadOutcome(dateStr),
  );

  const shiftDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
    setSaved(false);
    const newDateStr = newDate.toISOString().slice(0, 10);
    setOutcome(loadOutcome(newDateStr));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateOutcome = (key: keyof OutcomeEntry, value: string | number) => {
    setOutcome((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header with Date Nav */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dc-text">Daily Log</h1>
          <p className="text-sm text-dc-text-muted mt-1">
            Track doses and outcomes for better insights.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => shiftDate(-1)}
            className="w-8 h-8 rounded-lg bg-dc-surface border border-dc-border flex items-center justify-center text-dc-text-muted hover:text-dc-text transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dc-surface border border-dc-border">
            <CalendarDays className="w-4 h-4 text-dc-accent" />
            <span className="text-sm font-medium text-dc-text">
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
            {isToday && (
              <Badge variant="success" size="sm">
                Today
              </Badge>
            )}
          </div>
          <button
            onClick={() => shiftDate(1)}
            disabled={isToday}
            className="w-8 h-8 rounded-lg bg-dc-surface border border-dc-border flex items-center justify-center text-dc-text-muted hover:text-dc-text transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Dose Checklist */}
        <div className="space-y-4">
          <Card>
            <CardTitle>Dose Checklist</CardTitle>
            <p className="text-xs text-dc-text-muted mt-1 mb-4">
              Tap each dose to mark as taken.
            </p>
            <CardContent>
              <DoseChecklist doses={MOCK_DAILY_DOSES} />
            </CardContent>
          </Card>
        </div>

        {/* Right: Outcome Metrics */}
        <div className="space-y-4">
          {/* Body Metrics */}
          <Card>
            <CardTitle>Body Metrics</CardTitle>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <TrendingDown className="w-3.5 h-3.5 text-dc-accent" />
                    <span className="text-xs font-medium text-dc-text-muted">
                      Weight (lbs)
                    </span>
                  </div>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="183.0"
                    value={outcome.weight}
                    onChange={(e) => updateOutcome("weight", e.target.value)}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Activity className="w-3.5 h-3.5 text-dc-clinical" />
                    <span className="text-xs font-medium text-dc-text-muted">
                      Body Fat %
                    </span>
                  </div>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="17.0"
                    value={outcome.bodyFat}
                    onChange={(e) => updateOutcome("bodyFat", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subjective Metrics */}
          <Card>
            <CardTitle>Subjective Scores</CardTitle>
            <CardContent>
              <div className="space-y-5 mt-3">
                {METRIC_SLIDERS.map((metric) => {
                  const Icon = metric.icon;
                  const value = outcome[
                    metric.key as keyof OutcomeEntry
                  ] as number;
                  const pct = (value / metric.max) * 100;
                  return (
                    <div key={metric.key}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon
                            className="w-4 h-4"
                            style={{ color: metric.color }}
                          />
                          <span className="text-sm font-medium text-dc-text">
                            {metric.label}
                          </span>
                        </div>
                        <span
                          className="text-lg font-bold font-mono"
                          style={{ color: metric.color }}
                        >
                          {value}
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="range"
                          min="1"
                          max={metric.max}
                          value={value}
                          onChange={(e) =>
                            updateOutcome(
                              metric.key as keyof OutcomeEntry,
                              parseInt(e.target.value, 10),
                            )
                          }
                          className="w-full h-2 rounded-full appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, ${metric.color} 0%, ${metric.color} ${pct}%, #2a2a3e ${pct}%, #2a2a3e 100%)`,
                          }}
                        />
                        <div className="flex justify-between mt-1">
                          <span className="text-[10px] text-dc-text-muted">
                            1
                          </span>
                          <span className="text-[10px] text-dc-text-muted">
                            {metric.max}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardTitle>Notes</CardTitle>
            <CardContent>
              <textarea
                placeholder="Any observations, side effects, or milestones..."
                value={outcome.notes}
                onChange={(e) => updateOutcome("notes", e.target.value)}
                className="w-full mt-3 px-4 py-2.5 rounded-lg text-sm text-dc-text placeholder:text-dc-text-muted/50 bg-dc-surface border border-dc-border focus:outline-none focus:border-dc-accent focus:ring-1 focus:ring-dc-accent/30 transition-all duration-200 resize-none h-24"
              />
            </CardContent>
          </Card>

          {/* Save */}
          <Button onClick={handleSave} className="w-full" size="lg">
            <Save className="w-4 h-4" />
            {saved ? "Saved!" : "Save Entry"}
          </Button>
        </div>
      </div>
    </div>
  );
}
