"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PeptideCard } from "@/components/peptide/peptide-card";
import { Search, SlidersHorizontal, X, FlaskConical } from "lucide-react";
import { MOCK_PEPTIDES } from "@/lib/mock-data";
import type { EvidenceLane, PeptideCategory, AdministrationRoute, PeptideStatus } from "@/types";

const CATEGORIES: { value: PeptideCategory; label: string }[] = [
  { value: "healing", label: "Healing" },
  { value: "growth-hormone", label: "Growth Hormone" },
  { value: "metabolic", label: "Metabolic" },
  { value: "cosmetic", label: "Cosmetic" },
  { value: "neuroprotective", label: "Neuroprotective" },
  { value: "sleep", label: "Sleep" },
  { value: "immune", label: "Immune" },
  { value: "hormonal", label: "Hormonal" },
  { value: "sexual-health", label: "Sexual Health" },
];

const LANES: { value: EvidenceLane; label: string; color: string }[] = [
  { value: "clinical",     label: "Clinical",     color: "#00d4ff" },
  { value: "expert",       label: "Expert",       color: "#ff6b35" },
  { value: "experimental", label: "Experimental", color: "#b366ff" },
];

const STATUSES: { value: PeptideStatus; label: string }[] = [
  { value: "well-researched", label: "Well Researched" },
  { value: "emerging",        label: "Emerging" },
  { value: "experimental",    label: "Experimental" },
  { value: "novel",           label: "Novel" },
];

export default function LibraryPage() {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<PeptideCategory[]>([]);
  const [selectedLanes, setSelectedLanes] = useState<EvidenceLane[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<PeptideStatus | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const toggleCategory = (cat: PeptideCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const toggleLane = (lane: EvidenceLane) => {
    setSelectedLanes((prev) =>
      prev.includes(lane) ? prev.filter((l) => l !== lane) : [...prev, lane],
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedLanes([]);
    setSelectedStatus(null);
    setSearch("");
  };

  const hasFilters = selectedCategories.length > 0 || selectedLanes.length > 0 || selectedStatus !== null || search !== "";

  const filtered = useMemo(() => {
    return MOCK_PEPTIDES.filter((p) => {
      const matchSearch =
        search === "" ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.aliases.some((a) => a.toLowerCase().includes(search.toLowerCase())) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCategories.length === 0 || selectedCategories.includes(p.category);
      const matchLane = selectedLanes.length === 0 || selectedLanes.some((l) => p.lanes.includes(l));
      const matchStatus = selectedStatus === null || p.status === selectedStatus;
      return matchSearch && matchCat && matchLane && matchStatus;
    });
  }, [search, selectedCategories, selectedLanes, selectedStatus]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FlaskConical className="w-5 h-5 text-dc-clinical" />
            <h2 className="text-sm font-medium text-dc-clinical">Evidence-Based Compounds</h2>
          </div>
          <p className="text-dc-text-muted text-sm">
            {MOCK_PEPTIDES.length} compounds &middot; {filtered.length} shown
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-dc-text-muted hover:text-dc-text bg-dc-surface border border-dc-border transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium border transition-all ${
              showFilters
                ? "bg-dc-accent/10 text-dc-accent border-dc-accent/30"
                : "bg-dc-surface text-dc-text-muted border-dc-border hover:border-dc-accent/20"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {hasFilters && (
              <span className="w-2 h-2 rounded-full bg-dc-accent" />
            )}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dc-text-muted pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search peptides — BPC-157, TB-500, GHK-Cu..."
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

      {/* Filter Panel */}
      {showFilters && (
        <div className="glass rounded-2xl p-5 space-y-5 animate-fade-in">
          {/* Evidence Lane */}
          <div>
            <p className="text-xs font-medium text-dc-text-muted uppercase tracking-wide mb-3">Evidence Lane</p>
            <div className="flex flex-wrap gap-2">
              {LANES.map((lane) => (
                <button
                  key={lane.value}
                  onClick={() => toggleLane(lane.value)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all"
                  style={{
                    backgroundColor: selectedLanes.includes(lane.value) ? `${lane.color}15` : "transparent",
                    borderColor: selectedLanes.includes(lane.value) ? `${lane.color}40` : "#2a2a3e",
                    color: selectedLanes.includes(lane.value) ? lane.color : "#8888a0",
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: lane.color, boxShadow: selectedLanes.includes(lane.value) ? `0 0 6px ${lane.color}` : "none" }}
                  />
                  {lane.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <p className="text-xs font-medium text-dc-text-muted uppercase tracking-wide mb-3">Category</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => toggleCategory(cat.value)}
                  className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all capitalize ${
                    selectedCategories.includes(cat.value)
                      ? "bg-dc-accent/10 text-dc-accent border-dc-accent/30"
                      : "bg-transparent text-dc-text-muted border-dc-border hover:border-dc-accent/20 hover:text-dc-text"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Research Status */}
          <div>
            <p className="text-xs font-medium text-dc-text-muted uppercase tracking-wide mb-3">Research Status</p>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSelectedStatus(selectedStatus === s.value ? null : s.value)}
                  className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                    selectedStatus === s.value
                      ? "bg-dc-neon-green/10 text-dc-neon-green border-dc-neon-green/30"
                      : "bg-transparent text-dc-text-muted border-dc-border hover:border-dc-accent/20 hover:text-dc-text"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((peptide) => (
            <PeptideCard key={peptide.slug} peptide={peptide} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <FlaskConical className="w-12 h-12 text-dc-text-muted mx-auto mb-4 opacity-30" />
          <h3 className="text-base font-medium text-dc-text mb-2">No compounds found</h3>
          <p className="text-sm text-dc-text-muted">Try adjusting your search or filters.</p>
          <button onClick={clearFilters} className="mt-4 text-sm text-dc-accent hover:underline">
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
