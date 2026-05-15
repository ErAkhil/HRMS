"use server";

import { requireAuth } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { api } from "@/lib/api-client";

export type DmConversation = {
  id: string;
  otherUserId: string;
  otherUserName: string;
  otherUserAvatar: string | null;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
};

export type DmMessage = {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar: string | null;
  isMe: boolean;
  createdAt: string;
  readBy: Array<{
    userId: string;
    name: string;
    avatar: string | null;
    readAt: string;
  }>;
};

export type DmUser = {
  userId: string;
  name: string;
  avatar: string | null;
  jobTitle: string | null;
};

export async function getDmUsers(): Promise<DmUser[]> {
  await requireAuth();
  return api.get<DmUser[]>("/dm/users");
}

export async function getDmConversations(): Promise<DmConversation[]> {
  await requireAuth();
  return api.get<DmConversation[]>("/dm/conversations");
}

export async function getOrCreateConversation(targetUserId: string): Promise<{ id: string }> {
  await requireAuth();
  return api.post<{ id: string }>("/dm/conversations", { targetUserId });
}

export async function getDmMessages(conversationId: string): Promise<DmMessage[]> {
  await requireAuth();
  return api.get<DmMessage[]>(`/dm/conversations/${conversationId}/messages`);
}

export async function sendDmMessage(conversationId: string, content: string): Promise<DmMessage> {
  await requireAuth();
  const trimmed = content.trim();
  if (!trimmed) throw new Error("Message cannot be empty");
  const result = await api.post<DmMessage>("/dm/messages", { conversationId, content: trimmed });
  revalidatePath("/collaboration/messages");
  return result;
}

export async function markDmRead(conversationId: string): Promise<void> {
  await requireAuth();
  await api.patch<unknown>(`/dm/conversations/${conversationId}/read`);
}
