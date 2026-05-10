"use server";

import { db } from "@/lib/db";
import { requireAuth } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { toActionError } from "./utils";

export async function getChannels() {
  const user = await requireAuth();

  try {
    const channels = await db.channel.findMany({
      where: { orgId: user.orgId },
      include: {
        _count: { select: { messages: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { content: true, createdAt: true, senderId: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return channels.map((ch) => ({
      id: ch.id,
      name: ch.name,
      isPrivate: ch.isPrivate,
      messageCount: ch._count.messages,
      lastMessage: ch.messages[0]?.content ?? null,
      lastMessageAt: ch.messages[0]?.createdAt ?? null,
    }));
  } catch (err) {
    throw toActionError(err);
  }
}

export async function getChannelMessages(channelId: string) {
  const user = await requireAuth();

  try {
    const channel = await db.channel.findUnique({
      where: { id: channelId },
      select: { orgId: true },
    });

    if (!channel || channel.orgId !== user.orgId) throw new Error("Not found");

    return await db.message.findMany({
      where: { channelId },
      orderBy: { createdAt: "asc" },
      take: 50,
    });
  } catch (err) {
    throw toActionError(err);
  }
}

const sendMessageSchema = z.object({
  channelId: z.string(),
  content: z.string().min(1).max(2000),
});

export async function sendMessage(data: z.infer<typeof sendMessageSchema>) {
  const user = await requireAuth();

  const parsed = sendMessageSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid data");

  try {
    const channel = await db.channel.findUnique({
      where: { id: parsed.data.channelId },
      select: { orgId: true },
    });

    if (!channel || channel.orgId !== user.orgId) throw new Error("Not found");

    const message = await db.message.create({
      data: {
        channelId: parsed.data.channelId,
        senderId: user.id,
        content: parsed.data.content,
      },
    });

    revalidatePath("/collaboration");
    revalidatePath("/collaboration/messages");
    return message;
  } catch (err) {
    throw toActionError(err);
  }
}

export async function createChannel(name: string, isPrivate = false) {
  const user = await requireAuth();

  try {
    const channel = await db.channel.upsert({
      where: { name_orgId: { name: name.toLowerCase().replace(/\s+/g, "-"), orgId: user.orgId } },
      create: {
        orgId: user.orgId,
        name: name.toLowerCase().replace(/\s+/g, "-"),
        isPrivate,
      },
      update: {},
    });

    revalidatePath("/collaboration");
    return channel;
  } catch (err) {
    throw toActionError(err);
  }
}

export async function getCollaborationStats() {
  const user = await requireAuth();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const [channelCount, messagesToday] = await Promise.all([
      db.channel.count({ where: { orgId: user.orgId } }),
      db.message.count({
        where: {
          channel: { orgId: user.orgId },
          createdAt: { gte: today },
        },
      }),
    ]);

    return { channelCount, messagesToday };
  } catch (err) {
    throw toActionError(err);
  }
}
