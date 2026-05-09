"use server";

import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/session";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "./audit";

const claimSchema = z.object({
  category: z.enum(["TRAVEL", "MEALS", "EQUIPMENT", "MEDICAL", "TRAINING", "OTHER"]),
  amount: z.coerce.number().positive(),
  date: z.string(),
  description: z.string().min(5),
});

export async function getClaims(status?: string) {
  const user = await requireAuth();

  const where: Record<string, unknown> = {
    employee: { orgId: user.orgId },
  };

  if (user.role === "EMPLOYEE" && user.employeeId) {
    where.employeeId = user.employeeId;
  }

  if (status && status !== "All") {
    where.status = status;
  }

  return db.claim.findMany({
    where,
    include: {
      employee: {
        select: { firstName: true, lastName: true, avatarUrl: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function submitClaim(data: z.infer<typeof claimSchema>) {
  const user = await requireAuth();
  if (!user.employeeId) throw new Error("No employee profile");

  const parsed = claimSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid data");

  const claim = await db.claim.create({
    data: {
      employeeId: user.employeeId,
      category: parsed.data.category,
      amount: parsed.data.amount,
      date: new Date(parsed.data.date),
      description: parsed.data.description,
    },
  });

  revalidatePath("/payroll/reimbursements");
  return claim;
}

export async function approveClaim(claimId: string) {
  const user = await requireRole("SUPER_ADMIN", "HR_ADMIN", "MANAGER");

  const claim = await db.claim.update({
    where: { id: claimId },
    data: { status: "APPROVED", reviewedBy: user.id, reviewedAt: new Date() },
  });

  await createAuditLog({
    action: "claim.approved",
    resource: `Claim ${claimId}`,
    details: `Approved ₹${claim.amount}`,
  });

  revalidatePath("/payroll/reimbursements");
  return claim;
}
