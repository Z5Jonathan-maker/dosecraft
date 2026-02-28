import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SuggestProtocolDto, RiskAppetite, PersonalizeDto } from './dto';

/** Maps risk appetite to the type of lane to prefer */
const RISK_LANE_PRIORITY: Record<RiskAppetite, ('clinicalLanes' | 'expertLanes' | 'experimentalLanes')[]> = {
  [RiskAppetite.CONSERVATIVE]: ['clinicalLanes'],
  [RiskAppetite.MODERATE]: ['clinicalLanes', 'expertLanes'],
  [RiskAppetite.AGGRESSIVE]: ['clinicalLanes', 'expertLanes', 'experimentalLanes'],
};

export interface SuggestedCompound {
  readonly peptideId: string;
  readonly peptideName: string;
  readonly peptideSlug: string;
  readonly laneType: string;
  readonly dose: number;
  readonly unit: string;
  readonly frequency: string;
  readonly route: string;
  readonly rationale: string;
}

export interface InteractionWarning {
  readonly peptideA: string;
  readonly peptideB: string;
  readonly severity: string;
  readonly notes: string;
}

export interface ProtocolSuggestion {
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
    const allowedLaneTypes = RISK_LANE_PRIORITY[dto.riskAppetite];
    const maxCompounds = dto.maxCompounds ?? 3;
    const maxInjections = dto.maxInjectionsPerWeek ?? 7;

    // 1. Find peptides and include lanes based on risk appetite
    const candidatePeptides = await this.prisma.peptide.findMany({
      include: {
        clinicalLanes: allowedLaneTypes.includes('clinicalLanes'),
        expertLanes: allowedLaneTypes.includes('expertLanes'),
        experimentalLanes: allowedLaneTypes.includes('experimentalLanes'),
        contraindications: true,
        interactionsAsA: {
          include: {
            peptideB: { select: { id: true, name: true } },
          },
        },
      },
    });

    // 2. Filter out peptides with contraindications matching user conditions
    const userConditions = new Set(dto.conditions ?? []);
    const currentPeptideIds = new Set(dto.currentPeptides ?? []);
    const blockedReasons: string[] = [];
    const warnings: InteractionWarning[] = [];

    const filtered = candidatePeptides.filter((p) => {
      const hasContraindication = p.contraindications.some((c) =>
        userConditions.has(c.condition),
      );
      return !hasContraindication;
    });

    // 3. Check interactions with currently used peptides
    const safe = filtered.filter((p) => {
      let blocked = false;

      for (const interaction of p.interactionsAsA) {
        if (!currentPeptideIds.has(interaction.peptideBId)) continue;

        if (interaction.type === 'AVOID') {
          blockedReasons.push(
            `${p.name} blocked: AVOID interaction with ${interaction.peptideB.name}`,
          );
          blocked = true;
        } else if (interaction.type === 'CAUTION') {
          warnings.push({
            peptideA: p.name,
            peptideB: interaction.peptideB.name,
            severity: 'CAUTION',
            notes: interaction.notes ?? '',
          });
        }
      }

      return !blocked;
    });

    // 4. Score and rank candidates: prefer peptides that match goals in their indication/description
    const scored = safe.map((p) => {
      const goalOverlap = dto.goals.filter((g) =>
        (p.description ?? '').toLowerCase().includes(g.toLowerCase()),
      ).length;

      // Find the best available lane
      const bestLane = this.getBestLane(p, allowedLaneTypes);
      return { peptide: p, bestLane, score: goalOverlap * 10 + (bestLane ? 1 : 0) };
    }).filter((s) => s.bestLane !== null);

    scored.sort((a, b) => b.score - a.score);
    const selected = scored.slice(0, maxCompounds);

    // 5. Build compound suggestions respecting injection limits
    let totalInjections = 0;
    const compounds: SuggestedCompound[] = [];

    for (const { peptide, bestLane } of selected) {
      if (!bestLane) continue;
      const injectionsForThis = this.estimateWeeklyInjections(bestLane.frequency);

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
        laneType: bestLane.laneType,
        dose: bestLane.doseMin,
        unit: bestLane.unit,
        frequency: bestLane.frequency,
        route: peptide.route,
        rationale: `Matches goals in indication: ${bestLane.indication ?? 'general'}. Lane: ${bestLane.laneType} (${dto.riskAppetite}).`,
      });
    }

    // 6. Estimate cost if budget constraint provided
    const estimatedMonthlyCost = dto.budget !== undefined
      ? compounds.reduce((sum, c) => sum + (c.dose * 0.01 * this.estimateWeeklyInjections(c.frequency) * 4.33), 0)
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
    const allowedLaneTypes = dto.riskAppetite
      ? RISK_LANE_PRIORITY[dto.riskAppetite]
      : RISK_LANE_PRIORITY[RiskAppetite.MODERATE];

    // Load the template protocol
    const template = await this.prisma.protocolTemplate.findUnique({
      where: { id: templateId },
      include: {
        steps: {
          include: {
            peptide: {
              include: {
                clinicalLanes: true,
                expertLanes: true,
                experimentalLanes: true,
                contraindications: true,
                interactionsAsA: {
                  include: {
                    peptideB: { select: { id: true, name: true } },
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

    const maxCompounds = dto.maxCompounds ?? template.steps.length;
    const maxInjections = dto.maxInjectionsPerWeek ?? 7;

    const userConditions = new Set(dto.conditions ?? []);
    const currentPeptideIds = new Set(dto.currentPeptides ?? []);

    const blockedReasons: string[] = [];
    const warnings: InteractionWarning[] = [];
    const compounds: SuggestedCompound[] = [];
    let totalInjections = 0;

    for (const step of template.steps) {
      if (compounds.length >= maxCompounds) {
        blockedReasons.push(`${step.peptide.name} skipped: maxCompounds (${maxCompounds}) reached`);
        continue;
      }

      // Check contraindications
      const hasContra = step.peptide.contraindications.some((c) =>
        userConditions.has(c.condition),
      );
      if (hasContra) {
        blockedReasons.push(`${step.peptide.name} blocked: contraindication with user condition`);
        continue;
      }

      // Check interactions
      let blocked = false;
      for (const interaction of step.peptide.interactionsAsA) {
        if (!currentPeptideIds.has(interaction.peptideBId)) continue;

        if (interaction.type === 'AVOID') {
          blockedReasons.push(
            `${step.peptide.name} blocked: AVOID interaction with ${interaction.peptideB.name}`,
          );
          blocked = true;
          break;
        } else if (interaction.type === 'CAUTION') {
          warnings.push({
            peptideA: step.peptide.name,
            peptideB: interaction.peptideB.name,
            severity: 'CAUTION',
            notes: interaction.notes ?? '',
          });
        }
      }
      if (blocked) continue;

      // Find appropriate lane
      const allowedLane = this.getBestLane(step.peptide, allowedLaneTypes);

      if (!allowedLane) {
        blockedReasons.push(
          `${step.peptide.name} blocked: no lane available at ${dto.riskAppetite ?? 'MODERATE'} risk level`,
        );
        continue;
      }

      const injectionsForThis = this.estimateWeeklyInjections(allowedLane.frequency);
      if (totalInjections + injectionsForThis > maxInjections) {
        blockedReasons.push(
          `${step.peptide.name} skipped: would exceed ${maxInjections} injections/week limit`,
        );
        continue;
      }

      totalInjections += injectionsForThis;

      compounds.push({
        peptideId: step.peptide.id,
        peptideName: step.peptide.name,
        peptideSlug: step.peptide.slug,
        laneType: allowedLane.laneType,
        dose: allowedLane.doseMin,
        unit: allowedLane.unit,
        frequency: allowedLane.frequency,
        route: step.peptide.route,
        rationale: `From template "${template.name}", personalized to lane ${allowedLane.laneType}.`,
      });
    }

    const estimatedMonthlyCost = dto.budget !== undefined
      ? compounds.reduce((sum, c) => sum + (c.dose * 0.01 * this.estimateWeeklyInjections(c.frequency) * 4.33), 0)
      : null;

    if (dto.budget !== undefined && estimatedMonthlyCost !== null && estimatedMonthlyCost > dto.budget) {
      blockedReasons.push(
        `Estimated monthly cost ($${estimatedMonthlyCost.toFixed(2)}) exceeds budget ($${dto.budget})`,
      );
    }

    this.logger.log(
      `Template "${template.name}" personalized for user ${userId}: ${compounds.length}/${template.steps.length} compounds kept`,
    );

    return {
      compounds,
      warnings,
      blockedReasons,
      totalInjectionsPerWeek: totalInjections,
      estimatedMonthlyCost,
    };
  }

  private getBestLane(
    peptide: {
      clinicalLanes: { doseMin: number; doseMax: number; unit: string; frequency: string; indication: string }[];
      expertLanes: { dosePattern: unknown; sourceTags: string[] }[];
      experimentalLanes: { dosePattern: unknown }[];
    },
    allowedLaneTypes: ('clinicalLanes' | 'expertLanes' | 'experimentalLanes')[],
  ): { laneType: string; doseMin: number; unit: string; frequency: string; indication: string } | null {
    for (const laneType of allowedLaneTypes) {
      if (laneType === 'clinicalLanes' && peptide.clinicalLanes.length > 0) {
        const lane = peptide.clinicalLanes[0];
        return {
          laneType: 'clinical',
          doseMin: lane.doseMin,
          unit: lane.unit,
          frequency: lane.frequency,
          indication: lane.indication,
        };
      }
    }
    return null;
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
