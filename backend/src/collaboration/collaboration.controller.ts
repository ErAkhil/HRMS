import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
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
  constructor(private collaboration: CollaborationService) {}

  @Get('channels')
  getChannels(@CurrentUser() user: JwtPayload) {
    return this.collaboration.getChannels(user);
  }

  @Get('channels/:id/messages')
  getChannelMessages(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.collaboration.getChannelMessages(id, user);
  }

  @Post('messages')
  sendMessage(@Body() dto: SendMessageDto, @CurrentUser() user: JwtPayload) {
    return this.collaboration.sendMessage(dto.channelId, dto.content, user);
  }

  @Post('channels')
  createChannel(@Body() dto: CreateChannelDto, @CurrentUser() user: JwtPayload) {
    return this.collaboration.createChannel(dto.name, dto.isPrivate ?? false, user);
  }

  @Get('stats')
  getStats(@CurrentUser() user: JwtPayload) {
    return this.collaboration.getStats(user);
  }
}
