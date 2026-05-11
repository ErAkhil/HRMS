"use server";

import { requireAuth } from "@/lib/session";
import { api } from "@/lib/api-client";

export type CelebrationItem = {
  id: string;
  name: string;
  avatarUrl: string | null;
  dept: string;
  label: string;
  yearsOfService: number;
  daysUntil: number;
};

export async function getUpcomingCelebrations(): Promise<CelebrationItem[]> {
  await requireAuth();
  return api.get<CelebrationItem[]>("/celebrations");
}
