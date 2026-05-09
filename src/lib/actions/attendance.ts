"use server";

import { db } from "@/lib/db";
import { requireAuth } from "@/lib/session";
import { revalidatePath } from "next/cache";
import type { AttendanceStatus } from "@prisma/client";

export async function getTodayAttendance() {
  const user = await requireAuth();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return db.attendanceRecord.findMany({
    where: {
      employee: { orgId: user.orgId },
      date: today,
    },
    include: {
      employee: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
          title: true,
          department: { select: { name: true } },
        },
      },
    },
    orderBy: { checkIn: "asc" },
  });
}

export async function getMyTodayStatus() {
  const user = await requireAuth();
  if (!user.employeeId) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return db.attendanceRecord.findUnique({
    where: { employeeId_date: { employeeId: user.employeeId, date: today } },
  });
}

export async function getAttendanceSummary(month: number, year: number) {
  const user = await requireAuth();

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);

  const records = await db.attendanceRecord.groupBy({
    by: ["status"],
    where: {
      employee: { orgId: user.orgId },
      date: { gte: start, lte: end },
    },
    _count: true,
  });

  return records;
}

export async function checkIn() {
  const user = await requireAuth();
  if (!user.employeeId) throw new Error("No employee profile");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

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
}

export async function checkOut() {
  const user = await requireAuth();
  if (!user.employeeId) throw new Error("No employee profile");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

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
}

export async function updateAttendanceStatus(
  employeeId: string,
  date: Date,
  status: AttendanceStatus,
) {
  const user = await requireAuth();

  await db.attendanceRecord.upsert({
    where: { employeeId_date: { employeeId, date } },
    update: { status },
    create: { employeeId, date, status },
  });

  revalidatePath("/attendance");
}
