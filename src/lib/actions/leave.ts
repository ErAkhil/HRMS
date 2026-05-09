"use server";

import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/session";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "./audit";

const leaveRequestSchema = z.object({
  leaveType: z.enum(["ANNUAL", "SICK", "CASUAL", "MATERNITY", "PATERNITY", "UNPAID", "OTHER"]),
  startDate: z.string(),
  endDate: z.string(),
  reason: z.string().min(5),
});

export async function getMyLeaveBalances() {
  const user = await requireAuth();
  if (!user.employeeId) return [];

  return db.leaveBalance.findMany({
    where: { employeeId: user.employeeId, year: new Date().getFullYear() },
  });
}

export async function getLeaveRequests(status?: string) {
  const user = await requireAuth();

  const where: Record<string, unknown> = {
    employee: { orgId: user.orgId },
  };

  if (["EMPLOYEE"].includes(user.role) && user.employeeId) {
    where.employeeId = user.employeeId;
  }

  if (status && status !== "All") {
    where.status = status;
  }

  return db.leaveRequest.findMany({
    where,
    include: {
      employee: {
        select: {
          firstName: true,
          lastName: true,
          avatarUrl: true,
          department: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function applyLeave(data: z.infer<typeof leaveRequestSchema>) {
  const user = await requireAuth();
  if (!user.employeeId) throw new Error("No employee profile");

  const parsed = leaveRequestSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid data");

  const start = new Date(parsed.data.startDate);
  const end = new Date(parsed.data.endDate);
  const days =
    Math.ceil((end.getTime() - start.getTime()) / 86_400_000) + 1;

  const balance = await db.leaveBalance.findUnique({
    where: {
      employeeId_leaveType_year: {
        employeeId: user.employeeId,
        leaveType: parsed.data.leaveType,
        year: start.getFullYear(),
      },
    },
  });

  if (balance && balance.total - balance.used - balance.pending < days) {
    throw new Error("Insufficient leave balance");
  }

  const request = await db.leaveRequest.create({
    data: {
      employeeId: user.employeeId,
      leaveType: parsed.data.leaveType,
      startDate: start,
      endDate: end,
      days,
      reason: parsed.data.reason,
    },
  });

  if (balance) {
    await db.leaveBalance.update({
      where: { id: balance.id },
      data: { pending: { increment: days } },
    });
  }

  revalidatePath("/leave");
  revalidatePath("/leave/calendar");
  revalidatePath("/calendar");
  return request;
}

export async function approveLeave(requestId: string) {
  const user = await requireRole("SUPER_ADMIN", "HR_ADMIN", "MANAGER");

  const request = await db.leaveRequest.update({
    where: { id: requestId },
    data: { status: "APPROVED", approvedBy: user.id, approvedAt: new Date() },
  });

  await db.leaveBalance.updateMany({
    where: {
      employeeId: request.employeeId,
      leaveType: request.leaveType,
      year: request.startDate.getFullYear(),
    },
    data: {
      used: { increment: request.days },
      pending: { decrement: request.days },
    },
  });

  await createAuditLog({
    action: "leave.approved",
    resource: `Leave Request ${requestId}`,
    details: `Approved ${request.days} day(s) of ${request.leaveType}`,
  });

  revalidatePath("/leave");
  revalidatePath("/leave/calendar");
  revalidatePath("/leave/approvals");
  revalidatePath("/calendar");
  return request;
}

export async function rejectLeave(requestId: string, reason?: string) {
  const user = await requireRole("SUPER_ADMIN", "HR_ADMIN", "MANAGER");

  const request = await db.leaveRequest.update({
    where: { id: requestId },
    data: { status: "REJECTED", approvedBy: user.id, approvedAt: new Date() },
  });

  await db.leaveBalance.updateMany({
    where: {
      employeeId: request.employeeId,
      leaveType: request.leaveType,
      year: request.startDate.getFullYear(),
    },
    data: { pending: { decrement: request.days } },
  });

  revalidatePath("/leave");
  revalidatePath("/leave/calendar");
  revalidatePath("/leave/approvals");
  revalidatePath("/calendar");
  return request;
}
