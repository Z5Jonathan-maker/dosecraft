"use client";

import { useState, useMemo } from "react";
import { Timer, DollarSign, CalendarDays, Info, AlertTriangle } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";

const PRESETS = [
  { name: "BPC-157 5mg", vialSize: 5, unit: "mg" as const, dose: 0.25, injectionsPerWeek: 7, cost: 35 },
  { name: "TB-500 5mg", vialSize: 5, unit: "mg" as const, dose: 2.5, injectionsPerWeek: 2, cost: 40 },
  { name: "Semaglutide 5mg", vialSize: 5, unit: "mg" as const, dose: 0.25, injectionsPerWeek: 1, cost: 60 },
  { name: "Test Cyp 200mg/mL 10mL", vialSize: 2000, unit: "mg" as const, dose: 100, injectionsPerWeek: 2, cost: 80 },
  { name: "CJC/Ipa 5mg blend", vialSize: 5, unit: "mg" as const, dose: 0.3, injectionsPerWeek: 5, cost: 45 },
  { name: "Tesamorelin 5mg", vialSize: 5, unit: "mg" as const, dose: 2, injectionsPerWeek: 7, cost: 55 },
] as const;

export default function VialDurationPage() {
  const [vialSize, setVialSize] = useState("");
  const [dosePerInjection, setDosePerInjection] = useState("");
  const [injectionsPerWeek, setInjectionsPerWeek] = useState("");
  const [costPerVial, setCostPerVial] = useState("");
  const [selectedPreset, setSelectedPreset] = useState("");

  const handlePresetSelect = (name: string) => {
    const p = PRESETS.find((x) => x.name === name);
    if (p) {
      setVialSize(p.vialSize.toString());
      setDosePerInjection(p.dose.toString());
      setInjectionsPerWeek(p.injectionsPerWeek.toString());
      setCostPerVial(p.cost.toString());
      setSelectedPreset(name);
    }
  };

  const result = useMemo(() => {
    const vial = parseFloat(vialSize);
    const dose = parseFloat(dosePerInjection);
    const injPerWeek = parseFloat(injectionsPerWeek);
    const cost = parseFloat(costPerVial);

    if (isNaN(vial) || isNaN(dose) || isNaN(injPerWeek) || vial <= 0 || dose <= 0 || injPerWeek <= 0) {
      return null;
    }

    const totalDoses = vial / dose;
    const daysPerVial = (totalDoses / injPerWeek) * 7;
    const depletionDate = new Date();
    depletionDate.setDate(depletionDate.getDate() + Math.floor(daysPerVial));

    const hasCost = !isNaN(cost) && cost > 0;
    const costPerDose = hasCost ? cost / totalDoses : null;
    const dosesPerWeek = injPerWeek;
    const costPerWeek = hasCost ? (cost / totalDoses) * dosesPerWeek : null;
    const costPerMonth = costPerWeek !== null ? costPerWeek * (30 / 7) : null;

    const percentRemaining = 100; // starts full
    const dosesTaken = 0;

    return {
      totalDoses,
      daysPerVial,
      depletionDate,
      costPerDose,
      costPerWeek,
      costPerMonth,
      percentRemaining,
      dosesTaken,
      hasCost,
    };
  }, [vialSize, dosePerInjection, injectionsPerWeek, costPerVial]);

  // Circular progress component
  const CircularProgress = ({ percent, label }: { percent: number; label: string }) => {
    const radius = 60;
    const strokeWidth = 8;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;

    return (
      <div className="relative flex items-center justify-center">
        <svg width="148" height="148" viewBox="0 0 148 148" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="74"
            cy="74"
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-dc-border"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx="74"
            cy="74"
            r={radius}
            fill="none"
            stroke="url(#vialGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="vialGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00ff88" />
              <stop offset="100%" stopColor="#00d4ff" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-dc-text mono">{Math.round(percent)}%</span>
          <span className="text-[10px] text-dc-text-muted mt-0.5">{label}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Quick Fill Presets */}
      <Card>
        <CardTitle className="mb-3">Quick Fill from Common Peptides</CardTitle>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => handlePresetSelect(p.name)}
              className={clsx(
                "px-3 py-1.5 rounded-xl border text-xs font-medium transition-all",
                selectedPreset === p.name
                  ? "bg-dc-accent/10 text-dc-accent border-dc-accent/30"
                  : "bg-dc-surface text-dc-text-muted border-dc-border hover:border-dc-accent/20 hover:text-dc-text",
              )}
            >
              {p.name}
            </button>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Inputs */}
        <div className="space-y-4">
          <Card>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-xl bg-dc-neon-cyan/15 flex items-center justify-center">
                <Timer className="w-4 h-4 text-dc-neon-cyan" />
              </div>
              <div>
                <CardTitle>Vial Duration & Cost</CardTitle>
                <p className="text-xs text-dc-text-muted mt-0.5">Calculate how long a vial lasts and cost breakdown</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-dc-text-muted uppercase tracking-wide">Vial Size (mg total content)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={vialSize}
                    onChange={(e) => setVialSize(e.target.value)}
                    placeholder="e.g. 5"
                    step="0.1"
                    min="0"
                    className="w-full px-4 py-3 pr-14 rounded-xl text-sm text-dc-text bg-dc-surface border border-dc-border placeholder:text-dc-text-muted/40 focus:outline-none focus:border-dc-accent focus:ring-2 focus:ring-dc-accent/15 transition-all mono"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-dc-text-muted">mg</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-dc-text-muted uppercase tracking-wide">Dose per Injection (mg)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={dosePerInjection}
                    onChange={(e) => setDosePerInjection(e.target.value)}
                    placeholder="e.g. 0.25"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 pr-14 rounded-xl text-sm text-dc-text bg-dc-surface border border-dc-border placeholder:text-dc-text-muted/40 focus:outline-none focus:border-dc-accent focus:ring-2 focus:ring-dc-accent/15 transition-all mono"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-dc-text-muted">mg</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-dc-text-muted uppercase tracking-wide">Injections per Week</label>
                <div className="relative">
                  <input
                    type="number"
                    value={injectionsPerWeek}
                    onChange={(e) => setInjectionsPerWeek(e.target.value)}
                    placeholder="e.g. 7"
                    step="1"
                    min="1"
                    className="w-full px-4 py-3 pr-14 rounded-xl text-sm text-dc-text bg-dc-surface border border-dc-border placeholder:text-dc-text-muted/40 focus:outline-none focus:border-dc-accent focus:ring-2 focus:ring-dc-accent/15 transition-all mono"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-dc-text-muted">/wk</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-dc-text-muted uppercase tracking-wide">Cost per Vial ($) <span className="normal-case text-dc-text-faint">— optional</span></label>
                <div className="relative">
                  <input
                    type="number"
                    value={costPerVial}
                    onChange={(e) => setCostPerVial(e.target.value)}
                    placeholder="e.g. 35"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 pr-14 rounded-xl text-sm text-dc-text bg-dc-surface border border-dc-border placeholder:text-dc-text-muted/40 focus:outline-none focus:border-dc-accent focus:ring-2 focus:ring-dc-accent/15 transition-all mono"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-dc-text-muted">USD</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Tips */}
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-dc-text-muted" />
              <CardTitle className="text-sm">Cost Optimization Tips</CardTitle>
            </div>
            <div className="space-y-2.5 text-xs text-dc-text-muted">
              {[
                "Buying larger vials reduces cost-per-dose but increases waste risk if not used before expiry",
                "Reconstituted peptides typically last 4-6 weeks refrigerated — factor this into vial size choice",
                "Compare cost-per-mg across vendors, not just cost-per-vial",
                "Some compounds are more cost-effective at specific dosing frequencies",
                "Track actual usage to refine estimates — wastage from dead space adds ~2-5% to real cost",
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded flex items-center justify-center bg-dc-surface-alt text-[9px] font-bold text-dc-text-muted flex-shrink-0 mt-0.5">{i + 1}</span>
                  {tip}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {result ? (
            <>
              {/* Circular Progress Card */}
              <Card>
                <div className="flex flex-col items-center py-2">
                  <CircularProgress percent={result.percentRemaining} label="vial remaining" />
                  <div className="mt-4 text-center">
                    <p className="text-sm font-medium text-dc-text">
                      <span className="mono text-dc-neon-green">{result.totalDoses.toFixed(1)}</span> total doses per vial
                    </p>
                    <p className="text-xs text-dc-text-muted mt-1">At current dosing schedule</p>
                  </div>
                </div>
              </Card>

              {/* Duration Results */}
              <Card>
                <p className="text-xs text-dc-neon-cyan font-medium uppercase tracking-wide mb-3">Duration</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-dc-text-muted mb-0.5">Days Until Depleted</p>
                    <p className="text-2xl font-bold text-dc-text mono">{Math.floor(result.daysPerVial)}</p>
                    <p className="text-[10px] text-dc-text-muted">days</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-dc-text-muted mb-0.5">Estimated Depletion</p>
                    <p className="text-lg font-bold text-dc-neon-cyan mono">
                      {result.depletionDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <CalendarDays className="w-3 h-3 text-dc-text-faint" />
                      <p className="text-[10px] text-dc-text-faint">
                        ~{Math.ceil(result.daysPerVial / 7)} weeks
                      </p>
                    </div>
                  </div>
                </div>

                {result.daysPerVial > 42 && (
                  <div className="mt-4 flex items-start gap-2.5 px-4 py-3 rounded-xl bg-dc-warning/8 border border-dc-warning/25 text-xs text-dc-warning">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    Vial may expire before depletion. Most reconstituted peptides last 4-6 weeks (28-42 days) refrigerated.
                  </div>
                )}
              </Card>

              {/* Cost Results */}
              {result.hasCost && (
                <Card>
                  <p className="text-xs text-dc-accent font-medium uppercase tracking-wide mb-3">Cost Breakdown</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-[10px] text-dc-text-muted mb-0.5">Per Dose</p>
                      <p className="text-xl font-bold text-dc-text mono">${result.costPerDose!.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-dc-text-muted mb-0.5">Per Week</p>
                      <p className="text-xl font-bold text-dc-text mono">${result.costPerWeek!.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-dc-text-muted mb-0.5">Per Month</p>
                      <p className="text-xl font-bold text-dc-accent mono">${result.costPerMonth!.toFixed(2)}</p>
                      <Badge variant="neutral" size="xs" className="mt-1">~30 days</Badge>
                    </div>
                  </div>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <div className="py-8 text-center">
                <Timer className="w-10 h-10 text-dc-text-faint mx-auto mb-3" />
                <p className="text-sm text-dc-text-muted">Enter vial details to calculate duration and cost.</p>
                <p className="text-xs text-dc-text-faint mt-1">Use a quick-fill preset or enter values manually.</p>
              </div>
            </Card>
          )}

          {/* Disclaimer */}
          <div className="glass rounded-xl px-4 py-3 border border-dc-border/40">
            <p className="text-[10px] text-dc-text-faint leading-relaxed">
              Cost estimates are approximate. Actual costs may vary based on vendor pricing, shipping, and wastage from syringe dead space. Duration assumes no waste per injection. Always consult a healthcare provider for dosing guidance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
