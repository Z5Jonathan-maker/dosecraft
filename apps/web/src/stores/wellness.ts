import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WellnessEntry } from '@/types';

interface WellnessAverages {
  readonly mood: number;
  readonly energy: number;
  readonly sleepQuality: number;
  readonly sleepHours: number;
  readonly weight: number | null;
  readonly bodyFat: number | null;
}

interface WellnessState {
  readonly entries: readonly WellnessEntry[];
  readonly addEntry: (entry: Omit<WellnessEntry, 'id' | 'createdAt'>) => void;
  readonly getEntriesForRange: (days: number) => readonly WellnessEntry[];
  readonly getTodayEntry: () => WellnessEntry | undefined;
  readonly getAverages: (days: number) => WellnessAverages;
}

function generateId(): string {
  return `we_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function todayDateStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function daysAgoDateStr(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export const useWellnessStore = create<WellnessState>()(
  persist(
    (set, get) => ({
      entries: [],

      addEntry: (data) => {
        const newEntry: WellnessEntry = {
          ...data,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };
        const existing = get().entries;
        // Replace if same date, otherwise prepend
        const filtered = existing.filter((e) => e.date !== newEntry.date);
        set({ entries: [newEntry, ...filtered] });
      },

      getEntriesForRange: (days) => {
        const cutoff = daysAgoDateStr(days);
        return get()
          .entries.filter((e) => e.date >= cutoff)
          .toSorted((a, b) => a.date.localeCompare(b.date));
      },

      getTodayEntry: () => {
        const today = todayDateStr();
        return get().entries.find((e) => e.date === today);
      },

      getAverages: (days) => {
        const cutoff = daysAgoDateStr(days);
        const range = get().entries.filter((e) => e.date >= cutoff);
        if (range.length === 0) {
          return { mood: 0, energy: 0, sleepQuality: 0, sleepHours: 0, weight: null, bodyFat: null };
        }
        const n = range.length;
        const sum = range.reduce(
          (acc, e) => ({
            mood: acc.mood + e.mood,
            energy: acc.energy + e.energy,
            sleepQuality: acc.sleepQuality + e.sleepQuality,
            sleepHours: acc.sleepHours + e.sleepHours,
            weight: acc.weight + (e.weight ?? 0),
            bodyFat: acc.bodyFat + (e.bodyFat ?? 0),
            weightCount: acc.weightCount + (e.weight !== null ? 1 : 0),
            bodyFatCount: acc.bodyFatCount + (e.bodyFat !== null ? 1 : 0),
          }),
          { mood: 0, energy: 0, sleepQuality: 0, sleepHours: 0, weight: 0, bodyFat: 0, weightCount: 0, bodyFatCount: 0 },
        );
        return {
          mood: Math.round((sum.mood / n) * 10) / 10,
          energy: Math.round((sum.energy / n) * 10) / 10,
          sleepQuality: Math.round((sum.sleepQuality / n) * 10) / 10,
          sleepHours: Math.round((sum.sleepHours / n) * 10) / 10,
          weight: sum.weightCount > 0 ? Math.round((sum.weight / sum.weightCount) * 10) / 10 : null,
          bodyFat: sum.bodyFatCount > 0 ? Math.round((sum.bodyFat / sum.bodyFatCount) * 10) / 10 : null,
        };
      },
    }),
    {
      name: 'dc-wellness-entries',
    },
  ),
);
