"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Star, Users, Layers, TrendingUp, CheckCircle2, Clock } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProtocolCard } from "@/components/protocol/protocol-card";
import { LaneBadge } from "@/components/peptide/lane-badge";
import { MOCK_PROTOCOLS, MOCK_CREATORS } from "@/lib/mock-data";
import type { ProtocolIntensity, EvidenceLane } from "@/types";

const INTENSITY_FILTER: ProtocolIntensity[] = ["conservative", "standard", "aggressive"];
const LANE_FILTER: EvidenceLane[] = ["clinical", "expert", "experimental"];

const INTENSITY_COLORS: Record<ProtocolIntensity, string> = {
  conservative: "#00ff88",
  standard: "#ffaa00",
  aggressive: "#ff4444",
};

export default function ProtocolsPage() {
  const [intensityFilter, setIntensityFilter] = useState<ProtocolIntensity | null>(null);
  const [laneFilter, setLaneFilter] = useState<EvidenceLane | null>(null);

  const activeProtocols = MOCK_PROTOCOLS.filter((p) => p.progress !== undefined);
  const templateProtocols = MOCK_PROTOCOLS.filter((p) => p.progress === undefined);

  const filteredTemplates = templateProtocols.filter((p) => {
    const matchIntensity = intensityFilter === null || p.intensity === intensityFilter;
    const matchLane = laneFilter === null || p.contentAngle === laneFilter;
    return matchIntensity && matchLane;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-dc-text-muted uppercase tracking-wide mb-1">Biohacking Stacks</p>
          <p className="text-sm text-dc-text-muted">{MOCK_PROTOCOLS.length} protocols &middot; {activeProtocols.length} active</p>
        </div>
        <Link href="/protocols/builder">
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white transition-all"
            style={{ background: "linear-gradient(135deg, #ff6b35, #ff8555)", boxShadow: "0 4px 16px rgba(255,107,53,0.25)" }}
          >
            <Plus className="w-4 h-4" />
            New Protocol
          </button>
        </Link>
      </div>

      {/* Active Protocols */}
      {activeProtocols.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-dc-neon-green animate-pulse-glow" />
            <h2 className="text-base font-semibold text-dc-text">Active Protocols</h2>
            <span className="text-xs text-dc-text-muted">({activeProtocols.length})</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeProtocols.map((protocol) => (
              <Card key={protocol.id} className="card-expert">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-dc-text">{protocol.hookTitle}</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-dc-neon-green/10 text-dc-neon-green border border-dc-neon-green/20">
                        Active
                      </span>
                    </div>
                    <p className="text-xs text-dc-text-muted">{protocol.subtitle}</p>
                  </div>
                  <LaneBadge lane={protocol.contentAngle} showLabel size="xs" />
                </div>

                {/* Progress */}
                {protocol.progress !== undefined && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-dc-text-muted mb-1.5">
                      <span>Week progress</span>
                      <span className="font-semibold text-dc-text mono">{protocol.progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-dc-surface overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${protocol.progress}%`,
                          background: protocol.contentAngle === "expert"
                            ? "linear-gradient(90deg, #ff6b35, #ffaa00)"
                            : "linear-gradient(90deg, #00d4ff, #00ff88)",
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Peptides */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {protocol.peptides.map((p) => (
                    <Badge key={p.slug} variant="default" size="xs">{p.name}</Badge>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-dc-text-muted">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Started {protocol.startDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Layers className="w-3 h-3" />
                    {protocol.duration}
                  </span>
                  <Badge
                    variant={protocol.intensity === "conservative" ? "conservative" : protocol.intensity === "standard" ? "standard" : "aggressive"}
                    size="xs"
                  >
                    {protocol.intensity}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Community Templates */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-dc-accent" />
            <h2 className="text-base font-semibold text-dc-text">Protocol Templates</h2>
          </div>
          {/* Filters */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {LANE_FILTER.map((lane) => (
                <button
                  key={lane}
                  onClick={() => setLaneFilter(laneFilter === lane ? null : lane)}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-medium border transition-all capitalize"
                  style={
                    laneFilter === lane
                      ? { background: `${lane === "clinical" ? "#00d4ff" : lane === "expert" ? "#ff6b35" : "#b366ff"}15`, borderColor: `${lane === "clinical" ? "#00d4ff" : lane === "expert" ? "#ff6b35" : "#b366ff"}40`, color: lane === "clinical" ? "#00d4ff" : lane === "expert" ? "#ff6b35" : "#b366ff" }
                      : { borderColor: "#2a2a3e", color: "#8888a0" }
                  }
                >
                  {lane}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((protocol) => (
            <ProtocolCard key={protocol.id} protocol={protocol} />
          ))}
        </div>
      </section>

      {/* Creators */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-4 h-4 text-dc-warning" />
          <h2 className="text-base font-semibold text-dc-text">Top Creators</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MOCK_CREATORS.map((creator) => (
            <Card key={creator.id} hoverable className="group">
              <div className="flex items-start gap-4 mb-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ background: `${creator.accentColor}20`, color: creator.accentColor }}
                >
                  {creator.avatarInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-dc-text truncate">{creator.name}</h3>
                    {creator.verified && (
                      <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: creator.accentColor }} />
                    )}
                  </div>
                  <p className="text-[10px] text-dc-text-muted">{creator.credentials}</p>
                  <p className="text-[10px] text-dc-text-muted">{creator.specialty}</p>
                </div>
              </div>
              <p className="text-xs text-dc-text-muted leading-relaxed mb-3 line-clamp-2">{creator.bio}</p>
              <div className="flex items-center gap-4 text-[10px] text-dc-text-muted">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {creator.followers.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  {creator.protocolCount} protocols
                </span>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
