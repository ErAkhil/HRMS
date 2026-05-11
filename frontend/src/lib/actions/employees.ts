"use server";

import { requireAuth, requireRole } from "@/lib/session";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { api } from "@/lib/api-client";

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

export type SerializedEmployee = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  title: string;
  employeeCode: string;
  employmentType: string;
  avatarUrl: string | null;
  isActive: boolean;
  startDate: string;
  department: { name: string } | null;
};

export type Department = { id: string; name: string };

export type MyProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  department: string | null;
  avatarUrl: string | null;
  startDate: string;
  employmentType: string;
  goalsDone: number;
  tasksDone: number;
  coursesCount: number;
  certsCount: number;
};

export async function getEmployees(): Promise<SerializedEmployee[]> {
  await requireAuth();
  return api.get<SerializedEmployee[]>("/employees");
}

export async function getEmployee(id: string): Promise<EmployeeProfile | null> {
  await requireAuth();
  return api.get<EmployeeProfile | null>(`/employees/${id}`);
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
  await requireRole("SUPER_ADMIN", "HR_ADMIN");

  const parsed = updateEmployeeSchema.safeParse(data);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid data");

  const result = await api.patch<unknown>(`/employees/${id}`, parsed.data);
  revalidatePath("/employees");
  revalidatePath("/employees/profile");
  return result;
}

export async function deactivateEmployee(id: string) {
  await requireRole("SUPER_ADMIN", "HR_ADMIN");
  await api.patch<unknown>(`/employees/${id}/deactivate`);
  revalidatePath("/employees");
}

export async function getDepartments(): Promise<Department[]> {
  await requireAuth();
  return api.get<Department[]>("/employees/departments");
}

export async function createEmployee(data: z.infer<typeof employeeSchema>) {
  await requireRole("SUPER_ADMIN", "HR_ADMIN");

  const parsed = employeeSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid data");

  const result = await api.post<{ tempPassword: string }>("/employees", parsed.data);
  revalidatePath("/employees");
  return result;
}

export async function getMyProfile(): Promise<MyProfile | null> {
  await requireAuth();
  return api.get<MyProfile | null>("/employees/me/profile");
}

export type OrgEmployee = {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  avatarUrl: string | null;
  managerId: string | null;
  department: { name: string } | null;
};

export async function getOrgChartData(): Promise<OrgEmployee[]> {
  await requireAuth();
  return api.get<OrgEmployee[]>("/employees/org-chart");
}
