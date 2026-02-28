// ============================================================================
// DoseCraft — Database Seed Script
// Populates peptides, lanes, protocols, demo user, and sample logs
// Idempotent: safe to run multiple times (clears + re-seeds)
// ============================================================================

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(8, 0, 0, 0);
  return d;
}

function log(msg: string) {
  console.log(`  [seed] ${msg}`);
}

// ---------------------------------------------------------------------------
// 1. Clear all tables (reverse dependency order)
// ---------------------------------------------------------------------------

async function clearDatabase() {
  log('Clearing database...');

  // Leaf tables first, then parents
  await prisma.doseLog.deleteMany();
  await prisma.outcomeMetric.deleteMany();
  await prisma.protocolEvent.deleteMany();
  await prisma.userProtocolPeptide.deleteMany();
  await prisma.userProtocol.deleteMany();
  await prisma.protocolStep.deleteMany();
  await prisma.protocolTemplate.deleteMany();
  await prisma.creator.deleteMany();
  await prisma.peptideInteraction.deleteMany();
  await prisma.contraindication.deleteMany();
  await prisma.peptideExperimentalLane.deleteMany();
  await prisma.peptideExpertLane.deleteMany();
  await prisma.peptideClinicalLane.deleteMany();
  await prisma.peptide.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.user.deleteMany();

  log('Database cleared.');
}

// ---------------------------------------------------------------------------
// 2. Seed Peptides + Three-Lane Data
// ---------------------------------------------------------------------------

async function seedPeptides() {
  log('Seeding peptides...');

  // ── BPC-157 ──────────────────────────────────────────────────────────────
  const bpc157 = await prisma.peptide.create({
    data: {
      slug: 'bpc-157',
      name: 'BPC-157',
      category: 'HEALING',
      route: 'SUBQ',
      status: 'RESEARCH_ONLY',
      description:
        'Gastric pentadecapeptide with remarkable healing properties. Promotes tendon, muscle, and gut healing. One of the most studied peptides in the biohacking community.',
      halfLife: '~4 hours',
      storageNotes: 'Refrigerate 2-8\u00B0C after reconstitution. Use within 30 days.',
      reconstitutionNotes:
        'Reconstitute with bacteriostatic water. 5mg vial + 2ml BAC water = 2.5mg/ml (2500mcg/ml).',
      clinicalLanes: {
        create: {
          indication: 'Tendon/ligament healing, gut repair',
          doseMin: 200,
          doseMax: 500,
          unit: 'mcg',
          frequency: '2x daily',
          cycleWeeks: 6,
          cyclePattern: '4-8 weeks',
          evidenceLevel: 'PRECLINICAL',
          sources: [
            'doi:10.1002/jcp.25594',
            'doi:10.1016/j.lfs.2018.04.034',
          ],
        },
      },
      expertLanes: {
        create: {
          description:
            'Standard healing protocol. Most coaches run 250-500mcg 2x/day SubQ near injury site. Stack with TB-500 for synergistic healing.',
          commonStacks: ['TB-500', 'GHK-Cu'],
          dosePattern: {
            standard: '250mcg 2x/day',
            aggressive: '500mcg 2x/day',
            loading: '500mcg 2x/day week 1, then 250mcg',
          },
          sourceTags: ['coach_protocol', 'functional_md'],
        },
      },
      experimentalLanes: {
        create: {
          description:
            'Underground protocols run higher doses (750-1000mcg) or oral/nasal routes. Some report systemic benefits at 500mcg+ including mood improvement and faster recovery.',
          dosePattern: {
            high: '750-1000mcg 2x/day',
            oral: '500mcg oral BID',
            nasal: '200mcg nasal spray',
          },
          confidence: 0.5,
          sourceTags: ['reddit_longform', 'n_of_1', 'discord_group'],
        },
      },
      contraindications: {
        createMany: {
          data: [
            { condition: 'Active cancer', severity: 'HIGH', sourceLane: 'CLINICAL' },
            { condition: 'Pregnancy', severity: 'HIGH', sourceLane: 'CLINICAL' },
          ],
        },
      },
    },
  });
  log('  BPC-157 created');

  // ── TB-500 ───────────────────────────────────────────────────────────────
  const tb500 = await prisma.peptide.create({
    data: {
      slug: 'tb-500',
      name: 'TB-500',
      category: 'HEALING',
      route: 'SUBQ',
      status: 'RESEARCH_ONLY',
      description:
        'Synthetic fragment of thymosin beta-4 with potent tissue repair and anti-inflammatory properties. Widely used for injury recovery and systemic healing.',
      halfLife: '~7 days (depot effect)',
      storageNotes: 'Refrigerate 2-8\u00B0C after reconstitution. Use within 30 days.',
      reconstitutionNotes:
        'Reconstitute with bacteriostatic water. 5mg vial + 1ml BAC water = 5mg/ml.',
      clinicalLanes: {
        create: {
          indication: 'Tissue repair, anti-inflammatory',
          doseMin: 2,
          doseMax: 5,
          unit: 'mg',
          frequency: '2x weekly',
          cycleWeeks: 5,
          cyclePattern: '4-6 weeks',
          evidenceLevel: 'PRECLINICAL',
          sources: ['doi:10.1111/j.1749-6632.2010.05803.x'],
        },
      },
      expertLanes: {
        create: {
          description:
            "Loading phase 5mg 2x/week for 4 weeks, then maintenance 2.5mg weekly. Best stacked with BPC-157 for the 'Wolverine protocol'.",
          commonStacks: ['BPC-157', 'GHK-Cu'],
          dosePattern: {
            loading: '5mg 2x/week for 4 weeks',
            maintenance: '2.5mg 1x/week',
          },
          sourceTags: ['coach_protocol', 'functional_md'],
        },
      },
      experimentalLanes: {
        create: {
          description:
            'Some users run higher loading doses (10mg/week) or extend cycles to 12 weeks. Reports of accelerated hair growth and improved skin quality as side benefits.',
          dosePattern: {
            aggressive_loading: '10mg/week',
            extended_cycle: '2.5mg/week for 12 weeks',
          },
          confidence: 0.4,
          sourceTags: ['reddit_longform', 'n_of_1', 'forum_anecdote'],
        },
      },
    },
  });
  log('  TB-500 created');

  // ── CJC-1295 / Ipamorelin ───────────────────────────────────────────────
  const cjcIpa = await prisma.peptide.create({
    data: {
      slug: 'cjc-1295-ipamorelin',
      name: 'CJC-1295 / Ipamorelin',
      category: 'GROWTH_HORMONE',
      route: 'SUBQ',
      status: 'RESEARCH_ONLY',
      description:
        'Gold standard growth hormone secretagogue combination. CJC-1295 (no DAC) stimulates GH release while Ipamorelin provides a clean GH pulse without cortisol or prolactin spikes.',
      halfLife: 'CJC ~30 min, Ipamorelin ~2 hours',
      storageNotes: 'Refrigerate 2-8\u00B0C. Reconstituted vials stable ~30 days.',
      reconstitutionNotes:
        'Reconstitute each vial separately with BAC water. Typical: 2mg vial + 2ml BAC water = 1mg/ml (1000mcg/ml).',
      clinicalLanes: {
        create: {
          indication: 'GH deficiency support, body composition',
          doseMin: 100,
          doseMax: 300,
          unit: 'mcg each',
          frequency: 'daily before bed',
          cycleWeeks: 10,
          cyclePattern: '8-12 weeks',
          evidenceLevel: 'OBSERVATIONAL',
          sources: ['doi:10.1210/jc.2006-0025'],
        },
      },
      expertLanes: {
        create: {
          description:
            'Most clinicians run 100mcg CJC + 100mcg Ipamorelin before bed on empty stomach. Some add a second dose AM fasted. 5 days on / 2 days off to prevent desensitization.',
          commonStacks: ['MK-677', 'GHRP-6'],
          dosePattern: {
            standard: '100mcg each at bedtime',
            enhanced: '100mcg each AM + PM',
            cycling: '5 on / 2 off',
          },
          sourceTags: ['clinic_protocol', 'anti_aging_md'],
        },
      },
      experimentalLanes: {
        create: {
          description:
            'Power users run 300mcg each 2x/day. Some add MK-677 25mg oral for 24/7 GH elevation. Watch for water retention, numbness, increased appetite.',
          dosePattern: {
            power_user: '300mcg each 2x/day',
            gh_blast: '300mcg each + MK-677 25mg oral',
          },
          confidence: 0.6,
          sourceTags: ['forum_anecdote', 'coach_protocol', 'n_of_1'],
        },
      },
    },
  });
  log('  CJC-1295/Ipamorelin created');

  // ── Semaglutide ──────────────────────────────────────────────────────────
  const semaglutide = await prisma.peptide.create({
    data: {
      slug: 'semaglutide',
      name: 'Semaglutide',
      category: 'METABOLIC',
      route: 'SUBQ',
      status: 'APPROVED_DRUG',
      description:
        'GLP-1 receptor agonist originally developed for type 2 diabetes. Now the most popular peptide for fat loss. Suppresses appetite, improves insulin sensitivity, and may have cardiovascular benefits.',
      halfLife: '~7 days',
      storageNotes: 'Refrigerate 2-8\u00B0C. Do not freeze. Stable at room temp up to 56 days.',
      reconstitutionNotes:
        'Pre-filled pen or compounded lyophilized. If compounded: reconstitute with BAC water per pharmacy instructions.',
      clinicalLanes: {
        create: {
          indication: 'Weight management, T2D, cardiovascular risk reduction',
          doseMin: 0.25,
          doseMax: 2.4,
          unit: 'mg',
          frequency: 'weekly',
          cycleWeeks: 34,
          cyclePattern: '16-52 weeks',
          evidenceLevel: 'META_ANALYSIS',
          sources: ['doi:10.1056/NEJMoa2032183', 'STEP trials'],
        },
      },
      expertLanes: {
        create: {
          description:
            'Slow titration is key. Start 0.25mg/week for 4 weeks, then 0.5mg, then 1.0mg. Most people find their sweet spot at 0.5-1.0mg. Go slow to manage GI side effects.',
          commonStacks: ['BPC-157 for gut support'],
          dosePattern: {
            titration: '0.25 -> 0.5 -> 1.0 -> 1.7 -> 2.4mg',
            sweet_spot: '0.5-1.0mg weekly',
          },
          sourceTags: ['obesity_md', 'clinic_protocol'],
        },
      },
      experimentalLanes: {
        create: {
          description:
            'Some biohackers microdose at 0.1-0.15mg weekly for appetite control without full suppression. Others compound with retatrutide or tirzepatide for multi-receptor activation.',
          dosePattern: {
            microdose: '0.1-0.15mg weekly',
            multi_receptor: 'semaglutide + tirzepatide combo',
          },
          confidence: 0.5,
          sourceTags: ['reddit_longform', 'n_of_1', 'biohacker_podcast'],
        },
      },
      contraindications: {
        createMany: {
          data: [
            {
              condition: 'Personal/family history of medullary thyroid cancer',
              severity: 'HIGH',
              sourceLane: 'CLINICAL',
            },
            {
              condition: 'Pancreatitis history',
              severity: 'MEDIUM',
              sourceLane: 'CLINICAL',
            },
          ],
        },
      },
    },
  });
  log('  Semaglutide created');

  // ── GHK-Cu ──────────────────────────────────────────────────────────────
  const ghkCu = await prisma.peptide.create({
    data: {
      slug: 'ghk-cu',
      name: 'GHK-Cu',
      category: 'COSMETIC',
      route: 'SUBQ',
      status: 'RESEARCH_ONLY',
      description:
        'Naturally occurring copper-binding tripeptide with remarkable skin, hair, and tissue remodeling properties. Used topically and via injection for anti-aging, wound healing, and hair restoration.',
      halfLife: '~4 hours',
      storageNotes: 'Refrigerate 2-8\u00B0C. Protect from light. Use within 30 days reconstituted.',
      reconstitutionNotes:
        'Reconstitute with BAC water. 50mg vial + 2ml BAC water = 25mg/ml. Inject 0.04-0.12ml for 1-3mg dose.',
      clinicalLanes: {
        create: {
          indication: 'Wound healing, skin remodeling',
          doseMin: 1,
          doseMax: 3,
          unit: 'mg',
          frequency: 'daily',
          cycleWeeks: 6,
          cyclePattern: '4-8 weeks',
          evidenceLevel: 'OBSERVATIONAL',
          sources: [
            'doi:10.3390/ijms21207224',
            'doi:10.1155/2018/8047893',
          ],
        },
      },
      expertLanes: {
        create: {
          description:
            "SubQ 1-2mg daily for skin and hair. Can also use topical GHK-Cu serum. Stack with BPC-157 and TB-500 for the 'full regeneration' protocol.",
          commonStacks: ['BPC-157', 'TB-500'],
          dosePattern: {
            standard: '1-2mg SubQ daily',
            topical: 'GHK-Cu serum 2x/day',
            combo: 'SubQ + topical',
          },
          sourceTags: ['dermatologist', 'anti_aging_md', 'coach_protocol'],
        },
      },
      experimentalLanes: {
        create: {
          description:
            'Higher doses (3-5mg SubQ) reported for aggressive anti-aging protocols. Some users combine with microneedling + topical GHK-Cu for face/scalp.',
          dosePattern: {
            aggressive: '3-5mg SubQ daily',
            microneedling_combo: 'microneedling + topical GHK-Cu',
          },
          confidence: 0.4,
          sourceTags: ['reddit_longform', 'n_of_1', 'aesthetics_forum'],
        },
      },
    },
  });
  log('  GHK-Cu created');

  return { bpc157, tb500, cjcIpa, semaglutide, ghkCu };
}

// ---------------------------------------------------------------------------
// 3. Seed Peptide Interactions
// ---------------------------------------------------------------------------

async function seedInteractions(peptides: {
  bpc157: { id: string };
  tb500: { id: string };
  cjcIpa: { id: string };
  semaglutide: { id: string };
}) {
  log('Seeding peptide interactions...');

  await prisma.peptideInteraction.createMany({
    data: [
      {
        peptideAId: peptides.bpc157.id,
        peptideBId: peptides.tb500.id,
        type: 'SYNERGY',
        notes:
          "The 'Wolverine Stack'. Complementary healing mechanisms. TB-500 for systemic repair, BPC-157 for localized healing.",
      },
      {
        peptideAId: peptides.cjcIpa.id,
        peptideBId: peptides.semaglutide.id,
        type: 'CAUTION',
        notes:
          'GH secretagogues may increase appetite while semaglutide suppresses it. Monitor closely for GI issues and blood glucose changes.',
      },
      {
        peptideAId: peptides.bpc157.id,
        peptideBId: peptides.semaglutide.id,
        type: 'SYNERGY',
        notes:
          'BPC-157 may help mitigate GI side effects of semaglutide while both support gut health.',
      },
    ],
  });

  log('  3 interactions created');
}

// ---------------------------------------------------------------------------
// 4. Seed Protocol Templates
// ---------------------------------------------------------------------------

async function seedProtocols(peptides: {
  bpc157: { id: string };
  tb500: { id: string };
  cjcIpa: { id: string };
  semaglutide: { id: string };
  ghkCu: { id: string };
}) {
  log('Seeding protocol templates...');

  // ── The Healing Stack ────────────────────────────────────────────────────
  const healingStack = await prisma.protocolTemplate.create({
    data: {
      slug: 'the-healing-stack',
      name: 'The Healing Stack',
      hookTitle: 'Heal Like Wolverine',
      goalTags: ['healing'],
      intensity: 'CONSERVATIVE',
      description:
        'A conservative healing protocol combining BPC-157 and TB-500 for accelerated injury recovery.',
      contentAngle: 'injury recovery',
      authorType: 'SYSTEM',
      steps: {
        createMany: {
          data: [
            {
              peptideId: peptides.bpc157.id,
              lanePreference: 'CLINICAL',
              dose: 250,
              unit: 'mcg',
              frequency: '2x daily',
              timeOfDay: 'AM',
              startWeek: 1,
              endWeek: 6,
              notes: 'Inject SubQ near injury site. Morning dose.',
            },
            {
              peptideId: peptides.bpc157.id,
              lanePreference: 'CLINICAL',
              dose: 250,
              unit: 'mcg',
              frequency: '2x daily',
              timeOfDay: 'PM',
              startWeek: 1,
              endWeek: 6,
              notes: 'Evening dose, rotate injection site.',
            },
            {
              peptideId: peptides.tb500.id,
              lanePreference: 'CLINICAL',
              dose: 2.5,
              unit: 'mg',
              frequency: '2x weekly',
              timeOfDay: 'AM',
              startWeek: 1,
              endWeek: 4,
              notes: 'SubQ abdomen or thigh. Mon/Thu schedule.',
            },
          ],
        },
      },
    },
  });
  log('  The Healing Stack created');

  // ── Recomp Protocol ──────────────────────────────────────────────────────
  const recompProtocol = await prisma.protocolTemplate.create({
    data: {
      slug: 'recomp-protocol',
      name: 'Recomp Protocol',
      hookTitle: 'Lose Fat, Keep Muscle',
      goalTags: ['recomp', 'fat_loss', 'performance'],
      intensity: 'STANDARD',
      description:
        'Body recomposition protocol combining semaglutide titration with GH secretagogues for fat loss while preserving lean mass.',
      contentAngle: 'body recomposition',
      authorType: 'SYSTEM',
      steps: {
        createMany: {
          data: [
            {
              peptideId: peptides.semaglutide.id,
              lanePreference: 'EXPERT',
              dose: 0.25,
              unit: 'mg',
              frequency: 'weekly',
              timeOfDay: 'AM',
              startWeek: 1,
              endWeek: 4,
              notes: 'Starting dose. Monitor for nausea.',
            },
            {
              peptideId: peptides.semaglutide.id,
              lanePreference: 'EXPERT',
              dose: 0.5,
              unit: 'mg',
              frequency: 'weekly',
              timeOfDay: 'AM',
              startWeek: 5,
              endWeek: 8,
              notes: 'First titration step.',
            },
            {
              peptideId: peptides.semaglutide.id,
              lanePreference: 'EXPERT',
              dose: 1.0,
              unit: 'mg',
              frequency: 'weekly',
              timeOfDay: 'AM',
              startWeek: 9,
              endWeek: 12,
              notes: 'Target dose for most users.',
            },
            {
              peptideId: peptides.cjcIpa.id,
              lanePreference: 'EXPERT',
              dose: 100,
              unit: 'mcg',
              frequency: 'daily',
              timeOfDay: 'BEDTIME',
              startWeek: 1,
              endWeek: 12,
              notes: 'CJC-1295 100mcg + Ipamorelin 100mcg. Empty stomach, 30min before sleep.',
            },
          ],
        },
      },
    },
  });
  log('  Recomp Protocol created');

  // ── Full Send Looksmax ───────────────────────────────────────────────────
  // Needs a Creator first
  const creatorUser = await prisma.user.create({
    data: {
      email: 'ninjathlete@dosecraft.app',
      passwordHash: await bcrypt.hash('creator123456', 10),
      role: 'COACH',
      creator: {
        create: {
          displayName: 'NinjAthlete',
          socialHandle: '@ninjathlete',
          bio: 'Performance coach and peptide researcher',
          isVerified: true,
        },
      },
    },
    include: { creator: true },
  });

  const looksmaxProtocol = await prisma.protocolTemplate.create({
    data: {
      slug: 'full-send-looksmax',
      name: 'Full Send Looksmax',
      hookTitle: 'The Glow-Up Protocol',
      goalTags: ['aesthetics_face', 'aesthetics_skin', 'aesthetics_hair', 'aesthetics_muscle'],
      intensity: 'AGGRESSIVE',
      description:
        'An aggressive aesthetics optimization protocol targeting skin, hair, and body composition through multi-peptide synergy.',
      contentAngle: 'aesthetics optimization',
      authorType: 'CREATOR',
      creatorId: creatorUser.creator!.id,
      steps: {
        createMany: {
          data: [
            {
              peptideId: peptides.ghkCu.id,
              lanePreference: 'EXPERIMENTAL',
              dose: 2,
              unit: 'mg',
              frequency: 'daily',
              timeOfDay: 'AM',
              startWeek: 1,
              endWeek: 8,
              notes: 'SubQ abdomen. Primary skin/hair peptide.',
            },
            {
              peptideId: peptides.bpc157.id,
              lanePreference: 'EXPERIMENTAL',
              dose: 500,
              unit: 'mcg',
              frequency: 'daily',
              timeOfDay: 'AM',
              startWeek: 1,
              endWeek: 8,
              notes: 'Systemic healing and gut support.',
            },
            {
              peptideId: peptides.cjcIpa.id,
              lanePreference: 'EXPERIMENTAL',
              dose: 200,
              unit: 'mcg',
              frequency: 'daily',
              timeOfDay: 'BEDTIME',
              startWeek: 1,
              endWeek: 12,
              notes: 'CJC 200mcg + Ipa 200mcg. GH pulse for recovery and body comp.',
            },
          ],
        },
      },
    },
  });
  log('  Full Send Looksmax created (+ Creator: NinjAthlete)');

  return { healingStack, recompProtocol, looksmaxProtocol };
}

// ---------------------------------------------------------------------------
// 5. Seed Demo User + Profile + Subscription
// ---------------------------------------------------------------------------

async function seedDemoUser() {
  log('Seeding demo user...');

  const passwordHash = await bcrypt.hash('demo123456', 10);

  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@dosecraft.app',
      passwordHash,
      role: 'USER',
      profile: {
        create: {
          age: 32,
          sex: 'MALE',
          heightCm: 180,
          weightKg: 85,
          trainingStyle: 'Hybrid (lifting + cardio)',
          riskAppetite: 'MIXED',
          goals: ['recomp', 'performance', 'longevity'],
        },
      },
      subscription: {
        create: {
          tier: 'BASE',
          status: 'ACTIVE',
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days out
        },
      },
    },
  });

  log(`  Demo user created: ${demoUser.email}`);
  return demoUser;
}

// ---------------------------------------------------------------------------
// 6. Seed Active User Protocol + DoseLogs + OutcomeMetrics
// ---------------------------------------------------------------------------

async function seedUserProtocol(
  demoUser: { id: string },
  recompTemplate: { id: string },
  peptides: {
    semaglutide: { id: string };
    cjcIpa: { id: string };
  },
) {
  log('Seeding user protocol...');

  const startDate = daysAgo(14); // 2 weeks ago

  const userProtocol = await prisma.userProtocol.create({
    data: {
      userId: demoUser.id,
      templateId: recompTemplate.id,
      name: 'Recomp Protocol',
      startDate,
      status: 'ACTIVE',
      notes: 'Starting recomp cycle. Goal: drop 5kg fat, maintain muscle.',
      events: {
        create: {
          type: 'CYCLE_START',
          payload: { note: 'Protocol initiated. Starting semaglutide 0.25mg + CJC/Ipa 100mcg.' },
          createdAt: startDate,
        },
      },
    },
  });

  // Semaglutide — weekly, EXPERT lane
  const semaUpp = await prisma.userProtocolPeptide.create({
    data: {
      userProtocolId: userProtocol.id,
      peptideId: peptides.semaglutide.id,
      dose: 0.25,
      unit: 'mg',
      frequency: 'weekly',
      timeOfDay: 'AM',
      laneUsed: 'EXPERT',
    },
  });

  // CJC/Ipa — daily bedtime, EXPERT lane
  const cjcUpp = await prisma.userProtocolPeptide.create({
    data: {
      userProtocolId: userProtocol.id,
      peptideId: peptides.cjcIpa.id,
      dose: 100,
      unit: 'mcg',
      frequency: 'daily',
      timeOfDay: 'BEDTIME',
      laneUsed: 'EXPERT',
    },
  });

  log('  UserProtocolPeptides created');

  // ── DoseLogs ─────────────────────────────────────────────────────────────
  log('  Creating dose logs...');

  const injectionSites: Array<'ABDOMEN' | 'OUTER_THIGH' | 'LOVE_HANDLES'> = [
    'ABDOMEN',
    'OUTER_THIGH',
    'LOVE_HANDLES',
  ];

  // Semaglutide: 2 weekly doses (day 0 and day 7)
  const semaDoseLogs = [
    {
      userProtocolPeptideId: semaUpp.id,
      takenAt: daysAgo(14),
      site: 'ABDOMEN' as const,
      notes: 'First dose. No immediate side effects.',
    },
    {
      userProtocolPeptideId: semaUpp.id,
      takenAt: daysAgo(7),
      site: 'OUTER_THIGH' as const,
      notes: 'Mild nausea for ~2 hours. Appetite noticeably reduced.',
    },
  ];

  // CJC/Ipa: 8 nightly doses over 14 days (not every day — realistic adherence)
  const cjcDoseDays = [14, 13, 12, 10, 9, 7, 6, 4]; // days ago
  const cjcDoseLogs = cjcDoseDays.map((d, i) => {
    const takenAt = daysAgo(d);
    takenAt.setHours(22, 0, 0, 0); // bedtime
    return {
      userProtocolPeptideId: cjcUpp.id,
      takenAt,
      site: injectionSites[i % injectionSites.length],
      notes: i === 0 ? 'First CJC/Ipa dose. Tingling in hands ~30min post.' : null,
    };
  });

  await prisma.doseLog.createMany({
    data: [...semaDoseLogs, ...cjcDoseLogs],
  });

  log(`  ${semaDoseLogs.length + cjcDoseLogs.length} dose logs created`);

  // ── OutcomeMetrics ───────────────────────────────────────────────────────
  log('  Creating outcome metrics...');

  const outcomeMetrics = [
    // Weight: trending down
    { userId: demoUser.id, type: 'WEIGHT' as const, valueNumber: 85.0, recordedAt: daysAgo(14) },
    { userId: demoUser.id, type: 'WEIGHT' as const, valueNumber: 84.6, recordedAt: daysAgo(10) },
    { userId: demoUser.id, type: 'WEIGHT' as const, valueNumber: 84.3, recordedAt: daysAgo(7) },
    { userId: demoUser.id, type: 'WEIGHT' as const, valueNumber: 84.1, recordedAt: daysAgo(3) },
    { userId: demoUser.id, type: 'WEIGHT' as const, valueNumber: 83.8, recordedAt: daysAgo(0) },
    // Mood: stable to improving
    { userId: demoUser.id, type: 'MOOD' as const, valueNumber: 6, valueText: 'Baseline', recordedAt: daysAgo(14) },
    { userId: demoUser.id, type: 'MOOD' as const, valueNumber: 6, valueText: 'Steady', recordedAt: daysAgo(10) },
    { userId: demoUser.id, type: 'MOOD' as const, valueNumber: 7, valueText: 'Feeling good', recordedAt: daysAgo(7) },
    { userId: demoUser.id, type: 'MOOD' as const, valueNumber: 7, valueText: 'Consistent', recordedAt: daysAgo(3) },
    { userId: demoUser.id, type: 'MOOD' as const, valueNumber: 8, valueText: 'Great energy and focus', recordedAt: daysAgo(0) },
  ];

  await prisma.outcomeMetric.createMany({ data: outcomeMetrics });

  log(`  ${outcomeMetrics.length} outcome metrics created`);

  return userProtocol;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('\n=== DoseCraft Seed Script ===\n');

  await clearDatabase();

  const peptides = await seedPeptides();
  await seedInteractions(peptides);
  const templates = await seedProtocols(peptides);
  const demoUser = await seedDemoUser();
  await seedUserProtocol(demoUser, templates.recompProtocol, {
    semaglutide: peptides.semaglutide,
    cjcIpa: peptides.cjcIpa,
  });

  console.log('\n=== Seed Complete ===\n');

  // Summary
  const counts = await Promise.all([
    prisma.user.count(),
    prisma.peptide.count(),
    prisma.peptideClinicalLane.count(),
    prisma.peptideExpertLane.count(),
    prisma.peptideExperimentalLane.count(),
    prisma.contraindication.count(),
    prisma.peptideInteraction.count(),
    prisma.protocolTemplate.count(),
    prisma.protocolStep.count(),
    prisma.userProtocol.count(),
    prisma.userProtocolPeptide.count(),
    prisma.doseLog.count(),
    prisma.outcomeMetric.count(),
  ]);

  const labels = [
    'Users',
    'Peptides',
    'Clinical Lanes',
    'Expert Lanes',
    'Experimental Lanes',
    'Contraindications',
    'Interactions',
    'Protocol Templates',
    'Protocol Steps',
    'User Protocols',
    'User Protocol Peptides',
    'Dose Logs',
    'Outcome Metrics',
  ];

  console.log('  Record Counts:');
  labels.forEach((label, i) => {
    console.log(`    ${label.padEnd(25)} ${counts[i]}`);
  });
  console.log('');
}

main()
  .catch((e) => {
    console.error('\n[seed] FATAL ERROR:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
