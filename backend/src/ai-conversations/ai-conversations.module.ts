import { Module } from '@nestjs/common';
import { AiConversationsService } from './ai-conversations.service';
import { AiConversationsController } from './ai-conversations.controller';

@Module({
  providers: [AiConversationsService],
  controllers: [AiConversationsController],
})
export class AiConversationsModule {}
