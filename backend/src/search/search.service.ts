import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async globalSearch(query: string, user: JwtPayload) {
    const { orgId, role, employeeId } = user;
    const isHR = role === 'HR_ADMIN' || role === 'SUPER_ADMIN';
    const isPrivileged = isHR || role === 'MANAGER';
    const ownId = employeeId ?? '__NONE__';

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
            { firstName: { contains: query, mode: 'insensitive' } },
            { lastName: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
            { title: { contains: query, mode: 'insensitive' } },
            { department: { name: { contains: query, mode: 'insensitive' } } },
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
          title: { contains: query, mode: 'insensitive' },
          ...(isPrivileged ? {} : { assigneeId: ownId }),
        },
        select: { id: true, title: true, status: true, priority: true },
        take: 4,
      }),

      this.prisma.project.findMany({
        where: { orgId, name: { contains: query, mode: 'insensitive' } },
        select: { id: true, name: true, status: true },
        take: 3,
      }),

      this.prisma.meeting.findMany({
        where: {
          orgId,
          title: { contains: query, mode: 'insensitive' },
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
            { title: { contains: query, mode: 'insensitive' } },
            { category: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: { id: true, title: true, category: true, level: true },
        take: 3,
      }),

      this.prisma.jobPosting.findMany({
        where: {
          orgId,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { department: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: { id: true, title: true, department: true, isActive: true },
        take: isHR ? 3 : 0,
      }),

      this.prisma.candidate.findMany({
        where: {
          job: { orgId },
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true, name: true, email: true, stage: true,
          job: { select: { title: true } },
        },
        take: isHR ? 3 : 0,
      }),

      this.prisma.leaveRequest.findMany({
        where: isPrivileged
          ? { employee: { orgId }, reason: { contains: query, mode: 'insensitive' } }
          : { employeeId: ownId, reason: { contains: query, mode: 'insensitive' } },
        select: {
          id: true, leaveType: true, status: true, startDate: true,
          employee: { select: { firstName: true, lastName: true } },
        },
        take: 3,
      }),

      this.prisma.goal.findMany({
        where: isPrivileged
          ? { employee: { orgId }, title: { contains: query, mode: 'insensitive' } }
          : { employeeId: ownId, title: { contains: query, mode: 'insensitive' } },
        select: {
          id: true, title: true, status: true,
          employee: { select: { firstName: true, lastName: true } },
        },
        take: 3,
      }),
    ]);

    return {
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
        subtitle: `${t.status.replace(/_/g, ' ')} · ${t.priority}`,
        href: '/tasks',
      })),

      projects: projects.map((p) => ({
        id: p.id,
        type: 'project',
        title: p.name,
        subtitle: p.status.replace(/_/g, ' '),
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
        title: `${l.employee.firstName} ${l.employee.lastName} — ${l.leaveType.replace(/_/g, ' ')} Leave`,
        subtitle: `${l.status} · from ${this.fmtDate(l.startDate)}`,
        href: '/leave',
      })),

      goals: goals.map((g) => ({
        id: g.id,
        type: 'goal',
        title: g.title,
        subtitle: `${g.status.replace(/_/g, ' ')} · ${g.employee.firstName} ${g.employee.lastName}`,
        href: '/performance',
      })),
    };
  }

  private fmtDate(d: Date): string {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}
