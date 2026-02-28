"use client";

import { useState, useMemo } from "react";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Beaker, Syringe, MapPin, Snowflake, Info } from "lucide-react";
import { INJECTION_SITES } from "@/lib/mock-data";

export default function CalculatorPage() {
  // Reconstitution
  const [peptideMg, setPeptideMg] = useState("5");
  const [waterMl, setWaterMl] = useState("2");

  // Dose
  const [desiredMcg, setDesiredMcg] = useState("250");

  // Site tracking
  const [selectedSite, setSelectedSite] = useState<string | null>(null);

  const reconstitution = useMemo(() => {
    const mg = parseFloat(peptideMg);
    const ml = parseFloat(waterMl);
    if (isNaN(mg) || isNaN(ml) || mg <= 0 || ml <= 0) return null;

    const totalMcg = mg * 1000;
    const totalUnits = ml * 100; // 100 units per ml in insulin syringe
    const mcgPerUnit = totalMcg / totalUnits;
    const mgPerMl = mg / ml;

    return { mcgPerUnit, mgPerMl, totalUnits, totalMcg };
  }, [peptideMg, waterMl]);

  const doseCalc = useMemo(() => {
    const mcg = parseFloat(desiredMcg);
    if (!reconstitution || isNaN(mcg) || mcg <= 0) return null;

    const units = mcg / reconstitution.mcgPerUnit;
    const ml = units / 100;

    return { units: units.toFixed(1), ml: ml.toFixed(3) };
  }, [desiredMcg, reconstitution]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reconstitution Calculator */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Beaker className="w-5 h-5 text-dc-clinical" />
            <CardTitle>Reconstitution Calculator</CardTitle>
          </div>
          <CardContent>
            <div className="space-y-4">
              <Input
                label="Peptide Amount (mg)"
                type="number"
                step="0.1"
                min="0"
                value={peptideMg}
                onChange={(e) => setPeptideMg(e.target.value)}
              />
              <Input
                label="Bacteriostatic Water (mL)"
                type="number"
                step="0.1"
                min="0"
                value={waterMl}
                onChange={(e) => setWaterMl(e.target.value)}
              />

              {reconstitution && (
                <div className="mt-4 p-4 rounded-lg bg-dc-surface-alt/50 border border-dc-border space-y-3">
                  <h4 className="text-sm font-semibold text-dc-text">Results</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-dc-text-muted">Concentration</p>
                      <p className="text-lg font-bold text-dc-clinical font-mono">
                        {reconstitution.mgPerMl.toFixed(2)} mg/mL
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-dc-text-muted">Per Unit (IU syringe)</p>
                      <p className="text-lg font-bold text-dc-accent font-mono">
                        {reconstitution.mcgPerUnit.toFixed(1)} mcg/unit
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-dc-text-muted">Total mcg</p>
                      <p className="text-lg font-bold text-dc-text font-mono">
                        {reconstitution.totalMcg.toLocaleString()} mcg
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-dc-text-muted">Total Units</p>
                      <p className="text-lg font-bold text-dc-text font-mono">
                        {reconstitution.totalUnits}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dose Calculator */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Syringe className="w-5 h-5 text-dc-accent" />
            <CardTitle>Dose Calculator</CardTitle>
          </div>
          <CardContent>
            <div className="space-y-4">
              <Input
                label="Desired Dose (mcg)"
                type="number"
                step="10"
                min="0"
                value={desiredMcg}
                onChange={(e) => setDesiredMcg(e.target.value)}
              />

              {!reconstitution && (
                <p className="text-xs text-dc-text-muted">
                  Fill in the reconstitution calculator first.
                </p>
              )}

              {doseCalc && (
                <div className="mt-4 p-4 rounded-lg bg-dc-surface-alt/50 border border-dc-border space-y-3">
                  <h4 className="text-sm font-semibold text-dc-text">Draw</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-dc-text-muted">Units to draw</p>
                      <p className="text-2xl font-bold text-dc-neon-green font-mono">
                        {doseCalc.units}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-dc-text-muted">Volume (mL)</p>
                      <p className="text-2xl font-bold text-dc-text font-mono">
                        {doseCalc.ml}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Injection Site Guide */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-dc-neon-purple" />
          <CardTitle>Injection Site Rotation</CardTitle>
        </div>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Body diagram */}
            <div className="relative bg-dc-surface-alt rounded-xl p-6 min-h-[400px]">
              {/* Simple body outline */}
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full max-h-[350px]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Head */}
                <circle cx="50" cy="15" r="8" stroke="#2a2a3e" strokeWidth="1.5" />
                {/* Neck */}
                <line x1="50" y1="23" x2="50" y2="28" stroke="#2a2a3e" strokeWidth="1.5" />
                {/* Body */}
                <path
                  d="M 35 28 L 65 28 L 68 55 L 62 65 L 58 65 L 55 85 L 53 95 L 47 95 L 45 85 L 42 65 L 38 65 L 32 55 Z"
                  stroke="#2a2a3e"
                  strokeWidth="1.5"
                  fill="none"
                />
                {/* Left arm */}
                <path d="M 35 28 L 22 35 L 18 50 L 15 60" stroke="#2a2a3e" strokeWidth="1.5" />
                {/* Right arm */}
                <path d="M 65 28 L 78 35 L 82 50 L 85 60" stroke="#2a2a3e" strokeWidth="1.5" />

                {/* Injection sites */}
                {INJECTION_SITES.slice(0, 6).map((site) => (
                  <g key={site.id}>
                    <circle
                      cx={site.x}
                      cy={site.y}
                      r={selectedSite === site.id ? 3.5 : 2.5}
                      fill={selectedSite === site.id ? "#ff6b35" : "#b366ff"}
                      stroke={selectedSite === site.id ? "#ff6b35" : "#b366ff50"}
                      strokeWidth="1"
                      className="cursor-pointer transition-all"
                      onClick={() => setSelectedSite(site.id === selectedSite ? null : site.id)}
                      style={{
                        filter: selectedSite === site.id
                          ? "drop-shadow(0 0 6px #ff6b35)"
                          : "drop-shadow(0 0 4px #b366ff50)",
                      }}
                    />
                  </g>
                ))}
              </svg>
            </div>

            {/* Site list */}
            <div className="space-y-2">
              <p className="text-sm text-dc-text-muted mb-3">
                Click a site on the body diagram or select from the list below. Rotate sites to prevent tissue buildup.
              </p>
              {INJECTION_SITES.map((site) => (
                <button
                  key={site.id}
                  onClick={() => setSelectedSite(site.id === selectedSite ? null : site.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                    selectedSite === site.id
                      ? "bg-dc-accent/10 border-dc-accent/30"
                      : "bg-dc-surface border-dc-border hover:border-dc-text-muted"
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full ${
                      selectedSite === site.id ? "bg-dc-accent" : "bg-dc-neon-purple"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      selectedSite === site.id ? "text-dc-accent" : "text-dc-text-muted"
                    }`}
                  >
                    {site.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Storage Info */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Snowflake className="w-5 h-5 text-dc-clinical" />
          <CardTitle>Storage Guide</CardTitle>
        </div>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-dc-surface-alt/50 border border-dc-border">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="clinical" size="sm">Unreconstituted</Badge>
              </div>
              <p className="text-sm text-dc-text">Room temp: 2-4 weeks</p>
              <p className="text-sm text-dc-text">Refrigerated: 12+ months</p>
              <p className="text-sm text-dc-text">Frozen: 2+ years</p>
            </div>
            <div className="p-4 rounded-lg bg-dc-surface-alt/50 border border-dc-border">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="expert" size="sm">Reconstituted</Badge>
              </div>
              <p className="text-sm text-dc-text">Refrigerated only</p>
              <p className="text-sm text-dc-text">Use within 3-4 weeks</p>
              <p className="text-sm text-dc-text">Never freeze after mixing</p>
            </div>
            <div className="p-4 rounded-lg bg-dc-surface-alt/50 border border-dc-border">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="danger" size="sm">Avoid</Badge>
              </div>
              <p className="text-sm text-dc-text">Direct sunlight</p>
              <p className="text-sm text-dc-text">Temperatures above 77F/25C</p>
              <p className="text-sm text-dc-text">Vigorous shaking (swirl gently)</p>
            </div>
          </div>

          <div className="flex items-start gap-2 mt-4 p-3 rounded-lg bg-dc-clinical/5 border border-dc-clinical/20">
            <Info className="w-4 h-4 text-dc-clinical mt-0.5 flex-shrink-0" />
            <p className="text-xs text-dc-clinical/80">
              Always use bacteriostatic water (BAC water) for reconstitution, not sterile water.
              BAC water contains 0.9% benzyl alcohol as a preservative, allowing multiple draws from the same vial.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
