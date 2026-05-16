import Link from "next/link";
import { getCandidates, getJobPostings } from "@/lib/actions/recruitment";
import { KanbanColumn, type CandidateCard } from "./_components/KanbanColumn";

const STAGE_CONFIG = {
  APPLIED:   { title: "Applied",   headerColor: "bg-primary-50 dark:bg-primary-900/20", dotColor: "bg-primary-500" },
  SCREENING: { title: "Screening", headerColor: "bg-amber-light dark:bg-amber-dark/10", dotColor: "bg-amber-500" },
  INTERVIEW: { title: "Interview", headerColor: "bg-sky-50 dark:bg-sky-dark/10",    dotColor: "bg-sky-500" },
  OFFER:     { title: "Offer",     headerColor: "bg-violet-light dark:bg-violet-dark/10", dotColor: "bg-violet-500" },
  HIRED:     { title: "Hired",     headerColor: "bg-emerald-light dark:bg-emerald-dark/10", dotColor: "bg-emerald-500" },
};

type Stage = keyof typeof STAGE_CONFIG;

function mapCandidatesByStage(candidates: Awaited<ReturnType<typeof getCandidates>>) {
  return (Object.keys(STAGE_CONFIG) as Stage[]).map((stage) => {
    const stageCandidates = candidates
      .filter((candidate) => candidate.stage === stage)
      .map((candidate): CandidateCard => ({
        id: candidate.id,
        name: candidate.name,
        avatar: "/images/user/user-03.png",
        currentRole: candidate.email,
        appliedFor: candidate.jobTitle ?? "Unknown Position",
        stageInfo: `Applied ${new Date(candidate.appliedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
      }));

    return { stage, ...STAGE_CONFIG[stage], candidates: stageCandidates };
  });
}

function RecruitmentHeader({ openJobs }: Readonly<{ openJobs: number }>) {
  return (
    <div className="page-header">
      <div>
        <h1 className="page-title">Recruitment Pipeline</h1>
        <p className="text-muted">
          <span className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {openJobs} open position{openJobs === 1 ? "" : "s"}
          </span>
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Link href="/recruitment/jobs" className="btn-secondary">View Jobs</Link>
        <Link href="/recruitment/candidates" className="btn-secondary">All Candidates</Link>
      </div>
    </div>
  );
}

function PipelineStatsBar({ columns, totalCandidates }: Readonly<{ columns: ReturnType<typeof mapCandidatesByStage>; totalCandidates: number }>) {
  return (
    <div className="card-p">
      <div className="flex flex-wrap items-center gap-6">
        {columns.map((col) => (
          <div key={col.stage} className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${col.dotColor}`} />
            <span className="text-muted">{col.title}</span>
            <span className="text-xs font-bold text-dark dark:text-white">{col.candidates.length}</span>
          </div>
        ))}
        <div className="ml-auto text-muted">
          Total: <span className="font-bold text-dark dark:text-white">{totalCandidates} candidate{totalCandidates === 1 ? "" : "s"}</span>
        </div>
      </div>
      {totalCandidates > 0 && (
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full flex gap-0.5">
          {columns.map((col) => {
            const pct = Math.round((col.candidates.length / totalCandidates) * 100);
            if (pct === 0) return null;
            return <div key={col.stage} className={col.dotColor.replace("bg-", "bg-")} style={{ width: `${pct}%` }} />;
          })}
        </div>
      )}
    </div>
  );
}

function PipelineBoard({ columns }: Readonly<{ columns: ReturnType<typeof mapCandidatesByStage> }>) {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-4 min-w-max">
        {columns.map((col) => (
          <KanbanColumn
            key={col.stage}
            title={col.title}
            headerColor={col.headerColor}
            dotColor={col.dotColor}
            candidates={col.candidates}
          />
        ))}
      </div>
    </div>
  );
}

export default async function RecruitmentPage() {
  const [candidates, jobs] = await Promise.all([
    getCandidates().catch(() => []),
    getJobPostings().catch(() => []),
  ]);

  const columns = mapCandidatesByStage(candidates);
  const totalCandidates = candidates.length;
  const openJobs = jobs.filter((j) => j.isActive).length;

  return (
    <div className="page-container">
      <RecruitmentHeader openJobs={openJobs} />
      <PipelineStatsBar columns={columns} totalCandidates={totalCandidates} />
      <PipelineBoard columns={columns} />
    </div>
  );
}
