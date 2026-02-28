"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, MapPin, Syringe } from "lucide-react";
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
                ? new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
                : null,
            }
          : dose,
      ),
    );
  };

  const completedCount = doses.filter((d) => d.taken).length;

  return (
    <div className="space-y-3">
      {/* Progress */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-dc-text-muted">
          {completedCount}/{doses.length} doses logged
        </span>
        <div className="w-32 h-1.5 bg-dc-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-dc-neon-green rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / doses.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Dose cards */}
      {doses.map((dose) => (
        <Card
          key={dose.id}
          className={clsx(
            "flex items-center gap-4 cursor-pointer transition-all duration-200",
            dose.taken && "opacity-70",
          )}
          onClick={() => handleToggle(dose.id)}
        >
          {/* Checkbox */}
          <button
            className={clsx(
              "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 border",
              dose.taken
                ? "bg-dc-neon-green/20 border-dc-neon-green text-dc-neon-green"
                : "bg-dc-surface border-dc-border hover:border-dc-accent",
            )}
          >
            {dose.taken && <Check className="w-4 h-4" />}
          </button>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-dc-text">{dose.peptideName}</span>
              <Badge variant="default" size="sm">
                {dose.dose}
              </Badge>
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-dc-text-muted">
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
            <span className="text-xs text-dc-neon-green flex-shrink-0">
              {dose.takenAt}
            </span>
          )}
        </Card>
      ))}
    </div>
  );
}
