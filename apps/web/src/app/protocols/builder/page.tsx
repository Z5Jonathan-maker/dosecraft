"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Target,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { MOCK_PEPTIDES, PROTOCOL_GOALS } from "@/lib/mock-data";

type Intensity = "conservative" | "standard" | "aggressive";

interface BuilderState {
  readonly goals: readonly string[];
  readonly intensity: Intensity;
  readonly maxCompounds: number;
  readonly avoidRoutes: readonly string[];
  readonly name: string;
}

const INITIAL_STATE: BuilderState = {
  goals: [],
  intensity: "standard",
  maxCompounds: 4,
  avoidRoutes: [],
  name: "",
};

const STEPS = [
  { id: 0, label: "Goals", icon: Target },
  { id: 1, label: "Risk Appetite", icon: Shield },
  { id: 2, label: "Constraints", icon: AlertTriangle },
  { id: 3, label: "Review", icon: Check },
] as const;

const ROUTE_OPTIONS = [
  "subcutaneous",
  "oral",
  "topical",
  "intranasal",
  "intramuscular",
] as const;

const INTENSITY_INFO: Record<
  Intensity,
  { label: string; description: string; color: string }
> = {
  conservative: {
    label: "Conservative",
    description:
      "Clinically-backed doses with the strongest safety profiles. Best for beginners or those prioritizing safety.",
    color: "#00ff88",
  },
  standard: {
    label: "Standard",
    description:
      "Practitioner-recommended ranges with established usage patterns. Good balance of efficacy and safety.",
    color: "#ffaa00",
  },
  aggressive: {
    label: "Aggressive",
    description:
      "Higher-end experimental doses with less established safety data. For experienced users who accept higher risk.",
    color: "#ff4444",
  },
};

const GOAL_CATEGORY_MAP: Record<string, string[]> = {
  "injury-recovery": ["healing"],
  "joint-health": ["healing"],
  "gut-healing": ["healing"],
  "body-recomp": ["growth-hormone", "metabolic"],
  "fat-loss": ["metabolic"],
  "muscle-gain": ["growth-hormone"],
  sleep: ["growth-hormone", "sleep"],
  recovery: ["healing", "growth-hormone"],
  "anti-aging": ["cosmetic", "growth-hormone"],
  skin: ["cosmetic"],
  hair: ["cosmetic"],
  cognitive: ["neuroprotective"],
  "immune-support": ["immune"],
  "sexual-health": ["growth-hormone"],
};

export default function ProtocolBuilderPage() {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<BuilderState>(INITIAL_STATE);

  const toggleGoal = (goal: string) => {
    setState((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal],
    }));
  };

  const toggleRoute = (route: string) => {
    setState((prev) => ({
      ...prev,
      avoidRoutes: prev.avoidRoutes.includes(route)
        ? prev.avoidRoutes.filter((r) => r !== route)
        : [...prev.avoidRoutes, route],
    }));
  };

  const recommendedPeptides = useMemo(() => {
    const relevantCategories = state.goals.flatMap(
      (goal) => GOAL_CATEGORY_MAP[goal] ?? [],
    );
    const uniqueCategories = [...new Set(relevantCategories)];

    return MOCK_PEPTIDES.filter((p) => {
      const matchesCategory =
        uniqueCategories.length === 0 ||
        uniqueCategories.includes(p.category);
      const routeAllowed = !state.avoidRoutes.includes(p.route);
      return matchesCategory && routeAllowed;
    }).slice(0, state.maxCompounds);
  }, [state.goals, state.avoidRoutes, state.maxCompounds]);

  const laneForIntensity = (intensity: Intensity) => {
    switch (intensity) {
      case "conservative":
        return "clinical" as const;
      case "standard":
        return "expert" as const;
      case "aggressive":
        return "experimental" as const;
    }
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return state.goals.length > 0;
      case 1:
        return true;
      case 2:
        return true;
      case 3:
        return state.name.trim().length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back */}
      <Link
        href="/protocols"
        className="inline-flex items-center gap-2 text-sm text-dc-text-muted hover:text-dc-text transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Protocols
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-dc-text">Protocol Builder</h1>
        <p className="text-sm text-dc-text-muted mt-1">
          Build a custom peptide protocol in 4 steps.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const isActive = i === step;
          const isComplete = i < step;
          return (
            <div key={s.id} className="flex items-center gap-2 flex-1">
              <button
                onClick={() => i < step && setStep(i)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border transition-all ${
                  isActive
                    ? "bg-dc-accent/10 border-dc-accent text-dc-accent"
                    : isComplete
                      ? "bg-dc-neon-green/10 border-dc-neon-green/30 text-dc-neon-green"
                      : "bg-dc-surface border-dc-border text-dc-text-muted"
                }`}
              >
                {isComplete ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </button>
              <span
                className={`text-xs font-medium hidden md:inline ${
                  isActive
                    ? "text-dc-accent"
                    : isComplete
                      ? "text-dc-neon-green"
                      : "text-dc-text-muted"
                }`}
              >
                {s.label}
              </span>
              {i < STEPS.length - 1 && (
                <div
                  className={`h-px flex-1 ${
                    isComplete ? "bg-dc-neon-green/30" : "bg-dc-border"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {/* Step 0: Goals */}
        {step === 0 && (
          <Card>
            <CardTitle>What are your goals?</CardTitle>
            <p className="text-sm text-dc-text-muted mt-1 mb-4">
              Select one or more goals to guide peptide recommendations.
            </p>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {PROTOCOL_GOALS.map((goal) => {
                  const isSelected = state.goals.includes(goal);
                  return (
                    <button
                      key={goal}
                      onClick={() => toggleGoal(goal)}
                      className={`p-3 rounded-lg border text-left text-sm font-medium transition-all ${
                        isSelected
                          ? "bg-dc-accent/10 border-dc-accent/30 text-dc-accent"
                          : "bg-dc-surface border-dc-border text-dc-text-muted hover:text-dc-text hover:border-dc-text-muted"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        {goal.replace(/-/g, " ")}
                      </span>
                    </button>
                  );
                })}
              </div>
              {state.goals.length > 0 && (
                <p className="text-xs text-dc-text-muted mt-3">
                  {state.goals.length} goal
                  {state.goals.length !== 1 ? "s" : ""} selected
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 1: Risk Appetite */}
        {step === 1 && (
          <Card>
            <CardTitle>Risk Appetite</CardTitle>
            <p className="text-sm text-dc-text-muted mt-1 mb-4">
              Choose your comfort level. This determines dosage ranges and
              evidence lanes.
            </p>
            <CardContent>
              <div className="space-y-3">
                {(
                  Object.entries(INTENSITY_INFO) as [
                    Intensity,
                    (typeof INTENSITY_INFO)["conservative"],
                  ][]
                ).map(([key, info]) => {
                  const isSelected = state.intensity === key;
                  return (
                    <button
                      key={key}
                      onClick={() =>
                        setState((prev) => ({ ...prev, intensity: key }))
                      }
                      className={`w-full p-4 rounded-lg border text-left transition-all ${
                        isSelected
                          ? "border-opacity-50"
                          : "bg-dc-surface border-dc-border hover:border-dc-text-muted"
                      }`}
                      style={{
                        borderColor: isSelected ? info.color : undefined,
                        backgroundColor: isSelected
                          ? `${info.color}08`
                          : undefined,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? "border-current" : "border-dc-border"
                          }`}
                          style={{ color: isSelected ? info.color : undefined }}
                        >
                          {isSelected && (
                            <div
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: info.color }}
                            />
                          )}
                        </div>
                        <span className="font-semibold text-dc-text">
                          {info.label}
                        </span>
                        <Badge
                          variant={
                            key === "conservative"
                              ? "conservative"
                              : key === "standard"
                                ? "standard"
                                : "aggressive"
                          }
                          size="sm"
                        >
                          {laneForIntensity(key)} lane
                        </Badge>
                      </div>
                      <p className="text-sm text-dc-text-muted mt-1 ml-8">
                        {info.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Constraints */}
        {step === 2 && (
          <Card>
            <CardTitle>Constraints</CardTitle>
            <p className="text-sm text-dc-text-muted mt-1 mb-4">
              Set limits on your protocol.
            </p>
            <CardContent>
              <div className="space-y-6">
                {/* Max compounds */}
                <div>
                  <label className="text-sm font-medium text-dc-text-muted block mb-2">
                    Maximum Compounds
                  </label>
                  <div className="flex gap-2">
                    {[2, 3, 4, 5, 6].map((n) => (
                      <button
                        key={n}
                        onClick={() =>
                          setState((prev) => ({
                            ...prev,
                            maxCompounds: n,
                          }))
                        }
                        className={`w-12 h-10 rounded-lg border text-sm font-medium transition-all ${
                          state.maxCompounds === n
                            ? "bg-dc-accent/10 border-dc-accent/30 text-dc-accent"
                            : "bg-dc-surface border-dc-border text-dc-text-muted hover:text-dc-text"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Avoid routes */}
                <div>
                  <label className="text-sm font-medium text-dc-text-muted block mb-2">
                    Avoid Administration Routes{" "}
                    <span className="text-dc-text-muted/50">(optional)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ROUTE_OPTIONS.map((route) => {
                      const isAvoided = state.avoidRoutes.includes(route);
                      return (
                        <button
                          key={route}
                          onClick={() => toggleRoute(route)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                            isAvoided
                              ? "bg-dc-danger/10 border-dc-danger/30 text-dc-danger"
                              : "bg-dc-surface border-dc-border text-dc-text-muted hover:text-dc-text"
                          }`}
                        >
                          {isAvoided && (
                            <span className="mr-1">&times;</span>
                          )}
                          {route}
                        </button>
                      );
                    })}
                  </div>
                  {state.avoidRoutes.length > 0 && (
                    <p className="text-xs text-dc-text-muted mt-2">
                      Peptides using{" "}
                      {state.avoidRoutes.join(", ")} routes will be
                      excluded.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="space-y-4">
            {/* Protocol Name */}
            <Card>
              <CardTitle>Name Your Protocol</CardTitle>
              <CardContent>
                <Input
                  placeholder="e.g., My Recovery Stack"
                  value={state.name}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="mt-3"
                />
              </CardContent>
            </Card>

            {/* Summary */}
            <Card>
              <CardTitle>Protocol Summary</CardTitle>
              <CardContent>
                <div className="space-y-3 mt-3">
                  <div className="flex items-center justify-between py-2 border-b border-dc-border">
                    <span className="text-sm text-dc-text-muted">Goals</span>
                    <div className="flex flex-wrap gap-1 justify-end max-w-[60%]">
                      {state.goals.map((goal) => (
                        <Badge key={goal} variant="default" size="sm">
                          {goal.replace(/-/g, " ")}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-dc-border">
                    <span className="text-sm text-dc-text-muted">
                      Intensity
                    </span>
                    <Badge
                      variant={
                        state.intensity as
                          | "conservative"
                          | "standard"
                          | "aggressive"
                      }
                      size="sm"
                    >
                      {state.intensity}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-dc-border">
                    <span className="text-sm text-dc-text-muted">
                      Evidence Lane
                    </span>
                    <Badge
                      variant={
                        laneForIntensity(state.intensity) as
                          | "clinical"
                          | "expert"
                          | "experimental"
                      }
                      size="sm"
                    >
                      {laneForIntensity(state.intensity)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-dc-border">
                    <span className="text-sm text-dc-text-muted">
                      Max Compounds
                    </span>
                    <span className="text-sm font-medium text-dc-text">
                      {state.maxCompounds}
                    </span>
                  </div>
                  {state.avoidRoutes.length > 0 && (
                    <div className="flex items-center justify-between py-2 border-b border-dc-border">
                      <span className="text-sm text-dc-text-muted">
                        Avoided Routes
                      </span>
                      <div className="flex gap-1">
                        {state.avoidRoutes.map((r) => (
                          <Badge key={r} variant="danger" size="sm">
                            {r}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recommended Peptides */}
            <Card>
              <CardTitle>Recommended Compounds</CardTitle>
              <p className="text-sm text-dc-text-muted mt-1 mb-4">
                Based on your goals and constraints. Dosages from the{" "}
                <span
                  className="font-medium"
                  style={{
                    color:
                      state.intensity === "conservative"
                        ? "#00d4ff"
                        : state.intensity === "standard"
                          ? "#ff6b35"
                          : "#b366ff",
                  }}
                >
                  {laneForIntensity(state.intensity)}
                </span>{" "}
                evidence lane.
              </p>
              <CardContent>
                <div className="space-y-3">
                  {recommendedPeptides.map((peptide) => {
                    const lane = laneForIntensity(state.intensity);
                    const laneData = peptide.laneData[lane];
                    return (
                      <div
                        key={peptide.slug}
                        className="p-4 rounded-lg bg-dc-surface-alt/50 border border-dc-border"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-sm font-semibold text-dc-text">
                              {peptide.name}
                            </h4>
                            <p className="text-xs text-dc-text-muted mt-0.5">
                              {peptide.category} / {peptide.route}
                            </p>
                          </div>
                          <Badge
                            variant={
                              peptide.status === "well-researched"
                                ? "success"
                                : peptide.status === "emerging"
                                  ? "warning"
                                  : "danger"
                            }
                            size="sm"
                          >
                            {peptide.status}
                          </Badge>
                        </div>
                        {laneData ? (
                          <div className="grid grid-cols-3 gap-3 mt-3">
                            <div>
                              <p className="text-[10px] uppercase tracking-wide text-dc-text-muted">
                                Dose
                              </p>
                              <p className="text-xs font-medium text-dc-text font-mono mt-0.5">
                                {laneData.dosageRange}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase tracking-wide text-dc-text-muted">
                                Frequency
                              </p>
                              <p className="text-xs font-medium text-dc-text mt-0.5">
                                {laneData.frequency}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase tracking-wide text-dc-text-muted">
                                Duration
                              </p>
                              <p className="text-xs font-medium text-dc-text mt-0.5">
                                {laneData.duration}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-dc-text-muted mt-2 italic">
                            No data for {lane} lane. Consider a different
                            intensity.
                          </p>
                        )}
                      </div>
                    );
                  })}
                  {recommendedPeptides.length === 0 && (
                    <p className="text-sm text-dc-text-muted text-center py-8">
                      No peptides match your criteria. Try adjusting your goals
                      or constraints.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Warning */}
            <div className="flex items-start gap-2 p-3 rounded-lg bg-dc-warning/5 border border-dc-warning/20">
              <AlertTriangle className="w-4 h-4 text-dc-warning mt-0.5 flex-shrink-0" />
              <p className="text-xs text-dc-text-muted">
                This protocol is generated from community and clinical data.
                Always consult a healthcare provider before starting any peptide
                protocol.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-dc-border">
        <Button
          variant="secondary"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>

        {step < 3 ? (
          <Button
            onClick={() => setStep((s) => Math.min(3, s + 1))}
            disabled={!canProceed()}
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button disabled={!canProceed()}>
            <Check className="w-4 h-4" />
            Save Protocol
          </Button>
        )}
      </div>
    </div>
  );
}
