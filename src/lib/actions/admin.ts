"use server";

import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAuditLog } from "./audit";

export async function getOrgUsers() {
  const admin = await requireRole("SUPER_ADMIN", "HR_ADMIN");

  const users = await db.user.findMany({
    where: { orgId: admin.orgId },
    include: {
      employee: {
        select: {
          firstName: true,
          lastName: true,
          avatarUrl: true,
          department: { select: { name: true } },
          title: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return users.map((u) => ({
    id: u.id,
    email: u.email,
    role: u.role,
    isActive: u.isActive,
    createdAt: u.createdAt,
    lastLoginAt: u.lastLoginAt,
    name: u.employee ? `${u.employee.firstName} ${u.employee.lastName}` : u.email.split("@")[0],
    avatarUrl: u.employee?.avatarUrl ?? null,
    department: u.employee?.department?.name ?? "—",
    title: u.employee?.title ?? "—",
  }));
}

const updateRoleSchema = z.object({
  userId: z.string(),
  role: z.enum(["SUPER_ADMIN", "HR_ADMIN", "MANAGER", "EMPLOYEE"]),
});

export async function updateUserRole(data: z.infer<typeof updateRoleSchema>) {
  const admin = await requireRole("SUPER_ADMIN", "HR_ADMIN");

  const parsed = updateRoleSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid data");

  const target = await db.user.findUnique({
    where: { id: parsed.data.userId },
    select: { orgId: true, role: true },
  });

  if (!target || target.orgId !== admin.orgId) throw new Error("User not found");

  await db.user.update({
    where: { id: parsed.data.userId },
    data: { role: parsed.data.role },
  });

  await createAuditLog({
    action: "user.role_changed",
    resource: `User ${parsed.data.userId}`,
    details: `Role changed to ${parsed.data.role}`,
  });

  revalidatePath("/admin/users");
}

export async function toggleUserActive(userId: string) {
  const admin = await requireRole("SUPER_ADMIN", "HR_ADMIN");

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { orgId: true, isActive: true },
  });

  if (!user || user.orgId !== admin.orgId) throw new Error("User not found");

  await db.user.update({
    where: { id: userId },
    data: { isActive: !user.isActive },
  });

  await createAuditLog({
    action: user.isActive ? "user.deactivated" : "user.activated",
    resource: `User ${userId}`,
    details: `User ${user.isActive ? "deactivated" : "activated"}`,
  });

  revalidatePath("/admin/users");
}

export async function getWorkflows() {
  const admin = await requireRole("SUPER_ADMIN", "HR_ADMIN");

  return db.workflow.findMany({
    where: { orgId: admin.orgId },
    orderBy: { createdAt: "desc" },
  });
}

const createWorkflowSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  trigger: z.string().min(2),
});

export async function createWorkflow(data: z.infer<typeof createWorkflowSchema>) {
  const admin = await requireRole("SUPER_ADMIN", "HR_ADMIN");

  const parsed = createWorkflowSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid data");

  await db.workflow.create({
    data: {
      orgId: admin.orgId,
      name: parsed.data.name,
      description: parsed.data.description,
      trigger: parsed.data.trigger,
    },
  });

  revalidatePath("/admin/workflows");
}

export async function toggleWorkflow(workflowId: string) {
  const admin = await requireRole("SUPER_ADMIN", "HR_ADMIN");

  const wf = await db.workflow.findUnique({
    where: { id: workflowId },
    select: { orgId: true, isEnabled: true },
  });

  if (!wf || wf.orgId !== admin.orgId) throw new Error("Not found");

  await db.workflow.update({
    where: { id: workflowId },
    data: { isEnabled: !wf.isEnabled },
  });

  revalidatePath("/admin/workflows");
}
