"use server";

import { db } from "@/lib/db";
import { requireAuth } from "@/lib/session";
import { revalidatePath } from "next/cache";
import type { AttendanceStatus } from "@prisma/client";
import { toActionError } from "./utils";

export type AttendanceRecord = {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: string;
  hoursWorked: number | null;
  employee: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    title: string;
    department: { name: string } | null;
  };
};

export type AttendanceStats = {
  total: number;
  present: number;
  late: number;
  onLeave: number;
  remote: number;
  absent: number;
  halfDay: number;
};

export async function getTodayAttendance(): Promise<AttendanceRecord[]> {
  const user = await requireAuth();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const rows = await db.attendanceRecord.findMany({
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
      orderBy: { checkIn: "asc" },
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
  } catch (err) {
    throw toActionError(err);
  }
}

export async function getAttendanceStats(): Promise<AttendanceStats> {
  const user = await requireAuth();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const [total, groups] = await Promise.all([
      db.employee.count({ where: { orgId: user.orgId, isActive: true } }),
      db.attendanceRecord.groupBy({
        by: ["status"],
        where: { employee: { orgId: user.orgId }, date: today },
        _count: true,
      }),
    ]);

    const c = Object.fromEntries(groups.map((g) => [g.status, g._count]));

    return {
      total,
      present: c["PRESENT"] ?? 0,
      late: c["LATE"] ?? 0,
      onLeave: c["ON_LEAVE"] ?? 0,
      remote: c["REMOTE"] ?? 0,
      absent: c["ABSENT"] ?? 0,
      halfDay: c["HALF_DAY"] ?? 0,
    };
  } catch (err) {
    throw toActionError(err);
  }
}

export async function getMonthlyHeatmap(month: number, year: number) {
  const user = await requireAuth();

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);

  try {
    const [totalEmployees, records] = await Promise.all([
      db.employee.count({ where: { orgId: user.orgId, isActive: true } }),
      db.attendanceRecord.findMany({
        where: {
          employee: { orgId: user.orgId },
          date: { gte: start, lte: end },
          status: { in: ["PRESENT", "LATE", "REMOTE", "HALF_DAY"] },
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

    const daysInMonth = end.getDate();
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      return { day, pct: Math.round(((countByDay.get(day) ?? 0) / totalEmployees) * 100) };
    });
  } catch (err) {
    throw toActionError(err);
  }
}

export async function getDeptAttendanceReport(month: number, year: number) {
  const user = await requireAuth();

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);

  try {
    const departments = await db.department.findMany({
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
      const present = records.filter((r) => ["PRESENT", "LATE", "REMOTE", "HALF_DAY"].includes(r.status)).length;
      const late = records.filter((r) => r.status === "LATE").length;
      const remote = records.filter((r) => r.status === "REMOTE").length;
      const hours = records.filter((r) => r.hoursWorked).map((r) => Number(r.hoursWorked));
      const avgHours = hours.length > 0 ? Math.round((hours.reduce((a, b) => a + b, 0) / hours.length) * 10) / 10 : 0;

      return {
        dept: dept.name,
        employeeCount: dept.employees.length,
        presentPct: total > 0 ? Math.round((present / total) * 100 * 10) / 10 : 0,
        latePct: total > 0 ? Math.round((late / total) * 100 * 10) / 10 : 0,
        remotePct: total > 0 ? Math.round((remote / total) * 100 * 10) / 10 : 0,
        avgHours,
      };
    });
  } catch (err) {
    throw toActionError(err);
  }
}

export async function getMyTodayStatus() {
  const user = await requireAuth();
  if (!user.employeeId) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    return await db.attendanceRecord.findUnique({
      where: { employeeId_date: { employeeId: user.employeeId, date: today } },
    });
  } catch (err) {
    throw toActionError(err);
  }
}

export async function getAttendanceSummary(month: number, year: number) {
  const user = await requireAuth();

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);

  try {
    return await db.attendanceRecord.groupBy({
      by: ["status"],
      where: {
        employee: { orgId: user.orgId },
        date: { gte: start, lte: end },
      },
      _count: true,
    });
  } catch (err) {
    throw toActionError(err);
  }
}

export async function checkIn() {
  const user = await requireAuth();
  if (!user.employeeId) throw new Error("No employee profile");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const existing = await db.attendanceRecord.findUnique({
      where: { employeeId_date: { employeeId: user.employeeId, date: today } },
    });

    if (existing) throw new Error("Already checked in today");

    const record = await db.attendanceRecord.create({
      data: {
        employeeId: user.employeeId,
        date: today,
        checkIn: new Date(),
        status: "PRESENT",
      },
    });

    revalidatePath("/attendance");
    return record;
  } catch (err) {
    throw toActionError(err);
  }
}

export async function checkOut() {
  const user = await requireAuth();
  if (!user.employeeId) throw new Error("No employee profile");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const record = await db.attendanceRecord.findUnique({
      where: { employeeId_date: { employeeId: user.employeeId, date: today } },
    });

    if (!record || record.checkOut) throw new Error("Cannot check out");

    const now = new Date();
    const hours = record.checkIn
      ? (now.getTime() - record.checkIn.getTime()) / 3_600_000
      : 0;

    const updated = await db.attendanceRecord.update({
      where: { id: record.id },
      data: {
        checkOut: now,
        hoursWorked: Math.round(hours * 100) / 100,
      },
    });

    revalidatePath("/attendance");
    return updated;
  } catch (err) {
    throw toActionError(err);
  }
}

export async function updateAttendanceStatus(
  employeeId: string,
  date: Date,
  status: AttendanceStatus,
) {
  const user = await requireAuth();

  try {
    await db.attendanceRecord.upsert({
      where: { employeeId_date: { employeeId, date } },
      update: { status },
      create: { employeeId, date, status },
    });

    revalidatePath("/attendance");
  } catch (err) {
    throw toActionError(err);
  }
}
