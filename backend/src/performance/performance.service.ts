import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import type { CreateGoalDto } from './dto/create-goal.dto';

@Injectable()
export class PerformanceService {
  constructor(private prisma: PrismaService) {}

  async getMyGoals(user: JwtPayload) {
    if (!user.employeeId) return [];
    const rows = await this.prisma.goal.findMany({
      where: { employeeId: user.employeeId },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((g) => ({
      id: g.id, title: g.title, description: g.description,
      status: g.status, progress: g.progress,
      dueDate: g.dueDate?.toISOString() ?? null,
    }));
  }

  async createGoal(dto: CreateGoalDto, user: JwtPayload) {
    if (!user.employeeId) throw new BadRequestException('No employee profile');
    return this.prisma.goal.create({
      data: {
        employeeId: user.employeeId,
        title: dto.title,
        description: dto.description,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
    });
  }

  async updateGoalProgress(goalId: string, progress: number, user: JwtPayload) {
    if (!user.employeeId) throw new BadRequestException('No employee profile');
    await this.prisma.goal.updateMany({
      where: { id: goalId, employeeId: user.employeeId },
      data: {
        progress,
        status: progress >= 100 ? 'COMPLETED' : progress > 0 ? 'IN_PROGRESS' : 'NOT_STARTED',
      },
    });
    return { success: true };
  }

  async getMyReviews(user: JwtPayload) {
    if (!user.employeeId) return [];
    const rows = await this.prisma.performanceReview.findMany({
      where: { revieweeId: user.employeeId },
      include: { reviewer: { select: { firstName: true, lastName: true, title: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((r) => ({
      id: r.id, score: r.score, type: r.type, period: r.period,
      status: r.status, comments: r.comments,
      completedAt: r.completedAt?.toISOString() ?? null,
      createdAt: r.createdAt.toISOString(),
      reviewer: r.reviewer,
    }));
  }

  async getOrgReviews(user: JwtPayload) {
    const rows = await this.prisma.performanceReview.findMany({
      where: { reviewee: { orgId: user.orgId } },
      include: {
        reviewee: { select: { firstName: true, lastName: true, title: true, department: { select: { name: true } } } },
        reviewer: { select: { firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((r) => ({
      id: r.id, score: r.score, type: r.type, period: r.period, status: r.status,
      completedAt: r.completedAt?.toISOString() ?? null,
      createdAt: r.createdAt.toISOString(),
      reviewee: r.reviewee, reviewer: r.reviewer,
    }));
  }

  async getEmployeeReviews(employeeId: string, user: JwtPayload) {
    const rows = await this.prisma.performanceReview.findMany({
      where: { revieweeId: employeeId, reviewee: { orgId: user.orgId } },
      include: { reviewer: { select: { firstName: true, lastName: true, title: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((r) => ({
      id: r.id, score: r.score, type: r.type, period: r.period,
      status: r.status, comments: r.comments,
      completedAt: r.completedAt?.toISOString() ?? null,
      createdAt: r.createdAt.toISOString(),
      reviewer: r.reviewer ?? null,
    }));
  }

  async getAnalytics(user: JwtPayload) {
    const reviews = await this.prisma.performanceReview.findMany({
      where: { reviewee: { orgId: user.orgId }, status: 'COMPLETED', score: { not: null } },
      include: {
        reviewee: {
          select: { id: true, firstName: true, lastName: true, avatarUrl: true, department: { select: { name: true } } },
        },
      },
      orderBy: { completedAt: 'desc' },
    });

    const seenIds = new Set<string>();
    const employees: { id: string; name: string; dept: string; avatarUrl: string | null; score: number }[] = [];
    for (const r of reviews) {
      if (!seenIds.has(r.revieweeId) && r.score !== null) {
        seenIds.add(r.revieweeId);
        employees.push({
          id: r.revieweeId,
          name: `${r.reviewee.firstName} ${r.reviewee.lastName}`,
          dept: r.reviewee.department?.name ?? '—',
          avatarUrl: r.reviewee.avatarUrl,
          score: r.score,
        });
      }
    }

    const deptMap = new Map<string, { scores: number[]; topName: string; topScore: number }>();
    for (const emp of employees) {
      const d = deptMap.get(emp.dept) ?? { scores: [], topName: '—', topScore: 0 };
      d.scores.push(emp.score);
      if (emp.score > d.topScore) { d.topName = emp.name; d.topScore = emp.score; }
      deptMap.set(emp.dept, d);
    }

    const departments = Array.from(deptMap.entries()).map(([name, d]) => ({
      name,
      headcount: d.scores.length,
      avgScore: d.scores.length > 0 ? Math.round((d.scores.reduce((a, b) => a + b, 0) / d.scores.length) * 10) / 10 : 0,
      topPerformer: d.topName,
    })).sort((a, b) => b.avgScore - a.avgScore);

    const buckets = [
      { label: 'Exceptional', range: '91–100', min: 91, max: 100 },
      { label: 'Above Average', range: '81–90', min: 81, max: 90 },
      { label: 'Average', range: '71–80', min: 71, max: 80 },
      { label: 'Below Average', range: '61–70', min: 61, max: 70 },
      { label: 'Needs Improvement', range: '≤60', min: 0, max: 60 },
    ];

    const distribution = buckets.map((b) => {
      const count = employees.filter((e) => e.score >= b.min && e.score <= b.max).length;
      return { label: b.label, range: b.range, count, pct: employees.length > 0 ? Math.round((count / employees.length) * 100) : 0 };
    });

    const topPerformers = [...employees].sort((a, b) => b.score - a.score).slice(0, 5);
    const companyAvg = employees.length > 0
      ? Math.round((employees.reduce((s, e) => s + e.score, 0) / employees.length) * 10) / 10
      : 0;

    return { departments, distribution, topPerformers, companyAvg, reviewedCount: employees.length };
  }

  async getTeamSummary(user: JwtPayload) {
    const [employees, goals, totalReviews, completedReviews] = await Promise.all([
      this.prisma.employee.findMany({
        where: { orgId: user.orgId, isActive: true },
        select: {
          id: true, firstName: true, lastName: true, avatarUrl: true, title: true,
          department: { select: { name: true } },
          reviews: {
            where: { status: 'COMPLETED', score: { not: null } },
            orderBy: { completedAt: 'desc' },
            take: 1,
            select: { score: true },
          },
        },
      }),
      this.prisma.goal.findMany({
        where: { employee: { orgId: user.orgId }, status: { not: 'COMPLETED' } },
        select: {
          id: true, title: true, progress: true, status: true,
          employee: { select: { department: { select: { name: true } } } },
        },
        orderBy: { progress: 'desc' },
        take: 10,
      }),
      this.prisma.performanceReview.count({ where: { reviewee: { orgId: user.orgId } } }),
      this.prisma.performanceReview.count({ where: { reviewee: { orgId: user.orgId }, status: 'COMPLETED' } }),
    ]);

    const teamMembers = employees.map((e) => ({
      id: e.id, name: `${e.firstName} ${e.lastName}`,
      avatarUrl: e.avatarUrl, role: e.title,
      dept: e.department?.name ?? '—',
      score: e.reviews[0]?.score ?? null,
    }));

    const scored = teamMembers.filter((m) => m.score !== null) as (typeof teamMembers[0] & { score: number })[];
    const topPerformers = [...scored].sort((a, b) => b.score - a.score).slice(0, 5);
    const avgScore = scored.length > 0 ? Math.round((scored.reduce((s, m) => s + m.score, 0) / scored.length) * 10) / 10 : 0;

    const distribution = [
      { bucket: '90–100', min: 90, max: 100 }, { bucket: '80–89', min: 80, max: 89 },
      { bucket: '70–79', min: 70, max: 79 }, { bucket: '60–69', min: 60, max: 69 },
      { bucket: '<60', min: 0, max: 59 },
    ].map(({ bucket, min, max }) => ({
      bucket, count: scored.filter((m) => m.score >= min && m.score <= max).length,
    }));

    const totalGoals = await this.prisma.goal.count({ where: { employee: { orgId: user.orgId } } });

    return {
      teamMembers: teamMembers.slice(0, 10), topPerformers,
      teamGoals: goals.map((g) => ({ id: g.id, title: g.title, dept: g.employee.department?.name ?? '—', progress: g.progress, status: g.status })),
      avgScore, onTrackGoals: goals.filter((g) => g.progress >= 50).length,
      totalGoals, completedReviews, totalReviews, distribution,
      attentionEmployees: scored.filter((m) => m.score < 75).sort((a, b) => a.score - b.score).slice(0, 5).map((m) => ({ name: m.name, score: m.score, dept: m.dept })),
    };
  }
}
