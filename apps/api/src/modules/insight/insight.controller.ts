import {
  Controller,
  Get,
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
import { InsightService } from './insight.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('insights')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('insights')
export class InsightController {
  constructor(private readonly insightService: InsightService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get aggregated insights for the current user' })
  @ApiResponse({ status: 200, description: 'User insights with metrics, adherence, and trends' })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  async getUserInsights(@CurrentUser() user: JwtPayload) {
    return {
      success: true,
      data: await this.insightService.getUserInsights(user.sub),
    };
  }

  @Get('protocol/:id')
  @ApiOperation({ summary: 'Get detailed analysis for a specific protocol' })
  @ApiParam({ name: 'id', description: 'Protocol ID' })
  @ApiResponse({ status: 200, description: 'Protocol analysis with metrics, side effects, and correlations' })
  @ApiResponse({ status: 404, description: 'Protocol not found' })
  async getProtocolAnalysis(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
  ) {
    return {
      success: true,
      data: await this.insightService.getProtocolAnalysis(user.sub, id),
    };
  }
}
