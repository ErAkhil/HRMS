import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../events/events.gateway';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

type ReadReceipt = {
  userId: string;
  name: string;
  avatar: string | null;
  readAt: string;
};

@Injectable()
export class CollaborationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventsGateway,
  ) {}

  async getChannels(user: JwtPayload) {
    const channels = await this.prisma.channel.findMany({
      where: { orgId: user.orgId },
      include: {
        _count: { select: { messages: true, participants: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    type UnreadRow = { channelId: string; unread: number };
    const unreadRows =
      channels.length > 0
        ? await this.prisma.$queryRaw<UnreadRow[]>(Prisma.sql`
            SELECT m."channelId", COUNT(*)::int AS unread
            FROM "messages" m
            LEFT JOIN "channel_participants" cp
              ON cp."channelId" = m."channelId"
              AND cp."userId" = ${user.sub}
            WHERE m."channelId" IN (${Prisma.join(channels.map((channel) => channel.id))})
              AND m."senderId" <> ${user.sub}
              AND (cp."lastReadAt" IS NULL OR m."createdAt" > cp."lastReadAt")
            GROUP BY m."channelId"
          `)
        : [];
    const unreadMap = new Map(unreadRows.map((row) => [row.channelId, Number(row.unread)]));

    return channels.map((ch) => ({
      id: ch.id,
      name: ch.name,
      isPrivate: ch.isPrivate,
      participantCount: ch._count.participants,
      messageCount: ch._count.messages,
      lastMessage: ch.messages[0]?.content ?? null,
      lastMessageAt: ch.messages[0]?.createdAt.toISOString() ?? null,
      unread: unreadMap.get(ch.id) ?? 0,
    }));
  }

  async getChannelMessages(channelId: string, user: JwtPayload) {
    const channel = await this.prisma.channel.findFirst({
      where: { id: channelId, orgId: user.orgId },
    });
    if (!channel) throw new NotFoundException('Channel not found');

    await this.prisma.channelParticipant.upsert({
      where: { channelId_userId: { channelId, userId: user.sub } },
      create: { channelId, userId: user.sub },
      update: {},
    });

    const messages = await this.prisma.message.findMany({
      where: { channelId },
      orderBy: { createdAt: 'asc' },
      take: 50,
    });

    const participants = await this.prisma.channelParticipant.findMany({
      where: { channelId },
      select: { userId: true, lastReadMessageId: true, lastReadAt: true },
    });

    const senderIds = [...new Set(messages.map((m) => m.senderId).filter((id): id is string => id !== null))];
    const employees =
      senderIds.length > 0
        ? await this.prisma.employee.findMany({
            where: { userId: { in: senderIds }, orgId: user.orgId },
            select: { userId: true, firstName: true, lastName: true, avatarUrl: true },
          })
        : [];
    const empMap = new Map(employees.flatMap((e) => e.userId ? [[e.userId, e] as const] : []));
    const participantEmpRows =
      participants.length > 0
        ? await this.prisma.employee.findMany({
            where: { userId: { in: participants.map((p) => p.userId) }, orgId: user.orgId },
            select: { userId: true, firstName: true, lastName: true, avatarUrl: true },
          })
        : [];
    const participantEmpMap = new Map(participantEmpRows.flatMap((e) => e.userId ? [[e.userId, e] as const] : []));

    return messages.map((m) => {
      const emp = m.senderId ? empMap.get(m.senderId) : null;
      const readers: ReadReceipt[] = participants
        .filter((participant) => participant.lastReadMessageId === m.id && participant.userId !== m.senderId)
        .map((participant) => {
          const readerEmp = participantEmpMap.get(participant.userId);
          return {
            userId: participant.userId,
            name: readerEmp ? `${readerEmp.firstName} ${readerEmp.lastName}` : 'Unknown',
            avatar: readerEmp?.avatarUrl ?? null,
            readAt: participant.lastReadAt?.toISOString() ?? m.createdAt.toISOString(),
          };
        });
      return {
        id: m.id,
        content: m.content,
        senderId: m.senderId,
        senderName: emp ? `${emp.firstName} ${emp.lastName}` : 'Unknown',
        senderAvatar: emp?.avatarUrl ?? null,
        isMe: m.senderId === user.sub,
        createdAt: m.createdAt.toISOString(),
        readBy: readers,
      };
    });
  }

  async sendMessage(channelId: string, content: string, user: JwtPayload) {
    const channel = await this.prisma.channel.findFirst({
      where: { id: channelId, orgId: user.orgId },
    });
    if (!channel) throw new NotFoundException('Channel not found');

    const trimmed = content.trim();
    const message = await this.prisma.message.create({
      data: { channelId, senderId: user.sub, content: trimmed },
    });

    await this.prisma.channelParticipant.upsert({
      where: { channelId_userId: { channelId, userId: user.sub } },
      create: {
        channelId,
        userId: user.sub,
        lastReadMessageId: message.id,
        lastReadAt: message.createdAt,
      },
      update: {
        lastReadMessageId: message.id,
        lastReadAt: message.createdAt,
      },
    });

    const emp = user.employeeId
      ? await this.prisma.employee.findUnique({
          where: { id: user.employeeId },
          select: { firstName: true, lastName: true, avatarUrl: true },
        })
      : null;

    this.events.emitToOrg(user.orgId, 'message:new', {
      id: message.id,
      channelId,
      channelName: channel.name,
      content: trimmed,
      senderId: user.sub,
      senderName: emp ? `${emp.firstName} ${emp.lastName}` : user.email.split('@')[0],
      senderAvatar: emp?.avatarUrl ?? null,
      createdAt: message.createdAt.toISOString(),
      readBy: [],
    });

    return message;
  }

  async createChannel(name: string, isPrivate: boolean, user: JwtPayload) {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const channel = await this.prisma.channel.create({
      data: {
        orgId: user.orgId,
        name: slug,
        isPrivate,
        createdBy: user.sub,
      },
    });

    await this.prisma.channelParticipant.create({
      data: {
        channelId: channel.id,
        userId: user.sub,
        lastReadAt: channel.createdAt,
      },
    });

    this.events.emitToOrg(user.orgId, 'channel:created', {
      id: channel.id,
      name: channel.name,
      isPrivate: channel.isPrivate,
      createdBy: user.sub,
      createdAt: channel.createdAt.toISOString(),
    });

    return channel;
  }

  async markChannelRead(channelId: string, user: JwtPayload) {
    const channel = await this.prisma.channel.findFirst({
      where: { id: channelId, orgId: user.orgId },
      select: { id: true },
    });
    if (!channel) throw new NotFoundException('Channel not found');

    const lastMessage = await this.prisma.message.findFirst({
      where: { channelId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, createdAt: true },
    });

    if (!lastMessage) {
      return { ok: true, lastReadMessageId: null };
    }

    await this.prisma.channelParticipant.upsert({
      where: { channelId_userId: { channelId, userId: user.sub } },
      create: {
        channelId,
        userId: user.sub,
        lastReadMessageId: lastMessage.id,
        lastReadAt: lastMessage.createdAt,
      },
      update: {
        lastReadMessageId: lastMessage.id,
        lastReadAt: lastMessage.createdAt,
      },
    });

    const emp = user.employeeId
      ? await this.prisma.employee.findUnique({
          where: { id: user.employeeId },
          select: { firstName: true, lastName: true, avatarUrl: true },
        })
      : null;

    const payload = {
      channelId,
      lastReadMessageId: lastMessage.id,
      lastReadAt: lastMessage.createdAt.toISOString(),
      readerId: user.sub,
      readerName: emp ? `${emp.firstName} ${emp.lastName}` : user.email.split('@')[0],
      readerAvatar: emp?.avatarUrl ?? null,
    };

    this.events.emitToOrg(user.orgId, 'channel:read', payload);

    return { ok: true, ...payload };
  }

  async getChannelParticipants(channelId: string, user: JwtPayload) {
    const channel = await this.prisma.channel.findFirst({
      where: { id: channelId, orgId: user.orgId },
    });
    if (!channel) throw new NotFoundException('Channel not found');

    const participants = await this.prisma.channelParticipant.findMany({
      where: { channelId },
      include: {
        channel: true,
      },
    });

    const userIds = participants.map((p) => p.userId);
    const employees =
      userIds.length > 0
        ? await this.prisma.employee.findMany({
            where: { userId: { in: userIds }, orgId: user.orgId },
            select: { userId: true, firstName: true, lastName: true, avatarUrl: true, title: true },
          })
        : [];
    const empMap = new Map(employees.map((e) => [e.userId, e]));

    return participants.map((p) => {
      const emp = empMap.get(p.userId);
      return {
        userId: p.userId,
        name: emp ? `${emp.firstName} ${emp.lastName}` : 'Unknown',
        avatar: emp?.avatarUrl ?? null,
        title: emp?.title ?? null,
        joinedAt: p.joinedAt.toISOString(),
      };
    });
  }

  async initiateChannelCall(channelId: string, callType: 'audio' | 'video', user: JwtPayload) {
    const channel = await this.prisma.channel.findFirst({
      where: { id: channelId, orgId: user.orgId },
    });
    if (!channel) throw new NotFoundException('Channel not found');

    const call = await this.prisma.videoCall.create({
      data: {
        orgId: user.orgId,
        channelId,
        callType,
        initiatorId: user.sub,
        status: 'INITIATED',
      },
    });

    await this.prisma.callParticipant.create({
      data: {
        callId: call.id,
        userId: user.sub,
      },
    });

    const emp = user.employeeId
      ? await this.prisma.employee.findUnique({
          where: { id: user.employeeId },
          select: { firstName: true, lastName: true },
        })
      : null;

    const callerName = emp ? `${emp.firstName} ${emp.lastName}` : user.email.split('@')[0];

    this.events.server.to(`channel:${channelId}`).emit('call:initiated', {
      callId: call.id,
      channelId,
      channelName: channel.name,
      callType,
      initiatorId: user.sub,
      initiatorName: callerName,
      startedAt: call.createdAt.toISOString(),
    });

    return call;
  }

  async acceptCall(callId: string, user: JwtPayload) {
    const call = await this.prisma.videoCall.findFirst({
      where: {
        id: callId,
        orgId: user.orgId,
        channelId: { not: null },
      },
    });
    if (!call) throw new NotFoundException('Call not found');

    await this.prisma.callParticipant.upsert({
      where: { callId_userId: { callId, userId: user.sub } },
      create: { callId, userId: user.sub },
      update: {},
    });

    await this.prisma.videoCall.update({
      where: { id: callId },
      data: { status: 'ACCEPTED', startedAt: new Date() },
    });

    this.events.server.to(`channel:${call.channelId}`).emit('call:accepted', {
      callId,
      acceptedById: user.sub,
    });

    return { ok: true };
  }

  async endCall(callId: string, user: JwtPayload) {
    const call = await this.prisma.videoCall.findFirst({
      where: {
        id: callId,
        orgId: user.orgId,
      },
    });
    if (!call) throw new NotFoundException('Call not found');

    const durationSeconds = call.startedAt
      ? Math.floor((Date.now() - call.startedAt.getTime()) / 1000)
      : 0;

    await this.prisma.videoCall.update({
      where: { id: callId },
      data: {
        status: 'COMPLETED',
        endedAt: new Date(),
        durationSeconds,
      },
    });

    await this.prisma.callParticipant.update({
      where: { callId_userId: { callId, userId: user.sub } },
      data: { leftAt: new Date() },
    });

    if (call.channelId) {
      this.events.server.to(`channel:${call.channelId}`).emit('call:ended', {
        callId,
        endedBy: user.sub,
        durationSeconds,
      });
    } else if (call.conversationId) {
      const conversation = await this.prisma.directConversation.findFirst({
        where: { id: call.conversationId },
      });
      if (conversation) {
        const otherId = conversation.user1Id === user.sub ? conversation.user2Id : conversation.user1Id;
        this.events.emitToUser(otherId, 'call:ended', {
          callId,
          endedBy: user.sub,
          durationSeconds,
        });
      }
    }

    return { ok: true };
  }

  async getStats(user: JwtPayload) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [channelCount, messagesToday] = await Promise.all([
      this.prisma.channel.count({ where: { orgId: user.orgId } }),
      this.prisma.message.count({
        where: { channel: { orgId: user.orgId }, createdAt: { gte: today } },
      }),
    ]);

    return { channelCount, messagesToday };
  }
}
