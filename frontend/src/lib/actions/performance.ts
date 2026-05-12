"use server";

import { requireAuth, requireRole } from "@/lib/session";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { api } from "@/lib/api-client";

const goalSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.string().optional(),
});

const reviewCycleSchema = z.object({
  period: z.string().min(1),
  type: z.string().min(1),
});

export type SerializedGoal = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  progress: number;
  dueDate: string | null;
};

export type SerializedReview = {
  id: string;
  score: number | null;
  type: string;
  period: string;
  status: string;
  comments: string | null;
  completedAt: string | null;
  createdAt: string;
  reviewer: { firstName: string; lastName: string; title: string | null } | null;
};

export type OrgReview = {
  id: string;
  score: number | null;
  type: string;
  period: string;
  status: string;
  completedAt: string | null;
  createdAt: string;
  reviewee: { firstName: string; lastName: string; title: string | null; department: { name: string } | null };
  reviewer: { firstName: string; lastName: string };
};

export type TeamMemberScore = {
  id: string;
  name: string;
  avatarUrl: string | null;
  role: string;
  dept: string;
  score: number | null;
};

export type TeamGoalSummary = {
  id: string;
  title: string;
  dept: string;
  progress: number;
  status: string;
};

export type TeamPerformanceSummary = {
  teamMembers: TeamMemberScore[];
  topPerformers: TeamMemberScore[];
  teamGoals: TeamGoalSummary[];
  avgScore: number;
  onTrackGoals: number;
  totalGoals: number;
  completedReviews: number;
  totalReviews: number;
  distribution: { bucket: string; count: number }[];
  attentionEmployees: { name: string; score: number; dept: string }[];
};

export async function scheduleReview(data: { type: string; period: string; notes?: string }) {
  await requireAuth();
  await api.post<unknown>("/performance/reviews/self", data);
  revalidatePath("/performance");
}

export async function createReviewCycle(data: z.infer<typeof reviewCycleSchema>) {
  await requireRole("SUPER_ADMIN", "HR_ADMIN", "MANAGER");

  const parsed = reviewCycleSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid data");

  const result = await api.post<{ created: number }>("/performance/reviews", parsed.data);
  revalidatePath("/performance/reviews");
  return result;
}

export async function getMyGoals(): Promise<SerializedGoal[]> {
  await requireAuth();
  return api.get<SerializedGoal[]>("/performance/goals");
}

export async function createGoal(data: z.infer<typeof goalSchema>) {
  await requireAuth();

  const parsed = goalSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid data");

  const result = await api.post<unknown>("/performance/goals", parsed.data);
  revalidatePath("/performance");
  return result;
}

export async function updateGoalProgress(goalId: string, progress: number) {
  await requireAuth();
  await api.patch<unknown>(`/performance/goals/${goalId}/progress`, { progress });
  revalidatePath("/performance");
}

export async function getMyReviews(): Promise<SerializedReview[]> {
  await requireAuth();
  return api.get<SerializedReview[]>("/performance/reviews/me");
}

export async function getOrgReviews(): Promise<OrgReview[]> {
  await requireRole("SUPER_ADMIN", "HR_ADMIN", "MANAGER");
  return api.get<OrgReview[]>("/performance/reviews/org");
}

export async function getEmployeeReviews(employeeId: string): Promise<SerializedReview[]> {
  await requireAuth();
  return api.get<SerializedReview[]>(`/performance/reviews/employee/${employeeId}`);
}

export type PerformanceAnalytics = {
  departments: { name: string; headcount: number; avgScore: number; topPerformer: string }[];
  distribution: { label: string; range: string; count: number; pct: number; color: string }[];
  topPerformers: { id: string; name: string; avatarUrl: string | null; dept: string; score: number }[];
  companyAvg: number;
  reviewedCount: number;
};

export async function getPerformanceAnalytics(): Promise<PerformanceAnalytics | null> {
  await requireRole("SUPER_ADMIN", "HR_ADMIN", "MANAGER");
  return api.get<PerformanceAnalytics | null>("/performance/analytics");
}

export async function getTeamPerformanceSummary(): Promise<TeamPerformanceSummary> {
  await requireAuth();
  return api.get<TeamPerformanceSummary>("/performance/team-summary");
}
