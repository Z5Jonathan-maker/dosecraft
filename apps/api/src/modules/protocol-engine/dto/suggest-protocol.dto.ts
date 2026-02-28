import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  Min,
  Max,
  IsNumber,
} from 'class-validator';

export enum RiskAppetite {
  CONSERVATIVE = 'CONSERVATIVE',
  MODERATE = 'MODERATE',
  AGGRESSIVE = 'AGGRESSIVE',
}

export class SuggestProtocolDto {
  @ApiProperty({
    description: 'Goals for the protocol (e.g., "fat_loss", "muscle_gain", "sleep", "recovery")',
    example: ['fat_loss', 'sleep'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  readonly goals!: string[];

  @ApiProperty({ enum: RiskAppetite, description: 'Risk appetite determines lane access' })
  @IsEnum(RiskAppetite)
  readonly riskAppetite!: RiskAppetite;

  @ApiPropertyOptional({
    description: 'Maximum number of compounds in the protocol',
    default: 3,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  readonly maxCompounds?: number;

  @ApiPropertyOptional({
    description: 'Maximum injections per week',
    default: 7,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(21)
  readonly maxInjectionsPerWeek?: number;

  @ApiPropertyOptional({
    description: 'Monthly budget in USD',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly budget?: number;

  @ApiPropertyOptional({
    description: 'List of condition IDs the user has (for contraindication filtering)',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly conditions?: string[];

  @ApiPropertyOptional({
    description: 'List of peptide IDs currently being used (for interaction checking)',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly currentPeptides?: string[];
}
