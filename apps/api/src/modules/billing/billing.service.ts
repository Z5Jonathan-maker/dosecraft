import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

/** Tier feature access matrix */
const TIER_FEATURES: Record<string, readonly string[]> = {
  FREE: [
    'library_browse',
    'protocol_create',
    'dose_log',
    'basic_insights',
  ],
  BASE: [
    'library_browse',
    'protocol_create',
    'dose_log',
    'basic_insights',
    'ai_coach',
    'advanced_insights',
  ],
  PRO: [
    'library_browse',
    'protocol_create',
    'dose_log',
    'basic_insights',
    'ai_coach',
    'advanced_insights',
    'protocol_engine',
    'export_data',
    'unlimited_protocols',
  ],
  LIFETIME: [
    'library_browse',
    'protocol_create',
    'dose_log',
    'basic_insights',
    'ai_coach',
    'advanced_insights',
    'protocol_engine',
    'export_data',
    'unlimited_protocols',
    'multi_patient',
    'clinic_dashboard',
    'api_access',
    'white_label',
  ],
};

export interface CheckoutSession {
  readonly sessionId: string;
  readonly url: string;
}

export interface SubscriptionInfo {
  readonly tier: string;
  readonly status: string;
  readonly currentPeriodEnd: Date | null;
  readonly features: readonly string[];
}

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async createCheckoutSession(
    userId: string,
    priceId: string,
  ): Promise<CheckoutSession> {
    const stripeKey = this.config.get<string>('env.stripeSecretKey');
    if (!stripeKey) {
      throw new BadRequestException('Billing is not configured');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // TODO: Replace with actual Stripe SDK call
    this.logger.log(`Checkout session created for user ${userId}, price ${priceId}`);

    // Placeholder until Stripe SDK is integrated
    return {
      sessionId: `cs_placeholder_${Date.now()}`,
      url: `https://checkout.stripe.com/placeholder/${priceId}`,
    };
  }

  async handleWebhook(
    payload: Buffer,
    signature: string,
  ): Promise<{ received: boolean }> {
    const webhookSecret = this.config.get<string>('env.stripeWebhookSecret');
    if (!webhookSecret) {
      throw new BadRequestException('Webhook secret not configured');
    }

    // TODO: Replace with actual Stripe webhook verification and handling
    this.logger.log('Webhook received and processed');

    return { received: true };
  }

  async getSubscription(userId: string): Promise<SubscriptionInfo> {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      // User has no subscription record — return FREE defaults
      return {
        tier: 'FREE',
        status: 'none',
        currentPeriodEnd: null,
        features: TIER_FEATURES['FREE'] ?? [],
      };
    }

    const tier = subscription.tier ?? 'FREE';
    const features = TIER_FEATURES[tier] ?? TIER_FEATURES['FREE'] ?? [];

    return {
      tier,
      status: subscription.status ?? 'none',
      currentPeriodEnd: subscription.currentPeriodEnd ?? null,
      features,
    };
  }

  async checkFeatureAccess(
    userId: string,
    feature: string,
  ): Promise<{ allowed: boolean; tier: string; requiredTier: string | null }> {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
      select: { tier: true },
    });

    const tier = subscription?.tier ?? 'FREE';
    const features = TIER_FEATURES[tier] ?? TIER_FEATURES['FREE'] ?? [];
    const allowed = features.includes(feature);

    // Find the minimum tier that includes this feature
    let requiredTier: string | null = null;
    if (!allowed) {
      for (const [t, feats] of Object.entries(TIER_FEATURES)) {
        if (feats.includes(feature)) {
          requiredTier = t;
          break;
        }
      }
    }

    return { allowed, tier, requiredTier };
  }
}
