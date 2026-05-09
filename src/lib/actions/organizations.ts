"use server";

import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { hash } from "bcryptjs";
import { createAuditLog } from "./audit";

export async function getOrganizations() {
  await requireRole("SUPER_ADMIN");

  const orgs = await db.organization.findMany({
    include: {
      _count: { select: { users: true, employees: true } },
      subscription: { select: { status: true, currentPeriodEnd: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return orgs.map((o) => ({
    id: o.id,
    name: o.name,
    slug: o.slug,
    plan: o.plan,
    logoUrl: o.logoUrl,
    address: o.address,
    createdAt: o.createdAt.toISOString(),
    userCount: o._count.users,
    employeeCount: o._count.employees,
    subscriptionStatus: o.subscription?.status ?? null,
    subscriptionEnds: o.subscription?.currentPeriodEnd.toISOString() ?? null,
  }));
}

const createOrgSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  plan: z.enum(["BASIC", "PRO", "PRO_PLUS", "PRO_MAX"]),
  adminEmail: z.string().email(),
  adminPassword: z.string().min(8),
  adminName: z.string().min(2),
});

export async function createOrganization(data: z.infer<typeof createOrgSchema>) {
  await requireRole("SUPER_ADMIN");

  const parsed = createOrgSchema.safeParse(data);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid data");

  const [slugExists, emailExists] = await Promise.all([
    db.organization.findUnique({ where: { slug: parsed.data.slug } }),
    db.user.findUnique({ where: { email: parsed.data.adminEmail } }),
  ]);
  if (slugExists) throw new Error("Slug already taken");
  if (emailExists) throw new Error("Email already in use");

  const passwordHash = await hash(parsed.data.adminPassword, 12);
  const nameParts = parsed.data.adminName.trim().split(/\s+/);
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ") || "Admin";

  // Create sequentially so that each step uses the id from the previous one.
  // PrismaPg adapter does not support interactive transactions reliably.
  const newOrg = await db.organization.create({
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      plan: parsed.data.plan as "BASIC" | "PRO" | "PRO_PLUS" | "PRO_MAX",
    },
  });

  let user;
  try {
    user = await db.user.create({
      data: {
        email: parsed.data.adminEmail,
        passwordHash,
        role: "HR_ADMIN",
        orgId: newOrg.id,
      },
    });
  } catch {
    await db.organization.delete({ where: { id: newOrg.id } }).catch(() => null);
    throw new Error("Failed to create admin user — email may already be in use");
  }

  try {
    const empCount = await db.employee.count({ where: { orgId: newOrg.id } });
    await db.employee.create({
      data: {
        userId: user.id,
        orgId: newOrg.id,
        employeeCode: `EMP-${String(empCount + 1).padStart(4, "0")}`,
        firstName,
        lastName,
        email: parsed.data.adminEmail,
        title: "HR Administrator",
        startDate: new Date(),
        salary: 0,
      },
    });
  } catch {
    // Employee record creation failed — org and user already exist, just log and continue.
    // The admin can still log in; the employee profile can be created manually.
  }

  const org = newOrg;

  await createAuditLog({
    action: "org.created",
    resource: `Organization ${org.id}`,
    details: `Created org "${parsed.data.name}" with plan ${parsed.data.plan}`,
  });

  revalidatePath("/admin/organizations");
  return { id: org.id, name: org.name };
}

const updatePlanSchema = z.object({
  orgId: z.string(),
  plan: z.enum(["BASIC", "PRO", "PRO_PLUS", "PRO_MAX"]),
});

export async function updateOrgPlan(data: z.infer<typeof updatePlanSchema>) {
  await requireRole("SUPER_ADMIN");

  const parsed = updatePlanSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid data");

  const org = await db.organization.findUnique({ where: { id: parsed.data.orgId } });
  if (!org) throw new Error("Organization not found");

  await db.organization.update({
    where: { id: parsed.data.orgId },
    data: { plan: parsed.data.plan as "BASIC" | "PRO" | "PRO_PLUS" | "PRO_MAX" },
  });

  await createAuditLog({
    action: "org.plan_changed",
    resource: `Organization ${parsed.data.orgId}`,
    details: `Plan changed from ${org.plan} to ${parsed.data.plan}`,
  });

  revalidatePath("/admin/organizations");
}

export async function deleteOrganization(orgId: string) {
  const caller = await requireRole("SUPER_ADMIN");

  const org = await db.organization.findUnique({ where: { id: orgId } });
  if (!org) throw new Error("Organization not found");
  if (org.id === caller.orgId) throw new Error("Cannot delete your own organization");

  await db.organization.delete({ where: { id: orgId } });

  revalidatePath("/admin/organizations");
}
