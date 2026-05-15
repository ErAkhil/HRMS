import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CollaborationService } from './collaboration.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SendMessageDto } from './dto/send-message.dto';
import { CreateChannelDto } from './dto/create-channel.dto';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

@Controller('collaboration')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CollaborationController {
  private readonly collaboration: CollaborationService;
  constructor(collaboration: CollaborationService) { this.collaboration = collaboration; }

  @Get('channels')
  @Throttle({ default: { ttl: 60_000, limit: 30 } })
  getChannels(@CurrentUser() user: JwtPayload) {
    return this.collaboration.getChannels(user);
  }

  @Get('channels/:id/messages')
  @Throttle({ default: { ttl: 60_000, limit: 30 } })
  getChannelMessages(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.collaboration.getChannelMessages(id, user);
  }

  @Post('messages')
  @Throttle({ default: { ttl: 60_000, limit: 60 } })
  sendMessage(@Body() dto: SendMessageDto, @CurrentUser() user: JwtPayload) {
    return this.collaboration.sendMessage(dto.channelId, dto.content, user);
  }

  @Post('channels')
  @Throttle({ default: { ttl: 60_000, limit: 10 } })
  createChannel(@Body() dto: CreateChannelDto, @CurrentUser() user: JwtPayload) {
    return this.collaboration.createChannel(dto.name, dto.isPrivate ?? false, user);
  }

  @Post('channels/:id/read')
  @Throttle({ default: { ttl: 60_000, limit: 30 } })
  markChannelRead(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.collaboration.markChannelRead(id, user);
  }

  @Get('channels/:id/participants')
  @Throttle({ default: { ttl: 60_000, limit: 20 } })
  getChannelParticipants(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.collaboration.getChannelParticipants(id, user);
  }

  @Post('calls/channel')
  @Throttle({ default: { ttl: 60_000, limit: 20 } })
  initiateChannelCall(
    @Body() data: { channelId: string; callType: 'audio' | 'video' },
    @CurrentUser() user: JwtPayload,
  ) {
    return this.collaboration.initiateChannelCall(data.channelId, data.callType, user);
  }

  @Post('calls/:callId/accept')
  @Throttle({ default: { ttl: 60_000, limit: 20 } })
  acceptCall(@Param('callId') callId: string, @CurrentUser() user: JwtPayload) {
    return this.collaboration.acceptCall(callId, user);
  }

  @Post('calls/:callId/end')
  @Throttle({ default: { ttl: 60_000, limit: 20 } })
  endCall(@Param('callId') callId: string, @CurrentUser() user: JwtPayload) {
    return this.collaboration.endCall(callId, user);
  }

  @Get('stats')
  @Throttle({ default: { ttl: 60_000, limit: 15 } })
  getStats(@CurrentUser() user: JwtPayload) {
    return this.collaboration.getStats(user);
  }
}
