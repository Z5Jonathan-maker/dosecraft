import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Headers,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiProperty,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Request } from 'express';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/decorators/current-user.decorator';

class CreateCheckoutDto {
  @ApiProperty({
    description: 'Stripe Price ID',
    example: 'price_1abc123',
  })
  @IsString()
  readonly priceId!: string;
}

@ApiTags('billing')
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a Stripe checkout session' })
  @ApiResponse({ status: 201, description: 'Checkout session URL returned' })
  @ApiResponse({ status: 400, description: 'Billing not configured' })
  async createCheckout(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateCheckoutDto,
  ) {
    return {
      success: true,
      data: await this.billingService.createCheckoutSession(
        user.sub,
        dto.priceId,
      ),
    };
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiExcludeEndpoint()
  async webhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    const rawBody = req.rawBody;
    if (!rawBody) {
      return { received: false, error: 'Missing raw body' };
    }

    return this.billingService.handleWebhook(rawBody, signature);
  }

  @Get('subscription')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current subscription details and features' })
  @ApiResponse({ status: 200, description: 'Subscription details' })
  async getSubscription(@CurrentUser() user: JwtPayload) {
    return {
      success: true,
      data: await this.billingService.getSubscription(user.sub),
    };
  }

  @Post('portal')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Stripe customer portal session' })
  @ApiResponse({ status: 200, description: 'Customer portal URL' })
  async createPortal(@CurrentUser() user: JwtPayload) {
    return {
      success: true,
      data: await this.billingService.createPortalSession(user.sub),
    };
  }
}
