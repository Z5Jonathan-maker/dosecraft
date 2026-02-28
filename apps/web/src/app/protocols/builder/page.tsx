"use client";

import { useState } from "react";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, Check, Sparkles, Syringe, Clock, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { PROTOCOL_GOALS } from "@/lib/mock-data";

const STEPS = ["Goals", "Risk Appetite", "Constraints", "Review"] as const;

const RISK_LABELS = ["Clinical Only", "Clinical + Expert", "Mixed (All Lanes)", "Expert + Experimental", "Experimental Heavy"] as const;

export default function ProtocolBuilderPage() {
  const [step, setStep] = useState(0);
  const [selectedGoals, setSelectedGoals] = useState<Set<string>>(new Set());
  const [riskLevel, setRiskLevel] = useState(2); // 0-4
  const [maxCompounds, setMaxCompounds] = useState("4");
  const [maxInjectionsPerWeek, setMaxInjectionsPerWeek] = useState("7");

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) => {
      const next = new Set(prev);
      if (next.has(goal)) {
        next.delete(goal);
      } else {
        next.add(goal);
      }
      return next;
    });
  };

  const canProceed =
    step === 0 ? selectedGoals.size > 0 :
    step === 1 ? true :
    step === 2 ? Number(maxCompounds) > 0 && Number(maxInjectionsPerWeek) > 0 :
    true;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Back */}
      <Link
        href="/protocols"
        className="inline-flex items-center gap-2 text-sm text-dc-text-muted hover:text-dc-text transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Protocols
      </Link>

      {/* Progress */}
      <div className="flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div className="flex items-center gap-2 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                  i < step
                    ? "bg-dc-neon-green/20 text-dc-neon-green border border-dc-neon-green/30"
                    : i === step
                      ? "bg-dc-accent/20 text-dc-accent border border-dc-accent/30"
                      : "bg-dc-surface border border-dc-border text-dc-text-muted"
                }`}
              >
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span
                className={`text-xs font-medium hidden md:block ${
                  i === step ? "text-dc-accent" : "text-dc-text-muted"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`h-px flex-1 ${
                  i < step ? "bg-dc-neon-green/30" : "bg-dc-border"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Goals */}
      {step === 0 && (
        <Card>
          <CardTitle>What are your goals?</CardTitle>
          <p className="text-sm text-dc-text-muted mt-1 mb-4">
            Select one or more goals for your protocol. We&apos;ll match peptides to your objectives.
          </p>
          <div className="flex flex-wrap gap-2">
            {PROTOCOL_GOALS.map((goal) => (
              <button
                key={goal}
                onClick={() => toggleGoal(goal)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                  selectedGoals.has(goal)
                    ? "bg-dc-accent/10 border-dc-accent text-dc-accent"
                    : "bg-dc-surface border-dc-border text-dc-text-muted hover:text-dc-text hover:border-dc-text-muted"
                }`}
              >
                {goal.replace(/-/g, " ")}
              </button>
            ))}
          </div>
          {selectedGoals.size > 0 && (
            <p className="text-xs text-dc-text-muted mt-3">
              {selectedGoals.size} goal{selectedGoals.size !== 1 ? "s" : ""} selected
            </p>
          )}
        </Card>
      )}

      {/* Step 2: Risk Appetite */}
      {step === 1 && (
        <Card>
          <CardTitle>Set your risk appetite</CardTitle>
          <p className="text-sm text-dc-text-muted mt-1 mb-6">
            This determines which evidence lanes we pull from. Clinical-only is safest; experimental includes community data.
          </p>

          <div className="space-y-4">
            <div className="flex justify-between text-xs text-dc-text-muted mb-2">
              <span className="text-dc-clinical">Clinical</span>
              <span className="text-dc-text-muted">Mixed</span>
              <span className="text-dc-experimental">Experimental</span>
            </div>
            <input
              type="range"
              min={0}
              max={4}
              value={riskLevel}
              onChange={(e) => setRiskLevel(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #00d4ff, #ff6b35, #b366ff)`,
              }}
            />
            <div className="text-center">
              <Badge
                variant={
                  riskLevel <= 1
                    ? "clinical"
                    : riskLevel <= 2
                      ? "expert"
                      : "experimental"
                }
                size="md"
              >
                {RISK_LABELS[riskLevel]}
              </Badge>
            </div>
          </div>
        </Card>
      )}

      {/* Step 3: Constraints */}
      {step === 2 && (
        <Card>
          <CardTitle>Set your constraints</CardTitle>
          <p className="text-sm text-dc-text-muted mt-1 mb-6">
            Practical limits that shape your protocol.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Max compounds in stack"
              type="number"
              min={1}
              max={10}
              value={maxCompounds}
              onChange={(e) => setMaxCompounds(e.target.value)}
            />
            <Input
              label="Max injections per week"
              type="number"
              min={1}
              max={28}
              value={maxInjectionsPerWeek}
              onChange={(e) => setMaxInjectionsPerWeek(e.target.value)}
            />
          </div>
        </Card>
      )}

      {/* Step 4: Review */}
      {step === 3 && (
        <div className="space-y-4">
          <Card glowColor="accent">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-dc-accent" />
              <CardTitle>AI-Suggested Protocol</CardTitle>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-dc-surface-alt/50 border border-dc-border">
                <h4 className="text-base font-bold text-dc-text mb-1">Custom Recovery + Recomp Stack</h4>
                <p className="text-sm text-dc-text-muted">
                  Based on your goals ({Array.from(selectedGoals).join(", ")}),
                  risk level ({RISK_LABELS[riskLevel]}),
                  and constraints (max {maxCompounds} compounds, {maxInjectionsPerWeek} injections/week).
                </p>
              </div>

              {/* Mock suggested peptides */}
              <div className="space-y-3">
                {[
                  { name: "BPC-157", dose: "250 mcg", freq: "2x daily", timing: "Morning + Evening", route: "SubQ" },
                  { name: "CJC-1295 / Ipamorelin", dose: "200 mcg each", freq: "Nightly", timing: "30 min before bed", route: "SubQ" },
                  { name: "Semaglutide", dose: "0.5 mg", freq: "Weekly", timing: "Same day each week", route: "SubQ" },
                ].slice(0, Number(maxCompounds)).map((peptide) => (
                  <div
                    key={peptide.name}
                    className="flex items-center justify-between p-3 rounded-lg bg-dc-surface border border-dc-border"
                  >
                    <div>
                      <p className="text-sm font-semibold text-dc-text">{peptide.name}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-dc-text-muted">
                        <span className="flex items-center gap-1">
                          <Syringe className="w-3 h-3" /> {peptide.dose}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {peptide.freq}
                        </span>
                      </div>
                    </div>
                    <Badge variant="default" size="sm">{peptide.route}</Badge>
                  </div>
                ))}
              </div>

              {/* Warning */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-dc-warning/5 border border-dc-warning/20">
                <AlertTriangle className="w-4 h-4 text-dc-warning mt-0.5 flex-shrink-0" />
                <p className="text-xs text-dc-warning/80">
                  This is an AI-generated suggestion based on community and clinical data.
                  Always consult a healthcare provider before starting any peptide protocol.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="secondary"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>

        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep(step + 1)} disabled={!canProceed}>
            Next
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button>
            <Check className="w-4 h-4" />
            Save Protocol
          </Button>
        )}
      </div>
    </div>
  );
}
