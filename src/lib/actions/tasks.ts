"use server";

import { db } from "@/lib/db";
import { requireAuth } from "@/lib/session";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { toActionError } from "./utils";

export type SerializedTask = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
  project: { name: string } | null;
  assignee: { firstName: string; lastName: string; avatarUrl: string | null } | null;
};

export type SerializedProject = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  startDate: string | null;
  dueDate: string | null;
  totalTasks: number;
  doneTasks: number;
  progress: number;
};

const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]).default("MEDIUM"),
  dueDate: z.string().optional(),
  assigneeId: z.string().optional(),
  projectId: z.string().optional(),
});

export async function getMyTasks(): Promise<SerializedTask[]> {
  const user = await requireAuth();
  if (!user.employeeId) return [];

  try {
    const rows = await db.task.findMany({
      where: {
        orgId: user.orgId,
        OR: [
          { assigneeId: user.employeeId },
          { createdById: user.employeeId },
        ],
      },
      include: {
        assignee: { select: { firstName: true, lastName: true, avatarUrl: true } },
        project: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return rows.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      dueDate: t.dueDate?.toISOString() ?? null,
      project: t.project,
      assignee: t.assignee,
    }));
  } catch (err) {
    throw toActionError(err);
  }
}

export async function getProjects(): Promise<SerializedProject[]> {
  const user = await requireAuth();

  try {
    const rows = await db.project.findMany({
      where: { orgId: user.orgId },
      include: {
        _count: { select: { tasks: true } },
        tasks: { select: { status: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return rows.map((p) => {
      const total = p._count.tasks;
      const done = p.tasks.filter((t) => t.status === "DONE").length;
      return {
        id: p.id,
        name: p.name,
        description: p.description,
        status: p.status,
        startDate: p.startDate?.toISOString() ?? null,
        dueDate: p.dueDate?.toISOString() ?? null,
        totalTasks: total,
        doneTasks: done,
        progress: total > 0 ? Math.round((done / total) * 100) : 0,
      };
    });
  } catch (err) {
    throw toActionError(err);
  }
}

export async function createTask(data: z.infer<typeof taskSchema>) {
  const user = await requireAuth();
  if (!user.employeeId) throw new Error("No employee profile");

  const parsed = taskSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid data");

  try {
    const task = await db.task.create({
      data: {
        orgId: user.orgId,
        title: parsed.data.title,
        description: parsed.data.description,
        priority: parsed.data.priority,
        dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : undefined,
        assigneeId: parsed.data.assigneeId,
        projectId: parsed.data.projectId,
        createdById: user.employeeId,
      },
    });

    revalidatePath("/tasks");
    return task;
  } catch (err) {
    throw toActionError(err);
  }
}

export async function updateTaskStatus(taskId: string, status: "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE") {
  const user = await requireAuth();

  try {
    await db.task.updateMany({
      where: { id: taskId, orgId: user.orgId },
      data: { status, updatedAt: new Date() },
    });

    revalidatePath("/tasks");
    revalidatePath("/tasks/kanban");
  } catch (err) {
    throw toActionError(err);
  }
}

const projectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
});

export async function createProject(data: z.infer<typeof projectSchema>) {
  const user = await requireAuth();

  const parsed = projectSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid data");

  try {
    await db.project.create({
      data: {
        orgId: user.orgId,
        name: parsed.data.name,
        description: parsed.data.description,
        startDate: parsed.data.startDate ? new Date(parsed.data.startDate) : undefined,
        dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : undefined,
      },
    });

    revalidatePath("/tasks/projects");
  } catch (err) {
    throw toActionError(err);
  }
}

export async function getOrgTasks(): Promise<SerializedTask[]> {
  const user = await requireAuth();

  try {
    const rows = await db.task.findMany({
      where: { orgId: user.orgId },
      include: {
        assignee: { select: { firstName: true, lastName: true, avatarUrl: true } },
        project: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return rows.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      dueDate: t.dueDate?.toISOString() ?? null,
      project: t.project,
      assignee: t.assignee,
    }));
  } catch (err) {
    throw toActionError(err);
  }
}
