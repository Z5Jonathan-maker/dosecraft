"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LaneDots } from "@/components/peptide/lane-badge";
import { Clock, Syringe, ArrowUpRight } from "lucide-react";
import type { Peptide } from "@/types";

interface PeptideCardProps {
  readonly peptide: Peptide;
}

const STATUS_VARIANT: Record<string, "success" | "warning" | "default" | "danger" | "neutral"> = {
  "well-researched": "success",
  emerging: "warning",
  experimental: "danger",
  novel: "neutral",
};

const STATUS_LABEL: Record<string, string> = {
  "well-researched": "Well Researched",
  emerging: "Emerging",
  experimental: "Experimental",
  novel: "Novel",
};

export function PeptideCard({ peptide }: PeptideCardProps) {
  return (
    <Link href={`/library/${peptide.slug}`} className="block">
      <Card
        hoverable
        className="h-full flex flex-col group"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-dc-text group-hover:text-dc-accent transition-colors truncate">
                {peptide.name}
              </h3>
              <ArrowUpRight className="w-3.5 h-3.5 text-dc-text-muted opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </div>
            {peptide.aliases.length > 0 && (
              <p className="text-[11px] text-dc-text-muted mt-0.5 truncate">{peptide.aliases[0]}</p>
            )}
          </div>
          <LaneDots lanes={peptide.lanes} size="sm" />
        </div>

        {/* Description */}
        <p className="text-xs text-dc-text-muted leading-relaxed mb-4 flex-1 line-clamp-3">
          {peptide.description}
        </p>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-dc-surface-alt/60 rounded-lg px-2.5 py-2">
            <p className="text-[9px] text-dc-text-faint uppercase tracking-wide mb-0.5 flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              Half-life
            </p>
            <p className="text-[11px] font-medium text-dc-text mono">{peptide.halfLife}</p>
          </div>
          <div className="bg-dc-surface-alt/60 rounded-lg px-2.5 py-2">
            <p className="text-[9px] text-dc-text-faint uppercase tracking-wide mb-0.5 flex items-center gap-1">
              <Syringe className="w-2.5 h-2.5" />
              Route
            </p>
            <p className="text-[11px] font-medium text-dc-text capitalize">{peptide.route}</p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          <Badge variant={STATUS_VARIANT[peptide.status] ?? "default"} size="xs">
            {STATUS_LABEL[peptide.status] ?? peptide.status}
          </Badge>
          <Badge variant="default" size="xs" className="capitalize">
            {peptide.category.replace(/-/g, " ")}
          </Badge>
        </div>
      </Card>
    </Link>
  );
}
