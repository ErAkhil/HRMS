"use server";

import { requireAuth, requireRole } from "@/lib/session";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { api } from "@/lib/api-client";

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
  await requireAuth();
  return api.get<DepartmentRow[]>("/departments");
}

export async function getDepartmentWithEmployees(departmentId: string) {
  await requireAuth();
  return api.get<unknown>(`/departments/${departmentId}`);
}

export async function createDepartment(data: z.infer<typeof deptSchema>) {
  await requireRole("SUPER_ADMIN", "HR_ADMIN");

  const parsed = deptSchema.safeParse(data);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  const result = await api.post<unknown>("/departments", parsed.data);
  revalidatePath("/employees/departments");
  revalidatePath("/employees");
  return result;
}

export async function updateDepartment(id: string, data: z.infer<typeof deptSchema>) {
  await requireRole("SUPER_ADMIN", "HR_ADMIN");

  const parsed = deptSchema.safeParse(data);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  const result = await api.patch<unknown>(`/departments/${id}`, parsed.data);
  revalidatePath("/employees/departments");
  revalidatePath("/employees");
  return result;
}

export async function deleteDepartment(id: string) {
  await requireRole("SUPER_ADMIN", "HR_ADMIN");
  await api.delete<unknown>(`/departments/${id}`);
  revalidatePath("/employees/departments");
  revalidatePath("/employees");
}
