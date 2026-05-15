import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

@WebSocketGateway({
  cors: {
    origin: (process.env.CORS_ORIGIN ?? 'http://localhost:3000').split(',').map(o => o.trim()),
    credentials: true,
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  handleConnection(client: Socket) {
    const authToken =
      typeof client.handshake.auth?.token === 'string' ? client.handshake.auth.token : undefined;
    const authorizationHeader = client.handshake.headers.authorization;
    const bearerToken =
      typeof authorizationHeader === 'string' ? authorizationHeader.split(' ')[1] : undefined;
    const token = authToken ?? bearerToken;

    if (!token) {
      client.disconnect();
      return;
    }

    try {
      const secret = this.config.get<string>('JWT_ACCESS_SECRET');
      if (!secret) {
        client.disconnect();
        return;
      }

      const payload = this.jwt.verify<JwtPayload>(token, {
        secret,
      });
      this.setSocketUser(client, payload);
      void client.join(`org:${payload.orgId}`);
      void client.join(`user:${payload.sub}`);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const user = this.getSocketUser(client);
    if (user) {
      void client.leave(`org:${user.orgId}`);
      void client.leave(`user:${user.sub}`);
    }
  }

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket, @MessageBody() data: unknown) {
    client.emit('pong', data);
  }

  // ─── Channel management ──────────────────────────────────────────────────────

  @SubscribeMessage('channel:join')
  async handleChannelJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { channelId: string },
  ) {
    const user = this.getSocketUser(client);
    if (!user) return;

    const channel = await this.prisma.channel.findFirst({
      where: { id: data.channelId, orgId: user.orgId },
    });
    if (channel) {
      void client.join(`channel:${data.channelId}`);
    }
  }

  @SubscribeMessage('channel:leave')
  handleChannelLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { channelId: string },
  ) {
    void client.leave(`channel:${data.channelId}`);
  }

  // ─── Call signaling ──────────────────────────────────────────────────────────

  @SubscribeMessage('call:invite')
  handleCallInvite(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { calleeId?: string; channelId?: string; channelName?: string; conversationId?: string; type: 'audio' | 'video'; callerName: string },
  ) {
    const caller = this.getSocketUser(client);
    if (!caller) return;

    if (data.calleeId) {
      this.server.to(`user:${data.calleeId}`).emit('call:invite', {
        callerId: caller.sub,
        callerName: data.callerName,
        conversationId: data.conversationId,
        type: data.type,
      });
      return;
    }

    if (data.channelId) {
      client.broadcast.to(`org:${caller.orgId}`).emit('call:invite', {
        callerId: caller.sub,
        callerName: data.callerName,
        channelId: data.channelId,
        channelName: data.channelName ?? null,
        type: data.type,
      });
    }
  }

  @SubscribeMessage('call:accepted')
  handleCallAccepted(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { callerId: string; conversationId?: string; channelId?: string },
  ) {
    const user = this.getSocketUser(client);
    if (!user) return;

    this.server.to(`user:${data.callerId}`).emit('call:accepted', {
      calleeId: user.sub,
      conversationId: data.conversationId ?? null,
      channelId: data.channelId ?? null,
    });
  }

  @SubscribeMessage('call:rejected')
  async handleCallRejected(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { callerId: string; conversationId?: string; callType?: 'audio' | 'video' },
  ) {
    const callee = this.getSocketUser(client);
    if (!callee) return;

    this.server.to(`user:${data.callerId}`).emit('call:rejected', {
      calleeId: callee.sub,
    });
    if (data.conversationId) {
      await this.createCallStamp(
        data.conversationId,
        data.callerId,
        data.callType ?? 'audio',
        'missed',
        0,
        callee.orgId,
      );
    }
  }

  @SubscribeMessage('call:offer')
  handleCallOffer(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { targetId?: string; channelId?: string; offer: RTCSessionDescriptionInit },
  ) {
    const user = this.getSocketUser(client);
    if (!user) return;

    const payload = {
      offer: data.offer,
      fromId: user.sub,
    };

    if (data.targetId) {
      this.server.to(`user:${data.targetId}`).emit('call:offer', payload);
    } else if (data.channelId) {
      this.server.to(`channel:${data.channelId}`).emit('call:offer', {
        ...payload,
        channelId: data.channelId,
      });
    }
  }

  @SubscribeMessage('call:answer')
  handleCallAnswer(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { targetId?: string; channelId?: string; answer: RTCSessionDescriptionInit },
  ) {
    const user = this.getSocketUser(client);
    if (!user) return;

    const payload = {
      answer: data.answer,
      fromId: user.sub,
    };

    if (data.targetId) {
      this.server.to(`user:${data.targetId}`).emit('call:answer', payload);
    } else if (data.channelId) {
      this.server.to(`channel:${data.channelId}`).emit('call:answer', {
        ...payload,
        channelId: data.channelId,
      });
    }
  }

  @SubscribeMessage('call:ice-candidate')
  handleIceCandidate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { targetId?: string; channelId?: string; candidate: RTCIceCandidateInit },
  ) {
    const user = this.getSocketUser(client);
    if (!user) return;

    const payload = {
      candidate: data.candidate,
      fromId: user.sub,
    };

    if (data.targetId) {
      this.server.to(`user:${data.targetId}`).emit('call:ice-candidate', payload);
    } else if (data.channelId) {
      this.server.to(`channel:${data.channelId}`).emit('call:ice-candidate', {
        ...payload,
        channelId: data.channelId,
      });
    }
  }

  @SubscribeMessage('call:end')
  async handleCallEnd(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { targetId?: string; channelId?: string; conversationId?: string; callType?: 'audio' | 'video'; duration?: number },
  ) {
    const caller = this.getSocketUser(client);
    if (!caller) return;

    if (data.targetId) {
      this.server.to(`user:${data.targetId}`).emit('call:end', {
        fromId: caller.sub,
      });
      if (data.conversationId) {
        const duration = data.duration ?? 0;
        await this.createCallStamp(
          data.conversationId,
          caller.sub,
          data.callType ?? 'audio',
          duration > 0 ? 'ended' : 'missed',
          duration,
          caller.orgId,
        );
      }
    } else if (data.channelId) {
      this.server.to(`channel:${data.channelId}`).emit('call:end', {
        fromId: caller.sub,
        channelId: data.channelId,
      });
    }
  }

  // ─── Emit helpers ────────────────────────────────────────────────────────────

  emitToOrg(orgId: string, event: string, payload: unknown) {
    this.server.to(`org:${orgId}`).emit(event, payload);
  }

  emitToUser(userId: string, event: string, payload: unknown) {
    this.server.to(`user:${userId}`).emit(event, payload);
  }

  // ─── Private helpers ─────────────────────────────────────────────────────────

  private async createCallStamp(
    conversationId: string,
    senderId: string,
    callType: 'audio' | 'video',
    status: 'ended' | 'missed',
    duration: number,
    orgId: string,
  ) {
    try {
      const convo = await this.prisma.directConversation.findFirst({
        where: { id: conversationId, orgId },
      });
      if (!convo) return;
      const otherId = convo.user1Id === senderId ? convo.user2Id : convo.user1Id;
      if (!otherId) return;

      const message = await this.prisma.directMessage.create({
        data: {
          conversationId,
          senderId,
          content: JSON.stringify({ __call__: true, callType, status, duration }),
        },
      });

      const emp = await this.prisma.employee.findFirst({
        where: { userId: senderId, orgId },
        select: { firstName: true, lastName: true, avatarUrl: true },
      });

      const payload = {
        id: message.id,
        conversationId,
        content: message.content,
        senderId,
        senderName: emp ? `${emp.firstName} ${emp.lastName}` : senderId,
        senderAvatar: emp?.avatarUrl ?? null,
        readAt: null,
        createdAt: message.createdAt.toISOString(),
      };

      this.server.to(`user:${senderId}`).emit('dm:new', payload);
      this.server.to(`user:${otherId}`).emit('dm:new', payload);
    } catch {
      // non-critical — call stamp failure should not crash the gateway
    }
  }

  private getSocketUser(client: Socket): JwtPayload | undefined {
    const data = client.data as Record<string, unknown>;
    const candidate = data.user;
    if (!this.isJwtPayload(candidate)) return undefined;
    return candidate;
  }

  private setSocketUser(client: Socket, user: JwtPayload): void {
    const data = client.data as Record<string, unknown>;
    data.user = user;
  }

  private isJwtPayload(value: unknown): value is JwtPayload {
    if (typeof value !== 'object' || value === null) return false;
    const candidate = value as Partial<JwtPayload>;
    return (
      typeof candidate.sub === 'string' &&
      typeof candidate.orgId === 'string' &&
      typeof candidate.role === 'string'
    );
  }
}
