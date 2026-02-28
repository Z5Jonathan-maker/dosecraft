// ---------------------------------------------------------------------------
// Peptide domain types — mirrors Prisma schema
// ---------------------------------------------------------------------------

/** Which evidence lane a data point belongs to */
export type EvidenceLane = 'clinical' | 'expert' | 'experimental';

/** User-selected risk appetite for protocol generation */
export type RiskAppetite = 'clinical' | 'mixed' | 'experimental';

/** High-level peptide family / use-case bucket */
export type PeptideCategory =
  | 'growth_hormone'
  | 'weight_loss'
  | 'healing'
  | 'cosmetic'
  | 'cognitive'
  | 'immune'
  | 'sexual_health'
  | 'sleep'
  | 'performance'
  | 'longevity';

/** Administration route */
export type PeptideRoute =
  | 'subcutaneous'
  | 'intramuscular'
  | 'intranasal'
  | 'oral'
  | 'topical'
  | 'intravenous';

/** Editorial / publication status */
export type PeptideStatus = 'draft' | 'review' | 'published' | 'archived';

// ---------------------------------------------------------------------------
// Evidence lane data
// ---------------------------------------------------------------------------

export interface EvidenceLaneData {
  readonly lane: EvidenceLane;
  readonly doseMinMcg: number;
  readonly doseMaxMcg: number;
  readonly frequencyPerWeek: number;
  readonly cycleLengthWeeks: number;
  readonly summary: string;
  readonly citations: readonly string[];
}

// ---------------------------------------------------------------------------
// Contraindication / interaction
// ---------------------------------------------------------------------------

export interface Contraindication {
  readonly id: string;
  readonly condition: string;
  readonly severity: 'absolute' | 'relative';
  readonly note: string;
}

export interface Interaction {
  readonly id: string;
  readonly substanceName: string;
  readonly effect: string;
  readonly severity: 'major' | 'moderate' | 'minor';
  readonly note: string;
}

// ---------------------------------------------------------------------------
// Full detail (single-peptide page)
// ---------------------------------------------------------------------------

export interface PeptideDetail {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly aliases: readonly string[];
  readonly category: PeptideCategory;
  readonly route: PeptideRoute;
  readonly status: PeptideStatus;
  readonly description: string;
  readonly mechanismOfAction: string;
  readonly halfLifeMinutes: number | null;
  readonly molecularWeight: number | null;
  readonly storageInstructions: string;
  readonly reconstitutionNotes: string;
  readonly evidenceLanes: readonly EvidenceLaneData[];
  readonly contraindications: readonly Contraindication[];
  readonly interactions: readonly Interaction[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

// ---------------------------------------------------------------------------
// Summary (list / card views)
// ---------------------------------------------------------------------------

export interface PeptideSummary {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly category: PeptideCategory;
  readonly route: PeptideRoute;
  readonly description: string;
}
