import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../events/events.gateway';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

@Injectable()
export class DmService {
  constructor(
    private prisma: PrismaService,
    private events: EventsGateway,
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
    const [u1, u2] = [user.sub, targetUserId].sort();
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

    const unreadCounts = await Promise.all(
      convos.map((c) =>
        this.prisma.directMessage.count({
          where: { conversationId: c.id, senderId: { not: user.sub }, readAt: null },
        }),
      ),
    );

    return convos.map((c, i) => {
      const otherId = c.user1Id === user.sub ? c.user2Id : c.user1Id;
      const emp = empMap.get(otherId ?? '');
      const last = c.messages[0];
      return {
        id: c.id,
        otherUserId: otherId,
        otherUserName: emp ? `${emp.firstName} ${emp.lastName}` : 'Unknown',
        otherUserAvatar: emp?.avatarUrl ?? null,
        lastMessage: last?.content ?? null,
        lastMessageAt: last?.createdAt.toISOString() ?? null,
        unreadCount: unreadCounts[i],
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

    return messages.map((m) => {
      const emp = empMap.get(m.senderId);
      return {
        id: m.id,
        content: m.content,
        senderId: m.senderId,
        senderName: emp ? `${emp.firstName} ${emp.lastName}` : 'Unknown',
        senderAvatar: emp?.avatarUrl ?? null,
        isMe: m.senderId === user.sub,
        readAt: m.readAt?.toISOString() ?? null,
        createdAt: m.createdAt.toISOString(),
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

    const otherId = convo.user1Id === user.sub ? convo.user2Id : convo.user1Id;
    this.events.emitToUser(otherId, 'dm:read', { conversationId, readById: user.sub });

    return { ok: true };
  }
}
