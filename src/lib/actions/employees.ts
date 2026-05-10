"use server";

import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/session";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { hash } from "bcryptjs";
import { createAuditLog } from "./audit";

const employeeSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  title: z.string().min(1),
  departmentId: z.string().optional(),
  employmentType: z.string().default("Full-time"),
  startDate: z.string(),
  salary: z.coerce.number().positive(),
  phone: z.string().optional(),
  role: z.enum(["SUPER_ADMIN", "HR_ADMIN", "MANAGER", "EMPLOYEE"]).default("EMPLOYEE"),
});

export async function getEmployees() {
  const user = await requireAuth();

  const rows = await db.employee.findMany({
    where: { orgId: user.orgId, isActive: true },
    include: { department: { select: { name: true } } },
    orderBy: { firstName: "asc" },
  });

  return rows.map((e) => ({
    id: e.id,
    firstName: e.firstName,
    lastName: e.lastName,
    email: e.email,
    phone: e.phone,
    title: e.title,
    employeeCode: e.employeeCode,
    employmentType: e.employmentType,
    avatarUrl: e.avatarUrl,
    isActive: e.isActive,
    startDate: e.startDate.toISOString(),
    department: e.department,
  }));
}

export async function getEmployee(id: string) {
  const user = await requireAuth();

  return db.employee.findFirst({
    where: { id, orgId: user.orgId },
    include: {
      department: true,
      manager: { select: { firstName: true, lastName: true, title: true } },
      leaveBalances: { where: { year: new Date().getFullYear() } },
      goals: { where: { status: { not: "COMPLETED" } }, take: 5 },
    },
  });
}

export async function getDepartments() {
  const user = await requireAuth();
  return db.department.findMany({
    where: { orgId: user.orgId },
    orderBy: { name: "asc" },
  });
}

export async function createEmployee(data: z.infer<typeof employeeSchema>) {
  const admin = await requireRole("SUPER_ADMIN", "HR_ADMIN");

  const parsed = employeeSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid data");

  const existingUser = await db.user.findUnique({ where: { email: parsed.data.email } });
  if (existingUser) throw new Error("A user with this email already exists");

  // Generate a temporary password the admin can share with the employee
  const tempPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-4).toUpperCase();
  const passwordHash = await hash(tempPassword, 12);

  const newUser = await db.user.create({
    data: {
      email: parsed.data.email,
      passwordHash,
      role: parsed.data.role ?? "EMPLOYEE",
      orgId: admin.orgId,
    },
  });

  const count = await db.employee.count({ where: { orgId: admin.orgId } });
  const employeeCode = `EMP-${String(count + 1).padStart(4, "0")}`;

  const employee = await db.employee.create({
    data: {
      userId: newUser.id,
      orgId: admin.orgId,
      employeeCode,
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      title: parsed.data.title,
      departmentId: parsed.data.departmentId,
      employmentType: parsed.data.employmentType,
      startDate: new Date(parsed.data.startDate),
      salary: parsed.data.salary,
    },
  });

  await createAuditLog({
    action: "employee.created",
    resource: `Employee ${employeeCode}`,
    details: `Created ${parsed.data.firstName} ${parsed.data.lastName} (${parsed.data.email})`,
  });

  revalidatePath("/employees");
  // Return tempPassword so the UI can show it to the admin once
  return { ...employee, tempPassword };
}
