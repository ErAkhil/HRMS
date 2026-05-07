import Image from "next/image";
import Link from "next/link";

interface ExitTask {
  label: string;
  done: boolean;
}

interface OffboardingRecord {
  id: number;
  name: string;
  avatar: string;
  role: string;
  department: string;
  departmentColor: string;
  lastDay: string;
  reason: string;
  tasks: ExitTask[];
}

const offboardings: OffboardingRecord[] = [
  {
    id: 1,
    name: "Kevin Lee",
    avatar: "/images/user/user-07.png",
    role: "Data Analyst",
    department: "Finance",
    departmentColor: "rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-dark dark:bg-sky-dark/10 dark:text-sky",
    lastDay: "May 31, 2026",
    reason: "New opportunity",
    tasks: [
      { label: "Assets Return", done: true },
      { label: "Knowledge Transfer", done: true },
      { label: "Exit Interview", done: false },
      { label: "Final Settlement", done: false },
    ],
  },
  {
    id: 2,
    name: "James Williams",
    avatar: "/images/user/user-08.png",
    role: "Sales Lead",
    department: "Sales",
    departmentColor: "rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
    lastDay: "May 22, 2026",
    reason: "Relocation",
    tasks: [
      { label: "Assets Return", done: true },
      { label: "Knowledge Transfer", done: false },
      { label: "Exit Interview", done: false },
      { label: "Final Settlement", done: false },
    ],
  },
  {
    id: 3,
    name: "Lisa Chen",
    avatar: "/images/user/user-09.png",
    role: "Marketing Head",
    department: "Marketing",
    departmentColor: "rounded-full bg-rose-light px-2.5 py-0.5 text-xs font-medium text-rose-dark",
    lastDay: "May 15, 2026",
    reason: "Retirement",
    tasks: [
      { label: "Assets Return", done: true },
      { label: "Knowledge Transfer", done: true },
      { label: "Exit Interview", done: true },
      { label: "Final Settlement", done: false },
    ],
  },
  {
    id: 4,
    name: "Tom Bradley",
    avatar: "/images/user/user-10.png",
    role: "Account Executive",
    department: "Sales",
    departmentColor: "rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
    lastDay: "Jun 7, 2026",
    reason: "Contract end",
    tasks: [
      { label: "Assets Return", done: false },
      { label: "Knowledge Transfer", done: false },
      { label: "Exit Interview", done: false },
      { label: "Final Settlement", done: false },
    ],
  },
];

const taskIcons: Record<string, React.ReactNode> = {
  "Assets Return": (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
    </svg>
  ),
  "Knowledge Transfer": (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  "Exit Interview": (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  ),
  "Final Settlement": (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export const metadata = {
  title: "Offboarding",
};

export default function OffboardingPage() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-dark-5 dark:text-dark-6 mb-1">
            <Link href="/onboarding" className="hover:text-primary-600">Onboarding</Link>
            <span>/</span>
            <span>Offboarding</span>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-dark dark:text-white">Offboarding</h1>
            <span className="rounded-full bg-rose-light px-2.5 py-0.5 text-xs font-medium text-rose-dark">
              4 active
            </span>
          </div>
          <p className="text-xs text-dark-5 dark:text-dark-6 mt-0.5">Manage employee exit workflows</p>
        </div>
        <button className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 flex items-center gap-2">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Offboarding
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Exiting This Month", value: "3", color: "text-rose-dark", bg: "bg-rose-light" },
          { label: "Assets Pending", value: "2", color: "text-amber-dark", bg: "bg-amber-light" },
          { label: "Exit Interviews", value: "1/4", color: "text-sky-dark", bg: "bg-sky-50" },
          { label: "Completed", value: "7", color: "text-emerald-dark", bg: "bg-emerald-light" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl bg-white p-4 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
            <p className="text-xs text-dark-5 dark:text-dark-6">{stat.label}</p>
            <p className={`mt-1 text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Offboarding Records */}
      <div className="grid gap-5 lg:grid-cols-2">
        {offboardings.map((ob) => {
          const doneCount = ob.tasks.filter((t) => t.done).length;
          const progress = Math.round((doneCount / ob.tasks.length) * 100);
          const progressColor =
            progress === 100 ? "bg-emerald-500" : progress >= 50 ? "bg-sky-500" : progress >= 25 ? "bg-amber-400" : "bg-rose-500";

          return (
            <div
              key={ob.id}
              className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 space-y-4"
            >
              {/* Employee Info */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Image src={ob.avatar} alt={ob.name} width={44} height={44} className="rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-dark dark:text-white">{ob.name}</p>
                    <p className="text-xs text-dark-5 dark:text-dark-6">{ob.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={ob.departmentColor}>{ob.department}</span>
                  <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">
                    Last day: <span className="font-medium text-rose-dark">{ob.lastDay}</span>
                  </p>
                </div>
              </div>

              {/* Reason */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-dark-5 dark:text-dark-6">Reason:</span>
                <span className="font-medium text-dark dark:text-white">{ob.reason}</span>
              </div>

              {/* Progress */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-dark-5 dark:text-dark-6">Exit Progress</span>
                  <span className="text-xs font-bold text-dark dark:text-white">{doneCount}/{ob.tasks.length} tasks</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-3 dark:bg-dark-3 overflow-hidden">
                  <div className={`h-full rounded-full ${progressColor}`} style={{ width: `${progress}%` }} />
                </div>
              </div>

              {/* Exit Tasks Checklist */}
              <div className="grid grid-cols-2 gap-2">
                {ob.tasks.map((task) => (
                  <div
                    key={task.label}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 ${
                      task.done
                        ? "bg-emerald-light dark:bg-emerald-dark/10"
                        : "bg-gray-1 dark:bg-dark-3"
                    }`}
                  >
                    <span className={task.done ? "text-emerald-dark dark:text-emerald" : "text-dark-5 dark:text-dark-6"}>
                      {task.done ? (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        taskIcons[task.label]
                      )}
                    </span>
                    <span className={`text-xs font-medium ${task.done ? "text-emerald-dark dark:text-emerald line-through" : "text-dark dark:text-white"}`}>
                      {task.label}
                    </span>
                    {!task.done && (
                      <span className="ml-auto text-[10px] text-amber-dark">Pending</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2 border-t border-gray-3 pt-3 dark:border-dark-3">
                <button className="flex-1 rounded-lg border border-gray-3 py-2 text-xs font-medium text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6">
                  View Details
                </button>
                <button className="flex-1 rounded-lg bg-primary-600 py-2 text-xs font-semibold text-white hover:bg-primary-700">
                  Send Reminder
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
