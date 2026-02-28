import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SuggestProtocolDto, RiskAppetite, PersonalizeDto } from './dto';

/** Maps risk appetite to the maximum lane tier accessible */
const RISK_LANE_MAP: Record<RiskAppetite, number> = {
  [RiskAppetite.CONSERVATIVE]: 1,
  [RiskAppetite.MODERATE]: 2,
  [RiskAppetite.AGGRESSIVE]: 3,
};

interface SuggestedCompound {
  readonly peptideId: string;
  readonly peptideName: string;
  readonly peptideSlug: string;
  readonly lane: number;
  readonly doseMcg: number;
  readonly frequency: string;
  readonly route: string;
  readonly rationale: string;
}

interface InteractionWarning {
  readonly peptideA: string;
  readonly peptideB: string;
  readonly severity: string;
  readonly description: string;
}

interface ProtocolSuggestion {
  readonly compounds: readonly SuggestedCompound[];
  readonly warnings: readonly InteractionWarning[];
  readonly blockedReasons: readonly string[];
  readonly totalInjectionsPerWeek: number;
  readonly estimatedMonthlyCost: number | null;
}

@Injectable()
export class ProtocolEngineService {
  private readonly logger = new Logger(ProtocolEngineService.name);

  constructor(private readonly prisma: PrismaService) {}

  async suggestProtocol(
    userId: string,
    dto: SuggestProtocolDto,
  ): Promise<ProtocolSuggestion> {
    const maxLane = RISK_LANE_MAP[dto.riskAppetite];
    const maxCompounds = dto.maxCompounds ?? 3;
    const maxInjections = dto.maxInjectionsPerWeek ?? 7;

    // 1. Find peptides matching goals within allowed lane tiers
    const candidatePeptides = await this.prisma.peptide.findMany({
      where: {
        goals: { hasSome: dto.goals },
        lanes: {
          some: {
            tier: { lte: maxLane },
          },
        },
      },
      include: {
        lanes: {
          where: { tier: { lte: maxLane } },
          orderBy: { tier: 'asc' },
        },
        contraindications: true,
        interactions: {
          include: {
            targetPeptide: { select: { id: true, name: true } },
          },
        },
      },
    });

    // 2. Filter out peptides with contraindications matching user conditions
    const userConditions = new Set(dto.conditions ?? []);
    const filtered = candidatePeptides.filter((p) => {
      const hasContraindication = p.contraindications.some((c) =>
        userConditions.has(c.conditionId),
      );
      return !hasContraindication;
    });

    // 3. Check interactions with currently used peptides
    const currentPeptideIds = new Set(dto.currentPeptides ?? []);
    const blockedReasons: string[] = [];
    const warnings: InteractionWarning[] = [];

    const safe = filtered.filter((p) => {
      let blocked = false;

      for (const interaction of p.interactions) {
        if (!currentPeptideIds.has(interaction.targetPeptideId)) continue;

        if (interaction.severity === 'AVOID') {
          blockedReasons.push(
            `${p.name} blocked: AVOID interaction with ${interaction.targetPeptide.name} — ${interaction.description}`,
          );
          blocked = true;
        } else if (interaction.severity === 'CAUTION') {
          warnings.push({
            peptideA: p.name,
            peptideB: interaction.targetPeptide.name,
            severity: 'CAUTION',
            description: interaction.description,
          });
        }
      }

      return !blocked;
    });

    // 4. Score and rank candidates, take top N
    const scored = safe.map((p) => {
      const goalOverlap = dto.goals.filter((g) => p.goals.includes(g)).length;
      const bestLane = p.lanes[0];
      return { peptide: p, lane: bestLane, score: goalOverlap * 10 + (4 - bestLane.tier) };
    });

    scored.sort((a, b) => b.score - a.score);
    const selected = scored.slice(0, maxCompounds);

    // 5. Build compound suggestions respecting injection limits
    let totalInjections = 0;
    const compounds: SuggestedCompound[] = [];

    for (const { peptide, lane } of selected) {
      const injectionsForThis = this.estimateWeeklyInjections(lane.frequency);

      if (totalInjections + injectionsForThis > maxInjections) {
        blockedReasons.push(
          `${peptide.name} skipped: would exceed ${maxInjections} injections/week limit`,
        );
        continue;
      }

      totalInjections += injectionsForThis;

      compounds.push({
        peptideId: peptide.id,
        peptideName: peptide.name,
        peptideSlug: peptide.slug,
        lane: lane.tier,
        doseMcg: lane.doseMcg,
        frequency: lane.frequency,
        route: lane.route,
        rationale: `Matches goals: ${dto.goals.filter((g) => peptide.goals.includes(g)).join(', ')}. Lane ${lane.tier} (${dto.riskAppetite}).`,
      });
    }

    // 6. Estimate cost if budget constraint provided
    const estimatedMonthlyCost = dto.budget !== undefined
      ? compounds.reduce((sum, c) => sum + (c.doseMcg * 0.01 * this.estimateWeeklyInjections(c.frequency) * 4.33), 0)
      : null;

    if (dto.budget !== undefined && estimatedMonthlyCost !== null && estimatedMonthlyCost > dto.budget) {
      blockedReasons.push(
        `Estimated monthly cost ($${estimatedMonthlyCost.toFixed(2)}) exceeds budget ($${dto.budget})`,
      );
    }

    this.logger.log(
      `Protocol suggestion for user ${userId}: ${compounds.length} compounds, ${warnings.length} warnings, ${blockedReasons.length} blocks`,
    );

    return {
      compounds,
      warnings,
      blockedReasons,
      totalInjectionsPerWeek: totalInjections,
      estimatedMonthlyCost,
    };
  }

  async personalizeTemplate(
    userId: string,
    templateId: string,
    dto: PersonalizeDto,
  ): Promise<ProtocolSuggestion> {
    // Load the template protocol
    const template = await this.prisma.protocolTemplate.findUnique({
      where: { id: templateId },
      include: {
        compounds: {
          include: {
            peptide: {
              include: {
                lanes: true,
                contraindications: true,
                interactions: {
                  include: {
                    targetPeptide: { select: { id: true, name: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!template) {
      throw new NotFoundException(`Protocol template "${templateId}" not found`);
    }

    const maxLane = dto.riskAppetite
      ? RISK_LANE_MAP[dto.riskAppetite]
      : 2; // default moderate
    const maxCompounds = dto.maxCompounds ?? template.compounds.length;
    const maxInjections = dto.maxInjectionsPerWeek ?? 7;

    const userConditions = new Set(dto.conditions ?? []);
    const currentPeptideIds = new Set(dto.currentPeptides ?? []);

    const blockedReasons: string[] = [];
    const warnings: InteractionWarning[] = [];
    const compounds: SuggestedCompound[] = [];
    let totalInjections = 0;

    for (const tc of template.compounds) {
      if (compounds.length >= maxCompounds) {
        blockedReasons.push(`${tc.peptide.name} skipped: maxCompounds (${maxCompounds}) reached`);
        continue;
      }

      // Check contraindications
      const hasContra = tc.peptide.contraindications.some((c) =>
        userConditions.has(c.conditionId),
      );
      if (hasContra) {
        blockedReasons.push(`${tc.peptide.name} blocked: contraindication with user condition`);
        continue;
      }

      // Check interactions
      let blocked = false;
      for (const interaction of tc.peptide.interactions) {
        if (!currentPeptideIds.has(interaction.targetPeptideId)) continue;

        if (interaction.severity === 'AVOID') {
          blockedReasons.push(
            `${tc.peptide.name} blocked: AVOID interaction with ${interaction.targetPeptide.name}`,
          );
          blocked = true;
          break;
        } else if (interaction.severity === 'CAUTION') {
          warnings.push({
            peptideA: tc.peptide.name,
            peptideB: interaction.targetPeptide.name,
            severity: 'CAUTION',
            description: interaction.description,
          });
        }
      }
      if (blocked) continue;

      // Find appropriate lane
      const allowedLane = tc.peptide.lanes
        .filter((l) => l.tier <= maxLane)
        .sort((a, b) => a.tier - b.tier)[0];

      if (!allowedLane) {
        blockedReasons.push(
          `${tc.peptide.name} blocked: no lane available at ${dto.riskAppetite ?? 'MODERATE'} risk level`,
        );
        continue;
      }

      const injectionsForThis = this.estimateWeeklyInjections(allowedLane.frequency);
      if (totalInjections + injectionsForThis > maxInjections) {
        blockedReasons.push(
          `${tc.peptide.name} skipped: would exceed ${maxInjections} injections/week limit`,
        );
        continue;
      }

      totalInjections += injectionsForThis;

      compounds.push({
        peptideId: tc.peptide.id,
        peptideName: tc.peptide.name,
        peptideSlug: tc.peptide.slug,
        lane: allowedLane.tier,
        doseMcg: allowedLane.doseMcg,
        frequency: allowedLane.frequency,
        route: allowedLane.route,
        rationale: `From template "${template.name}", personalized to lane ${allowedLane.tier}.`,
      });
    }

    const estimatedMonthlyCost = dto.budget !== undefined
      ? compounds.reduce((sum, c) => sum + (c.doseMcg * 0.01 * this.estimateWeeklyInjections(c.frequency) * 4.33), 0)
      : null;

    if (dto.budget !== undefined && estimatedMonthlyCost !== null && estimatedMonthlyCost > dto.budget) {
      blockedReasons.push(
        `Estimated monthly cost ($${estimatedMonthlyCost.toFixed(2)}) exceeds budget ($${dto.budget})`,
      );
    }

    this.logger.log(
      `Template "${template.name}" personalized for user ${userId}: ${compounds.length}/${template.compounds.length} compounds kept`,
    );

    return {
      compounds,
      warnings,
      blockedReasons,
      totalInjectionsPerWeek: totalInjections,
      estimatedMonthlyCost,
    };
  }

  private estimateWeeklyInjections(frequency: string): number {
    const freq = frequency.toLowerCase();
    if (freq.includes('daily') || freq === '7x/week') return 7;
    if (freq.includes('2x') || freq.includes('twice')) return 2;
    if (freq.includes('3x')) return 3;
    if (freq.includes('5x') || freq.includes('5 times')) return 5;
    if (freq.includes('eod') || freq.includes('every other')) return 3.5;
    if (freq.includes('weekly') || freq === '1x/week') return 1;
    if (freq.includes('biweekly') || freq.includes('2 weeks')) return 0.5;
    return 3; // default assumption
  }
}
