import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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
        description: dto.description,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        status: 'ACTIVE',
        compounds: {
          create: dto.compounds.map((c) => ({
            peptideId: c.peptideId,
            doseMcg: c.doseMcg,
            frequency: c.frequency,
            route: c.route,
            timeOfDay: c.timeOfDay,
          })),
        },
      },
      include: { compounds: { include: { peptide: true } } },
    });

    this.logger.log(`Protocol created: ${protocol.id} for user ${userId}`);
    return protocol;
  }

  async getUserProtocols(userId: string) {
    return this.prisma.userProtocol.findMany({
      where: { userId },
      include: {
        compounds: {
          include: {
            peptide: { select: { id: true, name: true, slug: true } },
          },
        },
        _count: {
          select: { doses: true, outcomes: true, events: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getProtocol(userId: string, protocolId: string) {
    const protocol = await this.prisma.userProtocol.findUnique({
      where: { id: protocolId },
      include: {
        compounds: {
          include: { peptide: true },
        },
        doses: { orderBy: { takenAt: 'desc' }, take: 50 },
        outcomes: { orderBy: { recordedAt: 'desc' }, take: 50 },
        events: { orderBy: { occurredAt: 'desc' }, take: 50 },
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
        description: data.description,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      },
      include: { compounds: { include: { peptide: true } } },
    });
  }

  async deleteProtocol(userId: string, protocolId: string) {
    await this.verifyProtocolOwnership(userId, protocolId);

    await this.prisma.userProtocol.update({
      where: { id: protocolId },
      data: { status: 'ARCHIVED' },
    });

    this.logger.log(`Protocol archived: ${protocolId}`);
    return { deleted: true };
  }

  async logDose(userId: string, dto: LogDoseDto) {
    await this.verifyProtocolOwnership(userId, dto.protocolId);

    const dose = await this.prisma.doseLog.create({
      data: {
        protocolId: dto.protocolId,
        peptideId: dto.peptideId,
        amount: dto.amount,
        unit: dto.unit,
        takenAt: new Date(dto.takenAt),
        site: dto.site,
        notes: dto.notes,
      },
    });

    this.logger.debug(`Dose logged: ${dose.id} for protocol ${dto.protocolId}`);
    return dose;
  }

  async logOutcome(userId: string, dto: LogOutcomeDto) {
    await this.verifyProtocolOwnership(userId, dto.protocolId);

    const outcome = await this.prisma.outcomeLog.create({
      data: {
        protocolId: dto.protocolId,
        metric: dto.metric,
        value: dto.value,
        unit: dto.unit,
        recordedAt: new Date(dto.recordedAt),
        subjectiveRating: dto.subjectiveRating,
        notes: dto.notes,
      },
    });

    this.logger.debug(`Outcome logged: ${outcome.id} for protocol ${dto.protocolId}`);
    return outcome;
  }

  async logEvent(userId: string, dto: LogEventDto) {
    await this.verifyProtocolOwnership(userId, dto.protocolId);

    const event = await this.prisma.eventLog.create({
      data: {
        protocolId: dto.protocolId,
        type: dto.type,
        title: dto.title,
        description: dto.description,
        severity: dto.severity,
        durationHours: dto.durationHours,
        occurredAt: new Date(dto.occurredAt),
      },
    });

    this.logger.debug(`Event logged: ${event.id} for protocol ${dto.protocolId}`);
    return event;
  }

  async getProtocolTimeline(userId: string, protocolId: string) {
    await this.verifyProtocolOwnership(userId, protocolId);

    const [doses, outcomes, events] = await Promise.all([
      this.prisma.doseLog.findMany({
        where: { protocolId },
        orderBy: { takenAt: 'desc' },
        include: {
          peptide: { select: { id: true, name: true, slug: true } },
        },
      }),
      this.prisma.outcomeLog.findMany({
        where: { protocolId },
        orderBy: { recordedAt: 'desc' },
      }),
      this.prisma.eventLog.findMany({
        where: { protocolId },
        orderBy: { occurredAt: 'desc' },
      }),
    ]);

    // Merge into a unified timeline sorted by date
    const timeline = [
      ...doses.map((d) => ({ kind: 'dose' as const, date: d.takenAt, data: d })),
      ...outcomes.map((o) => ({ kind: 'outcome' as const, date: o.recordedAt, data: o })),
      ...events.map((e) => ({ kind: 'event' as const, date: e.occurredAt, data: e })),
    ].sort((a, b) => b.date.getTime() - a.date.getTime());

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
