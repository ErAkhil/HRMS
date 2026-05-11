"use server";

import { requireAuth } from "@/lib/session";
import { api } from "@/lib/api-client";

export type LeaveEvent = {
  id: string;
  type: "leave";
  title: string;
  status: string;
  leaveType: string;
  startDate: string;
  endDate: string;
};

export type TaskEvent = {
  id: string;
  type: "task";
  title: string;
  status: string;
  priority: string;
  dueDate: string;
  assignee: string | null;
};

export type CalendarData = {
  leaveEvents: LeaveEvent[];
  taskEvents: TaskEvent[];
};

export type ReportsData = {
  totalEmployees: number;
  openJobs: number;
  deptData: { name: string; count: number }[];
  leaveMap: Record<string, number>;
  taskMap: Record<string, number>;
};

export async function getReportsData(): Promise<ReportsData> {
  await requireAuth();
  return api.get<ReportsData>("/reports");
}

export type LeaveCalendarEvent = {
  id: string;
  name: string;
  dept: string;
  leaveType: string;
  status: string;
  startDate: string;
  endDate: string;
  days: number;
};

export async function getLeaveCalendarEvents(month: number, year: number): Promise<LeaveCalendarEvent[]> {
  await requireAuth();
  return api.get<LeaveCalendarEvent[]>(`/reports/leave-calendar?month=${month}&year=${year}`);
}

export async function getCalendarData(month: number, year: number): Promise<CalendarData> {
  await requireAuth();
  return api.get<CalendarData>(`/reports/calendar?month=${month}&year=${year}`);
}

export type AnalyticsData = {
  hireAttrition: { month: string; hires: number; attrition: number }[];
  deptStats: { dept: string; headcount: number; openRoles: number }[];
};

export async function getAnalyticsData(): Promise<AnalyticsData> {
  await requireAuth();
  return api.get<AnalyticsData>("/reports/analytics");
}
