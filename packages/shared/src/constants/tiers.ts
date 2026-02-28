import type { TierFeatureFlags, TierFeatureMap } from '../types/billing';

// ---------------------------------------------------------------------------
// Pricing (all values in cents USD)
// ---------------------------------------------------------------------------

export const TIER_PRICES = {
  base: 2900,
  pro: 4900,
  annual_base: 24900,
  annual_pro: 44900,
} as const;

export type TierPrices = typeof TIER_PRICES;

// ---------------------------------------------------------------------------
// Feature flags per tier
// ---------------------------------------------------------------------------

export const TIER_FEATURES: TierFeatureMap = {
  free: {
    maxProtocols: 1,
    maxPeptidesPerProtocol: 2,
    aiCoachEnabled: false,
    aiSuggestionsPerMonth: 0,
    doseLogging: true,
    outcomeTracking: false,
    exportData: false,
    prioritySupport: false,
    customProtocols: false,
    communityAccess: true,
  },
  base: {
    maxProtocols: 3,
    maxPeptidesPerProtocol: 5,
    aiCoachEnabled: true,
    aiSuggestionsPerMonth: 10,
    doseLogging: true,
    outcomeTracking: true,
    exportData: false,
    prioritySupport: false,
    customProtocols: true,
    communityAccess: true,
  },
  pro: {
    maxProtocols: -1, // unlimited
    maxPeptidesPerProtocol: -1,
    aiCoachEnabled: true,
    aiSuggestionsPerMonth: -1,
    doseLogging: true,
    outcomeTracking: true,
    exportData: true,
    prioritySupport: true,
    customProtocols: true,
    communityAccess: true,
  },
  lifetime: {
    maxProtocols: -1,
    maxPeptidesPerProtocol: -1,
    aiCoachEnabled: true,
    aiSuggestionsPerMonth: -1,
    doseLogging: true,
    outcomeTracking: true,
    exportData: true,
    prioritySupport: true,
    customProtocols: true,
    communityAccess: true,
  },
} as const;
