import Image from "next/image";
import Link from "next/link";

interface Project {
  id: string;
  name: string;
  description: string;
  status: "Active" | "Completed" | "Overdue" | "At Risk";
  progress: number;
  dueDate: string;
  members: string[];
  totalTasks: number;
  completedTasks: number;
  accentColor: string;
}

const PROJECTS: Project[] = [
  {
    id: "p1",
    name: "Q2 Workforce Analytics",
    description: "Deep-dive headcount analysis, attrition modeling, and reporting.",
    status: "Active",
    progress: 68,
    dueDate: "Jun 30, 2026",
    members: [
      "/images/user/user-01.png",
      "/images/user/user-05.png",
      "/images/user/user-09.png",
    ],
    totalTasks: 24,
    completedTasks: 16,
    accentColor: "bg-indigo-600",
  },
  {
    id: "p2",
    name: "HRMS Migration",
    description: "Full data migration from legacy system to Unikove platform.",
    status: "Active",
    progress: 45,
    dueDate: "Jul 15, 2026",
    members: [
      "/images/user/user-04.png",
      "/images/user/user-06.png",
      "/images/user/user-08.png",
      "/images/user/user-10.png",
    ],
    totalTasks: 40,
    completedTasks: 18,
    accentColor: "bg-sky-dark",
  },
  {
    id: "p3",
    name: "Employee Portal Redesign",
    description: "Redesigning the self-service portal for improved UX and accessibility.",
    status: "At Risk",
    progress: 89,
    dueDate: "May 20, 2026",
    members: [
      "/images/user/user-02.png",
      "/images/user/user-07.png",
      "/images/user/user-11.png",
    ],
    totalTasks: 18,
    completedTasks: 16,
    accentColor: "bg-violet-dark",
  },
  {
    id: "p4",
    name: "Benefits Package Review",
    description: "Annual review and benchmarking of employee benefits offerings.",
    status: "Active",
    progress: 30,
    dueDate: "Jun 10, 2026",
    members: [
      "/images/user/user-03.png",
      "/images/user/user-12.png",
    ],
    totalTasks: 20,
    completedTasks: 6,
    accentColor: "bg-amber-dark",
  },
  {
    id: "p5",
    name: "Compliance Training Q2",
    description: "Mandatory compliance and ethics training for all employees.",
    status: "Completed",
    progress: 100,
    dueDate: "Apr 30, 2026",
    members: [
      "/images/user/user-06.png",
      "/images/user/user-08.png",
      "/images/user/user-09.png",
    ],
    totalTasks: 15,
    completedTasks: 15,
    accentColor: "bg-emerald-dark",
  },
  {
    id: "p6",
    name: "Onboarding Automation",
    description: "Automating the new hire onboarding workflow with AI-assisted checklists.",
    status: "Active",
    progress: 55,
    dueDate: "Jun 1, 2026",
    members: [
      "/images/user/user-01.png",
      "/images/user/user-04.png",
      "/images/user/user-07.png",
    ],
    totalTasks: 22,
    completedTasks: 12,
    accentColor: "bg-primary-600",
  },
  {
    id: "p7",
    name: "Performance Review Cycle",
    description: "Coordinating Q2 performance review process across all departments.",
    status: "Active",
    progress: 72,
    dueDate: "May 31, 2026",
    members: [
      "/images/user/user-02.png",
      "/images/user/user-05.png",
      "/images/user/user-11.png",
      "/images/user/user-03.png",
    ],
    totalTasks: 32,
    completedTasks: 23,
    accentColor: "bg-rose-dark",
  },
  {
    id: "p8",
    name: "Recruitment Campaign 2026",
    description: "Employer branding and talent acquisition campaign for 50+ new hires.",
    status: "Active",
    progress: 20,
    dueDate: "Aug 1, 2026",
    members: [
      "/images/user/user-10.png",
      "/images/user/user-12.png",
    ],
    totalTasks: 45,
    completedTasks: 9,
    accentColor: "bg-violet-600",
  },
];

const STATUS_COLORS: Record<Project["status"], string> = {
  Active: "rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300",
  Completed: "rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  Overdue: "rounded-full bg-rose-light px-2.5 py-0.5 text-xs font-medium text-rose-dark",
  "At Risk": "rounded-full bg-amber-light px-2.5 py-0.5 text-xs font-medium text-amber-dark",
};

const PROGRESS_COLORS: Record<Project["status"], string> = {
  Active: "bg-primary-600",
  Completed: "bg-emerald-dark",
  Overdue: "bg-rose-dark",
  "At Risk": "bg-amber-dark",
};

const stats = [
  { label: "Active", value: 8, color: "text-primary-600 dark:text-primary-300" },
  { label: "Completed", value: 12, color: "text-emerald-dark dark:text-emerald" },
  { label: "Overdue", value: 2, color: "text-rose-dark" },
  { label: "This Month", value: 3, color: "text-amber-dark" },
];

export const metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-dark dark:text-white">
            Projects
          </h1>
          <p className="text-xs text-dark-5 dark:text-dark-6">
            Track all HR initiatives and projects in one place
          </p>
        </div>
        <Link
          href="#"
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
        >
          + New Project
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl bg-white p-5 shadow-card dark:border dark:border-dark-3 dark:bg-dark-2"
          >
            <p className="text-xs text-dark-5 dark:text-dark-6">{s.label}</p>
            <p className={`mt-1 text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Projects grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map((project) => {
          const overflow = project.members.length - 4;
          return (
            <div
              key={project.id}
              className="overflow-hidden rounded-xl bg-white shadow-card dark:border dark:border-dark-3 dark:bg-dark-2"
            >
              {/* Accent bar */}
              <div className={`h-1.5 w-full ${project.accentColor}`} />

              <div className="p-5">
                {/* Title + status */}
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-dark dark:text-white">
                    {project.name}
                  </h3>
                  <span className={STATUS_COLORS[project.status]}>
                    {project.status}
                  </span>
                </div>

                {/* Description */}
                <p className="mb-4 line-clamp-1 text-xs text-dark-5 dark:text-dark-6">
                  {project.description}
                </p>

                {/* Progress bar */}
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs text-dark-5 dark:text-dark-6">
                    Progress
                  </span>
                  <span className="text-xs font-semibold text-dark dark:text-white">
                    {project.progress}%
                  </span>
                </div>
                <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-gray-3 dark:bg-dark-3">
                  <div
                    className={`h-full rounded-full ${PROGRESS_COLORS[project.status]}`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>

                {/* Team + task count */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex -space-x-2">
                      {project.members.slice(0, 4).map((src, i) => (
                        <Image
                          key={i}
                          src={src}
                          alt=""
                          width={26}
                          height={26}
                          className="size-7 rounded-full ring-2 ring-white dark:ring-dark-2"
                        />
                      ))}
                    </div>
                    {overflow > 0 && (
                      <span className="ml-1 text-xs text-dark-5 dark:text-dark-6">
                        +{overflow}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-dark-5 dark:text-dark-6">
                    {project.completedTasks}/{project.totalTasks} tasks
                  </span>
                </div>

                {/* Due date + Open button */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-dark-5 dark:text-dark-6">
                    <svg className="size-3.5" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {project.dueDate}
                  </div>
                  <Link
                    href="#"
                    className="rounded-lg border border-gray-3 px-3 py-1.5 text-xs font-medium text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6"
                  >
                    Open
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
