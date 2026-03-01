"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";
import { Search, BookOpen, Layers, Star, ArrowRight, Clock, X } from "lucide-react";
import { MOCK_PEPTIDES, MOCK_PROTOCOLS, MOCK_CREATORS } from "@/lib/mock-data";

// ── Types ────────────────────────────────────────────────────────────────────

interface SearchResult {
  readonly id: string;
  readonly group: "Compounds" | "Protocols" | "Creators";
  readonly name: string;
  readonly subtitle: string;
  readonly route: string;
}

interface CommandPaletteProps {
  readonly open: boolean;
  readonly onClose: () => void;
}

// ── Suggested Searches ───────────────────────────────────────────────────────

const SUGGESTED_SEARCHES: readonly string[] = [
  "BPC-157",
  "Healing Stack",
  "Semaglutide",
  "Dr. Marcus Reed",
  "Longevity",
];

// ── Build Searchable Index ───────────────────────────────────────────────────

function buildIndex(): readonly SearchResult[] {
  const compounds: readonly SearchResult[] = MOCK_PEPTIDES.map((p) => ({
    id: `compound-${p.slug}`,
    group: "Compounds" as const,
    name: p.name,
    subtitle: `${p.category} \u00b7 ${p.typicalDoseRange}`,
    route: `/library/${p.slug}`,
  }));

  const protocols: readonly SearchResult[] = MOCK_PROTOCOLS.map((p) => ({
    id: `protocol-${p.id}`,
    group: "Protocols" as const,
    name: p.hookTitle,
    subtitle: p.subtitle,
    route: `/protocols/${p.id}`,
  }));

  const creators: readonly SearchResult[] = MOCK_CREATORS.map((c) => ({
    id: `creator-${c.slug}`,
    group: "Creators" as const,
    name: c.name,
    subtitle: c.specialty,
    route: `/creators/${c.slug}`,
  }));

  return [...compounds, ...protocols, ...creators];
}

// ── Search Logic ─────────────────────────────────────────────────────────────

function filterResults(
  index: readonly SearchResult[],
  query: string,
): readonly SearchResult[] {
  if (!query.trim()) return [];
  const lower = query.toLowerCase();
  return index.filter(
    (item) =>
      item.name.toLowerCase().includes(lower) ||
      item.subtitle.toLowerCase().includes(lower),
  );
}

// ── Group Icon Map ───────────────────────────────────────────────────────────

const GROUP_ICONS = {
  Compounds: BookOpen,
  Protocols: Layers,
  Creators: Star,
} as const;

const GROUP_ORDER: readonly (keyof typeof GROUP_ICONS)[] = [
  "Compounds",
  "Protocols",
  "Creators",
];

// ── Module-scope search index (built once) ──────────────────────────────────

const SEARCH_INDEX = buildIndex();

// ── Component ────────────────────────────────────────────────────────────────

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<readonly string[]>([]);

  const index = SEARCH_INDEX;
  const results = useMemo(() => filterResults(index, query), [index, query]);

  // Group results in stable order
  const groupedResults = useMemo(() => {
    const groups: { group: string; items: readonly SearchResult[] }[] = [];
    for (const g of GROUP_ORDER) {
      const items = results.filter((r) => r.group === g);
      if (items.length > 0) {
        groups.push({ group: g, items });
      }
    }
    return groups;
  }, [results]);

  // Flat list for keyboard navigation
  const flatResults = useMemo(
    () => groupedResults.flatMap((g) => g.items),
    [groupedResults],
  );

  // Reset state when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      // Focus input after a tick so the DOM is ready
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // Clamp active index when results change
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const active = listRef.current.querySelector("[data-active='true']");
    active?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const navigate = useCallback(
    (result: SearchResult) => {
      // Add to recent searches (max 5, no dupes)
      setRecentSearches((prev) => {
        const filtered = prev.filter((s) => s !== result.name);
        return [result.name, ...filtered].slice(0, 5);
      });
      onClose();
      router.push(result.route);
    },
    [onClose, router],
  );

  const handleTermClick = useCallback(
    (term: string) => {
      setQuery(term);
    },
    [],
  );

  const handleKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          setActiveIndex((i) => (i + 1) % Math.max(flatResults.length, 1));
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          setActiveIndex((i) =>
            i <= 0 ? Math.max(flatResults.length - 1, 0) : i - 1,
          );
          break;
        }
        case "Enter": {
          e.preventDefault();
          const target = flatResults[activeIndex];
          if (target) navigate(target);
          break;
        }
        case "Escape": {
          e.preventDefault();
          onClose();
          break;
        }
      }
    },
    [flatResults, activeIndex, navigate, onClose],
  );

  if (!open) return null;

  const showEmpty = query.trim().length > 0 && flatResults.length === 0;
  const showSuggestions = query.trim().length === 0;

  let flatIndex = -1;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed top-[18%] left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4 animate-fade-in">
        <div className="glass rounded-2xl border border-dc-border shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-dc-border">
            <Search className="w-4.5 h-4.5 text-dc-accent flex-shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              placeholder="Search compounds, protocols, creators..."
              className="flex-1 bg-transparent text-sm text-dc-text placeholder:text-dc-text-muted/50 outline-none"
            />
            {query.length > 0 && (
              <button
                onClick={() => setQuery("")}
                className="text-dc-text-muted hover:text-dc-text transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-dc-surface-alt border border-dc-border text-dc-text-faint flex-shrink-0">
              ESC
            </kbd>
          </div>

          {/* Results / Suggestions / Empty */}
          <div
            ref={listRef}
            className="max-h-[340px] overflow-y-auto overscroll-contain"
          >
            {/* Grouped Results */}
            {groupedResults.length > 0 && (
              <div className="py-2">
                {groupedResults.map(({ group, items }) => {
                  const Icon = GROUP_ICONS[group as keyof typeof GROUP_ICONS];
                  return (
                    <div key={group}>
                      {/* Group Header */}
                      <div className="px-4 py-1.5 flex items-center gap-2">
                        <Icon className="w-3 h-3 text-dc-text-faint" />
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-dc-text-faint">
                          {group}
                        </span>
                        <span className="text-[10px] text-dc-text-faint">
                          ({items.length})
                        </span>
                      </div>

                      {/* Items */}
                      {items.map((item) => {
                        flatIndex += 1;
                        const isActive = flatIndex === activeIndex;
                        const currentFlatIndex = flatIndex;
                        return (
                          <button
                            key={item.id}
                            data-active={isActive}
                            onClick={() => navigate(item)}
                            onMouseEnter={() => setActiveIndex(currentFlatIndex)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                              isActive
                                ? "bg-dc-surface-alt/80 text-dc-text"
                                : "text-dc-text-muted hover:text-dc-text hover:bg-dc-surface-alt/40"
                            }`}
                          >
                            <Icon
                              className={`w-4 h-4 flex-shrink-0 ${
                                isActive ? "text-dc-accent" : "text-dc-text-faint"
                              }`}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {item.name}
                              </p>
                              <p className="text-[11px] text-dc-text-muted truncate">
                                {item.subtitle}
                              </p>
                            </div>
                            {isActive && (
                              <ArrowRight className="w-3.5 h-3.5 text-dc-accent flex-shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Empty State */}
            {showEmpty && (
              <div className="p-6 text-center">
                <Search className="w-8 h-8 text-dc-text-faint mx-auto mb-3" />
                <p className="text-sm text-dc-text-muted">
                  No results for &ldquo;{query}&rdquo;
                </p>
                <p className="text-xs text-dc-text-faint mt-1">
                  Try searching for a compound, protocol, or creator name
                </p>
              </div>
            )}

            {/* Suggestions / Recents */}
            {showSuggestions && (
              <div className="py-2">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="mb-1">
                    <div className="px-4 py-1.5 flex items-center gap-2">
                      <Clock className="w-3 h-3 text-dc-text-faint" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-dc-text-faint">
                        Recent
                      </span>
                    </div>
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleTermClick(term)}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-dc-text-muted hover:text-dc-text hover:bg-dc-surface-alt/40 transition-colors text-left"
                      >
                        <Clock className="w-3.5 h-3.5 text-dc-text-faint flex-shrink-0" />
                        {term}
                      </button>
                    ))}
                  </div>
                )}

                {/* Suggested Searches */}
                <div>
                  <div className="px-4 py-1.5 flex items-center gap-2">
                    <Search className="w-3 h-3 text-dc-text-faint" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-dc-text-faint">
                      Suggestions
                    </span>
                  </div>
                  {SUGGESTED_SEARCHES.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleTermClick(term)}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-dc-text-muted hover:text-dc-text hover:bg-dc-surface-alt/40 transition-colors text-left"
                    >
                      <Search className="w-3.5 h-3.5 text-dc-text-faint flex-shrink-0" />
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-dc-border flex items-center justify-between">
            <div className="flex items-center gap-3 text-[10px] text-dc-text-faint">
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 rounded bg-dc-surface-alt border border-dc-border">
                  &uarr;&darr;
                </kbd>
                navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 rounded bg-dc-surface-alt border border-dc-border">
                  &crarr;
                </kbd>
                select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 rounded bg-dc-surface-alt border border-dc-border">
                  esc
                </kbd>
                close
              </span>
            </div>
            <span className="text-[10px] text-dc-text-faint">
              {flatResults.length > 0 && `${flatResults.length} results`}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
