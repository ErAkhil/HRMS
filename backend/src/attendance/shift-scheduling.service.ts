import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import type { UpsertShiftAssignmentDto } from './dto/upsert-shift-assignment.dto';
import type { ClearShiftAssignmentDto } from './dto/clear-shift-assignment.dto';
import type { BulkAssignShiftsDto } from './dto/bulk-assign-shifts.dto';
import type { CopyPreviousWeekDto } from './dto/copy-previous-week.dto';
import type { ShiftType } from './shift-types';

type PlannedShiftAssignment = {
  employeeId: string;
  date: Date;
  shiftType: ShiftType;
  notes?: string;
};

@Injectable()
export class ShiftSchedulingService {
  constructor(private readonly prisma: PrismaService) {}

  private startOfDay(date: Date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private addDays(date: Date, days: number) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return this.startOfDay(d);
  }

  private dateKey(date: Date) {
    return date.toISOString().split('T')[0];
  }

  private assignmentKey(employeeId: string, date: Date) {
    return `${employeeId}_${this.dateKey(date)}`;
  }

  private getWeekStart(startDate?: string) {
    const base = startDate ? new Date(startDate) : new Date();
    if (Number.isNaN(base.getTime())) {
      throw new BadRequestException('Invalid start date');
    }

    const day = base.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(base);
    monday.setDate(base.getDate() + diffToMonday);
    return this.startOfDay(monday);
  }

  private getWeekDays(weekStart: Date) {
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + index);
      return date;
    });
  }

  private mapEmployeeSchedule(
    employees: Array<{
      id: string;
      firstName: string;
      lastName: string;
      title: string;
      avatarUrl: string | null;
      department: { name: string } | null;
    }>,
    assignments: Array<{ employeeId: string; date: Date; shiftType: ShiftType }>,
  ) {
    return employees.map((employee) => {
      const byDay: Record<string, ShiftType> = {};
      for (const assignment of assignments) {
        if (assignment.employeeId !== employee.id) continue;
        byDay[assignment.date.toISOString().split('T')[0]] = assignment.shiftType;
      }
      return {
        id: employee.id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        title: employee.title,
        avatarUrl: employee.avatarUrl,
        department: employee.department,
        assignments: byDay,
      };
    });
  }

  private getConflictMessage(
    employeeId: string,
    date: Date,
    shiftType: ShiftType,
    assignments: Map<string, ShiftType>,
  ) {
    if (shiftType === 'OFF') return null;

    const previous = assignments.get(this.assignmentKey(employeeId, this.addDays(date, -1)));
    const next = assignments.get(this.assignmentKey(employeeId, this.addDays(date, 1)));

    if (shiftType === 'MORNING' && previous === 'NIGHT') {
      return 'Cannot assign MORNING immediately after a NIGHT shift';
    }

    if (shiftType === 'NIGHT' && next === 'MORNING') {
      return 'Cannot assign NIGHT immediately before a MORNING shift';
    }

    return null;
  }

  private async loadAssignmentMap(
    orgId: string,
    employeeIds: string[],
    startDate: Date,
    endDate: Date,
  ): Promise<Map<string, ShiftType>> {
    const rows: Array<{ employeeId: string; date: Date; shiftType: ShiftType }> = await this.prisma.shiftAssignment.findMany({
      where: {
        orgId,
        employeeId: { in: employeeIds },
        date: { gte: this.addDays(startDate, -1), lte: this.addDays(endDate, 1) },
      },
      select: { employeeId: true, date: true, shiftType: true },
    });

    return new Map<string, ShiftType>(rows.map((row) => [this.assignmentKey(row.employeeId, row.date), row.shiftType]));
  }

  private validateAgainstRestRules(
    employeeId: string,
    date: Date,
    shiftType: ShiftType,
    assignments: Map<string, ShiftType>,
  ) {
    const conflict = this.getConflictMessage(employeeId, date, shiftType, assignments);
    if (conflict) {
      throw new BadRequestException(conflict);
    }
  }

  async getOrgWeekSchedule(user: JwtPayload, startDate?: string) {
    const weekStart = this.getWeekStart(startDate);
    const weekDays = this.getWeekDays(weekStart);
    const weekEnd = weekDays[6];

    const [employees, assignments] = await Promise.all([
      this.prisma.employee.findMany({
        where: { orgId: user.orgId, isActive: true },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          title: true,
          avatarUrl: true,
          department: { select: { name: true } },
        },
        orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
      }),
      this.prisma.shiftAssignment.findMany({
        where: { orgId: user.orgId, date: { gte: weekStart, lte: weekEnd } },
        select: { employeeId: true, date: true, shiftType: true },
      }),
    ]);

    return {
      weekStart: weekStart.toISOString(),
      weekEnd: weekEnd.toISOString(),
      days: weekDays.map((date) => ({
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      })),
      employees: this.mapEmployeeSchedule(employees, assignments),
    };
  }

  async getMyWeekSchedule(user: JwtPayload, startDate?: string) {
    const weekStart = this.getWeekStart(startDate);
    const weekDays = this.getWeekDays(weekStart);
    const weekEnd = weekDays[6];

    if (!user.employeeId) {
      return {
        weekStart: weekStart.toISOString(),
        weekEnd: weekEnd.toISOString(),
        days: weekDays.map((date) => ({
          date: date.toISOString().split('T')[0],
          dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
          label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        })),
        employees: [],
      };
    }

    const employee = await this.prisma.employee.findFirst({
      where: { id: user.employeeId, orgId: user.orgId, isActive: true },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        title: true,
        avatarUrl: true,
        department: { select: { name: true } },
      },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const assignments = await this.prisma.shiftAssignment.findMany({
      where: {
        orgId: user.orgId,
        employeeId: user.employeeId,
        date: { gte: weekStart, lte: weekEnd },
      },
      select: { employeeId: true, date: true, shiftType: true },
    });

    return {
      weekStart: weekStart.toISOString(),
      weekEnd: weekEnd.toISOString(),
      days: weekDays.map((date) => ({
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      })),
      employees: this.mapEmployeeSchedule([employee], assignments),
    };
  }

  async upsertShiftAssignment(user: JwtPayload, dto: UpsertShiftAssignmentDto) {
    const employee = await this.prisma.employee.findFirst({
      where: { id: dto.employeeId, orgId: user.orgId, isActive: true },
      select: { id: true },
    });

    if (!employee) throw new NotFoundException('Employee not found');

    const day = this.startOfDay(new Date(dto.date));
    const existingAssignments = await this.loadAssignmentMap(user.orgId, [dto.employeeId], day, day);
    existingAssignments.set(this.assignmentKey(dto.employeeId, day), dto.shiftType);
    this.validateAgainstRestRules(dto.employeeId, day, dto.shiftType, existingAssignments);

    const assignment = await this.prisma.shiftAssignment.upsert({
      where: {
        employeeId_date: {
          employeeId: dto.employeeId,
          date: day,
        },
      },
      update: {
        shiftType: dto.shiftType,
        notes: dto.notes ?? null,
        assignedBy: user.sub,
      },
      create: {
        orgId: user.orgId,
        employeeId: dto.employeeId,
        date: day,
        shiftType: dto.shiftType,
        notes: dto.notes ?? null,
        assignedBy: user.sub,
      },
    });

    return {
      success: true,
      assignment: {
        id: assignment.id,
        employeeId: assignment.employeeId,
        date: assignment.date.toISOString(),
        shiftType: assignment.shiftType,
        notes: assignment.notes,
      },
    };
  }

  async clearShiftAssignment(user: JwtPayload, dto: ClearShiftAssignmentDto) {
    const day = this.startOfDay(new Date(dto.date));

    const deleted = await this.prisma.shiftAssignment.deleteMany({
      where: {
        orgId: user.orgId,
        employeeId: dto.employeeId,
        date: day,
      },
    });

    return { success: true, deleted: deleted.count > 0 };
  }

  async bulkAssignShifts(user: JwtPayload, dto: BulkAssignShiftsDto) {
    const employeeIds = Array.from(new Set(dto.employeeIds));
    if (employeeIds.length === 0) {
      throw new BadRequestException('No employees provided');
    }

    const dates = Array.from(new Set(dto.dates))
      .map((date) => this.startOfDay(new Date(date)))
      .sort((a, b) => a.getTime() - b.getTime());

    const foundEmployees = await this.prisma.employee.count({
      where: {
        orgId: user.orgId,
        isActive: true,
        id: { in: employeeIds },
      },
    });

    if (foundEmployees !== employeeIds.length) {
      throw new BadRequestException('One or more employees are invalid for this organization');
    }

    const plannedAssignments: PlannedShiftAssignment[] = employeeIds.flatMap((employeeId) =>
      dates.map((date) => ({
        employeeId,
        date,
        shiftType: dto.shiftType,
        notes: dto.notes,
      })),
    );

    const firstDate = dates.at(0);
    const lastDate = dates.at(-1);
    if (!firstDate || !lastDate) {
      throw new BadRequestException('No dates provided');
    }

    const assignmentMap = await this.loadAssignmentMap(user.orgId, employeeIds, firstDate, lastDate);
    for (const planned of plannedAssignments) {
      assignmentMap.set(this.assignmentKey(planned.employeeId, planned.date), planned.shiftType);
    }

    const allowedAssignments = plannedAssignments.filter(
      (planned) => !this.getConflictMessage(planned.employeeId, planned.date, planned.shiftType, assignmentMap),
    );

    const skippedConflicts = plannedAssignments.length - allowedAssignments.length;

    const operations = allowedAssignments.map((planned) =>
      this.prisma.shiftAssignment.upsert({
          where: {
            employeeId_date: {
              employeeId: planned.employeeId,
              date: planned.date,
            },
          },
          update: {
            shiftType: planned.shiftType,
            notes: planned.notes ?? null,
            assignedBy: user.sub,
          },
          create: {
            orgId: user.orgId,
            employeeId: planned.employeeId,
            date: planned.date,
            shiftType: planned.shiftType,
            notes: planned.notes ?? null,
            assignedBy: user.sub,
          },
        }),
    );

    if (operations.length === 0) {
      return {
        success: true,
        updated: 0,
        skippedConflicts,
      };
    }

    await this.prisma.$transaction(operations);

    return {
      success: true,
      updated: operations.length,
      skippedConflicts,
    };
  }

  async copyPreviousWeekSchedule(user: JwtPayload, dto: CopyPreviousWeekDto) {
    const targetWeekStart = this.getWeekStart(dto.startDate);
    const sourceWeekStart = this.addDays(targetWeekStart, -7);
    const sourceWeekEnd = this.addDays(sourceWeekStart, 6);

    const sourceAssignments: Array<{
      employeeId: string;
      date: Date;
      shiftType: ShiftType;
      notes: string | null;
    }> = await this.prisma.shiftAssignment.findMany({
      where: {
        orgId: user.orgId,
        date: { gte: sourceWeekStart, lte: sourceWeekEnd },
      },
      select: { employeeId: true, date: true, shiftType: true, notes: true },
      orderBy: [{ employeeId: 'asc' }, { date: 'asc' }],
    });

    if (sourceAssignments.length === 0) {
      return { success: true, copied: 0, skippedConflicts: 0 };
    }

    const plannedAssignments: PlannedShiftAssignment[] = sourceAssignments.map((assignment) => ({
      employeeId: assignment.employeeId,
      date: this.addDays(assignment.date, 7),
      shiftType: assignment.shiftType,
      notes: assignment.notes ?? undefined,
    }));

    const employeeIds = Array.from(new Set(plannedAssignments.map((assignment) => assignment.employeeId)));
    const targetWeekEnd = this.addDays(targetWeekStart, 6);
    const assignmentMap = await this.loadAssignmentMap(user.orgId, employeeIds, targetWeekStart, targetWeekEnd);
    for (const planned of plannedAssignments) {
      assignmentMap.set(this.assignmentKey(planned.employeeId, planned.date), planned.shiftType);
    }

    const allowedAssignments = plannedAssignments.filter(
      (planned) => !this.getConflictMessage(planned.employeeId, planned.date, planned.shiftType, assignmentMap),
    );

    if (allowedAssignments.length === 0) {
      return {
        success: true,
        copied: 0,
        skippedConflicts: plannedAssignments.length,
      };
    }

    const rows = await this.prisma.$transaction(
      allowedAssignments.map((planned) =>
        this.prisma.shiftAssignment.upsert({
          where: {
            employeeId_date: {
              employeeId: planned.employeeId,
              date: planned.date,
            },
          },
          update: {
            shiftType: planned.shiftType,
            notes: planned.notes ?? null,
            assignedBy: user.sub,
          },
          create: {
            orgId: user.orgId,
            employeeId: planned.employeeId,
            date: planned.date,
            shiftType: planned.shiftType,
            notes: planned.notes ?? null,
            assignedBy: user.sub,
          },
        }),
      ),
    );

    return {
      success: true,
      copied: rows.length,
      skippedConflicts: plannedAssignments.length - allowedAssignments.length,
    };
  }
}
