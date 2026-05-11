"use server";

import { requireAuth, requireRole } from "@/lib/session";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { api } from "@/lib/api-client";

export type SerializedLeaveBalance = {
  id: string;
  employeeId: string;
  leaveType: string;
  year: number;
  total: number;
  used: number;
  pending: number;
  updatedAt: string;
};

export type SerializedLeaveRequest = {
  id: string;
  employeeId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: string;
  approvedBy: string | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  employee: {
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    department: { name: string } | null;
  };
};

const leaveRequestSchema = z.object({
  leaveType: z.enum(["ANNUAL", "SICK", "CASUAL", "MATERNITY", "PATERNITY", "UNPAID", "OTHER"]),
  startDate: z.string(),
  endDate: z.string(),
  reason: z.string().min(5),
});

export async function getMyLeaveBalances(): Promise<SerializedLeaveBalance[]> {
  await requireAuth();
  return api.get<SerializedLeaveBalance[]>("/leave/balances");
}

export async function getLeaveRequests(status?: string): Promise<SerializedLeaveRequest[]> {
  await requireAuth();
  const qs = status && status !== "All" ? `?status=${status}` : "";
  return api.get<SerializedLeaveRequest[]>(`/leave/requests${qs}`);
}

export async function applyLeave(data: z.infer<typeof leaveRequestSchema>) {
  await requireAuth();

  const parsed = leaveRequestSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid data");

  const result = await api.post<unknown>("/leave/requests", parsed.data);
  revalidatePath("/leave");
  revalidatePath("/leave/calendar");
  revalidatePath("/calendar");
  return result;
}

export async function approveLeave(requestId: string) {
  await requireRole("SUPER_ADMIN", "HR_ADMIN", "MANAGER");
  const result = await api.patch<unknown>(`/leave/requests/${requestId}/approve`);
  revalidatePath("/leave");
  revalidatePath("/leave/calendar");
  revalidatePath("/leave/approvals");
  revalidatePath("/calendar");
  return result;
}

export async function rejectLeave(requestId: string, reason?: string) {
  await requireRole("SUPER_ADMIN", "HR_ADMIN", "MANAGER");
  const result = await api.patch<unknown>(`/leave/requests/${requestId}/reject`, reason ? { reason } : undefined);
  revalidatePath("/leave");
  revalidatePath("/leave/calendar");
  revalidatePath("/leave/approvals");
  revalidatePath("/calendar");
  return result;
}
