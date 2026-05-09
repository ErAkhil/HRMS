import Link from "next/link";
import { getCandidates, getJobPostings } from "@/lib/actions/recruitment";
import { KanbanColumn, type CandidateCard } from "./_components/KanbanColumn";

const STAGE_CONFIG = {
  APPLIED:   { title: "Applied",   headerColor: "bg-indigo-50 dark:bg-indigo-900/20", dotColor: "bg-indigo-500" },
  SCREENING: { title: "Screening", headerColor: "bg-amber-light dark:bg-amber-dark/10", dotColor: "bg-amber-500" },
  INTERVIEW: { title: "Interview", headerColor: "bg-sky-50 dark:bg-sky-dark/10",    dotColor: "bg-sky-500" },
  OFFER:     { title: "Offer",     headerColor: "bg-violet-light dark:bg-violet-dark/10", dotColor: "bg-violet-500" },
  HIRED:     { title: "Hired",     headerColor: "bg-emerald-light dark:bg-emerald-dark/10", dotColor: "bg-emerald-500" },
};

export default async function RecruitmentPage() {
  const [candidates, jobs] = await Promise.all([
    getCandidates().catch(() => []),
    getJobPostings().catch(() => []),
  ]);

  // Group candidates by stage
  const columns = (Object.keys(STAGE_CONFIG) as Array<keyof typeof STAGE_CONFIG>).map((stage) => {
    const stageCandidates = candidates
      .filter((c) => c.stage === stage)
      .map((c): CandidateCard => ({
        id: c.id,
        name: c.name,
        avatar: "/images/user/user-03.png",
        currentRole: c.email,
        appliedFor: c.job?.title ?? "Unknown Position",
        stageInfo: `Applied ${new Date(c.appliedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
      }));
    return { stage, ...STAGE_CONFIG[stage], candidates: stageCandidates };
  });

  const totalCandidates = candidates.length;
  const openJobs = jobs.filter((j) => j.isActive).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-dark dark:text-white">Recruitment Pipeline</h1>
          <p className="text-xs text-dark-5 dark:text-dark-6">
            <span className="inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {openJobs} open position{openJobs !== 1 ? "s" : ""}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/recruitment/jobs"
            className="rounded-lg border border-gray-3 px-4 py-2 text-sm font-medium text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6"
          >
            View Jobs
          </Link>
          <Link
            href="/recruitment/candidates"
            className="rounded-lg border border-gray-3 px-4 py-2 text-sm font-medium text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6"
          >
            All Candidates
          </Link>
        </div>
      </div>

      {/* Pipeline Stats Bar */}
      <div className="rounded-xl bg-white p-4 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <div className="flex flex-wrap items-center gap-6">
          {columns.map((col) => (
            <div key={col.stage} className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${col.dotColor}`} />
              <span className="text-xs text-dark-5 dark:text-dark-6">{col.title}</span>
              <span className="text-xs font-bold text-dark dark:text-white">{col.candidates.length}</span>
            </div>
          ))}
          <div className="ml-auto text-xs text-dark-5 dark:text-dark-6">
            Total: <span className="font-bold text-dark dark:text-white">{totalCandidates} candidate{totalCandidates !== 1 ? "s" : ""}</span>
          </div>
        </div>
        {totalCandidates > 0 && (
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full flex gap-0.5">
            {columns.map((col) => {
              const pct = totalCandidates > 0 ? Math.round((col.candidates.length / totalCandidates) * 100) : 0;
              if (pct === 0) return null;
              return (
                <div
                  key={col.stage}
                  className={col.dotColor.replace("bg-", "bg-")}
                  style={{ width: `${pct}%` }}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Kanban Board */}
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
    </div>
  );
}
