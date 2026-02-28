import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export enum PeptideRoute {
  SUBCUTANEOUS = 'SUBCUTANEOUS',
  INTRAMUSCULAR = 'INTRAMUSCULAR',
  ORAL = 'ORAL',
  NASAL = 'NASAL',
  TOPICAL = 'TOPICAL',
}

export enum PeptideStatus {
  RESEARCH = 'RESEARCH',
  CLINICAL_TRIAL = 'CLINICAL_TRIAL',
  APPROVED = 'APPROVED',
  OFF_LABEL = 'OFF_LABEL',
}

export class SearchPeptidesDto {
  @ApiPropertyOptional({ description: 'Search query for peptide name or description' })
  @IsOptional()
  @IsString()
  readonly query?: string;

  @ApiPropertyOptional({ description: 'Filter by category slug' })
  @IsOptional()
  @IsString()
  readonly category?: string;

  @ApiPropertyOptional({ enum: PeptideRoute, description: 'Filter by administration route' })
  @IsOptional()
  @IsEnum(PeptideRoute)
  readonly route?: PeptideRoute;

  @ApiPropertyOptional({ enum: PeptideStatus, description: 'Filter by regulatory status' })
  @IsOptional()
  @IsEnum(PeptideStatus)
  readonly status?: PeptideStatus;

  @ApiPropertyOptional({ description: 'Filter by goal/use-case tag' })
  @IsOptional()
  @IsString()
  readonly goal?: string;

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  readonly page?: number = 1;

  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  readonly limit?: number = 20;
}
