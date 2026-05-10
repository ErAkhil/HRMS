"use server";

import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { toActionError } from "./utils";

export async function getOnboardingRecords() {
  const user = await requireAuth();

  try {
    const records = await db.onboardingRecord.findMany({
      where: {
        employee: { orgId: user.orgId },
        status: { in: ["IN_PROGRESS", "NOT_STARTED"] },
      },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            title: true,
            startDate: true,
            department: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const today = new Date();

    return records.map((r) => {
      const tasks: { done: boolean }[] = Array.isArray(r.tasks) ? r.tasks as { done: boolean }[] : [];
      const totalTasks = tasks.length;
      const doneTasks = tasks.filter((t) => t.done).length;
      const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
      const pendingTasks = totalTasks - doneTasks;

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
        department: r.employee.department?.name ?? "—",
        startDate: r.employee.startDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        progress,
        pendingTasks,
        daysRemaining,
        status: r.status,
      };
    });
  } catch (err) {
    throw toActionError(err);
  }
}

export async function getOnboardingStats() {
  const user = await requireAuth();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const weekEnd = new Date(today.getTime() + 7 * 86_400_000);

  try {
    const [inProgress, completedThisMonth] = await Promise.all([
      db.onboardingRecord.count({
        where: {
          employee: { orgId: user.orgId },
          status: { in: ["IN_PROGRESS", "NOT_STARTED"] },
        },
      }),
      db.onboardingRecord.count({
        where: {
          employee: { orgId: user.orgId },
          status: "COMPLETED",
          updatedAt: { gte: monthStart },
        },
      }),
    ]);

    const completingThisWeek = await db.onboardingRecord.count({
      where: {
        employee: { orgId: user.orgId },
        status: "IN_PROGRESS",
        dueDate: { gte: today, lte: weekEnd },
      },
    });

    return { inProgress, completedThisMonth, completingThisWeek };
  } catch (err) {
    throw toActionError(err);
  }
}

const createOnboardingSchema = z.object({
  employeeId: z.string(),
  startDate: z.string(),
  dueDate: z.string().optional(),
});

export async function createOnboarding(data: z.infer<typeof createOnboardingSchema>) {
  await requireRole("SUPER_ADMIN", "HR_ADMIN", "MANAGER");

  const parsed = createOnboardingSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid data");

  const defaultTasks = [
    { id: 1, title: "IT Setup & Equipment", done: false },
    { id: 2, title: "Badge & Access Cards", done: false },
    { id: 3, title: "HR Documentation", done: false },
    { id: 4, title: "Team Introduction", done: false },
    { id: 5, title: "Complete Onboarding Courses", done: false },
  ];

  try {
    const existing = await db.onboardingRecord.findFirst({
      where: { employeeId: parsed.data.employeeId },
      select: { id: true },
    });

    if (existing) {
      await db.onboardingRecord.update({
        where: { id: existing.id },
        data: { status: "IN_PROGRESS", startDate: new Date(parsed.data.startDate) },
      });
    } else {
      await db.onboardingRecord.create({
        data: {
          employeeId: parsed.data.employeeId,
          status: "IN_PROGRESS",
          startDate: new Date(parsed.data.startDate),
          dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
          tasks: defaultTasks,
        },
      });
    }

    revalidatePath("/onboarding");
  } catch (err) {
    throw toActionError(err);
  }
}
