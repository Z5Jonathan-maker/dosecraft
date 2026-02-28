"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PeptideCard } from "@/components/peptide/peptide-card";
import { Search, Filter } from "lucide-react";
import { MOCK_PEPTIDES } from "@/lib/mock-data";
import type { PeptideCategory, AdministrationRoute, PeptideStatus } from "@/types";

const CATEGORIES: PeptideCategory[] = [
  "healing",
  "growth-hormone",
  "metabolic",
  "cosmetic",
  "neuroprotective",
  "sleep",
  "immune",
];

const ROUTES: AdministrationRoute[] = [
  "subcutaneous",
  "oral",
  "topical",
  "intranasal",
  "intramuscular",
];

const STATUSES: PeptideStatus[] = [
  "well-researched",
  "emerging",
  "experimental",
  "novel",
];

export default function LibraryPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<PeptideCategory | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<AdministrationRoute | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<PeptideStatus | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return MOCK_PEPTIDES.filter((p) => {
      const matchesSearch =
        search === "" ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.aliases.some((a) => a.toLowerCase().includes(search.toLowerCase())) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !selectedCategory || p.category === selectedCategory;
      const matchesRoute = !selectedRoute || p.route === selectedRoute;
      const matchesStatus = !selectedStatus || p.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesRoute && matchesStatus;
    });
  }, [search, selectedCategory, selectedRoute, selectedStatus]);

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedRoute(null);
    setSelectedStatus(null);
    setSearch("");
  };

  const hasActiveFilters = selectedCategory || selectedRoute || selectedStatus || search;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Search & Filter */}
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dc-text-muted" />
            <Input
              placeholder="Search peptides by name, alias, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2.5 rounded-lg border text-sm font-medium flex items-center gap-2 transition-all ${
              showFilters || hasActiveFilters
                ? "bg-dc-accent/10 border-dc-accent/30 text-dc-accent"
                : "bg-dc-surface border-dc-border text-dc-text-muted hover:text-dc-text"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Filter panels */}
        {showFilters && (
          <div className="glass rounded-xl p-4 space-y-4">
            {/* Category */}
            <div>
              <p className="text-xs font-medium text-dc-text-muted mb-2 uppercase tracking-wide">
                Category
              </p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() =>
                      setSelectedCategory(selectedCategory === cat ? null : cat)
                    }
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      selectedCategory === cat
                        ? "bg-dc-accent/10 border-dc-accent/30 text-dc-accent"
                        : "bg-dc-surface border-dc-border text-dc-text-muted hover:text-dc-text"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Route */}
            <div>
              <p className="text-xs font-medium text-dc-text-muted mb-2 uppercase tracking-wide">
                Route
              </p>
              <div className="flex flex-wrap gap-2">
                {ROUTES.map((route) => (
                  <button
                    key={route}
                    onClick={() =>
                      setSelectedRoute(selectedRoute === route ? null : route)
                    }
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      selectedRoute === route
                        ? "bg-dc-clinical/10 border-dc-clinical/30 text-dc-clinical"
                        : "bg-dc-surface border-dc-border text-dc-text-muted hover:text-dc-text"
                    }`}
                  >
                    {route}
                  </button>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <p className="text-xs font-medium text-dc-text-muted mb-2 uppercase tracking-wide">
                Status
              </p>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map((status) => (
                  <button
                    key={status}
                    onClick={() =>
                      setSelectedStatus(selectedStatus === status ? null : status)
                    }
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      selectedStatus === status
                        ? "bg-dc-neon-purple/10 border-dc-neon-purple/30 text-dc-neon-purple"
                        : "bg-dc-surface border-dc-border text-dc-text-muted hover:text-dc-text"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-dc-accent hover:text-dc-accent-hover"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-dc-text-muted">
          {filtered.length} peptide{filtered.length !== 1 ? "s" : ""} found
        </p>
        {hasActiveFilters && (
          <div className="flex gap-2">
            {selectedCategory && (
              <Badge variant="expert" size="sm">
                {selectedCategory}
              </Badge>
            )}
            {selectedRoute && (
              <Badge variant="clinical" size="sm">
                {selectedRoute}
              </Badge>
            )}
            {selectedStatus && (
              <Badge variant="experimental" size="sm">
                {selectedStatus}
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((peptide) => (
          <PeptideCard key={peptide.slug} peptide={peptide} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-dc-text-muted">No peptides match your filters.</p>
          <button
            onClick={clearFilters}
            className="text-dc-accent hover:text-dc-accent-hover mt-2 text-sm"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
