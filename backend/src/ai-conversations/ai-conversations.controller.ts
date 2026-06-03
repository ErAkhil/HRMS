import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AiConversationsService } from './ai-conversations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

@Controller('ai-conversations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AiConversationsController {
  constructor(private service: AiConversationsService) {}

  @Get('plan-info')
  getPlanInfo(@CurrentUser() user: JwtPayload) {
    return this.service.getPlanInfo(user);
  }

  @Get()
  list(@CurrentUser() user: JwtPayload) {
    return this.service.listConversations(user);
  }

  @Get(':id')
  get(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.service.getConversation(id, user);
  }

  @Post()
  create(@CurrentUser() user: JwtPayload, @Body('title') title: string) {
    return this.service.createConversation(user, title || 'New conversation');
  }

  @Post(':id/messages')
  @HttpCode(HttpStatus.NO_CONTENT)
  appendMessages(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body('messages') messages: Array<{ role: string; content: string }>,
  ) {
    return this.service.appendMessages(id, user, messages);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.service.deleteConversation(id, user);
  }
}
