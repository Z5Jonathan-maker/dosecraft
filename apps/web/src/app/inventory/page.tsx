"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Package,
  Plus,
  Search,
  Syringe,
  DollarSign,
  AlertTriangle,
  CalendarClock,
  Pencil,
  Trash2,
  X,
  FlaskConical,
} from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_PEPTIDES } from "@/lib/mock-data";
import {
  useInventoryStore,
  getVialStatus,
  getDaysRemaining,
  getDepletionDate,
  getCostPerDose,
  getMonthlyCost,
  getRemainingPct,
} from "@/stores/inventory";
import type { InventoryItem, VialStatus } from "@/types";
import clsx from "clsx";

// ── Constants ───────────────────────────────────────────────────────────────

const STATUS_FILTERS = ["all", "in-stock", "low", "critical", "depleted"] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

const STATUS_CONFIG: Record<VialStatus, { label: string; variant: "success" | "warning" | "danger" | "neutral" }> = {
  "in-stock": { label: "In Stock", variant: "success" },
  low:        { label: "Low", variant: "warning" },
  critical:   { label: "Critical", variant: "danger" },
  depleted:   { label: "Depleted", variant: "neutral" },
};

const FILTER_LABELS: Record<StatusFilter, string> = {
  all: "All",
  "in-stock": "In Stock",
  low: "Low",
  critical: "Critical",
  depleted: "Depleted",
};

// ── Helpers ─────────────────────────────────────────────────────────────────

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatCurrency(n: number): string {
  return `$${n.toFixed(2)}`;
}

function progressColor(pct: number): string {
  if (pct >= 50) return "bg-dc-neon-green";
  if (pct >= 25) return "bg-dc-warning";
  return "bg-dc-danger";
}

function progressGradient(pct: number): string {
  if (pct >= 50) return "from-dc-neon-green to-dc-neon-cyan";
  if (pct >= 25) return "from-dc-warning to-dc-accent";
  return "from-dc-danger to-dc-warning";
}

// ── Empty Form State ────────────────────────────────────────────────────────

interface FormData {
  readonly peptideSlug: string;
  readonly vialSizeMg: string;
  readonly reconstitutionVolumeMl: string;
  readonly dosePerInjectionMcg: string;
  readonly injectionsPerWeek: string;
  readonly costPerVial: string;
  readonly purchaseDate: string;
  readonly expirationDate: string;
  readonly vendor: string;
  readonly lotNumber: string;
  readonly notes: string;
}

const EMPTY_FORM: FormData = {
  peptideSlug: "",
  vialSizeMg: "",
  reconstitutionVolumeMl: "",
  dosePerInjectionMcg: "",
  injectionsPerWeek: "",
  costPerVial: "",
  purchaseDate: todayStr(),
  expirationDate: "",
  vendor: "",
  lotNumber: "",
  notes: "",
};

// ── Page Component ──────────────────────────────────────────────────────────

export default function InventoryPage() {
  const { items, addItem, updateItem, removeItem, logDose } = useInventoryStore();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // ── Form helpers ──────────────────────────────────────────────────────────

  const updateField = useCallback(
    <K extends keyof FormData>(field: K, value: FormData[K]) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const openAddModal = useCallback(() => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }, []);

  const openEditModal = useCallback((item: InventoryItem) => {
    setEditingId(item.id);
    setForm({
      peptideSlug: item.peptideSlug,
      vialSizeMg: String(item.vialSizeMg),
      reconstitutionVolumeMl: String(item.reconstitutionVolumeMl),
      dosePerInjectionMcg: String(item.dosePerInjectionMcg),
      injectionsPerWeek: String(item.injectionsPerWeek),
      costPerVial: String(item.costPerVial),
      purchaseDate: item.purchaseDate,
      expirationDate: item.expirationDate ?? "",
      vendor: item.vendor ?? "",
      lotNumber: item.lotNumber ?? "",
      notes: item.notes ?? "",
    });
    setModalOpen(true);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const peptide = MOCK_PEPTIDES.find((p) => p.slug === form.peptideSlug);
      if (!peptide) return;

      const vialSizeMg = parseFloat(form.vialSizeMg) || 0;
      const data = {
        peptideSlug: form.peptideSlug,
        peptideName: peptide.name,
        vialSizeMg,
        remainingMg: vialSizeMg,
        reconstitutionVolumeMl: parseFloat(form.reconstitutionVolumeMl) || 0,
        dosePerInjectionMcg: parseFloat(form.dosePerInjectionMcg) || 0,
        injectionsPerWeek: parseInt(form.injectionsPerWeek, 10) || 0,
        costPerVial: parseFloat(form.costPerVial) || 0,
        purchaseDate: form.purchaseDate,
        expirationDate: form.expirationDate || undefined,
        vendor: form.vendor || undefined,
        lotNumber: form.lotNumber || undefined,
        notes: form.notes || undefined,
      };

      if (editingId) {
        // When editing, preserve the current remainingMg unless vial size changed
        const existing = items.find((i) => i.id === editingId);
        const remainingMg =
          existing && existing.vialSizeMg === vialSizeMg
            ? existing.remainingMg
            : vialSizeMg;
        updateItem(editingId, { ...data, remainingMg });
      } else {
        addItem(data);
      }

      setModalOpen(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
    },
    [form, editingId, items, addItem, updateItem],
  );

  // ── Derived data ──────────────────────────────────────────────────────────

  const enrichedItems = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        status: getVialStatus(item),
        daysRemaining: getDaysRemaining(item),
        depletionDate: getDepletionDate(item),
        costPerDose: getCostPerDose(item),
        monthlyCost: getMonthlyCost(item),
        remainingPct: getRemainingPct(item),
      })),
    [items],
  );

  const filteredItems = useMemo(() => {
    const lowerQ = searchQuery.toLowerCase();
    return enrichedItems.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (
        lowerQ &&
        !item.peptideName.toLowerCase().includes(lowerQ) &&
        !(item.vendor ?? "").toLowerCase().includes(lowerQ)
      )
        return false;
      return true;
    });
  }, [enrichedItems, statusFilter, searchQuery]);

  // ── Summary stats ─────────────────────────────────────────────────────────

  const totalItems = enrichedItems.length;
  const lowOrCritical = enrichedItems.filter((i) => i.status === "low" || i.status === "critical").length;
  const totalMonthlyCost = enrichedItems.reduce((acc, i) => acc + i.monthlyCost, 0);
  const soonestDepletion = enrichedItems
    .filter((i) => Number.isFinite(i.daysRemaining) && i.status !== "depleted")
    .sort((a, b) => a.daysRemaining - b.daysRemaining)[0];

  const statusCounts = useMemo(() => {
    const counts: Record<StatusFilter, number> = { all: totalItems, "in-stock": 0, low: 0, critical: 0, depleted: 0 };
    for (const item of enrichedItems) {
      counts[item.status]++;
    }
    return counts;
  }, [enrichedItems, totalItems]);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dc-text tracking-tight flex items-center gap-2.5">
            <Package className="w-6 h-6 text-dc-warning" />
            Inventory
          </h1>
          <p className="text-sm text-dc-text-muted mt-1">Track your vials, supplies, and spend</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                     bg-dc-accent/15 text-dc-accent border border-dc-accent/25
                     hover:bg-dc-accent/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Vial
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-dc-neon-cyan/10">
              <Package className="w-4.5 h-4.5 text-dc-neon-cyan" />
            </div>
            <div>
              <p className="text-[11px] text-dc-text-faint uppercase tracking-wider">Total Items</p>
              <p className="text-xl font-bold text-dc-text">{totalItems}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-dc-warning/10">
              <AlertTriangle className="w-4.5 h-4.5 text-dc-warning" />
            </div>
            <div>
              <p className="text-[11px] text-dc-text-faint uppercase tracking-wider">Low / Critical</p>
              <p className="text-xl font-bold text-dc-warning">{lowOrCritical}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-dc-neon-green/10">
              <DollarSign className="w-4.5 h-4.5 text-dc-neon-green" />
            </div>
            <div>
              <p className="text-[11px] text-dc-text-faint uppercase tracking-wider">Monthly Spend</p>
              <p className="text-xl font-bold text-dc-text">{formatCurrency(totalMonthlyCost)}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-dc-accent/10">
              <CalendarClock className="w-4.5 h-4.5 text-dc-accent" />
            </div>
            <div>
              <p className="text-[11px] text-dc-text-faint uppercase tracking-wider">Next Reorder</p>
              <p className="text-sm font-bold text-dc-text">
                {soonestDepletion
                  ? `${soonestDepletion.daysRemaining}d — ${soonestDepletion.peptideName}`
                  : "—"}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Status chips */}
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={clsx(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                statusFilter === f
                  ? "bg-dc-accent/15 text-dc-accent border-dc-accent/40"
                  : "bg-dc-surface text-dc-text-muted border-dc-border hover:text-dc-text hover:border-dc-border/80",
              )}
            >
              {FILTER_LABELS[f]} ({statusCounts[f]})
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative sm:ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-dc-text-faint" />
          <input
            type="text"
            placeholder="Search peptide or vendor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 pl-9 pr-4 py-2 rounded-xl text-sm bg-dc-surface border border-dc-border
                       text-dc-text placeholder:text-dc-text-faint focus:outline-none focus:border-dc-accent/50
                       transition-colors"
          />
        </div>
      </div>

      {/* Inventory Grid */}
      {filteredItems.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-dc-surface-alt flex items-center justify-center mb-4">
            <FlaskConical className="w-8 h-8 text-dc-text-faint" />
          </div>
          <p className="text-lg font-semibold text-dc-text mb-1">
            {totalItems === 0 ? "No vials yet" : "No matches"}
          </p>
          <p className="text-sm text-dc-text-muted mb-5 max-w-xs">
            {totalItems === 0
              ? "Add your first vial to start tracking inventory, costs, and reorder dates."
              : "Try a different filter or search term."}
          </p>
          {totalItems === 0 && (
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
                         bg-dc-accent text-white hover:bg-dc-accent/90 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Your First Vial
            </button>
          )}
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => {
            const cfg = STATUS_CONFIG[item.status];
            return (
              <Card key={item.id} hoverable className="relative group">
                {/* Top row: name + status */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-dc-text truncate">{item.peptideName}</h3>
                    {item.vendor && (
                      <p className="text-[11px] text-dc-text-faint mt-0.5 truncate">{item.vendor}</p>
                    )}
                  </div>
                  <Badge variant={cfg.variant} size="xs">
                    {cfg.label}
                  </Badge>
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-dc-text-muted">
                      {item.remainingMg.toFixed(1)} / {item.vialSizeMg} mg
                    </span>
                    <span className={clsx("font-semibold", item.remainingPct >= 50 ? "text-dc-neon-green" : item.remainingPct >= 25 ? "text-dc-warning" : "text-dc-danger")}>
                      {item.remainingPct}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-dc-surface-alt overflow-hidden">
                    <div
                      className={clsx("h-full rounded-full bg-gradient-to-r transition-all duration-500", progressGradient(item.remainingPct))}
                      style={{ width: `${Math.max(item.remainingPct, 1)}%` }}
                    />
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] mb-4">
                  <div className="flex justify-between">
                    <span className="text-dc-text-faint">Days left</span>
                    <span className="text-dc-text font-medium">
                      {Number.isFinite(item.daysRemaining) ? item.daysRemaining : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dc-text-faint">Cost/dose</span>
                    <span className="text-dc-text font-medium">{formatCurrency(item.costPerDose)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dc-text-faint">Vial size</span>
                    <span className="text-dc-text font-medium">{item.vialSizeMg} mg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dc-text-faint">Monthly</span>
                    <span className="text-dc-text font-medium">{formatCurrency(item.monthlyCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dc-text-faint">Dose</span>
                    <span className="text-dc-text font-medium">{item.dosePerInjectionMcg} mcg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dc-text-faint">Freq</span>
                    <span className="text-dc-text font-medium">{item.injectionsPerWeek}x/wk</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-dc-border/50">
                  <button
                    onClick={() => logDose(item.id, item.dosePerInjectionMcg)}
                    disabled={item.status === "depleted"}
                    className={clsx(
                      "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all",
                      item.status === "depleted"
                        ? "bg-dc-surface-alt text-dc-text-faint cursor-not-allowed"
                        : "bg-dc-neon-green/12 text-dc-neon-green border border-dc-neon-green/25 hover:bg-dc-neon-green/20",
                    )}
                  >
                    <Syringe className="w-3.5 h-3.5" />
                    Log Dose
                  </button>
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-2 rounded-xl text-dc-text-muted hover:text-dc-text hover:bg-dc-surface-alt transition-all"
                    title="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  {deleteConfirmId === item.id ? (
                    <button
                      onClick={() => {
                        removeItem(item.id);
                        setDeleteConfirmId(null);
                      }}
                      className="p-2 rounded-xl text-dc-danger bg-dc-danger/10 border border-dc-danger/25
                                 hover:bg-dc-danger/20 transition-all"
                      title="Confirm delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(item.id)}
                      className="p-2 rounded-xl text-dc-text-faint hover:text-dc-danger hover:bg-dc-danger/10 transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── Add / Edit Modal ────────────────────────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => {
              setModalOpen(false);
              setEditingId(null);
            }}
          />

          {/* Panel */}
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto glass rounded-2xl border border-dc-border p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-dc-text">
                {editingId ? "Edit Vial" : "Add New Vial"}
              </h2>
              <button
                onClick={() => {
                  setModalOpen(false);
                  setEditingId(null);
                }}
                className="p-1.5 rounded-lg hover:bg-dc-surface-alt text-dc-text-muted hover:text-dc-text transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Peptide Selector */}
              <div>
                <label className="block text-[11px] text-dc-text-faint uppercase tracking-wider mb-1.5">
                  Peptide *
                </label>
                <select
                  required
                  value={form.peptideSlug}
                  onChange={(e) => updateField("peptideSlug", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm bg-dc-surface border border-dc-border
                             text-dc-text focus:outline-none focus:border-dc-accent/50 transition-colors
                             appearance-none cursor-pointer"
                >
                  <option value="" disabled>
                    Select a peptide...
                  </option>
                  {MOCK_PEPTIDES.map((p) => (
                    <option key={p.slug} value={p.slug} className="bg-dc-surface text-dc-text">
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Row: Vial Size + Reconstitution Volume */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-dc-text-faint uppercase tracking-wider mb-1.5">
                    Vial Size (mg) *
                  </label>
                  <input
                    required
                    type="number"
                    step="any"
                    min="0.01"
                    value={form.vialSizeMg}
                    onChange={(e) => updateField("vialSizeMg", e.target.value)}
                    placeholder="5"
                    className="w-full px-3 py-2.5 rounded-xl text-sm bg-dc-surface border border-dc-border
                               text-dc-text placeholder:text-dc-text-faint focus:outline-none focus:border-dc-accent/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-dc-text-faint uppercase tracking-wider mb-1.5">
                    Reconstitution (mL) *
                  </label>
                  <input
                    required
                    type="number"
                    step="any"
                    min="0.1"
                    value={form.reconstitutionVolumeMl}
                    onChange={(e) => updateField("reconstitutionVolumeMl", e.target.value)}
                    placeholder="2"
                    className="w-full px-3 py-2.5 rounded-xl text-sm bg-dc-surface border border-dc-border
                               text-dc-text placeholder:text-dc-text-faint focus:outline-none focus:border-dc-accent/50 transition-colors"
                  />
                </div>
              </div>

              {/* Row: Dose + Frequency */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-dc-text-faint uppercase tracking-wider mb-1.5">
                    Dose per Injection (mcg) *
                  </label>
                  <input
                    required
                    type="number"
                    step="any"
                    min="1"
                    value={form.dosePerInjectionMcg}
                    onChange={(e) => updateField("dosePerInjectionMcg", e.target.value)}
                    placeholder="250"
                    className="w-full px-3 py-2.5 rounded-xl text-sm bg-dc-surface border border-dc-border
                               text-dc-text placeholder:text-dc-text-faint focus:outline-none focus:border-dc-accent/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-dc-text-faint uppercase tracking-wider mb-1.5">
                    Injections / Week *
                  </label>
                  <input
                    required
                    type="number"
                    step="1"
                    min="1"
                    max="21"
                    value={form.injectionsPerWeek}
                    onChange={(e) => updateField("injectionsPerWeek", e.target.value)}
                    placeholder="7"
                    className="w-full px-3 py-2.5 rounded-xl text-sm bg-dc-surface border border-dc-border
                               text-dc-text placeholder:text-dc-text-faint focus:outline-none focus:border-dc-accent/50 transition-colors"
                  />
                </div>
              </div>

              {/* Row: Cost + Purchase Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-dc-text-faint uppercase tracking-wider mb-1.5">
                    Cost per Vial ($) *
                  </label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.costPerVial}
                    onChange={(e) => updateField("costPerVial", e.target.value)}
                    placeholder="45.00"
                    className="w-full px-3 py-2.5 rounded-xl text-sm bg-dc-surface border border-dc-border
                               text-dc-text placeholder:text-dc-text-faint focus:outline-none focus:border-dc-accent/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-dc-text-faint uppercase tracking-wider mb-1.5">
                    Purchase Date *
                  </label>
                  <input
                    required
                    type="date"
                    value={form.purchaseDate}
                    onChange={(e) => updateField("purchaseDate", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-sm bg-dc-surface border border-dc-border
                               text-dc-text focus:outline-none focus:border-dc-accent/50 transition-colors"
                  />
                </div>
              </div>

              {/* Optional: Expiration */}
              <div>
                <label className="block text-[11px] text-dc-text-faint uppercase tracking-wider mb-1.5">
                  Expiration Date
                </label>
                <input
                  type="date"
                  value={form.expirationDate}
                  onChange={(e) => updateField("expirationDate", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm bg-dc-surface border border-dc-border
                             text-dc-text focus:outline-none focus:border-dc-accent/50 transition-colors"
                />
              </div>

              {/* Row: Vendor + Lot */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-dc-text-faint uppercase tracking-wider mb-1.5">
                    Vendor
                  </label>
                  <input
                    type="text"
                    value={form.vendor}
                    onChange={(e) => updateField("vendor", e.target.value)}
                    placeholder="Peptide Sciences"
                    className="w-full px-3 py-2.5 rounded-xl text-sm bg-dc-surface border border-dc-border
                               text-dc-text placeholder:text-dc-text-faint focus:outline-none focus:border-dc-accent/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-dc-text-faint uppercase tracking-wider mb-1.5">
                    Lot Number
                  </label>
                  <input
                    type="text"
                    value={form.lotNumber}
                    onChange={(e) => updateField("lotNumber", e.target.value)}
                    placeholder="LOT-2026-001"
                    className="w-full px-3 py-2.5 rounded-xl text-sm bg-dc-surface border border-dc-border
                               text-dc-text placeholder:text-dc-text-faint focus:outline-none focus:border-dc-accent/50 transition-colors"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[11px] text-dc-text-faint uppercase tracking-wider mb-1.5">
                  Notes
                </label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  placeholder="Storage conditions, batch notes..."
                  className="w-full px-3 py-2.5 rounded-xl text-sm bg-dc-surface border border-dc-border
                             text-dc-text placeholder:text-dc-text-faint focus:outline-none focus:border-dc-accent/50
                             transition-colors resize-none"
                />
              </div>

              {/* Submit */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium
                             bg-dc-accent text-white hover:bg-dc-accent/90 transition-all"
                >
                  {editingId ? "Save Changes" : "Add Vial"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false);
                    setEditingId(null);
                  }}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-dc-text-muted
                             border border-dc-border hover:text-dc-text hover:bg-dc-surface-alt transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
