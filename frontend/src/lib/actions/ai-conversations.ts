"use server";

import { requireAuth } from "@/lib/session";
import { api } from "@/lib/api-client";

export type AiConversationSummary = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  _count: { messages: number };
};

export type AiConversationDetail = AiConversationSummary & {
  messages: Array<{ id: string; role: string; content: string; createdAt: string }>;
};

export type AiPlanInfo = {
  plan: string;
  historyEnabled: boolean;
  maxConversations: number | null;
  maxMessagesPerThread: number;
};

export async function getAiPlanInfo(): Promise<AiPlanInfo> {
  await requireAuth();
  return api.get<AiPlanInfo>("/ai-conversations/plan-info");
}

export async function listAiConversations(): Promise<AiConversationSummary[]> {
  await requireAuth();
  return api.get<AiConversationSummary[]>("/ai-conversations");
}

export async function getAiConversation(id: string): Promise<AiConversationDetail> {
  await requireAuth();
  return api.get<AiConversationDetail>(`/ai-conversations/${id}`);
}

export async function createAiConversation(title: string): Promise<AiConversationSummary> {
  await requireAuth();
  return api.post<AiConversationSummary>("/ai-conversations", { title });
}

export async function appendAiMessages(
  conversationId: string,
  messages: Array<{ role: string; content: string }>,
): Promise<void> {
  await requireAuth();
  await api.post(`/ai-conversations/${conversationId}/messages`, { messages });
}

export async function deleteAiConversation(id: string): Promise<void> {
  await requireAuth();
  await api.delete(`/ai-conversations/${id}`);
}
