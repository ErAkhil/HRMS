"use server";

import { requireAuth } from "@/lib/session";
import { api } from "@/lib/api-client";

type TeamMember = {
  id: string;
  name: string;
  avatarUrl: string | null;
  status: string;
  statusColor: string;
  checkin: string;
  department: string;
};

export type ManagerDashboardData = {
  teamMembers: TeamMember[];
  teamSize: number;
  presentCount: number;
  onLeaveCount: number;
  attendancePct: number;
  pendingLeave: number;
  taskMap: Record<string, number>;
  overdueTasks: number;
  pendingReviews: number;
};

type DeptHealth = { name: string; headcount: number };

export type LeadershipDashboardData = {
  totalEmployees: number;
  deptHealth: DeptHealth[];
  totalPayroll: number;
  pendingLeave: number;
  openJobs: number;
  taskMap: Record<string, number>;
};

type PendingLeaveItem = {
  id: string;
  employeeName: string;
  days: number;
  leaveType: string;
  startDate: string;
};

type JobPosting = {
  id: string;
  title: string;
  department: string;
  candidateCount: number;
  type: string;
};

type OnboardingEntry = {
  id: string;
  name: string;
  department: string;
  progress: number;
  day: number;
};

type DeptHeadcount = { dept: string; count: number };

export type HrDashboardData = {
  userName: string;
  attendance: { present: number; late: number; onLeave: number; remote: number };
  pendingLeaveCount: number;
  pendingReviewsCount: number;
  openJobsCount: number;
  headcount: number;
  pendingLeaveItems: PendingLeaveItem[];
  jobPostings: JobPosting[];
  onboarding: OnboardingEntry[];
  deptHeadcount: DeptHeadcount[];
};

export async function getManagerDashboardData(): Promise<ManagerDashboardData> {
  await requireAuth();
  return api.get<ManagerDashboardData>("/dashboard/manager");
}

export async function getLeadershipDashboardData(): Promise<LeadershipDashboardData> {
  await requireAuth();
  return api.get<LeadershipDashboardData>("/dashboard/leadership");
}

export async function getHrDashboardData(): Promise<HrDashboardData> {
  await requireAuth();
  return api.get<HrDashboardData>("/dashboard/hr");
}
