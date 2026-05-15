import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
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
  private readonly dm: DmService;
  constructor(dm: DmService) { this.dm = dm; }

  @Get('users')
  @Throttle({ default: { ttl: 60_000, limit: 30 } })
  listUsers(@CurrentUser() user: JwtPayload) {
    return this.dm.listUsers(user);
  }

  @Get('conversations')
  @Throttle({ default: { ttl: 60_000, limit: 30 } })
  getConversations(@CurrentUser() user: JwtPayload) {
    return this.dm.getConversations(user);
  }

  @Post('conversations')
  @Throttle({ default: { ttl: 60_000, limit: 20 } })
  getOrCreate(@Body() dto: CreateConversationDto, @CurrentUser() user: JwtPayload) {
    return this.dm.getOrCreateConversation(dto.targetUserId, user);
  }

  @Get('conversations/:id/messages')
  @Throttle({ default: { ttl: 60_000, limit: 30 } })
  getMessages(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.dm.getMessages(id, user);
  }

  @Post('messages')
  @Throttle({ default: { ttl: 60_000, limit: 60 } })
  sendMessage(@Body() dto: SendDmDto, @CurrentUser() user: JwtPayload) {
    return this.dm.sendMessage(dto.conversationId, dto.content, user);
  }

  @Patch('conversations/:id/read')
  @Throttle({ default: { ttl: 60_000, limit: 20 } })
  markRead(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.dm.markRead(id, user);
  }

  @Post('calls/initiate')
  @Throttle({ default: { ttl: 60_000, limit: 20 } })
  initiateCall(
    @Body() data: { conversationId: string; callType: 'audio' | 'video' },
    @CurrentUser() user: JwtPayload,
  ) {
    return this.dm.initiateCall(data.conversationId, data.callType, user);
  }

  @Post('calls/:callId/accept')
  @Throttle({ default: { ttl: 60_000, limit: 20 } })
  acceptCall(@Param('callId') callId: string, @CurrentUser() user: JwtPayload) {
    return this.dm.acceptCall(callId, user);
  }

  @Post('calls/:callId/end')
  @Throttle({ default: { ttl: 60_000, limit: 20 } })
  endCall(@Param('callId') callId: string, @CurrentUser() user: JwtPayload) {
    return this.dm.endCall(callId, user);
  }
}
