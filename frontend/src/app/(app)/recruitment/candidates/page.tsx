import { getCandidates, getJobPostings } from "@/lib/actions/recruitment";
import { CandidatesClient } from "./_components/candidates-client";

export const metadata = { title: "Candidates" };

export default async function CandidatesPage() {
  const [candidates, jobs] = await Promise.all([
    getCandidates().catch(() => []),
    getJobPostings().catch(() => []),
  ]);

  return <CandidatesClient candidates={candidates} jobs={jobs} />;
}
