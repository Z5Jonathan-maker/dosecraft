import type { RiskAppetite, EvidenceLane } from './peptide';
import type { GoalTag } from './user';
import type { ProtocolIntensity, TimeOfDay, InjectionSite } from './protocol';

// ---------------------------------------------------------------------------
// Protocol suggestion (AI-generated)
// ---------------------------------------------------------------------------

export interface ProtocolSuggestionInput {
  readonly goals: readonly GoalTag[];
  readonly riskAppetite: RiskAppetite;
  readonly constraints: {
    readonly maxPeptides?: number;
    readonly maxDurationWeeks?: number;
    readonly excludePeptideIds?: readonly string[];
    readonly preferredRoutes?: readonly string[];
    readonly budgetCentsPerMonth?: number;
  };
}

export interface ProtocolSuggestionStep {
  readonly peptideId: string;
  readonly peptideName: string;
  readonly doseMcg: number;
  readonly route: string;
  readonly frequencyPerWeek: number;
  readonly timeOfDay: TimeOfDay;
  readonly injectionSite: InjectionSite | null;
  readonly evidenceLane: EvidenceLane;
  readonly orderIndex: number;
  readonly rationale: string;
}

export interface ProtocolSuggestionOutput {
  readonly name: string;
  readonly hookTitle: string;
  readonly description: string;
  readonly intensity: ProtocolIntensity;
  readonly goalTags: readonly GoalTag[];
  readonly durationWeeks: number;
  readonly steps: readonly ProtocolSuggestionStep[];
}

// ---------------------------------------------------------------------------
// Coach chat
// ---------------------------------------------------------------------------

export type CoachChatRole = 'user' | 'assistant' | 'system';

export interface CoachChatMessage {
  readonly role: CoachChatRole;
  readonly content: string;
  readonly timestamp: string;
}

export interface CoachChatResponse {
  readonly message: CoachChatMessage;
  readonly suggestedActions: readonly string[];
  readonly relatedPeptideIds: readonly string[];
}

// ---------------------------------------------------------------------------
// Insight summary (dashboard cards)
// ---------------------------------------------------------------------------

export interface InsightSummary {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly category: 'progress' | 'recommendation' | 'warning' | 'milestone';
  readonly relatedProtocolId: string | null;
  readonly createdAt: string;
}
