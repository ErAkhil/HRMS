"use server";

import { requireRole } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { api } from "@/lib/api-client";

type UserRole = "SUPER_ADMIN" | "HR_ADMIN" | "MANAGER" | "EMPLOYEE";

export type OrgUser = {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  name: string;
  avatarUrl: string | null;
  department: string;
  title: string;
};

export type Workflow = {
  id: string;
  name: string;
  description: string | null;
  trigger: string;
  isEnabled: boolean;
  runsCount: number;
  lastRunAt: string | null;
  createdAt: string;
};

export async function getOrgUsers(): Promise<OrgUser[]> {
  await requireRole("SUPER_ADMIN", "HR_ADMIN");
  return api.get<OrgUser[]>("/admin/users");
}

const updateRoleSchema = z.object({
  userId: z.string(),
  role: z.enum(["SUPER_ADMIN", "HR_ADMIN", "MANAGER", "EMPLOYEE"]),
});

export async function updateUserRole(data: z.infer<typeof updateRoleSchema>) {
  await requireRole("SUPER_ADMIN", "HR_ADMIN");

  const parsed = updateRoleSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid data");

  await api.patch<unknown>("/admin/users/role", parsed.data);
  revalidatePath("/admin/users");
}

export async function toggleUserActive(userId: string) {
  await requireRole("SUPER_ADMIN", "HR_ADMIN");
  await api.patch<unknown>(`/admin/users/${userId}/toggle-active`);
  revalidatePath("/admin/users");
}

export async function getWorkflows(): Promise<Workflow[]> {
  await requireRole("SUPER_ADMIN", "HR_ADMIN");
  return api.get<Workflow[]>("/admin/workflows");
}

const createWorkflowSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  trigger: z.string().min(2),
});

export async function createWorkflow(data: z.infer<typeof createWorkflowSchema>) {
  await requireRole("SUPER_ADMIN", "HR_ADMIN");

  const parsed = createWorkflowSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid data");

  await api.post<unknown>("/admin/workflows", parsed.data);
  revalidatePath("/admin/workflows");
}

export async function toggleWorkflow(workflowId: string) {
  await requireRole("SUPER_ADMIN", "HR_ADMIN");
  await api.patch<unknown>(`/admin/workflows/${workflowId}/toggle`);
  revalidatePath("/admin/workflows");
}

export async function getSecuritySettings() {
  await requireRole("SUPER_ADMIN", "HR_ADMIN");
  return api.get<unknown>("/admin/security");
}
