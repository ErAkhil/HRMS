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
    origin: ['http://localhost:3000', 'http://localhost:8081', 'exp://localhost:8081'],
    credentials: true,
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    private prisma: PrismaService,
  ) {}

  async handleConnection(client: Socket) {
    const token =
      client.handshake.auth?.token ||
      (client.handshake.headers.authorization as string)?.split(' ')[1];

    if (!token) {
      client.disconnect();
      return;
    }

    try {
      const payload = this.jwt.verify<JwtPayload>(token, {
        secret: this.config.get<string>('JWT_ACCESS_SECRET'),
      });
      client.data.user = payload;
      client.join(`org:${payload.orgId}`);
      client.join(`user:${payload.sub}`);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const user = client.data.user as JwtPayload | undefined;
    if (user) {
      client.leave(`org:${user.orgId}`);
      client.leave(`user:${user.sub}`);
    }
  }

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket, @MessageBody() data: unknown) {
    client.emit('pong', data);
  }

  // ─── Call signaling ──────────────────────────────────────────────────────────

  @SubscribeMessage('call:invite')
  handleCallInvite(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { calleeId: string; conversationId: string; type: 'audio' | 'video'; callerName: string },
  ) {
    const caller = client.data.user as JwtPayload;
    this.server.to(`user:${data.calleeId}`).emit('call:invite', {
      callerId: caller.sub,
      callerName: data.callerName,
      conversationId: data.conversationId,
      type: data.type,
    });
  }

  @SubscribeMessage('call:accepted')
  handleCallAccepted(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { callerId: string },
  ) {
    this.server.to(`user:${data.callerId}`).emit('call:accepted', {
      calleeId: (client.data.user as JwtPayload).sub,
    });
  }

  @SubscribeMessage('call:rejected')
  async handleCallRejected(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { callerId: string; conversationId?: string; callType?: 'audio' | 'video' },
  ) {
    const callee = client.data.user as JwtPayload;
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
    @MessageBody() data: { targetId: string; offer: RTCSessionDescriptionInit },
  ) {
    this.server.to(`user:${data.targetId}`).emit('call:offer', {
      offer: data.offer,
      fromId: (client.data.user as JwtPayload).sub,
    });
  }

  @SubscribeMessage('call:answer')
  handleCallAnswer(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { targetId: string; answer: RTCSessionDescriptionInit },
  ) {
    this.server.to(`user:${data.targetId}`).emit('call:answer', {
      answer: data.answer,
      fromId: (client.data.user as JwtPayload).sub,
    });
  }

  @SubscribeMessage('call:ice-candidate')
  handleIceCandidate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { targetId: string; candidate: RTCIceCandidateInit },
  ) {
    this.server.to(`user:${data.targetId}`).emit('call:ice-candidate', {
      candidate: data.candidate,
      fromId: (client.data.user as JwtPayload).sub,
    });
  }

  @SubscribeMessage('call:end')
  async handleCallEnd(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { targetId: string; conversationId?: string; callType?: 'audio' | 'video'; duration?: number },
  ) {
    const caller = client.data.user as JwtPayload;
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
}
