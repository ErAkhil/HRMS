"use server";

import { api } from "@/lib/api-client";
import { requireAuth, requireRole } from "@/lib/session";
import { revalidatePath } from "next/cache";
import type { ShiftType } from "@/types/domain";

export type ShiftDay = {
  date: string;
  dayName: string;
  label: string;
};

export type ShiftScheduleEmployee = {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  avatarUrl: string | null;
  department: { name: string } | null;
  assignments: Partial<Record<string, ShiftType>>;
};

export type WeeklyShiftSchedule = {
  weekStart: string;
  weekEnd: string;
  days: ShiftDay[];
  employees: ShiftScheduleEmployee[];
};

export async function getWeeklyShiftSchedule(startDate?: string): Promise<WeeklyShiftSchedule> {
  await requireRole("SUPER_ADMIN", "HR_ADMIN", "MANAGER");
  const query = startDate ? `?startDate=${encodeURIComponent(startDate)}` : "";
  return api.get<WeeklyShiftSchedule>(`/attendance/shifts/week${query}`);
}

export async function getMyWeeklyShiftSchedule(startDate?: string): Promise<WeeklyShiftSchedule> {
  await requireAuth();
  const query = startDate ? `?startDate=${encodeURIComponent(startDate)}` : "";
  return api.get<WeeklyShiftSchedule>(`/attendance/shifts/me/week${query}`);
}

export async function upsertShiftAssignment(data: {
  employeeId: string;
  date: string;
  shiftType: ShiftType;
  notes?: string;
}) {
  await requireRole("SUPER_ADMIN", "HR_ADMIN", "MANAGER");
  const result = await api.patch<{ success: boolean }>("/attendance/shifts/assignment", data);
  revalidatePath("/attendance/scheduling");
  return result;
}

export async function clearShiftAssignment(data: { employeeId: string; date: string }) {
  await requireRole("SUPER_ADMIN", "HR_ADMIN", "MANAGER");
  const result = await api.post<{ success: boolean; deleted: boolean }>("/attendance/shifts/assignment/clear", data);
  revalidatePath("/attendance/scheduling");
  return result;
}

export async function bulkAssignShifts(data: {
  employeeIds: string[];
  dates: string[];
  shiftType: ShiftType;
  notes?: string;
}) {
  await requireRole("SUPER_ADMIN", "HR_ADMIN", "MANAGER");
  const result = await api.post<{ success: boolean; updated: number; skippedConflicts: number }>("/attendance/shifts/bulk-assignment", data);
  revalidatePath("/attendance/scheduling");
  return result;
}

export async function copyPreviousWeekSchedule(startDate?: string) {
  await requireRole("SUPER_ADMIN", "HR_ADMIN", "MANAGER");
  const result = await api.post<{ success: boolean; copied: number; skippedConflicts: number }>(
    "/attendance/shifts/copy-previous-week",
    { startDate },
  );
  revalidatePath("/attendance/scheduling");
  return result;
}
