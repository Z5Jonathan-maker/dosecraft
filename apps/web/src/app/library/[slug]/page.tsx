"use client";

import { use } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { LaneBadge } from "@/components/peptide/lane-badge";
import { ArrowLeft, AlertTriangle, Zap, Shield, FlaskConical, Users, Beaker } from "lucide-react";
import { MOCK_PEPTIDES } from "@/lib/mock-data";
import type { EvidenceLane, LaneData } from "@/types";

const LANE_TABS = [
  { id: "clinical" as EvidenceLane, label: "Clinical", color: "#00d4ff" },
  { id: "expert" as EvidenceLane, label: "Expert", color: "#ff6b35" },
  { id: "experimental" as EvidenceLane, label: "Experimental", color: "#b366ff" },
];

const LANE_ICONS: Record<EvidenceLane, typeof FlaskConical> = {
  clinical: FlaskConical,
  expert: Users,
  experimental: Beaker,
};

function LaneContent({ lane, data }: { lane: EvidenceLane; data: LaneData | null }) {
  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-dc-text-muted">No data available for this evidence lane.</p>
      </div>
    );
  }

  const Icon = LANE_ICONS[lane];

  return (
    <div className="space-y-4">
      {/* Summary */}
      <Card>
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor:
                lane === "clinical" ? "#00d4ff15" : lane === "expert" ? "#ff6b3515" : "#b366ff15",
            }}
          >
            <Icon
              className="w-5 h-5"
              style={{
                color: lane === "clinical" ? "#00d4ff" : lane === "expert" ? "#ff6b35" : "#b366ff",
              }}
            />
          </div>
          <div>
            <CardTitle>Summary</CardTitle>
            <p className="text-sm text-dc-text-muted mt-1 leading-relaxed">{data.summary}</p>
          </div>
        </div>
      </Card>

      {/* Dosage info grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <p className="text-xs font-medium text-dc-text-muted uppercase tracking-wide mb-1">
            Dosage Range
          </p>
          <p className="text-lg font-semibold text-dc-text font-mono">{data.dosageRange}</p>
        </Card>
        <Card>
          <p className="text-xs font-medium text-dc-text-muted uppercase tracking-wide mb-1">
            Frequency
          </p>
          <p className="text-lg font-semibold text-dc-text">{data.frequency}</p>
        </Card>
        <Card>
          <p className="text-xs font-medium text-dc-text-muted uppercase tracking-wide mb-1">
            Duration
          </p>
          <p className="text-lg font-semibold text-dc-text">{data.duration}</p>
        </Card>
        <Card>
          <p className="text-xs font-medium text-dc-text-muted uppercase tracking-wide mb-1">
            Confidence
          </p>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-dc-surface-alt rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${data.confidence}%`,
                  backgroundColor:
                    data.confidence >= 70
                      ? "#00ff88"
                      : data.confidence >= 40
                        ? "#ffaa00"
                        : "#ff4444",
                }}
              />
            </div>
            <span className="text-lg font-semibold text-dc-text font-mono">
              {data.confidence}%
            </span>
          </div>
        </Card>
      </div>

      {/* Sources */}
      <Card>
        <CardTitle>Sources</CardTitle>
        <ul className="mt-2 space-y-1.5">
          {data.sources.map((source, i) => (
            <li key={i} className="text-sm text-dc-text-muted flex items-start gap-2">
              <span className="text-dc-accent mt-0.5 text-xs">{i + 1}.</span>
              {source}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

export default function PeptideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const peptide = MOCK_PEPTIDES.find((p) => p.slug === slug);

  if (!peptide) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-dc-text mb-2">Peptide not found</h2>
        <p className="text-dc-text-muted mb-4">The peptide &quot;{slug}&quot; doesn&apos;t exist in our database.</p>
        <Link href="/library" className="text-dc-accent hover:text-dc-accent-hover text-sm">
          Back to Library
        </Link>
      </div>
    );
  }

  const availableTabs = LANE_TABS.filter((tab) => peptide.lanes.includes(tab.id));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back */}
      <Link
        href="/library"
        className="inline-flex items-center gap-2 text-sm text-dc-text-muted hover:text-dc-text transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Library
      </Link>

      {/* Hero */}
      <div className="glass rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-dc-text">{peptide.name}</h1>
              <div className="flex gap-1.5">
                {peptide.lanes.map((lane) => (
                  <LaneBadge key={lane} lane={lane} showLabel size="md" />
                ))}
              </div>
            </div>
            {peptide.aliases.length > 0 && (
              <p className="text-sm text-dc-text-muted mb-3">
                Also known as: {peptide.aliases.join(", ")}
              </p>
            )}
            <p className="text-sm text-dc-text-muted leading-relaxed max-w-2xl">
              {peptide.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={
                peptide.status === "well-researched"
                  ? "success"
                  : peptide.status === "emerging"
                    ? "warning"
                    : peptide.status === "experimental"
                      ? "danger"
                      : "default"
              }
              size="md"
            >
              {peptide.status}
            </Badge>
            <Badge variant="default" size="md">
              {peptide.category}
            </Badge>
            <Badge variant="default" size="md">
              {peptide.route}
            </Badge>
          </div>
        </div>
      </div>

      {/* Lane Tabs */}
      <Tabs tabs={availableTabs}>
        {(activeTab) => (
          <LaneContent
            lane={activeTab as EvidenceLane}
            data={peptide.laneData[activeTab as EvidenceLane]}
          />
        )}
      </Tabs>

      {/* Contraindications */}
      {peptide.contraindications.length > 0 && (
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-dc-danger" />
            <CardTitle>Contraindications</CardTitle>
          </div>
          <CardContent>
            <ul className="space-y-2">
              {peptide.contraindications.map((c, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-dc-danger mt-0.5 flex-shrink-0" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Interactions */}
      {peptide.interactions.length > 0 && (
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-dc-warning" />
            <CardTitle>Interactions</CardTitle>
          </div>
          <CardContent>
            <ul className="space-y-2">
              {peptide.interactions.map((interaction, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-dc-warning mt-0.5 flex-shrink-0" />
                  <span>{interaction}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
