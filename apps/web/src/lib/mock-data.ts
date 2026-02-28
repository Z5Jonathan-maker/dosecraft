import type {
  Peptide,
  Protocol,
  DailyDose,
  OutcomeMetrics,
  InsightCard,
  TimeSeriesPoint,
  ProtocolTimeline,
} from "@/types";

// ── Peptides ──
export const MOCK_PEPTIDES: readonly Peptide[] = [
  {
    slug: "bpc-157",
    name: "BPC-157",
    aliases: ["Body Protection Compound-157", "Pentadecapeptide"],
    category: "healing",
    route: "subcutaneous",
    status: "well-researched",
    description:
      "A gastric pentadecapeptide with powerful systemic healing properties. Promotes tendon, ligament, muscle, and gut healing through multiple growth factor pathways.",
    lanes: ["clinical", "expert", "experimental"],
    contraindications: [
      "Active cancer or history of cancer (may promote angiogenesis)",
      "Pregnancy or breastfeeding",
      "Known hypersensitivity to peptide compounds",
    ],
    interactions: [
      "May enhance effects of growth hormone secretagogues",
      "Potential interaction with anticoagulants (monitor closely)",
      "Synergistic with TB-500 for tissue repair",
    ],
    laneData: {
      clinical: {
        summary:
          "Extensive animal studies demonstrate accelerated healing of tendons, ligaments, muscles, nerves, and GI tract. Human clinical trials are limited but emerging.",
        dosageRange: "200-500 mcg/day",
        frequency: "1-2x daily",
        duration: "4-12 weeks",
        confidence: 72,
        sources: [
          "Sikiric et al., 2018 - Journal of Physiology",
          "Chang et al., 2011 - Life Sciences",
          "Seiwerth et al., 2014 - Current Pharmaceutical Design",
        ],
      },
      expert: {
        summary:
          "Widely used in biohacking and sports medicine communities. Practitioners report consistent healing acceleration for soft tissue injuries, gut issues, and joint problems.",
        dosageRange: "250-750 mcg/day",
        frequency: "2x daily (AM/PM)",
        duration: "6-8 weeks typical cycle",
        confidence: 85,
        sources: [
          "Dr. Andrew Huberman - Huberman Lab Podcast",
          "Dr. Seeds Clinical Protocols",
          "Ben Greenfield Fitness Community Reports",
        ],
      },
      experimental: {
        summary:
          "Community reports suggest benefits for brain fog, depression, and systemic inflammation beyond tissue repair. Some users combine oral and injectable routes.",
        dosageRange: "500-1000 mcg/day",
        frequency: "2-3x daily, split doses",
        duration: "8-16 weeks",
        confidence: 45,
        sources: [
          "Reddit r/Peptides community surveys",
          "MESO-Rx forums",
          "Self-reported N=1 experiments",
        ],
      },
    },
  },
  {
    slug: "tb-500",
    name: "TB-500",
    aliases: ["Thymosin Beta-4", "TB4"],
    category: "healing",
    route: "subcutaneous",
    status: "well-researched",
    description:
      "A synthetic version of thymosin beta-4, a naturally occurring peptide involved in tissue repair, cell migration, and anti-inflammatory responses.",
    lanes: ["clinical", "expert"],
    contraindications: [
      "Active cancer (promotes cell migration and angiogenesis)",
      "Pregnancy or breastfeeding",
      "Recent head trauma (theoretical concern)",
    ],
    interactions: [
      "Highly synergistic with BPC-157 for healing protocols",
      "May potentiate growth hormone effects",
      "Use caution with immunosuppressants",
    ],
    laneData: {
      clinical: {
        summary:
          "Strong evidence for wound healing, cardiac tissue repair, and anti-inflammatory effects in animal models. Phase II trials for dry eye and cardiac repair.",
        dosageRange: "2-5 mg/week",
        frequency: "2x per week",
        duration: "4-8 weeks",
        confidence: 68,
        sources: [
          "Goldstein et al., 2012 - Expert Opinion on Biological Therapy",
          "RegeneRx Biopharmaceuticals clinical data",
        ],
      },
      expert: {
        summary:
          "Standard healing peptide in practitioner protocols. Often combined with BPC-157. Loading phase followed by maintenance is the established pattern.",
        dosageRange: "5-10 mg/week loading, 2.5-5 mg/week maintenance",
        frequency: "2-3x per week",
        duration: "4 weeks loading + 4 weeks maintenance",
        confidence: 80,
        sources: [
          "Integrative medicine practitioner consensus",
          "Sports medicine clinic protocols",
        ],
      },
      experimental: null,
    },
  },
  {
    slug: "cjc-1295-ipamorelin",
    name: "CJC-1295 / Ipamorelin",
    aliases: ["CJC/Ipa", "Modified GRF 1-29 + Ipamorelin"],
    category: "growth-hormone",
    route: "subcutaneous",
    status: "well-researched",
    description:
      "A combination of a growth hormone releasing hormone (GHRH) analog and a selective growth hormone secretagogue. The gold standard GH peptide stack.",
    lanes: ["clinical", "expert", "experimental"],
    contraindications: [
      "Active cancer or tumors",
      "Diabetes (monitor blood glucose closely)",
      "Carpal tunnel syndrome",
      "Pre-existing edema conditions",
    ],
    interactions: [
      "Potentiates effects of exogenous GH (use lower doses)",
      "Insulin sensitivity may be affected - monitor",
      "Enhanced recovery when stacked with healing peptides",
    ],
    laneData: {
      clinical: {
        summary:
          "CJC-1295 DAC shows sustained GH elevation for 6-8 days per injection. Ipamorelin is the most selective GHRP with minimal cortisol/prolactin impact.",
        dosageRange: "CJC: 100 mcg + Ipa: 100 mcg per injection",
        frequency: "1-3x daily",
        duration: "3-6 months cycles",
        confidence: 78,
        sources: [
          "Teichman et al., 2006 - JCEM",
          "Raun et al., 1998 - European Journal of Endocrinology",
        ],
      },
      expert: {
        summary:
          "Most prescribed GH peptide combination. Bedtime dosing preferred to amplify natural GH pulse. Cycling recommended to prevent desensitization.",
        dosageRange: "CJC: 100-300 mcg + Ipa: 100-300 mcg",
        frequency: "1-2x daily (bedtime + optional morning)",
        duration: "12 weeks on, 4 weeks off",
        confidence: 88,
        sources: [
          "Anti-aging clinic protocols",
          "Dr. Rand McClain dosing guidelines",
        ],
      },
      experimental: {
        summary:
          "Some users push higher doses for enhanced body recomposition. Reports of improved deep sleep, skin quality, and recovery at higher ranges.",
        dosageRange: "CJC: 300 mcg + Ipa: 300 mcg",
        frequency: "3x daily",
        duration: "6+ months continuous",
        confidence: 35,
        sources: [
          "Bodybuilding forum protocols",
          "Community self-experiments",
        ],
      },
    },
  },
  {
    slug: "semaglutide",
    name: "Semaglutide",
    aliases: ["Ozempic", "Wegovy", "GLP-1 RA"],
    category: "metabolic",
    route: "subcutaneous",
    status: "well-researched",
    description:
      "A GLP-1 receptor agonist FDA-approved for type 2 diabetes and obesity. Powerful appetite suppression and metabolic improvement effects.",
    lanes: ["clinical", "expert"],
    contraindications: [
      "Personal/family history of medullary thyroid carcinoma",
      "Multiple Endocrine Neoplasia syndrome type 2 (MEN 2)",
      "Pancreatitis history",
      "Severe GI disease",
      "Pregnancy (Category X)",
    ],
    interactions: [
      "May delay absorption of oral medications",
      "Enhanced hypoglycemia risk with insulin or sulfonylureas",
      "Monitor thyroid function regularly",
    ],
    laneData: {
      clinical: {
        summary:
          "FDA-approved with extensive Phase III data. STEP trials showed 15-17% body weight loss. Cardiovascular benefits demonstrated in SELECT trial.",
        dosageRange: "0.25 mg - 2.4 mg/week (titrated)",
        frequency: "Once weekly",
        duration: "Ongoing (chronic therapy)",
        confidence: 95,
        sources: [
          "Wilding et al., 2021 - NEJM (STEP 1)",
          "FDA Prescribing Information",
          "Lincoff et al., 2023 - NEJM (SELECT)",
        ],
      },
      expert: {
        summary:
          "Slow titration is key to minimize GI side effects. Many practitioners combine with peptide stacks for body recomposition. Monitor muscle mass with concurrent resistance training.",
        dosageRange: "0.25 mg start, titrate to 1.0-2.4 mg/week",
        frequency: "Once weekly, same day each week",
        duration: "6-12+ months",
        confidence: 92,
        sources: [
          "Endocrinology practice guidelines",
          "Obesity medicine specialist protocols",
        ],
      },
      experimental: null,
    },
  },
  {
    slug: "ghk-cu",
    name: "GHK-Cu",
    aliases: ["Copper Peptide", "GHK-Copper"],
    category: "cosmetic",
    route: "topical",
    status: "emerging",
    description:
      "A naturally occurring copper-binding tripeptide with broad regenerative properties. Promotes collagen synthesis, wound healing, and skin remodeling.",
    lanes: ["clinical", "expert", "experimental"],
    contraindications: [
      "Copper sensitivity or Wilson's disease",
      "Pregnancy (insufficient data)",
      "Open wounds (for injectable form)",
    ],
    interactions: [
      "May enhance effects of retinoids (use with caution)",
      "Synergistic with vitamin C serums (apply separately)",
      "Can be combined with BPC-157 for enhanced healing",
    ],
    laneData: {
      clinical: {
        summary:
          "Well-documented for topical skin rejuvenation. Studies show increased collagen, elastin, and glycosaminoglycan synthesis. Strong wound healing evidence.",
        dosageRange: "Topical: 1-2% concentration",
        frequency: "1-2x daily (topical)",
        duration: "8-12 weeks for visible results",
        confidence: 70,
        sources: [
          "Pickart et al., 2015 - BioMed Research International",
          "Siméon et al., 2000 - Journal of Investigative Dermatology",
        ],
      },
      expert: {
        summary:
          "Injectable form gaining traction in anti-aging clinics. Topical remains the standard recommendation. Some practitioners use mesotherapy injections for facial rejuvenation.",
        dosageRange: "Topical: 1-2% | Injectable: 50-200 mcg/day",
        frequency: "Daily (topical) or 3x/week (injectable)",
        duration: "12+ weeks",
        confidence: 65,
        sources: [
          "Dermatology practice protocols",
          "Anti-aging medicine conferences",
        ],
      },
      experimental: {
        summary:
          "Emerging research on systemic anti-aging effects, gene modulation (resetting 4,000+ genes), and potential neuroprotective properties. Oral bioavailability being investigated.",
        dosageRange: "200-500 mcg/day (subcutaneous)",
        frequency: "Daily",
        duration: "Indefinite (anti-aging)",
        confidence: 30,
        sources: [
          "Pickart gene expression studies",
          "Biohacking community protocols",
        ],
      },
    },
  },
] as const;

// ── Protocols ──
export const MOCK_PROTOCOLS: readonly Protocol[] = [
  {
    id: "healing-stack",
    hookTitle: "The Healing Stack",
    subtitle: "Accelerated tissue repair for injuries and recovery",
    intensity: "conservative",
    goals: ["injury-recovery", "joint-health", "gut-healing"],
    contentAngle: "clinical",
    duration: "8 weeks",
    description:
      "A clinically-backed healing protocol combining BPC-157 and TB-500. Designed for those recovering from soft tissue injuries, joint issues, or gut problems. Conservative dosing with strong safety profile.",
    peptides: [
      {
        slug: "bpc-157",
        name: "BPC-157",
        dose: "250 mcg",
        frequency: "2x daily",
        route: "subcutaneous",
        timing: "Morning + Evening",
      },
      {
        slug: "tb-500",
        name: "TB-500",
        dose: "2.5 mg",
        frequency: "2x per week",
        route: "subcutaneous",
        timing: "Monday + Thursday",
      },
    ],
  },
  {
    id: "recomp-protocol",
    hookTitle: "Recomp Protocol",
    subtitle: "Body recomposition with optimized GH pulsing",
    intensity: "standard",
    goals: ["body-recomp", "fat-loss", "muscle-gain", "sleep", "recovery"],
    contentAngle: "expert",
    duration: "12 weeks",
    description:
      "A practitioner-designed recomposition stack leveraging GH peptides for fat loss and muscle gain. Includes semaglutide for appetite management and CJC/Ipa for GH optimization.",
    peptides: [
      {
        slug: "cjc-1295-ipamorelin",
        name: "CJC-1295 / Ipamorelin",
        dose: "200 mcg each",
        frequency: "Nightly",
        route: "subcutaneous",
        timing: "30 min before bed",
      },
      {
        slug: "semaglutide",
        name: "Semaglutide",
        dose: "0.5 mg (titrated)",
        frequency: "Weekly",
        route: "subcutaneous",
        timing: "Same day each week",
      },
      {
        slug: "bpc-157",
        name: "BPC-157",
        dose: "250 mcg",
        frequency: "Daily",
        route: "subcutaneous",
        timing: "Post-workout or morning",
      },
    ],
  },
  {
    id: "full-send-looksmax",
    hookTitle: "Full Send Looksmax",
    subtitle: "Aggressive anti-aging and aesthetic optimization",
    intensity: "aggressive",
    goals: ["anti-aging", "skin", "hair", "body-recomp", "cognitive"],
    contentAngle: "experimental",
    duration: "16 weeks",
    description:
      "An advanced, multi-compound protocol for those pursuing maximum aesthetic and anti-aging benefits. Combines GH optimization, skin rejuvenation, and metabolic enhancement. Requires careful monitoring.",
    peptides: [
      {
        slug: "cjc-1295-ipamorelin",
        name: "CJC-1295 / Ipamorelin",
        dose: "300 mcg each",
        frequency: "2x daily",
        route: "subcutaneous",
        timing: "Morning + Bedtime",
      },
      {
        slug: "ghk-cu",
        name: "GHK-Cu",
        dose: "200 mcg",
        frequency: "Daily",
        route: "subcutaneous",
        timing: "Morning",
      },
      {
        slug: "bpc-157",
        name: "BPC-157",
        dose: "500 mcg",
        frequency: "2x daily",
        route: "subcutaneous",
        timing: "Morning + Evening",
      },
      {
        slug: "semaglutide",
        name: "Semaglutide",
        dose: "1.0 mg",
        frequency: "Weekly",
        route: "subcutaneous",
        timing: "Sunday morning",
      },
    ],
  },
] as const;

// ── Daily Doses ──
export const MOCK_DAILY_DOSES: readonly DailyDose[] = [
  {
    id: "dose-1",
    peptideName: "BPC-157",
    dose: "250 mcg",
    route: "subcutaneous",
    site: "Lower abdomen (left)",
    scheduledTime: "07:00",
    taken: true,
    takenAt: "07:12",
  },
  {
    id: "dose-2",
    peptideName: "CJC-1295 / Ipamorelin",
    dose: "200 mcg each",
    route: "subcutaneous",
    site: "Lower abdomen (right)",
    scheduledTime: "22:00",
    taken: false,
    takenAt: null,
  },
  {
    id: "dose-3",
    peptideName: "GHK-Cu",
    dose: "200 mcg",
    route: "subcutaneous",
    site: "Upper arm (left)",
    scheduledTime: "08:00",
    taken: false,
    takenAt: null,
  },
] as const;

// ── Outcome History ──
export const MOCK_OUTCOMES: readonly OutcomeMetrics[] = [
  { date: "2026-02-14", weight: 187.2, bodyFat: 18.5, mood: 6, sleep: 6, energy: 5, soreness: 7, notes: "" },
  { date: "2026-02-15", weight: 186.8, bodyFat: 18.4, mood: 7, sleep: 7, energy: 6, soreness: 6, notes: "" },
  { date: "2026-02-16", weight: 186.5, bodyFat: 18.3, mood: 7, sleep: 7, energy: 7, soreness: 5, notes: "Started BPC-157" },
  { date: "2026-02-17", weight: 186.9, bodyFat: 18.2, mood: 6, sleep: 6, energy: 6, soreness: 5, notes: "" },
  { date: "2026-02-18", weight: 186.3, bodyFat: 18.1, mood: 7, sleep: 8, energy: 7, soreness: 4, notes: "" },
  { date: "2026-02-19", weight: 185.8, bodyFat: 18.0, mood: 8, sleep: 8, energy: 7, soreness: 4, notes: "Knee pain improving" },
  { date: "2026-02-20", weight: 185.5, bodyFat: 17.9, mood: 8, sleep: 8, energy: 8, soreness: 3, notes: "" },
  { date: "2026-02-21", weight: 185.2, bodyFat: 17.8, mood: 8, sleep: 9, energy: 8, soreness: 3, notes: "Added CJC/Ipa" },
  { date: "2026-02-22", weight: 184.9, bodyFat: 17.7, mood: 9, sleep: 9, energy: 8, soreness: 2, notes: "" },
  { date: "2026-02-23", weight: 184.5, bodyFat: 17.5, mood: 9, sleep: 9, energy: 9, soreness: 2, notes: "" },
  { date: "2026-02-24", weight: 184.2, bodyFat: 17.4, mood: 8, sleep: 8, energy: 8, soreness: 2, notes: "" },
  { date: "2026-02-25", weight: 183.8, bodyFat: 17.2, mood: 9, sleep: 9, energy: 9, soreness: 1, notes: "" },
  { date: "2026-02-26", weight: 183.5, bodyFat: 17.1, mood: 9, sleep: 10, energy: 9, soreness: 1, notes: "Sleep dramatically better" },
  { date: "2026-02-27", weight: 183.2, bodyFat: 17.0, mood: 9, sleep: 9, energy: 9, soreness: 1, notes: "" },
  { date: "2026-02-28", weight: 182.8, bodyFat: 16.8, mood: 10, sleep: 10, energy: 10, soreness: 1, notes: "Best day yet" },
] as const;

// ── Time Series (for charts) ──
export const MOCK_TIME_SERIES: readonly TimeSeriesPoint[] = MOCK_OUTCOMES.map((o) => ({
  date: o.date,
  weight: o.weight,
  bodyFat: o.bodyFat,
  mood: o.mood,
  sleep: o.sleep,
  energy: o.energy,
}));

// ── Protocol Timelines ──
export const MOCK_PROTOCOL_TIMELINES: readonly ProtocolTimeline[] = [
  {
    protocolId: "healing-stack",
    name: "The Healing Stack",
    startDate: "2026-02-16",
    endDate: "2026-04-13",
    color: "#00d4ff",
  },
  {
    protocolId: "recomp-protocol",
    name: "Recomp Protocol",
    startDate: "2026-02-21",
    endDate: "2026-05-16",
    color: "#ff6b35",
  },
] as const;

// ── Insight Cards ──
export const MOCK_INSIGHTS: readonly InsightCard[] = [
  {
    id: "insight-1",
    title: "Sleep Scores Improved",
    description:
      "Your sleep scores improved 23% since adding CJC-1295/Ipamorelin on Feb 21. Average went from 6.8 to 9.2.",
    type: "positive",
    metric: "sleep",
    change: "+23%",
  },
  {
    id: "insight-2",
    title: "Weight Trend Down",
    description:
      "Consistent downward trend of -4.4 lbs over 14 days. Rate of -0.31 lbs/day is in the healthy range.",
    type: "positive",
    metric: "weight",
    change: "-4.4 lbs",
  },
  {
    id: "insight-3",
    title: "Soreness Dramatically Reduced",
    description:
      "Soreness dropped from 7/10 to 1/10 since starting BPC-157. Healing protocol appears highly effective for your knee.",
    type: "positive",
    metric: "soreness",
    change: "-85%",
  },
  {
    id: "insight-4",
    title: "Body Fat Approaching Target",
    description:
      "At current rate, you'll hit 15% body fat in approximately 4 weeks. Consider adjusting caloric intake as you approach target.",
    type: "neutral",
    metric: "bodyFat",
    change: "-1.7%",
  },
  {
    id: "insight-5",
    title: "Injection Site Rotation",
    description:
      "You've used the left abdomen site 5 times this week. Consider rotating to upper thigh or other sites to prevent tissue buildup.",
    type: "warning",
    metric: "compliance",
    change: "Action needed",
  },
] as const;

// ── Builder goals ──
export const PROTOCOL_GOALS = [
  "injury-recovery",
  "joint-health",
  "gut-healing",
  "body-recomp",
  "fat-loss",
  "muscle-gain",
  "sleep",
  "recovery",
  "anti-aging",
  "skin",
  "hair",
  "cognitive",
  "immune-support",
  "sexual-health",
] as const;

// ── Calculator injection sites ──
export const INJECTION_SITES = [
  { id: "abd-left", label: "Lower Abdomen (Left)", x: 43, y: 52 },
  { id: "abd-right", label: "Lower Abdomen (Right)", x: 57, y: 52 },
  { id: "thigh-left", label: "Outer Thigh (Left)", x: 38, y: 72 },
  { id: "thigh-right", label: "Outer Thigh (Right)", x: 62, y: 72 },
  { id: "arm-left", label: "Upper Arm (Left)", x: 25, y: 38 },
  { id: "arm-right", label: "Upper Arm (Right)", x: 75, y: 38 },
  { id: "glute-left", label: "Glute (Left)", x: 42, y: 60 },
  { id: "glute-right", label: "Glute (Right)", x: 58, y: 60 },
] as const;
