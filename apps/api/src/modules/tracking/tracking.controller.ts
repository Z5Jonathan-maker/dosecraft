import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { TrackingService } from './tracking.service';
import { CreateProtocolDto, LogDoseDto, LogOutcomeDto, LogEventDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('tracking')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  // ── Protocols ──────────────────────────────────────────

  @Post('protocols')
  @ApiOperation({ summary: 'Create a new user protocol' })
  @ApiResponse({ status: 201, description: 'Protocol created' })
  async createProtocol(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateProtocolDto,
  ) {
    return {
      success: true,
      data: await this.trackingService.createProtocol(user.sub, dto),
    };
  }

  @Get('protocols')
  @ApiOperation({ summary: 'List all user protocols' })
  @ApiResponse({ status: 200, description: 'List of user protocols' })
  async getUserProtocols(@CurrentUser() user: JwtPayload) {
    return {
      success: true,
      data: await this.trackingService.getUserProtocols(user.sub),
    };
  }

  @Get('protocols/:id')
  @ApiOperation({ summary: 'Get protocol details with recent logs' })
  @ApiParam({ name: 'id', description: 'Protocol ID' })
  @ApiResponse({ status: 200, description: 'Protocol details' })
  @ApiResponse({ status: 404, description: 'Protocol not found' })
  async getProtocol(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
  ) {
    return {
      success: true,
      data: await this.trackingService.getProtocol(user.sub, id),
    };
  }

  @Put('protocols/:id')
  @ApiOperation({ summary: 'Update a protocol' })
  @ApiParam({ name: 'id', description: 'Protocol ID' })
  @ApiResponse({ status: 200, description: 'Protocol updated' })
  async updateProtocol(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: Partial<CreateProtocolDto>,
  ) {
    return {
      success: true,
      data: await this.trackingService.updateProtocol(user.sub, id, dto),
    };
  }

  @Delete('protocols/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Archive a protocol (soft delete)' })
  @ApiParam({ name: 'id', description: 'Protocol ID' })
  @ApiResponse({ status: 200, description: 'Protocol archived' })
  async deleteProtocol(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
  ) {
    return {
      success: true,
      data: await this.trackingService.deleteProtocol(user.sub, id),
    };
  }

  @Get('protocols/:id/timeline')
  @ApiOperation({ summary: 'Get unified protocol timeline (doses, outcomes, events)' })
  @ApiParam({ name: 'id', description: 'Protocol ID' })
  @ApiResponse({ status: 200, description: 'Merged timeline' })
  async getTimeline(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
  ) {
    return {
      success: true,
      data: await this.trackingService.getProtocolTimeline(user.sub, id),
    };
  }

  // ── Dose Logging ───────────────────────────────────────

  @Post('doses')
  @ApiOperation({ summary: 'Log a dose' })
  @ApiResponse({ status: 201, description: 'Dose logged' })
  async logDose(
    @CurrentUser() user: JwtPayload,
    @Body() dto: LogDoseDto,
  ) {
    return {
      success: true,
      data: await this.trackingService.logDose(user.sub, dto),
    };
  }

  // ── Outcome Logging ────────────────────────────────────

  @Post('outcomes')
  @ApiOperation({ summary: 'Log an outcome measurement' })
  @ApiResponse({ status: 201, description: 'Outcome logged' })
  async logOutcome(
    @CurrentUser() user: JwtPayload,
    @Body() dto: LogOutcomeDto,
  ) {
    return {
      success: true,
      data: await this.trackingService.logOutcome(user.sub, dto),
    };
  }

  // ── Event Logging ──────────────────────────────────────

  @Post('events')
  @ApiOperation({ summary: 'Log an event (side effect, bloodwork, note, etc.)' })
  @ApiResponse({ status: 201, description: 'Event logged' })
  async logEvent(
    @CurrentUser() user: JwtPayload,
    @Body() dto: LogEventDto,
  ) {
    return {
      success: true,
      data: await this.trackingService.logEvent(user.sub, dto),
    };
  }
}
