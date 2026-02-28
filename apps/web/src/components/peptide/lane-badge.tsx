"use client";

import clsx from "clsx";
import type { EvidenceLane } from "@/types";

interface LaneBadgeProps {
  readonly lane: EvidenceLane;
  readonly showLabel?: boolean;
  readonly size?: "sm" | "md";
}

const LANE_CONFIG: Record<EvidenceLane, { label: string; color: string; className: string }> = {
  clinical: {
    label: "Clinical",
    color: "#00d4ff",
    className: "bg-dc-clinical",
  },
  expert: {
    label: "Expert",
    color: "#ff6b35",
    className: "bg-dc-expert",
  },
  experimental: {
    label: "Experimental",
    color: "#b366ff",
    className: "bg-dc-experimental",
  },
};

export function LaneBadge({ lane, showLabel = false, size = "sm" }: LaneBadgeProps) {
  const config = LANE_CONFIG[lane];
  const dotSize = size === "sm" ? "w-2 h-2" : "w-3 h-3";

  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={clsx("rounded-full", dotSize, config.className)}
        style={{ boxShadow: `0 0 6px ${config.color}50` }}
      />
      {showLabel && (
        <span
          className={clsx("font-medium", size === "sm" ? "text-[10px]" : "text-xs")}
          style={{ color: config.color }}
        >
          {config.label}
        </span>
      )}
    </span>
  );
}

interface LaneDotsProps {
  readonly lanes: readonly EvidenceLane[];
}

export function LaneDots({ lanes }: LaneDotsProps) {
  return (
    <span className="inline-flex items-center gap-1">
      {lanes.map((lane) => (
        <LaneBadge key={lane} lane={lane} size="sm" />
      ))}
    </span>
  );
}
