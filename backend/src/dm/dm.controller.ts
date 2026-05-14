import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { DmService } from './dm.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendDmDto } from './dto/send-dm.dto';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

@Controller('dm')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DmController {
  constructor(private dm: DmService) {}

  @Get('users')
  listUsers(@CurrentUser() user: JwtPayload) {
    return this.dm.listUsers(user);
  }

  @Get('conversations')
  getConversations(@CurrentUser() user: JwtPayload) {
    return this.dm.getConversations(user);
  }

  @Post('conversations')
  getOrCreate(@Body() dto: CreateConversationDto, @CurrentUser() user: JwtPayload) {
    return this.dm.getOrCreateConversation(dto.targetUserId, user);
  }

  @Get('conversations/:id/messages')
  getMessages(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.dm.getMessages(id, user);
  }

  @Post('messages')
  sendMessage(@Body() dto: SendDmDto, @CurrentUser() user: JwtPayload) {
    return this.dm.sendMessage(dto.conversationId, dto.content, user);
  }

  @Patch('conversations/:id/read')
  markRead(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.dm.markRead(id, user);
  }
}
