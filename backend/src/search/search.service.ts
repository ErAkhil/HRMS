import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

type SearchResults = {
  employees: SearchItem[];
  tasks: SearchItem[];
  projects: SearchItem[];
  meetings: SearchItem[];
  courses: SearchItem[];
  jobPostings: SearchItem[];
  candidates: SearchItem[];
  leaves: SearchItem[];
  goals: SearchItem[];
};

type SearchItem = {
  id: string;
  type: 'employee' | 'task' | 'project' | 'meeting' | 'course' | 'job' | 'candidate' | 'leave' | 'goal';
  title: string;
  subtitle: string;
  href: string;
  avatarUrl?: string | null;
};

type CachedSearch = {
  expiresAt: number;
  data: SearchResults;
};

@Injectable()
export class SearchService {
  private readonly cacheTtlMs = 30_000;
  private readonly maxCacheEntries = 300;
  private readonly cache = new Map<string, CachedSearch>();

  constructor(private readonly prisma: PrismaService) {}

  async globalSearch(query: string, user: JwtPayload) {
    const normalizedQuery = query.trim().toLowerCase().slice(0, 64);
    if (normalizedQuery.length < 2) {
      return {
        employees: [],
        tasks: [],
        projects: [],
        meetings: [],
        courses: [],
        jobPostings: [],
        candidates: [],
        leaves: [],
        goals: [],
      };
    }

    const { orgId, role, employeeId } = user;
    const isHR = role === 'HR_ADMIN' || role === 'SUPER_ADMIN';
    const isPrivileged = isHR || role === 'MANAGER';
    const ownId = employeeId ?? '__NONE__';

    const cacheKey = `${orgId}:${role}:${ownId}:${normalizedQuery}`;
    const cached = this.getCachedResult(cacheKey);
    if (cached) return cached;

    const jobPostingsPromise = isHR
      ? this.prisma.jobPosting.findMany({
          where: {
            orgId,
            OR: [
              { title: { contains: normalizedQuery, mode: 'insensitive' } },
              { department: { contains: normalizedQuery, mode: 'insensitive' } },
            ],
          },
          select: { id: true, title: true, department: true, isActive: true },
          take: 3,
        })
      : Promise.resolve(
          [] as Array<{ id: string; title: string; department: string; isActive: boolean }>,
        );

    const candidatesPromise = isHR
      ? this.prisma.candidate.findMany({
          where: {
            job: { orgId },
            OR: [
              { name: { contains: normalizedQuery, mode: 'insensitive' } },
              { email: { contains: normalizedQuery, mode: 'insensitive' } },
            ],
          },
          select: {
            id: true,
            name: true,
            email: true,
            stage: true,
            job: { select: { title: true } },
          },
          take: 3,
        })
      : Promise.resolve(
          [] as Array<{ id: string; name: string; email: string; stage: string; job: { title: string } }>,
        );

    const [
      employees,
      tasks,
      projects,
      meetings,
      courses,
      jobPostings,
      candidates,
      leaves,
      goals,
    ] = await Promise.all([
      this.prisma.employee.findMany({
        where: {
          orgId,
          isActive: true,
          OR: [
            { firstName: { contains: normalizedQuery, mode: 'insensitive' } },
            { lastName: { contains: normalizedQuery, mode: 'insensitive' } },
            { email: { contains: normalizedQuery, mode: 'insensitive' } },
            { title: { contains: normalizedQuery, mode: 'insensitive' } },
            { department: { name: { contains: normalizedQuery, mode: 'insensitive' } } },
          ],
        },
        select: {
          id: true, firstName: true, lastName: true,
          title: true, avatarUrl: true,
          department: { select: { name: true } },
        },
        take: 4,
      }),

      this.prisma.task.findMany({
        where: {
          orgId,
          title: { contains: normalizedQuery, mode: 'insensitive' },
          ...(isPrivileged ? {} : { assigneeId: ownId }),
        },
        select: { id: true, title: true, status: true, priority: true },
        take: 4,
      }),

      this.prisma.project.findMany({
        where: { orgId, name: { contains: normalizedQuery, mode: 'insensitive' } },
        select: { id: true, name: true, status: true },
        take: 3,
      }),

      this.prisma.meeting.findMany({
        where: {
          orgId,
          title: { contains: normalizedQuery, mode: 'insensitive' },
          ...(isPrivileged ? {} : { participants: { some: { employeeId: ownId } } }),
        },
        select: { id: true, title: true, type: true, scheduledAt: true, platform: true },
        take: 3,
      }),

      this.prisma.course.findMany({
        where: {
          orgId,
          isActive: true,
          OR: [
            { title: { contains: normalizedQuery, mode: 'insensitive' } },
            { category: { contains: normalizedQuery, mode: 'insensitive' } },
          ],
        },
        select: { id: true, title: true, category: true, level: true },
        take: 3,
      }),

      jobPostingsPromise,

      candidatesPromise,

      this.prisma.leaveRequest.findMany({
        where: isPrivileged
          ? { employee: { orgId }, reason: { contains: normalizedQuery, mode: 'insensitive' } }
          : { employeeId: ownId, reason: { contains: normalizedQuery, mode: 'insensitive' } },
        select: {
          id: true, leaveType: true, status: true, startDate: true,
          employee: { select: { firstName: true, lastName: true } },
        },
        take: 3,
      }),

      this.prisma.goal.findMany({
        where: isPrivileged
          ? { employee: { orgId }, title: { contains: normalizedQuery, mode: 'insensitive' } }
          : { employeeId: ownId, title: { contains: normalizedQuery, mode: 'insensitive' } },
        select: {
          id: true, title: true, status: true,
          employee: { select: { firstName: true, lastName: true } },
        },
        take: 3,
      }),
    ]);

    const result: SearchResults = {
      employees: employees.map((e) => ({
        id: e.id,
        type: 'employee',
        title: `${e.firstName} ${e.lastName}`,
        subtitle: e.department?.name ? `${e.title} · ${e.department.name}` : e.title,
        href: `/employees/profile?id=${e.id}`,
        avatarUrl: e.avatarUrl,
      })),

      tasks: tasks.map((t) => ({
        id: t.id,
        type: 'task',
        title: t.title,
        subtitle: `${t.status.replaceAll('_', ' ')} · ${t.priority}`,
        href: '/tasks',
      })),

      projects: projects.map((p) => ({
        id: p.id,
        type: 'project',
        title: p.name,
        subtitle: p.status.replaceAll('_', ' '),
        href: '/tasks/projects',
      })),

      meetings: meetings.map((m) => ({
        id: m.id,
        type: 'meeting',
        title: m.title,
        subtitle: `${m.type} · ${this.fmtDate(m.scheduledAt)} · ${m.platform}`,
        href: '/collaboration/meetings',
      })),

      courses: courses.map((c) => ({
        id: c.id,
        type: 'course',
        title: c.title,
        subtitle: `${c.category} · ${c.level}`,
        href: '/learning/courses',
      })),

      jobPostings: jobPostings.map((j) => ({
        id: j.id,
        type: 'job',
        title: j.title,
        subtitle: `${j.department} · ${j.isActive ? 'Active' : 'Closed'}`,
        href: '/recruitment',
      })),

      candidates: candidates.map((c) => ({
        id: c.id,
        type: 'candidate',
        title: c.name,
        subtitle: `${c.job.title} · ${c.stage}`,
        href: '/recruitment',
      })),

      leaves: leaves.map((l) => ({
        id: l.id,
        type: 'leave',
        title: `${l.employee.firstName} ${l.employee.lastName} — ${l.leaveType.replaceAll('_', ' ')} Leave`,
        subtitle: `${l.status} · from ${this.fmtDate(l.startDate)}`,
        href: '/leave',
      })),

      goals: goals.map((g) => ({
        id: g.id,
        type: 'goal',
        title: g.title,
        subtitle: `${g.status.replaceAll('_', ' ')} · ${g.employee.firstName} ${g.employee.lastName}`,
        href: '/performance',
      })),
    };

    this.setCachedResult(cacheKey, result);
    return result;
  }

  private getCachedResult(key: string): SearchResults | null {
    const existing = this.cache.get(key);
    if (!existing) return null;
    if (existing.expiresAt <= Date.now()) {
      this.cache.delete(key);
      return null;
    }
    return existing.data;
  }

  private setCachedResult(key: string, data: SearchResults): void {
    this.cache.set(key, {
      expiresAt: Date.now() + this.cacheTtlMs,
      data,
    });

    if (this.cache.size <= this.maxCacheEntries) return;

    const entries = [...this.cache.entries()];
    for (const [cacheKey, value] of entries) {
      if (value.expiresAt <= Date.now()) {
        this.cache.delete(cacheKey);
      }
    }

    if (this.cache.size <= this.maxCacheEntries) return;

    const overflow = this.cache.size - this.maxCacheEntries;
    const oldestKeys = [...this.cache.keys()].slice(0, overflow);
    for (const oldestKey of oldestKeys) {
      this.cache.delete(oldestKey);
    }
  }

  private fmtDate(d: Date): string {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}
