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

export async function getPerformanceAnalytics() {
  const user = await requireRole("SUPER_ADMIN", "HR_ADMIN", "MANAGER");

  try {
    const reviews = await db.performanceReview.findMany({
      where: { reviewee: { orgId: user.orgId }, status: "COMPLETED", score: { not: null } },
      include: {
        reviewee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            department: { select: { name: true } },
          },
        },
      },
      orderBy: { completedAt: "desc" },
    });

    // One score per employee — use the most recent completed review
    const seenIds = new Set<string>();
    const employees: { id: string; name: string; dept: string; avatarUrl: string | null; score: number }[] = [];
    for (const r of reviews) {
      if (!seenIds.has(r.revieweeId) && r.score !== null) {
        seenIds.add(r.revieweeId);
        employees.push({
          id: r.revieweeId,
          name: `${r.reviewee.firstName} ${r.reviewee.lastName}`,
          dept: r.reviewee.department?.name ?? "—",
          avatarUrl: r.reviewee.avatarUrl,
          score: r.score,
        });
      }
    }

    // Department comparison
    const deptMap = new Map<string, { scores: number[]; topName: string; topScore: number }>();
    for (const emp of employees) {
      const d = deptMap.get(emp.dept) ?? { scores: [], topName: "—", topScore: 0 };
      d.scores.push(emp.score);
      if (emp.score > d.topScore) { d.topName = emp.name; d.topScore = emp.score; }
      deptMap.set(emp.dept, d);
    }

    const departments = Array.from(deptMap.entries()).map(([name, d]) => ({
      name,
      headcount: d.scores.length,
      avgScore: d.scores.length > 0
        ? Math.round((d.scores.reduce((a, b) => a + b, 0) / d.scores.length) * 10) / 10
        : 0,
      topPerformer: d.topName,
    })).sort((a, b) => b.avgScore - a.avgScore);

    // Score distribution buckets
    const buckets = [
      { label: "Exceptional", range: "91–100", min: 91, max: 100, color: "bg-primary-500" },
      { label: "Above Average", range: "81–90", min: 81, max: 90, color: "bg-emerald-500" },
      { label: "Average", range: "71–80", min: 71, max: 80, color: "bg-amber-500" },
      { label: "Below Average", range: "61–70", min: 61, max: 70, color: "bg-orange-400" },
      { label: "Needs Improvement", range: "≤60", min: 0, max: 60, color: "bg-rose-500" },
    ];

    const distribution = buckets.map((b) => {
      const count = employees.filter((e) => e.score >= b.min && e.score <= b.max).length;
      const pct = employees.length > 0 ? Math.round((count / employees.length) * 100) : 0;
      return { label: b.label, range: b.range, color: b.color, count, pct };
    });

    const topPerformers = [...employees].sort((a, b) => b.score - a.score).slice(0, 5);

    const companyAvg = employees.length > 0
      ? Math.round((employees.reduce((s, e) => s + e.score, 0) / employees.length) * 10) / 10
      : 0;

    return { departments, distribution, topPerformers, companyAvg, reviewedCount: employees.length };
  } catch (err) {
    throw toActionError(err);
  }
}

export type TeamMemberScore = {
  id: string;
  name: string;
  avatarUrl: string | null;
  role: string;
  dept: string;
  score: number | null;
};

export type TeamGoalSummary = {
  id: string;
  title: string;
  dept: string;
  progress: number;
  status: string;
};

export type TeamPerformanceSummary = {
  teamMembers: TeamMemberScore[];
  topPerformers: TeamMemberScore[];
  teamGoals: TeamGoalSummary[];
  avgScore: number;
  onTrackGoals: number;
  totalGoals: number;
  completedReviews: number;
  totalReviews: number;
  distribution: { bucket: string; count: number }[];
  attentionEmployees: { name: string; score: number; dept: string }[];
};

export async function getTeamPerformanceSummary(): Promise<TeamPerformanceSummary> {
  const user = await requireAuth();

  try {
    const [employees, goals, reviews] = await Promise.all([
      db.employee.findMany({
        where: { orgId: user.orgId, isActive: true },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
          title: true,
          department: { select: { name: true } },
          reviews: {
            where: { status: "COMPLETED", score: { not: null } },
            orderBy: { completedAt: "desc" },
            take: 1,
            select: { score: true },
          },
        },
      }),
      db.goal.findMany({
        where: { employee: { orgId: user.orgId }, status: { not: "COMPLETED" } },
        select: {
          id: true,
          title: true,
          progress: true,
          status: true,
          employee: { select: { department: { select: { name: true } } } },
        },
        orderBy: { progress: "desc" },
        take: 10,
      }),
      db.performanceReview.count({ where: { reviewee: { orgId: user.orgId } } }),
    ]);

    const totalReviews = reviews;
    const completedReviews = await db.performanceReview.count({
      where: { reviewee: { orgId: user.orgId }, status: "COMPLETED" },
    });

    const teamMembers: TeamMemberScore[] = employees.map((e) => ({
      id: e.id,
      name: `${e.firstName} ${e.lastName}`,
      avatarUrl: e.avatarUrl,
      role: e.title,
      dept: e.department?.name ?? "—",
      score: e.reviews[0]?.score ?? null,
    }));

    const scored = teamMembers.filter((m) => m.score !== null) as (TeamMemberScore & { score: number })[];
    const topPerformers = [...scored].sort((a, b) => b.score - a.score).slice(0, 5);

    const avgScore = scored.length > 0
      ? Math.round((scored.reduce((s, m) => s + m.score, 0) / scored.length) * 10) / 10
      : 0;

    const distribution = [
      { bucket: "90–100", min: 90, max: 100 },
      { bucket: "80–89", min: 80, max: 89 },
      { bucket: "70–79", min: 70, max: 79 },
      { bucket: "60–69", min: 60, max: 69 },
      { bucket: "<60", min: 0, max: 59 },
    ].map(({ bucket, min, max }) => ({
      bucket,
      count: scored.filter((m) => m.score >= min && m.score <= max).length,
    }));

    const attentionEmployees = scored
      .filter((m) => m.score < 75)
      .sort((a, b) => a.score - b.score)
      .slice(0, 5)
      .map((m) => ({ name: m.name, score: m.score, dept: m.dept }));

    const teamGoals: TeamGoalSummary[] = goals.map((g) => ({
      id: g.id,
      title: g.title,
      dept: g.employee.department?.name ?? "—",
      progress: g.progress,
      status: g.status,
    }));

    const onTrackGoals = goals.filter((g) => g.progress >= 50).length;
    const totalGoals = await db.goal.count({ where: { employee: { orgId: user.orgId } } });

    return {
      teamMembers: teamMembers.slice(0, 10),
      topPerformers,
      teamGoals,
      avgScore,
      onTrackGoals,
      totalGoals,
      completedReviews,
      totalReviews,
      distribution,
      attentionEmployees,
    };
  } catch (err) {
    throw toActionError(err);
  }
}

export async function getEmployeeReviews(employeeId: string): Promise<SerializedReview[]> {
  const user = await requireAuth();

  try {
    const rows = await db.performanceReview.findMany({
      where: { revieweeId: employeeId, reviewee: { orgId: user.orgId } },
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
      reviewer: r.reviewer
        ? { firstName: r.reviewer.firstName, lastName: r.reviewer.lastName, title: r.reviewer.title }
        : null,
    }));
  } catch (err) {
    throw toActionError(err);
  }
}
