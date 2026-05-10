import { Module } from '@nestjs/common';
import { AiContextService } from './ai-context.service';
import { AiContextController } from './ai-context.controller';

@Module({
  providers: [AiContextService],
  controllers: [AiContextController],
})
export class AiContextModule {}
