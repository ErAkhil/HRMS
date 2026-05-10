"use server";

import { db } from "@/lib/db";
import { requireAuth } from "@/lib/session";
import { toActionError } from "./utils";

export async function getReportsData() {
  const user = await requireAuth();

  try {
    const [
      totalEmployees,
      departments,
      openJobs,
      leaveStats,
      taskStats,
    ] = await Promise.all([
      db.employee.count({ where: { orgId: user.orgId, isActive: true } }),
      db.department.findMany({
        where: { org: { id: user.orgId } },
        include: { _count: { select: { employees: true } } },
        orderBy: { name: "asc" },
      }),
      db.jobPosting.count({ where: { orgId: user.orgId, isActive: true } }),
      db.leaveRequest.groupBy({
        by: ["status"],
        where: { employee: { orgId: user.orgId } },
        _count: { status: true },
      }),
      db.task.groupBy({
        by: ["status"],
        where: { orgId: user.orgId },
        _count: { status: true },
      }),
    ]);

    const leaveMap: Record<string, number> = {};
    for (const l of leaveStats) {
      leaveMap[l.status] = l._count.status;
    }

    const taskMap: Record<string, number> = {};
    for (const t of taskStats) {
      taskMap[t.status] = t._count.status;
    }

    const deptData = departments.map((d) => ({
      name: d.name,
      count: d._count.employees,
    }));

    return {
      totalEmployees,
      openJobs,
      deptData,
      leaveMap,
      taskMap,
    };
  } catch (err) {
    throw toActionError(err);
  }
}

export async function getLeaveCalendarEvents(month: number, year: number) {
  const user = await requireAuth();

  // Use UTC to avoid timezone-offset shifting the date range on the server
  const startDate = new Date(Date.UTC(year, month, 1));
  const endDate = new Date(Date.UTC(year, month + 1, 0));

  try {
    const leaves = await db.leaveRequest.findMany({
      where: {
        employee: { orgId: user.orgId },
        status: { in: ["APPROVED", "PENDING", "REJECTED"] },
        startDate: { lte: endDate },
        endDate: { gte: startDate },
      },
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            department: { select: { name: true } },
          },
        },
      },
      orderBy: { startDate: "asc" },
    });

    return leaves.map((l) => ({
      id: l.id,
      name: `${l.employee.firstName} ${l.employee.lastName.charAt(0)}.`,
      dept: l.employee.department?.name ?? "—",
      leaveType: l.leaveType,
      status: l.status,
      startDate: l.startDate.toISOString(),
      endDate: l.endDate.toISOString(),
      days: l.days,
    }));
  } catch (err) {
    throw toActionError(err);
  }
}

export async function getCalendarData(month: number, year: number) {
  const user = await requireAuth();

  // Use UTC to avoid timezone-offset shifting the date range on the server
  const startDate = new Date(Date.UTC(year, month, 1));
  const endDate = new Date(Date.UTC(year, month + 1, 0));

  try {
    const [leaves, tasks] = await Promise.all([
      db.leaveRequest.findMany({
        where: {
          employee: { orgId: user.orgId },
          status: { in: ["APPROVED", "PENDING", "REJECTED"] },
          startDate: { lte: endDate },
          endDate: { gte: startDate },
        },
        include: { employee: { select: { firstName: true, lastName: true } } },
        orderBy: { startDate: "asc" },
      }),
      db.task.findMany({
        where: {
          orgId: user.orgId,
          dueDate: { gte: startDate, lte: endDate },
          status: { not: "DONE" },
        },
        include: { assignee: { select: { firstName: true, lastName: true } } },
        orderBy: { dueDate: "asc" },
      }),
    ]);

    const leaveEvents = leaves.map((l) => ({
      id: l.id,
      type: "leave" as const,
      title: `${l.employee.firstName} ${l.employee.lastName.charAt(0)}.`,
      status: l.status,
      leaveType: l.leaveType as string,
      startDate: l.startDate.toISOString(),
      endDate: l.endDate.toISOString(),
    }));

    const taskEvents = tasks.map((t) => ({
      id: t.id,
      type: "task" as const,
      title: t.title,
      status: t.status as string,
      priority: t.priority as string,
      dueDate: t.dueDate?.toISOString() ?? "",
      assignee: t.assignee ? `${t.assignee.firstName} ${t.assignee.lastName.charAt(0)}.` : null,
    }));

    return { leaveEvents, taskEvents };
  } catch (err) {
    throw toActionError(err);
  }
}
