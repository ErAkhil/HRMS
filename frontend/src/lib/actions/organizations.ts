"use server";

import { requireRole } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { api } from "@/lib/api-client";

export type Org = {
  id: string;
  name: string;
  slug: string;
  plan: string;
  logoUrl: string | null;
  address: string | null;
  createdAt: string;
  userCount: number;
  employeeCount: number;
  subscriptionStatus: string | null;
  subscriptionEnds: string | null;
};

export async function getOrganizations(): Promise<Org[]> {
  await requireRole("SUPER_ADMIN");
  return api.get<Org[]>("/organizations");
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

  const result = await api.post<{ id: string; name: string }>("/organizations", parsed.data);
  revalidatePath("/admin/organizations");
  return result;
}

const updatePlanSchema = z.object({
  orgId: z.string(),
  plan: z.enum(["BASIC", "PRO", "PRO_PLUS", "PRO_MAX"]),
});

export async function updateOrgPlan(data: z.infer<typeof updatePlanSchema>) {
  await requireRole("SUPER_ADMIN");

  const parsed = updatePlanSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid data");

  await api.patch<unknown>("/organizations/plan", parsed.data);
  revalidatePath("/admin/organizations");
}

export async function deleteOrganization(orgId: string) {
  await requireRole("SUPER_ADMIN");
  await api.delete<unknown>(`/organizations/${orgId}`);
  revalidatePath("/admin/organizations");
}
