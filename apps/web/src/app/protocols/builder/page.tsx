"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Search,
  Plus,
  X,
  Sparkles,
  AlertTriangle,
  Syringe,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LaneBadge, LaneDots, LANE_CONFIG } from "@/components/peptide/lane-badge";
import { MOCK_PEPTIDES, PROTOCOL_GOALS } from "@/lib/mock-data";
import type { EvidenceLane, Peptide } from "@/types";
import clsx from "clsx";

type Step = 1 | 2 | 3 | 4;

const STEPS = [
  { n: 1, label: "Select Peptides" },
  { n: 2, label: "Set Doses" },
  { n: 3, label: "Schedule" },
  { n: 4, label: "Review" },
] as const;

const FREQ_OPTIONS = [
  "Once daily",
  "2x daily",
  "3x daily",
  "Every other day",
  "2x per week",
  "3x per week",
  "Weekly",
] as const;

interface DoseConfig {
  slug: string;
  dose: string;
  unit: "mcg" | "mg" | "IU";
  frequency: string;
  timing: string;
}

const AI_SUGGESTIONS = [
  { text: "BPC-157 + TB-500 combination is clinically validated for enhanced healing synergy.", type: "positive" as const },
  { text: "Consider adding GHK-Cu for enhanced collagen synthesis and skin benefits with this stack.", type: "info" as const },
  { text: "CJC/Ipa at bedtime aligns with natural GH pulse patterns for optimal effect.", type: "positive" as const },
];

const INTERACTIONS: Record<string, { with: string; message: string; severity: "warning" | "synergy" }[]> = {
  "cjc-1295-ipamorelin": [
    { with: "semaglutide", message: "Monitor insulin sensitivity closely when combining GH peptides with GLP-1 agonists.", severity: "warning" },
  ],
  "bpc-157": [
    { with: "tb-500", message: "Highly synergistic combination — BPC-157 + TB-500 is the gold standard healing stack.", severity: "synergy" },
  ],
};

export default function ProtocolBuilderPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [protocolName, setProtocolName] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedPeptides, setSelectedPeptides] = useState<Peptide[]>([]);
  const [doseConfigs, setDoseConfigs] = useState<DoseConfig[]>([]);
  const [laneFilter, setLaneFilter] = useState<EvidenceLane | null>(null);
  const [search, setSearch] = useState("");
  const [duration, setDuration] = useState("8 weeks");
  const [expandedConfig, setExpandedConfig] = useState<string | null>(null);

  const filteredPeptides = useMemo(() => {
    return MOCK_PEPTIDES.filter((p) => {
      const matchSearch =
        search === "" ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase());
      const matchLane = laneFilter === null || p.lanes.includes(laneFilter);
      return matchSearch && matchLane;
    });
  }, [search, laneFilter]);

  const togglePeptide = (peptide: Peptide) => {
    if (selectedPeptides.find((p) => p.slug === peptide.slug)) {
      setSelectedPeptides((prev) => prev.filter((p) => p.slug !== peptide.slug));
      setDoseConfigs((prev) => prev.filter((d) => d.slug !== peptide.slug));
    } else {
      setSelectedPeptides((prev) => [...prev, peptide]);
      setDoseConfigs((prev) => [
        ...prev,
        {
          slug: peptide.slug,
          dose: "",
          unit: "mcg",
          frequency: "Once daily",
          timing: "Morning",
        },
      ]);
    }
  };

  const updateDoseConfig = (slug: string, field: keyof DoseConfig, value: string) => {
    setDoseConfigs((prev) =>
      prev.map((d) => (d.slug === slug ? { ...d, [field]: value } : d)),
    );
  };

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal],
    );
  };

  const getInteractions = () => {
    const slugs = selectedPeptides.map((p) => p.slug);
    const found: { message: string; severity: "warning" | "synergy" }[] = [];
    for (const slug of slugs) {
      const ints = INTERACTIONS[slug];
      if (ints) {
        for (const interaction of ints) {
          if (slugs.includes(interaction.with)) {
            found.push({ message: interaction.message, severity: interaction.severity });
          }
        }
      }
    }
    return found;
  };

  const interactions = getInteractions();

  const canProceed = () => {
    if (step === 1) return selectedPeptides.length > 0 && protocolName.trim().length > 0;
    if (step === 2) return doseConfigs.every((d) => d.dose.trim().length > 0);
    if (step === 3) return duration.trim().length > 0;
    return true;
  };

  const nextStep = () => { if (step < 4) setStep((step + 1) as Step); };
  const prevStep = () => { if (step > 1) setStep((step - 1) as Step); };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/protocols">
          <button className="p-2 rounded-xl hover:bg-dc-surface text-dc-text-muted hover:text-dc-text transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
        </Link>
        <div>
          <p className="text-xs text-dc-text-muted">Protocols</p>
          <h1 className="text-lg font-bold text-dc-text leading-none">Protocol Builder</h1>
        </div>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s.n} className="flex items-center gap-2 flex-1">
            <div
              className={clsx(
                "flex items-center gap-2 flex-1 px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer",
                step === s.n
                  ? "bg-dc-accent/10 border-dc-accent/30 text-dc-accent"
                  : step > s.n
                  ? "bg-dc-neon-green/8 border-dc-neon-green/20 text-dc-neon-green"
                  : "bg-dc-surface border-dc-border text-dc-text-muted",
              )}
              onClick={() => step > s.n && setStep(s.n as Step)}
            >
              <div
                className={clsx(
                  "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0",
                  step === s.n ? "bg-dc-accent text-white" : step > s.n ? "bg-dc-neon-green text-dc-bg" : "bg-dc-surface-alt text-dc-text-muted",
                )}
              >
                {step > s.n ? <Check className="w-3 h-3" /> : s.n}
              </div>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={clsx("w-6 h-px flex-shrink-0", step > s.n ? "bg-dc-neon-green/40" : "bg-dc-border")} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {step === 1 && (
        <div className="space-y-4">
          {/* Protocol Name & Goals */}
          <Card>
            <CardTitle className="mb-4">Protocol Details</CardTitle>
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-dc-text-muted uppercase tracking-wide">Protocol Name</label>
                <input
                  type="text"
                  value={protocolName}
                  onChange={(e) => setProtocolName(e.target.value)}
                  placeholder="e.g. My Healing Stack Q1 2026"
                  className="w-full px-4 py-3 rounded-xl text-sm text-dc-text bg-dc-surface border border-dc-border placeholder:text-dc-text-muted/40 focus:outline-none focus:border-dc-accent focus:ring-2 focus:ring-dc-accent/15 transition-all"
                />
              </div>
              <div>
                <p className="text-xs font-medium text-dc-text-muted uppercase tracking-wide mb-3">Goals</p>
                <div className="flex flex-wrap gap-2">
                  {PROTOCOL_GOALS.map((goal) => (
                    <button
                      key={goal}
                      onClick={() => toggleGoal(goal)}
                      className={clsx(
                        "px-3 py-1.5 rounded-full border text-xs font-medium transition-all capitalize",
                        selectedGoals.includes(goal)
                          ? "bg-dc-accent/10 text-dc-accent border-dc-accent/30"
                          : "bg-transparent text-dc-text-muted border-dc-border hover:border-dc-accent/20 hover:text-dc-text",
                      )}
                    >
                      {goal.replace(/-/g, " ")}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Peptide Selector */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <CardTitle>Select Peptides</CardTitle>
              {selectedPeptides.length > 0 && (
                <Badge variant="success" size="sm">{selectedPeptides.length} selected</Badge>
              )}
            </div>

            <div className="space-y-3">
              {/* Search + Lane filter */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-dc-text-muted" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search compounds..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-dc-text bg-dc-surface border border-dc-border placeholder:text-dc-text-muted/40 focus:outline-none focus:border-dc-accent focus:ring-2 focus:ring-dc-accent/15 transition-all"
                  />
                </div>
                <div className="flex gap-1">
                  {(["clinical", "expert", "experimental"] as EvidenceLane[]).map((lane) => {
                    const config = LANE_CONFIG[lane];
                    return (
                      <button
                        key={lane}
                        onClick={() => setLaneFilter(laneFilter === lane ? null : lane)}
                        className="p-2.5 rounded-xl border transition-all"
                        style={
                          laneFilter === lane
                            ? { background: `${config.color}15`, borderColor: `${config.color}40` }
                            : { borderColor: "#2a2a3e" }
                        }
                        title={config.label}
                      >
                        <div className={clsx("w-2 h-2 rounded-full", laneFilter === lane ? "" : "opacity-40")}
                          style={{ background: config.color, boxShadow: laneFilter === lane ? `0 0 6px ${config.color}` : "none" }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Peptide grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                {filteredPeptides.map((peptide) => {
                  const isSelected = selectedPeptides.some((p) => p.slug === peptide.slug);
                  return (
                    <button
                      key={peptide.slug}
                      onClick={() => togglePeptide(peptide)}
                      className={clsx(
                        "flex items-start gap-3 p-3 rounded-xl border text-left transition-all",
                        isSelected
                          ? "bg-dc-accent/8 border-dc-accent/30"
                          : "bg-dc-surface-alt/30 border-dc-border/50 hover:border-dc-accent/20 hover:bg-dc-surface-alt/60",
                      )}
                    >
                      <div
                        className={clsx(
                          "w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 border transition-all",
                          isSelected ? "bg-dc-accent border-dc-accent" : "border-dc-border",
                        )}
                      >
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-medium text-dc-text truncate">{peptide.name}</span>
                          <LaneDots lanes={peptide.lanes} size="xs" />
                        </div>
                        <p className="text-[10px] text-dc-text-muted capitalize">{peptide.category.replace(/-/g, " ")} &middot; {peptide.route}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* AI Suggestions */}
          {selectedPeptides.length > 0 && (
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-dc-neon-purple" />
                <CardTitle className="text-dc-neon-purple">AI Suggestions</CardTitle>
              </div>
              <div className="space-y-2">
                {AI_SUGGESTIONS.map((s, i) => (
                  <div key={i} className={clsx("flex items-start gap-2.5 px-3 py-2.5 rounded-xl text-xs", s.type === "positive" ? "bg-dc-neon-green/8 text-dc-neon-green" : "bg-dc-neon-cyan/8 text-dc-neon-cyan")}>
                    <Sparkles className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 opacity-70" />
                    {s.text}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Interaction Checker */}
          {interactions.length > 0 && (
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-dc-warning" />
                <CardTitle>Interaction Check</CardTitle>
              </div>
              <div className="space-y-2">
                {interactions.map((int, i) => (
                  <div
                    key={i}
                    className={clsx(
                      "flex items-start gap-2.5 px-3 py-2.5 rounded-xl text-xs",
                      int.severity === "synergy" ? "bg-dc-neon-green/8 text-dc-neon-green" : "bg-dc-warning/8 text-dc-warning",
                    )}
                  >
                    {int.severity === "synergy" ? (
                      <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    )}
                    {int.message}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <p className="text-sm text-dc-text-muted">Configure doses for each selected compound.</p>
          {selectedPeptides.map((peptide) => {
            const config = doseConfigs.find((d) => d.slug === peptide.slug)!;
            const isExpanded = expandedConfig === peptide.slug;
            return (
              <Card key={peptide.slug}>
                <button
                  className="w-full flex items-center justify-between"
                  onClick={() => setExpandedConfig(isExpanded ? null : peptide.slug)}
                >
                  <div className="flex items-center gap-3">
                    <LaneDots lanes={peptide.lanes} size="xs" />
                    <span className="text-sm font-medium text-dc-text">{peptide.name}</span>
                    {config.dose && (
                      <Badge variant="default" size="xs" className="mono">{config.dose} {config.unit}</Badge>
                    )}
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-dc-text-muted" /> : <ChevronDown className="w-4 h-4 text-dc-text-muted" />}
                </button>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-dc-border grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {/* Dose Amount */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-dc-text-muted uppercase tracking-wide">Dose</label>
                      <input
                        type="number"
                        value={config.dose}
                        onChange={(e) => updateDoseConfig(peptide.slug, "dose", e.target.value)}
                        placeholder="250"
                        className="w-full px-3 py-2.5 rounded-xl text-sm text-dc-text bg-dc-surface border border-dc-border placeholder:text-dc-text-muted/40 focus:outline-none focus:border-dc-accent focus:ring-2 focus:ring-dc-accent/15 transition-all"
                      />
                    </div>
                    {/* Unit */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-dc-text-muted uppercase tracking-wide">Unit</label>
                      <select
                        value={config.unit}
                        onChange={(e) => updateDoseConfig(peptide.slug, "unit", e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl text-sm text-dc-text bg-dc-surface border border-dc-border focus:outline-none focus:border-dc-accent transition-all"
                      >
                        <option value="mcg">mcg</option>
                        <option value="mg">mg</option>
                        <option value="IU">IU</option>
                      </select>
                    </div>
                    {/* Frequency */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-dc-text-muted uppercase tracking-wide">Frequency</label>
                      <select
                        value={config.frequency}
                        onChange={(e) => updateDoseConfig(peptide.slug, "frequency", e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl text-sm text-dc-text bg-dc-surface border border-dc-border focus:outline-none focus:border-dc-accent transition-all"
                      >
                        {FREQ_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                    {/* Timing */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-dc-text-muted uppercase tracking-wide">Timing</label>
                      <input
                        type="text"
                        value={config.timing}
                        onChange={(e) => updateDoseConfig(peptide.slug, "timing", e.target.value)}
                        placeholder="Morning"
                        className="w-full px-3 py-2.5 rounded-xl text-sm text-dc-text bg-dc-surface border border-dc-border placeholder:text-dc-text-muted/40 focus:outline-none focus:border-dc-accent focus:ring-2 focus:ring-dc-accent/15 transition-all"
                      />
                    </div>
                    {/* Hint */}
                    <div className="col-span-2 sm:col-span-4">
                      <p className="text-[10px] text-dc-text-muted">
                        Typical range for {peptide.name}: <span className="text-dc-text mono">{peptide.typicalDoseRange}</span>
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <Card>
            <CardTitle className="mb-4">Protocol Schedule</CardTitle>
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-dc-text-muted uppercase tracking-wide">Duration</label>
                <div className="flex flex-wrap gap-2">
                  {["4 weeks", "6 weeks", "8 weeks", "12 weeks", "16 weeks"].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      className={clsx(
                        "px-4 py-2 rounded-xl border text-sm font-medium transition-all",
                        duration === d
                          ? "bg-dc-accent/10 text-dc-accent border-dc-accent/30"
                          : "bg-dc-surface text-dc-text-muted border-dc-border hover:border-dc-accent/20",
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-dc-neon-purple" />
              <CardTitle className="text-dc-neon-purple">AI Schedule Recommendations</CardTitle>
            </div>
            <div className="space-y-2.5">
              {selectedPeptides.map((p) => {
                const config = doseConfigs.find((d) => d.slug === p.slug);
                return (
                  <div key={p.slug} className="flex items-start gap-3 py-2 border-b border-dc-border/40 last:border-0">
                    <LaneDots lanes={p.lanes} size="xs" />
                    <div>
                      <span className="text-sm font-medium text-dc-text">{p.name}</span>
                      <p className="text-xs text-dc-text-muted mt-0.5">
                        {config?.dose} {config?.unit} — {config?.frequency} — {config?.timing}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <Card className="card-expert glow-accent">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-dc-neon-green/15 flex items-center justify-center">
                <Check className="w-4 h-4 text-dc-neon-green" />
              </div>
              <div>
                <p className="text-sm font-semibold text-dc-text">{protocolName || "Custom Protocol"}</p>
                <p className="text-xs text-dc-text-muted">{duration} &middot; {selectedPeptides.length} compounds</p>
              </div>
            </div>

            {selectedGoals.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {selectedGoals.map((goal) => (
                  <Badge key={goal} variant="default" size="xs" className="capitalize">{goal.replace(/-/g, " ")}</Badge>
                ))}
              </div>
            )}

            <div className="space-y-3">
              {selectedPeptides.map((peptide) => {
                const config = doseConfigs.find((d) => d.slug === peptide.slug);
                return (
                  <div key={peptide.slug} className="flex items-center justify-between py-3 border-b border-dc-border/40 last:border-0">
                    <div className="flex items-center gap-3">
                      <LaneDots lanes={peptide.lanes} size="xs" />
                      <div>
                        <p className="text-sm font-medium text-dc-text">{peptide.name}</p>
                        <p className="text-xs text-dc-text-muted">{config?.timing}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-dc-text mono">{config?.dose} {config?.unit}</p>
                      <p className="text-[10px] text-dc-text-muted">{config?.frequency}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <div className="glass rounded-2xl px-5 py-4 flex items-center gap-3 border border-dc-neon-green/20 bg-dc-neon-green/5">
            <Syringe className="w-5 h-5 text-dc-neon-green flex-shrink-0" />
            <p className="text-sm text-dc-text-muted">
              Protocol saved locally. Connect the API to persist and share your protocols.
            </p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="ghost"
          onClick={prevStep}
          disabled={step === 1}
          className="gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {step < 4 ? (
          <Button
            variant="primary"
            onClick={nextStep}
            disabled={!canProceed()}
            className="gap-1.5"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            variant="success"
            onClick={() => router.push("/protocols")}
            className="gap-1.5"
          >
            <Check className="w-4 h-4" />
            Save Protocol
          </Button>
        )}
      </div>
    </div>
  );
}
