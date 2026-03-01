"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Check,
  AlertTriangle,
  Zap,
  Minus,
  Clock,
  Shield,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LaneDots } from "@/components/peptide/lane-badge";
import { MOCK_PEPTIDES } from "@/lib/mock-data";
import type { Peptide } from "@/types";
import clsx from "clsx";

// ── Interaction Types ────────────────────────────────────────────────────────

type InteractionSeverity = "synergy" | "neutral" | "caution" | "conflict";

interface Interaction {
  readonly a: string;
  readonly b: string;
  readonly severity: InteractionSeverity;
  readonly description: string;
  readonly timing: string;
}

const SEVERITY_CONFIG: Record<InteractionSeverity, { label: string; color: string; bg: string; icon: typeof Zap }> = {
  synergy:  { label: "Synergy",  color: "#00ff88", bg: "rgba(0,255,136,0.08)",  icon: Zap },
  neutral:  { label: "Neutral",  color: "#ffaa00", bg: "rgba(255,170,0,0.08)",  icon: Minus },
  caution:  { label: "Caution",  color: "#ffaa00", bg: "rgba(255,170,0,0.08)",  icon: AlertTriangle },
  conflict: { label: "Conflict", color: "#ff4444", bg: "rgba(255,68,68,0.08)",  icon: AlertTriangle },
};

// ── Comprehensive Interaction Database ───────────────────────────────────────

const INTERACTION_DB: readonly Interaction[] = [
  // BPC-157 combos
  { a: "bpc-157", b: "tb-500", severity: "synergy", description: "Gold standard healing stack. BPC-157 upregulates GH receptors while TB-500 promotes systemic cell migration, creating powerful tissue repair synergy.", timing: "Can be taken simultaneously; inject at same time or split AM/PM." },
  { a: "bpc-157", b: "ghk-cu", severity: "synergy", description: "Complementary healing pathways. BPC-157 repairs tissue while GHK-Cu enhances collagen synthesis and gene expression for regeneration.", timing: "BPC-157 subcutaneous + GHK-Cu topical or subcutaneous at different sites." },
  { a: "bpc-157", b: "cjc-1295-ipamorelin", severity: "synergy", description: "GH peptides enhance BPC-157 healing via elevated growth hormone. BPC-157 upregulates GH receptors for improved response.", timing: "BPC-157 AM/PM; CJC/Ipa at bedtime for nocturnal GH pulse." },
  { a: "bpc-157", b: "semaglutide", severity: "neutral", description: "No known interaction. BPC-157 may help protect GI mucosa from semaglutide-related GI side effects.", timing: "Can be taken on the same day; no timing restrictions." },
  { a: "bpc-157", b: "melanotan-ii", severity: "caution", description: "Both promote angiogenesis. Combined angiogenic effect may be excessive in certain individuals.", timing: "Consider separating by 4+ hours. Monitor for unusual skin changes." },
  { a: "bpc-157", b: "testosterone-cypionate", severity: "synergy", description: "BPC-157 can accelerate healing of injection site tissue and may enhance recovery from training enabled by TRT.", timing: "No timing conflicts. BPC-157 daily; TRT on usual schedule." },
  { a: "bpc-157", b: "ll-37", severity: "synergy", description: "Dual healing + antimicrobial synergy. BPC-157 repairs while LL-37 provides immune defense at the wound site.", timing: "Can be co-administered or within same injection session." },
  { a: "bpc-157", b: "kpv", severity: "synergy", description: "Both support gut healing through different mechanisms. BPC-157 repairs mucosal tissue; KPV reduces inflammation.", timing: "BPC-157 subcutaneous + KPV can be oral or subcutaneous. Same time OK." },

  // TB-500 combos
  { a: "tb-500", b: "ghk-cu", severity: "synergy", description: "Triple healing stack component. TB-500 cell migration + GHK-Cu collagen synthesis produce comprehensive tissue remodeling.", timing: "TB-500 2x/week; GHK-Cu daily topical or 3x/week injectable." },
  { a: "tb-500", b: "cjc-1295-ipamorelin", severity: "synergy", description: "GH elevation from CJC/Ipa amplifies TB-500 tissue repair. Excellent recovery stack for athletes.", timing: "TB-500 2x/week; CJC/Ipa at bedtime daily." },
  { a: "tb-500", b: "melanotan-ii", severity: "caution", description: "Both promote angiogenesis and cell migration. Combined use may increase risk in individuals with cancer history.", timing: "Separate administration by 6+ hours if combining." },

  // Testosterone combos
  { a: "testosterone-cypionate", b: "anastrozole", severity: "synergy", description: "AI manages estradiol on TRT. Prevents gynecomastia, water retention, and mood issues from excess aromatization.", timing: "Anastrozole on injection days or day after. Target E2 20-35 pg/mL." },
  { a: "testosterone-cypionate", b: "hcg", severity: "synergy", description: "HCG preserves fertility and testicular volume during TRT. Maintains intratesticular testosterone at ~25% of baseline.", timing: "HCG 250-500 IU EOD or 2-3x/week. Can inject same day as TRT." },
  { a: "testosterone-cypionate", b: "enclomiphene", severity: "conflict", description: "Enclomiphene stimulates endogenous testosterone production. Combining with exogenous TRT defeats its purpose entirely.", timing: "Do not combine. Use one or the other, not both." },
  { a: "testosterone-cypionate", b: "dhea", severity: "synergy", description: "DHEA replaces suppressed adrenal precursors during TRT. Supports neurosteroid production and overall hormone balance.", timing: "DHEA 25-50mg in the morning. No timing conflict with TRT injections." },
  { a: "testosterone-cypionate", b: "pregnenolone", severity: "synergy", description: "Pregnenolone is suppressed on TRT. Supplementation restores neurosteroid levels and supports cognitive function.", timing: "Pregnenolone 50-100mg morning. Independent of TRT injection timing." },
  { a: "testosterone-cypionate", b: "cjc-1295-ipamorelin", severity: "synergy", description: "TRT + GH peptides create powerful body recomposition synergy. Enhanced muscle protein synthesis and fat loss.", timing: "TRT on schedule; CJC/Ipa at bedtime. No conflicts." },
  { a: "testosterone-cypionate", b: "semaglutide", severity: "neutral", description: "No direct pharmacological interaction. Both benefit body composition through different mechanisms.", timing: "Semaglutide weekly; TRT on usual schedule. Can inject same day different sites." },
  { a: "testosterone-cypionate", b: "pt-141", severity: "neutral", description: "Both can benefit sexual function through different pathways. TRT restores hormones; PT-141 acts centrally.", timing: "PT-141 45 min before activity. TRT on usual schedule." },

  { a: "testosterone-enanthate", b: "anastrozole", severity: "synergy", description: "Same AI management as with cypionate. Manages aromatization on TRT.", timing: "Anastrozole on injection days. Monitor estradiol levels." },
  { a: "testosterone-enanthate", b: "hcg", severity: "synergy", description: "HCG preserves fertility during TRT with enanthate, identical benefit as with cypionate.", timing: "HCG 250-500 IU 2-3x/week alongside TRT." },

  // GH Secretagogues interactions
  { a: "cjc-1295-ipamorelin", b: "semaglutide", severity: "caution", description: "Monitor insulin sensitivity. GH peptides can impair glucose tolerance while GLP-1 agonists improve it. Net effect varies.", timing: "CJC/Ipa at bedtime; semaglutide weekly. Monitor fasting glucose monthly." },
  { a: "cjc-1295-ipamorelin", b: "mk-677", severity: "caution", description: "Receptor saturation risk. Both stimulate GH release through overlapping pathways. Combined use may cause excessive GH/IGF-1 and insulin resistance.", timing: "If combining, use lower doses of each. Monitor IGF-1 and fasting glucose." },
  { a: "cjc-1295-ipamorelin", b: "ghrp-6", severity: "caution", description: "GHRP-6 + CJC-1295 is synergistic but adds significant hunger from ghrelin activation. Ipamorelin already paired with CJC.", timing: "Avoid triple-stacking. Choose CJC/Ipa OR CJC + GHRP-6, not all three." },
  { a: "cjc-1295-ipamorelin", b: "tesamorelin", severity: "caution", description: "Both are GHRH pathway agonists. Combining produces redundant stimulation with diminishing returns and increased side effects.", timing: "Choose one GHRH analog. Do not stack CJC-1295 with Tesamorelin." },
  { a: "cjc-1295-ipamorelin", b: "sermorelin", severity: "caution", description: "Both are GHRH analogs competing for the same receptor. Redundant mechanism with no added benefit.", timing: "Choose one: CJC/Ipa OR Sermorelin. Do not combine." },
  { a: "mk-677", b: "ghrp-6", severity: "caution", description: "Both activate ghrelin receptors. Combined use causes excessive hunger, water retention, and potential insulin resistance.", timing: "Do not combine. Choose one GH secretagogue from each pathway." },
  { a: "mk-677", b: "semaglutide", severity: "neutral", description: "Opposing appetite effects may partially cancel out. Semaglutide suppresses appetite; MK-677 increases it. Metabolic monitoring advised.", timing: "MK-677 at bedtime; semaglutide weekly. Monitor weight and glucose." },
  { a: "tesamorelin", b: "sermorelin", severity: "caution", description: "Redundant GHRH analogs. Tesamorelin is more potent; adding Sermorelin provides no additional benefit.", timing: "Use Tesamorelin alone. Do not stack with Sermorelin." },

  // Semaglutide combos
  { a: "semaglutide", b: "mots-c", severity: "synergy", description: "Dual metabolic enhancement. Semaglutide via GLP-1; MOTS-c via AMPK/mitochondria. Synergistic fat loss and insulin sensitization.", timing: "Semaglutide weekly; MOTS-c 2-3x/week. No timing conflicts." },
  { a: "semaglutide", b: "aod-9604", severity: "neutral", description: "Both target fat loss through different mechanisms. AOD-9604 fragments GH for lipolysis; semaglutide is GLP-1 based.", timing: "Can be used concurrently. AOD-9604 morning fasted; semaglutide weekly." },

  // Melanotan II
  { a: "melanotan-ii", b: "pt-141", severity: "conflict", description: "Both are melanocortin receptor agonists. Combining causes receptor overstimulation, nausea, and dangerous blood pressure changes.", timing: "Never combine. PT-141 is the refined version for sexual function only." },
  { a: "melanotan-ii", b: "semaglutide", severity: "caution", description: "Both can cause significant nausea. Combined GI distress may be severe. Melanotan II also affects appetite regulation.", timing: "Separate by 24+ hours. Start each at lowest dose before considering combining." },
  { a: "melanotan-ii", b: "cjc-1295-ipamorelin", severity: "caution", description: "Melanotan II has broad melanocortin activity. Use caution combining with any peptide stack due to cardiovascular and GI effects.", timing: "Use Melanotan II at low doses. Monitor blood pressure." },
  { a: "melanotan-ii", b: "testosterone-cypionate", severity: "caution", description: "Melanotan II can increase libido on top of TRT. Monitor blood pressure as both can elevate hematocrit and cardiovascular strain.", timing: "Use lowest effective MT-II dose. Regular cardiovascular monitoring." },

  // Neuroprotective combos
  { a: "selank", b: "semax", severity: "synergy", description: "Classic Russian nootropic stack. Selank provides anxiolytic GABA modulation while Semax enhances BDNF and cognitive performance.", timing: "Both intranasal. Selank AM for calm focus; Semax midday for cognitive boost." },
  { a: "selank", b: "dihexa", severity: "neutral", description: "Both support cognitive function through different mechanisms. No known interaction.", timing: "Selank intranasal; Dihexa intranasal or subcutaneous. Can use same day." },

  // Longevity combos
  { a: "epithalon", b: "nad-plus", severity: "synergy", description: "Complementary longevity stack. Epithalon extends telomeres; NAD+ restores cellular energy and DNA repair pathways.", timing: "Epithalon 10-day courses 2x/year; NAD+ ongoing supplementation." },
  { a: "epithalon", b: "ss-31", severity: "synergy", description: "Telomere protection + mitochondrial optimization. Both target fundamental aging mechanisms through different pathways.", timing: "Can be used concurrently during Epithalon courses." },
  { a: "nad-plus", b: "ss-31", severity: "synergy", description: "Dual mitochondrial support. NAD+ fuels electron transport chain; SS-31 stabilizes cardiolipin in inner mitochondrial membrane.", timing: "Both can be taken daily. No timing conflicts." },

  // Immune combos
  { a: "thymosin-alpha-1", b: "ll-37", severity: "synergy", description: "Comprehensive immune support. Thymosin Alpha-1 modulates adaptive immunity; LL-37 provides innate antimicrobial defense.", timing: "Can be co-administered. Both subcutaneous." },
  { a: "thymosin-alpha-1", b: "kpv", severity: "synergy", description: "Immune modulation + anti-inflammatory synergy. TA1 boosts immune surveillance; KPV reduces inflammatory cascades.", timing: "Both subcutaneous. Can inject same session at different sites." },

  // Sleep
  { a: "dsip", b: "cjc-1295-ipamorelin", severity: "synergy", description: "DSIP enhances deep sleep while CJC/Ipa amplifies nocturnal GH pulse. Synergistic for recovery and body composition.", timing: "Both at bedtime. DSIP 30 min before bed; CJC/Ipa immediately before." },
  { a: "dsip", b: "selank", severity: "synergy", description: "DSIP promotes delta wave sleep; Selank reduces anxiety that impairs sleep onset. Complementary mechanisms.", timing: "Selank in the evening; DSIP at bedtime." },

  // Fasting synergy
  { a: "cjc-1295-ipamorelin", b: "epithalon", severity: "neutral", description: "No direct interaction. Both can be part of a comprehensive anti-aging protocol.", timing: "CJC/Ipa nightly; Epithalon during dedicated 10-day courses." },

  // HCG + AI
  { a: "hcg", b: "anastrozole", severity: "neutral", description: "HCG can increase estradiol production. AI may be needed to manage HCG-induced estrogen elevation on TRT.", timing: "Monitor estradiol. Adjust AI dose based on labs, not symptoms alone." },

  // Kisspeptin
  { a: "kisspeptin-10", b: "hcg", severity: "synergy", description: "Both stimulate the HPG axis through different points. Kisspeptin at hypothalamus; HCG mimics LH at testes.", timing: "Can be used together for fertility optimization. Kisspeptin daily; HCG 2-3x/week." },
  { a: "kisspeptin-10", b: "testosterone-cypionate", severity: "caution", description: "Exogenous testosterone suppresses GnRH. Kisspeptin stimulates GnRH release. Conflicting mechanisms.", timing: "Generally not combined. Use kisspeptin as TRT alternative, not adjunct." },
] as const;

// ── Helper Functions ─────────────────────────────────────────────────────────

function findInteraction(slugA: string, slugB: string): Interaction | null {
  return INTERACTION_DB.find(
    (i) => (i.a === slugA && i.b === slugB) || (i.a === slugB && i.b === slugA),
  ) ?? null;
}

function computeSafetyScore(selected: readonly Peptide[]): { score: number; label: string; color: string } {
  if (selected.length < 2) return { score: 100, label: "Select compounds", color: "#666" };

  const interactions: Interaction[] = [];
  for (let i = 0; i < selected.length; i++) {
    for (let j = i + 1; j < selected.length; j++) {
      const found = findInteraction(selected[i].slug, selected[j].slug);
      if (found) interactions.push(found);
    }
  }

  if (interactions.length === 0) return { score: 85, label: "No known interactions", color: "#ffaa00" };

  const hasConflict = interactions.some((i) => i.severity === "conflict");
  if (hasConflict) return { score: 25, label: "Conflict detected", color: "#ff4444" };

  const cautionCount = interactions.filter((i) => i.severity === "caution").length;
  const synergyCount = interactions.filter((i) => i.severity === "synergy").length;

  if (cautionCount >= 3) return { score: 40, label: "Multiple cautions", color: "#ff4444" };
  if (cautionCount >= 2) return { score: 55, label: "Use caution", color: "#ffaa00" };
  if (cautionCount === 1 && synergyCount > 0) return { score: 70, label: "Mostly safe", color: "#ffaa00" };
  if (cautionCount === 1) return { score: 65, label: "Minor caution", color: "#ffaa00" };
  if (synergyCount > 0) return { score: 95, label: "Strong synergy", color: "#00ff88" };

  return { score: 80, label: "Appears safe", color: "#00ff88" };
}

// ── Component ────────────────────────────────────────────────────────────────

export default function InteractionCheckerPage() {
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
    } else if (selected.length < 5) {
      setSelected((prev) => [...prev, peptide]);
    }
  };

  const removePeptide = (slug: string) => {
    setSelected((prev) => prev.filter((p) => p.slug !== slug));
  };

  const safetyScore = useMemo(() => computeSafetyScore(selected), [selected]);

  const interactionMatrix = useMemo(() => {
    const results: { a: Peptide; b: Peptide; interaction: Interaction | null }[] = [];
    for (let i = 0; i < selected.length; i++) {
      for (let j = i + 1; j < selected.length; j++) {
        results.push({
          a: selected[i],
          b: selected[j],
          interaction: findInteraction(selected[i].slug, selected[j].slug),
        });
      }
    }
    return results;
  }, [selected]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/tools">
          <button className="p-2 rounded-xl hover:bg-dc-surface text-dc-text-muted hover:text-dc-text transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
        </Link>
        <div>
          <p className="text-xs text-dc-text-muted">Tools</p>
          <h1 className="text-lg font-bold text-dc-text leading-none">Interaction Checker</h1>
        </div>
      </div>

      {/* Compound Selector */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <CardTitle>Select Compounds (2-5)</CardTitle>
          <Badge variant={selected.length >= 2 ? "success" : "default"} size="sm">
            {selected.length}/5 selected
          </Badge>
        </div>

        {/* Selected chips */}
        {selected.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {selected.map((p) => (
              <button
                key={p.slug}
                onClick={() => removePeptide(p.slug)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-dc-accent/10 text-dc-accent border border-dc-accent/30 hover:bg-dc-accent/20 transition-colors"
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
            <span>{selected.length === 0 ? "Select compounds to check interactions..." : "Add another compound..."}</span>
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
                  const isDisabled = selected.length >= 5 && !isSelected;
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

      {/* Safety Score */}
      {selected.length >= 2 && (
        <Card>
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 flex-shrink-0">
              <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={safetyScore.color}
                  strokeWidth="3"
                  strokeDasharray={`${safetyScore.score}, 100`}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-dc-text">{safetyScore.score}</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4" style={{ color: safetyScore.color }} />
                <span className="text-sm font-semibold text-dc-text">Overall Safety Score</span>
              </div>
              <p className="text-xs font-medium" style={{ color: safetyScore.color }}>
                {safetyScore.label}
              </p>
              <p className="text-[10px] text-dc-text-muted mt-1">
                Based on {interactionMatrix.length} pairwise interaction{interactionMatrix.length !== 1 ? "s" : ""} analyzed
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Interaction Matrix */}
      {selected.length >= 2 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-dc-text">Interaction Matrix</h2>
          {interactionMatrix.map(({ a, b, interaction }) => {
            const config = interaction
              ? SEVERITY_CONFIG[interaction.severity]
              : SEVERITY_CONFIG.neutral;
            const Icon = config.icon;
            return (
              <Card key={`${a.slug}-${b.slug}`}>
                {/* Header row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <LaneDots lanes={a.lanes} size="xs" />
                      <span className="text-sm font-medium text-dc-text">{a.name}</span>
                    </div>
                    <span className="text-dc-text-muted text-xs">&times;</span>
                    <div className="flex items-center gap-1.5">
                      <LaneDots lanes={b.lanes} size="xs" />
                      <span className="text-sm font-medium text-dc-text">{b.name}</span>
                    </div>
                  </div>
                  <Badge
                    size="sm"
                    className="border"
                    style={{
                      color: config.color,
                      backgroundColor: config.bg,
                      borderColor: `${config.color}30`,
                    }}
                  >
                    <Icon className="w-3 h-3 mr-1" />
                    {config.label}
                  </Badge>
                </div>

                {interaction ? (
                  <div className="space-y-2">
                    <p className="text-xs text-dc-text-muted leading-relaxed">{interaction.description}</p>
                    <div className="flex items-start gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
                      <Clock className="w-3.5 h-3.5 text-dc-text-muted flex-shrink-0 mt-0.5" />
                      <p className="text-[11px] text-dc-text-muted">{interaction.timing}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-dc-text-muted italic">
                    No documented interaction data available for this combination. Exercise standard caution.
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Add to Protocol Builder CTA */}
      {selected.length >= 2 && (
        <div className="flex justify-center pt-2">
          <Link href="/protocols/builder">
            <Button variant="primary" className="gap-2">
              <ArrowRight className="w-4 h-4" />
              Add to Protocol Builder
            </Button>
          </Link>
        </div>
      )}

      {/* Empty State */}
      {selected.length < 2 && (
        <Card className="text-center py-12">
          <div className="w-12 h-12 rounded-2xl bg-dc-accent/10 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-dc-accent" />
          </div>
          <p className="text-sm font-medium text-dc-text mb-1">Select at least 2 compounds</p>
          <p className="text-xs text-dc-text-muted">
            Choose 2 to 5 peptides or compounds above to check for interactions, synergies, and timing recommendations.
          </p>
        </Card>
      )}
    </div>
  );
}
