"use client";

import { useState } from "react";
import { Calendar, ClipboardCheck, Plus, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DoseChecklist } from "@/components/tracking/dose-checklist";
import { BodyDiagram } from "@/components/tracking/body-diagram";
import { MOCK_DAILY_DOSES, MOCK_OUTCOMES, INJECTION_SITES, MOCK_PEPTIDES } from "@/lib/mock-data";
import clsx from "clsx";

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

const WEEK_DATA = [
  { day: "Mon", compliance: 100, taken: 5, total: 5 },
  { day: "Tue", compliance: 80,  taken: 4, total: 5 },
  { day: "Wed", compliance: 100, taken: 5, total: 5 },
  { day: "Thu", compliance: 60,  taken: 3, total: 5 },
  { day: "Fri", compliance: 100, taken: 5, total: 5 },
  { day: "Sat", compliance: 100, taken: 5, total: 5 },
  { day: "Sun", compliance: 0,   taken: 0, total: 5 },
] as const;

const PEPTIDE_OPTIONS = MOCK_PEPTIDES.map((p) => p.name);

const UNIT_OPTIONS = ["mcg", "mg", "IU", "mL"] as const;

export default function LogPage() {
  const today = new Date();
  const todayStr = today.toLocaleDateString("en-US", { weekday: "short" });
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const [quickLog, setQuickLog] = useState({
    peptide: "",
    dose: "",
    unit: "mcg" as typeof UNIT_OPTIONS[number],
    site: "",
    notes: "",
  });
  const [logSuccess, setLogSuccess] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7) + weekOffset * 7);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  const weekLabel = `${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;

  const handleQuickLog = (e: React.FormEvent) => {
    e.preventDefault();
    setLogSuccess(true);
    setQuickLog({ peptide: "", dose: "", unit: "mcg", site: "", notes: "" });
    setSelectedSite(null);
    setTimeout(() => setLogSuccess(false), 3000);
  };

  const today7Day = MOCK_OUTCOMES.slice(-7);
  const avgCompliance = Math.round(WEEK_DATA.reduce((a, d) => a + d.compliance, 0) / WEEK_DATA.length);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Today Logged", value: `${MOCK_DAILY_DOSES.filter((d) => d.taken).length}/${MOCK_DAILY_DOSES.length}`, color: "#ff6b35" },
          { label: "Week Compliance", value: `${avgCompliance}%`, color: "#00d4ff" },
          { label: "Streak", value: "13 days", color: "#00ff88" },
          { label: "Total Logged", value: "187", color: "#b366ff" },
        ].map((stat) => (
          <Card key={stat.label}>
            <p className="text-xl font-bold text-dc-text stat-number" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-xs text-dc-text-muted mt-1">{stat.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Checklist + Calendar */}
        <div className="lg:col-span-2 space-y-5">
          {/* Today's Checklist */}
          <Card>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <ClipboardCheck className="w-4.5 h-4.5 text-dc-accent" />
                <CardTitle>Today&apos;s Schedule</CardTitle>
              </div>
              <p className="text-xs text-dc-text-muted">
                {today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </p>
            </div>
            <DoseChecklist doses={MOCK_DAILY_DOSES} />
          </Card>

          {/* Weekly Calendar */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4.5 h-4.5 text-dc-neon-cyan" />
                <CardTitle>Weekly Calendar</CardTitle>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setWeekOffset((o) => o - 1)}
                  className="p-1.5 rounded-lg hover:bg-dc-surface-alt text-dc-text-muted hover:text-dc-text transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs text-dc-text-muted px-2">{weekLabel}</span>
                <button
                  onClick={() => setWeekOffset((o) => Math.min(o + 1, 0))}
                  className="p-1.5 rounded-lg hover:bg-dc-surface-alt text-dc-text-muted hover:text-dc-text transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {WEEK_DATA.map((day) => {
                const isToday = day.day === todayStr;
                const pct = day.compliance;
                const barColor = pct === 100 ? "#00ff88" : pct >= 80 ? "#ffaa00" : pct > 0 ? "#ff6b35" : "#2a2a3e";

                return (
                  <div key={day.day} className="flex flex-col items-center gap-2">
                    <p className={clsx("text-[10px] font-medium", isToday ? "text-dc-accent" : "text-dc-text-muted")}>
                      {day.day}
                    </p>
                    <div className="relative w-full h-20 bg-dc-surface rounded-lg overflow-hidden">
                      <div
                        className="absolute bottom-0 left-0 right-0 rounded-lg transition-all duration-500"
                        style={{ height: `${pct}%`, backgroundColor: barColor, opacity: 0.8 }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={clsx("text-[10px] font-bold", pct > 0 ? "text-white" : "text-dc-text-faint")}>
                          {pct > 0 ? `${day.taken}/${day.total}` : "—"}
                        </span>
                      </div>
                    </div>
                    {isToday && (
                      <div className="w-1.5 h-1.5 rounded-full bg-dc-accent animate-pulse-glow" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-dc-border">
              {[
                { color: "#00ff88", label: "Full" },
                { color: "#ffaa00", label: "Partial" },
                { color: "#ff6b35", label: "Missed" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded" style={{ background: l.color }} />
                  <span className="text-[10px] text-dc-text-muted">{l.label}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right: Quick Log + Body Map */}
        <div className="space-y-5">
          {/* Quick Log */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Plus className="w-4.5 h-4.5 text-dc-neon-green" />
              <CardTitle>Quick Log</CardTitle>
            </div>

            {logSuccess && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-dc-neon-green/10 border border-dc-neon-green/20 mb-4 text-dc-neon-green text-sm">
                <ClipboardCheck className="w-4 h-4" />
                Dose logged successfully!
              </div>
            )}

            <form onSubmit={handleQuickLog} className="space-y-3">
              {/* Peptide */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-dc-text-muted uppercase tracking-wide">Compound</label>
                <select
                  value={quickLog.peptide}
                  onChange={(e) => {
                    const name = e.target.value;
                    const compound = MOCK_PEPTIDES.find((p) => p.name === name);
                    const unit = compound?.category === "hormonal" ? "mg" : "mcg";
                    setQuickLog({ ...quickLog, peptide: name, unit });
                  }}
                  required
                  className="w-full px-3 py-2.5 rounded-xl text-sm text-dc-text bg-dc-surface border border-dc-border focus:outline-none focus:border-dc-accent focus:ring-2 focus:ring-dc-accent/15 transition-all"
                >
                  <option value="">Select compound...</option>
                  {PEPTIDE_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              {/* Dose + Unit */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-dc-text-muted uppercase tracking-wide">Dose</label>
                  <input
                    type="number"
                    value={quickLog.dose}
                    onChange={(e) => setQuickLog({ ...quickLog, dose: e.target.value })}
                    required
                    placeholder="250"
                    className="w-full px-3 py-2.5 rounded-xl text-sm text-dc-text bg-dc-surface border border-dc-border placeholder:text-dc-text-muted/40 focus:outline-none focus:border-dc-accent focus:ring-2 focus:ring-dc-accent/15 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-dc-text-muted uppercase tracking-wide">Unit</label>
                  <select
                    value={quickLog.unit}
                    onChange={(e) => setQuickLog({ ...quickLog, unit: e.target.value as typeof UNIT_OPTIONS[number] })}
                    className="w-full px-3 py-2.5 rounded-xl text-sm text-dc-text bg-dc-surface border border-dc-border focus:outline-none focus:border-dc-accent transition-all"
                  >
                    {UNIT_OPTIONS.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>

              {/* Injection Site */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-dc-text-muted uppercase tracking-wide flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Injection Site
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {INJECTION_SITES.map((site) => (
                    <button
                      key={site.id}
                      type="button"
                      onClick={() => { setSelectedSite(site.id); setQuickLog({ ...quickLog, site: site.label }); }}
                      className={clsx(
                        "px-2.5 py-2 rounded-lg border text-[10px] font-medium text-left transition-all",
                        selectedSite === site.id
                          ? "bg-dc-accent/10 border-dc-accent/30 text-dc-accent"
                          : "border-dc-border text-dc-text-muted hover:border-dc-accent/20 hover:text-dc-text",
                      )}
                    >
                      {site.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-dc-text-muted uppercase tracking-wide">Notes (optional)</label>
                <textarea
                  value={quickLog.notes}
                  onChange={(e) => setQuickLog({ ...quickLog, notes: e.target.value })}
                  placeholder="Any observations..."
                  rows={2}
                  className="w-full px-3 py-2.5 rounded-xl text-sm text-dc-text bg-dc-surface border border-dc-border placeholder:text-dc-text-muted/40 focus:outline-none focus:border-dc-accent focus:ring-2 focus:ring-dc-accent/15 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all"
                style={{ background: "linear-gradient(135deg, #00ff88 0%, #00cc66 100%)", boxShadow: "0 4px 16px rgba(0,255,136,0.2)" }}
              >
                <ClipboardCheck className="w-4 h-4" />
                Log Dose
              </button>
            </form>
          </Card>

          {/* Body Map */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4.5 h-4.5 text-dc-warning" />
              <CardTitle>Injection Site Map</CardTitle>
            </div>
            <BodyDiagram
              sites={INJECTION_SITES}
              selectedSiteId={selectedSite}
              onSelectSite={(site) => {
                setSelectedSite(site.id);
                setQuickLog((q) => ({ ...q, site: site.label }));
              }}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
