"use client";

import clsx from "clsx";
import type { EvidenceLane } from "@/types";

interface LaneBadgeProps {
  readonly lane: EvidenceLane;
  readonly showLabel?: boolean;
  readonly size?: "xs" | "sm" | "md";
}

export const LANE_CONFIG: Record<EvidenceLane, { label: string; color: string; bg: string; dotClass: string }> = {
  clinical: {
    label: "Clinical",
    color: "#00d4ff",
    bg: "rgba(0, 212, 255, 0.1)",
    dotClass: "lane-dot-clinical",
  },
  expert: {
    label: "Expert",
    color: "#ff6b35",
    bg: "rgba(255, 107, 53, 0.1)",
    dotClass: "lane-dot-expert",
  },
  experimental: {
    label: "Experimental",
    color: "#b366ff",
    bg: "rgba(179, 102, 255, 0.1)",
    dotClass: "lane-dot-experimental",
  },
};

export function LaneBadge({ lane, showLabel = false, size = "sm" }: LaneBadgeProps) {
  const config = LANE_CONFIG[lane];
  const dotSize = size === "xs" ? "w-1.5 h-1.5" : size === "sm" ? "w-2 h-2" : "w-2.5 h-2.5";

  if (!showLabel) {
    return (
      <span
        className={clsx("rounded-full flex-shrink-0 inline-block", dotSize, config.dotClass)}
      />
    );
  }

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 border rounded-full font-medium",
        size === "xs" ? "px-1.5 py-0.5 text-[9px]" : size === "sm" ? "px-2.5 py-1 text-[10px]" : "px-3 py-1 text-xs",
      )}
      style={{
        color: config.color,
        backgroundColor: config.bg,
        borderColor: `${config.color}30`,
      }}
    >
      <span className={clsx("rounded-full", size === "xs" ? "w-1.5 h-1.5" : "w-1.5 h-1.5", config.dotClass)} />
      {config.label}
    </span>
  );
}

interface LaneDotsProps {
  readonly lanes: readonly EvidenceLane[];
  readonly size?: "xs" | "sm" | "md";
}

export function LaneDots({ lanes, size = "sm" }: LaneDotsProps) {
  return (
    <span className="inline-flex items-center gap-1">
      {lanes.map((lane) => (
        <LaneBadge key={lane} lane={lane} size={size} />
      ))}
    </span>
  );
}

interface LaneSelectorProps {
  readonly lanes: readonly EvidenceLane[];
}

export function LaneSelector({ lanes }: LaneSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {(["clinical", "expert", "experimental"] as EvidenceLane[]).map((lane) => {
        const config = LANE_CONFIG[lane];
        const has = lanes.includes(lane);
        return (
          <span
            key={lane}
            className={clsx(
              "inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] rounded-full border font-medium transition-opacity",
              has ? "opacity-100" : "opacity-25",
            )}
            style={has ? { color: config.color, backgroundColor: config.bg, borderColor: `${config.color}30` } : undefined}
          >
            <span className={clsx("w-1.5 h-1.5 rounded-full", has ? config.dotClass : "bg-dc-text-muted")} />
            {config.label}
          </span>
        );
      })}
    </div>
  );
}
