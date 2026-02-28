import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface MetricSummary {
  readonly metric: string;
  readonly count: number;
  readonly average: number;
  readonly min: number;
  readonly max: number;
  readonly trend: 'improving' | 'declining' | 'stable' | 'insufficient_data';
  readonly latestValue: number;
}

interface UserInsights {
  readonly activeProtocols: number;
  readonly totalDosesLogged: number;
  readonly totalOutcomesLogged: number;
  readonly adherenceRate: number;
  readonly topMetrics: readonly MetricSummary[];
  readonly recentEvents: readonly unknown[];
}

interface ProtocolAnalysis {
  readonly protocolId: string;
  readonly protocolName: string;
  readonly durationDays: number;
  readonly totalDoses: number;
  readonly adherenceRate: number;
  readonly metricSummaries: readonly MetricSummary[];
  readonly sideEffects: readonly { title: string; severity: string; count: number }[];
  readonly correlations: readonly { metric: string; direction: string; confidence: string }[];
}

@Injectable()
export class InsightService {
  private readonly logger = new Logger(InsightService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getUserInsights(userId: string): Promise<UserInsights> {
    const [activeProtocols, totalDoses, totalOutcomes, recentEvents, outcomes] =
      await Promise.all([
        this.prisma.userProtocol.count({
          where: { userId, status: 'ACTIVE' },
        }),
        this.prisma.doseLog.count({
          where: { protocol: { userId } },
        }),
        this.prisma.outcomeLog.count({
          where: { protocol: { userId } },
        }),
        this.prisma.eventLog.findMany({
          where: { protocol: { userId } },
          orderBy: { occurredAt: 'desc' },
          take: 10,
        }),
        this.prisma.outcomeLog.findMany({
          where: { protocol: { userId } },
          orderBy: { recordedAt: 'desc' },
          take: 200,
        }),
      ]);

    // Calculate adherence rate (doses logged / expected doses in active protocols)
    const adherenceRate = await this.calculateAdherenceRate(userId);

    // Group outcomes by metric and compute summaries
    const metricGroups = this.groupByMetric(outcomes);
    const topMetrics = Object.entries(metricGroups)
      .map(([metric, values]) => this.computeMetricSummary(metric, values))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      activeProtocols,
      totalDosesLogged: totalDoses,
      totalOutcomesLogged: totalOutcomes,
      adherenceRate,
      topMetrics,
      recentEvents,
    };
  }

  async getProtocolAnalysis(
    userId: string,
    protocolId: string,
  ): Promise<ProtocolAnalysis> {
    const protocol = await this.prisma.userProtocol.findUnique({
      where: { id: protocolId },
      include: {
        compounds: true,
        doses: { orderBy: { takenAt: 'asc' } },
        outcomes: { orderBy: { recordedAt: 'asc' } },
        events: { orderBy: { occurredAt: 'asc' } },
      },
    });

    if (!protocol) {
      throw new NotFoundException('Protocol not found');
    }

    if (protocol.userId !== userId) {
      throw new ForbiddenException('Access denied to this protocol');
    }

    const startDate = protocol.startDate;
    const endDate = protocol.endDate ?? new Date();
    const durationDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    // Metric summaries
    const metricGroups = this.groupByMetric(protocol.outcomes);
    const metricSummaries = Object.entries(metricGroups).map(
      ([metric, values]) => this.computeMetricSummary(metric, values),
    );

    // Side effect analysis
    const sideEffectEvents = protocol.events.filter(
      (e) => e.type === 'SIDE_EFFECT',
    );
    const sideEffectMap = new Map<string, { severity: string; count: number }>();
    for (const se of sideEffectEvents) {
      const existing = sideEffectMap.get(se.title);
      if (existing) {
        sideEffectMap.set(se.title, {
          severity: se.severity ?? existing.severity,
          count: existing.count + 1,
        });
      } else {
        sideEffectMap.set(se.title, {
          severity: se.severity ?? 'LOW',
          count: 1,
        });
      }
    }

    const sideEffects = Array.from(sideEffectMap.entries()).map(
      ([title, data]) => ({
        title,
        severity: data.severity,
        count: data.count,
      }),
    );

    // Basic correlation analysis (simplified)
    const correlations = this.analyzeCorrelations(
      protocol.doses,
      protocol.outcomes,
    );

    // Adherence rate for this protocol
    const expectedDoses = this.estimateExpectedDoses(
      protocol.compounds,
      durationDays,
    );
    const adherenceRate =
      expectedDoses > 0
        ? Math.min(1, protocol.doses.length / expectedDoses)
        : 0;

    return {
      protocolId: protocol.id,
      protocolName: protocol.name,
      durationDays,
      totalDoses: protocol.doses.length,
      adherenceRate: Math.round(adherenceRate * 100) / 100,
      metricSummaries,
      sideEffects,
      correlations,
    };
  }

  private async calculateAdherenceRate(userId: string): Promise<number> {
    const activeProtocols = await this.prisma.userProtocol.findMany({
      where: { userId, status: 'ACTIVE' },
      include: {
        compounds: true,
        _count: { select: { doses: true } },
      },
    });

    if (activeProtocols.length === 0) return 0;

    let totalExpected = 0;
    let totalActual = 0;

    for (const protocol of activeProtocols) {
      const daysSinceStart = Math.ceil(
        (Date.now() - protocol.startDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      const expected = this.estimateExpectedDoses(
        protocol.compounds,
        daysSinceStart,
      );
      totalExpected += expected;
      totalActual += protocol._count.doses;
    }

    return totalExpected > 0
      ? Math.round(Math.min(1, totalActual / totalExpected) * 100) / 100
      : 0;
  }

  private estimateExpectedDoses(
    compounds: readonly { frequency: string }[],
    days: number,
  ): number {
    let total = 0;
    for (const c of compounds) {
      const weeklyFreq = this.parseFrequency(c.frequency);
      total += (weeklyFreq / 7) * days;
    }
    return Math.round(total);
  }

  private parseFrequency(frequency: string): number {
    const f = frequency.toLowerCase();
    if (f.includes('daily') || f === '7x/week') return 7;
    if (f.includes('2x') || f.includes('twice')) return 2;
    if (f.includes('3x')) return 3;
    if (f.includes('5x')) return 5;
    if (f.includes('eod') || f.includes('every other')) return 3.5;
    if (f.includes('weekly') || f === '1x/week') return 1;
    return 3;
  }

  private groupByMetric(
    outcomes: readonly { metric: string; value: number; recordedAt: Date }[],
  ): Record<string, { value: number; recordedAt: Date }[]> {
    const groups: Record<string, { value: number; recordedAt: Date }[]> = {};
    for (const o of outcomes) {
      if (!groups[o.metric]) {
        groups[o.metric] = [];
      }
      groups[o.metric].push({ value: o.value, recordedAt: o.recordedAt });
    }
    return groups;
  }

  private computeMetricSummary(
    metric: string,
    values: readonly { value: number; recordedAt: Date }[],
  ): MetricSummary {
    const nums = values.map((v) => v.value);
    const sorted = [...values].sort(
      (a, b) => a.recordedAt.getTime() - b.recordedAt.getTime(),
    );

    const count = nums.length;
    const average = Math.round((nums.reduce((a, b) => a + b, 0) / count) * 100) / 100;
    const min = Math.min(...nums);
    const max = Math.max(...nums);
    const latestValue = sorted[sorted.length - 1]?.value ?? 0;

    // Trend analysis: compare first half average to second half average
    let trend: MetricSummary['trend'] = 'insufficient_data';
    if (count >= 4) {
      const mid = Math.floor(count / 2);
      const firstHalf = sorted.slice(0, mid).map((v) => v.value);
      const secondHalf = sorted.slice(mid).map((v) => v.value);

      const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

      const changePercent = ((secondAvg - firstAvg) / firstAvg) * 100;

      if (Math.abs(changePercent) < 5) {
        trend = 'stable';
      } else if (changePercent > 0) {
        trend = 'improving';
      } else {
        trend = 'declining';
      }
    }

    return { metric, count, average, min, max, trend, latestValue };
  }

  private analyzeCorrelations(
    doses: readonly { takenAt: Date; amount: number }[],
    outcomes: readonly { recordedAt: Date; metric: string; value: number }[],
  ): { metric: string; direction: string; confidence: string }[] {
    if (doses.length < 5 || outcomes.length < 5) {
      return [];
    }

    // Group outcomes by metric and check if higher dosing periods correlate with better outcomes
    const metricGroups = this.groupByMetric(outcomes);
    const correlations: { metric: string; direction: string; confidence: string }[] = [];

    for (const [metric, values] of Object.entries(metricGroups)) {
      if (values.length < 5) continue;

      // Simple analysis: compare outcome values in weeks with high vs low dose counts
      const weeklyDoseCounts = this.getWeeklyDoseCounts(doses);
      const weeklyOutcomes = this.getWeeklyAverages(values);

      const commonWeeks = Object.keys(weeklyDoseCounts).filter(
        (w) => weeklyOutcomes[w] !== undefined,
      );

      if (commonWeeks.length < 3) continue;

      const doseValues = commonWeeks.map((w) => weeklyDoseCounts[w]);
      const outcomeValues = commonWeeks.map((w) => weeklyOutcomes[w]);

      const correlation = this.pearsonCorrelation(doseValues, outcomeValues);

      if (Math.abs(correlation) > 0.3) {
        correlations.push({
          metric,
          direction: correlation > 0 ? 'positive' : 'negative',
          confidence:
            Math.abs(correlation) > 0.7
              ? 'high'
              : Math.abs(correlation) > 0.5
                ? 'moderate'
                : 'low',
        });
      }
    }

    return correlations;
  }

  private getWeeklyDoseCounts(
    doses: readonly { takenAt: Date }[],
  ): Record<string, number> {
    const weeks: Record<string, number> = {};
    for (const d of doses) {
      const weekKey = this.getWeekKey(d.takenAt);
      weeks[weekKey] = (weeks[weekKey] ?? 0) + 1;
    }
    return weeks;
  }

  private getWeeklyAverages(
    values: readonly { value: number; recordedAt: Date }[],
  ): Record<string, number> {
    const weeks: Record<string, { sum: number; count: number }> = {};
    for (const v of values) {
      const weekKey = this.getWeekKey(v.recordedAt);
      if (!weeks[weekKey]) {
        weeks[weekKey] = { sum: 0, count: 0 };
      }
      weeks[weekKey].sum += v.value;
      weeks[weekKey].count += 1;
    }

    const averages: Record<string, number> = {};
    for (const [key, data] of Object.entries(weeks)) {
      averages[key] = data.sum / data.count;
    }
    return averages;
  }

  private getWeekKey(date: Date): string {
    const d = new Date(date);
    const dayNum = d.getUTCDay();
    const diff = d.getUTCDate() - dayNum + (dayNum === 0 ? -6 : 1);
    d.setUTCDate(diff);
    return d.toISOString().split('T')[0];
  }

  private pearsonCorrelation(x: number[], y: number[]): number {
    const n = x.length;
    if (n === 0) return 0;

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
    const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0);
    const sumY2 = y.reduce((acc, yi) => acc + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt(
      (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY),
    );

    return denominator === 0 ? 0 : numerator / denominator;
  }
}
