"use server";

import { requireAuth, requireRole } from "@/lib/session";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { api } from "@/lib/api-client";

const claimSchema = z.object({
  category: z.enum(["TRAVEL", "MEALS", "EQUIPMENT", "MEDICAL", "TRAINING", "OTHER"]),
  amount: z.coerce.number().positive(),
  date: z.string(),
  description: z.string().min(5),
});

export type Claim = {
  id: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  status: string;
  employee: { firstName: string; lastName: string };
};

export async function getClaims(status?: string): Promise<Claim[]> {
  await requireAuth();
  const qs = status && status !== "All" ? `?status=${status}` : "";
  return api.get<Claim[]>(`/reimbursements${qs}`);
}

export async function submitClaim(data: z.infer<typeof claimSchema>) {
  await requireAuth();

  const parsed = claimSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid data");

  const result = await api.post<unknown>("/reimbursements", parsed.data);
  revalidatePath("/payroll/reimbursements");
  return result;
}

export async function approveClaim(claimId: string) {
  await requireRole("SUPER_ADMIN", "HR_ADMIN", "MANAGER");
  const result = await api.patch<unknown>(`/reimbursements/${claimId}/approve`);
  revalidatePath("/payroll/reimbursements");
  return result;
}

export async function rejectClaim(claimId: string) {
  await requireRole("SUPER_ADMIN", "HR_ADMIN", "MANAGER");
  const result = await api.patch<unknown>(`/reimbursements/${claimId}/reject`);
  revalidatePath("/payroll/reimbursements");
  return result;
}
