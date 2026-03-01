"use client";

import { useState } from "react";
import { RotateCcw, Syringe, Info } from "lucide-react";
import clsx from "clsx";
import type { InjectionSite, BodyView, InjectionType } from "@/types";

interface BodyDiagramProps {
  readonly sites: readonly InjectionSite[];
  readonly selectedSiteId: string | null;
  readonly onSelectSite: (site: InjectionSite) => void;
}

const TYPE_COLORS: Record<InjectionType, { fill: string; stroke: string; glow: string; label: string }> = {
  subq: { fill: "#00d4ff", stroke: "#00d4ff", glow: "rgba(0,212,255,0.6)", label: "SubQ" },
  im:   { fill: "#ff6b35", stroke: "#ff6b35", glow: "rgba(255,107,53,0.6)", label: "IM" },
};

/* ── Anatomical Front SVG ─────────────────────────────────────────────── */
function FrontBody() {
  return (
    <g opacity="0.35" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      {/* Head */}
      <ellipse cx="50" cy="14" rx="8" ry="9.5" fill="none" stroke="#4a4a6a" />
      {/* Neck */}
      <path d="M46 23 L46 27 M54 23 L54 27" stroke="#4a4a6a" fill="none" />
      {/* Torso */}
      <path d="M34 28 C34 28 32 30 32 33 L32 40 C32 44 33 56 36 60 L38 63 C40 66 42 68 44 69 L50 70 L56 69 C58 68 60 66 62 63 L64 60 C67 56 68 44 68 40 L68 33 C68 30 66 28 66 28 Z" fill="none" stroke="#4a4a6a" />
      {/* Chest definition */}
      <path d="M38 34 C42 37 46 37 50 36 C54 37 58 37 62 34" fill="none" stroke="#3a3a5e" strokeWidth="0.8" />
      {/* Abs lines */}
      <line x1="50" y1="40" x2="50" y2="62" stroke="#3a3a5e" strokeWidth="0.6" />
      <path d="M43 44 L57 44 M43 49 L57 49 M44 54 L56 54" fill="none" stroke="#3a3a5e" strokeWidth="0.5" />
      {/* Left Arm */}
      <path d="M34 28 L28 30 C25 31 22 34 21 37 L18 46 C17 49 17 51 18 53 L20 56 C21 57 22 58 22 58" fill="none" stroke="#4a4a6a" />
      <path d="M34 28 L30 29 C28 30 26 33 25 36 L22 44 C21 47 21 49 22 51 L24 54 C25 55 26 56 26 56" fill="none" stroke="#4a4a6a" />
      {/* Left hand */}
      <ellipse cx="21" cy="59" rx="3.5" ry="4" fill="none" stroke="#4a4a6a" strokeWidth="0.8" />
      {/* Right Arm */}
      <path d="M66 28 L72 30 C75 31 78 34 79 37 L82 46 C83 49 83 51 82 53 L80 56 C79 57 78 58 78 58" fill="none" stroke="#4a4a6a" />
      <path d="M66 28 L70 29 C72 30 74 33 75 36 L78 44 C79 47 79 49 78 51 L76 54 C75 55 74 56 74 56" fill="none" stroke="#4a4a6a" />
      {/* Right hand */}
      <ellipse cx="79" cy="59" rx="3.5" ry="4" fill="none" stroke="#4a4a6a" strokeWidth="0.8" />
      {/* Left Leg */}
      <path d="M44 69 L42 72 C40 76 38 82 37 88 L36 94 C36 98 36 102 37 106 L38 110 C38 112 38 114 38 116" fill="none" stroke="#4a4a6a" />
      <path d="M50 70 L48 72 C46 76 44 82 43 88 L42 94 C42 98 42 102 42 106 L42 110 C42 112 42 114 42 116" fill="none" stroke="#4a4a6a" />
      {/* Left foot */}
      <path d="M36 116 L35 119 C35 120 36 121 38 121 L42 121 C44 121 44 120 44 119 L43 116" fill="none" stroke="#4a4a6a" strokeWidth="0.8" />
      {/* Right Leg */}
      <path d="M56 69 L58 72 C60 76 62 82 63 88 L64 94 C64 98 64 102 63 106 L62 110 C62 112 62 114 62 116" fill="none" stroke="#4a4a6a" />
      <path d="M50 70 L52 72 C54 76 56 82 57 88 L58 94 C58 98 58 102 58 106 L58 110 C58 112 58 114 58 116" fill="none" stroke="#4a4a6a" />
      {/* Right foot */}
      <path d="M56 116 L55 119 C55 120 56 121 58 121 L62 121 C64 121 65 120 65 119 L64 116" fill="none" stroke="#4a4a6a" strokeWidth="0.8" />
      {/* Muscle highlights — deltoids */}
      <path d="M30 30 C28 32 26 35 25 38 L28 38 C29 35 31 32 33 30 Z" fill="#4a4a6a" opacity="0.15" />
      <path d="M70 30 C72 32 74 35 75 38 L72 38 C71 35 69 32 67 30 Z" fill="#4a4a6a" opacity="0.15" />
      {/* Muscle highlights — quads */}
      <path d="M40 72 C39 78 38 84 37 90 L43 90 C43 84 44 78 45 72 Z" fill="#4a4a6a" opacity="0.12" />
      <path d="M60 72 C61 78 62 84 63 90 L57 90 C57 84 56 78 55 72 Z" fill="#4a4a6a" opacity="0.12" />
    </g>
  );
}

/* ── Anatomical Back SVG ──────────────────────────────────────────────── */
function BackBody() {
  return (
    <g opacity="0.35" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      {/* Head */}
      <ellipse cx="50" cy="14" rx="8" ry="9.5" fill="none" stroke="#4a4a6a" />
      {/* Neck */}
      <path d="M46 23 L46 27 M54 23 L54 27" stroke="#4a4a6a" fill="none" />
      {/* Torso — back shape */}
      <path d="M34 28 C34 28 32 30 32 33 L32 40 C32 44 33 56 36 60 L38 63 C40 66 42 68 44 69 L50 70 L56 69 C58 68 60 66 62 63 L64 60 C67 56 68 44 68 40 L68 33 C68 30 66 28 66 28 Z" fill="none" stroke="#4a4a6a" />
      {/* Spine */}
      <line x1="50" y1="27" x2="50" y2="68" stroke="#3a3a5e" strokeWidth="0.6" />
      {/* Scapulae */}
      <path d="M38 32 C40 35 44 37 48 36" fill="none" stroke="#3a3a5e" strokeWidth="0.7" />
      <path d="M62 32 C60 35 56 37 52 36" fill="none" stroke="#3a3a5e" strokeWidth="0.7" />
      {/* Lat lines */}
      <path d="M36 38 C37 44 38 50 39 55" fill="none" stroke="#3a3a5e" strokeWidth="0.5" />
      <path d="M64 38 C63 44 62 50 61 55" fill="none" stroke="#3a3a5e" strokeWidth="0.5" />
      {/* Lower back */}
      <path d="M44 56 C47 58 53 58 56 56" fill="none" stroke="#3a3a5e" strokeWidth="0.5" />
      {/* Glute line */}
      <path d="M38 63 C42 67 46 68 50 68 C54 68 58 67 62 63" fill="none" stroke="#3a3a5e" strokeWidth="0.6" />
      <line x1="50" y1="63" x2="50" y2="70" stroke="#3a3a5e" strokeWidth="0.5" />
      {/* Left Arm */}
      <path d="M34 28 L28 30 C25 31 22 34 21 37 L18 46 C17 49 17 51 18 53 L20 56 C21 57 22 58 22 58" fill="none" stroke="#4a4a6a" />
      <path d="M34 28 L30 29 C28 30 26 33 25 36 L22 44 C21 47 21 49 22 51 L24 54 C25 55 26 56 26 56" fill="none" stroke="#4a4a6a" />
      <ellipse cx="21" cy="59" rx="3.5" ry="4" fill="none" stroke="#4a4a6a" strokeWidth="0.8" />
      {/* Right Arm */}
      <path d="M66 28 L72 30 C75 31 78 34 79 37 L82 46 C83 49 83 51 82 53 L80 56 C79 57 78 58 78 58" fill="none" stroke="#4a4a6a" />
      <path d="M66 28 L70 29 C72 30 74 33 75 36 L78 44 C79 47 79 49 78 51 L76 54 C75 55 74 56 74 56" fill="none" stroke="#4a4a6a" />
      <ellipse cx="79" cy="59" rx="3.5" ry="4" fill="none" stroke="#4a4a6a" strokeWidth="0.8" />
      {/* Left Leg */}
      <path d="M44 69 L42 72 C40 76 38 82 37 88 L36 94 C36 98 36 102 37 106 L38 110 C38 112 38 114 38 116" fill="none" stroke="#4a4a6a" />
      <path d="M50 70 L48 72 C46 76 44 82 43 88 L42 94 C42 98 42 102 42 106 L42 110 C42 112 42 114 42 116" fill="none" stroke="#4a4a6a" />
      <path d="M36 116 L35 119 C35 120 36 121 38 121 L42 121 C44 121 44 120 44 119 L43 116" fill="none" stroke="#4a4a6a" strokeWidth="0.8" />
      {/* Right Leg */}
      <path d="M56 69 L58 72 C60 76 62 82 63 88 L64 94 C64 98 64 102 63 106 L62 110 C62 112 62 114 62 116" fill="none" stroke="#4a4a6a" />
      <path d="M50 70 L52 72 C54 76 56 82 57 88 L58 94 C58 98 58 102 58 106 L58 110 C58 112 58 114 58 116" fill="none" stroke="#4a4a6a" />
      <path d="M56 116 L55 119 C55 120 56 121 58 121 L62 121 C64 121 65 120 65 119 L64 116" fill="none" stroke="#4a4a6a" strokeWidth="0.8" />
      {/* Muscle highlights — glutes */}
      <path d="M38 55 C40 58 44 62 49 63 L50 63 C50 59 46 56 42 54 Z" fill="#4a4a6a" opacity="0.15" />
      <path d="M62 55 C60 58 56 62 51 63 L50 63 C50 59 54 56 58 54 Z" fill="#4a4a6a" opacity="0.15" />
      {/* Muscle highlights — traps */}
      <path d="M42 28 C44 30 48 31 50 31 C52 31 56 30 58 28 L55 27 L50 26 L45 27 Z" fill="#4a4a6a" opacity="0.12" />
    </g>
  );
}

/* ── Injection Site Marker ────────────────────────────────────────────── */
function SiteMarker({ site, isSelected, onClick }: {
  readonly site: InjectionSite;
  readonly isSelected: boolean;
  readonly onClick: () => void;
}) {
  const colors = TYPE_COLORS[site.type];
  const r = isSelected ? 4.5 : 3;

  return (
    <g className="cursor-pointer" onClick={onClick}>
      {/* Pulse ring when selected */}
      {isSelected && (
        <circle
          cx={site.x}
          cy={site.y}
          r="8"
          fill="none"
          stroke={colors.stroke}
          strokeWidth="1"
          opacity="0.4"
        >
          <animate attributeName="r" from="5" to="12" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite" />
        </circle>
      )}
      {/* Outer glow */}
      <circle
        cx={site.x}
        cy={site.y}
        r={r + 1.5}
        fill={isSelected ? colors.fill : "transparent"}
        opacity={isSelected ? 0.15 : 0}
      />
      {/* Core dot */}
      <circle
        cx={site.x}
        cy={site.y}
        r={r}
        fill={isSelected ? colors.fill : "#1a1a2e"}
        stroke={isSelected ? colors.fill : "#3a3a5e"}
        strokeWidth={isSelected ? 1.5 : 1}
        style={{
          filter: isSelected ? `drop-shadow(0 0 6px ${colors.glow})` : "none",
          transition: "all 0.2s ease",
        }}
      />
      {/* SubQ = circle, IM = diamond indicator */}
      {site.type === "im" && !isSelected && (
        <rect
          x={site.x - 1.2}
          y={site.y - 1.2}
          width="2.4"
          height="2.4"
          fill="#3a3a5e"
          transform={`rotate(45 ${site.x} ${site.y})`}
        />
      )}
    </g>
  );
}

/* ── Main Component ───────────────────────────────────────────────────── */
export function BodyDiagram({ sites, selectedSiteId, onSelectSite }: BodyDiagramProps) {
  const [view, setView] = useState<BodyView>("front");
  const [typeFilter, setTypeFilter] = useState<InjectionType | null>(null);

  const visibleSites = sites.filter((s) => {
    const matchView = s.view === view;
    const matchType = typeFilter === null || s.type === typeFilter;
    return matchView && matchType;
  });

  const selectedSite = sites.find((s) => s.id === selectedSiteId) ?? null;

  return (
    <div className="space-y-3">
      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {(["front", "back"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={clsx(
                "px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wide transition-all",
                view === v
                  ? "bg-dc-accent/15 text-dc-accent border border-dc-accent/30"
                  : "text-dc-text-muted border border-dc-border hover:text-dc-text hover:border-dc-accent/20",
              )}
            >
              {v}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {(["subq", "im"] as const).map((t) => {
            const c = TYPE_COLORS[t];
            const active = typeFilter === t;
            return (
              <button
                key={t}
                onClick={() => setTypeFilter(typeFilter === t ? null : t)}
                className={clsx(
                  "px-2 py-1 rounded-md text-[9px] font-semibold uppercase tracking-wide transition-all border",
                )}
                style={
                  active
                    ? { background: `${c.fill}15`, borderColor: `${c.fill}40`, color: c.fill }
                    : { borderColor: "#2a2a3e", color: "#6a6a8a" }
                }
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* SVG Diagram */}
      <div className="relative w-full max-w-[220px] mx-auto">
        <svg viewBox="0 0 100 125" className="w-full h-auto">
          {/* Background gradient */}
          <defs>
            <radialGradient id="bodyGlow" cx="50%" cy="45%" r="45%">
              <stop offset="0%" stopColor="#1a1a3e" stopOpacity="0.3" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
            <filter id="softGlow">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Subtle body glow */}
          <ellipse cx="50" cy="55" rx="30" ry="45" fill="url(#bodyGlow)" />

          {/* Anatomical body */}
          {view === "front" ? <FrontBody /> : <BackBody />}

          {/* View label */}
          <text x="50" y="124" textAnchor="middle" fill="#4a4a6a" fontSize="3.5" fontWeight="600" letterSpacing="0.15em">
            {view === "front" ? "ANTERIOR" : "POSTERIOR"}
          </text>

          {/* Injection site markers */}
          {visibleSites.map((site) => (
            <SiteMarker
              key={site.id}
              site={site}
              isSelected={selectedSiteId === site.id}
              onClick={() => onSelectSite(site)}
            />
          ))}
        </svg>

        {/* Flip button */}
        <button
          onClick={() => setView(view === "front" ? "back" : "front")}
          className="absolute bottom-1 right-1 p-1.5 rounded-lg bg-dc-surface-alt/80 border border-dc-border/60 text-dc-text-muted hover:text-dc-accent hover:border-dc-accent/30 transition-all"
          title={`Flip to ${view === "front" ? "back" : "front"}`}
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-[9px]">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: TYPE_COLORS.subq.fill, boxShadow: `0 0 4px ${TYPE_COLORS.subq.glow}` }} />
          <span className="text-dc-text-muted">SubQ (peptides)</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-sm rotate-45" style={{ background: TYPE_COLORS.im.fill, boxShadow: `0 0 4px ${TYPE_COLORS.im.glow}` }} />
          <span className="text-dc-text-muted">IM (TRT / oil)</span>
        </span>
      </div>

      {/* Selected Site Info Panel */}
      {selectedSite && (
        <div
          className="rounded-xl p-3 border transition-all"
          style={{
            background: `${TYPE_COLORS[selectedSite.type].fill}08`,
            borderColor: `${TYPE_COLORS[selectedSite.type].fill}25`,
          }}
        >
          <div className="flex items-start gap-2 mb-2">
            <Syringe className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: TYPE_COLORS[selectedSite.type].fill }} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-dc-text">{selectedSite.label}</p>
              <p className="text-[10px] text-dc-text-muted">{selectedSite.muscle}</p>
            </div>
            <span
              className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider"
              style={{
                background: `${TYPE_COLORS[selectedSite.type].fill}15`,
                color: TYPE_COLORS[selectedSite.type].fill,
              }}
            >
              {selectedSite.type}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div>
              <span className="text-dc-text-faint uppercase tracking-wide text-[8px]">Needle / Angle</span>
              <p className="text-dc-text font-medium">{selectedSite.depth}</p>
            </div>
            <div>
              <span className="text-dc-text-faint uppercase tracking-wide text-[8px]">View</span>
              <p className="text-dc-text font-medium capitalize">{selectedSite.view}</p>
            </div>
          </div>
          {selectedSite.notes && (
            <div className="flex items-start gap-1.5 mt-2 pt-2 border-t border-dc-border/30">
              <Info className="w-3 h-3 flex-shrink-0 text-dc-text-faint mt-0.5" />
              <p className="text-[10px] text-dc-text-muted leading-relaxed">{selectedSite.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
