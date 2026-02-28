"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LaneBadge } from "@/components/peptide/lane-badge";
import { Clock, Syringe, Star, Users, ArrowUpRight } from "lucide-react";
import type { Protocol, ProtocolIntensity } from "@/types";
import clsx from "clsx";

interface ProtocolCardProps {
  readonly protocol: Protocol;
  readonly showProgress?: boolean;
}

const INTENSITY_VARIANT: Record<ProtocolIntensity, "conservative" | "standard" | "aggressive"> = {
  conservative: "conservative",
  standard: "standard",
  aggressive: "aggressive",
};

const ANGLE_GLOW: Record<string, "cyan" | "accent" | "purple"> = {
  clinical: "cyan",
  expert: "accent",
  experimental: "purple",
};

export function ProtocolCard({ protocol, showProgress = false }: ProtocolCardProps) {
  return (
    <Link href={`/protocols#${protocol.id}`} className="block">
      <Card
        hoverable
        glowColor={ANGLE_GLOW[protocol.contentAngle]}
        className="h-full flex flex-col group"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-dc-text group-hover:text-dc-accent transition-colors">
                {protocol.hookTitle}
              </h3>
              <ArrowUpRight className="w-3.5 h-3.5 text-dc-text-muted opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </div>
            <p className="text-xs text-dc-text-muted mt-0.5">{protocol.subtitle}</p>
          </div>
          <Badge variant={INTENSITY_VARIANT[protocol.intensity]} size="xs">
            {protocol.intensity}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-xs text-dc-text-muted leading-relaxed mb-3 line-clamp-2 flex-1">
          {protocol.description}
        </p>

        {/* Progress bar (if active protocol) */}
        {showProgress && protocol.progress !== undefined && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-dc-text-muted">Progress</span>
              <span className="text-[10px] font-medium text-dc-text mono">{protocol.progress}%</span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${protocol.progress}%`,
                  background:
                    protocol.contentAngle === "clinical"
                      ? "linear-gradient(90deg, #00d4ff, #00a8ff)"
                      : protocol.contentAngle === "expert"
                      ? "linear-gradient(90deg, #ff6b35, #ff8555)"
                      : "linear-gradient(90deg, #b366ff, #9933ff)",
                }}
              />
            </div>
          </div>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-3 text-[10px] text-dc-text-muted mb-3">
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {protocol.duration}
          </span>
          <span className="inline-flex items-center gap-1">
            <Syringe className="w-3 h-3" />
            {protocol.peptides.length} compounds
          </span>
          {protocol.activeUsers && (
            <span className="inline-flex items-center gap-1">
              <Users className="w-3 h-3" />
              {protocol.activeUsers.toLocaleString()}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {protocol.goals.slice(0, 3).map((goal) => (
              <Badge key={goal} variant="default" size="xs">
                {goal.replace(/-/g, " ")}
              </Badge>
            ))}
            {protocol.goals.length > 3 && (
              <Badge variant="default" size="xs">+{protocol.goals.length - 3}</Badge>
            )}
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <LaneBadge lane={protocol.contentAngle} size="xs" />
            {protocol.rating && (
              <span className="flex items-center gap-0.5 text-[10px] text-dc-warning font-medium">
                <Star className="w-2.5 h-2.5 fill-current" />
                {protocol.rating}
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
