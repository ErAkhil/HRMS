import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../events/events.gateway';
import type { AttendanceStatus } from '@prisma/client';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

@Injectable()
export class AttendanceService {
  constructor(
    private prisma: PrismaService,
    private events: EventsGateway,
  ) {}

  private today() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }

  async getTodayAttendance(user: JwtPayload) {
    const today = this.today();
    const rows = await this.prisma.attendanceRecord.findMany({
      where: { employee: { orgId: user.orgId }, date: today },
      include: {
        employee: {
          select: {
            id: true, firstName: true, lastName: true,
            avatarUrl: true, title: true,
            department: { select: { name: true } },
          },
        },
      },
      orderBy: { checkIn: 'asc' },
    });

    return rows.map((r) => ({
      id: r.id,
      employeeId: r.employeeId,
      date: r.date.toISOString(),
      checkIn: r.checkIn?.toISOString() ?? null,
      checkOut: r.checkOut?.toISOString() ?? null,
      status: r.status,
      hoursWorked: r.hoursWorked ? Number(r.hoursWorked) : null,
      employee: r.employee,
    }));
  }

  async getStats(user: JwtPayload) {
    const today = this.today();
    const [total, groups] = await Promise.all([
      this.prisma.employee.count({ where: { orgId: user.orgId, isActive: true } }),
      this.prisma.attendanceRecord.groupBy({
        by: ['status'],
        where: { employee: { orgId: user.orgId }, date: today },
        _count: true,
      }),
    ]);

    const c = Object.fromEntries(groups.map((g) => [g.status, g._count]));
    return {
      total,
      present: c['PRESENT'] ?? 0,
      late: c['LATE'] ?? 0,
      onLeave: c['ON_LEAVE'] ?? 0,
      remote: c['REMOTE'] ?? 0,
      absent: c['ABSENT'] ?? 0,
      halfDay: c['HALF_DAY'] ?? 0,
    };
  }

  async getMonthlyHeatmap(month: number, year: number, user: JwtPayload) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);

    const [totalEmployees, records] = await Promise.all([
      this.prisma.employee.count({ where: { orgId: user.orgId, isActive: true } }),
      this.prisma.attendanceRecord.findMany({
        where: {
          employee: { orgId: user.orgId },
          date: { gte: start, lte: end },
          status: { in: ['PRESENT', 'LATE', 'REMOTE', 'HALF_DAY'] },
        },
        select: { date: true },
      }),
    ]);

    if (totalEmployees === 0) return [];

    const countByDay = new Map<number, number>();
    for (const r of records) {
      const day = new Date(r.date).getDate();
      countByDay.set(day, (countByDay.get(day) ?? 0) + 1);
    }

    return Array.from({ length: end.getDate() }, (_, i) => {
      const day = i + 1;
      return { day, pct: Math.round(((countByDay.get(day) ?? 0) / totalEmployees) * 100) };
    });
  }

  async getDeptReport(month: number, year: number, user: JwtPayload) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);

    const departments = await this.prisma.department.findMany({
      where: { orgId: user.orgId },
      include: {
        employees: {
          where: { isActive: true },
          select: {
            id: true,
            attendance: {
              where: { date: { gte: start, lte: end } },
              select: { status: true, hoursWorked: true },
            },
          },
        },
      },
    });

    return departments.map((dept) => {
      const records = dept.employees.flatMap((e) => e.attendance);
      const total = records.length;
      const present = records.filter((r) =>
        ['PRESENT', 'LATE', 'REMOTE', 'HALF_DAY'].includes(r.status),
      ).length;
      const late = records.filter((r) => r.status === 'LATE').length;
      const remote = records.filter((r) => r.status === 'REMOTE').length;
      const hours = records.filter((r) => r.hoursWorked).map((r) => Number(r.hoursWorked));
      const avgHours = hours.length > 0
        ? Math.round((hours.reduce((a, b) => a + b, 0) / hours.length) * 10) / 10
        : 0;

      return {
        dept: dept.name,
        employeeCount: dept.employees.length,
        presentPct: total > 0 ? Math.round((present / total) * 100 * 10) / 10 : 0,
        latePct: total > 0 ? Math.round((late / total) * 100 * 10) / 10 : 0,
        remotePct: total > 0 ? Math.round((remote / total) * 100 * 10) / 10 : 0,
        avgHours,
      };
    });
  }

  async getMyTodayStatus(user: JwtPayload) {
    if (!user.employeeId) return null;
    const today = this.today();
    return this.prisma.attendanceRecord.findUnique({
      where: { employeeId_date: { employeeId: user.employeeId, date: today } },
    });
  }

  async getSummary(month: number, year: number, user: JwtPayload) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);
    return this.prisma.attendanceRecord.groupBy({
      by: ['status'],
      where: { employee: { orgId: user.orgId }, date: { gte: start, lte: end } },
      _count: true,
    });
  }

  async checkIn(user: JwtPayload) {
    if (!user.employeeId) throw new BadRequestException('No employee profile');
    const today = this.today();

    const existing = await this.prisma.attendanceRecord.findUnique({
      where: { employeeId_date: { employeeId: user.employeeId, date: today } },
    });
    if (existing) throw new BadRequestException('Already checked in today');

    const record = await this.prisma.attendanceRecord.create({
      data: { employeeId: user.employeeId, date: today, checkIn: new Date(), status: 'PRESENT' },
      include: { employee: { select: { firstName: true, lastName: true, avatarUrl: true, title: true } } },
    });
    this.events.emitToOrg(user.orgId, 'attendance:checkin', {
      employeeId: user.employeeId,
      name: `${record.employee.firstName} ${record.employee.lastName}`,
      avatarUrl: record.employee.avatarUrl,
      title: record.employee.title,
      checkIn: record.checkIn?.toISOString(),
    });
    return record;
  }

  async checkOut(user: JwtPayload) {
    if (!user.employeeId) throw new BadRequestException('No employee profile');
    const today = this.today();

    const record = await this.prisma.attendanceRecord.findUnique({
      where: { employeeId_date: { employeeId: user.employeeId, date: today } },
    });
    if (!record || record.checkOut) throw new BadRequestException('Cannot check out');

    const now = new Date();
    const hours = record.checkIn ? (now.getTime() - record.checkIn.getTime()) / 3_600_000 : 0;

    const updated = await this.prisma.attendanceRecord.update({
      where: { id: record.id },
      data: { checkOut: now, hoursWorked: Math.round(hours * 100) / 100 },
      include: { employee: { select: { firstName: true, lastName: true, avatarUrl: true, title: true } } },
    });
    this.events.emitToOrg(user.orgId, 'attendance:checkout', {
      employeeId: user.employeeId,
      name: `${updated.employee.firstName} ${updated.employee.lastName}`,
      avatarUrl: updated.employee.avatarUrl,
      title: updated.employee.title,
      checkOut: updated.checkOut?.toISOString(),
      hoursWorked: updated.hoursWorked ? Number(updated.hoursWorked) : null,
    });
    return updated;
  }

  async updateStatus(employeeId: string, date: string, status: AttendanceStatus, user: JwtPayload) {
    const d = new Date(date);
    await this.prisma.attendanceRecord.upsert({
      where: { employeeId_date: { employeeId, date: d } },
      update: { status },
      create: { employeeId, date: d, status },
    });
    return { success: true };
  }
}
