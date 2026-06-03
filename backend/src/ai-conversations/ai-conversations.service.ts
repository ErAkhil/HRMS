import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import type { Plan } from '@prisma/client';

const CONVERSATION_LIMITS: Record<Plan, number> = {
  BASIC: 0,
  PRO: 10,
  PRO_PLUS: 50,
  PRO_MAX: Infinity,
};

const MESSAGE_LIMITS: Record<Plan, number> = {
  BASIC: 20,
  PRO: 50,
  PRO_PLUS: 100,
  PRO_MAX: 200,
};

@Injectable()
export class AiConversationsService {
  constructor(private prisma: PrismaService) {}

  private getLimit(plan: Plan): number {
    return CONVERSATION_LIMITS[plan] ?? 0;
  }

  async listConversations(user: JwtPayload) {
    const limit = this.getLimit(user.plan);
    if (limit === 0) {
      throw new ForbiddenException('Chat history requires PRO plan or higher');
    }

    return this.prisma.aiConversation.findMany({
      where: { userId: user.sub, orgId: user.orgId },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { messages: true } },
      },
    });
  }

  async getConversation(id: string, user: JwtPayload) {
    const limit = this.getLimit(user.plan);
    if (limit === 0) {
      throw new ForbiddenException('Chat history requires PRO plan or higher');
    }

    const conv = await this.prisma.aiConversation.findFirst({
      where: { id, userId: user.sub, orgId: user.orgId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          select: { id: true, role: true, content: true, createdAt: true },
        },
      },
    });

    if (!conv) throw new NotFoundException('Conversation not found');
    return conv;
  }

  async createConversation(user: JwtPayload, title: string) {
    const limit = this.getLimit(user.plan);
    if (limit === 0) {
      throw new ForbiddenException('Chat history requires PRO plan or higher');
    }

    if (limit !== Infinity) {
      const count = await this.prisma.aiConversation.count({
        where: { userId: user.sub, orgId: user.orgId },
      });
      if (count >= limit) {
        // Delete the oldest to stay within limit
        const oldest = await this.prisma.aiConversation.findFirst({
          where: { userId: user.sub, orgId: user.orgId },
          orderBy: { updatedAt: 'asc' },
          select: { id: true },
        });
        if (oldest) {
          await this.prisma.aiConversation.delete({ where: { id: oldest.id } });
        }
      }
    }

    return this.prisma.aiConversation.create({
      data: { userId: user.sub, orgId: user.orgId, title },
      select: { id: true, title: true, createdAt: true, updatedAt: true },
    });
  }

  async appendMessages(
    conversationId: string,
    user: JwtPayload,
    messages: Array<{ role: string; content: string }>,
  ) {
    const limit = this.getLimit(user.plan);
    if (limit === 0) {
      throw new ForbiddenException('Chat history requires PRO plan or higher');
    }

    const conv = await this.prisma.aiConversation.findFirst({
      where: { id: conversationId, userId: user.sub, orgId: user.orgId },
    });
    if (!conv) throw new NotFoundException('Conversation not found');

    await this.prisma.aiMessage.createMany({
      data: messages.map((m) => ({
        conversationId,
        role: m.role,
        content: m.content,
      })),
    });

    await this.prisma.aiConversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });
  }

  async deleteConversation(id: string, user: JwtPayload) {
    const conv = await this.prisma.aiConversation.findFirst({
      where: { id, userId: user.sub, orgId: user.orgId },
    });
    if (!conv) throw new NotFoundException('Conversation not found');

    await this.prisma.aiConversation.delete({ where: { id } });
  }

  getPlanInfo(user: JwtPayload) {
    const limit = this.getLimit(user.plan);
    const msgLimit = MESSAGE_LIMITS[user.plan] ?? 30;
    return {
      plan: user.plan,
      historyEnabled: limit > 0,
      maxConversations: limit === Infinity ? null : limit,
      maxMessagesPerThread: msgLimit,
    };
  }
}
