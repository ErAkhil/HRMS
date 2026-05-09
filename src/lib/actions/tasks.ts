"use server";

import { db } from "@/lib/db";
import { requireAuth } from "@/lib/session";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]).default("MEDIUM"),
  dueDate: z.string().optional(),
  assigneeId: z.string().optional(),
  projectId: z.string().optional(),
});

export async function getMyTasks() {
  const user = await requireAuth();
  if (!user.employeeId) return [];

  return db.task.findMany({
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
}

export async function getProjects() {
  const user = await requireAuth();

  return db.project.findMany({
    where: { orgId: user.orgId },
    include: {
      _count: { select: { tasks: true } },
      tasks: {
        select: { status: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createTask(data: z.infer<typeof taskSchema>) {
  const user = await requireAuth();
  if (!user.employeeId) throw new Error("No employee profile");

  const parsed = taskSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid data");

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
}

export async function updateTaskStatus(taskId: string, status: "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE") {
  const user = await requireAuth();

  await db.task.updateMany({
    where: { id: taskId, orgId: user.orgId },
    data: { status, updatedAt: new Date() },
  });

  revalidatePath("/tasks");
  revalidatePath("/tasks/kanban");
}
