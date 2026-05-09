"use server";

import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/session";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const goalSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.string().optional(),
});

export async function getMyGoals() {
  const user = await requireAuth();
  if (!user.employeeId) return [];

  return db.goal.findMany({
    where: { employeeId: user.employeeId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createGoal(data: z.infer<typeof goalSchema>) {
  const user = await requireAuth();
  if (!user.employeeId) throw new Error("No employee profile");

  const parsed = goalSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid data");

  const goal = await db.goal.create({
    data: {
      employeeId: user.employeeId,
      title: parsed.data.title,
      description: parsed.data.description,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : undefined,
    },
  });

  revalidatePath("/performance");
  return goal;
}

export async function updateGoalProgress(goalId: string, progress: number) {
  const user = await requireAuth();
  if (!user.employeeId) throw new Error("No employee profile");

  await db.goal.updateMany({
    where: { id: goalId, employeeId: user.employeeId },
    data: {
      progress,
      status:
        progress >= 100
          ? "COMPLETED"
          : progress > 0
          ? "IN_PROGRESS"
          : "NOT_STARTED",
    },
  });

  revalidatePath("/performance");
}

export async function getMyReviews() {
  const user = await requireAuth();
  if (!user.employeeId) return [];

  return db.performanceReview.findMany({
    where: { revieweeId: user.employeeId },
    include: {
      reviewer: { select: { firstName: true, lastName: true, title: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrgReviews() {
  const user = await requireRole("SUPER_ADMIN", "HR_ADMIN", "MANAGER");

  return db.performanceReview.findMany({
    where: { reviewee: { orgId: user.orgId } },
    include: {
      reviewee: { select: { firstName: true, lastName: true, title: true, department: { select: { name: true } } } },
      reviewer: { select: { firstName: true, lastName: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}
