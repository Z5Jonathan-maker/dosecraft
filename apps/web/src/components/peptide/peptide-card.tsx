"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LaneDots } from "@/components/peptide/lane-badge";
import type { Peptide } from "@/types";

interface PeptideCardProps {
  readonly peptide: Peptide;
}

const STATUS_VARIANT: Record<string, "success" | "warning" | "default" | "danger"> = {
  "well-researched": "success",
  emerging: "warning",
  experimental: "danger",
  novel: "default",
};

export function PeptideCard({ peptide }: PeptideCardProps) {
  return (
    <Link href={`/library/${peptide.slug}`}>
      <Card hoverable className="h-full flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-base font-semibold text-dc-text">{peptide.name}</h3>
            {peptide.aliases.length > 0 && (
              <p className="text-[11px] text-dc-text-muted mt-0.5">
                {peptide.aliases[0]}
              </p>
            )}
          </div>
          <LaneDots lanes={peptide.lanes} />
        </div>

        <p className="text-sm text-dc-text-muted leading-relaxed mb-4 flex-1 line-clamp-3">
          {peptide.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          <Badge variant={STATUS_VARIANT[peptide.status] ?? "default"} size="sm">
            {peptide.status}
          </Badge>
          <Badge variant="default" size="sm">
            {peptide.category}
          </Badge>
          <Badge variant="default" size="sm">
            {peptide.route}
          </Badge>
        </div>
      </Card>
    </Link>
  );
}
