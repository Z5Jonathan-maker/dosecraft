"use client";

import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DoseChecklist } from "@/components/tracking/dose-checklist";
import { CalendarDays, Save, Plus } from "lucide-react";
import { MOCK_DAILY_DOSES } from "@/lib/mock-data";

export default function LogPage() {
  const [weight, setWeight] = useState("182.8");
  const [bodyFat, setBodyFat] = useState("16.8");
  const [mood, setMood] = useState("8");
  const [sleep, setSleep] = useState("9");
  const [energy, setEnergy] = useState("9");
  const [soreness, setSoreness] = useState("2");
  const [notes, setNotes] = useState("");

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Date header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-dc-accent/10 flex items-center justify-center">
            <CalendarDays className="w-5 h-5 text-dc-accent" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-dc-text">Today&apos;s Log</h1>
            <p className="text-sm text-dc-text-muted">{today}</p>
          </div>
        </div>
        <Button variant="secondary" size="sm">
          <Plus className="w-4 h-4" />
          Add Dose
        </Button>
      </div>

      {/* Dose Checklist */}
      <Card>
        <CardTitle>Planned Doses</CardTitle>
        <p className="text-sm text-dc-text-muted mt-1 mb-4">
          Tap each dose to mark as taken.
        </p>
        <DoseChecklist doses={MOCK_DAILY_DOSES} />
      </Card>

      {/* Outcome Metrics */}
      <Card>
        <CardTitle>Outcome Metrics</CardTitle>
        <p className="text-sm text-dc-text-muted mt-1 mb-4">
          Track your daily metrics to correlate with your peptide protocols.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Input
            label="Weight (lbs)"
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
          <Input
            label="Body Fat %"
            type="number"
            step="0.1"
            value={bodyFat}
            onChange={(e) => setBodyFat(e.target.value)}
          />
          <div>
            <label className="text-sm font-medium text-dc-text-muted mb-1.5 block">
              Mood ({mood}/10)
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #ff4444 0%, #ffaa00 50%, #00ff88 100%)`,
              }}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-dc-text-muted mb-1.5 block">
              Sleep ({sleep}/10)
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={sleep}
              onChange={(e) => setSleep(e.target.value)}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #ff4444 0%, #ffaa00 50%, #00ff88 100%)`,
              }}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-dc-text-muted mb-1.5 block">
              Energy ({energy}/10)
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={energy}
              onChange={(e) => setEnergy(e.target.value)}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #ff4444 0%, #ffaa00 50%, #00ff88 100%)`,
              }}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-dc-text-muted mb-1.5 block">
              Soreness ({soreness}/10)
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={soreness}
              onChange={(e) => setSoreness(e.target.value)}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #00ff88 0%, #ffaa00 50%, #ff4444 100%)`,
              }}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-dc-text-muted mb-1.5 block">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any observations, side effects, or notable changes..."
            className="w-full px-4 py-2.5 rounded-lg text-sm text-dc-text placeholder:text-dc-text-muted/50 bg-dc-surface border border-dc-border focus:outline-none focus:border-dc-accent focus:ring-1 focus:ring-dc-accent/30 transition-all duration-200 min-h-[80px] resize-y"
          />
        </div>

        <div className="mt-4 flex justify-end">
          <Button>
            <Save className="w-4 h-4" />
            Save Log
          </Button>
        </div>
      </Card>
    </div>
  );
}
