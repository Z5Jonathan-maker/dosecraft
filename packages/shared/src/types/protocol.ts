import type { EvidenceLane, RiskAppetite } from './peptide';
import type { GoalTag } from './user';

// ---------------------------------------------------------------------------
// Protocol enums
// ---------------------------------------------------------------------------

/** How aggressively the protocol is dosed */
export type ProtocolIntensity = 'conservative' | 'standard' | 'aggressive';

/** Preferred injection / administration window */
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'bedtime' | 'any';

/** Recommended injection site */
export type InjectionSite =
  | 'abdomen'
  | 'thigh'
  | 'deltoid'
  | 'glute'
  | 'love_handle'
  | 'other';

/** Lifecycle of a user's active protocol */
export type UserProtocolStatus =
  | 'active'
  | 'paused'
  | 'completed'
  | 'abandoned';

// ---------------------------------------------------------------------------
// Protocol template (library)
// ---------------------------------------------------------------------------

export interface ProtocolTemplateSummary {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly hookTitle: string;
  readonly description: string;
  readonly intensity: ProtocolIntensity;
  readonly goalTags: readonly GoalTag[];
  readonly durationWeeks: number;
  readonly peptideCount: number;
}

export interface ProtocolStep {
  readonly id: string;
  readonly peptideId: string;
  readonly peptideName: string;
  readonly doseMcg: number;
  readonly route: string;
  readonly frequencyPerWeek: number;
  readonly timeOfDay: TimeOfDay;
  readonly injectionSite: InjectionSite | null;
  readonly notes: string;
  readonly evidenceLane: EvidenceLane;
  readonly orderIndex: number;
}

export interface ProtocolTemplateDetail {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly hookTitle: string;
  readonly description: string;
  readonly intensity: ProtocolIntensity;
  readonly riskAppetite: RiskAppetite;
  readonly goalTags: readonly GoalTag[];
  readonly durationWeeks: number;
  readonly steps: readonly ProtocolStep[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

// ---------------------------------------------------------------------------
// User-facing inputs (create / log)
// ---------------------------------------------------------------------------

export interface ProtocolStepInput {
  readonly peptideId: string;
  readonly doseMcg: number;
  readonly route: string;
  readonly frequencyPerWeek: number;
  readonly timeOfDay: TimeOfDay;
  readonly injectionSite: InjectionSite | null;
  readonly notes: string;
  readonly evidenceLane: EvidenceLane;
  readonly orderIndex: number;
}

export interface DoseLogInput {
  readonly userProtocolId: string;
  readonly stepId: string;
  readonly doseMcg: number;
  readonly injectionSite: InjectionSite | null;
  readonly loggedAt: string;
  readonly notes: string;
}

export interface OutcomeMetricInput {
  readonly userProtocolId: string;
  readonly metricKey: string;
  readonly value: number;
  readonly unit: string;
  readonly recordedAt: string;
  readonly notes: string;
}
