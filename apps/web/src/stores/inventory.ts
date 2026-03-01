import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { InventoryItem, VialStatus } from '@/types';

// ── Derived Helpers ─────────────────────────────────────────────────────────

export function getVialStatus(item: InventoryItem): VialStatus {
  const pct = item.vialSizeMg > 0 ? (item.remainingMg / item.vialSizeMg) * 100 : 0;
  if (pct >= 50) return 'in-stock';
  if (pct >= 25) return 'low';
  if (pct >= 10) return 'critical';
  return 'depleted';
}

export function getDaysRemaining(item: InventoryItem): number {
  if (item.dosePerInjectionMcg <= 0 || item.injectionsPerWeek <= 0) return Infinity;
  const doseMg = item.dosePerInjectionMcg / 1000;
  const weeklyUsageMg = doseMg * item.injectionsPerWeek;
  if (weeklyUsageMg <= 0) return Infinity;
  return Math.floor((item.remainingMg / weeklyUsageMg) * 7);
}

export function getDepletionDate(item: InventoryItem): Date {
  const days = getDaysRemaining(item);
  const d = new Date();
  d.setDate(d.getDate() + (Number.isFinite(days) ? days : 365 * 10));
  return d;
}

export function getCostPerDose(item: InventoryItem): number {
  if (item.vialSizeMg <= 0 || item.dosePerInjectionMcg <= 0) return 0;
  const doseMg = item.dosePerInjectionMcg / 1000;
  const dosesPerVial = item.vialSizeMg / doseMg;
  return dosesPerVial > 0 ? item.costPerVial / dosesPerVial : 0;
}

export function getMonthlyCost(item: InventoryItem): number {
  return getCostPerDose(item) * item.injectionsPerWeek * 4.33;
}

export function getRemainingPct(item: InventoryItem): number {
  return item.vialSizeMg > 0
    ? Math.round((item.remainingMg / item.vialSizeMg) * 100)
    : 0;
}

// ── ID Generator ────────────────────────────────────────────────────────────

function generateId(): string {
  return `inv_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// ── Store ───────────────────────────────────────────────────────────────────

interface InventoryState {
  readonly items: readonly InventoryItem[];
  readonly addItem: (item: Omit<InventoryItem, 'id'>) => void;
  readonly updateItem: (id: string, updates: Partial<Omit<InventoryItem, 'id'>>) => void;
  readonly removeItem: (id: string) => void;
  readonly logDose: (itemId: string, doseMcg: number) => void;
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (data) => {
        const newItem: InventoryItem = { ...data, id: generateId() };
        set({ items: [...get().items, newItem] });
      },

      updateItem: (id, updates) => {
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, ...updates } : item,
          ),
        });
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      logDose: (itemId, doseMcg) => {
        const doseMg = doseMcg / 1000;
        set({
          items: get().items.map((item) =>
            item.id === itemId
              ? { ...item, remainingMg: Math.max(0, item.remainingMg - doseMg) }
              : item,
          ),
        });
      },
    }),
    {
      name: 'dc-inventory',
    },
  ),
);
