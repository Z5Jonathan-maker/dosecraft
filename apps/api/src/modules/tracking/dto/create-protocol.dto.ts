import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsArray,
  IsDateString,
  ValidateNested,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ProtocolCompoundDto {
  @ApiProperty({ description: 'Peptide ID from library' })
  @IsString()
  readonly peptideId!: string;

  @ApiProperty({ description: 'Dose amount in mcg' })
  @IsNumber()
  @Min(0)
  readonly doseMcg!: number;

  @ApiProperty({ description: 'Frequency (e.g., "daily", "3x/week")' })
  @IsString()
  readonly frequency!: string;

  @ApiPropertyOptional({ description: 'Administration route' })
  @IsOptional()
  @IsString()
  readonly route?: string;

  @ApiPropertyOptional({ description: 'Time of day preference' })
  @IsOptional()
  @IsString()
  readonly timeOfDay?: string;
}

export class CreateProtocolDto {
  @ApiProperty({ description: 'Protocol name' })
  @IsString()
  readonly name!: string;

  @ApiPropertyOptional({ description: 'Protocol description or notes' })
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiProperty({ description: 'Start date (ISO 8601)' })
  @IsDateString()
  readonly startDate!: string;

  @ApiPropertyOptional({ description: 'End date (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  readonly endDate?: string;

  @ApiProperty({ type: [ProtocolCompoundDto], description: 'Compounds in this protocol' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProtocolCompoundDto)
  readonly compounds!: ProtocolCompoundDto[];
}
