"use server";

import { requireAuth } from "@/lib/session";
import { api } from "@/lib/api-client";

export async function getAIContext(): Promise<string> {
  await requireAuth();
  return api.get<string>("/ai-context");
}

export async function getInsightsData() {
  await requireAuth();
  return api.get<{
    overdueTasks: number;
    pendingTasks: number;
    annualLeaveRemaining: number | null;
    checkedIn: boolean;
  }>("/ai-context/insights");
}
