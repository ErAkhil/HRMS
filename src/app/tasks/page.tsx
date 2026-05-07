import Link from "next/link";
import Image from "next/image";
import { MyTasksView } from "./_components/my-tasks-view";

export const metadata = { title: "Tasks | Unikove" };

const kpis = [
  {
    label: "Total Assigned",
    value: "24",
    sub: "across 5 projects",
    color: "indigo",
    iconBg: "bg-indigo-50 dark:bg-indigo-900/20",
    iconColor: "text-indigo-600 dark:text-indigo-300",
  },
  {
    label: "Completed Today",
    value: "5",
    sub: "↑ 2 more than yesterday",
    color: "emerald",
    iconBg: "bg-emerald-light dark:bg-emerald-dark/20",
    iconColor: "text-emerald-dark dark:text-emerald",
  },
  {
    label: "In Progress",
    value: "8",
    sub: "3 due today",
    color: "violet",
    iconBg: "bg-violet-light dark:bg-violet-dark/20",
    iconColor: "text-violet-dark dark:text-violet-300",
  },
  {
    label: "Overdue",
    value: "3",
    sub: "Needs attention",
    color: "rose",
    iconBg: "bg-rose-light dark:bg-rose-dark/20",
    iconColor: "text-rose-dark dark:text-rose",
  },
];

const weekBars = [
  { day: "M", label: "Mon", done: 8, today: false },
  { day: "T", label: "Tue", done: 6, today: false },
  { day: "W", label: "Wed", done: 9, today: true },
  { day: "T", label: "Thu", done: 5, today: false },
  { day: "F", label: "Fri", done: 7, today: false },
  { day: "S", label: "Sat", done: 2, today: false },
  { day: "S", label: "Sun", done: 1, today: false },
];

const maxDone = 9;

const projectProgress = [
  { name: "Platform Redesign", pct: 68, done: 32, total: 47, bar: "bg-indigo-600" },
  { name: "API v3 Migration", pct: 45, done: 18, total: 40, bar: "bg-violet-500" },
  { name: "Auth Module", pct: 89, done: 16, total: 18, bar: "bg-emerald-500" },
];

const priorities = [
  { label: "High Priority", count: 7, pct: 29, dot: "bg-rose-500" },
  { label: "Medium Priority", count: 12, pct: 50, dot: "bg-amber-500" },
  { label: "Low Priority", count: 5, pct: 21, dot: "bg-indigo-500" },
];

const deadlines = [
  {
    task: "Finalize auth API docs",
    project: "Auth Module",
    due: "Due Today",
    badgeClass: "bg-rose-light text-rose-dark dark:bg-rose-dark/20 dark:text-rose",
    dot: "bg-rose-500",
  },
  {
    task: "Design review: homepage",
    project: "Platform Redesign",
    due: "Due Tomorrow",
    badgeClass: "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber",
    dot: "bg-amber-500",
  },
  {
    task: "Merge PR #247",
    project: "API v3 Migration",
    due: "Due May 9",
    badgeClass: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300",
    dot: "bg-indigo-500",
  },
  {
    task: "Q2 sprint retrospective",
    project: "Platform Redesign",
    due: "Due May 12",
    badgeClass: "bg-violet-light text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300",
    dot: "bg-violet-500",
  },
];

const teamMembers = [
  { name: "Sarah Mitchell", avatar: "/user-15.png", tasks: 18, done: 12 },
  { name: "Daniel Park", avatar: "/user-03.png", tasks: 14, done: 8 },
  { name: "Priya Sharma", avatar: "/user-26.png", tasks: 11, done: 9 },
  { name: "Arjun Mehta", avatar: "/user-23.png", tasks: 21, done: 11 },
  { name: "Elena Torres", avatar: "/user-27.png", tasks: 9, done: 7 },
];

export default function TasksPage() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Section 1: Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-1 text-sm text-dark-5 dark:text-dark-6">
            <Link href="/" className="hover:text-indigo-600">Dashboard</Link>
            <span className="mx-1">/</span>
            <span>Tasks</span>
          </p>
          <h1 className="text-2xl font-bold text-dark dark:text-white">My Tasks</h1>
          <p className="mt-0.5 text-sm text-dark-5 dark:text-dark-6">Track and manage your work</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/tasks/projects"
            className="rounded-lg border border-gray-3 bg-white px-4 py-2 text-sm font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          >
            View Projects
          </Link>
          <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
            New Task
          </button>
        </div>
      </div>

      {/* Section 2: KPI Row */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
            <p className="text-sm text-dark-5 dark:text-dark-6">{kpi.label}</p>
            <p className="mt-1 text-3xl font-bold text-dark dark:text-white">{kpi.value}</p>
            <p className={`mt-1 text-xs font-medium ${kpi.iconColor}`}>{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Section 3: Chart + Priority + Deadlines */}
      <div className="grid gap-4 md:grid-cols-12">
        {/* Left: Task Progress This Week */}
        <div className="md:col-span-8 rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h2 className="font-semibold text-dark dark:text-white">Task Progress This Week</h2>
              <p className="text-xs text-dark-5 dark:text-dark-6">May 5–11, 2026</p>
            </div>
          </div>

          {/* Bar chart */}
          <div className="flex items-end justify-around gap-1.5 h-32 mb-5">
            {weekBars.map((bar, i) => {
              const height = Math.round((bar.done / maxDone) * 96);
              return (
                <div key={i} className="flex flex-col items-center gap-1 flex-1">
                  <span className="text-[10px] font-bold text-dark-5 dark:text-dark-6">{bar.done}</span>
                  <div
                    className={`w-full rounded-t-sm ${bar.today ? "bg-indigo-600" : "bg-indigo-200 dark:bg-indigo-900/40"}`}
                    style={{ height: `${height}px` }}
                  />
                  <span className="text-[10px] text-dark-5 dark:text-dark-6">{bar.day}</span>
                </div>
              );
            })}
          </div>

          {/* Project progress bars */}
          <div className="space-y-3 border-t border-gray-2 dark:border-dark-3 pt-4">
            {projectProgress.map((proj) => (
              <div key={proj.name}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-dark dark:text-white">{proj.name}</span>
                  <span className="text-xs text-dark-5 dark:text-dark-6">{proj.done}/{proj.total} tasks · {proj.pct}%</span>
                </div>
                <div className="relative h-1.5 rounded-full bg-gray-2 dark:bg-dark-3 overflow-hidden">
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full ${proj.bar}`}
                    style={{ width: `${proj.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Priority Breakdown + Upcoming Deadlines */}
        <div className="md:col-span-4 flex flex-col gap-4">
          {/* Priority Breakdown */}
          <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
            <h2 className="mb-4 font-semibold text-dark dark:text-white">Priority Breakdown</h2>
            <div className="space-y-3">
              {priorities.map((p) => (
                <div key={p.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`h-3 w-3 rounded-full ${p.dot}`} />
                    <span className="text-sm text-dark dark:text-white">{p.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-dark dark:text-white">{p.count}</span>
                    <span className="text-xs text-dark-5 dark:text-dark-6">{p.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-gray-2 dark:border-dark-3 pt-3 text-xs text-dark-5 dark:text-dark-6">
              Total: 24 tasks
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
            <h2 className="mb-4 font-semibold text-dark dark:text-white">Upcoming Deadlines</h2>
            <div className="space-y-3">
              {deadlines.map((d) => (
                <div key={d.task} className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${d.dot}`} />
                      <p className="truncate text-sm font-medium text-dark dark:text-white">{d.task}</p>
                    </div>
                    <p className="ml-3.5 text-xs text-dark-5 dark:text-dark-6">{d.project}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${d.badgeClass}`}>
                    {d.due}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Team Workload + Quick Links */}
      <div className="grid gap-4 md:grid-cols-12">
        {/* Team Workload */}
        <div className="md:col-span-5 rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-dark dark:text-white">Team Workload</h2>
            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300">
              5 members
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-2 dark:border-dark-3">
                  <th className="pb-2 text-left text-xs font-medium text-dark-5 dark:text-dark-6">Member</th>
                  <th className="pb-2 text-center text-xs font-medium text-dark-5 dark:text-dark-6">Tasks</th>
                  <th className="pb-2 text-center text-xs font-medium text-dark-5 dark:text-dark-6">Done</th>
                  <th className="pb-2 text-left text-xs font-medium text-dark-5 dark:text-dark-6 pl-2">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-2 dark:divide-dark-3">
                {teamMembers.map((m) => {
                  const pct = Math.round((m.done / m.tasks) * 100);
                  return (
                    <tr key={m.name}>
                      <td className="py-2.5 pr-2">
                        <div className="flex items-center gap-2">
                          <Image
                            src={m.avatar}
                            alt={m.name}
                            width={28}
                            height={28}
                            className="rounded-full object-cover"
                          />
                          <span className="whitespace-nowrap text-xs font-medium text-dark dark:text-white">
                            {m.name.split(" ")[0]}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 text-center text-xs text-dark-5 dark:text-dark-6">{m.tasks}</td>
                      <td className="py-2.5 text-center text-xs text-dark-5 dark:text-dark-6">{m.done}</td>
                      <td className="py-2.5 pl-2">
                        <div className="relative h-1 w-20 rounded-full bg-gray-2 dark:bg-dark-3 overflow-hidden">
                          <div
                            className="absolute inset-y-0 left-0 rounded-full bg-indigo-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-7 rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <h2 className="mb-4 font-semibold text-dark dark:text-white">Quick Navigation</h2>
          <div className="grid grid-cols-2 gap-4 h-[calc(100%-2.5rem)]">
            <Link
              href="/tasks/kanban"
              className="group flex flex-col justify-between rounded-xl border border-gray-2 p-5 hover:border-violet-400 dark:border-dark-3 dark:hover:border-violet-500 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-lg bg-violet-light p-2 dark:bg-violet-dark/20">
                  <svg className="h-5 w-5 text-violet-dark dark:text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  </svg>
                </span>
                <svg className="h-4 w-4 text-dark-5 group-hover:text-violet-600 dark:text-dark-6 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div className="mt-4">
                <p className="font-semibold text-dark dark:text-white">Kanban Board</p>
                <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">View tasks by status</p>
              </div>
            </Link>

            <Link
              href="/tasks/projects"
              className="group flex flex-col justify-between rounded-xl border border-gray-2 p-5 hover:border-indigo-400 dark:border-dark-3 dark:hover:border-indigo-500 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-lg bg-indigo-50 p-2 dark:bg-indigo-900/20">
                  <svg className="h-5 w-5 text-indigo-600 dark:text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h3.5L10 7H19a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                  </svg>
                </span>
                <svg className="h-4 w-4 text-dark-5 group-hover:text-indigo-600 dark:text-dark-6 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div className="mt-4">
                <p className="font-semibold text-dark dark:text-white">Projects Overview</p>
                <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">Track project milestones</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Section 5: All My Tasks */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-dark dark:text-white">All My Tasks</h2>
        <MyTasksView />
      </div>
    </div>
  );
}
