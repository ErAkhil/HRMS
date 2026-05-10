import Link from "next/link";

type JobPosting = {
  id: string;
  title: string;
  department: string;
  candidateCount: number;
  type: string;
};

type OnboardingEntry = {
  id: string;
  name: string;
  department: string;
  progress: number;
  day: number;
};

type HrThreeColumnsProps = {
  jobPostings: JobPosting[];
  onboarding: OnboardingEntry[];
};

const badgeClass = {
  indigo: "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-300",
  emerald: "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  amber: "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber",
} as const;

const complianceItems = [
  { title: "POSH Training", detail: "Track completion status", status: "Track", statusColor: "amber" as const },
  { title: "Fire Safety Drill", detail: "Schedule annual drill", status: "Upcoming", statusColor: "indigo" as const },
  { title: "IT Security Audit", detail: "Run quarterly audit", status: "Pending", statusColor: "indigo" as const },
  { title: "Annual Health Check", detail: "Coordinate with clinic", status: "Plan", statusColor: "amber" as const },
];

export function HrThreeColumns({ jobPostings, onboarding }: HrThreeColumnsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">

      {/* Recruitment Pipeline */}
      <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-dark dark:text-white">Open Roles · {jobPostings.length}</h2>
          <Link href="/recruitment" className="text-xs font-medium text-primary-600 hover:underline dark:text-primary-400">View All →</Link>
        </div>
        {jobPostings.length === 0 ? (
          <p className="text-sm text-dark-5 dark:text-dark-6 py-4">No active job postings.</p>
        ) : (
          <div className="space-y-3">
            {jobPostings.map((role) => (
              <div key={role.id} className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-dark dark:text-white truncate">{role.title}</p>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${badgeClass.indigo}`}>{role.department}</span>
                    <span className="text-[10px] text-dark-5 dark:text-dark-6">{role.candidateCount} applicant{role.candidateCount !== 1 ? "s" : ""}</span>
                  </div>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${badgeClass.amber}`}>{role.type}</span>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 border-t border-gray-3 dark:border-dark-3 pt-3">
          <Link href="/recruitment" className="text-xs font-medium text-primary-600 hover:underline dark:text-primary-400">
            Manage recruitment →
          </Link>
        </div>
      </div>

      {/* Active Onboarding */}
      <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-dark dark:text-white">Active Onboarding · {onboarding.length}</h2>
          <Link href="/onboarding" className="text-xs font-medium text-primary-600 hover:underline dark:text-primary-400">View →</Link>
        </div>
        {onboarding.length === 0 ? (
          <p className="text-sm text-dark-5 dark:text-dark-6 py-4">No active onboarding records.</p>
        ) : (
          <div className="space-y-3">
            {onboarding.map((person) => {
              const initials = person.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
              return (
                <div key={person.id} className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <p className="text-xs font-semibold text-dark dark:text-white truncate">{person.name}</p>
                      <span className="text-[10px] text-dark-5 dark:text-dark-6 shrink-0">{person.progress}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative h-1 w-20 rounded-full bg-gray-2 dark:bg-dark-3 overflow-hidden">
                        <div className="absolute inset-y-0 left-0 rounded-full bg-primary-500" style={{ width: `${person.progress}%` }} />
                      </div>
                      <span className="text-[10px] text-dark-5 dark:text-dark-6">Day {person.day}/30</span>
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${badgeClass.indigo}`}>{person.department}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="mt-4 border-t border-gray-3 dark:border-dark-3 pt-3">
          <Link href="/onboarding" className="text-xs font-medium text-primary-600 hover:underline dark:text-primary-400">
            View all onboarding →
          </Link>
        </div>
      </div>

      {/* Compliance Tracker */}
      <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-dark dark:text-white">Compliance Checklist</h2>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeClass.amber}`}>{complianceItems.length} items</span>
        </div>
        <div className="space-y-3">
          {complianceItems.map((item) => (
            <div key={item.title} className="border-b border-gray-3 dark:border-dark-3 pb-3 last:border-0 last:pb-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-semibold text-dark dark:text-white">{item.title}</p>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${badgeClass[item.statusColor]}`}>{item.status}</span>
              </div>
              <p className="mt-0.5 text-[10px] text-dark-5 dark:text-dark-6">{item.detail}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 border-t border-gray-3 dark:border-dark-3 pt-3">
          <Link href="/reports" className="text-xs font-medium text-primary-600 hover:underline dark:text-primary-400">
            View All Compliance →
          </Link>
        </div>
      </div>

    </div>
  );
}
