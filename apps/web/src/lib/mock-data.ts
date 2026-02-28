import type {
  Peptide,
  Protocol,
  DailyDose,
  OutcomeMetrics,
  InsightCard,
  TimeSeriesPoint,
  CompliancePoint,
  ProtocolTimeline,
  Creator,
  DashboardStats,
  InjectionSite,
} from "@/types";

// ── Peptides ──────────────────────────────────────────────────────────────────

export const MOCK_PEPTIDES: readonly Peptide[] = [
  {
    slug: "bpc-157",
    name: "BPC-157",
    aliases: ["Body Protection Compound-157", "Pentadecapeptide BPC"],
    category: "healing",
    route: "subcutaneous",
    status: "well-researched",
    halfLife: "4–6 hours",
    typicalDoseRange: "200–500 mcg/day",
    description:
      "A gastric pentadecapeptide with powerful systemic healing properties. Accelerates tendon, ligament, muscle, and gut healing through multiple growth factor pathways. One of the most extensively studied healing peptides.",
    lanes: ["clinical", "expert", "experimental"],
    contraindications: [
      "Active cancer or history of cancer (may promote angiogenesis)",
      "Pregnancy or breastfeeding",
      "Known hypersensitivity to peptide compounds",
    ],
    interactions: [
      "Synergistic with TB-500 for enhanced tissue repair",
      "May enhance effects of growth hormone secretagogues",
      "Potential interaction with anticoagulants (monitor closely)",
    ],
    laneData: {
      clinical: {
        summary:
          "Extensive animal studies demonstrate accelerated healing of tendons, ligaments, muscles, nerves, and GI tract. Upregulates growth hormone receptors and promotes angiogenesis. Human clinical trials are limited but emerging.",
        dosageRange: "200–500 mcg/day",
        frequency: "1–2x daily",
        duration: "4–12 weeks",
        confidence: 72,
        sources: [
          "Sikiric et al., 2018 — Journal of Physiology",
          "Chang et al., 2011 — Life Sciences",
          "Seiwerth et al., 2014 — Current Pharmaceutical Design",
        ],
      },
      expert: {
        summary:
          "Widely used in sports medicine and functional health communities. Practitioners report consistent healing acceleration for soft tissue injuries, gut problems, and joint issues. Often combined with TB-500 in a 1:4 ratio.",
        dosageRange: "250–750 mcg/day",
        frequency: "2x daily (AM/PM)",
        duration: "6–8 weeks typical cycle",
        confidence: 85,
        sources: [
          "Dr. Andrew Huberman — Huberman Lab Podcast ep. 60",
          "Dr. Seeds Clinical Protocols 2023",
          "Ben Greenfield Fitness Community Reports",
        ],
      },
      experimental: {
        summary:
          "Community reports suggest benefits for brain fog, depression, and systemic inflammation beyond tissue repair. Some users combine oral and injectable routes for GI issues. Potential CNS benefits being explored.",
        dosageRange: "500–1000 mcg/day",
        frequency: "2–3x daily, split doses",
        duration: "8–16 weeks",
        confidence: 45,
        sources: [
          "Reddit r/Peptides — 2024 community survey (n=847)",
          "MESO-Rx forum clinical reports",
          "N=1 experiment database",
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
    halfLife: "~24 hours",
    typicalDoseRange: "2–5 mg/week",
    description:
      "A synthetic version of thymosin beta-4, a naturally occurring peptide critical for tissue repair, cell migration, and anti-inflammatory responses. Excellent for systemic healing and injury recovery.",
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
          "Strong evidence for wound healing, cardiac tissue repair, and anti-inflammatory effects in animal models. Phase II clinical trials conducted for corneal wound repair and cardiac repair.",
        dosageRange: "2–5 mg/week",
        frequency: "2x per week",
        duration: "4–8 weeks",
        confidence: 68,
        sources: [
          "Goldstein et al., 2012 — Expert Opinion on Biological Therapy",
          "RegeneRx Biopharmaceuticals Phase II data (RGN-137)",
          "Malinda et al., 1999 — Journal of Investigative Dermatology",
        ],
      },
      expert: {
        summary:
          "Standard healing peptide in practitioner protocols. Often combined with BPC-157 at 2:1 ratio. Loading phase of 2x/week for 4 weeks, then maintenance at 1x/week recommended.",
        dosageRange: "5–10 mg/week (loading), 2.5–5 mg/week (maintenance)",
        frequency: "2–3x per week loading, 1x/week maintenance",
        duration: "4 weeks loading + 4 weeks maintenance",
        confidence: 80,
        sources: [
          "Integrative medicine practitioner consensus protocol",
          "Sports medicine clinic protocols (2023 guidelines)",
        ],
      },
      experimental: null,
    },
  },
  {
    slug: "cjc-1295-ipamorelin",
    name: "CJC-1295 / Ipamorelin",
    aliases: ["CJC/Ipa", "Mod-GRF 1-29 + Ipamorelin"],
    category: "growth-hormone",
    route: "subcutaneous",
    status: "well-researched",
    halfLife: "CJC-1295: 6–8 days (DAC) | Ipamorelin: 2 hours",
    typicalDoseRange: "CJC: 100–300 mcg + Ipa: 100–300 mcg per dose",
    description:
      "The gold standard GH peptide combination. CJC-1295 is a GHRH analog extending GH pulse duration while Ipamorelin is the most selective GHRP with minimal side effects. Synergistic for GH optimization.",
    lanes: ["clinical", "expert", "experimental"],
    contraindications: [
      "Active cancer or tumors",
      "Diabetes (monitor blood glucose closely)",
      "Carpal tunnel syndrome (may worsen with excess GH)",
      "Pre-existing edema conditions",
    ],
    interactions: [
      "Potentiates exogenous GH (reduce doses if combining)",
      "Insulin sensitivity affected — monitor fasting glucose",
      "Enhanced recovery when stacked with healing peptides",
    ],
    laneData: {
      clinical: {
        summary:
          "CJC-1295 with DAC shows sustained GH elevation for 6–8 days per injection in Phase II trials. Ipamorelin is the most selective GHRP, producing clean GH pulses with minimal cortisol or prolactin elevation.",
        dosageRange: "CJC: 100 mcg + Ipa: 100 mcg per injection",
        frequency: "1–3x daily",
        duration: "3–6 month cycles",
        confidence: 78,
        sources: [
          "Teichman et al., 2006 — Journal of Clinical Endocrinology & Metabolism",
          "Raun et al., 1998 — European Journal of Endocrinology",
        ],
      },
      expert: {
        summary:
          "Most prescribed GH peptide combination in anti-aging and functional medicine. Bedtime dosing amplifies natural GH pulse. Cycling 12 weeks on / 4 weeks off recommended.",
        dosageRange: "CJC: 100–300 mcg + Ipa: 100–300 mcg per dose",
        frequency: "1–2x daily (bedtime essential, optional morning)",
        duration: "12 weeks on, 4 weeks off",
        confidence: 88,
        sources: [
          "Anti-aging clinic consensus protocols 2024",
          "Dr. Rand McClain — Age Management Medicine dosing guidelines",
        ],
      },
      experimental: {
        summary:
          "Some community users push higher doses for enhanced body recomposition. Reports of dramatically improved deep sleep, skin elasticity, and recovery at doses above standard ranges.",
        dosageRange: "CJC: 300 mcg + Ipa: 300 mcg (3x daily)",
        frequency: "3x daily (morning, pre-workout, bedtime)",
        duration: "6+ months continuous",
        confidence: 35,
        sources: [
          "Enhanced bodybuilding forum protocols",
          "Community self-experiment database",
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
    halfLife: "~7 days",
    typicalDoseRange: "0.25–2.4 mg/week",
    description:
      "A GLP-1 receptor agonist FDA-approved for type 2 diabetes and obesity. Delivers powerful appetite suppression, significant metabolic improvement, and documented cardiovascular benefits.",
    lanes: ["clinical", "expert"],
    contraindications: [
      "Personal/family history of medullary thyroid carcinoma or MEN2",
      "History of pancreatitis",
      "Severe gastrointestinal disease",
      "Pregnancy (Category X)",
    ],
    interactions: [
      "Delays absorption of oral medications",
      "Enhanced hypoglycemia risk with insulin or sulfonylureas",
      "Monitor thyroid function regularly",
    ],
    laneData: {
      clinical: {
        summary:
          "FDA-approved with robust Phase III evidence. STEP trials showed 15–17% body weight reduction. SELECT trial demonstrated 20% reduction in cardiovascular events. Best-evidenced weight loss compound available.",
        dosageRange: "0.25 mg/week (start) → 2.4 mg/week (maximum)",
        frequency: "Once weekly (same day)",
        duration: "Chronic therapy (ongoing)",
        confidence: 95,
        sources: [
          "Wilding et al., 2021 — NEJM (STEP 1 trial, n=1961)",
          "Lincoff et al., 2023 — NEJM (SELECT trial, n=17,604)",
          "FDA prescribing information — Wegovy",
        ],
      },
      expert: {
        summary:
          "Slow titration minimizes GI side effects. Practitioners combine with resistance training to preserve lean mass. Monthly monitoring of weight and metabolic markers recommended.",
        dosageRange: "0.25 mg start → titrate by 0.25 mg every 4 weeks to tolerance",
        frequency: "Once weekly, consistent day and time",
        duration: "6–12+ months with periodic reassessment",
        confidence: 92,
        sources: [
          "Obesity Medicine Association clinical guidelines 2024",
          "Endocrine Society position statement on GLP-1 agonists",
        ],
      },
      experimental: null,
    },
  },
  {
    slug: "ghk-cu",
    name: "GHK-Cu",
    aliases: ["Copper Peptide", "GHK-Copper Tripeptide"],
    category: "cosmetic",
    route: "topical",
    status: "emerging",
    halfLife: "~30 min (injectable)",
    typicalDoseRange: "Topical: 1–2% | Injectable: 50–200 mcg/day",
    description:
      "A naturally occurring copper-binding tripeptide with extraordinary regenerative properties. Promotes collagen synthesis, wound healing, and skin remodeling. Modulates expression of thousands of genes involved in aging.",
    lanes: ["clinical", "expert", "experimental"],
    contraindications: [
      "Copper sensitivity or Wilson's disease",
      "Pregnancy (insufficient safety data)",
    ],
    interactions: [
      "Synergistic with BPC-157 for tissue healing",
      "May enhance effects of topical retinoids (use separately)",
    ],
    laneData: {
      clinical: {
        summary:
          "Strong topical evidence for skin rejuvenation: increased collagen, elastin, and glycosaminoglycan synthesis. Wound healing, anti-inflammatory, and antioxidant effects in controlled studies.",
        dosageRange: "Topical: 1–2% concentration",
        frequency: "1–2x daily (topical)",
        duration: "8–12 weeks for visible results",
        confidence: 70,
        sources: [
          "Pickart & Margolina, 2018 — BioMed Research International",
          "Siméon et al., 2000 — Journal of Investigative Dermatology",
        ],
      },
      expert: {
        summary:
          "Injectable form gaining traction in anti-aging clinics via mesotherapy. Topical remains standard for skin. Subcutaneous injection showing systemic anti-aging effects beyond skin.",
        dosageRange: "Topical: 1–2% | Injectable: 50–200 mcg/day subcutaneous",
        frequency: "Daily topical; 3x/week injectable",
        duration: "12+ weeks for systemic effect",
        confidence: 65,
        sources: [
          "Anti-aging medicine conference data 2023",
          "Dermatology and mesotherapy practitioner protocols",
        ],
      },
      experimental: {
        summary:
          "Gene expression studies show GHK-Cu resets expression of 4,000+ genes toward a younger phenotype. Neuroprotective effects and oral delivery bioavailability under investigation.",
        dosageRange: "200–500 mcg/day (subcutaneous)",
        frequency: "Daily injections",
        duration: "Continuous anti-aging protocol",
        confidence: 32,
        sources: [
          "Pickart gene expression database",
          "Biohacking community long-term experiments",
        ],
      },
    },
  },
  {
    slug: "epithalon",
    name: "Epithalon",
    aliases: ["Epitalon", "Epithalamin", "Ala-Glu-Asp-Gly"],
    category: "immune",
    route: "subcutaneous",
    status: "emerging",
    halfLife: "~hours",
    typicalDoseRange: "5–10 mg/day (course)",
    description:
      "A tetrapeptide derived from the pineal gland that activates telomerase and extends telomere length. One of the most researched longevity peptides, studied extensively in Russia for 30+ years.",
    lanes: ["clinical", "experimental"],
    contraindications: [
      "Active cancer (telomerase activation concern)",
      "Pregnancy or breastfeeding",
    ],
    interactions: [
      "May enhance melatonin secretion",
      "Synergistic with other longevity interventions (NMN, rapamycin)",
    ],
    laneData: {
      clinical: {
        summary:
          "Russian research spanning 30+ years demonstrates telomere extension, immune modulation, antioxidant effects, and improved longevity markers in animal models. Human longevity study showed 1.6x–2.4x lower mortality in treated groups.",
        dosageRange: "5–10 mg/day during course",
        frequency: "Once daily (10-day courses)",
        duration: "10-day courses, 2x per year",
        confidence: 62,
        sources: [
          "Khavinson et al., 2002 — Bulletin of Experimental Biology",
          "Anisimov et al., 2003 — Mechanisms of Ageing and Development",
        ],
      },
      expert: null,
      experimental: {
        summary:
          "Western biohacking community has adopted Epithalon for anti-aging. Users report improved sleep, skin quality, and energy. Often combined with other peptide longevity stacks.",
        dosageRange: "5–10 mg/day for 10-day courses",
        frequency: "Twice-yearly 10-day courses",
        duration: "Ongoing longevity protocol",
        confidence: 40,
        sources: [
          "Biohacking forum community reports",
          "Longevity community survey data",
        ],
      },
    },
  },
  {
    slug: "mots-c",
    name: "MOTS-c",
    aliases: ["Mitochondrial Open Reading Frame Peptide", "Mitochondrial Derived Peptide"],
    category: "metabolic",
    route: "subcutaneous",
    status: "emerging",
    halfLife: "~30 minutes",
    typicalDoseRange: "5–15 mg/week",
    description:
      "A mitochondria-derived peptide that acts as a metabolic regulator. Improves insulin sensitivity, promotes fat oxidation, and has exercise-mimetic effects. Considered a next-generation metabolic therapeutic.",
    lanes: ["clinical", "experimental"],
    contraindications: [
      "Limited safety data — use caution",
      "Pregnancy or breastfeeding",
    ],
    interactions: [
      "Synergistic with exercise (amplifies metabolic benefits)",
      "May enhance metformin effects on AMPK pathway",
    ],
    laneData: {
      clinical: {
        summary:
          "Animal studies demonstrate improved insulin sensitivity, reduced fat mass, and enhanced exercise capacity. Early human studies show promise for obesity and type 2 diabetes. Acts via AMPK pathway.",
        dosageRange: "5–15 mg/week",
        frequency: "2–3x per week",
        duration: "4–12 weeks",
        confidence: 58,
        sources: [
          "Lee et al., 2015 — Cell Metabolism",
          "Reynolds et al., 2021 — Nature Communications",
        ],
      },
      expert: null,
      experimental: {
        summary:
          "Early adopters in biohacking community report significant improvements in metabolic flexibility, body composition, and exercise performance. Often stacked with semaglutide for synergistic metabolic effects.",
        dosageRange: "10 mg 3x/week",
        frequency: "3x per week",
        duration: "8 weeks on, 4 weeks off",
        confidence: 38,
        sources: [
          "Biohacking community early adopter reports",
          "Anti-aging conference presentations 2024",
        ],
      },
    },
  },
  {
    slug: "selank",
    name: "Selank",
    aliases: ["Thr-Lys-Pro-Arg-Pro-Gly-Pro", "TKPRPGP"],
    category: "neuroprotective",
    route: "intranasal",
    status: "emerging",
    halfLife: "~1–2 hours (intranasal)",
    typicalDoseRange: "250–750 mcg/day (intranasal)",
    description:
      "A Russian-developed synthetic analogue of tuftsin with anxiolytic and nootropic effects. Approved in Russia for anxiety and cognitive enhancement. Acts on GABA and serotonin pathways without sedation.",
    lanes: ["clinical", "expert"],
    contraindications: [
      "Limited Western safety data",
      "Pregnancy or breastfeeding",
    ],
    interactions: [
      "May enhance anxiolytic effects of benzodiazepines (use caution)",
      "Synergistic with Semax for cognitive enhancement",
    ],
    laneData: {
      clinical: {
        summary:
          "Approved in Russia with clinical data showing anxiolytic effects comparable to benzodiazepines without dependency, sedation, or withdrawal. Also demonstrates cognitive enhancement and immune modulation.",
        dosageRange: "250–750 mcg intranasally",
        frequency: "1–3 drops per nostril, 1–3x daily",
        duration: "10–14 day courses",
        confidence: 65,
        sources: [
          "Semenova et al., 2010 — Bulletin of Experimental Biology",
          "Russian clinical approval data (approved 1999)",
        ],
      },
      expert: {
        summary:
          "Used by functional medicine practitioners for anxiety, stress, and cognitive enhancement. The anxiolytic effect with cognitive clarity (not sedation) is highly valued. Often paired with Semax.",
        dosageRange: "300–500 mcg per dose intranasally",
        frequency: "2–3x daily",
        duration: "2-week courses with breaks",
        confidence: 70,
        sources: [
          "Nootropics community practitioner reviews",
          "Cognitive peptide protocols 2024",
        ],
      },
      experimental: null,
    },
  },
  {
    slug: "pt-141",
    name: "PT-141",
    aliases: ["Bremelanotide", "Vyleesi"],
    category: "immune",
    route: "subcutaneous",
    status: "well-researched",
    halfLife: "~2.7 hours",
    typicalDoseRange: "1–2 mg per use",
    description:
      "A melanocortin receptor agonist FDA-approved (as Vyleesi) for hypoactive sexual desire disorder. Acts on the CNS via melanocortin pathways to increase sexual desire in both men and women.",
    lanes: ["clinical", "expert"],
    contraindications: [
      "Uncontrolled hypertension",
      "Cardiovascular disease",
      "Pregnancy",
    ],
    interactions: [
      "Avoid with medications causing hypertension",
      "Synergistic with sildenafil/tadalafil (use lower doses of each)",
    ],
    laneData: {
      clinical: {
        summary:
          "FDA-approved for premenopausal women with HSDD. Phase III RECONNECT trials showed significant improvement in sexual desire. Also studied for erectile dysfunction with effectiveness in PDE5 inhibitor non-responders.",
        dosageRange: "1.75 mg (FDA-approved) or 0.5–2 mg (off-label)",
        frequency: "As needed, 45 min before activity",
        duration: "Per-use (no cycling required)",
        confidence: 90,
        sources: [
          "FDA drug approval — Vyleesi (bremelanotide) 2019",
          "RECONNECT trials — Journal of Sexual Medicine 2019",
        ],
      },
      expert: {
        summary:
          "Used by practitioners for sexual dysfunction in both sexes. Start at 0.5–1 mg to assess tolerance. Nausea management with ondansetron if needed.",
        dosageRange: "0.5–2 mg, titrate to effective dose",
        frequency: "As needed (max once daily)",
        duration: "Per-use",
        confidence: 82,
        sources: [
          "Sexual medicine practitioner protocols",
          "Urology and endocrinology clinic reports",
        ],
      },
      experimental: null,
    },
  },
  {
    slug: "ghrp-6",
    name: "GHRP-6",
    aliases: ["Growth Hormone Releasing Peptide-6"],
    category: "growth-hormone",
    route: "subcutaneous",
    status: "well-researched",
    halfLife: "~15–60 minutes",
    typicalDoseRange: "100–300 mcg per dose",
    description:
      "A first-generation growth hormone releasing peptide that stimulates GH secretion via ghrelin receptors. Strong GH pulse stimulation with notable hunger increase as primary side effect.",
    lanes: ["clinical", "expert"],
    contraindications: [
      "Active cancer or tumor history",
      "Diabetes mellitus (monitor closely)",
    ],
    interactions: [
      "Synergistic with GHRH analogs (CJC-1295) for amplified GH release",
      "Ghrelin receptor agonism significantly increases hunger",
    ],
    laneData: {
      clinical: {
        summary:
          "Strongly stimulates pituitary GH release via ghrelin receptor. Cardiac protective effects demonstrated. Well-characterized pharmacology with significant hunger stimulation as primary side effect.",
        dosageRange: "100–300 mcg per dose",
        frequency: "3x daily (AM, pre-workout, bedtime)",
        duration: "4–12 week cycles",
        confidence: 75,
        sources: [
          "Bowers et al., 1991 — Endocrinology",
          "Locatelli et al., 1994 — European Journal of Endocrinology",
        ],
      },
      expert: {
        summary:
          "Often replaced by Ipamorelin in modern protocols due to hunger side effect. Still used in bulking cycles where appetite stimulation is desired. Stack with CJC-1295 for synergy.",
        dosageRange: "100–200 mcg per dose",
        frequency: "3x daily",
        duration: "8–12 weeks, cycle off 4 weeks",
        confidence: 78,
        sources: [
          "Bodybuilding and fitness practitioner protocols",
          "Anti-aging clinic formulary data",
        ],
      },
      experimental: null,
    },
  },
  {
    slug: "bpc-157-oral",
    name: "BPC-157 (Oral)",
    aliases: ["BPC-157 Capsules", "Oral BPC", "Gut BPC"],
    category: "healing",
    route: "oral",
    status: "experimental",
    halfLife: "4–6 hours",
    typicalDoseRange: "500 mcg – 1 mg/day",
    description:
      "Oral formulation of BPC-157 targeting gut mucosal healing. Particularly valuable for inflammatory bowel disease, leaky gut, and GI ulceration without requiring injections.",
    lanes: ["experimental"],
    contraindications: [
      "Active cancer (theoretical angiogenesis concern)",
      "Pregnancy or breastfeeding",
    ],
    interactions: [
      "May protect GI mucosa when combined with NSAIDs",
      "Synergistic with probiotic protocols for gut healing",
    ],
    laneData: {
      clinical: null,
      expert: null,
      experimental: {
        summary:
          "Animal data shows oral BPC-157 is effective for GI tract healing. Community users report significant benefits for IBS, SIBO, and leaky gut. Lower systemic bioavailability than injectable form.",
        dosageRange: "500 mcg – 2 mg/day orally",
        frequency: "Once daily on empty stomach",
        duration: "4–8 weeks",
        confidence: 42,
        sources: [
          "Sikirić et al., 2016 — oral administration animal studies",
          "r/Peptides community data on oral bioavailability",
        ],
      },
    },
  },
] as const;

// ── Creators ──────────────────────────────────────────────────────────────────

export const MOCK_CREATORS: readonly Creator[] = [
  {
    id: "creator-1",
    name: "Dr. Marcus Reed",
    bio: "Anti-aging physician and peptide researcher. Board-certified in Internal Medicine with fellowship in Regenerative Medicine.",
    specialty: "Longevity & Regenerative Medicine",
    credentials: "MD, FACP",
    followers: 14200,
    protocolCount: 12,
    verified: true,
    avatarInitials: "MR",
    accentColor: "#00d4ff",
  },
  {
    id: "creator-2",
    name: "Alex Kovacs",
    bio: "Performance coach and biohacker with 8 years of peptide experimentation. Hosts the Peak Protocol podcast.",
    specialty: "Performance Optimization",
    credentials: "CSCS, CISSN",
    followers: 8750,
    protocolCount: 18,
    verified: true,
    avatarInitials: "AK",
    accentColor: "#ff6b35",
  },
  {
    id: "creator-3",
    name: "Dr. Elena Vasquez",
    bio: "PhD biochemist specializing in peptide synthesis and experimental compounds. Active researcher in novel peptide applications.",
    specialty: "Experimental Compounds",
    credentials: "PhD Biochemistry",
    followers: 5300,
    protocolCount: 9,
    verified: true,
    avatarInitials: "EV",
    accentColor: "#b366ff",
  },
] as const;

// ── Protocols ─────────────────────────────────────────────────────────────────

export const MOCK_PROTOCOLS: readonly Protocol[] = [
  {
    id: "healing-stack",
    hookTitle: "The Healing Stack",
    subtitle: "Accelerated tissue repair for injuries and recovery",
    intensity: "conservative",
    goals: ["injury-recovery", "joint-health", "gut-healing"],
    contentAngle: "clinical",
    duration: "8 weeks",
    progress: 38,
    startDate: "2026-02-16",
    creatorName: "Dr. Marcus Reed",
    rating: 4.8,
    ratingCount: 234,
    activeUsers: 1842,
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
    progress: 61,
    startDate: "2026-02-21",
    creatorName: "Alex Kovacs",
    rating: 4.9,
    ratingCount: 512,
    activeUsers: 3241,
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
    creatorName: "Dr. Elena Vasquez",
    rating: 4.6,
    ratingCount: 89,
    activeUsers: 421,
    description:
      "An advanced multi-compound protocol for maximum aesthetic and anti-aging outcomes. Combines GH optimization, skin rejuvenation, and metabolic enhancement. Requires careful monitoring.",
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
  {
    id: "longevity-basic",
    hookTitle: "The Longevity Stack",
    subtitle: "Research-backed anti-aging foundation protocol",
    intensity: "conservative",
    goals: ["anti-aging", "immune-support", "cognitive", "sleep"],
    contentAngle: "clinical",
    duration: "12 weeks",
    creatorName: "Dr. Marcus Reed",
    rating: 4.7,
    ratingCount: 178,
    activeUsers: 2104,
    description:
      "A conservative longevity protocol combining Epithalon for telomere support and Selank for cognitive and stress optimization. Ideal for biohacking beginners focused on healthy aging.",
    peptides: [
      {
        slug: "epithalon",
        name: "Epithalon",
        dose: "5 mg",
        frequency: "Daily (10-day courses)",
        route: "subcutaneous",
        timing: "Evening",
      },
      {
        slug: "selank",
        name: "Selank",
        dose: "400 mcg",
        frequency: "2x daily",
        route: "intranasal",
        timing: "Morning + Afternoon",
      },
    ],
  },
] as const;

// ── Dashboard Stats ───────────────────────────────────────────────────────────

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  activeProtocols: 2,
  dosesThisWeek: 19,
  complianceRate: 87,
  activePeptides: 4,
  streakDays: 13,
  totalLogged: 187,
};

// ── Daily Doses ───────────────────────────────────────────────────────────────

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
    protocolName: "The Healing Stack",
  },
  {
    id: "dose-2",
    peptideName: "TB-500",
    dose: "2.5 mg",
    route: "subcutaneous",
    site: "Upper arm (right)",
    scheduledTime: "08:00",
    taken: true,
    takenAt: "08:05",
    protocolName: "The Healing Stack",
  },
  {
    id: "dose-3",
    peptideName: "GHK-Cu Topical",
    dose: "Topical 1%",
    route: "topical",
    site: "Face + neck",
    scheduledTime: "08:30",
    taken: true,
    takenAt: "08:35",
    protocolName: "Full Send Looksmax",
  },
  {
    id: "dose-4",
    peptideName: "CJC-1295 / Ipamorelin",
    dose: "200 mcg each",
    route: "subcutaneous",
    site: "Lower abdomen (right)",
    scheduledTime: "22:00",
    taken: false,
    takenAt: null,
    protocolName: "Recomp Protocol",
  },
  {
    id: "dose-5",
    peptideName: "BPC-157",
    dose: "250 mcg",
    route: "subcutaneous",
    site: "Lower abdomen (right)",
    scheduledTime: "20:00",
    taken: false,
    takenAt: null,
    protocolName: "The Healing Stack",
  },
] as const;

// ── Outcome History (30 days) ─────────────────────────────────────────────────

export const MOCK_OUTCOMES: readonly OutcomeMetrics[] = [
  { date: "2026-01-29", weight: 191.0, bodyFat: 20.2, mood: 5, sleep: 5, energy: 5, soreness: 8, recovery: 4, notes: "" },
  { date: "2026-01-30", weight: 190.6, bodyFat: 20.0, mood: 5, sleep: 6, energy: 5, soreness: 7, recovery: 4, notes: "" },
  { date: "2026-01-31", weight: 190.2, bodyFat: 19.8, mood: 6, sleep: 6, energy: 5, soreness: 7, recovery: 5, notes: "" },
  { date: "2026-02-01", weight: 190.0, bodyFat: 19.7, mood: 6, sleep: 6, energy: 6, soreness: 7, recovery: 5, notes: "" },
  { date: "2026-02-02", weight: 189.8, bodyFat: 19.5, mood: 6, sleep: 7, energy: 6, soreness: 6, recovery: 5, notes: "" },
  { date: "2026-02-03", weight: 189.5, bodyFat: 19.3, mood: 6, sleep: 7, energy: 6, soreness: 6, recovery: 6, notes: "" },
  { date: "2026-02-04", weight: 189.1, bodyFat: 19.2, mood: 7, sleep: 7, energy: 6, soreness: 6, recovery: 6, notes: "" },
  { date: "2026-02-05", weight: 188.8, bodyFat: 19.0, mood: 7, sleep: 7, energy: 7, soreness: 5, recovery: 6, notes: "" },
  { date: "2026-02-06", weight: 188.5, bodyFat: 18.8, mood: 7, sleep: 7, energy: 7, soreness: 5, recovery: 7, notes: "" },
  { date: "2026-02-07", weight: 188.2, bodyFat: 18.7, mood: 7, sleep: 7, energy: 7, soreness: 5, recovery: 7, notes: "" },
  { date: "2026-02-08", weight: 187.9, bodyFat: 18.5, mood: 7, sleep: 8, energy: 7, soreness: 5, recovery: 7, notes: "" },
  { date: "2026-02-09", weight: 187.5, bodyFat: 18.3, mood: 7, sleep: 8, energy: 7, soreness: 4, recovery: 7, notes: "" },
  { date: "2026-02-10", weight: 187.2, bodyFat: 18.2, mood: 7, sleep: 8, energy: 7, soreness: 4, recovery: 8, notes: "" },
  { date: "2026-02-11", weight: 187.0, bodyFat: 18.0, mood: 7, sleep: 8, energy: 8, soreness: 4, recovery: 8, notes: "" },
  { date: "2026-02-12", weight: 186.7, bodyFat: 17.9, mood: 8, sleep: 8, energy: 8, soreness: 4, recovery: 8, notes: "" },
  { date: "2026-02-13", weight: 186.4, bodyFat: 17.7, mood: 8, sleep: 8, energy: 8, soreness: 4, recovery: 8, notes: "" },
  { date: "2026-02-14", weight: 186.0, bodyFat: 17.5, mood: 8, sleep: 8, energy: 8, soreness: 3, recovery: 8, notes: "" },
  { date: "2026-02-15", weight: 185.7, bodyFat: 17.4, mood: 8, sleep: 8, energy: 8, soreness: 3, recovery: 8, notes: "" },
  { date: "2026-02-16", weight: 185.5, bodyFat: 17.2, mood: 8, sleep: 9, energy: 8, soreness: 3, recovery: 9, notes: "Started BPC-157 + TB-500" },
  { date: "2026-02-17", weight: 185.2, bodyFat: 17.1, mood: 8, sleep: 9, energy: 8, soreness: 3, recovery: 9, notes: "" },
  { date: "2026-02-18", weight: 185.0, bodyFat: 17.0, mood: 8, sleep: 9, energy: 9, soreness: 2, recovery: 9, notes: "" },
  { date: "2026-02-19", weight: 184.7, bodyFat: 16.8, mood: 8, sleep: 9, energy: 9, soreness: 2, recovery: 9, notes: "Knee pain 80% improved" },
  { date: "2026-02-20", weight: 184.4, bodyFat: 16.7, mood: 9, sleep: 9, energy: 9, soreness: 2, recovery: 9, notes: "" },
  { date: "2026-02-21", weight: 184.1, bodyFat: 16.5, mood: 9, sleep: 9, energy: 9, soreness: 2, recovery: 9, notes: "Added CJC-1295/Ipa" },
  { date: "2026-02-22", weight: 183.8, bodyFat: 16.4, mood: 9, sleep: 9, energy: 9, soreness: 1, recovery: 10, notes: "" },
  { date: "2026-02-23", weight: 183.5, bodyFat: 16.2, mood: 9, sleep: 10, energy: 9, soreness: 1, recovery: 10, notes: "" },
  { date: "2026-02-24", weight: 183.2, bodyFat: 16.0, mood: 9, sleep: 10, energy: 10, soreness: 1, recovery: 10, notes: "" },
  { date: "2026-02-25", weight: 183.0, bodyFat: 15.9, mood: 9, sleep: 10, energy: 10, soreness: 1, recovery: 10, notes: "Best sleep ever" },
  { date: "2026-02-26", weight: 182.7, bodyFat: 15.7, mood: 10, sleep: 10, energy: 10, soreness: 1, recovery: 10, notes: "" },
  { date: "2026-02-27", weight: 182.4, bodyFat: 15.6, mood: 10, sleep: 10, energy: 10, soreness: 1, recovery: 10, notes: "" },
  { date: "2026-02-28", weight: 182.1, bodyFat: 15.4, mood: 10, sleep: 10, energy: 10, soreness: 1, recovery: 10, notes: "Best day yet — full protocol" },
] as const;

// ── Time Series (for charts) ───────────────────────────────────────────────────

export const MOCK_TIME_SERIES: readonly TimeSeriesPoint[] = MOCK_OUTCOMES.map((o) => ({
  date: o.date,
  weight: o.weight,
  bodyFat: o.bodyFat,
  mood: o.mood,
  sleep: o.sleep,
  energy: o.energy,
  recovery: o.recovery,
}));

// ── Weekly Compliance ──────────────────────────────────────────────────────────

export const MOCK_COMPLIANCE: readonly CompliancePoint[] = [
  { day: "Mon", compliance: 100, taken: 5, total: 5 },
  { day: "Tue", compliance: 80,  taken: 4, total: 5 },
  { day: "Wed", compliance: 100, taken: 5, total: 5 },
  { day: "Thu", compliance: 60,  taken: 3, total: 5 },
  { day: "Fri", compliance: 100, taken: 5, total: 5 },
  { day: "Sat", compliance: 100, taken: 5, total: 5 },
  { day: "Sun", compliance: 60,  taken: 3, total: 5 },
] as const;

// ── Protocol Timelines ────────────────────────────────────────────────────────

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

// ── Insight Cards ──────────────────────────────────────────────────────────────

export const MOCK_INSIGHTS: readonly InsightCard[] = [
  {
    id: "insight-1",
    title: "Sleep Score Breakthrough",
    description:
      "Your sleep scores improved 43% since adding CJC-1295/Ipamorelin on Feb 21. Average went from 6.9 to 9.8. GH pulsing during REM is likely the driver.",
    type: "positive",
    metric: "sleep",
    change: "+43%",
  },
  {
    id: "insight-2",
    title: "Weight Trend Accelerating",
    description:
      "You've lost 8.9 lbs in 30 days. Current trajectory puts you at 15% body fat in 3 weeks — ahead of schedule by 1 week.",
    type: "positive",
    metric: "weight",
    change: "-8.9 lbs",
  },
  {
    id: "insight-3",
    title: "Soreness Eliminated",
    description:
      "Soreness dropped from 8/10 to 1/10 since starting BPC-157 + TB-500. The healing protocol is performing exceptionally on your knee injury.",
    type: "positive",
    metric: "soreness",
    change: "-87%",
  },
  {
    id: "insight-4",
    title: "Recovery Score Peak",
    description:
      "Recovery score reached 10/10 for 8 consecutive days — highest sustained window in your tracked history.",
    type: "positive",
    metric: "recovery",
    change: "10/10",
  },
  {
    id: "insight-5",
    title: "Injection Site Rotation Needed",
    description:
      "Lower abdomen left used 7 times this week. Rotate to thigh or upper arm sites to prevent lipodystrophy and maintain absorption efficiency.",
    type: "warning",
    metric: "compliance",
    change: "Action required",
  },
  {
    id: "insight-6",
    title: "Thursday Compliance Dip",
    description:
      "You missed doses on 3 of the last 4 Thursdays. Adjust your Thursday evening routine or set an earlier reminder.",
    type: "warning",
    metric: "compliance",
    change: "60% Thursdays",
  },
] as const;

// ── Protocol Goals ─────────────────────────────────────────────────────────────

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
  "longevity",
  "neuroprotection",
] as const;

// ── Injection Sites ────────────────────────────────────────────────────────────

export const INJECTION_SITES: readonly InjectionSite[] = [
  { id: "abd-left",    label: "Abdomen (Left)",     x: 42, y: 52 },
  { id: "abd-right",   label: "Abdomen (Right)",    x: 58, y: 52 },
  { id: "thigh-left",  label: "Outer Thigh (Left)", x: 36, y: 70 },
  { id: "thigh-right", label: "Outer Thigh (Right)",x: 64, y: 70 },
  { id: "arm-left",    label: "Upper Arm (Left)",   x: 22, y: 37 },
  { id: "arm-right",   label: "Upper Arm (Right)",  x: 78, y: 37 },
  { id: "glute-left",  label: "Glute (Left)",       x: 40, y: 62 },
  { id: "glute-right", label: "Glute (Right)",      x: 60, y: 62 },
] as const;
