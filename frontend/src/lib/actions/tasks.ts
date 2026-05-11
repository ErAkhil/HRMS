"use server";

import { requireAuth } from "@/lib/session";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { api } from "@/lib/api-client";

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

const projectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
});

export async function getMyTasks(): Promise<SerializedTask[]> {
  await requireAuth();
  return api.get<SerializedTask[]>("/tasks/my");
}

export async function getOrgTasks(): Promise<SerializedTask[]> {
  await requireAuth();
  return api.get<SerializedTask[]>("/tasks");
}

export async function getProjects(): Promise<SerializedProject[]> {
  await requireAuth();
  return api.get<SerializedProject[]>("/tasks/projects");
}

export type TeamMember = { name: string; avatarUrl: string | null; tasks: number; done: number };

export async function getTeamTaskWorkload(): Promise<TeamMember[]> {
  await requireAuth();
  return api.get<TeamMember[]>("/tasks/workload");
}

export async function createTask(data: z.infer<typeof taskSchema>) {
  await requireAuth();

  const parsed = taskSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid data");

  const result = await api.post<unknown>("/tasks", parsed.data);
  revalidatePath("/tasks");
  return result;
}

export async function updateTaskStatus(taskId: string, status: "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE") {
  await requireAuth();
  await api.patch<unknown>(`/tasks/${taskId}/status`, { status });
  revalidatePath("/tasks");
  revalidatePath("/tasks/kanban");
}

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]).optional(),
  dueDate: z.string().optional(),
});

export async function updateTask(taskId: string, data: z.infer<typeof updateTaskSchema>) {
  await requireAuth();
  const parsed = updateTaskSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid data");
  await api.patch<unknown>(`/tasks/${taskId}`, parsed.data);
  revalidatePath("/tasks");
  revalidatePath("/tasks/kanban");
}

export async function deleteTask(taskId: string) {
  await requireAuth();
  await api.delete<unknown>(`/tasks/${taskId}`);
  revalidatePath("/tasks");
  revalidatePath("/tasks/kanban");
}

export async function createProject(data: z.infer<typeof projectSchema>) {
  await requireAuth();

  const parsed = projectSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid data");

  await api.post<unknown>("/tasks/projects", parsed.data);
  revalidatePath("/tasks/projects");
}
