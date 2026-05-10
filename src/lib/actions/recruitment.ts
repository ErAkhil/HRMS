"use server";

import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { toActionError } from "./utils";

export type SerializedJobPosting = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  isActive: boolean;
  postedAt: string;
  candidateCount: number;
};

export type SerializedCandidate = {
  id: string;
  name: string;
  email: string;
  stage: string;
  source: string | null;
  appliedAt: string;
  jobTitle: string;
  jobDepartment: string;
};

const jobSchema = z.object({
  title: z.string().min(1),
  department: z.string().min(1),
  location: z.string().min(1),
  type: z.string().default("Full-time"),
  description: z.string().optional(),
});

const candidateSchema = z.object({
  jobId: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  source: z.string().optional(),
});

export async function getJobPostings(): Promise<SerializedJobPosting[]> {
  const user = await requireRole("SUPER_ADMIN", "HR_ADMIN", "MANAGER");

  try {
    const rows = await db.jobPosting.findMany({
      where: { orgId: user.orgId },
      include: { _count: { select: { candidates: true } } },
      orderBy: { postedAt: "desc" },
    });
    return rows.map((j) => ({
      id: j.id,
      title: j.title,
      department: j.department,
      location: j.location,
      type: j.type,
      isActive: j.isActive,
      postedAt: j.postedAt.toISOString(),
      candidateCount: j._count.candidates,
    }));
  } catch (err) {
    throw toActionError(err);
  }
}

export async function getCandidates(jobId?: string): Promise<SerializedCandidate[]> {
  const user = await requireRole("SUPER_ADMIN", "HR_ADMIN", "MANAGER");

  try {
    const rows = await db.candidate.findMany({
      where: {
        job: { orgId: user.orgId },
        ...(jobId ? { jobId } : {}),
      },
      include: { job: { select: { title: true, department: true } } },
      orderBy: { appliedAt: "desc" },
    });
    return rows.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      stage: c.stage,
      source: c.source,
      appliedAt: c.appliedAt.toISOString(),
      jobTitle: c.job?.title ?? "Unknown",
      jobDepartment: c.job?.department ?? "—",
    }));
  } catch (err) {
    throw toActionError(err);
  }
}

export async function addCandidate(data: z.infer<typeof candidateSchema>) {
  const user = await requireRole("SUPER_ADMIN", "HR_ADMIN", "MANAGER");

  const parsed = candidateSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid data");

  try {
    const job = await db.jobPosting.findFirst({
      where: { id: parsed.data.jobId, orgId: user.orgId },
    });
    if (!job) throw new Error("Job posting not found");

    await db.candidate.create({
      data: {
        jobId: parsed.data.jobId,
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        source: parsed.data.source,
      },
    });

    revalidatePath("/recruitment");
    revalidatePath("/recruitment/candidates");
  } catch (err) {
    throw toActionError(err);
  }
}

export async function updateCandidateStage(
  candidateId: string,
  stage: "APPLIED" | "SCREENING" | "INTERVIEW" | "OFFER" | "HIRED" | "REJECTED",
) {
  const user = await requireRole("SUPER_ADMIN", "HR_ADMIN", "MANAGER");

  try {
    await db.candidate.updateMany({
      where: {
        id: candidateId,
        job: { orgId: user.orgId },
      },
      data: { stage, updatedAt: new Date() },
    });

    revalidatePath("/recruitment");
  } catch (err) {
    throw toActionError(err);
  }
}
