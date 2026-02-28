"use client";

import { useState, useMemo } from "react";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs } from "@/components/ui/tabs";
import {
  Beaker,
  Syringe,
  MapPin,
  Calculator,
  Info,
  AlertTriangle,
} from "lucide-react";
import { INJECTION_SITES, MOCK_PEPTIDES } from "@/lib/mock-data";

const CALC_TABS = [
  { id: "reconstitution", label: "Reconstitution" },
  { id: "dose", label: "Dose Calculator" },
  { id: "injection", label: "Injection Guide" },
] as const;

const COMMON_BAC_WATER_ML = [1, 2, 3, 5] as const;

const SYRINGE_TYPES = [
  { label: "Insulin U-100 (1 mL)", totalUnits: 100, totalMl: 1 },
  { label: "Insulin U-100 (0.5 mL)", totalUnits: 50, totalMl: 0.5 },
  { label: "Insulin U-100 (0.3 mL)", totalUnits: 30, totalMl: 0.3 },
] as const;

export default function CalculatorPage() {
  // Reconstitution state
  const [peptideAmountMg, setPeptideAmountMg] = useState("5");
  const [bacWaterMl, setBacWaterMl] = useState("2");
  const [syringeType, setSyringeType] = useState(0);

  // Dose calculator state
  const [selectedPeptide, setSelectedPeptide] = useState(
    MOCK_PEPTIDES[0].slug,
  );
  const [desiredDoseMcg, setDesiredDoseMcg] = useState("250");

  // Injection guide state
  const [selectedSite, setSelectedSite] = useState<string | null>(null);

  // Reconstitution calculations
  const reconResult = useMemo(() => {
    const peptideMg = parseFloat(peptideAmountMg) || 0;
    const waterMl = parseFloat(bacWaterMl) || 0;
    if (peptideMg <= 0 || waterMl <= 0) return null;

    const concentrationMgPerMl = peptideMg / waterMl;
    const concentrationMcgPerMl = concentrationMgPerMl * 1000;
    const syringe = SYRINGE_TYPES[syringeType];
    const unitsPerMl = syringe.totalUnits / syringe.totalMl;
    const mcgPerUnit = concentrationMcgPerMl / unitsPerMl;

    return {
      concentrationMgPerMl,
      concentrationMcgPerMl,
      mcgPerUnit,
      totalDoses: Math.floor(
        (peptideMg * 1000) / (parseFloat(desiredDoseMcg) || 250),
      ),
    };
  }, [peptideAmountMg, bacWaterMl, syringeType, desiredDoseMcg]);

  // Dose calculation
  const doseResult = useMemo(() => {
    if (!reconResult) return null;
    const desiredMcg = parseFloat(desiredDoseMcg) || 0;
    if (desiredMcg <= 0 || reconResult.mcgPerUnit <= 0) return null;

    const unitsNeeded = desiredMcg / reconResult.mcgPerUnit;
    const syringe = SYRINGE_TYPES[syringeType];
    const mlNeeded = unitsNeeded / (syringe.totalUnits / syringe.totalMl);

    return {
      unitsNeeded: Math.round(unitsNeeded * 10) / 10,
      mlNeeded: Math.round(mlNeeded * 1000) / 1000,
      tickMarks: Math.round(unitsNeeded),
    };
  }, [reconResult, desiredDoseMcg, syringeType]);

  const currentPeptide = MOCK_PEPTIDES.find(
    (p) => p.slug === selectedPeptide,
  );
  const selectedSiteInfo = INJECTION_SITES.find(
    (s) => s.id === selectedSite,
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-dc-text">Calculator</h1>
        <p className="text-sm text-dc-text-muted mt-1">
          Reconstitution, dose, and injection calculators.
        </p>
      </div>

      <Tabs tabs={[...CALC_TABS]}>
        {(activeTab) => (
          <div>
            {/* ── Reconstitution Tab ── */}
            {activeTab === "reconstitution" && (
              <div className="space-y-4">
                <Card>
                  <div className="flex items-center gap-2 mb-4">
                    <Beaker className="w-5 h-5 text-dc-clinical" />
                    <CardTitle>Reconstitution Calculator</CardTitle>
                  </div>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Inputs */}
                      <div className="space-y-4">
                        <Input
                          label="Peptide Amount (mg)"
                          type="number"
                          step="0.1"
                          value={peptideAmountMg}
                          onChange={(e) =>
                            setPeptideAmountMg(e.target.value)
                          }
                          placeholder="5"
                        />

                        <div>
                          <label className="text-sm font-medium text-dc-text-muted block mb-2">
                            Bacteriostatic Water (mL)
                          </label>
                          <div className="flex gap-2 mb-2">
                            {COMMON_BAC_WATER_ML.map((ml) => (
                              <button
                                key={ml}
                                onClick={() =>
                                  setBacWaterMl(ml.toString())
                                }
                                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${
                                  bacWaterMl === ml.toString()
                                    ? "bg-dc-clinical/10 border-dc-clinical/30 text-dc-clinical"
                                    : "bg-dc-surface border-dc-border text-dc-text-muted hover:text-dc-text"
                                }`}
                              >
                                {ml} mL
                              </button>
                            ))}
                          </div>
                          <Input
                            type="number"
                            step="0.1"
                            value={bacWaterMl}
                            onChange={(e) =>
                              setBacWaterMl(e.target.value)
                            }
                            placeholder="Custom mL"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-dc-text-muted block mb-2">
                            Syringe Type
                          </label>
                          <div className="space-y-2">
                            {SYRINGE_TYPES.map((syr, i) => (
                              <button
                                key={i}
                                onClick={() => setSyringeType(i)}
                                className={`w-full p-3 rounded-lg border text-left text-sm transition-all flex items-center gap-2 ${
                                  syringeType === i
                                    ? "bg-dc-accent/10 border-dc-accent/30 text-dc-accent"
                                    : "bg-dc-surface border-dc-border text-dc-text-muted hover:text-dc-text"
                                }`}
                              >
                                <Syringe className="w-3.5 h-3.5" />
                                {syr.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Results */}
                      <div className="space-y-4">
                        <div className="glass rounded-xl p-5 space-y-4">
                          <h4 className="text-sm font-semibold text-dc-text uppercase tracking-wide">
                            Results
                          </h4>
                          {reconResult ? (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between py-2 border-b border-dc-border">
                                <span className="text-sm text-dc-text-muted">
                                  Concentration
                                </span>
                                <span className="text-sm font-bold text-dc-clinical font-mono">
                                  {reconResult.concentrationMgPerMl.toFixed(
                                    2,
                                  )}{" "}
                                  mg/mL
                                </span>
                              </div>
                              <div className="flex items-center justify-between py-2 border-b border-dc-border">
                                <span className="text-sm text-dc-text-muted">
                                  Per mL
                                </span>
                                <span className="text-sm font-bold text-dc-clinical font-mono">
                                  {reconResult.concentrationMcgPerMl.toFixed(
                                    0,
                                  )}{" "}
                                  mcg/mL
                                </span>
                              </div>
                              <div className="flex items-center justify-between py-2 border-b border-dc-border">
                                <span className="text-sm text-dc-text-muted">
                                  Per Unit (tick)
                                </span>
                                <span className="text-sm font-bold text-dc-accent font-mono">
                                  {reconResult.mcgPerUnit.toFixed(2)}{" "}
                                  mcg/unit
                                </span>
                              </div>
                              <div className="flex items-center justify-between py-2">
                                <span className="text-sm text-dc-text-muted">
                                  Total doses (
                                  {desiredDoseMcg || 250} mcg)
                                </span>
                                <span className="text-sm font-bold text-dc-neon-green font-mono">
                                  {reconResult.totalDoses}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-dc-text-muted">
                              Enter valid values to see results.
                            </p>
                          )}
                        </div>

                        <div className="flex items-start gap-2 p-3 rounded-lg bg-dc-warning/5 border border-dc-warning/20">
                          <Info className="w-4 h-4 text-dc-warning flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-dc-text-muted">
                            Add bacteriostatic water slowly along the vial
                            wall. Do not shake. Gently swirl until fully
                            dissolved. Store reconstituted peptides
                            refrigerated (2-8C).
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* ── Dose Calculator Tab ── */}
            {activeTab === "dose" && (
              <div className="space-y-4">
                <Card>
                  <div className="flex items-center gap-2 mb-4">
                    <Calculator className="w-5 h-5 text-dc-accent" />
                    <CardTitle>Dose Calculator</CardTitle>
                  </div>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Inputs */}
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-dc-text-muted block mb-2">
                            Select Peptide
                          </label>
                          <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
                            {MOCK_PEPTIDES.map((p) => (
                              <button
                                key={p.slug}
                                onClick={() =>
                                  setSelectedPeptide(p.slug)
                                }
                                className={`w-full p-3 rounded-lg border text-left text-sm transition-all ${
                                  selectedPeptide === p.slug
                                    ? "bg-dc-accent/10 border-dc-accent/30 text-dc-accent"
                                    : "bg-dc-surface border-dc-border text-dc-text-muted hover:text-dc-text"
                                }`}
                              >
                                <span className="font-medium">
                                  {p.name}
                                </span>
                                <span className="text-xs ml-2 opacity-60">
                                  {p.category}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <Input
                          label="Desired Dose (mcg)"
                          type="number"
                          step="10"
                          value={desiredDoseMcg}
                          onChange={(e) =>
                            setDesiredDoseMcg(e.target.value)
                          }
                          placeholder="250"
                        />

                        <Input
                          label="Peptide in Vial (mg)"
                          type="number"
                          step="0.1"
                          value={peptideAmountMg}
                          onChange={(e) =>
                            setPeptideAmountMg(e.target.value)
                          }
                          placeholder="5"
                        />

                        <Input
                          label="BAC Water Added (mL)"
                          type="number"
                          step="0.1"
                          value={bacWaterMl}
                          onChange={(e) =>
                            setBacWaterMl(e.target.value)
                          }
                          placeholder="2"
                        />
                      </div>

                      {/* Results */}
                      <div className="space-y-4">
                        {/* Peptide reference */}
                        {currentPeptide && (
                          <Card>
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-semibold text-dc-text">
                                {currentPeptide.name} Reference
                              </h4>
                              <Badge
                                variant={
                                  currentPeptide.status ===
                                  "well-researched"
                                    ? "success"
                                    : currentPeptide.status === "emerging"
                                      ? "warning"
                                      : "danger"
                                }
                                size="sm"
                              >
                                {currentPeptide.status}
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              {(
                                [
                                  "clinical",
                                  "expert",
                                  "experimental",
                                ] as const
                              ).map((lane) => {
                                const ld =
                                  currentPeptide.laneData[lane];
                                if (!ld) return null;
                                return (
                                  <div
                                    key={lane}
                                    className="flex items-center justify-between py-1.5 border-b border-dc-border last:border-0"
                                  >
                                    <Badge
                                      variant={lane}
                                      size="sm"
                                    >
                                      {lane}
                                    </Badge>
                                    <span className="text-xs font-mono text-dc-text">
                                      {ld.dosageRange}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </Card>
                        )}

                        {/* Dose result */}
                        <div className="glass rounded-xl p-5 space-y-4">
                          <h4 className="text-sm font-semibold text-dc-text uppercase tracking-wide">
                            Draw Volume
                          </h4>
                          {doseResult ? (
                            <div className="space-y-3">
                              <div className="text-center py-4">
                                <p className="text-4xl font-bold text-dc-accent font-mono">
                                  {doseResult.tickMarks}
                                </p>
                                <p className="text-sm text-dc-text-muted mt-1">
                                  units on{" "}
                                  {SYRINGE_TYPES[syringeType].label}
                                </p>
                              </div>
                              <div className="flex items-center justify-between py-2 border-t border-dc-border">
                                <span className="text-sm text-dc-text-muted">
                                  Exact units
                                </span>
                                <span className="text-sm font-mono text-dc-text">
                                  {doseResult.unitsNeeded} IU
                                </span>
                              </div>
                              <div className="flex items-center justify-between py-2 border-t border-dc-border">
                                <span className="text-sm text-dc-text-muted">
                                  Volume
                                </span>
                                <span className="text-sm font-mono text-dc-text">
                                  {doseResult.mlNeeded} mL
                                </span>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-dc-text-muted text-center py-4">
                              Complete the reconstitution values and set
                              your desired dose.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* ── Injection Guide Tab ── */}
            {activeTab === "injection" && (
              <div className="space-y-4">
                <Card>
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-dc-neon-green" />
                    <CardTitle>Injection Site Guide</CardTitle>
                  </div>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Body Map */}
                      <div>
                        <p className="text-sm text-dc-text-muted mb-4">
                          Select an injection site to see guidance.
                        </p>
                        <div className="relative w-full aspect-[3/4] bg-dc-surface-alt rounded-xl border border-dc-border overflow-hidden">
                          {/* Body silhouette */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative w-40 h-72">
                              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-2 border-dc-border" />
                              <div className="absolute top-12 left-1/2 -translate-x-1/2 w-20 h-24 rounded-lg border-2 border-dc-border" />
                              <div className="absolute top-12 left-0 w-8 h-28 rounded-lg border-2 border-dc-border" />
                              <div className="absolute top-12 right-0 w-8 h-28 rounded-lg border-2 border-dc-border" />
                              <div className="absolute top-36 left-[22px] w-10 h-36 rounded-lg border-2 border-dc-border" />
                              <div className="absolute top-36 right-[22px] w-10 h-36 rounded-lg border-2 border-dc-border" />
                            </div>
                          </div>

                          {/* Injection site dots */}
                          {INJECTION_SITES.map((site) => {
                            const isActive =
                              selectedSite === site.id;
                            return (
                              <button
                                key={site.id}
                                onClick={() =>
                                  setSelectedSite(
                                    selectedSite === site.id
                                      ? null
                                      : site.id,
                                  )
                                }
                                className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-200"
                                style={{
                                  left: `${site.x}%`,
                                  top: `${site.y}%`,
                                  backgroundColor: isActive
                                    ? "#00ff88"
                                    : "#00ff8840",
                                  border: isActive
                                    ? "2px solid #00ff88"
                                    : "2px solid #00ff8860",
                                  boxShadow: isActive
                                    ? "0 0 12px #00ff8880"
                                    : "none",
                                }}
                              />
                            );
                          })}
                        </div>
                      </div>

                      {/* Site Info + General Guide */}
                      <div className="space-y-4">
                        {/* Site list */}
                        <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                          {INJECTION_SITES.map((site) => (
                            <button
                              key={site.id}
                              onClick={() =>
                                setSelectedSite(
                                  selectedSite === site.id
                                    ? null
                                    : site.id,
                                )
                              }
                              className={`w-full p-3 rounded-lg border text-left text-sm transition-all flex items-center gap-3 ${
                                selectedSite === site.id
                                  ? "bg-dc-neon-green/10 border-dc-neon-green/30 text-dc-neon-green"
                                  : "bg-dc-surface border-dc-border text-dc-text-muted hover:text-dc-text"
                              }`}
                            >
                              <MapPin className="w-4 h-4 flex-shrink-0" />
                              {site.label}
                            </button>
                          ))}
                        </div>

                        {/* Selected site details */}
                        {selectedSiteInfo && (
                          <Card glowColor="green">
                            <h4 className="text-sm font-semibold text-dc-neon-green mb-2">
                              {selectedSiteInfo.label}
                            </h4>
                            <div className="space-y-2 text-sm text-dc-text-muted">
                              <p>
                                <span className="font-medium text-dc-text">
                                  Technique:
                                </span>{" "}
                                Pinch skin at site, insert needle at 45-90
                                degree angle depending on subcutaneous fat
                                thickness.
                              </p>
                              <p>
                                <span className="font-medium text-dc-text">
                                  Needle:
                                </span>{" "}
                                29-31 gauge, 1/2 inch insulin syringe
                                recommended.
                              </p>
                              <p>
                                <span className="font-medium text-dc-text">
                                  Rotation:
                                </span>{" "}
                                Rotate injection sites to prevent
                                lipohypertrophy. Use each site no more than
                                2x per week.
                              </p>
                            </div>
                          </Card>
                        )}

                        {/* General tips */}
                        <Card>
                          <div className="flex items-center gap-2 mb-3">
                            <AlertTriangle className="w-4 h-4 text-dc-warning" />
                            <h4 className="text-sm font-semibold text-dc-text">
                              General Tips
                            </h4>
                          </div>
                          <ul className="space-y-2 text-sm text-dc-text-muted">
                            <li className="flex items-start gap-2">
                              <span className="text-dc-accent mt-0.5">
                                1.
                              </span>
                              Wash hands thoroughly before handling
                              peptides or syringes.
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-dc-accent mt-0.5">
                                2.
                              </span>
                              Clean injection site with alcohol swab, let
                              dry 30 seconds.
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-dc-accent mt-0.5">
                                3.
                              </span>
                              Draw desired amount with clean syringe,
                              remove air bubbles.
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-dc-accent mt-0.5">
                                4.
                              </span>
                              Inject slowly, hold for 5-10 seconds before
                              withdrawing.
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-dc-accent mt-0.5">
                                5.
                              </span>
                              Apply light pressure with gauze if needed. Do
                              not massage site.
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-dc-accent mt-0.5">
                                6.
                              </span>
                              Dispose of sharps in a proper sharps
                              container immediately.
                            </li>
                          </ul>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </Tabs>
    </div>
  );
}
