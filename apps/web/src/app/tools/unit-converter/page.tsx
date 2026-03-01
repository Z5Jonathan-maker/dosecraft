"use client";

import { useState, useMemo, useCallback } from "react";
import { ArrowLeftRight, ArrowDownUp, Info, Beaker } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";

type ConversionMode = "mcg-mg" | "mg-ml" | "iu-mcg";

const IU_COMPOUNDS: readonly { name: string; factor: number; unit: string; description: string }[] = [
  { name: "HGH", factor: 333, unit: "mcg", description: "1 IU = 333 mcg (somatropin)" },
  { name: "Insulin", factor: 34.7, unit: "mcg", description: "1 IU = 34.7 mcg (human insulin)" },
  { name: "HCG", factor: 0.092, unit: "mcg", description: "1 IU ≈ 0.092 mcg (approx.)" },
  { name: "Custom", factor: 1, unit: "mcg", description: "Enter your own IU → mcg factor" },
];

const CONCENTRATION_PRESETS = [
  { name: "Test Cyp 200mg/mL", concentration: 200 },
  { name: "Test Enan 250mg/mL", concentration: 250 },
  { name: "Deca 200mg/mL", concentration: 200 },
  { name: "BPC-157 (5mg/2mL)", concentration: 2.5 },
  { name: "Semaglutide (5mg/3mL)", concentration: 1.667 },
  { name: "CJC/Ipa (5mg/2.5mL)", concentration: 2 },
] as const;

export default function UnitConverterPage() {
  const [mode, setMode] = useState<ConversionMode>("mcg-mg");
  const [inputValue, setInputValue] = useState("");
  const [direction, setDirection] = useState<"forward" | "reverse">("forward");

  // mg ↔ mL specific
  const [concentration, setConcentration] = useState("");
  const [selectedConcentrationPreset, setSelectedConcentrationPreset] = useState("");

  // IU specific
  const [selectedIuCompound, setSelectedIuCompound] = useState(IU_COMPOUNDS[0].name);
  const [customFactor, setCustomFactor] = useState("");

  const handleConcentrationPreset = (name: string) => {
    const p = CONCENTRATION_PRESETS.find((x) => x.name === name);
    if (p) {
      setConcentration(p.concentration.toString());
      setSelectedConcentrationPreset(name);
    }
  };

  const swapDirection = useCallback(() => {
    setDirection((prev) => (prev === "forward" ? "reverse" : "forward"));
    setInputValue("");
  }, []);

  const iuFactor = useMemo(() => {
    const compound = IU_COMPOUNDS.find((c) => c.name === selectedIuCompound);
    if (!compound) return 1;
    if ((compound.name as string) === "Custom") {
      const custom = parseFloat(customFactor);
      return isNaN(custom) || custom <= 0 ? 1 : custom;
    }
    return compound.factor;
  }, [selectedIuCompound, customFactor]);

  const result = useMemo(() => {
    const input = parseFloat(inputValue);
    if (isNaN(input) || input < 0) return null;

    switch (mode) {
      case "mcg-mg": {
        if (direction === "forward") {
          return { value: input / 1000, fromUnit: "mcg", toUnit: "mg", factor: "÷ 1,000" };
        }
        return { value: input * 1000, fromUnit: "mg", toUnit: "mcg", factor: "× 1,000" };
      }
      case "mg-ml": {
        const conc = parseFloat(concentration);
        if (isNaN(conc) || conc <= 0) return null;
        if (direction === "forward") {
          return { value: input / conc, fromUnit: "mg", toUnit: "mL", factor: `÷ ${conc} mg/mL` };
        }
        return { value: input * conc, fromUnit: "mL", toUnit: "mg", factor: `× ${conc} mg/mL` };
      }
      case "iu-mcg": {
        if (direction === "forward") {
          return { value: input * iuFactor, fromUnit: "IU", toUnit: "mcg", factor: `× ${iuFactor} mcg/IU` };
        }
        return { value: input / iuFactor, fromUnit: "mcg", toUnit: "IU", factor: `÷ ${iuFactor} mcg/IU` };
      }
      default:
        return null;
    }
  }, [mode, inputValue, direction, concentration, iuFactor]);

  const modes: { key: ConversionMode; label: string; description: string }[] = [
    { key: "mcg-mg", label: "mcg ↔ mg", description: "Microgram to milligram" },
    { key: "mg-ml", label: "mg ↔ mL", description: "Mass to volume (needs concentration)" },
    { key: "iu-mcg", label: "IU → mcg", description: "International units to micrograms" },
  ];

  const getFromUnit = () => {
    switch (mode) {
      case "mcg-mg": return direction === "forward" ? "mcg" : "mg";
      case "mg-ml": return direction === "forward" ? "mg" : "mL";
      case "iu-mcg": return direction === "forward" ? "IU" : "mcg";
    }
  };

  const getToUnit = () => {
    switch (mode) {
      case "mcg-mg": return direction === "forward" ? "mg" : "mcg";
      case "mg-ml": return direction === "forward" ? "mL" : "mg";
      case "iu-mcg": return direction === "forward" ? "mcg" : "IU";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Mode Selection */}
      <Card>
        <CardTitle className="mb-3">Conversion Type</CardTitle>
        <div className="grid grid-cols-3 gap-2">
          {modes.map((m) => (
            <button
              key={m.key}
              onClick={() => { setMode(m.key); setInputValue(""); setDirection("forward"); }}
              className={clsx(
                "p-3 rounded-xl border text-center transition-all",
                mode === m.key
                  ? "bg-dc-accent/10 border-dc-accent/30"
                  : "bg-dc-surface border-dc-border hover:border-dc-accent/20",
              )}
            >
              <p className={clsx("text-sm font-bold mono", mode === m.key ? "text-dc-accent" : "text-dc-text")}>{m.label}</p>
              <p className="text-[10px] text-dc-text-muted mt-0.5">{m.description}</p>
            </button>
          ))}
        </div>
      </Card>

      {/* Concentration input for mg-mL mode */}
      {mode === "mg-ml" && (
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-dc-neon-cyan/15 flex items-center justify-center">
              <Beaker className="w-4 h-4 text-dc-neon-cyan" />
            </div>
            <div>
              <CardTitle className="text-sm">Concentration Required</CardTitle>
              <p className="text-[10px] text-dc-text-muted mt-0.5">Enter or select the mg/mL concentration</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {CONCENTRATION_PRESETS.map((p) => (
              <button
                key={p.name}
                onClick={() => handleConcentrationPreset(p.name)}
                className={clsx(
                  "px-3 py-1.5 rounded-xl border text-xs font-medium transition-all",
                  selectedConcentrationPreset === p.name
                    ? "bg-dc-accent/10 text-dc-accent border-dc-accent/30"
                    : "bg-dc-surface text-dc-text-muted border-dc-border hover:border-dc-accent/20 hover:text-dc-text",
                )}
              >
                {p.name}
              </button>
            ))}
          </div>
          <div className="relative">
            <input
              type="number"
              value={concentration}
              onChange={(e) => { setConcentration(e.target.value); setSelectedConcentrationPreset(""); }}
              placeholder="e.g. 200"
              step="0.001"
              min="0"
              className="w-full px-4 py-3 pr-20 rounded-xl text-sm text-dc-text bg-dc-surface border border-dc-border placeholder:text-dc-text-muted/40 focus:outline-none focus:border-dc-accent focus:ring-2 focus:ring-dc-accent/15 transition-all mono"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-dc-text-muted">mg/mL</span>
          </div>
        </Card>
      )}

      {/* IU compound selector */}
      {mode === "iu-mcg" && (
        <Card>
          <CardTitle className="mb-3 text-sm">Select Compound</CardTitle>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {IU_COMPOUNDS.map((c) => (
              <button
                key={c.name}
                onClick={() => setSelectedIuCompound(c.name)}
                className={clsx(
                  "p-3 rounded-xl border text-center transition-all",
                  selectedIuCompound === c.name
                    ? "bg-dc-neon-green/10 border-dc-neon-green/30"
                    : "bg-dc-surface border-dc-border hover:border-dc-neon-green/20",
                )}
              >
                <p className={clsx("text-xs font-bold", selectedIuCompound === c.name ? "text-dc-neon-green" : "text-dc-text")}>{c.name}</p>
                <p className="text-[9px] text-dc-text-muted mt-0.5">{c.description}</p>
              </button>
            ))}
          </div>
          {selectedIuCompound === "Custom" && (
            <div className="mt-3 relative">
              <input
                type="number"
                value={customFactor}
                onChange={(e) => setCustomFactor(e.target.value)}
                placeholder="Enter mcg per IU"
                step="0.001"
                min="0"
                className="w-full px-4 py-3 pr-24 rounded-xl text-sm text-dc-text bg-dc-surface border border-dc-border placeholder:text-dc-text-muted/40 focus:outline-none focus:border-dc-accent focus:ring-2 focus:ring-dc-accent/15 transition-all mono"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-dc-text-muted">mcg/IU</span>
            </div>
          )}
        </Card>
      )}

      {/* Converter Interface */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-start">
        {/* Input Side */}
        <Card>
          <p className="text-xs text-dc-text-muted uppercase tracking-wide font-medium mb-2">From</p>
          <Badge variant="default" size="md" className="mb-3">{getFromUnit()}</Badge>
          <div className="relative">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value"
              step="any"
              min="0"
              className="w-full px-4 py-4 rounded-xl text-lg text-dc-text bg-dc-surface border border-dc-border placeholder:text-dc-text-muted/40 focus:outline-none focus:border-dc-accent focus:ring-2 focus:ring-dc-accent/15 transition-all mono"
            />
          </div>
        </Card>

        {/* Swap Button */}
        <div className="flex md:flex-col items-center justify-center py-2 md:py-8">
          <button
            onClick={swapDirection}
            className="w-10 h-10 rounded-xl bg-dc-surface border border-dc-border flex items-center justify-center hover:border-dc-accent/30 hover:bg-dc-accent/5 transition-all active:scale-95"
            title="Swap direction"
          >
            <ArrowLeftRight className="w-4 h-4 text-dc-accent hidden md:block" />
            <ArrowDownUp className="w-4 h-4 text-dc-accent md:hidden" />
          </button>
          {result && (
            <p className="text-[10px] text-dc-text-faint mono ml-3 md:ml-0 md:mt-2">{result.factor}</p>
          )}
        </div>

        {/* Output Side */}
        <Card className={clsx(result && "border-dc-neon-green/20")}>
          <p className="text-xs text-dc-text-muted uppercase tracking-wide font-medium mb-2">To</p>
          <Badge variant="success" size="md" className="mb-3">{getToUnit()}</Badge>
          <div className="px-4 py-4 rounded-xl bg-dc-surface border border-dc-border">
            {result ? (
              <p className="text-lg font-bold text-dc-neon-green mono transition-all duration-300">
                {result.value < 0.001 && result.value > 0
                  ? result.value.toExponential(4)
                  : result.value.toLocaleString("en-US", { maximumFractionDigits: 6 })}
              </p>
            ) : (
              <p className="text-lg text-dc-text-faint">—</p>
            )}
          </div>
        </Card>
      </div>

      {/* Conversion Reference & Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-dc-text-muted" />
            <CardTitle className="text-sm">Quick Reference</CardTitle>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-dc-border/40">
              <span className="text-dc-text-muted">1 mg</span>
              <span className="text-dc-text mono font-medium">= 1,000 mcg</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-dc-border/40">
              <span className="text-dc-text-muted">1 mL</span>
              <span className="text-dc-text mono font-medium">= 100 insulin units</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-dc-border/40">
              <span className="text-dc-text-muted">1 IU HGH</span>
              <span className="text-dc-text mono font-medium">= 333 mcg</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-dc-border/40">
              <span className="text-dc-text-muted">1 IU Insulin</span>
              <span className="text-dc-text mono font-medium">= 34.7 mcg</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-dc-text-muted">1 IU HCG</span>
              <span className="text-dc-text mono font-medium">≈ 0.092 mcg</span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-dc-text-muted" />
            <CardTitle className="text-sm">Conversion Tips</CardTitle>
          </div>
          <div className="space-y-2.5 text-xs text-dc-text-muted">
            {[
              "mcg ↔ mg: Move the decimal point 3 places. 250 mcg = 0.25 mg",
              "mg → mL requires knowing your compound's concentration (mg/mL)",
              "IU conversions are compound-specific — 1 IU of HGH ≠ 1 IU of Insulin",
              "When in doubt, verify IU conversion factors from your compound's documentation",
              "For reconstituted peptides, concentration = vial mg ÷ water mL added",
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="w-4 h-4 rounded flex items-center justify-center bg-dc-surface-alt text-[9px] font-bold text-dc-text-muted flex-shrink-0 mt-0.5">{i + 1}</span>
                {tip}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Disclaimer */}
      <div className="glass rounded-xl px-4 py-3 border border-dc-border/40">
        <p className="text-[10px] text-dc-text-faint leading-relaxed">
          Unit conversions are based on standard pharmacological references. IU (International Unit) values are compound-specific and may vary between manufacturers. Always cross-reference with product documentation. For educational and research purposes only.
        </p>
      </div>
    </div>
  );
}
