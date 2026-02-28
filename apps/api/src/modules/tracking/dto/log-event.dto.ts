import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export enum EventType {
  SIDE_EFFECT = 'SIDE_EFFECT',
  BLOODWORK = 'BLOODWORK',
  NOTE = 'NOTE',
  PROTOCOL_CHANGE = 'PROTOCOL_CHANGE',
  MILESTONE = 'MILESTONE',
}

export enum EventSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export class LogEventDto {
  @ApiProperty({ description: 'User protocol ID' })
  @IsString()
  readonly protocolId!: string;

  @ApiProperty({ enum: EventType, description: 'Type of event' })
  @IsEnum(EventType)
  readonly type!: EventType;

  @ApiProperty({ description: 'Event title or summary' })
  @IsString()
  readonly title!: string;

  @ApiPropertyOptional({ description: 'Detailed description' })
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiPropertyOptional({ enum: EventSeverity, description: 'Severity (for side effects)' })
  @IsOptional()
  @IsEnum(EventSeverity)
  readonly severity?: EventSeverity;

  @ApiPropertyOptional({ description: 'Duration in hours' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(720)
  readonly durationHours?: number;

  @ApiProperty({ description: 'When the event occurred (ISO 8601)' })
  @IsDateString()
  readonly occurredAt!: string;
}
