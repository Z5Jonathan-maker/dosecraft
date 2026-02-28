"use client";

import { useState, useMemo } from "react";
import { FlaskConical, Syringe, Calculator, ChevronRight, AlertTriangle, Info } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";

const SYRINGE_TYPES = [
  { label: "30u (0.3mL)", units: 30, ml: 0.3, graduations: 30, typical: "Most precise for small doses" },
  { label: "50u (0.5mL)", units: 50, ml: 0.5, graduations: 50, typical: "Good for medium doses" },
  { label: "100u (1.0mL)", units: 100, ml: 1.0, graduations: 100, typical: "Standard insulin syringe" },
] as const;

type SyringeType = typeof SYRINGE_TYPES[number];

const COMMON_PEPTIDES = [
  { name: "BPC-157", typicalVial: "5 mg", typicalWater: 2, typicalDose: 250 },
  { name: "TB-500", typicalVial: "5 mg", typicalWater: 2, typicalDose: 2500 },
  { name: "CJC-1295", typicalVial: "2 mg", typicalWater: 2, typicalDose: 200 },
  { name: "Ipamorelin", typicalVial: "2 mg", typicalWater: 2, typicalDose: 200 },
  { name: "Semaglutide", typicalVial: "2 mg", typicalWater: 2, typicalDose: 250 },
  { name: "Epithalon", typicalVial: "10 mg", typicalWater: 2, typicalDose: 5000 },
] as const;

export default function CalculatorPage() {
  // Reconstitution inputs
  const [vialMg, setVialMg] = useState("");
  const [waterMl, setWaterMl] = useState("");

  // Dose inputs
  const [desiredDoseMcg, setDesiredDoseMcg] = useState("");
  const [selectedSyringe, setSelectedSyringe] = useState<SyringeType>(SYRINGE_TYPES[2]);

  // Auto-fill from peptide
  const [selectedPeptide, setSelectedPeptide] = useState("");

  const handlePeptideSelect = (name: string) => {
    const p = COMMON_PEPTIDES.find((x) => x.name === name);
    if (p) {
      setVialMg(p.typicalVial.replace(" mg", ""));
      setWaterMl(p.typicalWater.toString());
      setDesiredDoseMcg(p.typicalDose.toString());
      setSelectedPeptide(name);
    }
  };

  // Reconstitution calculations
  const reconResult = useMemo(() => {
    const vial = parseFloat(vialMg);
    const water = parseFloat(waterMl);
    if (isNaN(vial) || isNaN(water) || vial <= 0 || water <= 0) return null;
    const mgPerMl = vial / water;
    const mcgPerMl = mgPerMl * 1000;
    const mcgPerUnit = mcgPerMl / 100; // per insulin unit (1/100th of mL)
    return { mgPerMl, mcgPerMl, mcgPerUnit };
  }, [vialMg, waterMl]);

  // Dose calculations
  const doseResult = useMemo(() => {
    if (!reconResult) return null;
    const desired = parseFloat(desiredDoseMcg);
    if (isNaN(desired) || desired <= 0) return null;
    const mlNeeded = desired / reconResult.mcgPerMl;
    const unitsNeeded = mlNeeded * 100;
    const percentOfSyringe = (unitsNeeded / selectedSyringe.units) * 100;
    return { mlNeeded, unitsNeeded, percentOfSyringe };
  }, [reconResult, desiredDoseMcg, selectedSyringe]);

  const doseWarning = doseResult && doseResult.percentOfSyringe > 100
    ? "This dose exceeds your selected syringe capacity. Use a larger syringe or split into two injections."
    : null;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Quick Fill */}
      <Card>
        <CardTitle className="mb-3">Quick Fill from Common Peptides</CardTitle>
        <div className="flex flex-wrap gap-2">
          {COMMON_PEPTIDES.map((p) => (
            <button
              key={p.name}
              onClick={() => handlePeptideSelect(p.name)}
              className={clsx(
                "px-3 py-1.5 rounded-xl border text-xs font-medium transition-all",
                selectedPeptide === p.name
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
        {/* Step 1: Reconstitution */}
        <div className="space-y-4">
          <Card>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-xl bg-dc-clinical/15 flex items-center justify-center">
                <FlaskConical className="w-4 h-4 text-dc-clinical" />
              </div>
              <div>
                <CardTitle>Step 1: Reconstitution</CardTitle>
                <p className="text-xs text-dc-text-muted mt-0.5">Calculate concentration from vial + BAC water</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-dc-text-muted uppercase tracking-wide">Vial Amount (mg)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={vialMg}
                    onChange={(e) => setVialMg(e.target.value)}
                    placeholder="e.g. 5"
                    step="0.1"
                    min="0"
                    className="w-full px-4 py-3 pr-14 rounded-xl text-sm text-dc-text bg-dc-surface border border-dc-border placeholder:text-dc-text-muted/40 focus:outline-none focus:border-dc-clinical focus:ring-2 focus:ring-dc-clinical/15 transition-all mono"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-dc-text-muted">mg</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-dc-text-muted uppercase tracking-wide">Bacteriostatic Water (mL)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={waterMl}
                    onChange={(e) => setWaterMl(e.target.value)}
                    placeholder="e.g. 2"
                    step="0.1"
                    min="0"
                    className="w-full px-4 py-3 pr-14 rounded-xl text-sm text-dc-text bg-dc-surface border border-dc-border placeholder:text-dc-text-muted/40 focus:outline-none focus:border-dc-clinical focus:ring-2 focus:ring-dc-clinical/15 transition-all mono"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-dc-text-muted">mL</span>
                </div>
              </div>
            </div>

            {/* Reconstitution Result */}
            {reconResult ? (
              <div className="mt-5 p-4 rounded-xl border border-dc-clinical/20 bg-dc-clinical/5">
                <p className="text-xs text-dc-clinical font-medium uppercase tracking-wide mb-3">Concentration</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] text-dc-text-muted mb-0.5">mg per mL</p>
                    <p className="text-xl font-bold text-dc-text mono">{reconResult.mgPerMl.toFixed(2)}</p>
                    <p className="text-[10px] text-dc-text-muted">mg/mL</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-dc-text-muted mb-0.5">mcg per mL</p>
                    <p className="text-xl font-bold text-dc-text mono">{reconResult.mcgPerMl.toFixed(0)}</p>
                    <p className="text-[10px] text-dc-text-muted">mcg/mL</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] text-dc-text-muted mb-0.5">mcg per unit (insulin syringe)</p>
                    <p className="text-lg font-bold text-dc-clinical mono">{reconResult.mcgPerUnit.toFixed(2)} mcg/unit</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-5 p-4 rounded-xl border border-dc-border bg-dc-surface-alt/30 text-center">
                <FlaskConical className="w-8 h-8 text-dc-text-faint mx-auto mb-2" />
                <p className="text-xs text-dc-text-muted">Enter vial amount and water volume to calculate concentration.</p>
              </div>
            )}
          </Card>

          {/* Reconstitution Guide */}
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-dc-text-muted" />
              <CardTitle className="text-sm">Reconstitution Guide</CardTitle>
            </div>
            <div className="space-y-2.5 text-xs text-dc-text-muted">
              {[
                "Use only bacteriostatic water (BAC) — never plain sterile water for multi-dose vials",
                "Inject water down the vial wall, not directly onto the powder",
                "Swirl gently — never shake vigorously or vortex",
                "Let sit for 5-10 min if needed for full dissolution",
                "Store reconstituted peptides at 2-8°C (refrigerator) and use within 4-6 weeks",
                "Always use a new, sterile 18-23g needle for reconstitution",
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded flex items-center justify-center bg-dc-surface-alt text-[9px] font-bold text-dc-text-muted flex-shrink-0 mt-0.5">{i + 1}</span>
                  {tip}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Step 2: Dose Calculation */}
        <div className="space-y-4">
          <Card>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-xl bg-dc-accent/15 flex items-center justify-center">
                <Syringe className="w-4 h-4 text-dc-accent" />
              </div>
              <div>
                <CardTitle>Step 2: Dose Calculator</CardTitle>
                <p className="text-xs text-dc-text-muted mt-0.5">Calculate injection volume for your target dose</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-dc-text-muted uppercase tracking-wide">Desired Dose (mcg)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={desiredDoseMcg}
                    onChange={(e) => setDesiredDoseMcg(e.target.value)}
                    placeholder="e.g. 250"
                    step="1"
                    min="0"
                    className="w-full px-4 py-3 pr-16 rounded-xl text-sm text-dc-text bg-dc-surface border border-dc-border placeholder:text-dc-text-muted/40 focus:outline-none focus:border-dc-accent focus:ring-2 focus:ring-dc-accent/15 transition-all mono"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-dc-text-muted">mcg</span>
                </div>
              </div>

              {/* Syringe Selection */}
              <div>
                <label className="text-xs font-medium text-dc-text-muted uppercase tracking-wide block mb-2">Syringe Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {SYRINGE_TYPES.map((syringe) => (
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

            {/* Dose Result */}
            {doseResult && reconResult ? (
              <div className="mt-5 space-y-3">
                {doseWarning && (
                  <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-dc-danger/8 border border-dc-danger/25 text-xs text-dc-danger">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    {doseWarning}
                  </div>
                )}
                <div className="p-4 rounded-xl border border-dc-accent/20 bg-dc-accent/5">
                  <p className="text-xs text-dc-accent font-medium uppercase tracking-wide mb-3">Injection Volume</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-dc-text-muted mb-0.5">Volume (mL)</p>
                      <p className="text-2xl font-bold text-dc-text mono">{doseResult.mlNeeded.toFixed(3)}</p>
                      <p className="text-[10px] text-dc-text-muted">mL</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-dc-text-muted mb-0.5">Units (on syringe)</p>
                      <p className="text-2xl font-bold text-dc-accent mono">{doseResult.unitsNeeded.toFixed(1)}</p>
                      <p className="text-[10px] text-dc-text-muted">units</p>
                    </div>
                  </div>

                  {/* Visual syringe */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[10px] text-dc-text-muted mb-1.5">
                      <span>Syringe fill ({selectedSyringe.label})</span>
                      <span className="mono">{Math.min(doseResult.percentOfSyringe, 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-3 rounded-full bg-dc-surface overflow-hidden flex">
                      <div
                        className="rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.min(doseResult.percentOfSyringe, 100)}%`,
                          background: doseResult.percentOfSyringe > 90
                            ? "linear-gradient(90deg, #ff4444, #ff6666)"
                            : "linear-gradient(90deg, #ff6b35, #ff8555)",
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] text-dc-text-faint mt-1">
                      <span>0u</span>
                      <span>{selectedSyringe.units / 2}u</span>
                      <span>{selectedSyringe.units}u</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-5 p-4 rounded-xl border border-dc-border bg-dc-surface-alt/30 text-center">
                <Calculator className="w-8 h-8 text-dc-text-faint mx-auto mb-2" />
                <p className="text-xs text-dc-text-muted">
                  {!reconResult
                    ? "Complete Step 1 first to calculate concentration."
                    : "Enter your desired dose to calculate injection volume."}
                </p>
              </div>
            )}
          </Card>

          {/* Syringe Reference */}
          <Card>
            <CardTitle className="mb-4">Syringe Reference Guide</CardTitle>
            <div className="space-y-3">
              {SYRINGE_TYPES.map((s) => (
                <div key={s.label} className="flex items-start gap-3 py-2.5 border-b border-dc-border/40 last:border-0">
                  <div className="w-8 h-8 rounded-lg bg-dc-surface-alt flex items-center justify-center flex-shrink-0">
                    <Syringe className="w-4 h-4 text-dc-text-muted" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dc-text">{s.label}</p>
                    <p className="text-xs text-dc-text-muted">{s.typical}</p>
                    <p className="text-[10px] text-dc-text-faint mt-0.5">
                      {s.graduations} graduations &middot; 1 unit = {(s.ml / s.units * 1000).toFixed(1)} mcg at 1mg/mL
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-dc-border">
              <div className="flex items-start gap-2 text-xs text-dc-text-muted">
                <AlertTriangle className="w-3.5 h-3.5 text-dc-warning flex-shrink-0 mt-0.5" />
                <p>Always use the smallest syringe that accommodates your dose for maximum precision. Never reuse syringes.</p>
              </div>
            </div>
          </Card>

          {/* Disclaimer */}
          <div className="glass rounded-xl px-4 py-3 border border-dc-border/40">
            <p className="text-[10px] text-dc-text-faint leading-relaxed">
              These calculations are for educational and research purposes only. Always verify doses with a qualified healthcare provider. DoseCraft is not liable for dosing errors or adverse effects.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
