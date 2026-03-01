import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ── Types ────────────────────────────────────────────────────────────────────

export type ReminderFrequency = "daily" | "every-other-day" | "2x-week" | "weekly" | "custom";

export interface Reminder {
  readonly id: string;
  readonly peptideName: string;
  readonly frequency: ReminderFrequency;
  readonly time: string; // HH:MM
  readonly site: string;
  readonly active: boolean;
  readonly notes?: string;
}

// ── ID Generator ─────────────────────────────────────────────────────────────

function generateId(): string {
  return `rem_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// ── Default Reminders ────────────────────────────────────────────────────────

const DEFAULT_REMINDERS: readonly Reminder[] = [
  {
    id: "rem_demo_1",
    peptideName: "BPC-157",
    frequency: "daily",
    time: "08:00",
    site: "Abdomen (Left)",
    active: true,
    notes: "Morning dose — SubQ",
  },
  {
    id: "rem_demo_2",
    peptideName: "CJC-1295 / Ipamorelin",
    frequency: "daily",
    time: "22:00",
    site: "Abdomen (Right)",
    active: true,
    notes: "Before bed for GH pulse",
  },
  {
    id: "rem_demo_3",
    peptideName: "Testosterone Cypionate",
    frequency: "weekly",
    time: "09:00",
    site: "Delt (Right)",
    active: true,
    notes: "Every Monday — IM",
  },
  {
    id: "rem_demo_4",
    peptideName: "Semaglutide",
    frequency: "weekly",
    time: "08:00",
    site: "Love Handle (Right)",
    active: false,
    notes: "Every Friday — paused for now",
  },
];

// ── Store ────────────────────────────────────────────────────────────────────

interface RemindersState {
  readonly reminders: readonly Reminder[];
  readonly addReminder: (data: Omit<Reminder, 'id'>) => void;
  readonly toggleReminder: (id: string) => void;
  readonly removeReminder: (id: string) => void;
}

export const useRemindersStore = create<RemindersState>()(
  persist(
    (set, get) => ({
      reminders: [...DEFAULT_REMINDERS],

      addReminder: (data) => {
        const newReminder: Reminder = { ...data, id: generateId() };
        set({ reminders: [...get().reminders, newReminder] });
      },

      toggleReminder: (id) => {
        set({
          reminders: get().reminders.map((r) =>
            r.id === id ? { ...r, active: !r.active } : r,
          ),
        });
      },

      removeReminder: (id) => {
        set({ reminders: get().reminders.filter((r) => r.id !== id) });
      },
    }),
    {
      name: 'dc-reminders',
    },
  ),
);
