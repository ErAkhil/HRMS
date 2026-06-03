import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

const DONE_STATUSES = ['DONE', 'CANCELLED'];

@Injectable()
export class AiContextService {
  constructor(private prisma: PrismaService) {}

  private getRoleCapabilities(role: string): string {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'Full system access: manage all organizations, users, billing, and all HR data across all departments.';
      case 'HR_ADMIN':
        return 'HR Admin access: manage all employees, run payroll, approve/reject leave, manage recruitment, view all reports, configure org settings.';
      case 'MANAGER':
        return 'Manager access: view and manage team members, approve team leave requests, assign tasks, view team attendance and performance, conduct performance reviews for direct reports.';
      case 'EMPLOYEE':
        return 'Employee access: view own profile and payslips, apply for leave, check in/out attendance, view own tasks and performance goals, access learning modules.';
      default:
        return 'Standard employee access.';
    }
  }

  async getContext(user: JwtPayload): Promise<string> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const taskSelect = { status: true, dueDate: true } as const;
    type TaskRow = { status: string; dueDate: Date | null };
    type BalanceRow = { leaveType: string; total: number; used: number; pending: number };

    const isManager =
      user.role === 'MANAGER' || user.role === 'HR_ADMIN' || user.role === 'SUPER_ADMIN';

    const [employee, tasks, leaveBalances, attendance, teamSize] = await Promise.all([
      user.employeeId
        ? this.prisma.employee.findFirst({
            where: { id: user.employeeId, orgId: user.orgId },
            include: { department: { select: { name: true } } },
          })
        : Promise.resolve(null),

      user.employeeId
        ? (this.prisma.task.findMany({
            where: { orgId: user.orgId, assigneeId: user.employeeId },
            select: taskSelect,
          }) as Promise<TaskRow[]>)
        : Promise.resolve([] as TaskRow[]),

      user.employeeId
        ? (this.prisma.leaveBalance.findMany({
            where: {
              employeeId: user.employeeId,
              employee: { orgId: user.orgId },
              year: today.getFullYear(),
            },
          }) as Promise<BalanceRow[]>)
        : Promise.resolve([] as BalanceRow[]),

      user.employeeId
        ? this.prisma.attendanceRecord.findFirst({
            where: {
              employeeId: user.employeeId,
              employee: { orgId: user.orgId },
              date: { gte: today },
            },
          })
        : Promise.resolve(null),

      isManager && user.employeeId
        ? this.prisma.employee.count({
            where: { managerId: user.employeeId, orgId: user.orgId, isActive: true },
          })
        : Promise.resolve(null),
    ]);

    const pending = tasks.filter(
      (t) => t.status === 'TODO' || t.status === 'IN_PROGRESS',
    ).length;

    const overdue = tasks.filter(
      (t) => t.dueDate && new Date(t.dueDate) < new Date() && !DONE_STATUSES.includes(t.status),
    ).length;

    const annualLeave = leaveBalances.find((b) => b.leaveType === 'ANNUAL');

    const attendanceStatus = attendance
      ? attendance.checkOut
        ? 'Checked out for the day'
        : 'Currently checked in'
      : 'Not checked in today';

    const fullName = employee
      ? `${employee.firstName} ${employee.lastName}`
      : user.email.split('@')[0];

    const dateStr = today.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    const capabilities = this.getRoleCapabilities(user.role);
    const teamInfo = teamSize !== null ? `\n- Direct reports: ${teamSize} team members` : '';

    return `Current user context:
- Name: ${fullName}
- Role: ${user.role}
- Organization: ${user.orgName} (Plan: ${user.plan})
- Department: ${employee?.department?.name ?? 'Unknown'}
- Permissions: ${capabilities}${teamInfo}

Today's live data (${dateStr}):
- Attendance: ${attendanceStatus}
- Pending tasks: ${pending}
- Overdue tasks: ${overdue}
- Annual leave remaining: ${annualLeave ? `${annualLeave.total - annualLeave.used - annualLeave.pending} days` : 'N/A'}

IMPORTANT: Only answer questions the user has permission to based on their role. Do not reveal data about other employees unless the user has HR_ADMIN, MANAGER (for their direct reports), or SUPER_ADMIN role. Always scope responses to what is relevant for this user's role in the HRMS.`;
  }

  async getInsights(user: JwtPayload) {
    if (!user.employeeId) {
      return { overdueTasks: 0, pendingTasks: 0, annualLeaveRemaining: null as number | null, checkedIn: false };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [tasks, leaveBalances, attendance] = await Promise.all([
      this.prisma.task.findMany({
        where: { orgId: user.orgId, assigneeId: user.employeeId },
        select: { status: true, dueDate: true },
      }),
      this.prisma.leaveBalance.findMany({
        where: {
          employeeId: user.employeeId,
          employee: { orgId: user.orgId },
          year: today.getFullYear(),
        },
      }),
      this.prisma.attendanceRecord.findFirst({
        where: {
          employeeId: user.employeeId,
          employee: { orgId: user.orgId },
          date: { gte: today },
        },
      }),
    ]);

    const overdueTasks = tasks.filter(
      (t) => t.dueDate && new Date(t.dueDate) < new Date() && !DONE_STATUSES.includes(t.status),
    ).length;

    const pendingTasks = tasks.filter(
      (t) => t.status === 'TODO' || t.status === 'IN_PROGRESS',
    ).length;

    const annual = leaveBalances.find((b) => b.leaveType === 'ANNUAL');
    const annualLeaveRemaining = annual ? annual.total - annual.used - annual.pending : null;

    return { overdueTasks, pendingTasks, annualLeaveRemaining, checkedIn: !!attendance?.checkIn };
  }
}
