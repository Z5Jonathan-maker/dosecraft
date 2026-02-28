import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SearchPeptidesDto } from './dto';

interface PaginatedResult<T> {
  readonly items: readonly T[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly totalPages: number;
}

@Injectable()
export class LibraryService {
  private readonly logger = new Logger(LibraryService.name);

  constructor(private readonly prisma: PrismaService) {}

  async searchPeptides(dto: SearchPeptidesDto): Promise<PaginatedResult<unknown>> {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (dto.query) {
      where.OR = [
        { name: { contains: dto.query, mode: 'insensitive' } },
        { description: { contains: dto.query, mode: 'insensitive' } },
        { aliases: { has: dto.query } },
      ];
    }

    if (dto.category) {
      where.category = { slug: dto.category };
    }

    if (dto.route) {
      where.routes = { has: dto.route };
    }

    if (dto.status) {
      where.status = dto.status;
    }

    if (dto.goal) {
      where.goals = { has: dto.goal };
    }

    const [items, total] = await Promise.all([
      this.prisma.peptide.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: { select: { id: true, name: true, slug: true } },
        },
        orderBy: { name: 'asc' },
      }),
      this.prisma.peptide.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getPeptideBySlug(slug: string): Promise<unknown> {
    const peptide = await this.prisma.peptide.findUnique({
      where: { slug },
      include: {
        category: true,
        lanes: {
          orderBy: { order: 'asc' },
        },
        contraindications: true,
        interactions: {
          include: {
            targetPeptide: {
              select: { id: true, name: true, slug: true },
            },
          },
        },
      },
    });

    if (!peptide) {
      throw new NotFoundException(`Peptide with slug "${slug}" not found`);
    }

    this.logger.debug(`Retrieved peptide: ${peptide.name}`);
    return peptide;
  }

  async listCategories(): Promise<unknown[]> {
    return this.prisma.category.findMany({
      include: {
        _count: { select: { peptides: true } },
      },
      orderBy: { name: 'asc' },
    });
  }
}
