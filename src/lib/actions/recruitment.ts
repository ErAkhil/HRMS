"use server";

import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const jobSchema = z.object({
  title: z.string().min(1),
  department: z.string().min(1),
  location: z.string().min(1),
  type: z.string().default("Full-time"),
  description: z.string().optional(),
});

export async function getJobPostings() {
  const user = await requireRole("SUPER_ADMIN", "HR_ADMIN", "MANAGER");

  return db.jobPosting.findMany({
    where: { orgId: user.orgId },
    include: { _count: { select: { candidates: true } } },
    orderBy: { postedAt: "desc" },
  });
}

export async function getCandidates(jobId?: string) {
  const user = await requireRole("SUPER_ADMIN", "HR_ADMIN", "MANAGER");

  return db.candidate.findMany({
    where: {
      job: { orgId: user.orgId },
      ...(jobId ? { jobId } : {}),
    },
    include: { job: { select: { title: true, department: true } } },
    orderBy: { appliedAt: "desc" },
  });
}

export async function updateCandidateStage(
  candidateId: string,
  stage: "APPLIED" | "SCREENING" | "INTERVIEW" | "OFFER" | "HIRED" | "REJECTED",
) {
  const user = await requireRole("SUPER_ADMIN", "HR_ADMIN", "MANAGER");

  await db.candidate.updateMany({
    where: {
      id: candidateId,
      job: { orgId: user.orgId },
    },
    data: { stage, updatedAt: new Date() },
  });

  revalidatePath("/recruitment");
}
