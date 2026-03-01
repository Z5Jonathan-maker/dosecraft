"use client";

import { useState, useMemo } from "react";
import {
  Bell,
  Plus,
  Trash2,
  Clock,
  MapPin,
  Calendar,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRemindersStore, type ReminderFrequency } from "@/stores/reminders";
import { MOCK_PEPTIDES, INJECTION_SITES } from "@/lib/mock-data";
import clsx from "clsx";

/* ─── Constants ─── */

const FREQUENCY_OPTIONS: readonly { readonly value: ReminderFrequency; readonly label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "every-other-day", label: "Every Other Day" },
  { value: "2x-week", label: "2x / Week" },
  { value: "weekly", label: "Weekly" },
  { value: "custom", label: "Custom" },
];

const FREQUENCY_LABELS: Record<ReminderFrequency, string> = {
  daily: "Daily",
  "every-other-day": "Every Other Day",
  "2x-week": "2x / Week",
  weekly: "Weekly",
  custom: "Custom",
};

const PEPTIDE_OPTIONS = MOCK_PEPTIDES.map((p) => p.name);
const SITE_OPTIONS = INJECTION_SITES.map((s) => s.label);

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

/* ─── Helpers ─── */

function formatTime12h(time24: string): string {
  const [hStr, mStr] = time24.split(":");
  const h = parseInt(hStr, 10);
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${mStr} ${suffix}`;
}

function getUpcomingDays(count: number): readonly Date[] {
  const days: Date[] = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  return days;
}

function reminderFiresOnDay(
  frequency: ReminderFrequency,
  dayIndex: number,
): boolean {
  switch (frequency) {
    case "daily":
      return true;
    case "every-other-day":
      return dayIndex % 2 === 0;
    case "2x-week":
      return dayIndex % 3 === 0 || dayIndex % 3 === 2;
    case "weekly":
      return dayIndex === 0;
    case "custom":
      return dayIndex % 2 === 0;
  }
}

/* ─── Page ─── */

export default function RemindersPage() {
  const { reminders, addReminder, toggleReminder, removeReminder } =
    useRemindersStore();

  // Form state
  const [formPeptide, setFormPeptide] = useState("");
  const [formFrequency, setFormFrequency] = useState<ReminderFrequency>("daily");
  const [formTime, setFormTime] = useState("08:00");
  const [formSite, setFormSite] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const upcomingDays = useMemo(() => getUpcomingDays(7), []);

  const activeReminders = reminders.filter((r) => r.active);
  const pausedReminders = reminders.filter((r) => !r.active);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPeptide || !formSite) return;

    addReminder({
      peptideName: formPeptide,
      frequency: formFrequency,
      time: formTime,
      site: formSite,
      active: true,
      notes: formNotes || undefined,
    });

    // Reset form
    setFormPeptide("");
    setFormFrequency("daily");
    setFormTime("08:00");
    setFormSite("");
    setFormNotes("");
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,170,0,0.15) 0%, rgba(255,107,53,0.08) 100%)",
            }}
          >
            <Bell className="w-5.5 h-5.5 text-dc-warning" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-dc-text tracking-tight">
              Reminders
            </h1>
            <p className="text-sm text-dc-text-muted">
              Set dose reminders and notifications
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
          style={{
            backgroundColor: showForm ? "rgba(255,68,68,0.1)" : "rgba(255,107,53,0.12)",
            color: showForm ? "#ff4444" : "#ff6b35",
            border: `1px solid ${showForm ? "rgba(255,68,68,0.25)" : "rgba(255,107,53,0.25)"}`,
          }}
        >
          {showForm ? (
            <>Cancel</>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Add Reminder
            </>
          )}
        </button>
      </div>

      {/* Info Banner */}
      <Card className="!p-3 !bg-dc-warning/5 border border-dc-warning/15">
        <div className="flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-dc-warning flex-shrink-0" />
          <p className="text-xs text-dc-text-muted">
            <span className="text-dc-warning font-medium">Demo Mode</span>{" "}
            &mdash; This is a UI preview. Push notifications are not active.
            Reminders are saved locally.
          </p>
        </div>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Active", value: activeReminders.length, color: "#00ff88" },
          { label: "Paused", value: pausedReminders.length, color: "#ffaa00" },
          { label: "Total", value: reminders.length, color: "#00d4ff" },
        ].map((stat) => (
          <Card key={stat.label} className="text-center !py-4">
            <p
              className="text-2xl font-bold"
              style={{ color: stat.color }}
            >
              {stat.value}
            </p>
            <p className="text-[10px] text-dc-text-faint uppercase tracking-wider mt-0.5">
              {stat.label}
            </p>
          </Card>
        ))}
      </div>

      {/* Add Reminder Form */}
      {showForm && (
        <Card className="animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Plus className="w-4.5 h-4.5 text-dc-accent" />
            <CardTitle>New Reminder</CardTitle>
          </div>

          {saveSuccess && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-dc-neon-green/10 border border-dc-neon-green/20 mb-4 text-dc-neon-green text-sm">
              <Bell className="w-4 h-4" />
              Reminder saved!
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            {/* Compound */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-dc-text-muted uppercase tracking-wide">
                Compound
              </label>
              <select
                value={formPeptide}
                onChange={(e) => setFormPeptide(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl text-sm text-dc-text bg-dc-surface border border-dc-border focus:outline-none focus:border-dc-accent focus:ring-2 focus:ring-dc-accent/15 transition-all duration-200 appearance-none cursor-pointer"
              >
                <option value="">Select compound...</option>
                {PEPTIDE_OPTIONS.map((p) => (
                  <option key={p} value={p} className="bg-dc-surface">
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Frequency */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-dc-text-muted uppercase tracking-wide">
                  Frequency
                </label>
                <select
                  value={formFrequency}
                  onChange={(e) =>
                    setFormFrequency(e.target.value as ReminderFrequency)
                  }
                  className="w-full px-4 py-2.5 rounded-xl text-sm text-dc-text bg-dc-surface border border-dc-border focus:outline-none focus:border-dc-accent focus:ring-2 focus:ring-dc-accent/15 transition-all duration-200 appearance-none cursor-pointer"
                >
                  {FREQUENCY_OPTIONS.map((f) => (
                    <option key={f.value} value={f.value} className="bg-dc-surface">
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-dc-text-muted uppercase tracking-wide">
                  Time
                </label>
                <input
                  type="time"
                  value={formTime}
                  onChange={(e) => setFormTime(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl text-sm text-dc-text bg-dc-surface border border-dc-border focus:outline-none focus:border-dc-accent focus:ring-2 focus:ring-dc-accent/15 transition-all duration-200"
                />
              </div>
            </div>

            {/* Injection Site */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-dc-text-muted uppercase tracking-wide">
                Injection Site
              </label>
              <select
                value={formSite}
                onChange={(e) => setFormSite(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl text-sm text-dc-text bg-dc-surface border border-dc-border focus:outline-none focus:border-dc-accent focus:ring-2 focus:ring-dc-accent/15 transition-all duration-200 appearance-none cursor-pointer"
              >
                <option value="">Select site...</option>
                {SITE_OPTIONS.map((s) => (
                  <option key={s} value={s} className="bg-dc-surface">
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-dc-text-muted uppercase tracking-wide">
                Notes (optional)
              </label>
              <textarea
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                placeholder="Any notes about this reminder..."
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl text-sm text-dc-text bg-dc-surface border border-dc-border placeholder:text-dc-text-muted/40 focus:outline-none focus:border-dc-accent focus:ring-2 focus:ring-dc-accent/15 transition-all duration-200 resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all"
              style={{
                background:
                  "linear-gradient(135deg, #ff6b35 0%, #ff8f5e 100%)",
                boxShadow: "0 4px 16px rgba(255,107,53,0.2)",
              }}
            >
              <Bell className="w-4 h-4" />
              Save Reminder
            </button>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Left: Active Reminders */}
        <div className="lg:col-span-3 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Bell className="w-4 h-4 text-dc-neon-green" />
            <h2 className="text-sm font-semibold text-dc-text uppercase tracking-wider">
              Active Reminders
            </h2>
            <Badge variant="success" size="xs">
              {activeReminders.length}
            </Badge>
          </div>

          {reminders.length === 0 ? (
            <Card className="text-center !py-10">
              <Bell className="w-8 h-8 text-dc-text-faint mx-auto mb-3" />
              <p className="text-sm text-dc-text-muted">No reminders yet</p>
              <p className="text-xs text-dc-text-faint mt-1">
                Tap &ldquo;Add Reminder&rdquo; to get started
              </p>
            </Card>
          ) : (
            <div className="space-y-2.5">
              {reminders.map((reminder) => (
                <Card
                  key={reminder.id}
                  hoverable
                  noPad
                  className="overflow-hidden"
                >
                  <div className="flex">
                    {/* Status bar */}
                    <div
                      className="w-1 flex-shrink-0 rounded-l-2xl"
                      style={{
                        backgroundColor: reminder.active
                          ? "#00ff88"
                          : "#ffaa00",
                      }}
                    />
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-semibold text-dc-text">
                              {reminder.peptideName}
                            </h3>
                            <Badge
                              variant={reminder.active ? "success" : "warning"}
                              size="xs"
                            >
                              {reminder.active ? "Active" : "Paused"}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-dc-text-muted">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTime12h(reminder.time)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {FREQUENCY_LABELS[reminder.frequency]}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {reminder.site}
                            </span>
                          </div>
                          {reminder.notes && (
                            <p className="text-xs text-dc-text-faint mt-1.5 italic">
                              {reminder.notes}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {/* Toggle */}
                          <button
                            onClick={() => toggleReminder(reminder.id)}
                            className={clsx(
                              "relative w-10 h-5 rounded-full transition-all duration-300 flex-shrink-0",
                              reminder.active
                                ? "bg-dc-neon-green/25"
                                : "bg-dc-surface",
                            )}
                            style={{
                              border: `1px solid ${reminder.active ? "rgba(0,255,136,0.3)" : "rgba(255,255,255,0.08)"}`,
                            }}
                          >
                            <div
                              className={clsx(
                                "absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300",
                                reminder.active
                                  ? "left-[22px] bg-dc-neon-green shadow-[0_0_8px_rgba(0,255,136,0.4)]"
                                  : "left-0.5 bg-dc-text-muted",
                              )}
                            />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => removeReminder(reminder.id)}
                            className="p-1.5 rounded-lg text-dc-text-faint hover:text-dc-danger hover:bg-dc-danger/10 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right: Upcoming 7-Day Schedule */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-dc-neon-cyan" />
            <h2 className="text-sm font-semibold text-dc-text uppercase tracking-wider">
              Upcoming 7 Days
            </h2>
          </div>

          <div className="space-y-2">
            {upcomingDays.map((day, dayIdx) => {
              const dayOfWeek =
                DAY_NAMES[day.getDay()];
              const dateStr = day.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
              const isToday = dayIdx === 0;

              const firingReminders = activeReminders.filter((r) =>
                reminderFiresOnDay(r.frequency, dayIdx),
              );

              return (
                <Card
                  key={dayIdx}
                  className={clsx(
                    "!p-3",
                    isToday && "border border-dc-accent/20",
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={clsx(
                          "text-xs font-bold",
                          isToday ? "text-dc-accent" : "text-dc-text",
                        )}
                      >
                        {dayOfWeek}
                      </span>
                      <span className="text-xs text-dc-text-muted">
                        {dateStr}
                      </span>
                      {isToday && (
                        <Badge variant="warning" size="xs">
                          Today
                        </Badge>
                      )}
                    </div>
                    <span className="text-[10px] text-dc-text-faint">
                      {firingReminders.length} dose
                      {firingReminders.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {firingReminders.length > 0 ? (
                    <div className="space-y-1">
                      {firingReminders.map((r) => (
                        <div
                          key={r.id}
                          className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-dc-surface/50"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-dc-neon-green flex-shrink-0" />
                          <span className="text-xs text-dc-text font-medium flex-1 truncate">
                            {r.peptideName}
                          </span>
                          <span className="text-[10px] text-dc-text-muted flex-shrink-0">
                            {formatTime12h(r.time)}
                          </span>
                          <ChevronRight className="w-3 h-3 text-dc-text-faint flex-shrink-0" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-dc-text-faint italic px-2 py-1">
                      No doses scheduled
                    </p>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
