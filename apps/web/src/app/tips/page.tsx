"use client";

import { useState, useMemo } from "react";
import {
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/* ─── Types ─── */

type TipCategory = "Dosing" | "Storage" | "Safety" | "Technique" | "Protocol";

interface Tip {
  readonly id: number;
  readonly title: string;
  readonly content: string;
  readonly category: TipCategory;
}

/* ─── Data ─── */

const TIPS: readonly Tip[] = [
  { id: 1, title: "Rotate Injection Sites", content: "Rotate between at least 4-6 sites to prevent tissue buildup and ensure consistent absorption.", category: "Technique" },
  { id: 2, title: "Never Shake Your Vial", content: "Always swirl gently when reconstituting. Shaking denatures the peptide and reduces potency.", category: "Technique" },
  { id: 3, title: "Store Reconstituted Peptides Cold", content: "Once reconstituted, store vials in the refrigerator (2-8\u00B0C). Most peptides remain stable for 3-4 weeks.", category: "Storage" },
  { id: 4, title: "Pin on an Empty Stomach", content: "Most GH-releasing peptides work best on an empty stomach. Wait 30 min before eating after injection.", category: "Dosing" },
  { id: 5, title: "Start Low, Go Slow", content: "Always begin at the lowest recommended dose. Titrate up over 1-2 weeks to assess tolerance.", category: "Safety" },
  { id: 6, title: "Use Insulin Syringes", content: "Use 29-31 gauge insulin syringes for SubQ injections. They minimize pain and tissue damage.", category: "Technique" },
  { id: 7, title: "Morning vs. Evening Dosing", content: "GH peptides are often best taken before bed to amplify natural GH pulses during sleep.", category: "Dosing" },
  { id: 8, title: "Check Vendor COAs", content: "Always verify Certificate of Analysis (HPLC purity report) before using any peptide from a research vendor.", category: "Safety" },
  { id: 9, title: "Bacteriostatic Water Shelf Life", content: "BAC water is good for ~28 days after first puncture. Mark the date on your vial.", category: "Storage" },
  { id: 10, title: "Track Everything", content: "Log every dose, site, and how you feel. Patterns emerge after 2-3 weeks of consistent tracking.", category: "Protocol" },
  { id: 11, title: "BPC-157 Near the Injury", content: "For localized healing, inject BPC-157 as close to the injury site as practical for enhanced local effects.", category: "Technique" },
  { id: 12, title: "Don't Mix Oil and Water", content: "Never mix oil-based compounds (testosterone) with water-based peptides in the same syringe.", category: "Safety" },
  { id: 13, title: "Reconstitution Math", content: "For a 5mg vial + 2mL BAC water: each 0.1mL = 250mcg. Use our calculator for exact measurements.", category: "Dosing" },
  { id: 14, title: "Peptide Stacking Rules", content: "When stacking GH peptides, use a GHRH + GHRP for synergistic effects (e.g., CJC-1295 + Ipamorelin).", category: "Protocol" },
  { id: 15, title: "Air Bubbles Are OK (SubQ)", content: "Small air bubbles in a SubQ injection are harmless. They just waste a tiny amount of dose.", category: "Safety" },
  { id: 16, title: "Keep a Dose Journal", content: "Note time of injection, how you felt 1hr later, sleep quality that night. This data is gold.", category: "Protocol" },
  { id: 17, title: "Alcohol Swab Every Time", content: "Always clean the vial top and injection site with an alcohol swab before drawing or injecting.", category: "Technique" },
  { id: 18, title: "Understand Half-Life", content: "A peptide\u2019s half-life determines how often you need to dose. Short half-life = more frequent dosing.", category: "Dosing" },
  { id: 19, title: "Freeze Unreconstituted Vials", content: "Lyophilized peptides can be stored in the freezer for extended shelf life (1+ years).", category: "Storage" },
  { id: 20, title: "MK-677 vs Injectables", content: "MK-677 (Ibutamoren) is an oral GH secretagogue. Great for those who dislike injections but may increase appetite.", category: "Protocol" },
  { id: 21, title: "Semaglutide Titration", content: "Start at 0.25mg/week for 4 weeks, then increase to 0.5mg. Rushing the titration causes severe nausea.", category: "Dosing" },
  { id: 22, title: "Protect Peptides from Light", content: "Store vials away from direct sunlight. UV light degrades peptides. Use amber vials or store in a dark box.", category: "Storage" },
  { id: 23, title: "Clean Hands Always", content: "Wash hands thoroughly before handling vials and syringes. Contamination is the #1 avoidable risk.", category: "Safety" },
  { id: 24, title: "Take Rest Days", content: "Most peptide protocols include periodic breaks (4 weeks on, 1 week off) to maintain receptor sensitivity.", category: "Protocol" },
  { id: 25, title: "Monitor Blood Work", content: "Get baseline labs before starting any protocol. Check again at 6-8 weeks. Key markers: IGF-1, CMP, CBC, hormones.", category: "Safety" },
  { id: 26, title: "SubQ Injection Angle", content: "Insert the needle at a 45-90\u00B0 angle depending on body fat percentage. Pinch the skin for thin areas.", category: "Technique" },
  { id: 27, title: "Avoid Mixing Peptides in One Vial", content: "Unless you know they\u2019re compatible, reconstitute each peptide in its own vial to prevent degradation.", category: "Storage" },
  { id: 28, title: "Document Your Protocol", content: "Write down your full protocol: compounds, doses, frequencies, timing, and goals. Use our Protocol Builder.", category: "Protocol" },
  { id: 29, title: "Watch for Redness", content: "Some injection site redness is normal. But spreading redness, warmth, or pain may indicate infection \u2014 seek medical help.", category: "Safety" },
  { id: 30, title: "Consistency Is Key", content: "Peptides work best with consistent timing. Try to inject at the same time each day for optimal results.", category: "Dosing" },
] as const;

/* ─── Helpers ─── */

const CATEGORY_CONFIG: Record<TipCategory, { color: string; variant: "success" | "warning" | "danger" | "clinical" | "expert" }> = {
  Dosing:    { color: "#ff6b35", variant: "expert" },
  Storage:   { color: "#00d4ff", variant: "clinical" },
  Safety:    { color: "#ff4444", variant: "danger" },
  Technique: { color: "#00ff88", variant: "success" },
  Protocol:  { color: "#ffaa00", variant: "warning" },
};

function getTodayIndex(): number {
  return new Date().getDate() % TIPS.length;
}

/* ─── Tip Card (Grid) ─── */

function TipCard({ tip, isExpanded, onToggle }: {
  readonly tip: Tip;
  readonly isExpanded: boolean;
  readonly onToggle: () => void;
}) {
  const cfg = CATEGORY_CONFIG[tip.category];

  return (
    <Card hoverable className="cursor-pointer" onClick={onToggle}>
      <div className="flex items-start gap-3">
        <span
          className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold"
          style={{ backgroundColor: `${cfg.color}18`, color: cfg.color }}
        >
          {tip.id}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <CardTitle className="text-sm">{tip.title}</CardTitle>
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5 text-dc-text-muted flex-shrink-0 mt-0.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-dc-text-muted flex-shrink-0 mt-0.5" />
            )}
          </div>
          <Badge variant={cfg.variant} size="xs">{tip.category}</Badge>
          {isExpanded && (
            <p className="text-sm text-dc-text-muted mt-3 leading-relaxed animate-fade-in">
              {tip.content}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

/* ─── Page ─── */

export default function TipsPage() {
  const [currentIndex, setCurrentIndex] = useState(getTodayIndex);
  const [expandedIds, setExpandedIds] = useState<ReadonlySet<number>>(new Set());

  const currentTip = TIPS[currentIndex];
  const cfg = CATEGORY_CONFIG[currentTip.category];

  const toggleExpand = useMemo(
    () => (id: number) => {
      setExpandedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    },
    [],
  );

  const goNext = () => setCurrentIndex((i) => (i + 1) % TIPS.length);
  const goPrev = () => setCurrentIndex((i) => (i - 1 + TIPS.length) % TIPS.length);

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, rgba(255,170,0,0.15) 0%, rgba(255,107,53,0.08) 100%)",
          }}
        >
          <Lightbulb className="w-5.5 h-5.5 text-dc-warning" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-dc-text tracking-tight">Daily Tips</h1>
          <p className="text-sm text-dc-text-muted">Quick peptide tips and best practices</p>
        </div>
      </div>

      {/* Today's Tip — Featured */}
      <Card
        className="relative overflow-hidden"
        glowColor="accent"
      >
        {/* Accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
          style={{ backgroundColor: cfg.color }}
        />

        <div className="pt-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Lightbulb className="w-5 h-5" style={{ color: cfg.color }} />
              <span className="text-xs font-semibold text-dc-text uppercase tracking-wider">
                Today&apos;s Tip
              </span>
            </div>
            <Badge variant={cfg.variant} size="sm">
              #{currentTip.id} of {TIPS.length}
            </Badge>
          </div>

          <CardTitle className="text-lg mb-3">{currentTip.title}</CardTitle>
          <p className="text-sm text-dc-text-muted leading-relaxed mb-4">
            {currentTip.content}
          </p>

          <div className="flex items-center justify-between">
            <Badge variant={cfg.variant} size="md">{currentTip.category}</Badge>

            <div className="flex items-center gap-2">
              <button
                onClick={goPrev}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-dc-surface border border-dc-border hover:border-dc-accent/40 transition-colors"
                aria-label="Previous tip"
              >
                <ChevronLeft className="w-4 h-4 text-dc-text-muted" />
              </button>
              <span className="text-xs text-dc-text-faint tabular-nums min-w-[3rem] text-center">
                {currentIndex + 1} / {TIPS.length}
              </span>
              <button
                onClick={goNext}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-dc-surface border border-dc-border hover:border-dc-accent/40 transition-colors"
                aria-label="Next tip"
              >
                <ChevronRight className="w-4 h-4 text-dc-text-muted" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* All Tips Header */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-dc-text uppercase tracking-wider">
          All Tips
        </span>
        <span className="text-xs text-dc-text-faint">({TIPS.length})</span>
      </div>

      {/* Tips Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {TIPS.map((tip) => (
          <TipCard
            key={tip.id}
            tip={tip}
            isExpanded={expandedIds.has(tip.id)}
            onToggle={() => toggleExpand(tip.id)}
          />
        ))}
      </div>
    </div>
  );
}
