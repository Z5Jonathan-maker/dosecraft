"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  AlertTriangle,
  Activity,
  Clock,
  Syringe,
  Plus,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import { LaneBadge, LaneSelector, LANE_CONFIG } from "@/components/peptide/lane-badge";
import { MOCK_PEPTIDES } from "@/lib/mock-data";
import type { EvidenceLane } from "@/types";
import clsx from "clsx";

interface PageProps {
  readonly params: Promise<{ slug: string }>;
}

function ConfidenceBar({ value }: { value: number }) {
  const color = value >= 80 ? "#00ff88" : value >= 60 ? "#ffaa00" : "#ff4444";
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-dc-text-muted">Confidence Score</span>
        <span className="text-sm font-bold mono" style={{ color }}>{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-dc-surface overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, background: `linear-gradient(90deg, ${color}90, ${color})` }}
        />
      </div>
    </div>
  );
}

export default function PeptideDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const peptide = MOCK_PEPTIDES.find((p) => p.slug === slug);

  if (!peptide) {
    notFound();
  }

  const laneTabs = peptide.lanes.map((lane) => ({
    id: lane,
    label: LANE_CONFIG[lane].label,
    color: LANE_CONFIG[lane].color,
  }));

  const statusVariant: Record<string, "success" | "warning" | "danger" | "neutral"> = {
    "well-researched": "success",
    emerging: "warning",
    experimental: "danger",
    novel: "neutral",
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <Link
          href="/library"
          className="flex items-center gap-1.5 text-sm text-dc-text-muted hover:text-dc-text transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Library
        </Link>
        <span className="text-dc-text-faint">/</span>
        <span className="text-sm text-dc-text">{peptide.name}</span>
      </div>

      {/* Hero */}
      <div className="glass rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <LaneSelector lanes={peptide.lanes} />
            </div>
            <h1 className="text-3xl font-bold text-dc-text mb-2">{peptide.name}</h1>
            {peptide.aliases.length > 0 && (
              <p className="text-sm text-dc-text-muted mb-3">
                Also known as: {peptide.aliases.join(", ")}
              </p>
            )}
            <p className="text-dc-text-muted leading-relaxed mb-5">{peptide.description}</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant={statusVariant[peptide.status] ?? "default"} size="md">
                {peptide.status.replace(/-/g, " ")}
              </Badge>
              <Badge variant="default" size="md" className="capitalize">
                {peptide.category.replace(/-/g, " ")}
              </Badge>
              <Badge variant="default" size="md" className="capitalize">
                {peptide.route}
              </Badge>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="md:w-56 grid grid-cols-2 md:grid-cols-1 gap-3">
            <div className="bg-dc-surface-alt/60 rounded-xl px-4 py-3">
              <p className="text-[10px] text-dc-text-faint uppercase tracking-wide mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Half-life
              </p>
              <p className="text-sm font-semibold text-dc-text mono">{peptide.halfLife}</p>
            </div>
            <div className="bg-dc-surface-alt/60 rounded-xl px-4 py-3">
              <p className="text-[10px] text-dc-text-faint uppercase tracking-wide mb-1 flex items-center gap-1">
                <Syringe className="w-3 h-3" /> Typical Dose
              </p>
              <p className="text-sm font-semibold text-dc-text mono">{peptide.typicalDoseRange}</p>
            </div>
            <div className="bg-dc-surface-alt/60 rounded-xl px-4 py-3">
              <p className="text-[10px] text-dc-text-faint uppercase tracking-wide mb-1 flex items-center gap-1">
                <Activity className="w-3 h-3" /> Route
              </p>
              <p className="text-sm font-semibold text-dc-text capitalize">{peptide.route}</p>
            </div>
            <div className="bg-dc-surface-alt/60 rounded-xl px-4 py-3">
              <p className="text-[10px] text-dc-text-faint uppercase tracking-wide mb-1">Lanes</p>
              <p className="text-sm font-semibold text-dc-text">{peptide.lanes.length} active</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Evidence Lanes (main content) */}
        <div className="lg:col-span-2">
          <Tabs tabs={laneTabs} defaultTab={laneTabs[0]?.id} variant="underline">
            {(activeTab) => {
              const lane = activeTab as EvidenceLane;
              const laneData = peptide.laneData[lane];
              const config = LANE_CONFIG[lane];

              if (!laneData) {
                return (
                  <div className="text-center py-12">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                      style={{ background: `${config.color}15` }}
                    >
                      <Activity className="w-6 h-6" style={{ color: config.color }} />
                    </div>
                    <h3 className="text-base font-medium text-dc-text mb-2">No {config.label} data yet</h3>
                    <p className="text-sm text-dc-text-muted max-w-sm mx-auto">
                      The {config.label.toLowerCase()} lane for {peptide.name} has not been populated yet.
                      Check back as our database grows.
                    </p>
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  {/* Summary */}
                  <Card>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1 h-5 rounded-full" style={{ background: config.color }} />
                      <CardTitle>{config.label} Summary</CardTitle>
                    </div>
                    <p className="text-sm text-dc-text-muted leading-relaxed">{laneData.summary}</p>
                  </Card>

                  {/* Dosing Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: "Dose Range", value: laneData.dosageRange },
                      { label: "Frequency", value: laneData.frequency },
                      { label: "Duration", value: laneData.duration },
                      { label: "Evidence Level", value: `${laneData.confidence}%` },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-xl p-3 border"
                        style={{
                          borderColor: `${config.color}20`,
                          background: `${config.color}06`,
                        }}
                      >
                        <p className="text-[10px] text-dc-text-muted uppercase tracking-wide mb-1">{item.label}</p>
                        <p className="text-xs font-semibold text-dc-text leading-snug">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Confidence */}
                  <Card>
                    <ConfidenceBar value={laneData.confidence} />
                    <p className="text-xs text-dc-text-muted mt-2">
                      Based on research quality, sample size, and replication across studies and community reports.
                    </p>
                  </Card>

                  {/* Sources */}
                  <Card>
                    <CardTitle className="mb-3">Sources</CardTitle>
                    <div className="space-y-2">
                      {laneData.sources.map((source, i) => (
                        <div key={i} className="flex items-start gap-2.5 py-2 border-b border-dc-border/40 last:border-0">
                          <div
                            className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5"
                            style={{ background: `${config.color}15`, color: config.color }}
                          >
                            {i + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-dc-text-muted leading-relaxed">{source}</p>
                          </div>
                          <ExternalLink className="w-3 h-3 text-dc-text-faint flex-shrink-0 mt-0.5" />
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              );
            }}
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* CTA */}
          <Card glowColor="accent">
            <h3 className="text-sm font-semibold text-dc-text mb-2">Add to Protocol</h3>
            <p className="text-xs text-dc-text-muted mb-4 leading-relaxed">
              Include {peptide.name} in a protocol stack with the builder.
            </p>
            <Link href="/protocols/builder">
              <button
                className="w-full py-2.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all"
                style={{ background: "linear-gradient(135deg, #ff6b35 0%, #ff8555 100%)", boxShadow: "0 4px 16px rgba(255,107,53,0.25)" }}
              >
                <Plus className="w-4 h-4" />
                Add to Protocol
              </button>
            </Link>
          </Card>

          {/* Contraindications */}
          {peptide.contraindications.length > 0 && (
            <Card variant="danger">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-dc-danger" />
                <CardTitle className="text-dc-danger">Contraindications</CardTitle>
              </div>
              <ul className="space-y-2">
                {peptide.contraindications.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-dc-text-muted">
                    <span className="w-1 h-1 rounded-full bg-dc-danger mt-1.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Interactions */}
          {peptide.interactions.length > 0 && (
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-dc-warning" />
                <CardTitle>Interactions</CardTitle>
              </div>
              <ul className="space-y-2">
                {peptide.interactions.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-dc-text-muted">
                    <CheckCircle2 className="w-3 h-3 text-dc-warning mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Lane coverage */}
          <Card>
            <CardTitle className="mb-3">Lane Coverage</CardTitle>
            <div className="space-y-2">
              {(["clinical", "expert", "experimental"] as EvidenceLane[]).map((lane) => {
                const config = LANE_CONFIG[lane];
                const hasData = peptide.lanes.includes(lane) && peptide.laneData[lane] !== null;
                const laneData = peptide.laneData[lane];
                return (
                  <div key={lane} className={clsx("flex items-center justify-between py-2 rounded-lg px-3", hasData ? "" : "opacity-30")}>
                    <div className="flex items-center gap-2">
                      <LaneBadge lane={lane} size="xs" />
                      <span className="text-xs text-dc-text-muted">{config.label}</span>
                    </div>
                    {hasData && laneData ? (
                      <span className="text-[10px] font-medium mono" style={{ color: config.color }}>
                        {laneData.confidence}%
                      </span>
                    ) : (
                      <span className="text-[10px] text-dc-text-faint">No data</span>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
