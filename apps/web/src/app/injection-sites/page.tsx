"use client";

import { useState, useMemo, useCallback } from "react";
import { MapPin, Syringe, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BodyDiagram } from "@/components/tracking/body-diagram";
import { INJECTION_SITES, MOCK_PEPTIDES } from "@/lib/mock-data";
import {
  useInjectionSitesStore,
  getTopRecommended,
  getRecencyColor,
} from "@/stores/injection-sites";
import type { InjectionSite, InjectionType } from "@/types";
import clsx from "clsx";

// ── Constants ───────────────────────────────────────────────────────────────

const RECENCY_COLORS: Record<"green" | "yellow" | "red" | "gray", { fill: string; label: string }> = {
  green: { fill: "#00ff88", label: "7+ days (safe)" },
  yellow: { fill: "#ffaa00", label: "3-6 days (caution)" },
  red: { fill: "#ff4444", label: "0-2 days (recent)" },
  gray: { fill: "#4a4a6a", label: "Never used" },
};

function scoreLabel(score: number): { text: string; color: string } {
  if (score >= 75) return { text: "Great rotation!", color: "#00ff88" };
  if (score >= 50) return { text: "Try new sites", color: "#ffaa00" };
  return { text: "Needs improvement", color: "#ff4444" };
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ── Circular Score Ring ─────────────────────────────────────────────────────

function RotationRing({ score }: { readonly score: number }) {
  const radius = 54;
  const strokeWidth = 7;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const { text, color } = scoreLabel(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex items-center justify-center">
        <svg width="136" height="136" viewBox="0 0 136 136" className="transform -rotate-90">
          <circle
            cx="68" cy="68" r={radius}
            fill="none" stroke="currentColor"
            className="text-dc-border" strokeWidth={strokeWidth}
          />
          <circle
            cx="68" cy="68" r={radius}
            fill="none" stroke={color}
            strokeWidth={strokeWidth} strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
            style={{ filter: `drop-shadow(0 0 6px ${color}60)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-dc-text">{score}%</span>
          <span className="text-[10px] text-dc-text-muted">rotation</span>
        </div>
      </div>
      <span className="text-xs font-medium" style={{ color }}>{text}</span>
    </div>
  );
}

function RecencyLegend() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 text-[9px]">
      {(["green", "yellow", "red", "gray"] as const).map((key) => (
        <span key={key} className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full"
            style={{ background: RECENCY_COLORS[key].fill, boxShadow: `0 0 4px ${RECENCY_COLORS[key].fill}60` }} />
          <span className="text-dc-text-muted">{RECENCY_COLORS[key].label}</span>
        </span>
      ))}
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────

export default function InjectionSitesPage() {
  const { history, logInjection, getRotationScore } = useInjectionSitesStore();
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const [formSiteId, setFormSiteId] = useState("");
  const [formPeptide, setFormPeptide] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formType, setFormType] = useState<InjectionType>("subq");

  const score = useMemo(() => getRotationScore(), [history, getRotationScore]);

  const subqRecommended = useMemo(
    () => getTopRecommended(history, "subq", 3),
    [history],
  );
  const imRecommended = useMemo(
    () => getTopRecommended(history, "im", 3),
    [history],
  );
  const recommended = formType === "subq" ? subqRecommended : imRecommended;

  const recentHistory = useMemo(
    () => [...history].reverse().slice(0, 20),
    [history],
  );

  const handleSelectSite = useCallback((site: InjectionSite) => {
    setSelectedSiteId(site.id);
    setFormSiteId(site.id);
    setFormType(site.type);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!formSiteId || !formPeptide) return;
    logInjection(formSiteId, formPeptide, formNotes || undefined);
    setFormSiteId("");
    setFormPeptide("");
    setFormNotes("");
    setSelectedSiteId(null);
  }, [formSiteId, formPeptide, formNotes, logInjection]);

  const siteLabel = (id: string) =>
    INJECTION_SITES.find((s) => s.id === id)?.label ?? id;

  // Build recency-colored sites for the diagram overlay info
  const siteRecencyMap = useMemo(() => {
    const map: Record<string, "green" | "yellow" | "red" | "gray"> = {};
    for (const site of INJECTION_SITES) {
      map[site.id] = getRecencyColor(history, site.id);
    }
    return map;
  }, [history]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(255,68,68,0.12)", boxShadow: "0 0 16px rgba(255,68,68,0.15)" }}
        >
          <MapPin className="w-5 h-5 text-dc-danger" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-dc-text tracking-tight">
            Injection Site Rotation
          </h1>
          <p className="text-xs text-dc-text-muted">
            Track, rotate, and optimize your injection sites
          </p>
        </div>
      </div>

      {/* Top Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Rotation Score */}
        <Card className="flex flex-col items-center justify-center py-6">
          <CardTitle className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-dc-neon-green" />
            Rotation Score
          </CardTitle>
          <RotationRing score={score} />
        </Card>

        {/* Recommended Next */}
        <Card>
          <CardTitle className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-4 h-4 text-dc-neon-cyan" />
            Recommended Next
          </CardTitle>
          <div className="flex gap-1 mb-3">
            {(["subq", "im"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFormType(t)}
                className={clsx(
                  "px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wide transition-all border",
                  formType === t
                    ? "bg-dc-accent/15 text-dc-accent border-dc-accent/30"
                    : "text-dc-text-muted border-dc-border hover:text-dc-text",
                )}
              >
                {t === "subq" ? "SubQ" : "IM"}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            {recommended.map(({ siteId, daysSince }, i) => (
              <button
                key={siteId}
                onClick={() => {
                  setFormSiteId(siteId);
                  setSelectedSiteId(siteId);
                }}
                className={clsx(
                  "w-full flex items-center gap-3 p-2.5 rounded-xl border transition-all text-left",
                  formSiteId === siteId
                    ? "bg-dc-accent/10 border-dc-accent/30"
                    : "bg-dc-surface-alt/40 border-dc-border/40 hover:border-dc-accent/20",
                )}
              >
                <span className="w-6 h-6 rounded-lg bg-dc-surface flex items-center justify-center text-[10px] font-bold text-dc-text-muted">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-dc-text truncate">
                    {siteLabel(siteId)}
                  </p>
                  <p className="text-[10px] text-dc-text-faint">
                    {daysSince === null ? "Never used" : `${daysSince} days ago`}
                  </p>
                </div>
                {daysSince === null && (
                  <Badge variant="success" size="xs">New</Badge>
                )}
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Body Map + History Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Body Map */}
        <Card>
          <CardTitle className="flex items-center gap-2 mb-3">
            <Syringe className="w-4 h-4 text-dc-accent" />
            Body Map
          </CardTitle>
          <BodyDiagram
            sites={INJECTION_SITES}
            selectedSiteId={selectedSiteId}
            onSelectSite={handleSelectSite}
          />
          {/* Recency overlay */}
          <div className="mt-3 pt-3 border-t border-dc-border/30">
            <div className="grid grid-cols-2 gap-1">
              {INJECTION_SITES.map((site) => (
                <button key={site.id} onClick={() => handleSelectSite(site)}
                  className={clsx("flex items-center gap-1.5 px-2 py-1 rounded-lg text-left transition-all",
                    selectedSiteId === site.id ? "bg-dc-surface-alt border border-dc-accent/30" : "hover:bg-dc-surface-alt/40")}>
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: RECENCY_COLORS[siteRecencyMap[site.id]].fill }} />
                  <span className="text-[9px] text-dc-text-muted truncate">{site.label}</span>
                </button>
              ))}
            </div>
            <div className="mt-2"><RecencyLegend /></div>
          </div>
        </Card>

        {/* Injection History */}
        <Card>
          <CardTitle className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-dc-warning" />
            Recent Injections
          </CardTitle>
          {recentHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Syringe className="w-8 h-8 text-dc-text-faint mb-2" />
              <p className="text-sm text-dc-text-muted">No injections logged yet</p>
              <p className="text-[10px] text-dc-text-faint mt-1">Log your first injection below</p>
            </div>
          ) : (
            <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
              {recentHistory.map((record, idx) => {
                const rc = getRecencyColor(history, record.siteId);
                return (
                  <div
                    key={`${record.date}-${idx}`}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-dc-surface-alt/40 border border-dc-border/30"
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: RECENCY_COLORS[rc].fill }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-dc-text truncate">
                        {siteLabel(record.siteId)}
                      </p>
                      <p className="text-[10px] text-dc-text-faint truncate">
                        {record.peptideName}
                        {record.notes ? ` -- ${record.notes}` : ""}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[10px] text-dc-text-muted">
                        {relativeTime(record.date)}
                      </p>
                      <p className="text-[9px] text-dc-text-faint">
                        {formatDate(record.date)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Log Injection Form */}
      <Card>
        <CardTitle className="flex items-center gap-2 mb-4">
          <MapPin className="w-4 h-4 text-dc-danger" />
          Log Injection
        </CardTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] text-dc-text-faint uppercase tracking-wide mb-1.5">Site</label>
            <select value={formSiteId} onChange={(e) => { setFormSiteId(e.target.value); setSelectedSiteId(e.target.value || null); }}
              className="w-full px-3 py-2.5 rounded-xl bg-dc-surface border border-dc-border text-sm text-dc-text focus:border-dc-accent/50 focus:outline-none transition-colors">
              <option value="">Select site...</option>
              <optgroup label="SubQ Sites">
                {INJECTION_SITES.filter((s) => s.type === "subq").map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </optgroup>
              <optgroup label="IM Sites">
                {INJECTION_SITES.filter((s) => s.type === "im").map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </optgroup>
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-dc-text-faint uppercase tracking-wide mb-1.5">Compound</label>
            <select value={formPeptide} onChange={(e) => setFormPeptide(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-dc-surface border border-dc-border text-sm text-dc-text focus:border-dc-accent/50 focus:outline-none transition-colors">
              <option value="">Select compound...</option>
              {MOCK_PEPTIDES.map((p) => (<option key={p.slug} value={p.name}>{p.name}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-dc-text-faint uppercase tracking-wide mb-1.5">Notes (optional)</label>
            <input type="text" value={formNotes} onChange={(e) => setFormNotes(e.target.value)}
              placeholder="e.g. slight bruise, painless..."
              className="w-full px-3 py-2.5 rounded-xl bg-dc-surface border border-dc-border text-sm text-dc-text placeholder:text-dc-text-faint focus:border-dc-accent/50 focus:outline-none transition-colors" />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!formSiteId || !formPeptide}
          className={clsx(
            "mt-4 w-full md:w-auto px-6 py-2.5 rounded-xl text-sm font-semibold transition-all",
            formSiteId && formPeptide
              ? "bg-dc-accent text-white hover:bg-dc-accent/90 shadow-lg shadow-dc-accent/20"
              : "bg-dc-surface-alt text-dc-text-faint cursor-not-allowed",
          )}
        >
          Log Injection
        </button>
      </Card>
    </div>
  );
}
