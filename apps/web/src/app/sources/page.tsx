"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Star,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Package,
  Truck,
  Shield,
  Info,
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_VENDORS, MOCK_PEPTIDE_SOURCES, MOCK_PEPTIDES } from "@/lib/mock-data";
import type { VendorType, PricingTier } from "@/types";
import clsx from "clsx";

// ── Constants ────────────────────────────────────────────────────────────────

const VENDOR_TYPE_CONFIG: Record<VendorType, { label: string; color: string }> = {
  pharmacy:   { label: "Pharmacy",    color: "#00d4ff" },
  research:   { label: "Research",    color: "#b366ff" },
  telehealth: { label: "Telehealth",  color: "#00ff88" },
  supplement: { label: "Supplement",  color: "#ffaa00" },
};

const PRICING_CONFIG: Record<PricingTier, { label: string; color: string }> = {
  budget:  { label: "Budget",  color: "#00ff88" },
  mid:     { label: "Mid",     color: "#ffaa00" },
  premium: { label: "Premium", color: "#ff6b35" },
};

type SortMode = "trust" | "name" | "price-asc" | "price-desc";

// ── Trust Stars Component ────────────────────────────────────────────────────

function TrustStars({ score }: { readonly score: number }) {
  const fullStars = Math.floor(score);
  const hasHalf = score % 1 >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => {
        const filled = i < fullStars || (i === fullStars && hasHalf);
        const isHalf = i === fullStars && hasHalf;
        return (
          <Star
            key={i}
            className={clsx("w-3.5 h-3.5", filled ? "" : "opacity-20")}
            style={{ color: filled ? "#ffaa00" : "#888" }}
            fill={filled ? (isHalf ? "url(#half)" : "#ffaa00") : "none"}
          />
        );
      })}
      <span className="ml-1.5 text-xs font-semibold text-dc-text mono">{score.toFixed(1)}</span>
    </div>
  );
}

// ── Vendor Card Component ────────────────────────────────────────────────────

function VendorCard({
  vendor,
  peptideFilter,
}: {
  readonly vendor: (typeof MOCK_VENDORS)[number];
  readonly peptideFilter: string;
}) {
  const [expanded, setExpanded] = useState(false);

  const sources = useMemo(() => {
    const filtered = MOCK_PEPTIDE_SOURCES.filter((s) => s.vendorId === vendor.id);
    if (peptideFilter) {
      return filtered.filter((s) => s.peptideSlug === peptideFilter);
    }
    return filtered;
  }, [vendor.id, peptideFilter]);

  const typeConfig = VENDOR_TYPE_CONFIG[vendor.type];

  const toggle = useCallback(() => setExpanded((prev) => !prev), []);

  return (
    <Card hoverable className="overflow-hidden">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h3 className="text-base font-semibold text-dc-text">{vendor.name}</h3>
              <span
                className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border"
                style={{
                  color: typeConfig.color,
                  borderColor: `${typeConfig.color}30`,
                  backgroundColor: `${typeConfig.color}10`,
                }}
              >
                {typeConfig.label}
              </span>
            </div>
            <TrustStars score={vendor.trustScore} />
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span
              className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider"
              style={{
                color: PRICING_CONFIG[vendor.pricing].color,
                backgroundColor: `${PRICING_CONFIG[vendor.pricing].color}12`,
              }}
            >
              {PRICING_CONFIG[vendor.pricing].label}
            </span>
          </div>
        </div>

        {/* Info Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-start gap-2">
            <Truck className="w-3.5 h-3.5 text-dc-text-muted mt-0.5 flex-shrink-0" />
            <span className="text-xs text-dc-text-muted leading-relaxed">{vendor.shipping}</span>
          </div>
          {vendor.notes && (
            <div className="flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-dc-text-muted mt-0.5 flex-shrink-0" />
              <span className="text-xs text-dc-text-muted leading-relaxed">{vendor.notes}</span>
            </div>
          )}
        </div>

        {/* Actions Row */}
        <div className="flex items-center justify-between pt-2 border-t border-dc-border/40">
          <button
            onClick={toggle}
            className="flex items-center gap-1.5 text-xs font-medium text-dc-text-muted hover:text-dc-text transition-colors"
          >
            <Package className="w-3.5 h-3.5" />
            {sources.length} compound{sources.length !== 1 ? "s" : ""} available
            {expanded ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>
          <a
            href={vendor.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-dc-text hover:text-white transition-colors"
            style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
          >
            Visit Store <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Expanded Inventory */}
        {expanded && sources.length > 0 && (
          <div className="border-t border-dc-border/40 pt-3 -mx-5 -mb-5 px-5 pb-5 bg-dc-surface/30">
            <div className="space-y-2">
              {sources
                .sort((a, b) => a.price - b.price)
                .map((source) => {
                  const peptide = MOCK_PEPTIDES.find((p) => p.slug === source.peptideSlug);
                  return (
                    <div
                      key={`${source.vendorId}-${source.peptideSlug}`}
                      className="flex items-center justify-between py-2 px-3 rounded-xl bg-dc-surface-alt/40"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Link
                          href={`/library/${source.peptideSlug}`}
                          className="text-xs font-medium text-dc-text hover:text-dc-accent transition-colors truncate"
                        >
                          {peptide?.name ?? source.peptideSlug}
                        </Link>
                        <span className="text-[10px] text-dc-text-faint">{source.vialSize}</span>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        {source.inStock ? (
                          <span className="flex items-center gap-1 text-[10px] text-dc-neon-green">
                            <CheckCircle2 className="w-3 h-3" /> In Stock
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] text-dc-danger">
                            <XCircle className="w-3 h-3" /> Out of Stock
                          </span>
                        )}
                        <span className="text-sm font-bold text-dc-text mono">${source.price}</span>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3 text-dc-text-muted" />
                        </a>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function SourcesPage() {
  const [typeFilter, setTypeFilter] = useState<VendorType | "all">("all");
  const [pricingFilter, setPricingFilter] = useState<PricingTier | "all">("all");
  const [peptideFilter, setPeptideFilter] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("trust");
  const [showTrustInfo, setShowTrustInfo] = useState(false);

  // Get unique peptides that have sources
  const availablePeptides = useMemo(() => {
    const slugs = [...new Set(MOCK_PEPTIDE_SOURCES.map((s) => s.peptideSlug))];
    return slugs
      .map((slug) => {
        const peptide = MOCK_PEPTIDES.find((p) => p.slug === slug);
        return { slug, name: peptide?.name ?? slug };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  // Filter and sort vendors
  const filteredVendors = useMemo(() => {
    const filtered = MOCK_VENDORS.filter((vendor) => {
      if (typeFilter !== "all" && vendor.type !== typeFilter) return false;
      if (pricingFilter !== "all" && vendor.pricing !== pricingFilter) return false;
      if (peptideFilter) {
        const hasPeptide = MOCK_PEPTIDE_SOURCES.some(
          (s) => s.vendorId === vendor.id && s.peptideSlug === peptideFilter,
        );
        if (!hasPeptide) return false;
      }
      return true;
    });

    return [...filtered].sort((a, b) => {
      switch (sortMode) {
        case "trust":
          return b.trustScore - a.trustScore;
        case "name":
          return a.name.localeCompare(b.name);
        case "price-asc": {
          if (!peptideFilter) return 0;
          const aPrice = MOCK_PEPTIDE_SOURCES.find(
            (s) => s.vendorId === a.id && s.peptideSlug === peptideFilter,
          )?.price ?? Infinity;
          const bPrice = MOCK_PEPTIDE_SOURCES.find(
            (s) => s.vendorId === b.id && s.peptideSlug === peptideFilter,
          )?.price ?? Infinity;
          return aPrice - bPrice;
        }
        case "price-desc": {
          if (!peptideFilter) return 0;
          const aPriceD = MOCK_PEPTIDE_SOURCES.find(
            (s) => s.vendorId === a.id && s.peptideSlug === peptideFilter,
          )?.price ?? 0;
          const bPriceD = MOCK_PEPTIDE_SOURCES.find(
            (s) => s.vendorId === b.id && s.peptideSlug === peptideFilter,
          )?.price ?? 0;
          return bPriceD - aPriceD;
        }
        default:
          return 0;
      }
    });
  }, [typeFilter, pricingFilter, peptideFilter, sortMode]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, rgba(0,255,136,0.15) 0%, rgba(0,212,255,0.08) 100%)" }}
          >
            <ShoppingBag className="w-5 h-5 text-dc-neon-green" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-dc-text">Where to Buy</h1>
            <p className="text-sm text-dc-text-muted">Verified vendor directory with price comparison</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-1">
            <Filter className="w-4 h-4 text-dc-text-muted" />
            <span className="text-sm font-medium text-dc-text">Filters</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Vendor Type Filter */}
            <div>
              <label className="text-[10px] text-dc-text-faint uppercase tracking-wide mb-1.5 block">
                Vendor Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as VendorType | "all")}
                className="w-full px-3 py-2 rounded-xl bg-dc-surface border border-dc-border text-sm text-dc-text focus:outline-none focus:border-dc-accent/50"
              >
                <option value="all">All Types</option>
                <option value="pharmacy">Pharmacy</option>
                <option value="research">Research</option>
                <option value="telehealth">Telehealth</option>
                <option value="supplement">Supplement</option>
              </select>
            </div>

            {/* Pricing Filter */}
            <div>
              <label className="text-[10px] text-dc-text-faint uppercase tracking-wide mb-1.5 block">
                Pricing Tier
              </label>
              <select
                value={pricingFilter}
                onChange={(e) => setPricingFilter(e.target.value as PricingTier | "all")}
                className="w-full px-3 py-2 rounded-xl bg-dc-surface border border-dc-border text-sm text-dc-text focus:outline-none focus:border-dc-accent/50"
              >
                <option value="all">All Tiers</option>
                <option value="budget">Budget</option>
                <option value="mid">Mid-Range</option>
                <option value="premium">Premium</option>
              </select>
            </div>

            {/* Peptide Filter */}
            <div>
              <label className="text-[10px] text-dc-text-faint uppercase tracking-wide mb-1.5 block">
                Compound
              </label>
              <select
                value={peptideFilter}
                onChange={(e) => setPeptideFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-dc-surface border border-dc-border text-sm text-dc-text focus:outline-none focus:border-dc-accent/50"
              >
                <option value="">All Compounds</option>
                {availablePeptides.map((p) => (
                  <option key={p.slug} value={p.slug}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="text-[10px] text-dc-text-faint uppercase tracking-wide mb-1.5 block">
                Sort By
              </label>
              <select
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as SortMode)}
                className="w-full px-3 py-2 rounded-xl bg-dc-surface border border-dc-border text-sm text-dc-text focus:outline-none focus:border-dc-accent/50"
              >
                <option value="trust">Trust Score</option>
                <option value="name">Name</option>
                {peptideFilter && <option value="price-asc">Price (Low to High)</option>}
                {peptideFilter && <option value="price-desc">Price (High to Low)</option>}
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Trust Score Info */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-dc-text-muted">
          {filteredVendors.length} vendor{filteredVendors.length !== 1 ? "s" : ""} found
        </p>
        <button
          onClick={() => setShowTrustInfo(!showTrustInfo)}
          className="flex items-center gap-1 text-xs text-dc-text-muted hover:text-dc-text transition-colors"
        >
          <Shield className="w-3 h-3" />
          How trust scores work
          {showTrustInfo ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {showTrustInfo && (
        <Card className="border-dc-neon-cyan/20">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-dc-neon-cyan flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-dc-text mb-2">Trust Score Methodology</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-dc-text-muted">
                <div className="flex items-start gap-2">
                  <span className="text-dc-neon-green font-bold">5.0</span>
                  <span>Licensed pharmacy or board-certified telehealth with full regulatory compliance</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-dc-neon-green font-bold">4.5</span>
                  <span>Third-party tested, transparent COA/mass-spec, established reputation</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-dc-warning font-bold">4.0</span>
                  <span>Testing available on request, good community track record</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-dc-warning font-bold">3.5</span>
                  <span>GMP certified facility, limited third-party verification</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Vendor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredVendors.map((vendor) => (
          <VendorCard key={vendor.id} vendor={vendor} peptideFilter={peptideFilter} />
        ))}
      </div>

      {filteredVendors.length === 0 && (
        <Card className="text-center py-12">
          <Search className="w-10 h-10 text-dc-text-faint mx-auto mb-3" />
          <h3 className="text-base font-medium text-dc-text mb-1">No vendors match your filters</h3>
          <p className="text-sm text-dc-text-muted">Try broadening your search criteria.</p>
        </Card>
      )}

      {/* Disclaimer */}
      <div className="px-4 py-3 rounded-xl bg-dc-surface/50 border border-dc-border/30">
        <p className="text-[10px] text-dc-text-faint leading-relaxed text-center">
          DoseCraft may earn affiliate commissions from vendor links. This does not influence our ratings or trust
          scores. All vendors are independently evaluated. Pricing is approximate and subject to change. Always verify
          directly with the vendor before purchasing.
        </p>
      </div>
    </div>
  );
}
