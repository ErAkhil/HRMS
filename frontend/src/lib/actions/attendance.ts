"use server";

import { requireAuth } from "@/lib/session";
import { revalidatePath } from "next/cache";
import type { AttendanceStatus } from "@/types/domain";
import { api } from "@/lib/api-client";

type AttendanceCoordinates = {
  latitude: number;
  longitude: number;
};

export type AttendanceRecord = {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  checkInLatitude: number | null;
  checkInLongitude: number | null;
  checkOutLatitude: number | null;
  checkOutLongitude: number | null;
  status: string;
  hoursWorked: number | null;
  employee: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    title: string;
    department: { name: string } | null;
  };
};

export type AttendanceStats = {
  total: number;
  present: number;
  late: number;
  onLeave: number;
  remote: number;
  absent: number;
  halfDay: number;
};

export async function getTodayAttendance(): Promise<AttendanceRecord[]> {
  await requireAuth();
  return api.get<AttendanceRecord[]>("/attendance/today");
}

export async function getAttendanceStats(): Promise<AttendanceStats> {
  await requireAuth();
  return api.get<AttendanceStats>("/attendance/stats");
}

export async function getMonthlyHeatmap(month: number, year: number) {
  await requireAuth();
  return api.get<{ day: number; pct: number }[]>(`/attendance/heatmap?month=${month}&year=${year}`);
}

export type DeptReport = {
  dept: string;
  employeeCount: number;
  presentPct: number;
  avgHours: number;
  latePct: number;
  remotePct: number;
};

export async function getDeptAttendanceReport(month: number, year: number): Promise<DeptReport[]> {
  await requireAuth();
  return api.get<DeptReport[]>(`/attendance/dept-report?month=${month}&year=${year}`);
}

export type MyTodayStatus = {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  checkInLatitude: number | null;
  checkInLongitude: number | null;
  checkOutLatitude: number | null;
  checkOutLongitude: number | null;
  status: string;
  hoursWorked: number | null;
} | null;

export async function getMyTodayStatus(): Promise<MyTodayStatus> {
  await requireAuth();
  return api.get<MyTodayStatus>("/attendance/me/status");
}

export async function getAttendanceSummary(month: number, year: number) {
  await requireAuth();
  return api.get<unknown[]>(`/attendance/summary?month=${month}&year=${year}`);
}

export async function checkIn(coords: AttendanceCoordinates) {
  await requireAuth();
  const result = await api.post<unknown>("/attendance/check-in", coords);
  revalidatePath("/attendance");
  return result;
}

export async function checkOut(coords: AttendanceCoordinates) {
  await requireAuth();
  const result = await api.post<unknown>("/attendance/check-out", coords);
  revalidatePath("/attendance");
  return result;
}

export async function backfillLocation(coords: AttendanceCoordinates) {
  await requireAuth();
  try {
    const result = await api.post<unknown>("/attendance/backfill-location", coords);
    revalidatePath("/attendance");
    revalidatePath("/dashboard");
    return result;
  } catch (error) {
    if (error instanceof Error && error.message.includes("404")) {
      return { success: false, skipped: true };
    }
    throw error;
  }
}

export async function updateAttendanceStatus(
  employeeId: string,
  date: Date,
  status: AttendanceStatus,
) {
  await requireAuth();
  await api.patch<unknown>("/attendance/status", {
    employeeId,
    date: date.toISOString(),
    status,
  });
  revalidatePath("/attendance");
}
