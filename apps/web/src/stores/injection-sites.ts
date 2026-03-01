import { create } from "zustand";
import { persist } from "zustand/middleware";
import { INJECTION_SITES } from "@/lib/mock-data";
import type { InjectionType } from "@/types";

// ── Types ───────────────────────────────────────────────────────────────────

export interface InjectionRecord {
  readonly siteId: string;
  readonly date: string; // ISO timestamp
  readonly peptideName: string;
  readonly notes?: string;
}

interface InjectionSitesState {
  readonly history: readonly InjectionRecord[];
  readonly logInjection: (siteId: string, peptideName: string, notes?: string) => void;
  readonly getLastUsed: (siteId: string) => Date | null;
  readonly getNextRecommended: (type: InjectionType) => string;
  readonly getRotationScore: () => number;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function lastUsedDate(history: readonly InjectionRecord[], siteId: string): Date | null {
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].siteId === siteId) return new Date(history[i].date);
  }
  return null;
}

function leastRecentlyUsed(
  history: readonly InjectionRecord[],
  type: InjectionType,
): string {
  const candidates = INJECTION_SITES.filter((s) => s.type === type);
  if (candidates.length === 0) return "";

  let oldest: { id: string; time: number } = { id: candidates[0].id, time: Infinity };

  for (const site of candidates) {
    const last = lastUsedDate(history, site.id);
    const time = last ? last.getTime() : 0; // never used = oldest
    if (time < oldest.time) {
      oldest = { id: site.id, time };
    }
  }

  return oldest.id;
}

function computeRotationScore(history: readonly InjectionRecord[]): number {
  if (history.length === 0) return 100;

  // Look at last 30 entries
  const recent = history.slice(-30);
  const allSiteIds = INJECTION_SITES.map((s) => s.id);
  const usedSites = new Set(recent.map((r) => r.siteId));

  // Factor 1: Site diversity (how many unique sites used out of total)
  const diversityRatio = usedSites.size / allSiteIds.length;

  // Factor 2: No back-to-back repeats
  let repeats = 0;
  for (let i = 1; i < recent.length; i++) {
    if (recent[i].siteId === recent[i - 1].siteId) repeats++;
  }
  const repeatPenalty = recent.length > 1 ? repeats / (recent.length - 1) : 0;

  // Factor 3: Evenness of distribution (entropy-like)
  const counts: Record<string, number> = {};
  for (const r of recent) {
    counts[r.siteId] = (counts[r.siteId] ?? 0) + 1;
  }
  const values = Object.values(counts);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const evenness = max > 0 ? 1 - (max - min) / max : 1;

  const raw = diversityRatio * 40 + (1 - repeatPenalty) * 30 + evenness * 30;
  return Math.round(Math.max(0, Math.min(100, raw)));
}

// ── Store ───────────────────────────────────────────────────────────────────

export const useInjectionSitesStore = create<InjectionSitesState>()(
  persist(
    (set, get) => ({
      history: [],

      logInjection: (siteId, peptideName, notes) => {
        const record: InjectionRecord = {
          siteId,
          date: new Date().toISOString(),
          peptideName,
          notes: notes || undefined,
        };
        set({ history: [...get().history, record] });
      },

      getLastUsed: (siteId) => lastUsedDate(get().history, siteId),

      getNextRecommended: (type) => leastRecentlyUsed(get().history, type),

      getRotationScore: () => computeRotationScore(get().history),
    }),
    {
      name: "dc-injection-history",
    },
  ),
);

// ── Selectors ───────────────────────────────────────────────────────────────

export function getTopRecommended(
  history: readonly InjectionRecord[],
  type: InjectionType,
  count: number,
): readonly { siteId: string; daysSince: number | null }[] {
  const candidates = INJECTION_SITES.filter((s) => s.type === type);
  const now = Date.now();

  const ranked = candidates.map((site) => {
    const last = lastUsedDate(history, site.id);
    const daysSince = last ? Math.floor((now - last.getTime()) / 86_400_000) : null;
    return { siteId: site.id, daysSince };
  });

  // Sort: never used first (null), then most days since
  ranked.sort((a, b) => {
    if (a.daysSince === null && b.daysSince === null) return 0;
    if (a.daysSince === null) return -1;
    if (b.daysSince === null) return 1;
    return b.daysSince - a.daysSince;
  });

  return ranked.slice(0, count);
}

export function getRecencyColor(
  history: readonly InjectionRecord[],
  siteId: string,
): "green" | "yellow" | "red" | "gray" {
  const last = lastUsedDate(history, siteId);
  if (!last) return "gray";
  const days = Math.floor((Date.now() - last.getTime()) / 86_400_000);
  if (days >= 7) return "green";
  if (days >= 3) return "yellow";
  return "red";
}
