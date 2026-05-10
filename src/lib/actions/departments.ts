"use server";

import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/session";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "./audit";
import { toActionError } from "./utils";

const deptSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  description: z.string().max(500, "Description too long").optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color")
    .default("#6366F1"),
  headId: z.string().optional(),
});

export type DepartmentRow = {
  id: string;
  name: string;
  description: string | null;
  color: string;
  headId: string | null;
  head: {
    id: string;
    firstName: string;
    lastName: string;
    title: string;
    avatarUrl: string | null;
  } | null;
  employeeCount: number;
  sampleEmployees: { id: string; firstName: string; lastName: string; avatarUrl: string | null }[];
  createdAt: string;
};

export async function getDepartments(): Promise<DepartmentRow[]> {
  const user = await requireAuth();

  try {
    const departments = await db.department.findMany({
      where: { orgId: user.orgId },
      include: {
        employees: {
          where: { isActive: true },
          select: { id: true, avatarUrl: true, firstName: true, lastName: true },
          orderBy: { firstName: "asc" },
        },
      },
      orderBy: { name: "asc" },
    });

    // Batch-fetch all department heads
    const headIds = departments.map((d) => d.headId).filter((id): id is string => !!id);
    const heads =
      headIds.length > 0
        ? await db.employee.findMany({
            where: { id: { in: headIds }, orgId: user.orgId },
            select: { id: true, firstName: true, lastName: true, title: true, avatarUrl: true },
          })
        : [];
    const headMap = new Map(heads.map((h) => [h.id, h]));

    return departments.map((dept) => ({
      id: dept.id,
      name: dept.name,
      description: dept.description,
      color: dept.color,
      headId: dept.headId,
      head: dept.headId ? (headMap.get(dept.headId) ?? null) : null,
      employeeCount: dept.employees.length,
      sampleEmployees: dept.employees.slice(0, 4),
      createdAt: dept.createdAt.toISOString(),
    }));
  } catch (err) {
    throw toActionError(err);
  }
}

export async function getDepartmentWithEmployees(departmentId: string) {
  const user = await requireAuth();

  try {
    const dept = await db.department.findFirst({
      where: { id: departmentId, orgId: user.orgId },
      include: {
        employees: {
          where: { isActive: true },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            title: true,
            avatarUrl: true,
            email: true,
            employeeCode: true,
            employmentType: true,
            startDate: true,
          },
          orderBy: { firstName: "asc" },
        },
      },
    });

    if (!dept) return null;

    return {
      ...dept,
      employees: dept.employees.map((e) => ({
        ...e,
        startDate: e.startDate.toISOString(),
      })),
    };
  } catch (err) {
    throw toActionError(err);
  }
}

export async function createDepartment(data: z.infer<typeof deptSchema>) {
  const user = await requireRole("SUPER_ADMIN", "HR_ADMIN");

  const parsed = deptSchema.safeParse(data);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  try {
    const existing = await db.department.findUnique({
      where: { name_orgId: { name: parsed.data.name, orgId: user.orgId } },
    });
    if (existing) throw new Error(`Department "${parsed.data.name}" already exists`);

    if (parsed.data.headId) {
      const head = await db.employee.findFirst({
        where: { id: parsed.data.headId, orgId: user.orgId, isActive: true },
      });
      if (!head) throw new Error("Selected head employee not found");
    }

    const dept = await db.department.create({
      data: {
        name: parsed.data.name,
        description: parsed.data.description || null,
        color: parsed.data.color,
        headId: parsed.data.headId || null,
        orgId: user.orgId,
      },
    });

    await createAuditLog({
      action: "department.created",
      resource: `Department: ${dept.name}`,
      details: `Created department "${dept.name}"`,
    });

    revalidatePath("/employees/departments");
    revalidatePath("/employees");
    return dept;
  } catch (err) {
    throw toActionError(err);
  }
}

export async function updateDepartment(id: string, data: z.infer<typeof deptSchema>) {
  const user = await requireRole("SUPER_ADMIN", "HR_ADMIN");

  const parsed = deptSchema.safeParse(data);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  try {
    const current = await db.department.findFirst({
      where: { id, orgId: user.orgId },
    });
    if (!current) throw new Error("Department not found");

    // Unique name check (exclude self)
    if (parsed.data.name !== current.name) {
      const nameConflict = await db.department.findFirst({
        where: { name: parsed.data.name, orgId: user.orgId, id: { not: id } },
      });
      if (nameConflict) throw new Error(`Department "${parsed.data.name}" already exists`);
    }

    if (parsed.data.headId) {
      const head = await db.employee.findFirst({
        where: { id: parsed.data.headId, orgId: user.orgId, isActive: true },
      });
      if (!head) throw new Error("Selected head employee not found");
    }

    const dept = await db.department.update({
      where: { id },
      data: {
        name: parsed.data.name,
        description: parsed.data.description || null,
        color: parsed.data.color,
        headId: parsed.data.headId || null,
      },
    });

    await createAuditLog({
      action: "department.updated",
      resource: `Department: ${dept.name}`,
      details: `Updated department "${dept.name}"`,
    });

    revalidatePath("/employees/departments");
    revalidatePath("/employees");
    return dept;
  } catch (err) {
    throw toActionError(err);
  }
}

export async function deleteDepartment(id: string) {
  const user = await requireRole("SUPER_ADMIN", "HR_ADMIN");

  try {
    const dept = await db.department.findFirst({
      where: { id, orgId: user.orgId },
      include: {
        employees: {
          where: { isActive: true },
          select: { id: true },
        },
      },
    });
    if (!dept) throw new Error("Department not found");

    if (dept.employees.length > 0) {
      throw new Error(
        `Cannot delete "${dept.name}" — ${dept.employees.length} active employee${dept.employees.length !== 1 ? "s" : ""} assigned. Reassign them first.`
      );
    }

    await db.department.delete({ where: { id } });

    await createAuditLog({
      action: "department.deleted",
      resource: `Department: ${dept.name}`,
      details: `Deleted department "${dept.name}"`,
    });

    revalidatePath("/employees/departments");
    revalidatePath("/employees");
  } catch (err) {
    throw toActionError(err);
  }
}
