"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Syringe,
  Star,
  Users,
  CheckCircle2,
  Play,
} from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LaneBadge } from "@/components/peptide/lane-badge";
import { MOCK_PROTOCOLS, MOCK_CREATORS } from "@/lib/mock-data";
import type { ProtocolIntensity } from "@/types";

interface PageProps {
  readonly params: Promise<{ id: string }>;
}

const INTENSITY_COLORS: Record<ProtocolIntensity, string> = {
  conservative: "#00ff88",
  standard: "#ffaa00",
  aggressive: "#ff4444",
};

export default function ProtocolDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const protocol = MOCK_PROTOCOLS.find((p) => p.id === id);

  if (!protocol) {
    notFound();
  }

  const creator = protocol.creatorId
    ? MOCK_CREATORS.find((c) => c.id === protocol.creatorId)
    : null;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <Link
          href="/protocols"
          className="flex items-center gap-1.5 text-sm text-dc-text-muted hover:text-dc-text transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Protocols
        </Link>
        <span className="text-dc-text-faint">/</span>
        <span className="text-sm text-dc-text">{protocol.hookTitle}</span>
      </div>

      {/* Hero */}
      <div className="glass rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <LaneBadge lane={protocol.contentAngle} showLabel />
              <Badge
                variant={protocol.intensity === "conservative" ? "conservative" : protocol.intensity === "standard" ? "standard" : "aggressive"}
                size="md"
              >
                {protocol.intensity}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold text-dc-text mb-2">{protocol.hookTitle}</h1>
            <p className="text-sm text-dc-text-muted mb-4">{protocol.subtitle}</p>

            {/* Creator byline */}
            {creator && (
              <Link href={`/creators/${creator.slug}`} className="inline-flex items-center gap-2 group mb-4">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                  style={{ background: `${creator.accentColor}20`, color: creator.accentColor }}
                >
                  {creator.avatarInitials}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-dc-text group-hover:text-dc-accent transition-colors">{creator.name}</span>
                    {creator.verified && <CheckCircle2 className="w-3.5 h-3.5 text-dc-neon-green" />}
                  </div>
                  <p className="text-[10px] text-dc-text-muted">{creator.specialty}</p>
                </div>
              </Link>
            )}

            <p className="text-dc-text-muted leading-relaxed">{protocol.description}</p>
          </div>

          {/* Quick Stats */}
          <div className="md:w-56 grid grid-cols-2 md:grid-cols-1 gap-3">
            <div className="bg-dc-surface-alt/60 rounded-xl px-4 py-3">
              <p className="text-[10px] text-dc-text-faint uppercase tracking-wide mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Duration
              </p>
              <p className="text-sm font-semibold text-dc-text">{protocol.duration}</p>
            </div>
            <div className="bg-dc-surface-alt/60 rounded-xl px-4 py-3">
              <p className="text-[10px] text-dc-text-faint uppercase tracking-wide mb-1 flex items-center gap-1">
                <Syringe className="w-3 h-3" /> Compounds
              </p>
              <p className="text-sm font-semibold text-dc-text">{protocol.peptides.length}</p>
            </div>
            {protocol.rating && (
              <div className="bg-dc-surface-alt/60 rounded-xl px-4 py-3">
                <p className="text-[10px] text-dc-text-faint uppercase tracking-wide mb-1 flex items-center gap-1">
                  <Star className="w-3 h-3" /> Rating
                </p>
                <p className="text-sm font-semibold text-dc-warning">
                  {protocol.rating} <span className="text-[10px] text-dc-text-muted font-normal">({protocol.ratingCount?.toLocaleString()})</span>
                </p>
              </div>
            )}
            {protocol.activeUsers && (
              <div className="bg-dc-surface-alt/60 rounded-xl px-4 py-3">
                <p className="text-[10px] text-dc-text-faint uppercase tracking-wide mb-1 flex items-center gap-1">
                  <Users className="w-3 h-3" /> Active Users
                </p>
                <p className="text-sm font-semibold text-dc-text">{protocol.activeUsers.toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress bar if active */}
      {protocol.progress !== undefined && (
        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-dc-text-muted">Protocol Progress</span>
            <span className="text-sm font-bold text-dc-text mono">{protocol.progress}%</span>
          </div>
          <div className="h-3 rounded-full bg-dc-surface overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${protocol.progress}%`,
                background: `linear-gradient(90deg, ${INTENSITY_COLORS[protocol.intensity]}, ${INTENSITY_COLORS[protocol.intensity]}88)`,
              }}
            />
          </div>
          {protocol.startDate && (
            <p className="text-[10px] text-dc-text-muted mt-2">Started {protocol.startDate}</p>
          )}
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Peptides Table */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Syringe className="w-4 h-4 text-dc-accent" />
              <CardTitle>Protocol Compounds</CardTitle>
            </div>
            <div className="space-y-3">
              {protocol.peptides.map((p) => (
                <Link key={p.slug} href={`/library/${p.slug}`} className="block">
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-dc-surface-alt/40 border border-dc-border/40 hover:border-dc-accent/30 transition-all group">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-dc-text group-hover:text-dc-accent transition-colors mb-2">
                        {p.name}
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px]">
                        <div>
                          <span className="text-dc-text-faint uppercase">Dose</span>
                          <p className="text-dc-text font-medium mono">{p.dose}</p>
                        </div>
                        <div>
                          <span className="text-dc-text-faint uppercase">Frequency</span>
                          <p className="text-dc-text font-medium">{p.frequency}</p>
                        </div>
                        <div>
                          <span className="text-dc-text-faint uppercase">Route</span>
                          <p className="text-dc-text font-medium capitalize">{p.route}</p>
                        </div>
                        <div>
                          <span className="text-dc-text-faint uppercase">Timing</span>
                          <p className="text-dc-text font-medium">{p.timing}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Start CTA */}
          <Card glowColor="accent">
            <h3 className="text-sm font-semibold text-dc-text mb-2">Start This Protocol</h3>
            <p className="text-xs text-dc-text-muted mb-4 leading-relaxed">
              Add this protocol to your active stacks and begin tracking doses.
            </p>
            <button
              className="w-full py-2.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all"
              style={{ background: "linear-gradient(135deg, #ff6b35 0%, #ff8555 100%)", boxShadow: "0 4px 16px rgba(255,107,53,0.25)" }}
            >
              <Play className="w-4 h-4" />
              Start Protocol
            </button>
          </Card>

          {/* Goals */}
          <Card>
            <CardTitle className="mb-3">Goals</CardTitle>
            <div className="flex flex-wrap gap-1.5">
              {protocol.goals.map((goal) => (
                <Badge key={goal} variant="default" size="sm">
                  {goal.replace(/-/g, " ")}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Protocol Info */}
          <Card>
            <CardTitle className="mb-3">Protocol Details</CardTitle>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-dc-border/40">
                <span className="text-dc-text-muted">Evidence Lane</span>
                <LaneBadge lane={protocol.contentAngle} showLabel size="xs" />
              </div>
              <div className="flex items-center justify-between py-2 border-b border-dc-border/40">
                <span className="text-dc-text-muted">Intensity</span>
                <span className="font-medium capitalize" style={{ color: INTENSITY_COLORS[protocol.intensity] }}>
                  {protocol.intensity}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-dc-border/40">
                <span className="text-dc-text-muted">Duration</span>
                <span className="text-dc-text font-medium">{protocol.duration}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-dc-text-muted">Compounds</span>
                <span className="text-dc-text font-medium">{protocol.peptides.length}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
