"use server";

import { requireRole } from "@/lib/session";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { api } from "@/lib/api-client";

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

const candidateSchema = z.object({
  jobId: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  source: z.string().optional(),
});

export async function getJobPostings(): Promise<SerializedJobPosting[]> {
  await requireRole("SUPER_ADMIN", "HR_ADMIN", "MANAGER");
  return api.get<SerializedJobPosting[]>("/recruitment/jobs");
}

export async function getCandidates(jobId?: string): Promise<SerializedCandidate[]> {
  await requireRole("SUPER_ADMIN", "HR_ADMIN", "MANAGER");
  const qs = jobId ? `?jobId=${jobId}` : "";
  return api.get<SerializedCandidate[]>(`/recruitment/candidates${qs}`);
}

export async function addCandidate(data: z.infer<typeof candidateSchema>) {
  await requireRole("SUPER_ADMIN", "HR_ADMIN", "MANAGER");

  const parsed = candidateSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid data");

  await api.post<unknown>("/recruitment/candidates", parsed.data);
  revalidatePath("/recruitment");
  revalidatePath("/recruitment/candidates");
}

export async function updateCandidateStage(
  candidateId: string,
  stage: "APPLIED" | "SCREENING" | "INTERVIEW" | "OFFER" | "HIRED" | "REJECTED",
) {
  await requireRole("SUPER_ADMIN", "HR_ADMIN", "MANAGER");
  await api.patch<unknown>(`/recruitment/candidates/${candidateId}/stage`, { stage });
  revalidatePath("/recruitment");
}
