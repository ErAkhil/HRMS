"use server";

import { requireAuth } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { api } from "@/lib/api-client";

const sendMessageSchema = z.object({
  channelId: z.string(),
  content: z.string().min(1).max(2000),
});

export type Channel = {
  id: string;
  name: string;
  isPrivate: boolean;
  messageCount: number;
  lastMessage: string | null;
  lastMessageAt: string | null;
};

export type ChannelMessage = {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar: string | null;
  createdAt: string;
};

export async function getChannels(): Promise<Channel[]> {
  await requireAuth();
  return api.get<Channel[]>("/collaboration/channels");
}

export async function getChannelMessages(channelId: string): Promise<ChannelMessage[]> {
  await requireAuth();
  return api.get<ChannelMessage[]>(`/collaboration/channels/${channelId}/messages`);
}

export async function sendMessage(data: z.infer<typeof sendMessageSchema>) {
  await requireAuth();

  const parsed = sendMessageSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid data");

  const result = await api.post<unknown>("/collaboration/messages", parsed.data);
  revalidatePath("/collaboration");
  revalidatePath("/collaboration/messages");
  return result;
}

export async function createChannel(name: string, isPrivate = false) {
  await requireAuth();
  const result = await api.post<unknown>("/collaboration/channels", { name, isPrivate });
  revalidatePath("/collaboration");
  return result;
}

export async function getCollaborationStats() {
  await requireAuth();
  return api.get<{ channelCount: number; messagesToday: number }>("/collaboration/stats");
}
