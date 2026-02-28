"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Syringe } from "lucide-react";
import type { Protocol, ProtocolIntensity } from "@/types";

interface ProtocolCardProps {
  readonly protocol: Protocol;
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

export function ProtocolCard({ protocol }: ProtocolCardProps) {
  return (
    <Link href={`/protocols#${protocol.id}`}>
      <Card hoverable glowColor={ANGLE_GLOW[protocol.contentAngle]}>
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-base font-bold text-dc-text">{protocol.hookTitle}</h3>
          <Badge variant={INTENSITY_VARIANT[protocol.intensity]} size="md">
            {protocol.intensity}
          </Badge>
        </div>

        <p className="text-sm text-dc-text-muted mb-3">{protocol.subtitle}</p>

        <p className="text-sm text-dc-text-muted leading-relaxed mb-4 line-clamp-2">
          {protocol.description}
        </p>

        <div className="flex items-center gap-4 text-xs text-dc-text-muted mb-3">
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {protocol.duration}
          </span>
          <span className="inline-flex items-center gap-1">
            <Syringe className="w-3.5 h-3.5" />
            {protocol.peptides.length} compounds
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {protocol.goals.slice(0, 4).map((goal) => (
            <Badge key={goal} variant="default" size="sm">
              {goal.replace(/-/g, " ")}
            </Badge>
          ))}
          {protocol.goals.length > 4 && (
            <Badge variant="default" size="sm">
              +{protocol.goals.length - 4}
            </Badge>
          )}
        </div>
      </Card>
    </Link>
  );
}
