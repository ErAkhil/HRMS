"use server";

import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/session";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { hash } from "bcryptjs";
import { createAuditLog } from "./audit";
import { toActionError } from "./utils";

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

  try {
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
  } catch (err) {
    throw toActionError(err);
  }
}

export type EmployeeProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  title: string;
  employeeCode: string;
  employmentType: string;
  startDate: string;
  salary: number;
  avatarUrl: string | null;
  isActive: boolean;
  departmentId: string | null;
  department: { id: string; name: string; color: string } | null;
  manager: { firstName: string; lastName: string; title: string } | null;
  leaveBalances: Array<{ id: string; leaveType: string; total: number; used: number; pending: number; year: number }>;
  goals: Array<{ id: string; title: string; status: string; targetDate: string | null }>;
};

export async function getEmployee(id: string): Promise<EmployeeProfile | null> {
  const user = await requireAuth();

  try {
    const emp = await db.employee.findFirst({
      where: { id, orgId: user.orgId },
      include: {
        department: { select: { id: true, name: true, color: true } },
        manager: { select: { firstName: true, lastName: true, title: true } },
        leaveBalances: { where: { year: new Date().getFullYear() } },
        goals: { where: { status: { not: "COMPLETED" } }, take: 5 },
      },
    });

    if (!emp) return null;

    return {
      id: emp.id,
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      phone: emp.phone,
      title: emp.title,
      employeeCode: emp.employeeCode,
      employmentType: emp.employmentType,
      startDate: emp.startDate.toISOString(),
      salary: Number(emp.salary),
      avatarUrl: emp.avatarUrl,
      isActive: emp.isActive,
      departmentId: emp.departmentId,
      department: emp.department,
      manager: emp.manager,
      leaveBalances: emp.leaveBalances.map((lb) => ({
        id: lb.id,
        leaveType: lb.leaveType,
        total: lb.total,
        used: lb.used,
        pending: lb.pending,
        year: lb.year,
      })),
      goals: emp.goals.map((g) => ({
        id: g.id,
        title: g.title,
        status: g.status,
        targetDate: g.targetDate?.toISOString() ?? null,
      })),
    };
  } catch (err) {
    throw toActionError(err);
  }
}

const updateEmployeeSchema = z.object({
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
  phone: z.string().optional(),
  title: z.string().min(1, "Title required"),
  departmentId: z.string().optional(),
  employmentType: z.string().optional(),
  salary: z.coerce.number().positive("Salary must be positive"),
});

export async function updateEmployee(id: string, data: z.infer<typeof updateEmployeeSchema>) {
  const admin = await requireRole("SUPER_ADMIN", "HR_ADMIN");

  const parsed = updateEmployeeSchema.safeParse(data);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid data");

  try {
    const employee = await db.employee.findFirst({ where: { id, orgId: admin.orgId } });
    if (!employee) throw new Error("Employee not found");

    const updated = await db.employee.update({
      where: { id },
      data: {
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        phone: parsed.data.phone || null,
        title: parsed.data.title,
        departmentId: parsed.data.departmentId || null,
        employmentType: parsed.data.employmentType || "Full-time",
        salary: parsed.data.salary,
      },
    });

    await createAuditLog({
      action: "employee.updated",
      resource: `Employee ${updated.employeeCode}`,
      details: `Updated profile for ${updated.firstName} ${updated.lastName}`,
    });

    revalidatePath("/employees");
    revalidatePath("/employees/profile");
    return updated;
  } catch (err) {
    throw toActionError(err);
  }
}

export async function deactivateEmployee(id: string) {
  const admin = await requireRole("SUPER_ADMIN", "HR_ADMIN");

  try {
    const employee = await db.employee.findFirst({ where: { id, orgId: admin.orgId } });
    if (!employee) throw new Error("Employee not found");
    if (employee.id === admin.employeeId) throw new Error("Cannot deactivate your own account");

    await db.employee.update({ where: { id }, data: { isActive: false } });
    await db.user.update({ where: { id: employee.userId }, data: { isActive: false } });

    await createAuditLog({
      action: "employee.deactivated",
      resource: `Employee ${employee.employeeCode}`,
      details: `Deactivated ${employee.firstName} ${employee.lastName}`,
    });

    revalidatePath("/employees");
  } catch (err) {
    throw toActionError(err);
  }
}

export async function getDepartments() {
  const user = await requireAuth();
  try {
    return await db.department.findMany({
      where: { orgId: user.orgId },
      orderBy: { name: "asc" },
    });
  } catch (err) {
    throw toActionError(err);
  }
}

export async function createEmployee(data: z.infer<typeof employeeSchema>) {
  const admin = await requireRole("SUPER_ADMIN", "HR_ADMIN");

  const parsed = employeeSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid data");

  try {
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
  } catch (err) {
    throw toActionError(err);
  }
}
