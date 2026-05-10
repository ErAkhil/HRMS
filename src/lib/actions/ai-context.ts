"use server";

import { requireAuth } from "@/lib/session";
import { db } from "@/lib/db";

const DONE_STATUSES = ["DONE", "CANCELLED"] as const;

export async function getAIContext(): Promise<string> {
  const user = await requireAuth();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [employee, tasks, leaveBalances, attendance] = await Promise.all([
    user.employeeId
      ? db.employee.findFirst({
          where: { id: user.employeeId, orgId: user.orgId },
          include: { department: { select: { name: true } } },
        })
      : null,
    user.employeeId
      ? db.task.findMany({
          where: { orgId: user.orgId, assigneeId: user.employeeId },
          select: { status: true, dueDate: true },
        })
      : [],
    user.employeeId
      ? db.leaveBalance.findMany({
          where: { employeeId: user.employeeId, employee: { orgId: user.orgId }, year: today.getFullYear() },
        })
      : [],
    user.employeeId
      ? db.attendanceRecord.findFirst({
          where: { employeeId: user.employeeId, employee: { orgId: user.orgId }, date: { gte: today } },
        })
      : null,
  ]);

  const pending = tasks.filter(
    (t) => t.status === "TODO" || t.status === "IN_PROGRESS"
  ).length;

  const overdue = tasks.filter(
    (t) =>
      t.dueDate &&
      new Date(t.dueDate) < new Date() &&
      !(DONE_STATUSES as readonly string[]).includes(t.status)
  ).length;

  const annualLeave = leaveBalances.find((b) => b.leaveType === "ANNUAL");

  const attendanceStatus = attendance
    ? attendance.checkOut
      ? "Checked out for the day"
      : "Currently checked in"
    : "Not checked in today";

  const deptName = employee?.department?.name ?? "Unknown";
  const fullName = employee
    ? `${employee.firstName} ${employee.lastName}`
    : (user.email ?? "User");

  return `Current user context:
- Name: ${fullName}
- Role: ${user.role}
- Organization: ${user.orgName} (Plan: ${user.plan})
- Department: ${deptName}

Today's live data (${today.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}):
- Attendance: ${attendanceStatus}
- Pending tasks: ${pending}
- Overdue tasks: ${overdue}
- Annual leave remaining: ${annualLeave ? `${annualLeave.total - annualLeave.used - annualLeave.pending} days` : "N/A"}`;
}

export async function getInsightsData() {
  const user = await requireAuth();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!user.employeeId) {
    return { overdueTasks: 0, pendingTasks: 0, annualLeaveRemaining: null as number | null, checkedIn: false };
  }

  const [tasks, leaveBalances, attendance] = await Promise.all([
    db.task.findMany({
      where: { orgId: user.orgId, assigneeId: user.employeeId },
      select: { status: true, dueDate: true },
    }),
    db.leaveBalance.findMany({
      where: { employeeId: user.employeeId, employee: { orgId: user.orgId }, year: today.getFullYear() },
    }),
    db.attendanceRecord.findFirst({
      where: { employeeId: user.employeeId, employee: { orgId: user.orgId }, date: { gte: today } },
    }),
  ]);

  const overdueTasks = tasks.filter(
    (t) =>
      t.dueDate &&
      new Date(t.dueDate) < new Date() &&
      !(DONE_STATUSES as readonly string[]).includes(t.status)
  ).length;

  const pendingTasks = tasks.filter(
    (t) => t.status === "TODO" || t.status === "IN_PROGRESS"
  ).length;

  const annual = leaveBalances.find((b) => b.leaveType === "ANNUAL");
  const annualLeaveRemaining = annual
    ? annual.total - annual.used - annual.pending
    : null;

  const checkedIn = !!attendance?.checkIn;

  return { overdueTasks, pendingTasks, annualLeaveRemaining, checkedIn };
}
