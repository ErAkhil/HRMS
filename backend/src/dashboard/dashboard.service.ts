import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getManagerData(user: JwtPayload) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [employees, pendingLeave, taskStats, overdueTasks, pendingReviews] =
      await Promise.all([
        this.prisma.employee.findMany({
          where: { orgId: user.orgId, isActive: true },
          include: {
            department: { select: { name: true } },
            attendance: {
              where: { date: { gte: today } },
              take: 1,
              orderBy: { date: 'desc' },
            },
            leaveRequests: {
              where: {
                status: 'APPROVED',
                startDate: { lte: today },
                endDate: { gte: today },
              },
              take: 1,
            },
          },
          orderBy: { firstName: 'asc' },
          take: 50,
        }),

        this.prisma.leaveRequest.count({
          where: { employee: { orgId: user.orgId }, status: 'PENDING' },
        }),

        this.prisma.task.groupBy({
          by: ['status'],
          where: { orgId: user.orgId },
          _count: { status: true },
        }),

        this.prisma.task.count({
          where: {
            orgId: user.orgId,
            dueDate: { lt: today },
            status: { notIn: ['DONE'] },
          },
        }),

        this.prisma.performanceReview.count({
          where: { reviewee: { orgId: user.orgId }, status: 'PENDING' },
        }),
      ]);

    const teamMembers = employees.map((emp) => {
      const att = emp.attendance[0];
      const onLeave = emp.leaveRequests.length > 0;

      let status: string;
      let statusColor: string;
      let checkin: string;

      if (onLeave) {
        status = 'On Leave';
        statusColor = 'amber';
        checkin = '—';
      } else if (att?.status === 'REMOTE') {
        status = 'Remote';
        statusColor = 'indigo';
        checkin = att.checkIn
          ? new Date(att.checkIn).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
          : '—';
      } else if (att?.status === 'LATE') {
        status = 'Late';
        statusColor = 'rose';
        checkin = att.checkIn
          ? new Date(att.checkIn).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
          : '—';
      } else if (att?.checkIn) {
        status = 'Present';
        statusColor = 'emerald';
        checkin = new Date(att.checkIn).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      } else {
        status = 'Absent';
        statusColor = 'rose';
        checkin = '—';
      }

      return {
        id: emp.id,
        name: `${emp.firstName} ${emp.lastName}`,
        avatarUrl: emp.avatarUrl,
        status,
        statusColor,
        checkin,
        department: emp.department?.name ?? '—',
      };
    });

    const presentCount = teamMembers.filter(
      (m) => m.status === 'Present' || m.status === 'Remote',
    ).length;
    const onLeaveCount = teamMembers.filter((m) => m.status === 'On Leave').length;
    const teamSize = teamMembers.length;
    const attendancePct = teamSize > 0 ? Math.round((presentCount / teamSize) * 100) : 0;

    const taskMap: Record<string, number> = {};
    for (const t of taskStats) taskMap[t.status] = t._count.status;

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
  }

  async getLeadershipData(user: JwtPayload) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalEmployees, departments, payrollRun, pendingLeave, openJobs, taskStats] =
      await Promise.all([
        this.prisma.employee.count({ where: { orgId: user.orgId, isActive: true } }),
        this.prisma.department.findMany({
          where: { org: { id: user.orgId } },
          include: { _count: { select: { employees: true } } },
        }),
        this.prisma.payrollRun.findFirst({
          where: { orgId: user.orgId },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.leaveRequest.count({
          where: { employee: { orgId: user.orgId }, status: 'PENDING' },
        }),
        this.prisma.jobPosting.count({ where: { orgId: user.orgId, isActive: true } }),
        this.prisma.task.groupBy({
          by: ['status'],
          where: { orgId: user.orgId },
          _count: { status: true },
        }),
      ]);

    const taskMap: Record<string, number> = {};
    for (const t of taskStats) taskMap[t.status] = t._count.status;

    return {
      totalEmployees,
      deptHealth: departments.map((d) => ({ name: d.name, headcount: d._count.employees })),
      totalPayroll: payrollRun ? Number(payrollRun.totalGross) : 0,
      pendingLeave,
      openJobs,
      taskMap,
    };
  }

  async getHrData(user: JwtPayload) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      attGroups,
      headcount,
      pendingLeaveCount,
      pendingReviewsCount,
      jobPostings,
      deptData,
      onboardingRecs,
      pendingLeaveItems,
      employeeFirst,
    ] = await Promise.all([
      this.prisma.attendanceRecord.groupBy({
        by: ['status'],
        where: { employee: { orgId: user.orgId }, date: today },
        _count: true,
      }),
      this.prisma.employee.count({ where: { orgId: user.orgId, isActive: true } }),
      this.prisma.leaveRequest.count({ where: { employee: { orgId: user.orgId }, status: 'PENDING' } }),
      this.prisma.performanceReview.count({ where: { reviewee: { orgId: user.orgId }, status: 'PENDING' } }),
      this.prisma.jobPosting.findMany({
        where: { orgId: user.orgId, isActive: true },
        include: { _count: { select: { candidates: true } } },
        orderBy: { postedAt: 'desc' },
        take: 5,
      }),
      this.prisma.department.findMany({
        where: { orgId: user.orgId },
        include: { _count: { select: { employees: { where: { isActive: true } } } } },
        orderBy: { name: 'asc' },
      }),
      this.prisma.onboardingRecord.findMany({
        where: {
          employee: { orgId: user.orgId },
          status: { in: ['IN_PROGRESS', 'NOT_STARTED'] },
        },
        include: {
          employee: {
            select: {
              firstName: true, lastName: true, startDate: true,
              department: { select: { name: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 6,
      }),
      this.prisma.leaveRequest.findMany({
        where: { employee: { orgId: user.orgId }, status: 'PENDING' },
        include: { employee: { select: { firstName: true, lastName: true } } },
        orderBy: { createdAt: 'asc' },
        take: 5,
      }),
      user.employeeId
        ? this.prisma.employee.findUnique({
            where: { id: user.employeeId },
            select: { firstName: true },
          })
        : Promise.resolve(null),
    ]);

    const sm = Object.fromEntries(attGroups.map((g) => [g.status, g._count]));

    return {
      userName: employeeFirst?.firstName ?? user.email.split('@')[0],
      headcount,
      pendingLeaveCount,
      pendingReviewsCount,
      openJobsCount: jobPostings.length,
      attendance: {
        present: sm['PRESENT'] ?? 0,
        late: sm['LATE'] ?? 0,
        onLeave: sm['ON_LEAVE'] ?? 0,
        remote: sm['REMOTE'] ?? 0,
      },
      jobPostings: jobPostings.map((j) => ({
        id: j.id,
        title: j.title,
        department: j.department,
        candidateCount: j._count.candidates,
        type: j.type,
      })),
      deptHeadcount: deptData.map((d) => ({ dept: d.name, count: d._count.employees })),
      onboarding: onboardingRecs.map((r) => {
        const tasks: { done: boolean }[] = Array.isArray(r.tasks)
          ? (r.tasks as { done: boolean }[])
          : [];
        const done = tasks.filter((t) => t.done).length;
        const progress = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;
        const daysSinceStart = Math.floor(
          (today.getTime() - new Date(r.employee.startDate).getTime()) / 86_400_000,
        );
        return {
          id: r.id,
          name: `${r.employee.firstName} ${r.employee.lastName}`,
          department: r.employee.department?.name ?? '—',
          progress,
          day: Math.max(1, Math.min(daysSinceStart, 30)),
        };
      }),
      pendingLeaveItems: pendingLeaveItems.map((l) => ({
        id: l.id,
        employeeName: `${l.employee.firstName} ${l.employee.lastName}`,
        leaveType: l.leaveType,
        days: l.days,
        startDate: l.startDate.toISOString(),
      })),
    };
  }
}
