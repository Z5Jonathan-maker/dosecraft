// ── Evidence Lane ──
export type EvidenceLane = "clinical" | "expert" | "experimental";

// ── Peptide ──
export interface Peptide {
  readonly slug: string;
  readonly name: string;
  readonly aliases: readonly string[];
  readonly category: PeptideCategory;
  readonly route: AdministrationRoute;
  readonly status: PeptideStatus;
  readonly description: string;
  readonly lanes: readonly EvidenceLane[];
  readonly contraindications: readonly string[];
  readonly interactions: readonly string[];
  readonly laneData: Readonly<Record<EvidenceLane, LaneData | null>>;
}

export type PeptideCategory =
  | "healing"
  | "growth-hormone"
  | "metabolic"
  | "cosmetic"
  | "neuroprotective"
  | "sleep"
  | "immune";

export type AdministrationRoute = "subcutaneous" | "oral" | "topical" | "intranasal" | "intramuscular";

export type PeptideStatus = "well-researched" | "emerging" | "experimental" | "novel";

export interface LaneData {
  readonly summary: string;
  readonly dosageRange: string;
  readonly frequency: string;
  readonly duration: string;
  readonly confidence: number; // 0-100
  readonly sources: readonly string[];
}

// ── Protocol ──
export interface Protocol {
  readonly id: string;
  readonly hookTitle: string;
  readonly subtitle: string;
  readonly intensity: ProtocolIntensity;
  readonly goals: readonly string[];
  readonly contentAngle: EvidenceLane;
  readonly peptides: readonly ProtocolPeptide[];
  readonly duration: string;
  readonly description: string;
}

export type ProtocolIntensity = "conservative" | "standard" | "aggressive";

export interface ProtocolPeptide {
  readonly slug: string;
  readonly name: string;
  readonly dose: string;
  readonly frequency: string;
  readonly route: AdministrationRoute;
  readonly timing: string;
}

// ── Tracking ──
export interface DailyDose {
  readonly id: string;
  readonly peptideName: string;
  readonly dose: string;
  readonly route: AdministrationRoute;
  readonly site: string;
  readonly scheduledTime: string;
  readonly taken: boolean;
  readonly takenAt: string | null;
}

export interface OutcomeMetrics {
  readonly date: string;
  readonly weight: number | null;
  readonly bodyFat: number | null;
  readonly mood: number | null; // 1-10
  readonly sleep: number | null; // 1-10
  readonly energy: number | null; // 1-10
  readonly soreness: number | null; // 1-10
  readonly notes: string;
}

// ── Insights ──
export interface InsightCard {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly type: "positive" | "neutral" | "warning";
  readonly metric: string;
  readonly change: string;
}

export interface TimeSeriesPoint {
  readonly date: string;
  readonly weight: number | null;
  readonly bodyFat: number | null;
  readonly mood: number | null;
  readonly sleep: number | null;
  readonly energy: number | null;
}

export interface ProtocolTimeline {
  readonly protocolId: string;
  readonly name: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly color: string;
}

// ── Calculator ──
export interface ReconstitutionResult {
  readonly concentrationMcgPerUnit: number;
  readonly concentrationMgPerMl: number;
  readonly totalUnits: number;
}

// ── Navigation ──
export interface NavItem {
  readonly label: string;
  readonly href: string;
  readonly icon: string;
}
