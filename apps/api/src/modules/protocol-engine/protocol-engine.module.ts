import { Module } from '@nestjs/common';
import { ProtocolEngineService } from './protocol-engine.service';
import { ProtocolEngineController } from './protocol-engine.controller';

@Module({
  controllers: [ProtocolEngineController],
  providers: [ProtocolEngineService],
  exports: [ProtocolEngineService],
})
export class ProtocolEngineModule {}
