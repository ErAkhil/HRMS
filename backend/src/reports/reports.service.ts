import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getReportsData(user: JwtPayload) {
    const [totalEmployees, departments, openJobs, leaveStats, taskStats] = await Promise.all([
      this.prisma.employee.count({ where: { orgId: user.orgId, isActive: true } }),
      this.prisma.department.findMany({
        where: { org: { id: user.orgId } },
        include: { _count: { select: { employees: true } } },
        orderBy: { name: 'asc' },
      }),
      this.prisma.jobPosting.count({ where: { orgId: user.orgId, isActive: true } }),
      this.prisma.leaveRequest.groupBy({
        by: ['status'],
        where: { employee: { orgId: user.orgId } },
        _count: { status: true },
      }),
      this.prisma.task.groupBy({
        by: ['status'],
        where: { orgId: user.orgId },
        _count: { status: true },
      }),
    ]);

    const leaveMap: Record<string, number> = {};
    for (const l of leaveStats) leaveMap[l.status] = l._count.status;

    const taskMap: Record<string, number> = {};
    for (const t of taskStats) taskMap[t.status] = t._count.status;

    return {
      totalEmployees,
      openJobs,
      deptData: departments.map((d) => ({ name: d.name, count: d._count.employees })),
      leaveMap,
      taskMap,
    };
  }

  async getAnalytics(user: JwtPayload) {
    const today = new Date();
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(today.getFullYear(), today.getMonth() - (5 - i), 1);
      return {
        label: d.toLocaleString('en-US', { month: 'short' }),
        start: new Date(d.getFullYear(), d.getMonth(), 1),
        end: new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59),
      };
    });

    const [hiresPerMonth, attritionPerMonth, depts, jobCounts] = await Promise.all([
      Promise.all(
        months.map((m) =>
          this.prisma.employee.count({
            where: { orgId: user.orgId, startDate: { gte: m.start, lte: m.end } },
          }),
        ),
      ),
      Promise.all(
        months.map((m) =>
          this.prisma.employee.count({
            where: {
              orgId: user.orgId,
              isActive: false,
              endDate: { gte: m.start, lte: m.end },
            },
          }),
        ),
      ),
      this.prisma.department.findMany({
        where: { orgId: user.orgId },
        select: {
          name: true,
          _count: { select: { employees: { where: { isActive: true } } } },
        },
        orderBy: { name: 'asc' },
      }),
      this.prisma.jobPosting.groupBy({
        by: ['department'],
        where: { orgId: user.orgId, isActive: true },
        _count: { _all: true },
      }),
    ]);

    const openRolesMap = new Map(jobCounts.map((r) => [r.department, r._count._all]));

    return {
      hireAttrition: months.map((m, i) => ({
        month: m.label,
        hires: hiresPerMonth[i],
        attrition: attritionPerMonth[i],
      })),
      deptStats: depts.map((d) => ({
        dept: d.name,
        headcount: d._count.employees,
        openRoles: openRolesMap.get(d.name) ?? 0,
      })),
    };
  }

  async getLeaveCalendar(month: number, year: number, user: JwtPayload) {
    const startDate = new Date(Date.UTC(year, month, 1));
    const endDate = new Date(Date.UTC(year, month + 1, 0));

    const leaves = await this.prisma.leaveRequest.findMany({
      where: {
        employee: { orgId: user.orgId },
        status: { in: ['APPROVED', 'PENDING', 'REJECTED'] },
        startDate: { lte: endDate },
        endDate: { gte: startDate },
      },
      include: {
        employee: {
          select: {
            firstName: true, lastName: true,
            department: { select: { name: true } },
          },
        },
      },
      orderBy: { startDate: 'asc' },
    });

    return leaves.map((l) => ({
      id: l.id,
      name: `${l.employee.firstName} ${l.employee.lastName.charAt(0)}.`,
      dept: l.employee.department?.name ?? '—',
      leaveType: l.leaveType,
      status: l.status,
      startDate: l.startDate.toISOString(),
      endDate: l.endDate.toISOString(),
      days: l.days,
    }));
  }

  async getCalendarData(month: number, year: number, user: JwtPayload) {
    const startDate = new Date(Date.UTC(year, month, 1));
    const endDate = new Date(Date.UTC(year, month + 1, 0));

    const [leaves, tasks] = await Promise.all([
      this.prisma.leaveRequest.findMany({
        where: {
          employee: { orgId: user.orgId },
          status: { in: ['APPROVED', 'PENDING', 'REJECTED'] },
          startDate: { lte: endDate },
          endDate: { gte: startDate },
        },
        include: { employee: { select: { firstName: true, lastName: true } } },
        orderBy: { startDate: 'asc' },
      }),
      this.prisma.task.findMany({
        where: {
          orgId: user.orgId,
          dueDate: { gte: startDate, lte: endDate },
          status: { not: 'DONE' },
        },
        include: { assignee: { select: { firstName: true, lastName: true } } },
        orderBy: { dueDate: 'asc' },
      }),
    ]);

    return {
      leaveEvents: leaves.map((l) => ({
        id: l.id,
        type: 'leave' as const,
        title: `${l.employee.firstName} ${l.employee.lastName.charAt(0)}.`,
        status: l.status as string,
        leaveType: l.leaveType as string,
        startDate: l.startDate.toISOString(),
        endDate: l.endDate.toISOString(),
      })),
      taskEvents: tasks.map((t) => ({
        id: t.id,
        type: 'task' as const,
        title: t.title,
        status: t.status as string,
        priority: t.priority as string,
        dueDate: t.dueDate?.toISOString() ?? '',
        assignee: t.assignee
          ? `${t.assignee.firstName} ${t.assignee.lastName.charAt(0)}.`
          : null,
      })),
    };
  }
}
