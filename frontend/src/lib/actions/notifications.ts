"use server";

import { requireAuth } from "@/lib/session";
import { api } from "@/lib/api-client";

export type NotificationItem = {
  id: string;
  type: "leave" | "task" | "performance" | "onboarding" | "payroll";
  title: string;
  description: string;
  time: string;
  read: boolean;
  href: string;
};

export async function getNotifications(): Promise<NotificationItem[]> {
  await requireAuth();
  return api.get<NotificationItem[]>("/notifications");
}
