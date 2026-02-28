"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProtocolCard } from "@/components/protocol/protocol-card";
import { Plus, Filter } from "lucide-react";
import { MOCK_PROTOCOLS } from "@/lib/mock-data";
import type { ProtocolIntensity, EvidenceLane } from "@/types";

const GOALS = [
  "injury-recovery",
  "joint-health",
  "gut-healing",
  "body-recomp",
  "fat-loss",
  "muscle-gain",
  "sleep",
  "recovery",
  "anti-aging",
  "skin",
  "hair",
  "cognitive",
] as const;

const INTENSITIES: ProtocolIntensity[] = ["conservative", "standard", "aggressive"];
const ANGLES: EvidenceLane[] = ["clinical", "expert", "experimental"];

export default function ProtocolsPage() {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedIntensity, setSelectedIntensity] = useState<ProtocolIntensity | null>(null);
  const [selectedAngle, setSelectedAngle] = useState<EvidenceLane | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return MOCK_PROTOCOLS.filter((p) => {
      const matchesGoal = !selectedGoal || p.goals.includes(selectedGoal);
      const matchesIntensity = !selectedIntensity || p.intensity === selectedIntensity;
      const matchesAngle = !selectedAngle || p.contentAngle === selectedAngle;
      return matchesGoal && matchesIntensity && matchesAngle;
    });
  }, [selectedGoal, selectedIntensity, selectedAngle]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dc-text">Protocol Templates</h1>
          <p className="text-sm text-dc-text-muted mt-1">
            Pre-built peptide stacks for common goals. Or build your own.
          </p>
        </div>
        <Link href="/protocols/builder">
          <Button>
            <Plus className="w-4 h-4" />
            Build Custom
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-2 rounded-lg border text-sm font-medium flex items-center gap-2 transition-all ${
            showFilters
              ? "bg-dc-accent/10 border-dc-accent/30 text-dc-accent"
              : "bg-dc-surface border-dc-border text-dc-text-muted hover:text-dc-text"
          }`}
        >
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {showFilters && (
        <div className="glass rounded-xl p-4 space-y-4">
          {/* Goal */}
          <div>
            <p className="text-xs font-medium text-dc-text-muted mb-2 uppercase tracking-wide">
              Goal
            </p>
            <div className="flex flex-wrap gap-2">
              {GOALS.map((goal) => (
                <button
                  key={goal}
                  onClick={() => setSelectedGoal(selectedGoal === goal ? null : goal)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    selectedGoal === goal
                      ? "bg-dc-accent/10 border-dc-accent/30 text-dc-accent"
                      : "bg-dc-surface border-dc-border text-dc-text-muted hover:text-dc-text"
                  }`}
                >
                  {goal.replace(/-/g, " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Intensity */}
          <div>
            <p className="text-xs font-medium text-dc-text-muted mb-2 uppercase tracking-wide">
              Intensity
            </p>
            <div className="flex flex-wrap gap-2">
              {INTENSITIES.map((intensity) => (
                <button
                  key={intensity}
                  onClick={() =>
                    setSelectedIntensity(selectedIntensity === intensity ? null : intensity)
                  }
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    selectedIntensity === intensity
                      ? "bg-dc-accent/10 border-dc-accent/30 text-dc-accent"
                      : "bg-dc-surface border-dc-border text-dc-text-muted hover:text-dc-text"
                  }`}
                >
                  {intensity}
                </button>
              ))}
            </div>
          </div>

          {/* Content Angle */}
          <div>
            <p className="text-xs font-medium text-dc-text-muted mb-2 uppercase tracking-wide">
              Content Angle
            </p>
            <div className="flex flex-wrap gap-2">
              {ANGLES.map((angle) => (
                <button
                  key={angle}
                  onClick={() => setSelectedAngle(selectedAngle === angle ? null : angle)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    selectedAngle === angle
                      ? "bg-dc-accent/10 border-dc-accent/30 text-dc-accent"
                      : "bg-dc-surface border-dc-border text-dc-text-muted hover:text-dc-text"
                  }`}
                >
                  {angle}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <p className="text-sm text-dc-text-muted">
        {filtered.length} protocol{filtered.length !== 1 ? "s" : ""}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((protocol) => (
          <ProtocolCard key={protocol.id} protocol={protocol} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-dc-text-muted">No protocols match your filters.</p>
        </div>
      )}
    </div>
  );
}
