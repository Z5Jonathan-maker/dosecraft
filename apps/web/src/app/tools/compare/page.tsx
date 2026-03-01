"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Check,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LaneDots, LANE_CONFIG } from "@/components/peptide/lane-badge";
import { MOCK_PEPTIDES } from "@/lib/mock-data";
import type { Peptide, EvidenceLane } from "@/types";
import clsx from "clsx";

// ── Radar Chart (pure SVG) ───────────────────────────────────────────────────

interface RadarData {
  readonly label: string;
  readonly peptides: { name: string; value: number; color: string }[];
}

const RADAR_COLORS = ["#00d4ff", "#ff6b35", "#b366ff"];

function getConfidence(p: Peptide): number {
  const lanes = (["clinical", "expert", "experimental"] as EvidenceLane[])
    .map((l) => p.laneData[l])
    .filter(Boolean);
  if (lanes.length === 0) return 0;
  return Math.round(lanes.reduce((sum, l) => sum + (l?.confidence ?? 0), 0) / lanes.length);
}

function getResearchDepth(p: Peptide): number {
  const laneCount = p.lanes.length;
  const sourceCount = (["clinical", "expert", "experimental"] as EvidenceLane[])
    .map((l) => p.laneData[l]?.sources.length ?? 0)
    .reduce((a, b) => a + b, 0);
  return Math.min(100, laneCount * 20 + sourceCount * 5);
}

function getPopularity(p: Peptide): number {
  const popularSlugs: Record<string, number> = {
    "bpc-157": 95, "tb-500": 85, "cjc-1295-ipamorelin": 90,
    semaglutide: 98, "testosterone-cypionate": 95, hcg: 80,
    anastrozole: 75, "mk-677": 82, "pt-141": 70, "ghk-cu": 65,
    tesamorelin: 72, sermorelin: 68, "ghrp-6": 60, selank: 55,
    epithalon: 50, "mots-c": 45, "melanotan-ii": 62, dsip: 40,
    semax: 52, dihexa: 35, "ss-31": 30, "nad-plus": 60,
    "thymosin-alpha-1": 48, "ll-37": 42, kpv: 38,
    "bpc-157-oral": 55, enclomiphene: 65, dhea: 58,
    pregnenolone: 45, "kisspeptin-10": 40, "aod-9604": 55,
    "testosterone-enanthate": 88, "testosterone-propionate": 60,
    "cjc-1295-no-dac": 65,
  };
  return popularSlugs[p.slug] ?? 40;
}

function getSafetyProfile(p: Peptide): number {
  const contra = p.contraindications.length;
  const base = p.status === "well-researched" ? 85 : p.status === "emerging" ? 65 : 45;
  return Math.max(20, base - contra * 5);
}

function getEfficacy(p: Peptide): number {
  return getConfidence(p);
}

function RadarChart({ data, size = 220 }: { data: RadarData[]; size?: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 30;
  const n = data.length;
  const angleStep = (2 * Math.PI) / n;

  const getPoint = (i: number, val: number) => {
    const angle = angleStep * i - Math.PI / 2;
    const dist = (val / 100) * r;
    return { x: cx + dist * Math.cos(angle), y: cy + dist * Math.sin(angle) };
  };

  const gridLevels = [20, 40, 60, 80, 100];

  const peptideCount = data[0]?.peptides.length ?? 0;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[280px] mx-auto">
      {/* Grid */}
      {gridLevels.map((level) => {
        const points = Array.from({ length: n }, (_, i) => {
          const pt = getPoint(i, level);
          return `${pt.x},${pt.y}`;
        }).join(" ");
        return (
          <polygon
            key={level}
            points={points}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
        );
      })}

      {/* Axes */}
      {data.map((_, i) => {
        const pt = getPoint(i, 100);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={pt.x}
            y2={pt.y}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
        );
      })}

      {/* Data polygons */}
      {Array.from({ length: peptideCount }, (_, pi) => {
        const points = data
          .map((d, i) => {
            const val = d.peptides[pi]?.value ?? 0;
            const pt = getPoint(i, val);
            return `${pt.x},${pt.y}`;
          })
          .join(" ");
        const color = data[0]?.peptides[pi]?.color ?? RADAR_COLORS[pi];
        return (
          <g key={pi}>
            <polygon
              points={points}
              fill={`${color}18`}
              stroke={color}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {data.map((d, i) => {
              const val = d.peptides[pi]?.value ?? 0;
              const pt = getPoint(i, val);
              return (
                <circle
                  key={i}
                  cx={pt.x}
                  cy={pt.y}
                  r="3"
                  fill={color}
                  stroke="rgba(0,0,0,0.4)"
                  strokeWidth="1"
                />
              );
            })}
          </g>
        );
      })}

      {/* Labels */}
      {data.map((d, i) => {
        const pt = getPoint(i, 115);
        return (
          <text
            key={i}
            x={pt.x}
            y={pt.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-dc-text-muted"
            fontSize="9"
            fontWeight="500"
          >
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}

// ── Status Badge Helpers ─────────────────────────────────────────────────────

function getStatusBadge(status: string): { label: string; variant: "success" | "warning" | "danger" | "default" } {
  switch (status) {
    case "well-researched": return { label: "Well Researched", variant: "success" };
    case "emerging": return { label: "Emerging", variant: "warning" };
    case "experimental": return { label: "Experimental", variant: "danger" };
    default: return { label: status, variant: "default" };
  }
}

function getFdaStatus(p: Peptide): string {
  const fdaApproved = ["semaglutide", "pt-141", "testosterone-cypionate", "testosterone-enanthate", "anastrozole", "hcg", "tesamorelin"];
  const fdaApprovedOther = ["testosterone-propionate", "dhea"];
  if (fdaApproved.includes(p.slug)) return "FDA Approved";
  if (fdaApprovedOther.includes(p.slug)) return "FDA Approved (OTC/Rx)";
  if (p.slug === "sermorelin") return "Previously FDA Approved";
  if (["selank"].includes(p.slug)) return "Approved in Russia";
  return "Not FDA Approved";
}

function getSideEffects(p: Peptide): string {
  const effects: Record<string, string> = {
    "bpc-157": "Generally well tolerated. Rare: injection site redness, mild GI upset.",
    "tb-500": "Generally well tolerated. Rare: headache, injection site irritation.",
    "cjc-1295-ipamorelin": "Flushing, tingling, water retention, increased hunger (mild).",
    semaglutide: "Nausea, vomiting, diarrhea, constipation (dose-dependent). Rare: pancreatitis.",
    "ghk-cu": "Topical: mild irritation. Injectable: injection site reaction.",
    epithalon: "Very well tolerated. Rare: injection site reaction.",
    "mots-c": "Limited data. Injection site reactions reported.",
    selank: "Very well tolerated. Rare: nasal irritation (intranasal).",
    "pt-141": "Nausea (common), flushing, headache. Rare: hypertension.",
    "ghrp-6": "Significant hunger increase, water retention, cortisol elevation.",
    "testosterone-cypionate": "Acne, hair loss, polycythemia, mood changes, testicular atrophy.",
    "testosterone-enanthate": "Same as cypionate. Acne, hair loss, mood changes.",
    "testosterone-propionate": "Injection site pain (PIP), acne, hair loss.",
    hcg: "Injection site pain, headache, mood swings. Rare: OHSS (females).",
    anastrozole: "Joint pain, hot flashes, fatigue if estrogen too low.",
    enclomiphene: "Headache, hot flashes, visual disturbances (rare).",
    dhea: "Acne, hair loss, mood changes at high doses.",
    pregnenolone: "Generally well tolerated. Rare: headache, drowsiness.",
    tesamorelin: "Injection site reactions, joint pain, peripheral edema.",
    sermorelin: "Flushing, headache, dizziness at injection site.",
    "mk-677": "Increased appetite, water retention, numbness/tingling, insulin resistance.",
    "melanotan-ii": "Nausea, flushing, darkening of moles, spontaneous erections.",
    dsip: "Mild drowsiness. Very well tolerated.",
    semax: "Nasal irritation. Very well tolerated.",
    "nad-plus": "IV: flushing, chest tightness. SubQ: injection site pain.",
    "ss-31": "Limited data. Generally well tolerated in trials.",
  };
  return effects[p.slug] ?? "Limited side effect data available.";
}

// ── Use Case Recommendations ─────────────────────────────────────────────────

function getRecommendations(peptides: readonly Peptide[]): { useCase: string; recommended: string; reason: string }[] {
  if (peptides.length < 2) return [];

  const slugs = peptides.map((p) => p.slug);
  const recs: { useCase: string; recommended: string; reason: string }[] = [];

  const healing = peptides.filter((p) => p.category === "healing");
  const gh = peptides.filter((p) => p.category === "growth-hormone");
  const hormonal = peptides.filter((p) => p.category === "hormonal");
  const metabolic = peptides.filter((p) => p.category === "metabolic");
  const neuro = peptides.filter((p) => p.category === "neuroprotective");

  if (healing.length >= 2) {
    const best = healing.find((p) => p.slug === "bpc-157") ?? healing[0];
    recs.push({ useCase: "Injury Recovery", recommended: best.name, reason: "Strongest evidence for tissue healing with the most favorable safety profile." });
  }

  if (gh.length >= 2) {
    const best = gh.find((p) => p.slug === "cjc-1295-ipamorelin") ?? gh[0];
    recs.push({ useCase: "GH Optimization", recommended: best.name, reason: "Best balance of efficacy and side effect profile among GH secretagogues." });
  }

  if (hormonal.length >= 2) {
    const trt = hormonal.find((p) => p.slug.startsWith("testosterone-"));
    if (trt) recs.push({ useCase: "Hormone Replacement", recommended: trt.name, reason: "Most clinical evidence and longest safety track record for TRT." });
  }

  if (metabolic.length >= 2) {
    const best = metabolic.find((p) => p.slug === "semaglutide") ?? metabolic[0];
    recs.push({ useCase: "Weight Management", recommended: best.name, reason: "FDA-approved with the strongest clinical evidence for weight loss." });
  }

  if (neuro.length >= 2) {
    const best = neuro.find((p) => p.slug === "selank") ?? neuro[0];
    recs.push({ useCase: "Cognitive Enhancement", recommended: best.name, reason: "Best anxiolytic + nootropic profile without sedation or dependency." });
  }

  // General recommendation for first-timers
  if (recs.length === 0) {
    const safest = [...peptides].sort((a, b) => getSafetyProfile(b) - getSafetyProfile(a));
    recs.push({
      useCase: "First-time user",
      recommended: safest[0].name,
      reason: "Highest safety profile and most research data among your selections.",
    });
  }

  return recs;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function PeptideComparePage() {
  const [selected, setSelected] = useState<Peptide[]>([]);
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filteredPeptides = useMemo(() => {
    if (!search) return MOCK_PEPTIDES;
    const q = search.toLowerCase();
    return MOCK_PEPTIDES.filter(
      (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q),
    );
  }, [search]);

  const togglePeptide = (peptide: Peptide) => {
    if (selected.find((p) => p.slug === peptide.slug)) {
      setSelected((prev) => prev.filter((p) => p.slug !== peptide.slug));
    } else if (selected.length < 3) {
      setSelected((prev) => [...prev, peptide]);
    }
  };

  const removePeptide = (slug: string) => {
    setSelected((prev) => prev.filter((p) => p.slug !== slug));
  };

  const radarData: RadarData[] = useMemo(() => {
    if (selected.length < 2) return [];
    return [
      { label: "Confidence", peptides: selected.map((p, i) => ({ name: p.name, value: getConfidence(p), color: RADAR_COLORS[i] })) },
      { label: "Popularity", peptides: selected.map((p, i) => ({ name: p.name, value: getPopularity(p), color: RADAR_COLORS[i] })) },
      { label: "Research", peptides: selected.map((p, i) => ({ name: p.name, value: getResearchDepth(p), color: RADAR_COLORS[i] })) },
      { label: "Safety", peptides: selected.map((p, i) => ({ name: p.name, value: getSafetyProfile(p), color: RADAR_COLORS[i] })) },
      { label: "Efficacy", peptides: selected.map((p, i) => ({ name: p.name, value: getEfficacy(p), color: RADAR_COLORS[i] })) },
    ];
  }, [selected]);

  const recommendations = useMemo(() => getRecommendations(selected), [selected]);

  const comparisonRows = useMemo(() => {
    if (selected.length < 2) return [];
    return [
      { label: "Category", values: selected.map((p) => p.category.replace(/-/g, " ")) },
      { label: "Half-Life", values: selected.map((p) => p.halfLife) },
      { label: "FDA Status", values: selected.map((p) => getFdaStatus(p)) },
      { label: "Primary Benefits", values: selected.map((p) => p.description.split(".")[0] + ".") },
      { label: "Side Effects", values: selected.map((p) => getSideEffects(p)) },
      { label: "Dosing Range", values: selected.map((p) => p.typicalDoseRange) },
      { label: "Route", values: selected.map((p) => p.route) },
      {
        label: "Evidence Lanes",
        values: selected.map((p) =>
          p.lanes.map((l) => LANE_CONFIG[l].label).join(", "),
        ),
      },
      { label: "Confidence Score", values: selected.map((p) => `${getConfidence(p)}%`) },
    ];
  }, [selected]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/tools">
          <button className="p-2 rounded-xl hover:bg-dc-surface text-dc-text-muted hover:text-dc-text transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
        </Link>
        <div>
          <p className="text-xs text-dc-text-muted">Tools</p>
          <h1 className="text-lg font-bold text-dc-text leading-none">Peptide Comparison</h1>
        </div>
      </div>

      {/* Compound Selector */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <CardTitle>Select Compounds (2-3)</CardTitle>
          <Badge variant={selected.length >= 2 ? "success" : "default"} size="sm">
            {selected.length}/3 selected
          </Badge>
        </div>

        {/* Selected chips */}
        {selected.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {selected.map((p, i) => (
              <button
                key={p.slug}
                onClick={() => removePeptide(p.slug)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors hover:opacity-80"
                style={{
                  color: RADAR_COLORS[i],
                  backgroundColor: `${RADAR_COLORS[i]}15`,
                  borderColor: `${RADAR_COLORS[i]}30`,
                }}
              >
                <LaneDots lanes={p.lanes} size="xs" />
                {p.name}
                <span className="ml-0.5 opacity-60">&times;</span>
              </button>
            ))}
          </div>
        )}

        {/* Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm bg-dc-surface border border-dc-border text-dc-text-muted hover:border-dc-accent/30 transition-all"
          >
            <span>{selected.length === 0 ? "Select compounds to compare..." : "Add another compound..."}</span>
            <ChevronDown className={clsx("w-4 h-4 transition-transform", dropdownOpen && "rotate-180")} />
          </button>

          {dropdownOpen && (
            <div className="absolute z-20 mt-1 w-full rounded-xl border border-dc-border bg-dc-bg shadow-2xl max-h-64 overflow-hidden">
              <div className="p-2 border-b border-dc-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-dc-text-muted" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search compounds..."
                    className="w-full pl-9 pr-4 py-2 rounded-lg text-sm text-dc-text bg-dc-surface border border-dc-border placeholder:text-dc-text-muted/40 focus:outline-none focus:border-dc-accent transition-all"
                    autoFocus
                  />
                </div>
              </div>
              <div className="overflow-y-auto max-h-48">
                {filteredPeptides.map((peptide) => {
                  const isSelected = selected.some((p) => p.slug === peptide.slug);
                  const isDisabled = selected.length >= 3 && !isSelected;
                  return (
                    <button
                      key={peptide.slug}
                      onClick={() => { togglePeptide(peptide); if (!isSelected) setSearch(""); }}
                      disabled={isDisabled}
                      className={clsx(
                        "w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors",
                        isSelected
                          ? "bg-dc-accent/8 text-dc-accent"
                          : isDisabled
                          ? "opacity-30 cursor-not-allowed"
                          : "text-dc-text hover:bg-dc-surface-alt/60",
                      )}
                    >
                      <div className={clsx(
                        "w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-all",
                        isSelected ? "bg-dc-accent border-dc-accent" : "border-dc-border",
                      )}>
                        {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <LaneDots lanes={peptide.lanes} size="xs" />
                      <span className="flex-1 truncate">{peptide.name}</span>
                      <span className="text-[10px] text-dc-text-muted capitalize">{peptide.category.replace(/-/g, " ")}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Radar Chart */}
      {selected.length >= 2 && (
        <Card>
          <CardTitle className="mb-4">Metrics Comparison</CardTitle>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <RadarChart data={radarData} />
            <div className="flex flex-col gap-2">
              {selected.map((p, i) => (
                <div key={p.slug} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: RADAR_COLORS[i] }} />
                  <span className="text-xs font-medium text-dc-text">{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Comparison Table */}
      {selected.length >= 2 && (
        <Card noPad>
          <div className="px-5 pt-5 pb-3">
            <CardTitle>Side-by-Side Comparison</CardTitle>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-dc-border">
                  <th className="text-left px-5 py-3 text-dc-text-muted font-medium uppercase tracking-wide text-[10px] w-36">Attribute</th>
                  {selected.map((p, i) => (
                    <th key={p.slug} className="text-left px-4 py-3 font-medium" style={{ color: RADAR_COLORS[i] }}>
                      <div className="flex items-center gap-1.5">
                        <LaneDots lanes={p.lanes} size="xs" />
                        <Link href={`/library/${p.slug}`} className="hover:underline flex items-center gap-1">
                          {p.name}
                          <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, ri) => (
                  <tr
                    key={row.label}
                    className={clsx(
                      "border-b border-dc-border/40",
                      ri % 2 === 0 ? "bg-transparent" : "bg-white/[0.01]",
                    )}
                  >
                    <td className="px-5 py-3 text-dc-text-muted font-medium whitespace-nowrap">{row.label}</td>
                    {row.values.map((val, vi) => (
                      <td key={vi} className="px-4 py-3 text-dc-text leading-relaxed">
                        {row.label === "FDA Status" ? (
                          <Badge
                            variant={val.includes("FDA Approved") ? "success" : val.includes("Russia") ? "warning" : "default"}
                            size="xs"
                          >
                            {val}
                          </Badge>
                        ) : row.label === "Evidence Lanes" ? (
                          <LaneDots lanes={selected[vi].lanes} size="xs" />
                        ) : row.label === "Confidence Score" ? (
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 rounded-full bg-white/5 overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: `${parseInt(val)}%`,
                                  backgroundColor: parseInt(val) >= 80 ? "#00ff88" : parseInt(val) >= 60 ? "#ffaa00" : "#ff4444",
                                }}
                              />
                            </div>
                            <span className="mono">{val}</span>
                          </div>
                        ) : row.label === "Route" ? (
                          <span className="capitalize">{val}</span>
                        ) : row.label === "Category" ? (
                          <span className="capitalize">{val}</span>
                        ) : (
                          val
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Which is Right for Me? */}
      {selected.length >= 2 && recommendations.length > 0 && (
        <Card>
          <CardTitle className="mb-4">Which is Right for Me?</CardTitle>
          <div className="space-y-3">
            {recommendations.map((rec) => (
              <div key={rec.useCase} className="flex items-start gap-3 p-3 rounded-xl bg-dc-surface/50 border border-dc-border/40">
                <div className="w-8 h-8 rounded-lg bg-dc-accent/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-dc-accent" />
                </div>
                <div>
                  <p className="text-xs font-medium text-dc-text mb-0.5">
                    For <span className="text-dc-accent">{rec.useCase}</span>: <span className="text-dc-neon-green">{rec.recommended}</span>
                  </p>
                  <p className="text-[11px] text-dc-text-muted leading-relaxed">{rec.reason}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-dc-text-faint mt-4 italic">
            These recommendations are for educational purposes only. Always consult a qualified healthcare provider before starting any peptide protocol.
          </p>
        </Card>
      )}

      {/* Empty State */}
      {selected.length < 2 && (
        <Card className="text-center py-12">
          <div className="w-12 h-12 rounded-2xl bg-dc-accent/10 flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6 text-dc-accent" />
          </div>
          <p className="text-sm font-medium text-dc-text mb-1">Select at least 2 compounds</p>
          <p className="text-xs text-dc-text-muted">
            Choose 2 to 3 peptides or compounds above to see a detailed side-by-side comparison with radar chart.
          </p>
        </Card>
      )}
    </div>
  );
}
