"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, MapPin, Syringe, Layers } from "lucide-react";
import clsx from "clsx";
import type { DailyDose } from "@/types";

interface DoseChecklistProps {
  readonly doses: readonly DailyDose[];
}

export function DoseChecklist({ doses: initialDoses }: DoseChecklistProps) {
  const [doses, setDoses] = useState<readonly DailyDose[]>(initialDoses);

  const handleToggle = (id: string) => {
    setDoses((prev) =>
      prev.map((dose) =>
        dose.id === id
          ? {
              ...dose,
              taken: !dose.taken,
              takenAt: !dose.taken
                ? new Date().toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })
                : null,
            }
          : dose,
      ),
    );
  };

  const completedCount = doses.filter((d) => d.taken).length;
  const percentage = doses.length > 0 ? Math.round((completedCount / doses.length) * 100) : 0;
  const isComplete = completedCount === doses.length;

  return (
    <div className="space-y-3">
      {/* Progress header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={clsx(
              "text-sm font-semibold",
              isComplete ? "text-dc-neon-green" : "text-dc-text",
            )}
          >
            {completedCount}/{doses.length} logged
          </span>
          {isComplete && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-dc-neon-green/10 text-dc-neon-green border border-dc-neon-green/20">
              All done
            </span>
          )}
        </div>
        <span className={clsx("text-sm font-bold mono", isComplete ? "text-dc-neon-green" : "text-dc-accent")}>
          {percentage}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{
            width: `${percentage}%`,
            background: isComplete
              ? "linear-gradient(90deg, #00ff88, #00cc66)"
              : "linear-gradient(90deg, #ff6b35, #ff8555)",
          }}
        />
      </div>

      {/* Dose list */}
      <div className="space-y-2 mt-4">
        {doses.map((dose) => (
          <div
            key={dose.id}
            onClick={() => handleToggle(dose.id)}
            className={clsx(
              "flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all duration-200",
              dose.taken
                ? "border-dc-neon-green/15 bg-dc-neon-green/5 opacity-75"
                : "border-dc-border bg-dc-surface hover:border-dc-accent/20 hover:bg-dc-surface-alt",
            )}
          >
            {/* Checkbox */}
            <div
              className={clsx(
                "w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 border transition-all duration-200",
                dose.taken
                  ? "bg-dc-neon-green/20 border-dc-neon-green text-dc-neon-green"
                  : "bg-dc-surface-alt border-dc-border",
              )}
            >
              {dose.taken && <Check className="w-3.5 h-3.5" />}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={clsx(
                    "text-sm font-medium",
                    dose.taken ? "text-dc-text-muted line-through" : "text-dc-text",
                  )}
                >
                  {dose.peptideName}
                </span>
                <Badge variant="default" size="xs" className="mono">
                  {dose.dose}
                </Badge>
                {dose.protocolName && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[9px] text-dc-text-faint">
                    <Layers className="w-2.5 h-2.5" />
                    {dose.protocolName}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1 text-[10px] text-dc-text-muted flex-wrap">
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {dose.scheduledTime}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Syringe className="w-3 h-3" />
                  {dose.route}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {dose.site}
                </span>
              </div>
            </div>

            {/* Taken time */}
            {dose.taken && dose.takenAt && (
              <span className="text-[10px] font-medium text-dc-neon-green flex-shrink-0 mono">
                {dose.takenAt}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
