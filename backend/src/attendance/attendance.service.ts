import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../events/events.gateway';
import { GeolocationService } from '../common/services/geolocation.service';
import type { AttendanceStatus } from '@prisma/client';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import {
  resolveCheckOutStatus,
  shouldCreateAbsentRecord,
  shouldCreateOnLeaveRecord,
  shouldOverrideStatusToOnLeave,
} from './attendance-status.logic';

@Injectable()
export class AttendanceService {
  private static readonly SHIFT_START_HOUR = 9;
  private static readonly SHIFT_START_MINUTE = 0;
  private static readonly LATE_GRACE_MINUTES = 15;
  private static readonly ABSENT_MARK_HOUR = 18;
  private static readonly HALF_DAY_MAX_HOURS = 4;

  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventsGateway,
    private readonly geolocation: GeolocationService,
  ) {}

  private today() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private startOfDay(date: Date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private shouldAutoFinalizeForDate(date: Date) {
    const cutoff = new Date(date);
    cutoff.setHours(AttendanceService.ABSENT_MARK_HOUR, 0, 0, 0);
    return new Date() >= cutoff;
  }

  private getCheckInStatus(checkInAt: Date): AttendanceStatus {
    const shiftStart = new Date(checkInAt);
    shiftStart.setHours(
      AttendanceService.SHIFT_START_HOUR,
      AttendanceService.SHIFT_START_MINUTE,
      0,
      0,
    );
    shiftStart.setMinutes(shiftStart.getMinutes() + AttendanceService.LATE_GRACE_MINUTES);

    return checkInAt > shiftStart ? 'LATE' : 'PRESENT';
  }

  private getCheckOutStatus(currentStatus: AttendanceStatus, hoursWorked: number): AttendanceStatus {
    return resolveCheckOutStatus(currentStatus, hoursWorked, AttendanceService.HALF_DAY_MAX_HOURS);
  }

  private async ensureDailySmartStatuses(orgId: string, date: Date, force = false) {
    const day = this.startOfDay(date);
    if (!force && !this.shouldAutoFinalizeForDate(day)) {
      return { createdAbsent: 0, createdOnLeave: 0, updatedOnLeave: 0 };
    }

    const [allEmployees, attendanceRows, leaveRows] = await Promise.all([
      this.prisma.employee.findMany({
        where: { orgId, isActive: true },
        select: { id: true },
      }),
      this.prisma.attendanceRecord.findMany({
        where: { date: day, employee: { orgId } },
        select: { id: true, employeeId: true, status: true, checkIn: true, checkOut: true },
      }),
      this.prisma.leaveRequest.findMany({
        where: {
          status: 'APPROVED',
          employee: { orgId },
          startDate: { lte: day },
          endDate: { gte: day },
        },
        select: { employeeId: true },
      }),
    ]);

    const attendanceByEmployee = new Map(attendanceRows.map((row) => [row.employeeId, row]));
    const leaveSet = new Set(leaveRows.map((row) => row.employeeId));

    const leaveIdsToCreate = Array.from(leaveSet).filter((employeeId) => {
      const hasAttendanceRecord = attendanceByEmployee.has(employeeId);
      return shouldCreateOnLeaveRecord(hasAttendanceRecord, true);
    });
    let createdOnLeave = 0;
    if (leaveIdsToCreate.length > 0) {
      const result = await this.prisma.attendanceRecord.createMany({
        data: leaveIdsToCreate.map((employeeId) => ({ employeeId, date: day, status: 'ON_LEAVE' as const })),
        skipDuplicates: true,
      });
      createdOnLeave = result.count;
    }

    const recordsToUpdate = attendanceRows.filter((row) =>
      shouldOverrideStatusToOnLeave(
        row.status,
        leaveSet.has(row.employeeId),
        Boolean(row.checkIn),
        Boolean(row.checkOut),
      ),
    );

    let updatedOnLeave = 0;
    if (recordsToUpdate.length > 0) {
      const result = await this.prisma.attendanceRecord.updateMany({
        where: { id: { in: recordsToUpdate.map((row) => row.id) } },
        data: { status: 'ON_LEAVE' },
      });
      updatedOnLeave = result.count;
    }

    const employeeIds = allEmployees.map((employee) => employee.id);
    const attendanceSet = new Set(attendanceRows.map((row) => row.employeeId));
    const absentIds = employeeIds.filter((id) => {
      const hasAttendanceRecord = attendanceSet.has(id);
      const hasApprovedLeave = leaveSet.has(id);
      return shouldCreateAbsentRecord(hasAttendanceRecord, hasApprovedLeave);
    });

    let createdAbsent = 0;
    if (absentIds.length > 0) {
      const result = await this.prisma.attendanceRecord.createMany({
        data: absentIds.map((employeeId) => ({
          employeeId,
          date: day,
          status: 'ABSENT' as const,
        })),
        skipDuplicates: true,
      });
      createdAbsent = result.count;
    }

    return { createdAbsent, createdOnLeave, updatedOnLeave };
  }

  async runAutoFinalizationForOrg(orgId: string, date = new Date(), force = false) {
    return this.ensureDailySmartStatuses(orgId, date, force);
  }

  async runAutoFinalizationForAllOrgs(date = new Date(), force = false) {
    const orgs = await this.prisma.organization.findMany({ select: { id: true } });

    let createdAbsent = 0;
    let createdOnLeave = 0;
    let updatedOnLeave = 0;

    for (const org of orgs) {
      const result = await this.ensureDailySmartStatuses(org.id, date, force);
      createdAbsent += result.createdAbsent;
      createdOnLeave += result.createdOnLeave;
      updatedOnLeave += result.updatedOnLeave;
    }

    return {
      orgCount: orgs.length,
      createdAbsent,
      createdOnLeave,
      updatedOnLeave,
    };
  }

  async getTodayAttendance(user: JwtPayload) {
    const today = this.today();
    await this.ensureDailySmartStatuses(user.orgId, today);
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
      checkInLatitude: r.checkInLatitude,
      checkInLongitude: r.checkInLongitude,
      checkOutLatitude: r.checkOutLatitude,
      checkOutLongitude: r.checkOutLongitude,
      status: r.status,
      hoursWorked: r.hoursWorked ? Number(r.hoursWorked) : null,
      employee: r.employee,
    }));
  }

  async getStats(user: JwtPayload) {
    const today = this.today();
    await this.ensureDailySmartStatuses(user.orgId, today);
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

  async checkIn(user: JwtPayload, _latitude: number, _longitude: number) {
    if (!user.employeeId) throw new BadRequestException('No employee profile');
    const today = this.today();

    const existing = await this.prisma.attendanceRecord.findUnique({
      where: { employeeId_date: { employeeId: user.employeeId, date: today } },
    });
    if (existing) throw new BadRequestException('Already checked in today');

    // SMART CHECK-IN: VERIFY NO APPROVED LEAVE EXISTS FOR TODAY
    const approvedLeaveForToday = await this.prisma.leaveRequest.findFirst({
      where: {
        employeeId: user.employeeId,
        status: 'APPROVED',
        startDate: { lte: today },
        endDate: { gte: today },
      },
    });
    if (approvedLeaveForToday) {
      throw new BadRequestException('Employee is on approved leave for today');
    }

    const checkInAt = new Date();
    const status = this.getCheckInStatus(checkInAt);

    // Get office locations for location type detection
    const officeLocations = await this.prisma.officeLocation.findMany({
      where: { orgId: user.orgId, isActive: true },
      select: { id: true, name: true, address: true, latitude: true, longitude: true, radiusMeters: true },
    });

    // Get detailed location info
    const locationDetails = await this.geolocation.getDetailedLocation(
      _latitude,
      _longitude,
      officeLocations,
    );

    const record = await this.prisma.attendanceRecord.create({
      data: {
        employeeId: user.employeeId,
        date: today,
        checkIn: checkInAt,
        checkInLatitude: _latitude,
        checkInLongitude: _longitude,
        checkInLocationName: locationDetails.address,
        checkInLocationType: locationDetails.locationType,
        status,
      },
      include: { employee: { select: { firstName: true, lastName: true, avatarUrl: true, title: true } } },
    });
    this.events.emitToOrg(user.orgId, 'attendance:checkin', {
      employeeId: user.employeeId,
      name: `${record.employee.firstName} ${record.employee.lastName}`,
      avatarUrl: record.employee.avatarUrl,
      title: record.employee.title,
      checkIn: record.checkIn?.toISOString(),
      checkInLocation: record.checkInLocationName,
      checkInLocationType: record.checkInLocationType,
      status: record.status,
    });
    this.events.emitToOrg(user.orgId, 'attendance:status-changed', {
      employeeId: user.employeeId,
      previousStatus: null,
      status: record.status,
    });
    return record;
  }

  async checkOut(user: JwtPayload, _latitude: number, _longitude: number) {
    if (!user.employeeId) throw new BadRequestException('No employee profile');
    const today = this.today();

    const record = await this.prisma.attendanceRecord.findUnique({
      where: { employeeId_date: { employeeId: user.employeeId, date: today } },
    });
    if (!record || record.checkOut) throw new BadRequestException('Cannot check out');

    const now = new Date();
    const hours = record.checkIn ? (now.getTime() - record.checkIn.getTime()) / 3_600_000 : 0;
    const hoursWorked = Math.round(hours * 100) / 100;

    const finalStatus = this.getCheckOutStatus(record.status, hoursWorked);
    const previousStatus = record.status;

    // Get office locations for location type detection
    const officeLocations = await this.prisma.officeLocation.findMany({
      where: { orgId: user.orgId, isActive: true },
      select: { id: true, name: true, address: true, latitude: true, longitude: true, radiusMeters: true },
    });

    // Get detailed location info
    const locationDetails = await this.geolocation.getDetailedLocation(
      _latitude,
      _longitude,
      officeLocations,
    );

    const updated = await this.prisma.attendanceRecord.update({
      where: { id: record.id },
      data: {
        checkOut: now,
        checkOutLatitude: _latitude,
        checkOutLongitude: _longitude,
        checkOutLocationName: locationDetails.address,
        checkOutLocationType: locationDetails.locationType,
        hoursWorked,
        status: finalStatus,
      },
      include: { employee: { select: { firstName: true, lastName: true, avatarUrl: true, title: true } } },
    });

    // EMIT STATUS CHANGE IF HALF_DAY WAS TRIGGERED
    if (finalStatus !== previousStatus) {
      this.events.emitToOrg(user.orgId, 'attendance:status-changed', {
        employeeId: user.employeeId,
        previousStatus,
        status: finalStatus,
      });
    }

    this.events.emitToOrg(user.orgId, 'attendance:checkout', {
      employeeId: user.employeeId,
      name: `${updated.employee.firstName} ${updated.employee.lastName}`,
      avatarUrl: updated.employee.avatarUrl,
      title: updated.employee.title,
      checkOut: updated.checkOut?.toISOString(),
      checkOutLocation: updated.checkOutLocationName,
      checkOutLocationType: updated.checkOutLocationType,
      hoursWorked: updated.hoursWorked ? Number(updated.hoursWorked) : null,
    });
    return updated;
  }

  async backfillLocation(user: JwtPayload, latitude: number, longitude: number) {
    if (!user.employeeId) throw new BadRequestException('No employee profile');
    const today = this.today();

    const record = await this.prisma.attendanceRecord.findUnique({
      where: { employeeId_date: { employeeId: user.employeeId, date: today } },
    });

    if (!record?.checkIn) {
      throw new BadRequestException('No active attendance record for today');
    }

    const data: {
      checkInLatitude?: number;
      checkInLongitude?: number;
      checkOutLatitude?: number;
      checkOutLongitude?: number;
    } = {};

    if (record.checkInLatitude === null || record.checkInLongitude === null) {
      data.checkInLatitude = latitude;
      data.checkInLongitude = longitude;
    }

    if (record.checkOut && (record.checkOutLatitude === null || record.checkOutLongitude === null)) {
      data.checkOutLatitude = latitude;
      data.checkOutLongitude = longitude;
    }

    if (Object.keys(data).length === 0) {
      return { success: true, updated: false };
    }

    await this.prisma.attendanceRecord.update({
      where: { id: record.id },
      data,
    });

    return { success: true, updated: true };
  }

  async updateStatus(employeeId: string, date: string, status: AttendanceStatus) {
    const d = new Date(date);
    const existing = await this.prisma.attendanceRecord.findUnique({
      where: { employeeId_date: { employeeId, date: d } },
      include: { employee: { select: { orgId: true } } },
    });

    await this.prisma.attendanceRecord.upsert({
      where: { employeeId_date: { employeeId, date: d } },
      update: { status },
      create: { employeeId, date: d, status },
    });

    const employee = existing?.employee
      ?? await this.prisma.employee.findUnique({ where: { id: employeeId }, select: { orgId: true } });

    if (employee?.orgId) {
      this.events.emitToOrg(employee.orgId, 'attendance:status-changed', {
        employeeId,
        previousStatus: existing?.status ?? null,
        status,
      });
    }

    return { success: true };
  }

  // AUTO-MARK ABSENT FOR NO-SHOW EMPLOYEES
  // Call at end-of-business or from getStats to mark employees with no check-in as ABSENT
  async markAbsentForNoShows(user: JwtPayload) {
    const today = this.today();
    return this.ensureDailySmartStatuses(user.orgId, today, true);
  }
}
