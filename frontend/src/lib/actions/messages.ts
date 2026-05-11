"use server";

import { requireAuth } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { api } from "@/lib/api-client";

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
  await requireAuth();
  return api.get<ChannelItem[]>("/collaboration/channels");
}

export async function getChannelMessages(channelId: string): Promise<ChannelMessage[]> {
  await requireAuth();
  return api.get<ChannelMessage[]>(`/collaboration/channels/${channelId}/messages`);
}

export async function sendMessage(channelId: string, content: string) {
  await requireAuth();

  const trimmed = content.trim();
  if (!trimmed) throw new Error("Message cannot be empty");

  await api.post<unknown>("/collaboration/messages", { channelId, content: trimmed });
  revalidatePath("/collaboration/messages");
}
