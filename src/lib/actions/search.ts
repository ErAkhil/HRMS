"use server";

import { db } from "@/lib/db";
import { requireAuth } from "@/lib/session";
import { toActionError } from "./utils";

export type SearchResultType =
  | "employee"
  | "task"
  | "project"
  | "meeting"
  | "course"
  | "job"
  | "candidate"
  | "leave"
  | "goal";

export type SearchResultItem = {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  href: string;
  avatarUrl?: string | null;
};

export type SearchResults = {
  employees: SearchResultItem[];
  tasks: SearchResultItem[];
  projects: SearchResultItem[];
  meetings: SearchResultItem[];
  courses: SearchResultItem[];
  jobPostings: SearchResultItem[];
  candidates: SearchResultItem[];
  leaves: SearchResultItem[];
  goals: SearchResultItem[];
};

function fmtDate(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export async function globalSearch(query: string): Promise<SearchResults> {
  const user = await requireAuth();

  if (query.trim().length < 2) {
    return {
      employees: [], tasks: [], projects: [], meetings: [],
      courses: [], jobPostings: [], candidates: [], leaves: [], goals: [],
    };
  }

  const q = query.trim();
  const { orgId, role, employeeId } = user;
  const isHR = role === "HR_ADMIN" || role === "SUPER_ADMIN";
  const isPrivileged = isHR || role === "MANAGER";
  const ownId = employeeId ?? "__NONE__";

  try {
    const [employees, tasks, projects, meetings, courses, jobPostings, candidates, leaves, goals] =
      await Promise.all([

        // Employees — all org members see colleagues
        db.employee.findMany({
          where: {
            orgId,
            isActive: true,
            OR: [
              { firstName: { contains: q, mode: "insensitive" } },
              { lastName: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
              { title: { contains: q, mode: "insensitive" } },
              { department: { name: { contains: q, mode: "insensitive" } } },
            ],
          },
          select: {
            id: true, firstName: true, lastName: true,
            title: true, avatarUrl: true,
            department: { select: { name: true } },
          },
          take: 4,
        }),

        // Tasks — employees see only assigned; managers/HR see all
        db.task.findMany({
          where: {
            orgId,
            title: { contains: q, mode: "insensitive" },
            ...(isPrivileged ? {} : { assigneeId: ownId }),
          },
          select: { id: true, title: true, status: true, priority: true },
          take: 4,
        }),

        // Projects — all org members
        db.project.findMany({
          where: {
            orgId,
            name: { contains: q, mode: "insensitive" },
          },
          select: { id: true, name: true, status: true },
          take: 3,
        }),

        // Meetings — employees see only theirs; managers/HR see all
        db.meeting.findMany({
          where: {
            orgId,
            title: { contains: q, mode: "insensitive" },
            ...(isPrivileged ? {} : { participants: { some: { employeeId: ownId } } }),
          },
          select: {
            id: true, title: true, type: true,
            scheduledAt: true, platform: true,
          },
          take: 3,
        }),

        // Courses — all org members
        db.course.findMany({
          where: {
            orgId,
            isActive: true,
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { category: { contains: q, mode: "insensitive" } },
            ],
          },
          select: { id: true, title: true, category: true, level: true },
          take: 3,
        }),

        // Job Postings — HR only (take: 0 for others = no DB work)
        db.jobPosting.findMany({
          where: {
            orgId,
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { department: { contains: q, mode: "insensitive" } },
            ],
          },
          select: { id: true, title: true, department: true, isActive: true },
          take: isHR ? 3 : 0,
        }),

        // Candidates — HR only
        db.candidate.findMany({
          where: {
            job: { orgId },
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
            ],
          },
          select: {
            id: true, name: true, email: true, stage: true,
            job: { select: { title: true } },
          },
          take: isHR ? 3 : 0,
        }),

        // Leave requests — employees see own; managers/HR see all
        db.leaveRequest.findMany({
          where: isPrivileged
            ? { employee: { orgId }, reason: { contains: q, mode: "insensitive" } }
            : { employeeId: ownId, reason: { contains: q, mode: "insensitive" } },
          select: {
            id: true, leaveType: true, status: true, startDate: true,
            employee: { select: { firstName: true, lastName: true } },
          },
          take: 3,
        }),

        // Goals — employees see own; managers/HR see all
        db.goal.findMany({
          where: isPrivileged
            ? { employee: { orgId }, title: { contains: q, mode: "insensitive" } }
            : { employeeId: ownId, title: { contains: q, mode: "insensitive" } },
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
        type: "employee",
        title: `${e.firstName} ${e.lastName}`,
        subtitle: e.department?.name ? `${e.title} · ${e.department.name}` : e.title,
        href: `/employees/profile?id=${e.id}`,
        avatarUrl: e.avatarUrl,
      })),

      tasks: tasks.map((t) => ({
        id: t.id,
        type: "task",
        title: t.title,
        subtitle: `${t.status.replace(/_/g, " ")} · ${t.priority}`,
        href: `/tasks`,
      })),

      projects: projects.map((p) => ({
        id: p.id,
        type: "project",
        title: p.name,
        subtitle: p.status.replace(/_/g, " "),
        href: `/tasks/projects`,
      })),

      meetings: meetings.map((m) => ({
        id: m.id,
        type: "meeting",
        title: m.title,
        subtitle: `${m.type} · ${fmtDate(m.scheduledAt)} · ${m.platform}`,
        href: `/collaboration/meetings`,
      })),

      courses: courses.map((c) => ({
        id: c.id,
        type: "course",
        title: c.title,
        subtitle: `${c.category} · ${c.level}`,
        href: `/learning/courses`,
      })),

      jobPostings: jobPostings.map((j) => ({
        id: j.id,
        type: "job",
        title: j.title,
        subtitle: `${j.department} · ${j.isActive ? "Active" : "Closed"}`,
        href: `/recruitment`,
      })),

      candidates: candidates.map((c) => ({
        id: c.id,
        type: "candidate",
        title: c.name,
        subtitle: `${c.job.title} · ${c.stage}`,
        href: `/recruitment`,
      })),

      leaves: leaves.map((l) => ({
        id: l.id,
        type: "leave",
        title: `${l.employee.firstName} ${l.employee.lastName} — ${l.leaveType.replace(/_/g, " ")} Leave`,
        subtitle: `${l.status} · from ${fmtDate(l.startDate)}`,
        href: `/leave`,
      })),

      goals: goals.map((g) => ({
        id: g.id,
        type: "goal",
        title: g.title,
        subtitle: `${g.status.replace(/_/g, " ")} · ${g.employee.firstName} ${g.employee.lastName}`,
        href: `/performance`,
      })),
    };
  } catch (err) {
    throw toActionError(err);
  }
}
