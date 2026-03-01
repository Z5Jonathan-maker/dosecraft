"use client";

import { useState, useMemo } from "react";
import { Syringe, FlaskConical, Info, AlertTriangle } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";

const SYRINGE_OPTIONS = [
  { label: "100 unit", units: 100, ml: 1.0 },
  { label: "50 unit", units: 50, ml: 0.5 },
  { label: "30 unit", units: 30, ml: 0.3 },
] as const;

type SyringeOption = typeof SYRINGE_OPTIONS[number];

const PRESETS = [
  { name: "BPC-157 5mg / 2mL", peptideMg: 5, reconMl: 2, targetMcg: 250 },
  { name: "Semaglutide 5mg / 3mL", peptideMg: 5, reconMl: 3, targetMcg: 250 },
  { name: "CJC/Ipa 5mg / 2.5mL", peptideMg: 5, reconMl: 2.5, targetMcg: 300 },
  { name: "HCG 5000IU / 5mL", peptideMg: 5, reconMl: 5, targetMcg: 500 },
] as const;

function VisualSyringe({ units, maxUnits, syringeLabel }: { units: number; maxUnits: number; syringeLabel: string }) {
  const syringeHeight = 200;
  const barrelTop = 30;
  const barrelBottom = 180;
  const barrelHeight = barrelBottom - barrelTop;
  const fillPercent = Math.min(units / maxUnits, 1);
  const fillHeight = barrelHeight * fillPercent;
  const fillY = barrelBottom - fillHeight;

  // Generate graduation marks every 10 units
  const graduations: { y: number; label: string }[] = [];
  const step = 10;
  for (let u = 0; u <= maxUnits; u += step) {
    const frac = u / maxUnits;
    const y = barrelBottom - frac * barrelHeight;
    graduations.push({ y, label: u.toString() });
  }

  return (
    <div className="flex flex-col items-center">
      <svg width="120" height={syringeHeight + 30} viewBox="0 -5 120 235" className="drop-shadow-lg">
        {/* Plunger rod */}
        <rect x="54" y="0" width="12" height={fillY - barrelTop + 30} rx="2" fill="#555" className="transition-all duration-700" />
        <rect x="44" y="0" width="32" height="6" rx="2" fill="#666" />

        {/* Barrel outer */}
        <rect x="38" y={barrelTop} width="44" height={barrelHeight} rx="6" fill="none" stroke="#444" strokeWidth="2" />
        {/* Barrel inner background */}
        <rect x="40" y={barrelTop + 1} width="40" height={barrelHeight - 2} rx="5" fill="rgba(255,255,255,0.03)" />

        {/* Fill area */}
        {fillPercent > 0 && (
          <rect
            x="40"
            y={fillY}
            width="40"
            height={fillHeight}
            rx={fillHeight >= barrelHeight - 2 ? 5 : 0}
            className="transition-all duration-700 ease-out"
          >
            <animate attributeName="opacity" from="0.6" to="1" dur="0.5s" fill="freeze" />
          </rect>
        )}
        {fillPercent > 0 && (
          <rect
            x="40"
            y={fillY}
            width="40"
            height={fillHeight}
            rx={fillHeight >= barrelHeight - 2 ? 5 : 0}
            fill="url(#syringeFill)"
            className="transition-all duration-700 ease-out"
          />
        )}

        {/* Graduation marks */}
        {graduations.map((g) => (
          <g key={g.label}>
            <line x1="38" y1={g.y} x2="34" y2={g.y} stroke="#555" strokeWidth="1" />
            <text x="30" y={g.y + 3} textAnchor="end" fill="#888" fontSize="8" fontFamily="monospace">
              {g.label}
            </text>
          </g>
        ))}

        {/* Fill line indicator */}
        {fillPercent > 0 && fillPercent <= 1 && (
          <>
            <line x1="82" y1={fillY} x2="95" y2={fillY} stroke="#00d4ff" strokeWidth="1.5" className="transition-all duration-700" />
            <text x="98" y={fillY + 3} fill="#00d4ff" fontSize="9" fontWeight="bold" fontFamily="monospace" className="transition-all duration-700">
              {units.toFixed(1)}u
            </text>
          </>
        )}

        {/* Needle hub */}
        <rect x="52" y={barrelBottom} width="16" height="10" rx="2" fill="#666" />
        {/* Needle */}
        <line x1="60" y1={barrelBottom + 10} x2="60" y2={barrelBottom + 35} stroke="#999" strokeWidth="1.5" strokeLinecap="round" />

        <defs>
          <linearGradient id="syringeFill" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#00d4ff" stopOpacity="0.4" />
          </linearGradient>
        </defs>
      </svg>
      <p className="text-[10px] text-dc-text-muted mt-1 mono">{syringeLabel}</p>
    </div>
  );
}

export default function DosageCalcPage() {
  const [peptideMg, setPeptideMg] = useState("");
  const [reconMl, setReconMl] = useState("");
  const [targetMcg, setTargetMcg] = useState("");
  const [selectedSyringe, setSelectedSyringe] = useState<SyringeOption>(SYRINGE_OPTIONS[0]);
  const [selectedPreset, setSelectedPreset] = useState("");

  const handlePresetSelect = (name: string) => {
    const p = PRESETS.find((x) => x.name === name);
    if (p) {
      setPeptideMg(p.peptideMg.toString());
      setReconMl(p.reconMl.toString());
      setTargetMcg(p.targetMcg.toString());
      setSelectedPreset(name);
    }
  };

  const result = useMemo(() => {
    const peptide = parseFloat(peptideMg);
    const recon = parseFloat(reconMl);
    const target = parseFloat(targetMcg);

    if (isNaN(peptide) || isNaN(recon) || isNaN(target) || peptide <= 0 || recon <= 0 || target <= 0) {
      return null;
    }

    const peptideMcg = peptide * 1000;
    const concentrationMcgPerMl = peptideMcg / recon;
    const concentrationMcgPerUnit = concentrationMcgPerMl / 100; // 100 units per mL (insulin)

    const mlToDraw = target / concentrationMcgPerMl;
    const unitsToDraw = mlToDraw * 100;

    const exceedsSyringe = unitsToDraw > selectedSyringe.units;

    return {
      mlToDraw,
      unitsToDraw,
      concentrationMcgPerUnit,
      concentrationMcgPerMl,
      exceedsSyringe,
    };
  }, [peptideMg, reconMl, targetMcg, selectedSyringe]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Quick Fill */}
      <Card>
        <CardTitle className="mb-3">Quick Fill — Common Setups</CardTitle>
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
              <div className="w-8 h-8 rounded-xl bg-dc-accent/15 flex items-center justify-center">
                <FlaskConical className="w-4 h-4 text-dc-accent" />
              </div>
              <div>
                <CardTitle>Dosage Calculator</CardTitle>
                <p className="text-xs text-dc-text-muted mt-0.5">Calculate exact syringe draw from reconstituted vial</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-dc-text-muted uppercase tracking-wide">Peptide Amount in Vial</label>
                <div className="relative">
                  <input
                    type="number"
                    value={peptideMg}
                    onChange={(e) => setPeptideMg(e.target.value)}
                    placeholder="e.g. 5"
                    step="0.1"
                    min="0"
                    className="w-full px-4 py-3 pr-14 rounded-xl text-sm text-dc-text bg-dc-surface border border-dc-border placeholder:text-dc-text-muted/40 focus:outline-none focus:border-dc-accent focus:ring-2 focus:ring-dc-accent/15 transition-all mono"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-dc-text-muted">mg</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-dc-text-muted uppercase tracking-wide">Reconstitution Volume (BAC Water)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={reconMl}
                    onChange={(e) => setReconMl(e.target.value)}
                    placeholder="e.g. 2"
                    step="0.1"
                    min="0"
                    className="w-full px-4 py-3 pr-14 rounded-xl text-sm text-dc-text bg-dc-surface border border-dc-border placeholder:text-dc-text-muted/40 focus:outline-none focus:border-dc-accent focus:ring-2 focus:ring-dc-accent/15 transition-all mono"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-dc-text-muted">mL</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-dc-text-muted uppercase tracking-wide">Target Dose</label>
                <div className="relative">
                  <input
                    type="number"
                    value={targetMcg}
                    onChange={(e) => setTargetMcg(e.target.value)}
                    placeholder="e.g. 250"
                    step="1"
                    min="0"
                    className="w-full px-4 py-3 pr-14 rounded-xl text-sm text-dc-text bg-dc-surface border border-dc-border placeholder:text-dc-text-muted/40 focus:outline-none focus:border-dc-accent focus:ring-2 focus:ring-dc-accent/15 transition-all mono"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-dc-text-muted">mcg</span>
                </div>
              </div>

              {/* Syringe Selection */}
              <div>
                <label className="text-xs font-medium text-dc-text-muted uppercase tracking-wide block mb-2">Syringe Size</label>
                <div className="grid grid-cols-3 gap-2">
                  {SYRINGE_OPTIONS.map((syringe) => (
                    <button
                      key={syringe.label}
                      onClick={() => setSelectedSyringe(syringe)}
                      className={clsx(
                        "p-3 rounded-xl border text-center transition-all",
                        selectedSyringe.units === syringe.units
                          ? "bg-dc-accent/10 border-dc-accent/30"
                          : "bg-dc-surface border-dc-border hover:border-dc-accent/20",
                      )}
                    >
                      <p className={clsx("text-xs font-bold mono", selectedSyringe.units === syringe.units ? "text-dc-accent" : "text-dc-text")}>
                        {syringe.units}u
                      </p>
                      <p className="text-[9px] text-dc-text-muted mt-0.5">{syringe.ml}mL</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Tips */}
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-dc-text-muted" />
              <CardTitle className="text-sm">Dosing Tips</CardTitle>
            </div>
            <div className="space-y-2.5 text-xs text-dc-text-muted">
              {[
                "Use the smallest syringe that fits your dose for maximum accuracy",
                "1 mL = 100 insulin units — this is constant regardless of syringe size",
                "Dead space in the needle hub wastes ~0.02-0.07 mL per injection",
                "Always double-check your math before injecting — small errors in units = large errors in dose",
                "If your dose is less than 5 units, consider adding more BAC water to increase volume precision",
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
              {/* Visual Syringe */}
              <Card>
                <div className="flex flex-col items-center py-2">
                  <VisualSyringe
                    units={result.unitsToDraw}
                    maxUnits={selectedSyringe.units}
                    syringeLabel={`${selectedSyringe.label} (${selectedSyringe.ml}mL)`}
                  />
                </div>
              </Card>

              {/* Warning */}
              {result.exceedsSyringe && (
                <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-dc-danger/8 border border-dc-danger/25 text-xs text-dc-danger">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  This dose exceeds your selected syringe capacity ({selectedSyringe.units}u). Use a larger syringe or split into multiple injections.
                </div>
              )}

              {/* Numeric Results */}
              <Card>
                <p className="text-xs text-dc-neon-cyan font-medium uppercase tracking-wide mb-3">Injection Volume</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-dc-text-muted mb-0.5">Units to Draw</p>
                    <p className="text-2xl font-bold text-dc-neon-cyan mono">{result.unitsToDraw.toFixed(1)}</p>
                    <p className="text-[10px] text-dc-text-muted">units on syringe</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-dc-text-muted mb-0.5">Volume to Draw</p>
                    <p className="text-2xl font-bold text-dc-text mono">{result.mlToDraw.toFixed(3)}</p>
                    <p className="text-[10px] text-dc-text-muted">mL</p>
                  </div>
                </div>
              </Card>

              {/* Concentration Info */}
              <Card>
                <p className="text-xs text-dc-accent font-medium uppercase tracking-wide mb-3">Concentration</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-dc-text-muted mb-0.5">mcg per Unit</p>
                    <p className="text-xl font-bold text-dc-text mono">{result.concentrationMcgPerUnit.toFixed(2)}</p>
                    <p className="text-[10px] text-dc-text-muted">mcg/unit</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-dc-text-muted mb-0.5">mcg per mL</p>
                    <p className="text-xl font-bold text-dc-text mono">{result.concentrationMcgPerMl.toFixed(0)}</p>
                    <p className="text-[10px] text-dc-text-muted">mcg/mL</p>
                  </div>
                </div>
              </Card>

              {/* Syringe fill bar */}
              <Card>
                <div className="flex items-center justify-between text-[10px] text-dc-text-muted mb-1.5">
                  <span>Syringe fill ({selectedSyringe.label})</span>
                  <span className="mono">{Math.min((result.unitsToDraw / selectedSyringe.units) * 100, 100).toFixed(0)}%</span>
                </div>
                <div className="h-3 rounded-full bg-dc-surface overflow-hidden flex">
                  <div
                    className="rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min((result.unitsToDraw / selectedSyringe.units) * 100, 100)}%`,
                      background:
                        result.unitsToDraw / selectedSyringe.units > 0.9
                          ? "linear-gradient(90deg, #ff4444, #ff6666)"
                          : "linear-gradient(90deg, #00d4ff, #00ff88)",
                    }}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-dc-text-faint mt-1">
                  <span>0u</span>
                  <span>{selectedSyringe.units / 2}u</span>
                  <span>{selectedSyringe.units}u</span>
                </div>
              </Card>
            </>
          ) : (
            <Card>
              <div className="py-8 text-center">
                <Syringe className="w-10 h-10 text-dc-text-faint mx-auto mb-3" />
                <p className="text-sm text-dc-text-muted">Enter vial details and target dose to calculate injection volume.</p>
                <p className="text-xs text-dc-text-faint mt-1">Use a quick-fill preset or enter values manually.</p>
              </div>
            </Card>
          )}

          {/* Disclaimer */}
          <div className="glass rounded-xl px-4 py-3 border border-dc-border/40">
            <p className="text-[10px] text-dc-text-faint leading-relaxed">
              These calculations are for educational and research purposes only. Always verify doses with a qualified healthcare provider. Double-check all math before drawing any injection. DoseCraft is not liable for dosing errors or adverse effects.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
