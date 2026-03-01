// ── Evidence Lane ──
export type EvidenceLane = "clinical" | "expert" | "experimental";

// ── FDA Status ──
export type FDAStatus = "approved" | "phase-3" | "phase-2" | "phase-1" | "research-only" | "compoundable" | "otc" | "supplement" | "caution";

// ── Peptide ──
export interface Peptide {
  readonly slug: string;
  readonly name: string;
  readonly aliases: readonly string[];
  readonly category: PeptideCategory;
  readonly route: AdministrationRoute;
  readonly status: PeptideStatus;
  readonly fdaStatus: FDAStatus;
  readonly description: string;
  readonly halfLife: string;
  readonly typicalDoseRange: string;
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
  | "immune"
  | "hormonal"
  | "sexual-health";

export type AdministrationRoute =
  | "subcutaneous"
  | "oral"
  | "topical"
  | "intranasal"
  | "intramuscular";

export type PeptideStatus =
  | "well-researched"
  | "emerging"
  | "experimental"
  | "novel";

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
  readonly creatorName?: string;
  readonly creatorId?: string;
  readonly creatorAvatar?: string;
  readonly rating?: number;
  readonly ratingCount?: number;
  readonly activeUsers?: number;
  readonly progress?: number; // 0-100 for active protocols
  readonly startDate?: string;
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
  readonly protocolName?: string;
}

export interface OutcomeMetrics {
  readonly date: string;
  readonly weight: number | null;
  readonly bodyFat: number | null;
  readonly mood: number | null; // 1-10
  readonly sleep: number | null; // 1-10
  readonly energy: number | null; // 1-10
  readonly soreness: number | null; // 1-10
  readonly recovery: number | null; // 1-10
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
  readonly recovery: number | null;
}

export interface CompliancePoint {
  readonly day: string;
  readonly compliance: number;
  readonly taken: number;
  readonly total: number;
}

export interface ProtocolTimeline {
  readonly protocolId: string;
  readonly name: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly color: string;
}

// ── Creator ──
export interface Creator {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly bio: string;
  readonly specialty: string;
  readonly credentials: string;
  readonly followers: number;
  readonly protocolCount: number;
  readonly verified: boolean;
  readonly avatarInitials: string;
  readonly accentColor: string;
}

// ── Dashboard Stats ──
export interface DashboardStats {
  readonly activeProtocols: number;
  readonly dosesThisWeek: number;
  readonly complianceRate: number;
  readonly activePeptides: number;
  readonly streakDays: number;
  readonly totalLogged: number;
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

// ── Vendor / Source ──
export type VendorType = "pharmacy" | "research" | "telehealth" | "supplement";
export type PricingTier = "budget" | "mid" | "premium";

export interface VendorSource {
  readonly id: string;
  readonly name: string;
  readonly url: string;
  readonly type: VendorType;
  readonly trustScore: number; // 1-5
  readonly pricing: PricingTier;
  readonly shipping: string;
  readonly notes?: string;
  readonly affiliateTag?: string; // for future monetization
}

export interface PeptideSource {
  readonly vendorId: string;
  readonly peptideSlug: string;
  readonly price: number; // USD per vial/unit
  readonly vialSize: string; // e.g., "5mg", "10mg", "200mg/mL"
  readonly inStock: boolean;
  readonly url: string; // direct product link (with affiliate tag)
}

// ── Injection Site ──
export type InjectionType = "subq" | "im";
export type BodyView = "front" | "back";

export interface InjectionSite {
  readonly id: string;
  readonly label: string;
  readonly x: number;
  readonly y: number;
  readonly view: BodyView;
  readonly type: InjectionType;
  readonly muscle?: string;
  readonly depth?: string;
  readonly notes?: string;
}
