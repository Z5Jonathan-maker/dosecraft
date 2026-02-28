import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsEnum,
  IsInt,
  Min,
  Max,
  IsNumber,
  IsArray,
  IsString,
} from 'class-validator';
import { RiskAppetite } from './suggest-protocol.dto';

export class PersonalizeDto {
  @ApiPropertyOptional({ enum: RiskAppetite })
  @IsOptional()
  @IsEnum(RiskAppetite)
  readonly riskAppetite?: RiskAppetite;

  @ApiPropertyOptional({ description: 'Override maximum compounds' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  readonly maxCompounds?: number;

  @ApiPropertyOptional({ description: 'Override maximum injections per week' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(21)
  readonly maxInjectionsPerWeek?: number;

  @ApiPropertyOptional({ description: 'Monthly budget in USD' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly budget?: number;

  @ApiPropertyOptional({
    description: 'User condition IDs for contraindication filtering',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly conditions?: string[];

  @ApiPropertyOptional({
    description: 'Current peptide IDs for interaction checking',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly currentPeptides?: string[];
}
