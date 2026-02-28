// ---------------------------------------------------------------------------
// Billing / subscription types
// ---------------------------------------------------------------------------

/** Available subscription tiers */
export type SubscriptionTier = 'free' | 'base' | 'pro' | 'lifetime';

/** Stripe subscription lifecycle status */
export type SubscriptionStatus =
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'canceled'
  | 'unpaid'
  | 'incomplete'
  | 'incomplete_expired';

// ---------------------------------------------------------------------------
// Feature flags per tier
// ---------------------------------------------------------------------------

export interface TierFeatureFlags {
  readonly maxProtocols: number;
  readonly maxPeptidesPerProtocol: number;
  readonly aiCoachEnabled: boolean;
  readonly aiSuggestionsPerMonth: number;
  readonly doseLogging: boolean;
  readonly outcomeTracking: boolean;
  readonly exportData: boolean;
  readonly prioritySupport: boolean;
  readonly customProtocols: boolean;
  readonly communityAccess: boolean;
}

/** Map of tier to its feature set */
export type TierFeatureMap = Readonly<Record<SubscriptionTier, TierFeatureFlags>>;
