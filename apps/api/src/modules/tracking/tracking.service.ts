import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InjectionSite } from '@prisma/client';
import { CreateProtocolDto, LogDoseDto, LogOutcomeDto, LogEventDto } from './dto';

@Injectable()
export class TrackingService {
  private readonly logger = new Logger(TrackingService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createProtocol(userId: string, dto: CreateProtocolDto) {
    const protocol = await this.prisma.userProtocol.create({
      data: {
        userId,
        name: dto.name,
        notes: dto.description,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        status: 'ACTIVE',
        peptides: {
          create: dto.compounds.map((c) => ({
            peptideId: c.peptideId,
            dose: c.doseMcg,
            unit: c.route ?? 'mcg',
            frequency: c.frequency,
            timeOfDay: c.timeOfDay ? (c.timeOfDay as import('@prisma/client').TimeOfDay) : 'AM',
            laneUsed: 'CLINICAL' as import('@prisma/client').SourceLane,
          })),
        },
      },
      include: { peptides: { include: { peptide: true } } },
    });

    this.logger.log(`Protocol created: ${protocol.id} for user ${userId}`);
    return protocol;
  }

  async getUserProtocols(userId: string) {
    return this.prisma.userProtocol.findMany({
      where: { userId },
      include: {
        peptides: {
          include: {
            peptide: { select: { id: true, name: true, slug: true } },
          },
        },
        _count: {
          select: { events: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getProtocol(userId: string, protocolId: string) {
    const protocol = await this.prisma.userProtocol.findUnique({
      where: { id: protocolId },
      include: {
        peptides: {
          include: { peptide: true },
        },
        events: { orderBy: { createdAt: 'desc' }, take: 50 },
      },
    });

    if (!protocol) {
      throw new NotFoundException('Protocol not found');
    }

    if (protocol.userId !== userId) {
      throw new ForbiddenException('Access denied to this protocol');
    }

    return protocol;
  }

  async updateProtocol(userId: string, protocolId: string, data: Partial<CreateProtocolDto>) {
    await this.verifyProtocolOwnership(userId, protocolId);

    return this.prisma.userProtocol.update({
      where: { id: protocolId },
      data: {
        name: data.name,
        notes: data.description,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      },
      include: { peptides: { include: { peptide: true } } },
    });
  }

  async deleteProtocol(userId: string, protocolId: string) {
    await this.verifyProtocolOwnership(userId, protocolId);

    await this.prisma.userProtocol.update({
      where: { id: protocolId },
      data: { status: 'PAUSED' },
    });

    this.logger.log(`Protocol paused (soft-deleted): ${protocolId}`);
    return { deleted: true };
  }

  async logDose(userId: string, dto: LogDoseDto) {
    // Find the userProtocolPeptide for this protocol+peptide combination
    const protocolPeptide = await this.prisma.userProtocolPeptide.findFirst({
      where: {
        userProtocolId: dto.protocolId,
        peptideId: dto.peptideId,
        userProtocol: { userId },
      },
    });

    if (!protocolPeptide) {
      // Verify ownership at least
      await this.verifyProtocolOwnership(userId, dto.protocolId);
      throw new NotFoundException('Peptide not found in this protocol');
    }

    const site = dto.site ? (dto.site as InjectionSite) : null;

    const dose = await this.prisma.doseLog.create({
      data: {
        userProtocolPeptideId: protocolPeptide.id,
        takenAt: new Date(dto.takenAt),
        site,
        notes: dto.notes,
      },
    });

    this.logger.debug(`Dose logged: ${dose.id} for protocol ${dto.protocolId}`);
    return dose;
  }

  async logOutcome(userId: string, dto: LogOutcomeDto) {
    await this.verifyProtocolOwnership(userId, dto.protocolId);

    const outcome = await this.prisma.outcomeMetric.create({
      data: {
        userId,
        type: 'CUSTOM',
        valueNumber: dto.value,
        valueText: dto.metric,
        recordedAt: new Date(dto.recordedAt),
      },
    });

    this.logger.debug(`Outcome logged: ${outcome.id} for protocol ${dto.protocolId}`);
    return outcome;
  }

  async logEvent(userId: string, dto: LogEventDto) {
    await this.verifyProtocolOwnership(userId, dto.protocolId);

    const event = await this.prisma.protocolEvent.create({
      data: {
        userProtocolId: dto.protocolId,
        type: 'NOTE',
        payload: {
          title: dto.title,
          description: dto.description,
          severity: dto.severity,
          durationHours: dto.durationHours,
          occurredAt: dto.occurredAt,
          eventType: dto.type,
        },
      },
    });

    this.logger.debug(`Event logged: ${event.id} for protocol ${dto.protocolId}`);
    return event;
  }

  async getProtocolTimeline(userId: string, protocolId: string) {
    await this.verifyProtocolOwnership(userId, protocolId);

    const [protocolPeptides, events] = await Promise.all([
      this.prisma.userProtocolPeptide.findMany({
        where: { userProtocolId: protocolId },
        include: {
          doseLogs: { orderBy: { takenAt: 'desc' }, take: 50 },
          peptide: { select: { id: true, name: true, slug: true } },
        },
      }),
      this.prisma.protocolEvent.findMany({
        where: { userProtocolId: protocolId },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
    ]);

    const doses = protocolPeptides.flatMap((pp) =>
      pp.doseLogs.map((d) => ({
        kind: 'dose' as const,
        date: d.takenAt,
        data: { ...d, peptide: pp.peptide },
      })),
    );

    const eventItems = events.map((e) => ({
      kind: 'event' as const,
      date: e.createdAt,
      data: e,
    }));

    const timeline = [...doses, ...eventItems].sort(
      (a, b) => b.date.getTime() - a.date.getTime(),
    );

    return { protocolId, timeline };
  }

  private async verifyProtocolOwnership(userId: string, protocolId: string): Promise<void> {
    const protocol = await this.prisma.userProtocol.findUnique({
      where: { id: protocolId },
      select: { userId: true },
    });

    if (!protocol) {
      throw new NotFoundException('Protocol not found');
    }

    if (protocol.userId !== userId) {
      throw new ForbiddenException('Access denied to this protocol');
    }
  }
}
