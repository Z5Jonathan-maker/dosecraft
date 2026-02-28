import {
  Controller,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';
import { CoachChatService } from './coach-chat.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/decorators/current-user.decorator';

class ChatMessageDto {
  @ApiProperty({ description: 'User message to the coach', example: 'What dose of BPC-157 should I start with?' })
  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  readonly message!: string;

  @ApiPropertyOptional({ description: 'Existing conversation ID for continuation' })
  @IsOptional()
  @IsString()
  readonly conversationId?: string;
}

@ApiTags('coach-chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('coach-chat')
export class CoachChatController {
  constructor(private readonly coachChatService: CoachChatService) {}

  @Post()
  @ApiOperation({ summary: 'Send a message to the AI coach' })
  @ApiResponse({ status: 201, description: 'Coach response returned' })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  async chat(
    @CurrentUser() user: JwtPayload,
    @Body() dto: ChatMessageDto,
  ) {
    return {
      success: true,
      data: await this.coachChatService.processMessage(
        user.sub,
        dto.message,
        dto.conversationId,
      ),
    };
  }
}
