"use server";

import { db } from "@/lib/db";
import { requireAuth } from "@/lib/session";
import { toActionError } from "./utils";

export async function getManagerDashboardData() {
  const user = await requireAuth();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const employees = await db.employee.findMany({
      where: { orgId: user.orgId, isActive: true },
      include: {
        department: { select: { name: true } },
        attendance: {
          where: { date: { gte: today } },
          take: 1,
          orderBy: { date: "desc" },
        },
        leaveRequests: {
          where: {
            status: "APPROVED",
            startDate: { lte: today },
            endDate: { gte: today },
          },
          take: 1,
        },
      },
      orderBy: { firstName: "asc" },
      take: 50,
    });

    const teamMembers = employees.map((emp) => {
      const att = emp.attendance[0];
      const onLeave = emp.leaveRequests.length > 0;
      let status: string;
      let statusColor: string;
      let checkin: string;

      if (onLeave) {
        status = "On Leave";
        statusColor = "amber";
        checkin = "—";
      } else if (att?.status === "REMOTE") {
        status = "Remote";
        statusColor = "indigo";
        checkin = att.checkIn ? new Date(att.checkIn).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : "—";
      } else if (att?.status === "LATE") {
        status = "Late";
        statusColor = "rose";
        checkin = att.checkIn ? new Date(att.checkIn).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : "—";
      } else if (att?.checkIn) {
        status = "Present";
        statusColor = "emerald";
        checkin = new Date(att.checkIn).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
      } else {
        status = "Absent";
        statusColor = "rose";
        checkin = "—";
      }

      return {
        id: emp.id,
        name: `${emp.firstName} ${emp.lastName}`,
        avatarUrl: emp.avatarUrl,
        status,
        statusColor,
        checkin,
        department: emp.department?.name ?? "—",
      };
    });

    const presentCount = teamMembers.filter((m) => m.status === "Present" || m.status === "Remote").length;
    const onLeaveCount = teamMembers.filter((m) => m.status === "On Leave").length;
    const teamSize = teamMembers.length;
    const attendancePct = teamSize > 0 ? Math.round((presentCount / teamSize) * 100) : 0;

    const pendingLeave = await db.leaveRequest.count({
      where: { employee: { orgId: user.orgId }, status: "PENDING" },
    });

    const taskStats = await db.task.groupBy({
      by: ["status"],
      where: { orgId: user.orgId },
      _count: { status: true },
    });

    const taskMap: Record<string, number> = {};
    for (const t of taskStats) {
      taskMap[t.status] = t._count.status;
    }

    const overdueTasks = await db.task.count({
      where: {
        orgId: user.orgId,
        dueDate: { lt: today },
        status: { notIn: ["DONE"] },
      },
    });

    const pendingReviews = await db.performanceReview.count({
      where: {
        reviewee: { orgId: user.orgId },
        status: "PENDING",
      },
    });

    return {
      teamMembers,
      teamSize,
      presentCount,
      onLeaveCount,
      attendancePct,
      pendingLeave,
      taskMap,
      overdueTasks,
      pendingReviews,
    };
  } catch (err) {
    throw toActionError(err);
  }
}

export async function getLeadershipDashboardData() {
  const user = await requireAuth();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const [totalEmployees, departments, payrollRun, pendingLeave, openJobs, taskStats] = await Promise.all([
      db.employee.count({ where: { orgId: user.orgId, isActive: true } }),
      db.department.findMany({
        where: { org: { id: user.orgId } },
        include: {
          _count: { select: { employees: true } },
        },
      }),
      db.payrollRun.findFirst({
        where: { orgId: user.orgId },
        orderBy: { createdAt: "desc" },
      }),
      db.leaveRequest.count({
        where: { employee: { orgId: user.orgId }, status: "PENDING" },
      }),
      db.jobPosting.count({
        where: { orgId: user.orgId, isActive: true },
      }),
      db.task.groupBy({
        by: ["status"],
        where: { orgId: user.orgId },
        _count: { status: true },
      }),
    ]);

    const deptHealth = departments.map((d) => ({
      name: d.name,
      headcount: d._count.employees,
    }));

    const taskMap: Record<string, number> = {};
    for (const t of taskStats) {
      taskMap[t.status] = t._count.status;
    }

    const totalPayroll = payrollRun ? Number(payrollRun.totalGross) : 0;

    return {
      totalEmployees,
      deptHealth,
      totalPayroll,
      pendingLeave,
      openJobs,
      taskMap,
    };
  } catch (err) {
    throw toActionError(err);
  }
}
