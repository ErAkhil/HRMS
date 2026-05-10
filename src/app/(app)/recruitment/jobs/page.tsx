import Link from "next/link";
import { getJobPostings } from "@/lib/actions/recruitment";

export const metadata = { title: "Job Postings" };

const deptColor: Record<string, string> = {
  Engineering: "rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-600 dark:bg-primary-900/20 dark:text-primary-300",
  Product: "rounded-full bg-violet-light px-2.5 py-0.5 text-xs font-medium text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300",
  Sales: "rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  HR: "rounded-full bg-amber-light px-2.5 py-0.5 text-xs font-medium text-amber-dark",
  Finance: "rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-dark dark:bg-sky-dark/10 dark:text-sky",
  Marketing: "rounded-full bg-rose-light px-2.5 py-0.5 text-xs font-medium text-rose-dark",
  Operations: "rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-dark-5 dark:bg-dark-3 dark:text-dark-6",
};

export default async function JobsPage() {
  const jobs = await getJobPostings().catch(() => []);
  const activeJobs = jobs.filter((j) => j.isActive);
  const totalApplications = jobs.reduce((s, j) => s + j.candidateCount, 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-dark-5 dark:text-dark-6 mb-1">
            <Link href="/recruitment" className="hover:text-primary-600">Recruitment</Link>
            <span>/</span>
            <span>Job Postings</span>
          </div>
          <h1 className="text-xl font-bold text-dark dark:text-white">Job Postings</h1>
          <p className="text-xs text-dark-5 dark:text-dark-6">
            {activeJobs.length} active opening{activeJobs.length !== 1 ? "s" : ""} · {totalApplications} total applications
          </p>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <p className="text-sm font-medium text-dark dark:text-white">No job postings yet</p>
          <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">Job postings will appear here once created.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {jobs.map((job) => {
            const daysActive = Math.floor((Date.now() - new Date(job.postedAt).getTime()) / 86_400_000);
            return (
              <div key={job.id} className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-dark dark:text-white leading-snug">{job.title}</h3>
                  <span className={`shrink-0 ${deptColor[job.department] ?? deptColor.Operations}`}>{job.department}</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-dark-5 dark:text-dark-6">
                  <span className="flex items-center gap-1">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location}
                  </span>
                  <span className="font-medium text-primary-600 dark:text-primary-400">{job.type}</span>
                </div>

                <div className="flex items-center gap-4 border-t border-gray-3 pt-3 dark:border-dark-3">
                  <div className="text-center">
                    <p className="text-base font-bold text-dark dark:text-white">{job.candidateCount}</p>
                    <p className="text-xs text-dark-5 dark:text-dark-6">Applications</p>
                  </div>
                  <div className="text-center">
                    <p className="text-base font-bold text-dark dark:text-white">{daysActive}d</p>
                    <p className="text-xs text-dark-5 dark:text-dark-6">Active</p>
                  </div>
                  <div className="text-center">
                    <span className={`text-xs font-medium ${job.isActive ? "text-emerald-dark dark:text-emerald" : "text-rose-dark dark:text-rose"}`}>
                      {job.isActive ? "Active" : "Closed"}
                    </span>
                  </div>
                  <div className="ml-auto">
                    <div className="h-1.5 w-16 rounded-full bg-gray-3 dark:bg-dark-3 overflow-hidden">
                      <div className="h-full rounded-full bg-primary-600" style={{ width: `${Math.min(100, (job.candidateCount / 50) * 100)}%` }} />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    href="/recruitment/candidates"
                    className="flex-1 rounded-lg bg-primary-600 py-2 text-center text-xs font-semibold text-white hover:bg-primary-700"
                  >
                    View Applications
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
