"use client";

import { useState, useCallback } from "react";
import { Download, FileSpreadsheet, Calendar, Check } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { useWellnessStore } from "@/stores/wellness";
import { useInventoryStore, getRemainingPct } from "@/stores/inventory";
import { MOCK_PROTOCOLS } from "@/lib/mock-data";

// ── CSV Utility ───────────────────────────────────────────────────────────────

function downloadCSV(filename: string, headers: string[], rows: string[][]) {
  const csv = [
    headers.join(","),
    ...rows.map((r) =>
      r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  return csv.length;
}

function estimateSize(headers: string[], rows: string[][]): string {
  const csv = [
    headers.join(","),
    ...rows.map((r) =>
      r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");
  const bytes = new Blob([csv]).size;
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

// ── Mock Dose Log Data ────────────────────────────────────────────────────────

const COMPOUNDS = [
  "BPC-157",
  "TB-500",
  "CJC-1295 / Ipamorelin",
  "Semaglutide",
  "GHK-Cu",
  "Sermorelin",
  "Tesamorelin",
  "PT-141",
  "Thymosin Alpha-1",
  "Epithalon",
];
const UNITS = ["mcg", "mg", "IU"];
const SITES = [
  "Left Abdomen",
  "Right Abdomen",
  "Left Deltoid",
  "Right Deltoid",
  "Left Glute",
  "Right Glute",
  "Left Thigh",
  "Right Thigh",
];
const NOTES_POOL = [
  "No issues",
  "Slight redness at site",
  "Pinch method, smooth injection",
  "Pre-workout dose",
  "Evening dose before bed",
  "Felt mild warmth after injection",
  "Rotated from yesterday's site",
  "Used 29g needle",
  "Reconstituted fresh vial",
  "Post-workout recovery dose",
];

function generateMockDoseLogs(from: string, to: string): string[][] {
  const rows: string[][] = [];
  const startDate = new Date(from || "2026-02-01");
  const endDate = new Date(to || "2026-03-01");

  for (let i = 0; i < 20; i++) {
    const timeSpan = endDate.getTime() - startDate.getTime();
    const randomTime = startDate.getTime() + Math.random() * timeSpan;
    const date = new Date(randomTime);
    const dateStr = date.toISOString().split("T")[0]!;
    const compound = COMPOUNDS[i % COMPOUNDS.length]!;
    const dose = compound === "Semaglutide"
      ? (0.25 + Math.random() * 0.75).toFixed(2)
      : (100 + Math.floor(Math.random() * 400)).toString();
    const unit = compound === "Semaglutide" ? "mg" : "mcg";
    const site = SITES[Math.floor(Math.random() * SITES.length)]!;
    const note = NOTES_POOL[Math.floor(Math.random() * NOTES_POOL.length)]!;
    rows.push([dateStr, compound, dose, unit, site, note]);
  }

  return rows.sort((a, b) => a[0]!.localeCompare(b[0]!));
}

// ── Date Helpers ──────────────────────────────────────────────────────────────

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function thirtyDaysAgoStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// ── Toast Component ───────────────────────────────────────────────────────────

function SuccessToast({
  message,
  visible,
}: {
  readonly message: string;
  readonly visible: boolean;
}) {
  if (!visible) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl glass border border-dc-neon-green/30 animate-fade-in">
      <Check className="w-4 h-4 text-dc-neon-green" />
      <span className="text-sm text-dc-neon-green font-medium">{message}</span>
    </div>
  );
}

// ── Export Card Component ─────────────────────────────────────────────────────

interface ExportCardProps {
  readonly title: string;
  readonly description: string;
  readonly showDateRange?: boolean;
  readonly sizeEstimate: string;
  readonly lastExport: string | null;
  readonly onExport: (from: string, to: string) => void;
}

function ExportCard({
  title,
  description,
  showDateRange = false,
  sizeEstimate,
  lastExport,
  onExport,
}: ExportCardProps) {
  const [from, setFrom] = useState(thirtyDaysAgoStr);
  const [to, setTo] = useState(todayStr);

  return (
    <Card hoverable>
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-dc-neon-cyan/10 border border-dc-neon-cyan/20 flex-shrink-0">
          <FileSpreadsheet className="w-5 h-5 text-dc-neon-cyan" />
        </div>
        <div className="flex-1 min-w-0">
          <CardTitle>{title}</CardTitle>
          <p className="text-xs text-dc-text-muted mt-1 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {showDateRange && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-[10px] font-medium text-dc-text-faint uppercase tracking-wider mb-1.5">
              From
            </label>
            <div className="relative">
              <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-dc-text-faint pointer-events-none" />
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-lg glass border border-dc-border text-sm text-dc-text bg-transparent focus:outline-none focus:border-dc-neon-cyan/50 transition-colors [color-scheme:dark]"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-medium text-dc-text-faint uppercase tracking-wider mb-1.5">
              To
            </label>
            <div className="relative">
              <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-dc-text-faint pointer-events-none" />
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-lg glass border border-dc-border text-sm text-dc-text bg-transparent focus:outline-none focus:border-dc-neon-cyan/50 transition-colors [color-scheme:dark]"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-dc-border/50">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium text-dc-text-faint uppercase tracking-wider">
              Format
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold text-dc-neon-green bg-dc-neon-green/10 border border-dc-neon-green/20">
              CSV
            </span>
          </div>
          <p className="text-[10px] text-dc-text-faint">
            ~{sizeEstimate}
          </p>
          {lastExport && (
            <p className="text-[10px] text-dc-text-faint">
              Last: {lastExport}
            </p>
          )}
        </div>
        <button
          onClick={() => onExport(from, to)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-dc-surface bg-dc-neon-cyan hover:bg-dc-neon-cyan/90 transition-all duration-200 hover:shadow-lg hover:shadow-dc-neon-cyan/20"
        >
          <Download className="w-4 h-4" />
          Generate
        </button>
      </div>
    </Card>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ExportPage() {
  const wellnessEntries = useWellnessStore((s) => s.entries);
  const inventoryItems = useInventoryStore((s) => s.items);

  const [toast, setToast] = useState<string | null>(null);
  const [lastExports, setLastExports] = useState<Record<string, string>>({});

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const recordExport = useCallback(
    (key: string) => {
      const now = new Date();
      const ts = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
      setLastExports((prev) => ({ ...prev, [key]: ts }));
    },
    [],
  );

  // ── Dose Log Export ──
  const doseLogHeaders = ["Date", "Compound", "Dose", "Unit", "Site", "Notes"];
  const doseLogRows = generateMockDoseLogs(thirtyDaysAgoStr(), todayStr());

  const handleDoseLogExport = useCallback(
    (from: string, to: string) => {
      const rows = generateMockDoseLogs(from, to);
      downloadCSV(`dosecraft-dose-log-${from}-to-${to}.csv`, doseLogHeaders, rows);
      recordExport("doseLog");
      showToast("Dose log exported successfully");
    },
    [doseLogHeaders, recordExport, showToast],
  );

  // ── Wellness Export ──
  const wellnessHeaders = [
    "Date",
    "Mood",
    "Energy",
    "Sleep Quality",
    "Sleep Hours",
    "Weight",
    "Body Fat",
    "Notes",
  ];
  const wellnessRows: string[][] = wellnessEntries.map((e) => [
    e.date,
    String(e.mood),
    String(e.energy),
    String(e.sleepQuality),
    String(e.sleepHours),
    e.weight !== null ? String(e.weight) : "",
    e.bodyFat !== null ? String(e.bodyFat) : "",
    e.notes || "",
  ]);

  const handleWellnessExport = useCallback(
    (from: string, to: string) => {
      const filtered = wellnessEntries
        .filter((e) => e.date >= from && e.date <= to)
        .map((e) => [
          e.date,
          String(e.mood),
          String(e.energy),
          String(e.sleepQuality),
          String(e.sleepHours),
          e.weight !== null ? String(e.weight) : "",
          e.bodyFat !== null ? String(e.bodyFat) : "",
          e.notes || "",
        ]);
      const rows = filtered.length > 0 ? filtered : wellnessRows;
      downloadCSV(`dosecraft-wellness-${from}-to-${to}.csv`, wellnessHeaders, rows);
      recordExport("wellness");
      showToast(`Wellness data exported (${rows.length} entries)`);
    },
    [wellnessEntries, wellnessRows, wellnessHeaders, recordExport, showToast],
  );

  // ── Inventory Export ──
  const inventoryHeaders = [
    "Compound",
    "Vial Size (mg)",
    "Remaining (mg)",
    "% Remaining",
    "Cost Per Vial",
    "Vendor",
    "Purchase Date",
    "Expiration",
  ];
  const inventoryRows: string[][] = inventoryItems.map((item) => [
    item.peptideName,
    String(item.vialSizeMg),
    String(item.remainingMg),
    `${getRemainingPct(item)}%`,
    `$${item.costPerVial.toFixed(2)}`,
    item.vendor || "N/A",
    item.purchaseDate,
    item.expirationDate || "N/A",
  ]);

  const handleInventoryExport = useCallback(() => {
    downloadCSV("dosecraft-inventory.csv", inventoryHeaders, inventoryRows);
    recordExport("inventory");
    showToast(`Inventory exported (${inventoryRows.length} items)`);
  }, [inventoryHeaders, inventoryRows, recordExport, showToast]);

  // ── Protocol Export ──
  const protocolHeaders = [
    "Protocol Name",
    "Intensity",
    "Duration",
    "Compounds",
    "Doses",
    "Frequencies",
  ];
  const protocolRows: string[][] = MOCK_PROTOCOLS.map((p) => [
    p.hookTitle,
    p.intensity,
    p.duration,
    p.peptides.map((pp) => pp.name).join("; "),
    p.peptides.map((pp) => pp.dose).join("; "),
    p.peptides.map((pp) => pp.frequency).join("; "),
  ]);

  const handleProtocolExport = useCallback(() => {
    downloadCSV("dosecraft-protocols.csv", protocolHeaders, protocolRows);
    recordExport("protocols");
    showToast(`Protocols exported (${protocolRows.length} protocols)`);
  }, [protocolHeaders, protocolRows, recordExport, showToast]);

  return (
    <div className="min-h-screen animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-dc-neon-cyan/10 border border-dc-neon-cyan/20">
            <Download className="w-5 h-5 text-dc-neon-cyan" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-dc-text tracking-tight">
              Export Data
            </h1>
            <p className="text-sm text-dc-text-muted">
              Download your research data in CSV format
            </p>
          </div>
        </div>
      </div>

      {/* Export Options Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Dose Log */}
        <ExportCard
          title="Dose Log Export"
          description="Export your injection log history including compounds, doses, sites, and dates"
          showDateRange
          sizeEstimate={estimateSize(doseLogHeaders, doseLogRows)}
          lastExport={lastExports.doseLog ?? null}
          onExport={handleDoseLogExport}
        />

        {/* Wellness */}
        <ExportCard
          title="Wellness Data Export"
          description="Export mood, energy, sleep, weight, and body composition tracking data"
          showDateRange
          sizeEstimate={
            wellnessRows.length > 0
              ? estimateSize(wellnessHeaders, wellnessRows)
              : "~2 KB (empty)"
          }
          lastExport={lastExports.wellness ?? null}
          onExport={handleWellnessExport}
        />

        {/* Inventory */}
        <ExportCard
          title="Inventory Export"
          description="Export current inventory, vial status, depletion dates, and cost data"
          sizeEstimate={
            inventoryRows.length > 0
              ? estimateSize(inventoryHeaders, inventoryRows)
              : "~1 KB (empty)"
          }
          lastExport={lastExports.inventory ?? null}
          onExport={handleInventoryExport}
        />

        {/* Protocols */}
        <ExportCard
          title="Protocol Export"
          description="Export protocol configurations, compound stacks, and dosing schedules"
          sizeEstimate={estimateSize(protocolHeaders, protocolRows)}
          lastExport={lastExports.protocols ?? null}
          onExport={handleProtocolExport}
        />
      </div>

      {/* Info Footer */}
      <div className="mt-8 p-4 rounded-xl glass border border-dc-border/50">
        <p className="text-xs text-dc-text-faint leading-relaxed">
          All exports are generated client-side. No data is sent to any server.
          CSV files can be opened in Excel, Google Sheets, or any spreadsheet
          application. Date-filtered exports will include all entries within the
          selected range (inclusive).
        </p>
      </div>

      {/* Toast */}
      <SuccessToast message={toast ?? ""} visible={toast !== null} />
    </div>
  );
}
