import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  IsDateString,
  IsEnum,
} from 'class-validator';

export enum DoseUnit {
  MCG = 'MCG',
  MG = 'MG',
  IU = 'IU',
  ML = 'ML',
}

export class LogDoseDto {
  @ApiProperty({ description: 'User protocol ID' })
  @IsString()
  readonly protocolId!: string;

  @ApiProperty({ description: 'Peptide ID' })
  @IsString()
  readonly peptideId!: string;

  @ApiProperty({ description: 'Dose amount' })
  @IsNumber()
  @Min(0)
  readonly amount!: number;

  @ApiProperty({ enum: DoseUnit, description: 'Unit of measurement' })
  @IsEnum(DoseUnit)
  readonly unit!: DoseUnit;

  @ApiProperty({ description: 'When the dose was taken (ISO 8601)' })
  @IsDateString()
  readonly takenAt!: string;

  @ApiPropertyOptional({ description: 'Injection site or administration details' })
  @IsOptional()
  @IsString()
  readonly site?: string;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  readonly notes?: string;
}
