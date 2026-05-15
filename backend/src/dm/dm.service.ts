import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
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
export class DmService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventsGateway,
  ) {}

  async listUsers(user: JwtPayload) {
    const employees = await this.prisma.employee.findMany({
      where: { orgId: user.orgId, userId: { not: user.sub } },
      select: { userId: true, firstName: true, lastName: true, avatarUrl: true, title: true },
      orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
    });
    return employees.map((e) => ({
      userId: e.userId,
      name: `${e.firstName} ${e.lastName}`,
      avatar: e.avatarUrl,
      jobTitle: e.title,
    }));
  }

  async getOrCreateConversation(targetUserId: string, user: JwtPayload) {
    const [u1, u2] = [user.sub, targetUserId].sort((a, b) => a.localeCompare(b));
    const convo = await this.prisma.directConversation.upsert({
      where: { user1Id_user2Id: { user1Id: u1, user2Id: u2 } },
      create: { orgId: user.orgId, user1Id: u1, user2Id: u2 },
      update: {},
    });
    return convo;
  }

  async getConversations(user: JwtPayload) {
    const convos = await this.prisma.directConversation.findMany({
      where: {
        orgId: user.orgId,
        OR: [{ user1Id: user.sub }, { user2Id: user.sub }],
      },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const otherUserIds = convos.map((c) => (c.user1Id === user.sub ? c.user2Id : c.user1Id));
    const employees =
      otherUserIds.length > 0
        ? await this.prisma.employee.findMany({
            where: { userId: { in: otherUserIds }, orgId: user.orgId },
            select: { userId: true, firstName: true, lastName: true, avatarUrl: true },
          })
        : [];
    const empMap = new Map(employees.map((e) => [e.userId, e]));

    const unreadGroups =
      convos.length > 0
        ? await this.prisma.directMessage.groupBy({
            by: ['conversationId'],
            where: {
              conversationId: { in: convos.map((c) => c.id) },
              senderId: { not: user.sub },
              readAt: null,
            },
            _count: { _all: true },
          })
        : [];
    const unreadCountMap = new Map(
      unreadGroups.map((group) => [group.conversationId, group._count._all]),
    );

    return convos.map((c) => {
      const otherId = c.user1Id === user.sub ? c.user2Id : c.user1Id;
      const emp = otherId ? empMap.get(otherId) : undefined;
      const last = c.messages[0];
      return {
        id: c.id,
        otherUserId: otherId,
        otherUserName: emp ? `${emp.firstName} ${emp.lastName}` : 'Unknown',
        otherUserAvatar: emp?.avatarUrl ?? null,
        lastMessage: last?.content ?? null,
        lastMessageAt: last?.createdAt.toISOString() ?? null,
        unreadCount: unreadCountMap.get(c.id) ?? 0,
      };
    });
  }

  async getMessages(conversationId: string, user: JwtPayload) {
    const convo = await this.prisma.directConversation.findFirst({
      where: {
        id: conversationId,
        orgId: user.orgId,
        OR: [{ user1Id: user.sub }, { user2Id: user.sub }],
      },
    });
    if (!convo) throw new NotFoundException('Conversation not found');

    const messages = await this.prisma.directMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      take: 100,
    });

    const senderIds = [...new Set(messages.map((m) => m.senderId))];
    const employees =
      senderIds.length > 0
        ? await this.prisma.employee.findMany({
            where: { userId: { in: senderIds }, orgId: user.orgId },
            select: { userId: true, firstName: true, lastName: true, avatarUrl: true },
          })
        : [];
    const empMap = new Map(employees.map((e) => [e.userId, e]));

    const otherUserId = convo.user1Id === user.sub ? convo.user2Id : convo.user1Id;
    const otherUserEmp = otherUserId
      ? await this.prisma.employee.findUnique({
          where: { userId: otherUserId },
          select: { userId: true, firstName: true, lastName: true, avatarUrl: true },
        })
      : null;

    return messages.map((m) => {
      const emp = empMap.get(m.senderId);
      const readBy: ReadReceipt[] = m.readAt && m.senderId === user.sub && otherUserEmp
        ? [{
            userId: otherUserEmp.userId,
            name: `${otherUserEmp.firstName} ${otherUserEmp.lastName}`,
            avatar: otherUserEmp.avatarUrl ?? null,
            readAt: m.readAt.toISOString(),
          }]
        : [];
      return {
        id: m.id,
        content: m.content,
        senderId: m.senderId,
        senderName: emp ? `${emp.firstName} ${emp.lastName}` : 'Unknown',
        senderAvatar: emp?.avatarUrl ?? null,
        isMe: m.senderId === user.sub,
        createdAt: m.createdAt.toISOString(),
        readBy,
      };
    });
  }

  async sendMessage(conversationId: string, content: string, user: JwtPayload) {
    const convo = await this.prisma.directConversation.findFirst({
      where: {
        id: conversationId,
        orgId: user.orgId,
        OR: [{ user1Id: user.sub }, { user2Id: user.sub }],
      },
    });
    if (!convo) throw new ForbiddenException('Not a participant');

    const trimmed = content.trim();
    const message = await this.prisma.directMessage.create({
      data: { conversationId, senderId: user.sub, content: trimmed },
    });

    const emp = user.employeeId
      ? await this.prisma.employee.findUnique({
          where: { id: user.employeeId },
          select: { firstName: true, lastName: true, avatarUrl: true },
        })
      : null;

    const otherId = convo.user1Id === user.sub ? convo.user2Id : convo.user1Id;

    const payload = {
      id: message.id,
      conversationId,
      content: trimmed,
      senderId: user.sub,
      senderName: emp ? `${emp.firstName} ${emp.lastName}` : user.email.split('@')[0],
      senderAvatar: emp?.avatarUrl ?? null,
      readAt: null,
      createdAt: message.createdAt.toISOString(),
    };

    this.events.emitToUser(otherId, 'dm:new', payload);

    return payload;
  }

  async markRead(conversationId: string, user: JwtPayload) {
    const convo = await this.prisma.directConversation.findFirst({
      where: {
        id: conversationId,
        orgId: user.orgId,
        OR: [{ user1Id: user.sub }, { user2Id: user.sub }],
      },
    });
    if (!convo) throw new ForbiddenException('Not a participant');

    await this.prisma.directMessage.updateMany({
      where: { conversationId, senderId: { not: user.sub }, readAt: null },
      data: { readAt: new Date() },
    });

    const lastReadMessage = await this.prisma.directMessage.findFirst({
      where: { conversationId, senderId: { not: user.sub } },
      orderBy: { createdAt: 'desc' },
      select: { id: true, createdAt: true },
    });

    const readerEmp = user.employeeId
      ? await this.prisma.employee.findUnique({
          where: { id: user.employeeId },
          select: { firstName: true, lastName: true, avatarUrl: true },
        })
      : null;

    const otherId = convo.user1Id === user.sub ? convo.user2Id : convo.user1Id;
    this.events.emitToUser(otherId, 'dm:read', {
      conversationId,
      readById: user.sub,
      lastReadMessageId: lastReadMessage?.id ?? null,
      readAt: lastReadMessage?.createdAt.toISOString() ?? null,
      readerName: readerEmp ? `${readerEmp.firstName} ${readerEmp.lastName}` : user.email.split('@')[0],
      readerAvatar: readerEmp?.avatarUrl ?? null,
    });

    return {
      ok: true,
      lastReadMessageId: lastReadMessage?.id ?? null,
    };
  }

  async initiateCall(conversationId: string, callType: 'audio' | 'video', user: JwtPayload) {
    const convo = await this.prisma.directConversation.findFirst({
      where: {
        id: conversationId,
        orgId: user.orgId,
        OR: [{ user1Id: user.sub }, { user2Id: user.sub }],
      },
    });
    if (!convo) throw new ForbiddenException('Not a participant');

    const call = await this.prisma.videoCall.create({
      data: {
        orgId: user.orgId,
        conversationId,
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
    const calleeId = convo.user1Id === user.sub ? convo.user2Id : convo.user1Id;

    this.events.emitToUser(calleeId, 'call:incoming', {
      callId: call.id,
      conversationId,
      callType,
      callerId: user.sub,
      callerName,
      startedAt: call.createdAt.toISOString(),
    });

    return call;
  }

  async acceptCall(callId: string, user: JwtPayload) {
    const call = await this.prisma.videoCall.findFirst({
      where: {
        id: callId,
        orgId: user.orgId,
        conversationId: { not: null },
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

    this.events.emitToUser(call.initiatorId, 'call:accepted', {
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

    const otherParticipant = await this.prisma.callParticipant.findFirst({
      where: { callId, userId: { not: user.sub } },
    });

    if (otherParticipant) {
      this.events.emitToUser(otherParticipant.userId, 'call:ended', {
        callId,
        endedBy: user.sub,
        durationSeconds,
      });
    }

    return { ok: true };
  }
}
