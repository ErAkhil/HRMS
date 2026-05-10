"use server";

import { db } from "@/lib/db";
import { requireAuth } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { toActionError } from "./utils";

export type ChannelItem = {
  id: string;
  name: string;
  isPrivate: boolean;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unread: number;
};

export type ChannelMessage = {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar: string | null;
  isMe: boolean;
  createdAt: string;
};

export async function getChannels(): Promise<ChannelItem[]> {
  const user = await requireAuth();

  try {
    const channels = await db.channel.findMany({
      where: { orgId: user.orgId },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return channels.map((ch) => ({
      id: ch.id,
      name: ch.name,
      isPrivate: ch.isPrivate,
      lastMessage: ch.messages[0]?.content ?? null,
      lastMessageAt: ch.messages[0]?.createdAt.toISOString() ?? null,
      unread: 0,
    }));
  } catch (err) {
    throw toActionError(err);
  }
}

export async function getChannelMessages(channelId: string): Promise<ChannelMessage[]> {
  const user = await requireAuth();

  try {
    const channel = await db.channel.findFirst({
      where: { id: channelId, orgId: user.orgId },
    });
    if (!channel) return [];

    const messages = await db.message.findMany({
      where: { channelId },
      orderBy: { createdAt: "asc" },
      take: 50,
    });

    const senderIds = [...new Set(messages.map((m) => m.senderId))];
    const employees = await db.employee.findMany({
      where: { userId: { in: senderIds }, orgId: user.orgId },
      select: { userId: true, firstName: true, lastName: true, avatarUrl: true },
    });
    const empMap = new Map(employees.map((e) => [e.userId!, e]));

    return messages.map((m) => {
      const emp = m.senderId ? empMap.get(m.senderId) : null;
      const senderName = emp ? `${emp.firstName} ${emp.lastName}` : "Unknown";
      return {
        id: m.id,
        content: m.content,
        senderId: m.senderId,
        senderName,
        senderAvatar: emp?.avatarUrl ?? null,
        isMe: m.senderId === user.id,
        createdAt: m.createdAt.toISOString(),
      };
    });
  } catch (err) {
    throw toActionError(err);
  }
}

export async function sendMessage(channelId: string, content: string) {
  const user = await requireAuth();

  const trimmed = content.trim();
  if (!trimmed) throw new Error("Message cannot be empty");

  try {
    const channel = await db.channel.findFirst({
      where: { id: channelId, orgId: user.orgId },
    });
    if (!channel) throw new Error("Channel not found");

    await db.message.create({
      data: {
        channelId,
        senderId: user.id,
        content: trimmed,
      },
    });

    revalidatePath("/collaboration/messages");
  } catch (err) {
    throw toActionError(err);
  }
}
