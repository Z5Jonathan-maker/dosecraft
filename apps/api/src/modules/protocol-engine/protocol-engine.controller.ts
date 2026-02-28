import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { ProtocolEngineService } from './protocol-engine.service';
import { SuggestProtocolDto, PersonalizeDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('protocol-engine')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('protocol-engine')
export class ProtocolEngineController {
  constructor(private readonly protocolEngine: ProtocolEngineService) {}

  @Post('suggest')
  @ApiOperation({
    summary: 'Get a deterministic protocol suggestion based on goals and constraints',
  })
  @ApiResponse({ status: 201, description: 'Protocol suggestion generated' })
  @ApiResponse({ status: 400, description: 'Invalid input parameters' })
  async suggest(
    @CurrentUser() user: JwtPayload,
    @Body() dto: SuggestProtocolDto,
  ) {
    return {
      success: true,
      data: await this.protocolEngine.suggestProtocol(user.sub, dto),
    };
  }

  @Post('personalize/:templateId')
  @ApiOperation({
    summary: 'Personalize a protocol template with user-specific constraints',
  })
  @ApiParam({ name: 'templateId', description: 'Protocol template ID' })
  @ApiResponse({ status: 201, description: 'Personalized protocol generated' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  async personalize(
    @CurrentUser() user: JwtPayload,
    @Param('templateId') templateId: string,
    @Body() dto: PersonalizeDto,
  ) {
    return {
      success: true,
      data: await this.protocolEngine.personalizeTemplate(
        user.sub,
        templateId,
        dto,
      ),
    };
  }
}
