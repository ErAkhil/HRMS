import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../events/events.gateway';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

@Injectable()
export class CollaborationService {
  constructor(
    private prisma: PrismaService,
    private events: EventsGateway,
  ) {}

  async getChannels(user: JwtPayload) {
    const channels = await this.prisma.channel.findMany({
      where: { orgId: user.orgId },
      include: {
        _count: { select: { messages: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return channels.map((ch) => ({
      id: ch.id,
      name: ch.name,
      isPrivate: ch.isPrivate,
      messageCount: ch._count.messages,
      lastMessage: ch.messages[0]?.content ?? null,
      lastMessageAt: ch.messages[0]?.createdAt.toISOString() ?? null,
      unread: 0,
    }));
  }

  async getChannelMessages(channelId: string, user: JwtPayload) {
    const channel = await this.prisma.channel.findFirst({
      where: { id: channelId, orgId: user.orgId },
    });
    if (!channel) throw new NotFoundException('Channel not found');

    const messages = await this.prisma.message.findMany({
      where: { channelId },
      orderBy: { createdAt: 'asc' },
      take: 50,
    });

    const senderIds = [...new Set(messages.map((m) => m.senderId).filter(Boolean))];
    const employees =
      senderIds.length > 0
        ? await this.prisma.employee.findMany({
            where: { userId: { in: senderIds as string[] }, orgId: user.orgId },
            select: { userId: true, firstName: true, lastName: true, avatarUrl: true },
          })
        : [];
    type EmpRow = { userId: string | null; firstName: string; lastName: string; avatarUrl: string | null };
    const empMap = new Map<string, EmpRow>(employees.map((e) => [e.userId!, e]));

    return messages.map((m) => {
      const emp = m.senderId ? empMap.get(m.senderId) : null;
      return {
        id: m.id,
        content: m.content,
        senderId: m.senderId,
        senderName: emp ? `${emp.firstName} ${emp.lastName}` : 'Unknown',
        senderAvatar: emp?.avatarUrl ?? null,
        isMe: m.senderId === user.sub,
        createdAt: m.createdAt.toISOString(),
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
    });

    return message;
  }

  async createChannel(name: string, isPrivate: boolean, user: JwtPayload) {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    return this.prisma.channel.upsert({
      where: { name_orgId: { name: slug, orgId: user.orgId } },
      create: { orgId: user.orgId, name: slug, isPrivate },
      update: {},
    });
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
