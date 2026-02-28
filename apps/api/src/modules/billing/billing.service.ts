import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';

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

    const stripe = new Stripe(stripeKey);

    // Get or create Stripe customer
    let sub = await this.prisma.subscription.findUnique({
      where: { userId },
    });
    let customerId = sub?.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId },
      });
      customerId = customer.id;

      // Upsert subscription record with customerId
      await this.prisma.subscription.upsert({
        where: { userId },
        create: {
          userId,
          stripeCustomerId: customerId,
          tier: 'FREE',
          status: 'ACTIVE',
        },
        update: { stripeCustomerId: customerId },
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${this.config.get('env.frontendUrl')}/billing?success=true`,
      cancel_url: `${this.config.get('env.frontendUrl')}/billing?canceled=true`,
      metadata: { userId },
    });

    this.logger.log(
      `Checkout session ${session.id} created for user ${userId}, price ${priceId}`,
    );

    return {
      sessionId: session.id,
      url: session.url!,
    };
  }

  async handleWebhook(
    payload: Buffer,
    signature: string,
  ): Promise<{ received: boolean }> {
    const webhookSecret = this.config.get<string>('env.stripeWebhookSecret');
    const stripeKey = this.config.get<string>('env.stripeSecretKey');
    if (!webhookSecret || !stripeKey) {
      throw new BadRequestException('Webhook configuration incomplete');
    }

    const stripe = new Stripe(stripeKey);
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret,
    );

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = (session.metadata?.userId as string) || '';
        if (userId && session.subscription) {
          const sub = await stripe.subscriptions.retrieve(
            session.subscription as string,
          );
          const priceId = sub.items.data[0]?.price.id;
          const tier = this.mapPriceToTier(priceId || '');

          const subscriptionData = sub as unknown as { current_period_end: number };
          await this.prisma.subscription.upsert({
            where: { userId },
            create: {
              userId,
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: sub.id,
              tier,
              status: 'ACTIVE',
              currentPeriodEnd: new Date(subscriptionData.current_period_end * 1000),
            },
            update: {
              stripeSubscriptionId: sub.id,
              tier,
              status: 'ACTIVE',
              currentPeriodEnd: new Date(subscriptionData.current_period_end * 1000),
            },
          });

          this.logger.log(
            `Subscription created for user ${userId}, tier ${tier}`,
          );
        }
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = (subscription.metadata?.userId as string) || '';
        if (userId) {
          const newStatus =
            subscription.status === 'active'
              ? 'ACTIVE'
              : subscription.status === 'past_due'
                ? 'PAST_DUE'
                : 'CANCELED';

          const subscriptionData = subscription as unknown as { current_period_end: number };
          await this.prisma.subscription.update({
            where: { userId },
            data: {
              status: newStatus,
              currentPeriodEnd: new Date(subscriptionData.current_period_end * 1000),
            },
          });

          this.logger.log(
            `Subscription updated for user ${userId}, status ${newStatus}`,
          );
        }
        break;
      }

      default:
        this.logger.debug(`Unhandled webhook event type: ${event.type}`);
    }

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

  private mapPriceToTier(
    priceId: string,
  ): 'FREE' | 'BASE' | 'PRO' | 'LIFETIME' {
    const basePriceId = this.config.get<string>('env.stripeBasePriceId');
    const proPriceId = this.config.get<string>('env.stripeProPriceId');

    if (priceId === basePriceId) return 'BASE';
    if (priceId === proPriceId) return 'PRO';
    return 'FREE';
  }

  async createPortalSession(userId: string): Promise<{ url: string }> {
    const stripeKey = this.config.get<string>('env.stripeSecretKey');
    if (!stripeKey) {
      throw new BadRequestException('Billing is not configured');
    }

    const sub = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (!sub?.stripeCustomerId) {
      throw new BadRequestException('No billing account found');
    }

    const stripe = new Stripe(stripeKey);
    const session = await stripe.billingPortal.sessions.create({
      customer: sub.stripeCustomerId,
      return_url: `${this.config.get('env.frontendUrl')}/billing`,
    });

    this.logger.log(`Customer portal session created for user ${userId}`);

    return { url: session.url };
  }
}
