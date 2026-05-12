"use server";

import { requireAuth, requireRole } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { api } from "@/lib/api-client";

export type OnboardingRecord = {
  id: string;
  employeeId: string;
  name: string;
  avatarUrl: string | null;
  role: string;
  department: string;
  startDate: string;
  progress: number;
  pendingTasks: number;
  daysRemaining: number | null;
  status: string;
};

export async function getOnboardingRecords(): Promise<OnboardingRecord[]> {
  await requireAuth();
  return api.get<OnboardingRecord[]>("/onboarding");
}

export async function getOnboardingStats() {
  await requireAuth();
  return api.get<{
    inProgress: number;
    completedThisMonth: number;
    completingThisWeek: number;
  }>("/onboarding/stats");
}

export type OffboardingRecord = {
  id: string;
  name: string;
  avatarUrl: string | null;
  role: string;
  department: string;
  lastDay: string;
  reason: string;
  tasks: { label: string; done: boolean }[];
};

export type OffboardingStats = {
  exitingThisMonth: number;
  assetsPending: number;
  exitInterviews: number;
  completed: number;
};

export async function getOffboardingRecords(): Promise<OffboardingRecord[]> {
  await requireRole("SUPER_ADMIN", "HR_ADMIN", "MANAGER");
  return api.get<OffboardingRecord[]>("/onboarding/offboarding");
}

export async function getOffboardingStats(): Promise<OffboardingStats> {
  await requireRole("SUPER_ADMIN", "HR_ADMIN", "MANAGER");
  return api.get<OffboardingStats>("/onboarding/offboarding/stats");
}

export type ActiveEmployee = { id: string; firstName: string; lastName: string; title: string };

export async function getActiveEmployees(): Promise<ActiveEmployee[]> {
  await requireRole("SUPER_ADMIN", "HR_ADMIN", "MANAGER");
  return api.get<ActiveEmployee[]>("/onboarding/offboarding/active-employees");
}

export async function initiateOffboarding(data: { employeeId: string; lastWorkingDay: string; reason?: string }) {
  await requireRole("SUPER_ADMIN", "HR_ADMIN", "MANAGER");
  if (!data.employeeId || !data.lastWorkingDay) throw new Error("Employee and last working day are required");
  await api.post<unknown>("/onboarding/offboarding", data);
  revalidatePath("/onboarding/offboarding");
}

export async function sendOffboardingReminder(employeeId: string) {
  await requireRole("SUPER_ADMIN", "HR_ADMIN", "MANAGER");
  return api.post<{ success: boolean; name: string }>(`/onboarding/offboarding/${employeeId}/remind`, {});
}

const createOnboardingSchema = z.object({
  employeeId: z.string(),
  startDate: z.string(),
  dueDate: z.string().optional(),
});

export async function createOnboarding(data: z.infer<typeof createOnboardingSchema>) {
  await requireRole("SUPER_ADMIN", "HR_ADMIN", "MANAGER");

  const parsed = createOnboardingSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid data");

  await api.post<unknown>("/onboarding", parsed.data);
  revalidatePath("/onboarding");
}
