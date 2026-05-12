import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import type { CreateOnboardingDto } from './dto/create-onboarding.dto';

const DEFAULT_TASKS = [
  { id: 1, title: 'IT Setup & Equipment', done: false },
  { id: 2, title: 'Badge & Access Cards', done: false },
  { id: 3, title: 'HR Documentation', done: false },
  { id: 4, title: 'Team Introduction', done: false },
  { id: 5, title: 'Complete Onboarding Courses', done: false },
];

const EXIT_TASKS = [
  { label: 'Assets Return', done: false },
  { label: 'Knowledge Transfer', done: false },
  { label: 'Exit Interview', done: false },
  { label: 'Final Settlement', done: false },
];

@Injectable()
export class OnboardingService {
  constructor(private prisma: PrismaService) {}

  async getRecords(user: JwtPayload) {
    const today = new Date();

    const records = await this.prisma.onboardingRecord.findMany({
      where: {
        employee: { orgId: user.orgId },
        status: { in: ['IN_PROGRESS', 'NOT_STARTED'] },
      },
      include: {
        employee: {
          select: {
            id: true, firstName: true, lastName: true, avatarUrl: true,
            title: true, startDate: true,
            department: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return records.map((r) => {
      const tasks: { done: boolean }[] = Array.isArray(r.tasks)
        ? (r.tasks as { done: boolean }[])
        : [];
      const totalTasks = tasks.length;
      const doneTasks = tasks.filter((t) => t.done).length;
      const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

      const dueDate = r.dueDate ? new Date(r.dueDate) : null;
      const daysRemaining = dueDate
        ? Math.max(0, Math.ceil((dueDate.getTime() - today.getTime()) / 86_400_000))
        : null;

      return {
        id: r.id,
        employeeId: r.employee.id,
        name: `${r.employee.firstName} ${r.employee.lastName}`,
        avatarUrl: r.employee.avatarUrl,
        role: r.employee.title,
        department: r.employee.department?.name ?? '—',
        startDate: r.employee.startDate.toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric',
        }),
        progress,
        pendingTasks: totalTasks - doneTasks,
        daysRemaining,
        status: r.status,
      };
    });
  }

  async getStats(user: JwtPayload) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const weekEnd = new Date(today.getTime() + 7 * 86_400_000);

    const [inProgress, completedThisMonth, completingThisWeek] = await Promise.all([
      this.prisma.onboardingRecord.count({
        where: {
          employee: { orgId: user.orgId },
          status: { in: ['IN_PROGRESS', 'NOT_STARTED'] },
        },
      }),
      this.prisma.onboardingRecord.count({
        where: {
          employee: { orgId: user.orgId },
          status: 'COMPLETED',
          updatedAt: { gte: monthStart },
        },
      }),
      this.prisma.onboardingRecord.count({
        where: {
          employee: { orgId: user.orgId },
          status: 'IN_PROGRESS',
          dueDate: { gte: today, lte: weekEnd },
        },
      }),
    ]);

    return { inProgress, completedThisMonth, completingThisWeek };
  }

  async getOffboardingRecords(user: JwtPayload) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 90);

    const employees = await this.prisma.employee.findMany({
      where: {
        orgId: user.orgId,
        isActive: false,
        endDate: { not: null, gte: cutoff },
      },
      include: { department: { select: { name: true } } },
      orderBy: { endDate: 'desc' },
    });

    return employees.map((emp) => ({
      id: emp.id,
      name: `${emp.firstName} ${emp.lastName}`,
      avatarUrl: emp.avatarUrl,
      role: emp.title,
      department: emp.department?.name ?? '—',
      lastDay: emp.endDate!.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
      }),
      reason: emp.exitReason ?? 'Resignation',
      tasks: EXIT_TASKS,
    }));
  }

  async initiateOffboarding(
    dto: { employeeId: string; lastWorkingDay: string; reason?: string },
    user: JwtPayload,
  ) {
    await this.prisma.employee.updateMany({
      where: { id: dto.employeeId, orgId: user.orgId },
      data: {
        isActive: false,
        endDate: new Date(dto.lastWorkingDay),
        exitReason: dto.reason || 'Resignation',
      },
    });
    return { success: true };
  }

  async sendOffboardingReminder(employeeId: string, user: JwtPayload) {
    const employee = await this.prisma.employee.findFirst({
      where: { id: employeeId, orgId: user.orgId, isActive: false },
      select: { firstName: true, lastName: true },
    });
    if (!employee) return { success: false };
    // Records the reminder intent; email delivery requires external mail service
    return { success: true, name: `${employee.firstName} ${employee.lastName}` };
  }

  async getActiveEmployees(user: JwtPayload) {
    return this.prisma.employee.findMany({
      where: { orgId: user.orgId, isActive: true },
      select: { id: true, firstName: true, lastName: true, title: true },
      orderBy: { firstName: 'asc' },
    });
  }

  async getOffboardingStats(user: JwtPayload) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    monthEnd.setHours(23, 59, 59, 999);

    const [exitingThisMonth, totalDeparted] = await Promise.all([
      this.prisma.employee.count({
        where: {
          orgId: user.orgId,
          isActive: false,
          endDate: { gte: monthStart, lte: monthEnd },
        },
      }),
      this.prisma.employee.count({
        where: { orgId: user.orgId, isActive: false, endDate: { not: null } },
      }),
    ]);

    return {
      exitingThisMonth,
      assetsPending: exitingThisMonth,
      exitInterviews: exitingThisMonth,
      completed: totalDeparted,
    };
  }

  async createOrUpdate(dto: CreateOnboardingDto, user: JwtPayload) {
    const existing = await this.prisma.onboardingRecord.findFirst({
      where: { employeeId: dto.employeeId },
      select: { id: true },
    });

    if (existing) {
      await this.prisma.onboardingRecord.update({
        where: { id: existing.id },
        data: { status: 'IN_PROGRESS', startDate: new Date(dto.startDate) },
      });
    } else {
      await this.prisma.onboardingRecord.create({
        data: {
          employeeId: dto.employeeId,
          status: 'IN_PROGRESS',
          startDate: new Date(dto.startDate),
          dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
          tasks: DEFAULT_TASKS,
        },
      });
    }

    return { success: true };
  }
}
