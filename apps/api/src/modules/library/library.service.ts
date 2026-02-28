import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SearchPeptidesDto } from './dto';

export interface PaginatedResult<T> {
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
      ];
    }

    if (dto.category) {
      where.category = dto.category;
    }

    if (dto.route) {
      where.route = dto.route;
    }

    if (dto.status) {
      where.status = dto.status;
    }

    const [items, total] = await Promise.all([
      this.prisma.peptide.findMany({
        where,
        skip,
        take: limit,
        include: {
          clinicalLanes: { take: 1 },
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
        clinicalLanes: true,
        expertLanes: true,
        experimentalLanes: true,
        contraindications: true,
        interactionsAsA: {
          include: {
            peptideB: {
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
    // Return distinct categories with counts
    const groups = await this.prisma.peptide.groupBy({
      by: ['category'],
      _count: { category: true },
      orderBy: { category: 'asc' },
    });

    return groups.map((g) => ({
      category: g.category,
      count: g._count.category,
    }));
  }
}
