import Link from "next/link";

type WorkMode = "Remote" | "Hybrid" | "On-site";
type Department = "Engineering" | "Product" | "Sales" | "HR" | "Finance" | "Marketing" | "Operations";

interface Job {
  id: number;
  title: string;
  department: Department;
  location: string;
  workMode: WorkMode;
  salaryRange: string;
  applications: number;
  daysActive: number;
  openings: number;
}

const jobs: Job[] = [
  { id: 1, title: "Senior React Developer", department: "Engineering", location: "San Francisco, CA", workMode: "Hybrid", salaryRange: "₹28L – ₹42L", applications: 47, daysActive: 14, openings: 2 },
  { id: 2, title: "Product Manager", department: "Product", location: "New York, NY", workMode: "Remote", salaryRange: "₹30L – ₹45L", applications: 31, daysActive: 8, openings: 1 },
  { id: 3, title: "Cloud Architect", department: "Engineering", location: "Austin, TX", workMode: "On-site", salaryRange: "₹40L – ₹60L", applications: 19, daysActive: 21, openings: 1 },
  { id: 4, title: "Marketing Manager", department: "Marketing", location: "Los Angeles, CA", workMode: "Hybrid", salaryRange: "₹18L – ₹28L", applications: 38, daysActive: 5, openings: 1 },
  { id: 5, title: "HR Business Partner", department: "HR", location: "Chicago, IL", workMode: "Hybrid", salaryRange: "₹15L – ₹22L", applications: 24, daysActive: 10, openings: 1 },
  { id: 6, title: "Senior Data Analyst", department: "Finance", location: "Seattle, WA", workMode: "Remote", salaryRange: "₹22L – ₹35L", applications: 41, daysActive: 7, openings: 2 },
  { id: 7, title: "VP of Sales", department: "Sales", location: "Dallas, TX", workMode: "On-site", salaryRange: "₹55L – ₹80L", applications: 12, daysActive: 30, openings: 1 },
  { id: 8, title: "Operations Manager", department: "Operations", location: "Boston, MA", workMode: "On-site", salaryRange: "₹20L – ₹32L", applications: 28, daysActive: 18, openings: 1 },
];

const departmentColor: Record<Department, string> = {
  Engineering: "rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300",
  Product: "rounded-full bg-violet-light px-2.5 py-0.5 text-xs font-medium text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300",
  Sales: "rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  HR: "rounded-full bg-amber-light px-2.5 py-0.5 text-xs font-medium text-amber-dark",
  Finance: "rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-dark dark:bg-sky-dark/10 dark:text-sky",
  Marketing: "rounded-full bg-rose-light px-2.5 py-0.5 text-xs font-medium text-rose-dark",
  Operations: "rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-dark-5 dark:bg-dark-3 dark:text-dark-6",
};

const workModeIcon: Record<WorkMode, string> = {
  Remote: "🌐",
  Hybrid: "🏢",
  "On-site": "📍",
};

const workModeColor: Record<WorkMode, string> = {
  Remote: "text-emerald-dark dark:text-emerald",
  Hybrid: "text-amber-dark",
  "On-site": "text-sky-dark dark:text-sky",
};

export const metadata = {
  title: "Job Postings",
};

export default function JobsPage() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-dark-5 dark:text-dark-6 mb-1">
            <Link href="/recruitment" className="hover:text-primary-600">Recruitment</Link>
            <span>/</span>
            <span>Job Postings</span>
          </div>
          <h1 className="text-xl font-bold text-dark dark:text-white">Job Postings</h1>
          <p className="text-xs text-dark-5 dark:text-dark-6">8 active openings · 240 total applications</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="h-9 rounded-lg border border-gray-3 bg-white px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-2 dark:text-white">
            <option>All Departments</option>
            <option>Engineering</option>
            <option>Product</option>
            <option>Sales</option>
            <option>HR</option>
          </select>
          <button className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Post a Job
          </button>
        </div>
      </div>

      {/* Job Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 flex flex-col gap-3"
          >
            {/* Top: title + dept */}
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold text-dark dark:text-white leading-snug">{job.title}</h3>
              <span className={`shrink-0 ${departmentColor[job.department]}`}>{job.department}</span>
            </div>

            {/* Location + mode */}
            <div className="flex items-center gap-3 text-xs text-dark-5 dark:text-dark-6">
              <span className="flex items-center gap-1">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {job.location}
              </span>
              <span className={`flex items-center gap-1 font-medium ${workModeColor[job.workMode]}`}>
                <span>{workModeIcon[job.workMode]}</span>
                {job.workMode}
              </span>
            </div>

            {/* Salary */}
            <div className="flex items-center gap-1.5 text-xs">
              <svg className="h-3.5 w-3.5 text-dark-5 dark:text-dark-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold text-dark dark:text-white">{job.salaryRange}</span>
              <span className="text-dark-5 dark:text-dark-6">per annum</span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 border-t border-gray-3 pt-3 dark:border-dark-3">
              <div className="text-center">
                <p className="text-base font-bold text-dark dark:text-white">{job.applications}</p>
                <p className="text-xs text-dark-5 dark:text-dark-6">Applications</p>
              </div>
              <div className="text-center">
                <p className="text-base font-bold text-dark dark:text-white">{job.daysActive}d</p>
                <p className="text-xs text-dark-5 dark:text-dark-6">Active</p>
              </div>
              <div className="text-center">
                <p className="text-base font-bold text-dark dark:text-white">{job.openings}</p>
                <p className="text-xs text-dark-5 dark:text-dark-6">Openings</p>
              </div>
              <div className="ml-auto">
                <div className="h-1.5 w-16 rounded-full bg-gray-3 dark:bg-dark-3 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary-600"
                    style={{ width: `${Math.min(100, (job.applications / 50) * 100)}%` }}
                  />
                </div>
                <p className="mt-0.5 text-right text-[10px] text-dark-5 dark:text-dark-6">
                  {Math.round((job.applications / 50) * 100)}% filled
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Link
                href="/recruitment/candidates"
                className="flex-1 rounded-lg bg-primary-600 py-2 text-center text-xs font-semibold text-white hover:bg-primary-700"
              >
                View Applications
              </Link>
              <button className="rounded-lg border border-gray-3 px-3 py-2 text-xs font-medium text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
