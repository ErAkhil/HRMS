"use server";

import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/session";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { toActionError } from "./utils";

const goalSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.string().optional(),
});

export type SerializedGoal = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  progress: number;
  dueDate: string | null;
};

export type SerializedReview = {
  id: string;
  score: number | null;
  type: string;
  period: string;
  status: string;
  comments: string | null;
  completedAt: string | null;
  createdAt: string;
  reviewer: { firstName: string; lastName: string; title: string | null } | null;
};

export async function getMyGoals(): Promise<SerializedGoal[]> {
  const user = await requireAuth();
  if (!user.employeeId) return [];

  try {
    const rows = await db.goal.findMany({
      where: { employeeId: user.employeeId },
      orderBy: { createdAt: "desc" },
    });
    return rows.map((g) => ({
      id: g.id,
      title: g.title,
      description: g.description,
      status: g.status,
      progress: g.progress,
      dueDate: g.dueDate?.toISOString() ?? null,
    }));
  } catch (err) {
    throw toActionError(err);
  }
}

export async function createGoal(data: z.infer<typeof goalSchema>) {
  const user = await requireAuth();
  if (!user.employeeId) throw new Error("No employee profile");

  const parsed = goalSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid data");

  try {
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
  } catch (err) {
    throw toActionError(err);
  }
}

export async function updateGoalProgress(goalId: string, progress: number) {
  const user = await requireAuth();
  if (!user.employeeId) throw new Error("No employee profile");

  try {
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
  } catch (err) {
    throw toActionError(err);
  }
}

export async function getMyReviews(): Promise<SerializedReview[]> {
  const user = await requireAuth();
  if (!user.employeeId) return [];

  try {
    const rows = await db.performanceReview.findMany({
      where: { revieweeId: user.employeeId },
      include: {
        reviewer: { select: { firstName: true, lastName: true, title: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return rows.map((r) => ({
      id: r.id,
      score: r.score,
      type: r.type,
      period: r.period,
      status: r.status,
      comments: r.comments,
      completedAt: r.completedAt?.toISOString() ?? null,
      createdAt: r.createdAt.toISOString(),
      reviewer: r.reviewer,
    }));
  } catch (err) {
    throw toActionError(err);
  }
}

export type OrgReview = {
  id: string;
  score: number | null;
  type: string;
  period: string;
  status: string;
  completedAt: string | null;
  createdAt: string;
  reviewee: { firstName: string; lastName: string; title: string | null; department: { name: string } | null };
  reviewer: { firstName: string; lastName: string };
};

export async function getOrgReviews(): Promise<OrgReview[]> {
  const user = await requireRole("SUPER_ADMIN", "HR_ADMIN", "MANAGER");

  try {
    const rows = await db.performanceReview.findMany({
      where: { reviewee: { orgId: user.orgId } },
      include: {
        reviewee: { select: { firstName: true, lastName: true, title: true, department: { select: { name: true } } } },
        reviewer: { select: { firstName: true, lastName: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return rows.map((r) => ({
      id: r.id,
      score: r.score,
      type: r.type,
      period: r.period,
      status: r.status,
      completedAt: r.completedAt?.toISOString() ?? null,
      createdAt: r.createdAt.toISOString(),
      reviewee: r.reviewee,
      reviewer: r.reviewer,
    }));
  } catch (err) {
    throw toActionError(err);
  }
}
