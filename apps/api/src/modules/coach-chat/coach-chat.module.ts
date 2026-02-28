import { Module } from '@nestjs/common';
import { CoachChatService } from './coach-chat.service';
import { CoachChatController } from './coach-chat.controller';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [AiModule],
  controllers: [CoachChatController],
  providers: [CoachChatService],
})
export class CoachChatModule {}
