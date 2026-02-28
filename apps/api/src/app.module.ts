import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envConfig } from './config/env';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { LibraryModule } from './modules/library/library.module';
import { TrackingModule } from './modules/tracking/tracking.module';
import { ProtocolEngineModule } from './modules/protocol-engine/protocol-engine.module';
import { AiModule } from './modules/ai/ai.module';
import { CoachChatModule } from './modules/coach-chat/coach-chat.module';
import { InsightModule } from './modules/insight/insight.module';
import { BillingModule } from './modules/billing/billing.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
      cache: true,
    }),
    PrismaModule,
    AuthModule,
    LibraryModule,
    TrackingModule,
    ProtocolEngineModule,
    AiModule,
    CoachChatModule,
    InsightModule,
    BillingModule,
  ],
})
export class AppModule {}
