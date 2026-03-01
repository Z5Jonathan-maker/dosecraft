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
    category: "sexual-health",
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
  // ── Hormonal ──
  {
    slug: "testosterone-cypionate",
    name: "Testosterone Cypionate",
    aliases: ["Test Cyp", "Depo-Testosterone"],
    category: "hormonal",
    route: "intramuscular",
    status: "well-researched",
    halfLife: "8–12 days",
    typicalDoseRange: "100–200 mg/week",
    description:
      "Gold standard testosterone ester for TRT in the United States. Delivers stable serum testosterone levels with weekly or biweekly injections. FDA-approved for male hypogonadism with decades of clinical use.",
    lanes: ["clinical", "expert"],
    contraindications: [
      "Prostate or breast cancer",
      "Polycythemia (hematocrit > 54%)",
      "Severe sleep apnea (untreated)",
      "Pregnancy (Category X)",
    ],
    interactions: [
      "May potentiate anticoagulant effects (warfarin — monitor INR)",
      "Improves insulin sensitivity — adjust diabetes medications",
      "Combine with HCG to preserve fertility and testicular volume",
    ],
    laneData: {
      clinical: {
        summary:
          "FDA-approved for male hypogonadism with extensive long-term safety data. Restores serum testosterone to physiological range with predictable pharmacokinetics. Monitor hematocrit, PSA, and lipids quarterly.",
        dosageRange: "100–200 mg/week",
        frequency: "1–2x per week (split dosing preferred)",
        duration: "Ongoing TRT (indefinite)",
        confidence: 95,
        sources: [
          "Bhasin et al., 2018 — Journal of Clinical Endocrinology & Metabolism",
          "FDA prescribing information — Depo-Testosterone",
          "Endocrine Society Clinical Practice Guidelines 2018",
        ],
      },
      expert: {
        summary:
          "Jay Campbell and modern TRT practitioners recommend split dosing (2x/week) for stable levels and fewer side effects. Pair with AI only when estradiol-related symptoms arise. Subcutaneous injection gaining popularity as alternative to IM.",
        dosageRange: "120–180 mg/week (split into 2 doses)",
        frequency: "2x per week (e.g., Monday/Thursday)",
        duration: "Ongoing — lifetime protocol",
        confidence: 92,
        sources: [
          "Jay Campbell — The TRT MANual (2023 edition)",
          "Dr. Keith Nichols — TRT optimization protocols",
          "Defy Medical clinical guidelines",
        ],
      },
      experimental: null,
    },
  },
  {
    slug: "testosterone-enanthate",
    name: "Testosterone Enanthate",
    aliases: ["Test E", "Delatestryl"],
    category: "hormonal",
    route: "intramuscular",
    status: "well-researched",
    halfLife: "5–8 days",
    typicalDoseRange: "100–250 mg/week",
    description:
      "The most widely used testosterone ester globally for TRT and performance. Slightly shorter half-life than cypionate, making it popular in European and international protocols. Excellent clinical track record.",
    lanes: ["clinical", "expert"],
    contraindications: [
      "Prostate or breast cancer",
      "Polycythemia (hematocrit > 54%)",
      "Severe untreated sleep apnea",
      "Pregnancy (Category X)",
    ],
    interactions: [
      "Potentiates anticoagulant effects — monitor coagulation parameters",
      "Alters insulin sensitivity — adjust diabetic medications",
      "Often combined with HCG and AI for comprehensive TRT",
    ],
    laneData: {
      clinical: {
        summary:
          "Equivalent efficacy to cypionate with slightly shorter half-life. Preferred globally for TRT with strong safety data spanning decades. Same monitoring protocol as cypionate: hematocrit, PSA, lipids, estradiol.",
        dosageRange: "100–250 mg/week",
        frequency: "1–2x per week",
        duration: "Ongoing TRT (indefinite)",
        confidence: 94,
        sources: [
          "Nieschlag & Behre, 2012 — Testosterone: Action, Deficiency, Substitution",
          "Snyder et al., 2016 — NEJM (Testosterone Trials)",
          "European Association of Urology TRT Guidelines",
        ],
      },
      expert: {
        summary:
          "Interchangeable with cypionate in clinical practice. Some practitioners prefer enanthate for its slightly faster clearance allowing quicker dose adjustments. Split dosing protocol identical to cypionate.",
        dosageRange: "100–200 mg/week (split doses)",
        frequency: "2x per week",
        duration: "Ongoing — lifetime protocol",
        confidence: 90,
        sources: [
          "Testosterone replacement therapy practitioner consensus",
          "International Society for Sexual Medicine guidelines",
        ],
      },
      experimental: null,
    },
  },
  {
    slug: "testosterone-propionate",
    name: "Testosterone Propionate",
    aliases: ["Test Prop", "Test P"],
    category: "hormonal",
    route: "intramuscular",
    status: "well-researched",
    halfLife: "2–3 days",
    typicalDoseRange: "25–50 mg EOD",
    description:
      "Short-acting testosterone ester providing rapid onset and quick clearance. Requires frequent injections but allows precise dose titration. Favored for fine-tuning testosterone levels and managing side effects.",
    lanes: ["clinical", "expert"],
    contraindications: [
      "Prostate or breast cancer",
      "Polycythemia",
      "Severe sleep apnea",
    ],
    interactions: [
      "Same anticoagulant and insulin interactions as other testosterone esters",
      "Rapid clearance useful for fertility recovery protocols",
      "Lower estrogen conversion due to stable levels from frequent dosing",
    ],
    laneData: {
      clinical: {
        summary:
          "Well-characterized short ester with rapid pharmacokinetics. Used clinically for diagnostic testosterone challenges and when quick dose adjustments are needed. More injection-site discomfort than longer esters.",
        dosageRange: "25–50 mg every other day",
        frequency: "Every other day (EOD)",
        duration: "Ongoing or short-term titration",
        confidence: 88,
        sources: [
          "Behre & Nieschlag, 1998 — European Journal of Endocrinology",
          "Pharmacokinetic comparison studies — testosterone esters",
        ],
      },
      expert: {
        summary:
          "Preferred by some practitioners for patients sensitive to estrogen fluctuations. Daily or EOD dosing produces very stable serum levels. Often used during initial TRT titration before switching to longer esters.",
        dosageRange: "20–50 mg EOD or 10–25 mg daily",
        frequency: "Every other day or daily",
        duration: "Short-term titration or ongoing",
        confidence: 82,
        sources: [
          "Precision TRT dosing protocols — clinic data",
          "Endocrine practitioner experience reports",
        ],
      },
      experimental: null,
    },
  },
  {
    slug: "hcg",
    name: "HCG",
    aliases: ["Human Chorionic Gonadotropin", "Pregnyl", "Ovidrel"],
    category: "hormonal",
    route: "subcutaneous",
    status: "well-researched",
    halfLife: "24–36 hours",
    typicalDoseRange: "250–500 IU 2–3x/week",
    description:
      "A glycoprotein hormone that mimics LH, maintaining testicular function and fertility during TRT. Prevents testicular atrophy and preserves intratesticular testosterone production. Essential adjunct to exogenous testosterone.",
    lanes: ["clinical", "expert"],
    contraindications: [
      "Hormone-sensitive cancers (prostate, breast)",
      "Precocious puberty",
      "Ovarian hyperstimulation risk in females",
    ],
    interactions: [
      "Essential adjunct to TRT for fertility preservation",
      "May increase estradiol — monitor and adjust AI if needed",
      "Synergistic with clomiphene for PCT protocols",
    ],
    laneData: {
      clinical: {
        summary:
          "FDA-approved for hypogonadotropic hypogonadism and fertility. Maintains intratesticular testosterone at ~25% of baseline during TRT. Preserves spermatogenesis and testicular volume in men on exogenous testosterone.",
        dosageRange: "250–500 IU per injection",
        frequency: "2–3x per week",
        duration: "Ongoing with TRT",
        confidence: 90,
        sources: [
          "Coviello et al., 2008 — Journal of Clinical Endocrinology & Metabolism",
          "Hsieh et al., 2013 — Journal of Urology",
          "FDA prescribing information — Pregnyl",
        ],
      },
      expert: {
        summary:
          "Standard TRT adjunct at 250–500 IU EOD or 3x/week. Prevents the 'flat' feeling from testicular shutdown on TRT. Some practitioners prefer lower, more frequent dosing (150 IU daily) for stable levels.",
        dosageRange: "250 IU EOD or 500 IU 2x/week",
        frequency: "Every other day or 2–3x per week",
        duration: "Continuous with TRT",
        confidence: 88,
        sources: [
          "Defy Medical HCG protocols",
          "Jay Campbell — TRT adjunct recommendations",
          "Male fertility preservation consensus 2023",
        ],
      },
      experimental: null,
    },
  },
  {
    slug: "anastrozole",
    name: "Anastrozole",
    aliases: ["Arimidex", "AI"],
    category: "hormonal",
    route: "oral",
    status: "well-researched",
    halfLife: "46–50 hours",
    typicalDoseRange: "0.25–0.5 mg 2–3x/week",
    description:
      "A potent aromatase inhibitor used to manage estrogen levels in men on testosterone therapy. Prevents estrogen-related side effects like gynecomastia and water retention. Requires careful dosing to avoid crashing estradiol.",
    lanes: ["clinical", "expert"],
    contraindications: [
      "Osteoporosis or low bone density (chronic use reduces estrogen)",
      "Pre-menopausal women (unless clinically indicated)",
      "Known hypersensitivity to anastrozole",
    ],
    interactions: [
      "Overuse crashes estradiol — joint pain, mood issues, low libido",
      "Dose-dependent: small changes have large hormonal impact",
      "Monitor estradiol sensitive assay — target 20–35 pg/mL on TRT",
    ],
    laneData: {
      clinical: {
        summary:
          "FDA-approved for breast cancer in postmenopausal women; widely used off-label for estrogen management in male TRT. Potently inhibits aromatase enzyme. Long half-life allows infrequent dosing.",
        dosageRange: "0.25–1 mg per dose",
        frequency: "2–3x per week",
        duration: "As needed with TRT",
        confidence: 92,
        sources: [
          "FDA prescribing information — Arimidex",
          "Endocrine Society guidelines on testosterone therapy",
          "Leder et al., 2004 — Journal of Clinical Endocrinology & Metabolism",
        ],
      },
      expert: {
        summary:
          "Modern TRT practitioners use AI sparingly — only for symptomatic high estradiol. Many advocate 'no AI' protocols with optimized injection frequency. When needed, 0.25 mg twice weekly is typical starting point.",
        dosageRange: "0.125–0.5 mg per dose",
        frequency: "1–3x per week (symptom-guided)",
        duration: "As needed — minimize chronic use",
        confidence: 85,
        sources: [
          "Jay Campbell — estrogen management protocols",
          "Dr. Neal Rouzier — 'Estrogen is not the enemy' framework",
          "TRT practitioner consensus on minimal AI use",
        ],
      },
      experimental: null,
    },
  },
  {
    slug: "enclomiphene",
    name: "Enclomiphene",
    aliases: ["Androxal"],
    category: "hormonal",
    route: "oral",
    status: "emerging",
    halfLife: "10 hours",
    typicalDoseRange: "12.5–25 mg/day",
    description:
      "A selective estrogen receptor modulator (SERM) that stimulates endogenous testosterone production without suppressing the HPT axis. Alternative to TRT for younger men wanting to preserve fertility and natural hormone production.",
    lanes: ["clinical", "expert"],
    contraindications: [
      "Liver disease or elevated liver enzymes",
      "Venous thromboembolism history",
      "Hormone-sensitive cancers",
    ],
    interactions: [
      "Cannot be combined with exogenous testosterone (defeats purpose)",
      "May stack with HCG for enhanced endogenous production",
      "Monitor LH, FSH, and total testosterone monthly",
    ],
    laneData: {
      clinical: {
        summary:
          "Phase III trials demonstrated significant testosterone elevation (200–400 ng/dL increase) while maintaining or improving sperm parameters. Trans-isomer of clomiphene without the estrogenic zuclomiphene side effects.",
        dosageRange: "12.5–25 mg daily",
        frequency: "Once daily",
        duration: "3–6 months with reassessment",
        confidence: 72,
        sources: [
          "Kaminetsky et al., 2013 — Fertility and Sterility",
          "Androxal Phase III trial data — Repros Therapeutics",
          "Kim et al., 2020 — Andrologia",
        ],
      },
      expert: {
        summary:
          "Increasingly prescribed as TRT alternative for men under 35 with secondary hypogonadism. Maintains fertility while boosting testosterone. Some practitioners use 12.5 mg EOD to start, titrating based on labs.",
        dosageRange: "12.5 mg EOD to 25 mg daily",
        frequency: "Daily or every other day",
        duration: "Ongoing with quarterly labs",
        confidence: 78,
        sources: [
          "Male fertility clinic protocols 2024",
          "Anti-aging practitioner consensus on SERMs",
          "Defy Medical enclomiphene protocols",
        ],
      },
      experimental: null,
    },
  },
  {
    slug: "dhea",
    name: "DHEA",
    aliases: ["Dehydroepiandrosterone"],
    category: "hormonal",
    route: "oral",
    status: "well-researched",
    halfLife: "15–38 hours",
    typicalDoseRange: "25–100 mg/day",
    description:
      "A naturally occurring precursor hormone that converts to both testosterone and estrogen. Available OTC as a dietary supplement. Levels decline significantly with age, making supplementation popular in anti-aging protocols.",
    lanes: ["clinical", "expert"],
    contraindications: [
      "Hormone-sensitive cancers",
      "PCOS in women (may worsen androgen excess)",
      "Liver disease",
    ],
    interactions: [
      "Converts to androgens and estrogens — may affect hormone-sensitive conditions",
      "Synergistic with pregnenolone for comprehensive hormone support",
      "May interact with insulin and diabetes medications",
    ],
    laneData: {
      clinical: {
        summary:
          "Extensive research shows age-related decline and supplementation benefits for adrenal insufficiency. Mixed results for anti-aging claims, but consistent benefits for mood, bone density, and sexual function in deficient populations.",
        dosageRange: "25–100 mg daily",
        frequency: "Once daily (morning)",
        duration: "Ongoing with annual monitoring",
        confidence: 70,
        sources: [
          "Arlt et al., 1999 — NEJM",
          "Baulieu et al., 2000 — Proceedings of the National Academy of Sciences",
          "Labrie et al., 2005 — Journal of Clinical Endocrinology & Metabolism",
        ],
      },
      expert: {
        summary:
          "Anti-aging practitioners use DHEA to restore youthful levels (target DHEA-S 250–400 mcg/dL). Doses vary by sex: men 25–100 mg, women 5–25 mg. Monitor DHEA-S levels and downstream hormones quarterly.",
        dosageRange: "25–50 mg (men), 5–25 mg (women)",
        frequency: "Once daily, morning",
        duration: "Ongoing with lab monitoring",
        confidence: 68,
        sources: [
          "Life Extension Foundation protocols",
          "Anti-aging medicine clinical guidelines",
        ],
      },
      experimental: null,
    },
  },
  {
    slug: "pregnenolone",
    name: "Pregnenolone",
    aliases: ["Preg"],
    category: "hormonal",
    route: "oral",
    status: "emerging",
    halfLife: "1–2 hours",
    typicalDoseRange: "50–100 mg/day",
    description:
      "The 'master' precursor hormone from which all steroid hormones are synthesized. Supports neurosteroid production, cognitive function, and mood. Often depleted during TRT due to HPT axis suppression.",
    lanes: ["clinical", "expert"],
    contraindications: [
      "Hormone-sensitive cancers",
      "Seizure disorders (neurosteroid activity)",
      "Pregnancy or breastfeeding",
    ],
    interactions: [
      "Converts to downstream hormones — may affect hormone panels",
      "Synergistic with DHEA for comprehensive precursor support",
      "May enhance GABAergic activity — caution with sedatives",
    ],
    laneData: {
      clinical: {
        summary:
          "Limited but growing clinical data showing cognitive benefits and neuroprotective properties. Acts as a neurosteroid precursor with potential benefits for memory, mood, and stress resilience. More research needed in human populations.",
        dosageRange: "50–100 mg daily",
        frequency: "Once daily",
        duration: "Ongoing",
        confidence: 55,
        sources: [
          "Marx et al., 2009 — American Journal of Psychiatry",
          "Vallée et al., 2001 — Proceedings of the National Academy of Sciences",
        ],
      },
      expert: {
        summary:
          "Increasingly added to TRT protocols to replace suppressed endogenous production. Practitioners report patients feel 'more complete' with pregnenolone added. Typical dose 50–100 mg morning with DHEA.",
        dosageRange: "50–100 mg daily",
        frequency: "Once daily (morning)",
        duration: "Ongoing with TRT",
        confidence: 65,
        sources: [
          "TRT optimization practitioner protocols",
          "Functional medicine hormone restoration guidelines",
          "Dr. Mark Gordon — neurosteroid replacement research",
        ],
      },
      experimental: null,
    },
  },
  // ── Growth Hormone (additional) ──
  {
    slug: "tesamorelin",
    name: "Tesamorelin",
    aliases: ["Egrifta"],
    category: "growth-hormone",
    route: "subcutaneous",
    status: "well-researched",
    halfLife: "26 minutes",
    typicalDoseRange: "1–2 mg/day",
    description:
      "An FDA-approved GHRH analog originally indicated for HIV-associated lipodystrophy. Potent visceral fat reducer with demonstrated IGF-1 elevation. Considered the most effective single-agent GH secretagogue for body composition.",
    lanes: ["clinical", "expert"],
    contraindications: [
      "Disruption of hypothalamic-pituitary axis (recent surgery, trauma)",
      "Active malignancy",
      "Pregnancy or breastfeeding",
      "Hypersensitivity to tesamorelin or mannitol",
    ],
    interactions: [
      "Monitor glucose — may impair insulin sensitivity at high doses",
      "Synergistic with Ipamorelin for enhanced GH pulsatility",
      "May require cortisol monitoring with chronic use",
    ],
    laneData: {
      clinical: {
        summary:
          "FDA-approved with Phase III data showing significant visceral adipose tissue reduction (−15% to −18%) and IGF-1 normalization. Well-tolerated with injection site reactions as primary adverse event. Only GHRH analog with FDA approval.",
        dosageRange: "1–2 mg daily",
        frequency: "Once daily (subcutaneous)",
        duration: "6–12 months, reassess",
        confidence: 88,
        sources: [
          "Falutz et al., 2007 — NEJM",
          "FDA prescribing information — Egrifta SV",
          "Stanley et al., 2014 — Journal of Clinical Endocrinology & Metabolism",
        ],
      },
      expert: {
        summary:
          "Gold standard GH secretagogue in anti-aging clinics. 1 mg daily subcutaneous before bed maximizes nocturnal GH pulse. Often combined with Ipamorelin for synergistic effect. More expensive but more effective than Sermorelin.",
        dosageRange: "1–2 mg daily",
        frequency: "Once daily at bedtime",
        duration: "3–6 month cycles",
        confidence: 85,
        sources: [
          "Anti-aging medicine clinical protocols 2024",
          "Dr. Rand McClain — GH optimization guidelines",
          "Peptide therapy practitioner consensus",
        ],
      },
      experimental: null,
    },
  },
  {
    slug: "sermorelin",
    name: "Sermorelin",
    aliases: ["Geref", "GRF 1-29"],
    category: "growth-hormone",
    route: "subcutaneous",
    status: "well-researched",
    halfLife: "10–20 minutes",
    typicalDoseRange: "200–500 mcg/day",
    description:
      "The first GHRH analog approved for clinical use, consisting of the first 29 amino acids of endogenous GHRH. Well-studied with a long safety track record. Stimulates physiological GH release from the pituitary.",
    lanes: ["clinical", "expert"],
    contraindications: [
      "Active malignancy",
      "Pituitary dysfunction or surgery",
      "Pregnancy or breastfeeding",
    ],
    interactions: [
      "Synergistic with GHRPs (Ipamorelin, GHRP-6) for amplified GH pulse",
      "May affect glucose metabolism — monitor fasting glucose",
      "Glucocorticoids may blunt GH response",
    ],
    laneData: {
      clinical: {
        summary:
          "Previously FDA-approved (Geref) for GH deficiency diagnosis and treatment. Stimulates pituitary GH release maintaining the natural pulsatile pattern and negative feedback. Extensive safety data over 20+ years of clinical use.",
        dosageRange: "200–500 mcg daily",
        frequency: "Once daily (bedtime)",
        duration: "3–6 months",
        confidence: 80,
        sources: [
          "Prakash & Goa, 1999 — BioDrugs",
          "Walker et al., 1990 — Journal of Clinical Endocrinology & Metabolism",
          "Vittone et al., 1997 — Journal of Gerontology",
        ],
      },
      expert: {
        summary:
          "Entry-level GH peptide with excellent safety profile. Often the first peptide prescribed by cautious practitioners. Bedtime dosing at 200–500 mcg. Being replaced by Tesamorelin and CJC-1295 in modern protocols.",
        dosageRange: "200–500 mcg nightly",
        frequency: "Once daily at bedtime",
        duration: "3–6 months, cycle off 1 month",
        confidence: 82,
        sources: [
          "Peptide therapy starter protocols — practitioner guidelines",
          "Anti-aging clinic formulary standards",
        ],
      },
      experimental: null,
    },
  },
  {
    slug: "mk-677",
    name: "MK-677 (Ibutamoren)",
    aliases: ["Ibutamoren", "Nutrobal"],
    category: "growth-hormone",
    route: "oral",
    status: "emerging",
    halfLife: "24 hours",
    typicalDoseRange: "10–25 mg/day",
    description:
      "An oral, non-peptide GH secretagogue that mimics ghrelin and stimulates sustained GH and IGF-1 elevation. Unique among GH-boosting compounds for its oral bioavailability and long half-life. Notable for increased appetite and water retention.",
    lanes: ["clinical", "expert", "experimental"],
    contraindications: [
      "Diabetes or insulin resistance (worsens glucose tolerance)",
      "Active cancer",
      "Congestive heart failure (fluid retention)",
    ],
    interactions: [
      "Significantly increases appetite via ghrelin mimicry",
      "May worsen insulin sensitivity — monitor fasting glucose and HbA1c",
      "Stacks with GHRH analogs for synergistic GH elevation",
    ],
    laneData: {
      clinical: {
        summary:
          "Phase II trials show sustained IGF-1 elevation, improved body composition, and enhanced sleep quality. Long-term study (2 years) in elderly showed maintained GH levels without tachyphylaxis. Concerns about glucose tolerance impact.",
        dosageRange: "10–25 mg daily",
        frequency: "Once daily (oral)",
        duration: "8–16 weeks typical",
        confidence: 72,
        sources: [
          "Nass et al., 2008 — Journal of Clinical Endocrinology & Metabolism",
          "Murphy et al., 1998 — Journal of Clinical Endocrinology & Metabolism",
          "Copinschi et al., 1997 — Neuroendocrinology",
        ],
      },
      expert: {
        summary:
          "Popular oral alternative to injectable GH peptides. 10–15 mg at bedtime for sleep and GH benefits; 25 mg for maximum effect. Water retention and hunger are dose-dependent side effects. Cycle 8 weeks on, 4 weeks off.",
        dosageRange: "10–25 mg nightly",
        frequency: "Once daily at bedtime",
        duration: "8 weeks on, 4 weeks off",
        confidence: 75,
        sources: [
          "Biohacking and peptide community consensus",
          "Performance optimization practitioner protocols",
        ],
      },
      experimental: {
        summary:
          "Long-term users report sustained improvements in sleep quality, skin elasticity, and hair growth. Some stack with metformin to counteract glucose tolerance issues. Community debates optimal cycling vs. continuous use.",
        dosageRange: "15–25 mg daily",
        frequency: "Daily, continuous",
        duration: "6+ months continuous with glucose monitoring",
        confidence: 50,
        sources: [
          "Reddit r/Peptides MK-677 mega-thread analysis",
          "Biohacking community long-term user reports",
        ],
      },
    },
  },
  {
    slug: "cjc-1295-no-dac",
    name: "CJC-1295 (No DAC)",
    aliases: ["Mod GRF 1-29", "Modified GRF"],
    category: "growth-hormone",
    route: "subcutaneous",
    status: "well-researched",
    halfLife: "~30 minutes",
    typicalDoseRange: "100–300 mcg per dose",
    description:
      "A shorter-acting GHRH analog without the Drug Affinity Complex (DAC). Produces acute GH pulses rather than sustained elevation, mimicking natural physiology more closely. Often paired with a GHRP for synergistic GH release.",
    lanes: ["clinical", "expert"],
    contraindications: [
      "Active malignancy",
      "Pituitary surgery or damage",
      "Diabetes (monitor glucose closely)",
    ],
    interactions: [
      "Highly synergistic with GHRPs (Ipamorelin, GHRP-6) for amplified GH pulse",
      "Fasting enhances GH response — inject on empty stomach",
      "Avoid carbohydrates 30 min before/after injection",
    ],
    laneData: {
      clinical: {
        summary:
          "Modified GRF 1-29 with amino acid substitutions for improved half-life over native GHRH. Produces physiological GH pulses maintaining natural feedback mechanisms. Preferred over DAC version for more natural GH pulsatility.",
        dosageRange: "100–300 mcg per dose",
        frequency: "1–3x daily",
        duration: "3–6 month cycles",
        confidence: 75,
        sources: [
          "Ionescu & Bhatt, 2018 — Endocrine Practice",
          "GHRH analog pharmacokinetic comparison studies",
        ],
      },
      expert: {
        summary:
          "Most commonly combined with Ipamorelin (1:1 ratio) for the 'CJC/Ipa' stack. Bedtime dosing essential for amplifying nocturnal GH surge. Pre-workout dosing for recovery enhancement. No DAC = no sustained GH bleed.",
        dosageRange: "100–200 mcg per dose (with equal Ipamorelin)",
        frequency: "2–3x daily (AM, pre-workout, bedtime)",
        duration: "12 weeks on, 4 weeks off",
        confidence: 82,
        sources: [
          "Anti-aging clinic peptide protocols 2024",
          "Peptide therapy practitioner guidelines — GHRH+GHRP synergy",
          "Performance medicine dosing consensus",
        ],
      },
      experimental: null,
    },
  },
  // ── Metabolic (additional) ──
  {
    slug: "aod-9604",
    name: "AOD-9604",
    aliases: ["Advanced Obesity Drug", "HGH Fragment 176-191"],
    category: "metabolic",
    route: "subcutaneous",
    status: "emerging",
    halfLife: "~30 minutes",
    typicalDoseRange: "300–600 mcg/day",
    description:
      "A modified fragment of human growth hormone (amino acids 176-191) specifically targeting fat metabolism without the growth-promoting effects of full-length GH. Originally developed as an anti-obesity drug with TGA approval in Australia as a food supplement.",
    lanes: ["clinical", "expert"],
    contraindications: [
      "Active cancer or tumor history",
      "Pregnancy or breastfeeding",
      "Severe metabolic disorders",
    ],
    interactions: [
      "Synergistic with fasted exercise for enhanced fat oxidation",
      "May complement GLP-1 agonists for multi-pathway fat loss",
      "Does not affect IGF-1 or blood glucose levels",
    ],
    laneData: {
      clinical: {
        summary:
          "Phase II trials showed modest fat reduction without affecting IGF-1, glucose, or insulin levels. Mechanism involves stimulation of lipolysis and inhibition of lipogenesis. TGA-listed in Australia with GRAS status.",
        dosageRange: "300–600 mcg daily",
        frequency: "Once daily (fasted AM)",
        duration: "8–12 weeks",
        confidence: 55,
        sources: [
          "Heffernan et al., 2001 — Obesity Research",
          "Ng et al., 2000 — Journal of Molecular Endocrinology",
        ],
      },
      expert: {
        summary:
          "Used in body composition clinics as a gentle fat-loss adjunct. Inject 300 mcg AM on empty stomach, 30 min before food. Often combined with BPC-157 for a 'heal and lean' protocol. Mild effect — manages expectations.",
        dosageRange: "300–600 mcg daily",
        frequency: "Once daily, fasted morning",
        duration: "8–12 weeks",
        confidence: 62,
        sources: [
          "Body composition clinic protocols",
          "Anti-aging medicine conference presentations 2023",
        ],
      },
      experimental: null,
    },
  },
  {
    slug: "nad-plus",
    name: "NAD+",
    aliases: ["Nicotinamide Adenine Dinucleotide", "NAD IV"],
    category: "metabolic",
    route: "subcutaneous",
    status: "emerging",
    halfLife: "varies by route",
    typicalDoseRange: "100–500 mg (IV) or 50–250 mg (SubQ)",
    description:
      "An essential coenzyme present in every living cell, critical for cellular energy production, DNA repair, and sirtuin activation. Levels decline significantly with age. Supplementation via IV or subcutaneous injection aims to restore youthful cellular function.",
    lanes: ["clinical", "expert", "experimental"],
    contraindications: [
      "Active cancer (theoretical concern with enhanced cellular metabolism)",
      "Severe liver disease",
      "Known hypersensitivity to nicotinamide compounds",
    ],
    interactions: [
      "Synergistic with sirtuin activators (resveratrol, quercetin)",
      "May enhance mitochondrial function when combined with CoQ10",
      "SubQ route produces flush and discomfort — titrate slowly",
    ],
    laneData: {
      clinical: {
        summary:
          "Strong preclinical evidence for NAD+ decline in aging and benefits of repletion. Human trials with NAD+ precursors (NMN, NR) show increased blood NAD+ levels. Direct NAD+ administration (IV/SubQ) bypasses oral bioavailability limitations.",
        dosageRange: "250–500 mg (IV) or 50–200 mg (SubQ)",
        frequency: "1–3x per week (SubQ) or weekly (IV)",
        duration: "Ongoing longevity protocol",
        confidence: 68,
        sources: [
          "Yoshino et al., 2021 — Science",
          "Rajman et al., 2018 — Cell Metabolism",
          "Shade, 2020 — Integrative Medicine (NAD+ routes of administration)",
        ],
      },
      expert: {
        summary:
          "IV NAD+ (250–500 mg) provides immediate cellular repletion but requires 2–4 hour infusion. SubQ injections (50–200 mg) are more practical for maintenance. Combine with NMN oral supplementation for sustained levels between injections.",
        dosageRange: "100–200 mg SubQ per session",
        frequency: "2–3x per week (SubQ)",
        duration: "Ongoing with periodic assessment",
        confidence: 72,
        sources: [
          "Longevity medicine clinic protocols",
          "NAD+ therapy practitioner guidelines 2024",
          "Biohacking conference presentations on NAD+ optimization",
        ],
      },
      experimental: {
        summary:
          "Community users report profound energy, mental clarity, and anti-aging effects from high-dose NAD+ protocols. Some combine with methylene blue and peptides for 'mitochondrial stacking.' Long-term safety data for direct NAD+ injection still limited.",
        dosageRange: "200–500 mg SubQ or 500–1000 mg IV",
        frequency: "2–5x per week",
        duration: "Continuous anti-aging protocol",
        confidence: 45,
        sources: [
          "Biohacking community NAD+ therapy reports",
          "Longevity subreddit analysis — NAD+ protocols",
        ],
      },
    },
  },
  // ── Sexual Health (additional) ──
  {
    slug: "melanotan-ii",
    name: "Melanotan II",
    aliases: ["MT-2", "MT2"],
    category: "sexual-health",
    route: "subcutaneous",
    status: "experimental",
    halfLife: "~1 hour",
    typicalDoseRange: "0.25–0.5 mg per dose",
    description:
      "A synthetic melanocortin agonist that stimulates melanogenesis (tanning) and sexual arousal. Acts on MC1R (skin pigmentation) and MC4R (sexual function) receptors. Popular for cosmetic tanning and libido enhancement despite unregulated status.",
    lanes: ["expert", "experimental"],
    contraindications: [
      "History of melanoma or atypical moles",
      "Moles/nevi requiring monitoring (may darken and obscure changes)",
      "Autoimmune skin conditions",
      "Cardiovascular disease",
    ],
    interactions: [
      "Synergistic with UV exposure for tanning (start with minimal sun)",
      "May cause nausea — dose slowly and use anti-emetic if needed",
      "Can cause prolonged erections — use caution with PDE5 inhibitors",
    ],
    laneData: {
      clinical: null,
      expert: {
        summary:
          "Loading protocol of 0.25 mg daily for 7–10 days, then maintenance 0.5 mg 1–2x/week with sun exposure. Nausea common at first — start low. Sexual side effects dose-dependent. Requires dermatological monitoring for mole changes.",
        dosageRange: "0.25–0.5 mg per dose",
        frequency: "Daily loading → 1–2x/week maintenance",
        duration: "Loading 7–10 days, then seasonal use",
        confidence: 65,
        sources: [
          "Peptide community tanning protocols",
          "Aesthetic medicine practitioner guidelines",
          "Dermatology safety monitoring recommendations",
        ],
      },
      experimental: {
        summary:
          "Widely used in fitness and aesthetics communities despite lack of regulatory approval. Users report dramatic tanning with minimal UV, enhanced libido, and appetite suppression. Long-term melanoma risk remains debated.",
        dosageRange: "0.5–1 mg per dose",
        frequency: "2–3x per week",
        duration: "Seasonal cycles (spring–summer)",
        confidence: 48,
        sources: [
          "Reddit r/Peptides Melanotan community reports",
          "Bodybuilding forum tanning protocol archives",
        ],
      },
    },
  },
  {
    slug: "kisspeptin-10",
    name: "Kisspeptin-10",
    aliases: ["KP-10", "Metastin"],
    category: "sexual-health",
    route: "subcutaneous",
    status: "experimental",
    halfLife: "~28 minutes",
    typicalDoseRange: "5–15 mcg/kg",
    description:
      "A neuropeptide that acts as a master regulator of the hypothalamic-pituitary-gonadal axis. Stimulates GnRH release, triggering LH and FSH secretion. Emerging research in reproductive medicine for diagnosing and treating hypogonadism and infertility.",
    lanes: ["clinical", "experimental"],
    contraindications: [
      "Hormone-sensitive cancers",
      "Precocious puberty",
      "Pregnancy (may disrupt hormonal balance)",
    ],
    interactions: [
      "Stimulates entire HPG axis — affects LH, FSH, and downstream sex steroids",
      "Research tool for HPG axis assessment",
      "Short half-life necessitates frequent dosing or infusion",
    ],
    laneData: {
      clinical: {
        summary:
          "Clinical research demonstrates potent GnRH-stimulating activity. Used as a diagnostic tool for reproductive axis function. Phase II studies in hypothalamic amenorrhea and male hypogonadism show promise for restoring natural hormone production.",
        dosageRange: "5–15 mcg/kg per dose",
        frequency: "Varies by research protocol",
        duration: "Acute diagnostic or short-term therapeutic",
        confidence: 58,
        sources: [
          "Dhillo et al., 2005 — Journal of Clinical Endocrinology & Metabolism",
          "Jayasena et al., 2014 — Journal of Clinical Investigation",
        ],
      },
      expert: null,
      experimental: {
        summary:
          "Early biohacking community interest as a natural HPG axis stimulator. Some users explore kisspeptin as PCT (post-cycle therapy) alternative. Very limited self-experimentation data — primarily remains a clinical research tool.",
        dosageRange: "10 mcg/kg per dose",
        frequency: "1–2x daily",
        duration: "2–4 weeks (experimental)",
        confidence: 42,
        sources: [
          "Endocrine research on kisspeptin signaling",
          "Biohacking community early reports",
        ],
      },
    },
  },
  // ── Immune (additional) ──
  {
    slug: "thymosin-alpha-1",
    name: "Thymosin Alpha-1",
    aliases: ["Tα1", "Zadaxin"],
    category: "immune",
    route: "subcutaneous",
    status: "well-researched",
    halfLife: "~2 hours",
    typicalDoseRange: "1.6 mg 2x/week",
    description:
      "A thymic peptide approved in 35+ countries for immune modulation. Enhances T-cell function, dendritic cell maturation, and overall immune surveillance. Used clinically for hepatitis B/C, immunodeficiency, and as a vaccine adjuvant.",
    lanes: ["clinical", "expert"],
    contraindications: [
      "Organ transplant recipients on immunosuppression",
      "Active autoimmune disease flares (may exacerbate)",
      "Known hypersensitivity to thymosin peptides",
    ],
    interactions: [
      "Synergistic with vaccines — enhances immune response",
      "Use caution with immunosuppressant medications",
      "May complement other immune peptides (Epithalon, LL-37)",
    ],
    laneData: {
      clinical: {
        summary:
          "Approved in 35+ countries with extensive clinical data. Phase III trials for hepatitis B/C showed improved viral clearance and immune reconstitution. Used as adjunct in cancer immunotherapy protocols. Well-tolerated with minimal side effects.",
        dosageRange: "1.6 mg per dose",
        frequency: "2x per week (subcutaneous)",
        duration: "6–12 month courses",
        confidence: 82,
        sources: [
          "Garaci et al., 2012 — Annals of the New York Academy of Sciences",
          "SciClone Pharmaceuticals — Zadaxin clinical data",
          "Tuthill et al., 2010 — Clinical and Experimental Immunology",
        ],
      },
      expert: {
        summary:
          "Core immune peptide in longevity and functional medicine protocols. Standard 1.6 mg SubQ twice weekly. Often combined with Epithalon for immune + telomere support. Used prophylactically during cold/flu season and for chronic infection support.",
        dosageRange: "1.6 mg 2x/week",
        frequency: "Twice weekly",
        duration: "Ongoing or seasonal (12–24 weeks)",
        confidence: 78,
        sources: [
          "Functional medicine immune optimization protocols",
          "Peptide therapy immune support guidelines 2024",
          "Longevity medicine practitioner consensus",
        ],
      },
      experimental: null,
    },
  },
  {
    slug: "ll-37",
    name: "LL-37",
    aliases: ["Cathelicidin", "Human Cathelicidin Antimicrobial Peptide"],
    category: "immune",
    route: "subcutaneous",
    status: "emerging",
    halfLife: "~4 hours",
    typicalDoseRange: "50–100 mcg/day",
    description:
      "The only human cathelicidin antimicrobial peptide, with broad-spectrum activity against bacteria, viruses, and fungi. Plays a critical role in innate immune defense, wound healing, and biofilm disruption. Emerging therapeutic for chronic infections.",
    lanes: ["clinical", "expert"],
    contraindications: [
      "Autoimmune conditions (psoriasis, rosacea — LL-37 overexpression implicated)",
      "Pregnancy or breastfeeding",
      "Known hypersensitivity",
    ],
    interactions: [
      "Synergistic with BPC-157 for infection-complicated wound healing",
      "May enhance antibiotic efficacy against biofilm infections",
      "Complement with Thymosin Alpha-1 for comprehensive immune support",
    ],
    laneData: {
      clinical: {
        summary:
          "Extensive research on LL-37 as an endogenous antimicrobial with activity against gram-positive and gram-negative bacteria, enveloped viruses, and fungi. Disrupts biofilms and modulates inflammatory responses. Clinical trials for wound healing underway.",
        dosageRange: "50–100 mcg daily",
        frequency: "Once daily (subcutaneous)",
        duration: "4–8 weeks",
        confidence: 60,
        sources: [
          "Vandamme et al., 2012 — Cell Immunology",
          "Overhage et al., 2008 — Infection and Immunity",
          "Dürr et al., 2006 — Biochimica et Biophysica Acta",
        ],
      },
      expert: {
        summary:
          "Used by integrative practitioners for chronic infections, Lyme disease support, and biofilm disruption. Subcutaneous injection at infection-proximal sites preferred. Often combined with BPC-157 for healing + antimicrobial coverage.",
        dosageRange: "50–100 mcg daily",
        frequency: "Once daily",
        duration: "4–8 weeks per course",
        confidence: 65,
        sources: [
          "Integrative medicine infection protocols",
          "Lyme disease peptide therapy guidelines",
          "Biofilm disruption practitioner strategies",
        ],
      },
      experimental: null,
    },
  },
  {
    slug: "kpv",
    name: "KPV",
    aliases: ["Lysine-Proline-Valine", "Alpha-MSH Fragment"],
    category: "immune",
    route: "oral",
    status: "experimental",
    halfLife: "~30 minutes",
    typicalDoseRange: "200–500 mcg/day",
    description:
      "A tripeptide fragment derived from alpha-melanocyte-stimulating hormone (alpha-MSH) with potent anti-inflammatory properties. Acts on NF-kB pathway to reduce inflammation. Emerging interest for IBD, gut inflammation, and systemic inflammatory conditions.",
    lanes: ["expert", "experimental"],
    contraindications: [
      "Immunosuppressed patients (further immune modulation risk)",
      "Pregnancy or breastfeeding",
      "Active infections requiring full immune response",
    ],
    interactions: [
      "Synergistic with BPC-157 for gut healing protocols",
      "May complement oral BPC-157 for comprehensive GI support",
      "Anti-inflammatory effect may reduce efficacy of fever-dependent immune responses",
    ],
    laneData: {
      clinical: null,
      expert: {
        summary:
          "Increasingly used in functional medicine for gut inflammation, IBD support, and systemic anti-inflammatory protocols. Oral route targets GI tract directly. Often combined with oral BPC-157 for a comprehensive gut-healing stack.",
        dosageRange: "200–500 mcg daily",
        frequency: "Once daily (oral, empty stomach)",
        duration: "4–8 weeks",
        confidence: 55,
        sources: [
          "Functional medicine gut healing protocols",
          "Peptide therapy for IBD — practitioner case reports",
          "Alpha-MSH fragment research reviews",
        ],
      },
      experimental: {
        summary:
          "Community users report significant reduction in GI inflammation symptoms, skin inflammation, and autoimmune flares. Oral bioavailability debated but anecdotally effective. Some users combine oral and subcutaneous routes.",
        dosageRange: "500 mcg daily oral or 200 mcg SubQ",
        frequency: "Once daily",
        duration: "6–12 weeks",
        confidence: 40,
        sources: [
          "r/Peptides KPV community discussion threads",
          "Biohacking community anti-inflammatory reports",
        ],
      },
    },
  },
  // ── Sleep ──
  {
    slug: "dsip",
    name: "DSIP",
    aliases: ["Delta Sleep-Inducing Peptide"],
    category: "sleep",
    route: "subcutaneous",
    status: "experimental",
    halfLife: "~15 minutes",
    typicalDoseRange: "100–300 mcg before bed",
    description:
      "A neuropeptide originally isolated from rabbit cerebral venous blood that promotes delta wave (deep) sleep. Acts on multiple neurotransmitter systems including GABA, serotonin, and endogenous opioids. Research ongoing but mechanism not fully elucidated.",
    lanes: ["clinical", "experimental"],
    contraindications: [
      "Severe depression (may affect monoamine systems)",
      "Epilepsy or seizure disorders",
      "Concurrent use of CNS depressants",
    ],
    interactions: [
      "May potentiate sedative medications — use caution",
      "Theoretically synergistic with melatonin for sleep optimization",
      "Avoid combining with alcohol or benzodiazepines",
    ],
    laneData: {
      clinical: {
        summary:
          "Initial research demonstrated promotion of delta wave sleep patterns and normalization of disturbed sleep. Mixed results in subsequent studies — some show clear sleep architecture improvements while others show modest effects. Mechanism involves multiple neuromodulatory pathways.",
        dosageRange: "100–300 mcg per dose",
        frequency: "Once nightly (30 min before bed)",
        duration: "2–4 week courses",
        confidence: 48,
        sources: [
          "Schoenenberger & Monnier, 1977 — Proceedings of the National Academy of Sciences",
          "Graf & Kastin, 1986 — Neuroscience & Biobehavioral Reviews",
        ],
      },
      expert: null,
      experimental: {
        summary:
          "Community users report improved sleep quality and more vivid dreams. Effects variable — some users experience dramatic improvement while others notice minimal change. Often cycled in 2-week blocks. Best combined with good sleep hygiene practices.",
        dosageRange: "200–300 mcg nightly",
        frequency: "Once nightly before bed",
        duration: "2 weeks on, 2 weeks off",
        confidence: 42,
        sources: [
          "Peptide community sleep optimization reports",
          "Biohacking forum DSIP experience threads",
        ],
      },
    },
  },
  // ── Neuroprotective (additional) ──
  {
    slug: "semax",
    name: "Semax",
    aliases: ["ACTH 4-10 Analog", "Heptapeptide"],
    category: "neuroprotective",
    route: "intranasal",
    status: "emerging",
    halfLife: "~30 seconds (converted rapidly)",
    typicalDoseRange: "200–600 mcg/day intranasal",
    description:
      "A Russian-developed synthetic heptapeptide analog of ACTH(4-10) with potent nootropic and neuroprotective properties. Approved in Russia for stroke recovery, cognitive disorders, and optic nerve disease. Enhances BDNF expression and neuroplasticity.",
    lanes: ["clinical", "expert"],
    contraindications: [
      "Acute psychosis or mania",
      "Seizure disorders (lower seizure threshold possible)",
      "Pregnancy or breastfeeding",
    ],
    interactions: [
      "Synergistic with Selank for combined cognitive + anxiolytic effects",
      "May enhance stimulant effects — reduce caffeine if combining",
      "Positive interaction with racetam nootropics",
    ],
    laneData: {
      clinical: {
        summary:
          "Approved in Russia for cerebrovascular disease, optic nerve atrophy, and cognitive enhancement. Clinical studies demonstrate neuroprotective effects via BDNF upregulation, improved cerebral circulation, and enhanced cognitive performance in brain-injured patients.",
        dosageRange: "200–600 mcg intranasally",
        frequency: "2–3x daily (intranasal drops)",
        duration: "10–14 day courses",
        confidence: 68,
        sources: [
          "Ashmarin et al., 1995 — Neuroscience Research Communications",
          "Russian Ministry of Health clinical approval data",
          "Dolotov et al., 2006 — Neuroscience",
        ],
      },
      expert: {
        summary:
          "Premier nootropic peptide in functional medicine. 200–300 mcg per nostril, 2–3x daily. Effects noticeable within days — enhanced focus, verbal fluency, and mental clarity. Often stacked with Selank (Semax AM for focus, Selank PM for calm).",
        dosageRange: "200–600 mcg daily intranasal",
        frequency: "2–3 doses throughout the day",
        duration: "10–14 day courses, 2-week break between",
        confidence: 72,
        sources: [
          "Nootropic practitioner protocols",
          "Cognitive optimization community reviews",
          "Russian peptide therapy clinical guidelines",
        ],
      },
      experimental: null,
    },
  },
  {
    slug: "dihexa",
    name: "Dihexa",
    aliases: ["N-hexanoic-Tyr-Ile-(6)-aminohexanoic amide"],
    category: "neuroprotective",
    route: "oral",
    status: "experimental",
    halfLife: "~hours",
    typicalDoseRange: "10–40 mg/day (oral)",
    description:
      "An angiotensin IV analog with extraordinary cognitive-enhancing properties. Reported to be 10 million times more potent than BDNF in promoting hepatocyte growth factor (HGF) signaling. Enhances synaptogenesis and cognitive function in animal models of neurodegeneration.",
    lanes: ["experimental"],
    contraindications: [
      "Very limited safety data — extreme caution required",
      "Cancer history (HGF pathway may promote tumor growth)",
      "Pregnancy or breastfeeding",
      "Liver or kidney disease",
    ],
    interactions: [
      "Theoretical concern with ACE inhibitors / ARBs (angiotensin pathway)",
      "No established drug interaction data — highly experimental",
      "Not to be combined with other experimental nootropics without monitoring",
    ],
    laneData: {
      clinical: null,
      expert: null,
      experimental: {
        summary:
          "Preclinical data shows remarkable cognitive enhancement in animal models of dementia and Alzheimer's disease. HGF/MET pathway activation promotes new synapse formation. No human clinical trials conducted. Extreme caution advised due to limited safety data and potent biological activity.",
        dosageRange: "10–40 mg daily (oral)",
        frequency: "Once daily",
        duration: "2–4 weeks maximum (experimental)",
        confidence: 35,
        sources: [
          "McCoy et al., 2013 — Journal of Pharmacology and Experimental Therapeutics",
          "Benoist et al., 2014 — hippocampal spine density studies",
        ],
      },
    },
  },
  {
    slug: "ss-31",
    name: "SS-31 (Elamipretide)",
    aliases: ["Elamipretide", "Bendavia", "MTP-131"],
    category: "neuroprotective",
    route: "subcutaneous",
    status: "emerging",
    halfLife: "~3–4 hours",
    typicalDoseRange: "40 mg/day (SubQ)",
    description:
      "A mitochondria-targeted tetrapeptide that concentrates in the inner mitochondrial membrane, stabilizing cardiolipin and restoring electron transport chain function. In clinical trials for Barth syndrome, heart failure, and age-related mitochondrial dysfunction.",
    lanes: ["clinical", "experimental"],
    contraindications: [
      "Severe renal impairment (renally cleared)",
      "Known hypersensitivity to peptide compounds",
      "Pregnancy or breastfeeding",
    ],
    interactions: [
      "May synergize with NAD+ and CoQ10 for mitochondrial optimization",
      "Theoretical benefit with exercise — enhances mitochondrial efficiency",
      "Monitor renal function with chronic use",
    ],
    laneData: {
      clinical: {
        summary:
          "Phase II/III trials for Barth syndrome (TAZPOWER) showed improved 6-minute walk test. Phase II heart failure trials (EMBRACE) demonstrated improved cardiac function. Mechanism involves cardiolipin stabilization and cytochrome c optimization in the mitochondrial membrane.",
        dosageRange: "40 mg daily subcutaneous",
        frequency: "Once daily",
        duration: "12–24 weeks in clinical trials",
        confidence: 62,
        sources: [
          "Szeto, 2014 — British Journal of Pharmacology",
          "Steward Therapeutics — TAZPOWER Phase III trial data",
          "Daubert et al., 2017 — Circulation: Heart Failure",
        ],
      },
      expert: null,
      experimental: {
        summary:
          "Longevity community has adopted SS-31 as a mitochondrial rejuvenation tool. Users report improved exercise tolerance, reduced fatigue, and enhanced recovery. Combines well with NAD+ therapy for comprehensive mitochondrial support. Limited long-term self-experimentation data.",
        dosageRange: "20–40 mg daily SubQ",
        frequency: "Once daily",
        duration: "4–12 week courses",
        confidence: 48,
        sources: [
          "Longevity biohacking community protocols",
          "Mitochondrial medicine conference presentations",
        ],
      },
    },
  },
] as const;

// ── Creators ──────────────────────────────────────────────────────────────────

export const MOCK_CREATORS: readonly Creator[] = [
  {
    id: "creator-1",
    slug: "dr-marcus-reed",
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
    slug: "alex-kovacs",
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
    slug: "dr-elena-vasquez",
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
  {
    id: "creator-4",
    slug: "nick-trigili",
    name: "Nick Trigili",
    bio: "Bodybuilding coach and PED educator known for transparent, evidence-informed content on performance enhancement and recovery protocols.",
    specialty: "Bodybuilding & PED Education",
    credentials: "IFBB Pro, CPT",
    followers: 285000,
    protocolCount: 24,
    verified: true,
    avatarInitials: "NT",
    accentColor: "#ff4444",
  },
  {
    id: "creator-5",
    slug: "leo-rex",
    name: "Leo Rex",
    bio: "Longevity researcher and peptide scientist behind the LRViathon channel. Deep dives into cutting-edge longevity interventions backed by primary research.",
    specialty: "Longevity & Peptide Science",
    credentials: "MSc Biochemistry",
    followers: 142000,
    protocolCount: 16,
    verified: true,
    avatarInitials: "LR",
    accentColor: "#00d4ff",
  },
  {
    id: "creator-6",
    slug: "justin-mihaly",
    name: "Justin Mihaly",
    bio: "Strength coach and performance optimization specialist. Combines peptide protocols with periodized training for athletes and lifters.",
    specialty: "Strength & Performance",
    credentials: "CSCS, MS Exercise Science",
    followers: 98000,
    protocolCount: 14,
    verified: true,
    avatarInitials: "JM",
    accentColor: "#ff6b35",
  },
  {
    id: "creator-7",
    slug: "tristan-huseby",
    name: "Tristan Huseby",
    bio: "Peptide educator and biohacking content creator focused on making peptide science accessible for beginners. Known for clear, practical protocol guidance.",
    specialty: "Peptides & Biohacking",
    credentials: "Certified Biohacking Coach",
    followers: 76000,
    protocolCount: 11,
    verified: true,
    avatarInitials: "TH",
    accentColor: "#00ff88",
  },
  {
    id: "creator-8",
    slug: "vincent-luzzolino",
    name: "Vincent Luzzolino",
    bio: "Advanced peptide protocol designer specializing in complex stacks for healing, immune modulation, and tissue regeneration.",
    specialty: "Advanced Peptide Protocols",
    credentials: "PharmD",
    followers: 54000,
    protocolCount: 19,
    verified: true,
    avatarInitials: "VL",
    accentColor: "#b366ff",
  },
  {
    id: "creator-9",
    slug: "jay-campbell",
    name: "Jay Campbell",
    bio: "Author of The TRT MANual and leading voice in testosterone optimization therapy. 20+ years experience in hormone optimization and men's health.",
    specialty: "TRT & Testosterone Optimization",
    credentials: "Author, TRT Specialist",
    followers: 320000,
    protocolCount: 22,
    verified: true,
    avatarInitials: "JC",
    accentColor: "#ffaa00",
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
    creatorId: "creator-1",
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
    creatorId: "creator-2",
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
    creatorId: "creator-3",
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
    creatorId: "creator-1",
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
  {
    id: "trt-optimization",
    hookTitle: "TRT Optimization",
    subtitle: "Comprehensive testosterone replacement protocol",
    intensity: "standard",
    goals: ["body-recomp", "recovery", "sexual-health", "anti-aging"],
    contentAngle: "expert",
    duration: "Ongoing",
    creatorName: "Jay Campbell",
    creatorId: "creator-9",
    rating: 4.9,
    ratingCount: 1247,
    activeUsers: 8420,
    description:
      "Jay Campbell's gold-standard TRT optimization protocol combining testosterone cypionate with estrogen management, fertility preservation, and tissue healing support. Designed for men seeking comprehensive hormone optimization.",
    peptides: [
      {
        slug: "testosterone-cypionate",
        name: "Testosterone Cypionate",
        dose: "150 mg",
        frequency: "2x per week",
        route: "intramuscular",
        timing: "Monday + Thursday",
      },
      {
        slug: "anastrozole",
        name: "Anastrozole",
        dose: "0.25 mg",
        frequency: "2x per week",
        route: "oral",
        timing: "Injection days (as needed)",
      },
      {
        slug: "hcg",
        name: "HCG",
        dose: "250 IU",
        frequency: "3x per week",
        route: "subcutaneous",
        timing: "Mon / Wed / Fri",
      },
      {
        slug: "bpc-157",
        name: "BPC-157",
        dose: "250 mcg",
        frequency: "Daily",
        route: "subcutaneous",
        timing: "Morning",
      },
    ],
  },
  {
    id: "bb-recovery",
    hookTitle: "Bodybuilding Recovery Stack",
    subtitle: "Maximum recovery for hard-training athletes",
    intensity: "aggressive",
    goals: ["recovery", "muscle-gain", "injury-recovery", "sleep"],
    contentAngle: "expert",
    duration: "12 weeks",
    creatorName: "Nick Trigili",
    creatorId: "creator-4",
    rating: 4.7,
    ratingCount: 892,
    activeUsers: 3100,
    description:
      "Nick Trigili's aggressive recovery stack built for athletes pushing their limits. Combines multi-pathway tissue healing with GH optimization for maximum recovery between intense training sessions.",
    peptides: [
      {
        slug: "bpc-157",
        name: "BPC-157",
        dose: "500 mcg",
        frequency: "2x daily",
        route: "subcutaneous",
        timing: "Morning + Post-workout",
      },
      {
        slug: "tb-500",
        name: "TB-500",
        dose: "5 mg",
        frequency: "2x per week",
        route: "subcutaneous",
        timing: "Monday + Thursday",
      },
      {
        slug: "cjc-1295-ipamorelin",
        name: "CJC-1295 / Ipamorelin",
        dose: "300 mcg each",
        frequency: "Nightly",
        route: "subcutaneous",
        timing: "30 min before bed",
      },
      {
        slug: "ghrp-6",
        name: "GHRP-6",
        dose: "100 mcg",
        frequency: "3x daily",
        route: "subcutaneous",
        timing: "AM / Pre-workout / Bedtime",
      },
    ],
  },
  {
    id: "longevity-deep-dive",
    hookTitle: "Longevity Deep Dive",
    subtitle: "Advanced anti-aging and cellular rejuvenation",
    intensity: "aggressive",
    goals: ["anti-aging", "longevity", "cognitive", "immune-support", "neuroprotection"],
    contentAngle: "clinical",
    duration: "16 weeks",
    creatorName: "Leo Rex",
    creatorId: "creator-5",
    rating: 4.8,
    ratingCount: 445,
    activeUsers: 1820,
    description:
      "Leo Rex's comprehensive longevity protocol targeting telomere maintenance, immune rejuvenation, neuroprotection, and metabolic optimization. A multi-pathway approach to biological age reversal backed by primary research.",
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
        slug: "nad-plus",
        name: "NAD+",
        dose: "200 mg",
        frequency: "2x per week",
        route: "subcutaneous",
        timing: "Morning",
      },
      {
        slug: "thymosin-alpha-1",
        name: "Thymosin Alpha-1",
        dose: "1.6 mg",
        frequency: "2x per week",
        route: "subcutaneous",
        timing: "Monday + Thursday",
      },
      {
        slug: "semax",
        name: "Semax",
        dose: "400 mcg",
        frequency: "Daily",
        route: "intranasal",
        timing: "Morning",
      },
      {
        slug: "tesamorelin",
        name: "Tesamorelin",
        dose: "1 mg",
        frequency: "Daily",
        route: "subcutaneous",
        timing: "Bedtime",
      },
    ],
  },
  {
    id: "performance-stack",
    hookTitle: "Performance Stack",
    subtitle: "Optimized GH and recovery for strength athletes",
    intensity: "standard",
    goals: ["muscle-gain", "recovery", "sleep", "body-recomp"],
    contentAngle: "expert",
    duration: "12 weeks",
    creatorName: "Justin Mihaly",
    creatorId: "creator-6",
    rating: 4.8,
    ratingCount: 634,
    activeUsers: 2650,
    description:
      "Justin Mihaly's performance-focused peptide stack for strength athletes. Combines GHRH pulsing with healing support and oral GH secretagogue for maximum recovery and body composition improvement.",
    peptides: [
      {
        slug: "cjc-1295-no-dac",
        name: "CJC-1295 (No DAC)",
        dose: "100 mcg",
        frequency: "3x daily",
        route: "subcutaneous",
        timing: "AM / Pre-workout / Bedtime",
      },
      {
        slug: "bpc-157",
        name: "BPC-157",
        dose: "250 mcg",
        frequency: "2x daily",
        route: "subcutaneous",
        timing: "Morning + Evening",
      },
      {
        slug: "mk-677",
        name: "MK-677 (Ibutamoren)",
        dose: "25 mg",
        frequency: "Nightly",
        route: "oral",
        timing: "Before bed",
      },
    ],
  },
  {
    id: "beginner-protocol",
    hookTitle: "Beginner's Protocol",
    subtitle: "Gentle introduction to peptide therapy",
    intensity: "conservative",
    goals: ["injury-recovery", "sleep", "recovery"],
    contentAngle: "expert",
    duration: "8 weeks",
    creatorName: "Tristan Huseby",
    creatorId: "creator-7",
    rating: 4.9,
    ratingCount: 1103,
    activeUsers: 5200,
    description:
      "Tristan Huseby's beginner-friendly protocol designed for those new to peptide therapy. Conservative dosing with well-studied compounds, focusing on healing, sleep improvement, and general recovery.",
    peptides: [
      {
        slug: "bpc-157",
        name: "BPC-157",
        dose: "250 mcg",
        frequency: "Daily",
        route: "subcutaneous",
        timing: "Morning",
      },
      {
        slug: "cjc-1295-ipamorelin",
        name: "CJC-1295 / Ipamorelin",
        dose: "100 mcg each",
        frequency: "Nightly",
        route: "subcutaneous",
        timing: "30 min before bed",
      },
      {
        slug: "mk-677",
        name: "MK-677 (Ibutamoren)",
        dose: "10 mg",
        frequency: "Nightly",
        route: "oral",
        timing: "Before bed",
      },
    ],
  },
  {
    id: "advanced-healing",
    hookTitle: "Advanced Healing Protocol",
    subtitle: "Multi-pathway tissue regeneration and immune support",
    intensity: "aggressive",
    goals: ["injury-recovery", "immune-support", "joint-health", "gut-healing"],
    contentAngle: "clinical",
    duration: "10 weeks",
    creatorName: "Vincent Luzzolino",
    creatorId: "creator-8",
    rating: 4.6,
    ratingCount: 312,
    activeUsers: 980,
    description:
      "Vincent Luzzolino's advanced multi-compound healing protocol targeting tissue regeneration, antimicrobial defense, and gut repair through five complementary pathways. Designed for complex injury recovery and immune modulation.",
    peptides: [
      {
        slug: "bpc-157",
        name: "BPC-157",
        dose: "500 mcg",
        frequency: "2x daily",
        route: "subcutaneous",
        timing: "Morning + Evening",
      },
      {
        slug: "tb-500",
        name: "TB-500",
        dose: "5 mg",
        frequency: "2x per week",
        route: "subcutaneous",
        timing: "Monday + Thursday",
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
        slug: "ll-37",
        name: "LL-37",
        dose: "100 mcg",
        frequency: "Daily",
        route: "subcutaneous",
        timing: "Morning",
      },
      {
        slug: "kpv",
        name: "KPV",
        dose: "500 mcg",
        frequency: "Daily",
        route: "oral",
        timing: "Empty stomach, morning",
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
  { id: "delt-left",   label: "Delt (Left)",        x: 24, y: 33 },
  { id: "delt-right",  label: "Delt (Right)",       x: 76, y: 33 },
  { id: "quad-left",   label: "Quad (Left)",        x: 40, y: 75 },
  { id: "quad-right",  label: "Quad (Right)",       x: 60, y: 75 },
] as const;
