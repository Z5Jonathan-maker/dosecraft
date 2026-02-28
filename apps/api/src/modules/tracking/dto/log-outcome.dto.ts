import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsDateString,
} from 'class-validator';

export class LogOutcomeDto {
  @ApiProperty({ description: 'User protocol ID' })
  @IsString()
  readonly protocolId!: string;

  @ApiProperty({ description: 'Outcome metric name (e.g., "sleep_quality", "energy", "body_composition")' })
  @IsString()
  readonly metric!: string;

  @ApiProperty({ description: 'Numeric value (1-10 scale or actual measurement)' })
  @IsNumber()
  @Min(0)
  readonly value!: number;

  @ApiPropertyOptional({ description: 'Unit of measurement (if applicable)' })
  @IsOptional()
  @IsString()
  readonly unit?: string;

  @ApiProperty({ description: 'Date of measurement (ISO 8601)' })
  @IsDateString()
  readonly recordedAt!: string;

  @ApiPropertyOptional({ description: 'Subjective rating 1-10' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  readonly subjectiveRating?: number;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  readonly notes?: string;
}
