"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Beaker, Search, X, Star, DollarSign, Clock, Repeat } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_BLENDS } from "@/lib/mock-data";
import type { PeptideBlend } from "@/types";

// ── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  "All",
  "Healing",
  "Growth Hormone",
  "Metabolic",
  "Sexual Health",
  "Sleep",
  "Immune",
  "Longevity",
] as const;

const AVAILABILITY_CONFIG: Record<
  PeptideBlend["availability"],
  { readonly label: string; readonly variant: "success" | "warning" | "danger" }
> = {
  "widely-available": { label: "Widely Available", variant: "success" },
  limited:            { label: "Limited", variant: "warning" },
  "custom-order":     { label: "Custom Order", variant: "danger" },
} as const;

// ── Helpers ──────────────────────────────────────────────────────────────────

function renderStars(count: number) {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className="w-3 h-3"
      style={{
        color: i < count ? "#ff6b35" : "#2a2a3e",
        fill: i < count ? "#ff6b35" : "transparent",
      }}
    />
  ));
}

// ── Component ────────────────────────────────────────────────────────────────

export default function BlendsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return MOCK_BLENDS.filter((b) => {
      const matchCategory =
        activeCategory === "All" || b.category === activeCategory;
      const matchSearch =
        q === "" ||
        b.name.toLowerCase().includes(q) ||
        b.components.some((c) => c.peptideName.toLowerCase().includes(q)) ||
        b.description.toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });
  }, [search, activeCategory]);

  const clearAll = () => {
    setSearch("");
    setActiveCategory("All");
  };

  const hasFilters = search !== "" || activeCategory !== "All";

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Beaker className="w-5 h-5 text-[#b366ff]" />
            <h2 className="text-sm font-medium text-[#b366ff]">
              Peptide Blends
            </h2>
          </div>
          <p className="text-dc-text-muted text-sm">
            Pre-mixed compound combinations for streamlined dosing
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasFilters && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-dc-text-muted hover:text-dc-text bg-dc-surface border border-dc-border transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
          <span className="text-xs text-dc-text-muted">
            {filtered.length} of {MOCK_BLENDS.length} blends
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dc-text-muted pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search blends or components — BPC-157, Ipamorelin, healing..."
          className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm text-dc-text bg-dc-surface border border-dc-border placeholder:text-dc-text-muted/40 focus:outline-none focus:border-dc-accent focus:ring-2 focus:ring-dc-accent/15 transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-dc-text-muted hover:text-dc-text"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Chips */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full border text-xs font-medium transition-all ${
              activeCategory === cat
                ? "bg-[#b366ff]/10 text-[#b366ff] border-[#b366ff]/30"
                : "bg-transparent text-dc-text-muted border-dc-border hover:border-[#b366ff]/20 hover:text-dc-text"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Blend Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((blend) => (
            <BlendCard key={blend.id} blend={blend} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Beaker className="w-12 h-12 text-dc-text-muted mx-auto mb-4 opacity-30" />
          <h3 className="text-base font-medium text-dc-text mb-2">
            No blends found
          </h3>
          <p className="text-sm text-dc-text-muted">
            Try adjusting your search or category filter.
          </p>
          <button
            onClick={clearAll}
            className="mt-4 text-sm text-dc-accent hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}

// ── Blend Card ───────────────────────────────────────────────────────────────

function BlendCard({ blend }: { readonly blend: PeptideBlend }) {
  const avail = AVAILABILITY_CONFIG[blend.availability];

  return (
    <Card hoverable className="flex flex-col gap-4">
      {/* Top row: name + badges */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-dc-text tracking-tight leading-snug">
            {blend.name}
          </h3>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Badge variant="neutral" size="xs">
            {blend.category}
          </Badge>
          <Badge variant={avail.variant} size="xs">
            {avail.label}
          </Badge>
        </div>
      </div>

      {/* Component pills */}
      <div className="flex flex-wrap gap-1.5">
        {blend.components.map((comp) => (
          <Link
            key={comp.peptideSlug}
            href={`/library/${comp.peptideSlug}`}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-dc-neon-cyan/8 text-dc-neon-cyan border border-dc-neon-cyan/20 hover:bg-dc-neon-cyan/15 hover:border-dc-neon-cyan/40 transition-all"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-dc-neon-cyan" />
            {comp.peptideName}
            <span className="text-dc-text-faint">{comp.ratio}</span>
          </Link>
        ))}
      </div>

      {/* Description */}
      <p className="text-xs text-dc-text-muted leading-relaxed line-clamp-2">
        {blend.description}
      </p>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-dc-text-muted">
        <span className="inline-flex items-center gap-1">
          <Clock className="w-3 h-3 text-dc-text-faint" />
          {blend.typicalDose}
        </span>
        <span className="inline-flex items-center gap-1">
          <Repeat className="w-3 h-3 text-dc-text-faint" />
          {blend.frequency}
        </span>
        <span className="inline-flex items-center gap-1">
          <DollarSign className="w-3 h-3 text-dc-text-faint" />
          {blend.estimatedMonthlyCost}/mo
        </span>
      </div>

      {/* Footer: stars */}
      <div className="flex items-center gap-1">
        {renderStars(blend.popularity)}
        <span className="ml-1 text-[10px] text-dc-text-faint">
          Popularity
        </span>
      </div>
    </Card>
  );
}
