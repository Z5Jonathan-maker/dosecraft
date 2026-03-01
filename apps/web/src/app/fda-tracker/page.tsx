"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ShieldCheck,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
} from "lucide-react";
import { MOCK_PEPTIDES } from "@/lib/mock-data";
import type { FDAStatus, PeptideCategory } from "@/types";

// ── FDA Status Config ──

const FDA_STATUS_CONFIG: Record<
  FDAStatus,
  { readonly label: string; readonly color: string }
> = {
  approved: { label: "FDA Approved", color: "#00ff88" },
  "phase-3": { label: "Phase 3", color: "#00d4ff" },
  "phase-2": { label: "Phase 2", color: "#ffaa00" },
  "phase-1": { label: "Phase 1", color: "#ffaa00" },
  "research-only": { label: "Research Only", color: "#b366ff" },
  compoundable: { label: "Compoundable", color: "#00d4ff" },
  caution: { label: "Caution", color: "#ff4444" },
  supplement: { label: "Supplement", color: "#ffaa00" },
  otc: { label: "OTC", color: "#00ff88" },
};

const CATEGORY_LABELS: Record<PeptideCategory, string> = {
  healing: "Healing",
  "growth-hormone": "Growth Hormone",
  metabolic: "Metabolic",
  cosmetic: "Cosmetic",
  neuroprotective: "Neuroprotective",
  sleep: "Sleep",
  immune: "Immune",
  hormonal: "Hormonal",
  "sexual-health": "Sexual Health",
};

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as PeptideCategory[];

const ALL_FDA_STATUSES = Object.keys(FDA_STATUS_CONFIG) as FDAStatus[];

// ── Sort helpers ──

type SortKey = "name" | "category" | "fdaStatus" | "halfLife";
type SortDir = "asc" | "desc";

function SortIcon({ column, sortKey, sortDir }: { readonly column: SortKey; readonly sortKey: SortKey; readonly sortDir: SortDir }) {
  if (sortKey !== column)
    return <ArrowUpDown className="w-3 h-3 opacity-40" />;
  return sortDir === "asc" ? (
    <ArrowUp className="w-3 h-3" />
  ) : (
    <ArrowDown className="w-3 h-3" />
  );
}

function getPrimaryUse(description: string): string {
  const firstSentence = description.split(". ")[0] ?? description;
  return firstSentence.length > 80
    ? firstSentence.slice(0, 77) + "..."
    : firstSentence;
}

export default function FDATrackerPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FDAStatus | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<PeptideCategory | null>(
    null,
  );
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

  const hasFilters =
    search !== "" || statusFilter !== null || categoryFilter !== null;

  const clearFilters = () => {
    setSearch("");
    setStatusFilter(null);
    setCategoryFilter(null);
  };

  const filtered = useMemo(() => {
    const result = MOCK_PEPTIDES.filter((p) => {
      const matchSearch =
        search === "" ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.aliases.some((a) =>
          a.toLowerCase().includes(search.toLowerCase()),
        );
      const matchStatus =
        statusFilter === null || p.fdaStatus === statusFilter;
      const matchCategory =
        categoryFilter === null || p.category === categoryFilter;
      return matchSearch && matchStatus && matchCategory;
    });

    const sorted = [...result].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "category":
          cmp = a.category.localeCompare(b.category);
          break;
        case "fdaStatus":
          cmp = a.fdaStatus.localeCompare(b.fdaStatus);
          break;
        case "halfLife":
          cmp = a.halfLife.localeCompare(b.halfLife);
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return sorted;
  }, [search, statusFilter, categoryFilter, sortKey, sortDir]);

  // Count compounds per status for the summary bar
  const statusCounts = useMemo(() => {
    const counts: Partial<Record<FDAStatus, number>> = {};
    for (const p of MOCK_PEPTIDES) {
      counts[p.fdaStatus] = (counts[p.fdaStatus] ?? 0) + 1;
    }
    return counts;
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5" style={{ color: "#00d4ff" }} />
            <h2 className="text-sm font-medium" style={{ color: "#00d4ff" }}>
              FDA Status Tracker
            </h2>
          </div>
          <p className="text-dc-text-muted text-sm">
            {MOCK_PEPTIDES.length} compounds &middot; {filtered.length} shown
          </p>
        </div>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-dc-text-muted hover:text-dc-text bg-dc-surface border border-dc-border transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Clear filters
          </button>
        )}
      </div>

      {/* Status Summary Chips */}
      <div className="flex flex-wrap gap-2">
        {ALL_FDA_STATUSES.map((status) => {
          const count = statusCounts[status];
          if (!count) return null;
          const cfg = FDA_STATUS_CONFIG[status];
          const active = statusFilter === status;
          return (
            <button
              key={status}
              onClick={() =>
                setStatusFilter(active ? null : status)
              }
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all"
              style={{
                backgroundColor: active ? `${cfg.color}15` : "transparent",
                borderColor: active ? `${cfg.color}40` : "#2a2a3e",
                color: active ? cfg.color : "#8888a0",
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  background: cfg.color,
                  boxShadow: active ? `0 0 6px ${cfg.color}` : "none",
                }}
              />
              {cfg.label}
              <span className="opacity-60">({count})</span>
            </button>
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
            placeholder="Search compounds..."
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
        <select
          value={categoryFilter ?? ""}
          onChange={(e) =>
            setCategoryFilter(
              e.target.value === ""
                ? null
                : (e.target.value as PeptideCategory),
            )
          }
          className="px-4 py-3 rounded-2xl text-sm text-dc-text bg-dc-surface border border-dc-border focus:outline-none focus:border-dc-accent focus:ring-2 focus:ring-dc-accent/15 transition-all appearance-none cursor-pointer"
        >
          <option value="">All Categories</option>
          {ALL_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {CATEGORY_LABELS[cat]}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dc-border/60">
                {(
                  [
                    { key: "name" as SortKey, label: "Name" },
                    { key: "category" as SortKey, label: "Category" },
                    { key: "fdaStatus" as SortKey, label: "FDA Status" },
                    { key: "halfLife" as SortKey, label: "Half-Life" },
                  ] as const
                ).map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="px-5 py-3.5 text-left text-[10px] font-medium text-dc-text-muted uppercase tracking-[0.15em] cursor-pointer hover:text-dc-text transition-colors select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      {col.label}
                      <SortIcon column={col.key} sortKey={sortKey} sortDir={sortDir} />
                    </div>
                  </th>
                ))}
                <th className="px-5 py-3.5 text-left text-[10px] font-medium text-dc-text-muted uppercase tracking-[0.15em]">
                  Primary Use
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((peptide) => {
                const statusCfg = FDA_STATUS_CONFIG[peptide.fdaStatus];
                return (
                  <tr
                    key={peptide.slug}
                    onClick={() => router.push(`/library/${peptide.slug}`)}
                    className="border-b border-dc-border/30 hover:bg-dc-surface-hover/50 cursor-pointer transition-colors group"
                  >
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-medium text-dc-text group-hover:text-dc-accent transition-colors">
                        {peptide.name}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs text-dc-text-muted capitalize">
                        {CATEGORY_LABELS[peptide.category]}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide border"
                        style={{
                          color: statusCfg.color,
                          backgroundColor: `${statusCfg.color}12`,
                          borderColor: `${statusCfg.color}30`,
                          boxShadow: `0 0 8px ${statusCfg.color}10`,
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor: statusCfg.color,
                            boxShadow: `0 0 4px ${statusCfg.color}`,
                          }}
                        />
                        {statusCfg.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs text-dc-text-muted">
                        {peptide.halfLife}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs text-dc-text-muted leading-relaxed">
                        {getPrimaryUse(peptide.description)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <ShieldCheck className="w-12 h-12 text-dc-text-muted mx-auto mb-4 opacity-30" />
            <h3 className="text-base font-medium text-dc-text mb-2">
              No compounds match
            </h3>
            <p className="text-sm text-dc-text-muted">
              Try adjusting your search or filters.
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 text-sm text-dc-accent hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="glass rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle
          className="w-5 h-5 flex-shrink-0 mt-0.5"
          style={{ color: "#ffaa00" }}
        />
        <p className="text-xs text-dc-text-muted leading-relaxed">
          This information is for educational purposes only. FDA status
          classifications are approximate and may change. Always consult
          healthcare providers and verify current regulatory status before use.
          DoseCraft does not provide medical advice.
        </p>
      </div>
    </div>
  );
}
