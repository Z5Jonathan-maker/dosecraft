"use client";

import { useState, useMemo } from "react";
import {
  DollarSign,
  Search,
  X,
  TrendingDown,
  Minus,
  TrendingUp,
  Beaker,
  Building2,
  Stethoscope,
  ExternalLink,
  Star,
  Shield,
  AlertTriangle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import clsx from "clsx";

// ── Types ────────────────────────────────────────────────────────────────────

interface PriceRange {
  readonly min: number;
  readonly max: number;
}

type PriceTrend = "stable" | "dropping" | "rising";

interface PeptidePricing {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly note?: string;
  readonly research?: PriceRange;
  readonly compounding?: PriceRange;
  readonly clinic?: PriceRange;
  readonly brandDrug?: PriceRange;
  readonly trend: PriceTrend;
}

interface RecommendedVendor {
  readonly name: string;
  readonly url: string;
  readonly description: string;
  readonly trustScore: number;
  readonly features: readonly string[];
  readonly accentColor: string;
  readonly badge?: string;
}

// ── Pricing Data ─────────────────────────────────────────────────────────────

const PRICING_DATA: readonly PeptidePricing[] = [
  {
    id: "bpc-157",
    name: "BPC-157",
    category: "Healing & Recovery",
    note: "Banned from compounding pharmacies since 2022. Only available from research vendors.",
    research: { min: 70, max: 130 },
    trend: "stable",
  },
  {
    id: "tb-500",
    name: "TB-500 (Thymosin Beta-4)",
    category: "Healing & Recovery",
    note: "Banned from 503A compounding since 2022.",
    research: { min: 90, max: 160 },
    trend: "stable",
  },
  {
    id: "ghk-cu",
    name: "GHK-Cu",
    category: "Skin & Aesthetics",
    research: { min: 25, max: 80 },
    compounding: { min: 80, max: 200 },
    clinic: { min: 150, max: 350 },
    trend: "stable",
  },
  {
    id: "sermorelin",
    name: "Sermorelin",
    category: "GH Secretagogues",
    research: { min: 40, max: 160 },
    compounding: { min: 100, max: 200 },
    clinic: { min: 200, max: 400 },
    trend: "dropping",
  },
  {
    id: "cjc-ipa",
    name: "CJC-1295 / Ipamorelin (Stack)",
    category: "GH Secretagogues",
    note: "Most commonly sold as a combined stack",
    research: { min: 90, max: 180 },
    compounding: { min: 150, max: 300 },
    clinic: { min: 250, max: 500 },
    trend: "stable",
  },
  {
    id: "tesamorelin",
    name: "Tesamorelin",
    category: "GH Secretagogues",
    research: { min: 200, max: 400 },
    compounding: { min: 200, max: 500 },
    clinic: { min: 350, max: 700 },
    brandDrug: { min: 2000, max: 4500 },
    trend: "dropping",
  },
  {
    id: "semaglutide",
    name: "Semaglutide",
    category: "GLP-1 & Metabolic",
    research: { min: 80, max: 180 },
    compounding: { min: 200, max: 500 },
    clinic: { min: 250, max: 600 },
    brandDrug: { min: 800, max: 1400 },
    trend: "dropping",
  },
  {
    id: "tirzepatide",
    name: "Tirzepatide",
    category: "GLP-1 & Metabolic",
    research: { min: 120, max: 250 },
    compounding: { min: 200, max: 500 },
    clinic: { min: 300, max: 700 },
    brandDrug: { min: 900, max: 1400 },
    trend: "dropping",
  },
  {
    id: "retatrutide",
    name: "Retatrutide",
    category: "GLP-1 & Metabolic",
    note: "Limited availability \u2014 not yet approved, research phase only",
    research: { min: 300, max: 600 },
    clinic: { min: 500, max: 1200 },
    trend: "dropping",
  },
  {
    id: "pt-141",
    name: "PT-141 (Bremelanotide)",
    category: "Sexual Health",
    research: { min: 25, max: 120 },
    clinic: { min: 80, max: 200 },
    brandDrug: { min: 800, max: 1500 },
    trend: "stable",
  },
  {
    id: "epithalon",
    name: "Epithalon",
    category: "Longevity & Anti-Aging",
    research: { min: 40, max: 160 },
    trend: "stable",
  },
  {
    id: "thymosin-alpha-1",
    name: "Thymosin Alpha-1",
    category: "Immune Support",
    research: { min: 200, max: 600 },
    compounding: { min: 250, max: 600 },
    clinic: { min: 400, max: 900 },
    trend: "stable",
  },
  {
    id: "mots-c",
    name: "MOTS-c",
    category: "Mitochondrial",
    research: { min: 80, max: 400 },
    clinic: { min: 300, max: 800 },
    trend: "dropping",
  },
  {
    id: "aod-9604",
    name: "AOD-9604",
    category: "GLP-1 & Metabolic",
    research: { min: 50, max: 110 },
    compounding: { min: 80, max: 200 },
    clinic: { min: 150, max: 350 },
    trend: "stable",
  },
  {
    id: "vip",
    name: "VIP (Vasoactive Intestinal Peptide)",
    category: "Immune Support",
    compounding: { min: 400, max: 800 },
    clinic: { min: 600, max: 1200 },
    trend: "stable",
  },
  {
    id: "ss-31",
    name: "SS-31 (Elamipretide)",
    category: "Mitochondrial",
    research: { min: 200, max: 600 },
    trend: "stable",
  },
  {
    id: "semax",
    name: "Semax",
    category: "Neurological & Cognitive",
    research: { min: 30, max: 140 },
    trend: "stable",
  },
  {
    id: "gonadorelin",
    name: "Gonadorelin",
    category: "Hormonal & Endocrine",
    research: { min: 40, max: 100 },
    compounding: { min: 50, max: 150 },
    clinic: { min: 100, max: 250 },
    trend: "stable",
  },
  {
    id: "oxytocin",
    name: "Oxytocin (Intranasal)",
    category: "Hormonal & Endocrine",
    compounding: { min: 30, max: 100 },
    clinic: { min: 80, max: 200 },
    trend: "stable",
  },
  {
    id: "nad-plus",
    name: "NAD+ (IV)",
    category: "Longevity & Anti-Aging",
    compounding: { min: 150, max: 400 },
    clinic: { min: 600, max: 2400 },
    trend: "stable",
  },
];

const PRICING_CATEGORIES = [
  ...new Set(PRICING_DATA.map((p) => p.category)),
].sort();

// ── Recommended Vendors ──────────────────────────────────────────────────────

const RECOMMENDED_VENDORS: readonly RecommendedVendor[] = [
  {
    name: "Apex Peptides",
    url: "https://apex-peptides.com/?ref=dosecraft",
    description:
      "US-based research peptide vendor with COAs provided on every batch. UPS shipping with immediate tracking. Carries BPC-157, TB-500, Semaglutide, Retatrutide, and popular blends like \"Wolverine\" (BPC/TB combo).",
    trustScore: 4.5,
    features: ["COA Verified", "UPS Tracked", "Peptide Blends"],
    accentColor: "#00ff88",
    badge: "Editor\u2019s Pick",
  },
  {
    name: "Paramount Peptides",
    url: "https://paramountpeptides.com/?ref=dosecraft",
    description:
      "12+ years in business, American-owned in Southern California. In-house synthesis \u2014 not resold from third parties. HPLC tested on raw powders AND finished products. BBB listed. Offers injectables, tablets, nasal sprays, and branded blends.",
    trustScore: 4.5,
    features: ["In-House Synthesis", "12+ Years", "HPLC Tested", "BBB Listed"],
    accentColor: "#00d4ff",
  },
  {
    name: "Pure Rawz",
    url: "https://purerawz.co/?ref=dosecraft",
    description:
      "Broadest catalog of all vendors \u2014 peptides, SARMs, nootropics, CBD, and more in liquid, powder, capsule, tablet, and nasal spray formats. Third-party COAs via mass spec and HPLC. Loyalty rewards program on every purchase.",
    trustScore: 4.0,
    features: ["Widest Catalog", "Rewards Program", "Multiple Formats", "Lab Tested"],
    accentColor: "#b366ff",
  },
  {
    name: "Alpha & Omega Peptide",
    url: "https://alphaomegapeptide.com/?ref=dosecraft",
    description:
      "US-based GMP-certified facility. FedEx 2-Day shipping included on every order \u2014 best shipping deal in the space. 30-day money-back quality guarantee on unopened products. Rated 4.2/5 on Knoji and 4.3/5 on Trustpilot.",
    trustScore: 4.0,
    features: ["Free FedEx 2-Day", "GMP Certified", "Money-Back Guarantee"],
    accentColor: "#ffaa00",
  },
  {
    name: "Strate Labs",
    url: "https://stratelabs.ca/?ref=dosecraft",
    description:
      "10+ years experience. Most transparent testing in the industry \u2014 11 analytical methods including NMR, FTIR, HPLC, LC-MS, and GC-MS with public batch-coded lab reports. Best bulk pricing with volume discounts up to 30% off. Canadian-based.",
    trustScore: 4.0,
    features: ["11 Test Methods", "Bulk Discounts", "10+ Years", "Public Lab Reports"],
    accentColor: "#ff6b35",
  },
];

// ── Tier Config ──────────────────────────────────────────────────────────────

const TIERS = [
  {
    title: "Research Vendor",
    description: "Lowest cost. Research/lab use. Quality varies \u2014 look for HPLC COA.",
    icon: Beaker,
    color: "#00ff88",
  },
  {
    title: "Compounding Pharmacy",
    description: "Rx required. Pharmaceutical-grade. 3\u20135\u00d7 research price.",
    icon: Building2,
    color: "#ffaa00",
  },
  {
    title: "Clinic / Telehealth",
    description: "Full medical oversight included. Typically 5\u201312\u00d7 research price.",
    icon: Stethoscope,
    color: "#ff6b35",
  },
] as const;

// ── Sort helpers ─────────────────────────────────────────────────────────────

type SortKey = "name" | "category" | "research" | "trend";
type SortDir = "asc" | "desc";

function getSortValue(item: PeptidePricing, key: SortKey): number | string {
  switch (key) {
    case "name":
      return item.name.toLowerCase();
    case "category":
      return item.category;
    case "research":
      return item.research?.min ?? Infinity;
    case "trend":
      return item.trend;
    default:
      return 0;
  }
}

// ── Sub-components ───────────────────────────────────────────────────────────

function SortIcon({
  column,
  sortKey,
  sortDir,
}: {
  readonly column: SortKey;
  readonly sortKey: SortKey;
  readonly sortDir: SortDir;
}) {
  if (sortKey !== column) return <ArrowUpDown className="w-3 h-3 opacity-40" />;
  return sortDir === "asc" ? (
    <ArrowUp className="w-3 h-3" />
  ) : (
    <ArrowDown className="w-3 h-3" />
  );
}

function PriceCell({ range, color }: { readonly range?: PriceRange; readonly color: string }) {
  if (!range) {
    return <span className="text-dc-text-faint text-sm">&mdash;</span>;
  }
  return (
    <div className="flex flex-col">
      <span className="text-sm font-semibold mono" style={{ color }}>
        ${range.min.toLocaleString()}&ndash;${range.max.toLocaleString()}
      </span>
      <span className="text-[10px] text-dc-text-faint">/mo est.</span>
    </div>
  );
}

function TrendBadge({ trend }: { readonly trend: PriceTrend }) {
  const config = {
    stable: { icon: Minus, color: "#8888a0", label: "stable" },
    dropping: { icon: TrendingDown, color: "#00ff88", label: "dropping" },
    rising: { icon: TrendingUp, color: "#ff4444", label: "rising" },
  } as const;

  const { icon: Icon, color, label } = config[trend];

  return (
    <span className="flex items-center gap-1 text-xs font-medium" style={{ color }}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

function TrustStars({ score }: { readonly score: number }) {
  const full = Math.floor(score);
  const hasHalf = score % 1 >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => {
        const filled = i < full || (i === full && hasHalf);
        return (
          <Star
            key={i}
            className={clsx("w-3 h-3", filled ? "" : "opacity-20")}
            style={{ color: filled ? "#ffaa00" : "#555" }}
            fill={filled ? "#ffaa00" : "none"}
          />
        );
      })}
      <span className="ml-1 text-[10px] font-semibold text-dc-text mono">
        {score.toFixed(1)}
      </span>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function PricingPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    const result = PRICING_DATA.filter((item) => {
      const matchSearch =
        search === "" ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        categoryFilter === "all" || item.category === categoryFilter;
      return matchSearch && matchCategory;
    });

    return [...result].sort((a, b) => {
      const aVal = getSortValue(a, sortKey);
      const bVal = getSortValue(b, sortKey);
      const cmp = typeof aVal === "string" && typeof bVal === "string"
        ? aVal.localeCompare(bVal)
        : Number(aVal) - Number(bVal);
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [search, categoryFilter, sortKey, sortDir]);

  const hasFilters = search !== "" || categoryFilter !== "all";

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,255,136,0.15) 0%, rgba(255,170,0,0.1) 100%)",
            }}
          >
            <DollarSign className="w-5 h-5 text-dc-neon-green" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-dc-text">
              Peptide Cost Comparison
            </h1>
            <p className="text-sm text-dc-text-muted">
              Estimated monthly costs across research vendors, compounding
              pharmacies, and telehealth clinics
            </p>
          </div>
        </div>
      </div>

      {/* Tier Explanation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TIERS.map((tier) => {
          const Icon = tier.icon;
          return (
            <Card key={tier.title} className="relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  background: `radial-gradient(ellipse at top right, ${tier.color}, transparent 70%)`,
                }}
              />
              <div className="relative">
                <div className="flex items-center gap-2.5 mb-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${tier.color}15` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: tier.color }} />
                  </div>
                  <h3
                    className="text-sm font-semibold"
                    style={{ color: tier.color }}
                  >
                    {tier.title}
                  </h3>
                </div>
                <p className="text-xs text-dc-text-muted leading-relaxed">
                  {tier.description}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Search + Category Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dc-text-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search peptide..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm text-dc-text bg-dc-surface border border-dc-border placeholder:text-dc-text-muted/40 focus:outline-none focus:border-dc-accent focus:ring-2 focus:ring-dc-accent/15 transition-all"
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

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setCategoryFilter("all")}
            className={clsx(
              "px-3 py-2 rounded-xl text-xs font-medium border transition-all",
              categoryFilter === "all"
                ? "bg-dc-accent/10 text-dc-accent border-dc-accent/30"
                : "text-dc-text-muted border-dc-border hover:border-dc-accent/20 hover:text-dc-text",
            )}
          >
            All
          </button>
          {PRICING_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                setCategoryFilter(categoryFilter === cat ? "all" : cat)
              }
              className={clsx(
                "px-3 py-2 rounded-xl text-xs font-medium border transition-all whitespace-nowrap",
                categoryFilter === cat
                  ? "bg-dc-accent/10 text-dc-accent border-dc-accent/30"
                  : "text-dc-text-muted border-dc-border hover:border-dc-accent/20 hover:text-dc-text",
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count + clear */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-dc-text-muted">
          {filtered.length} compound{filtered.length !== 1 ? "s" : ""}
        </p>
        {hasFilters && (
          <button
            onClick={() => {
              setSearch("");
              setCategoryFilter("all");
            }}
            className="flex items-center gap-1.5 text-xs text-dc-text-muted hover:text-dc-text transition-colors"
          >
            <X className="w-3 h-3" />
            Clear filters
          </button>
        )}
      </div>

      {/* Pricing Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dc-border/60">
                <th
                  onClick={() => handleSort("name")}
                  className="px-5 py-3.5 text-left text-[10px] font-medium text-dc-text-muted uppercase tracking-[0.15em] cursor-pointer hover:text-dc-text transition-colors select-none min-w-[180px]"
                >
                  <div className="flex items-center gap-1.5">
                    Peptide
                    <SortIcon column="name" sortKey={sortKey} sortDir={sortDir} />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("category")}
                  className="px-5 py-3.5 text-left text-[10px] font-medium text-dc-text-muted uppercase tracking-[0.15em] cursor-pointer hover:text-dc-text transition-colors select-none min-w-[140px]"
                >
                  <div className="flex items-center gap-1.5">
                    Category
                    <SortIcon column="category" sortKey={sortKey} sortDir={sortDir} />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("research")}
                  className="px-5 py-3.5 text-left text-[10px] font-medium uppercase tracking-[0.15em] cursor-pointer hover:text-dc-text transition-colors select-none min-w-[120px]"
                  style={{ color: "#00ff88" }}
                >
                  <div className="flex items-center gap-1.5">
                    Research Vendor
                    <SortIcon column="research" sortKey={sortKey} sortDir={sortDir} />
                  </div>
                </th>
                <th className="px-5 py-3.5 text-left text-[10px] font-medium uppercase tracking-[0.15em] select-none min-w-[120px]" style={{ color: "#ffaa00" }}>
                  Compounding
                </th>
                <th className="px-5 py-3.5 text-left text-[10px] font-medium uppercase tracking-[0.15em] select-none min-w-[120px]" style={{ color: "#ff6b35" }}>
                  Clinic
                </th>
                <th className="px-5 py-3.5 text-left text-[10px] font-medium uppercase tracking-[0.15em] select-none min-w-[120px]" style={{ color: "#ff4444" }}>
                  Brand Drug
                </th>
                <th
                  onClick={() => handleSort("trend")}
                  className="px-5 py-3.5 text-left text-[10px] font-medium text-dc-text-muted uppercase tracking-[0.15em] cursor-pointer hover:text-dc-text transition-colors select-none"
                >
                  <div className="flex items-center gap-1.5">
                    Trend
                    <SortIcon column="trend" sortKey={sortKey} sortDir={sortDir} />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-dc-border/30 hover:bg-dc-surface-hover/50 transition-colors group"
                >
                  <td className="px-5 py-3.5">
                    <div>
                      <span className="text-sm font-medium text-dc-text block">
                        {item.name}
                      </span>
                      {item.note && (
                        <span className="text-[10px] text-dc-text-faint leading-tight block mt-0.5">
                          {item.note}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-dc-text-muted">{item.category}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <PriceCell range={item.research} color="#00ff88" />
                  </td>
                  <td className="px-5 py-3.5">
                    <PriceCell range={item.compounding} color="#ffaa00" />
                  </td>
                  <td className="px-5 py-3.5">
                    <PriceCell range={item.clinic} color="#ff6b35" />
                  </td>
                  <td className="px-5 py-3.5">
                    <PriceCell range={item.brandDrug} color="#ff4444" />
                  </td>
                  <td className="px-5 py-3.5">
                    <TrendBadge trend={item.trend} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <DollarSign className="w-12 h-12 text-dc-text-muted mx-auto mb-4 opacity-30" />
            <h3 className="text-base font-medium text-dc-text mb-2">
              No compounds match
            </h3>
            <p className="text-sm text-dc-text-muted">
              Try adjusting your search or category filter.
            </p>
          </div>
        )}
      </div>

      {/* Recommended Vendors */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-dc-neon-green" />
          <h2 className="text-lg font-bold text-dc-text">
            Recommended Research Vendors
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {RECOMMENDED_VENDORS.map((vendor) => (
            <Card key={vendor.name} hoverable className="relative overflow-hidden">
              {vendor.badge && (
                <div
                  className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    color: vendor.accentColor,
                    backgroundColor: `${vendor.accentColor}15`,
                    border: `1px solid ${vendor.accentColor}30`,
                  }}
                >
                  {vendor.badge}
                </div>
              )}
              <div className="space-y-3">
                <div>
                  <h3 className="text-base font-semibold text-dc-text mb-1">
                    {vendor.name}
                  </h3>
                  <TrustStars score={vendor.trustScore} />
                </div>
                <p className="text-xs text-dc-text-muted leading-relaxed">
                  {vendor.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {vendor.features.map((feat) => (
                    <span
                      key={feat}
                      className="px-2 py-0.5 rounded-full text-[10px] font-medium border"
                      style={{
                        color: vendor.accentColor,
                        borderColor: `${vendor.accentColor}25`,
                        backgroundColor: `${vendor.accentColor}08`,
                      }}
                    >
                      {feat}
                    </span>
                  ))}
                </div>
                <a
                  href={vendor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-semibold transition-all hover:brightness-110"
                  style={{
                    backgroundColor: `${vendor.accentColor}15`,
                    color: vendor.accentColor,
                    border: `1px solid ${vendor.accentColor}25`,
                  }}
                >
                  Visit Store
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="glass rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle
          className="w-5 h-5 flex-shrink-0 mt-0.5"
          style={{ color: "#ffaa00" }}
        />
        <div className="space-y-1.5">
          <p className="text-xs text-dc-text-muted leading-relaxed">
            Prices are estimated monthly costs based on typical dosing protocols and may
            vary by vendor, location, and supply. All prices in USD. Research vendor
            products are for laboratory research use only. Always verify current pricing
            directly with the vendor before purchasing.
          </p>
          <p className="text-[10px] text-dc-text-faint leading-relaxed">
            DoseCraft may earn affiliate commissions from vendor links. This does not
            influence our pricing data or vendor ratings. Not medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}
