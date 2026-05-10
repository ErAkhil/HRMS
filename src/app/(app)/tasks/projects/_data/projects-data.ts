export interface Project {
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

export const PROJECTS: Project[] = [
  {
    id: "p1", name: "Q2 Workforce Analytics",
    description: "Deep-dive headcount analysis, attrition modeling, and reporting.",
    status: "Active", progress: 68, dueDate: "Jun 30, 2026",
    members: ["/images/user/user-01.png", "/images/user/user-05.png", "/images/user/user-09.png"],
    totalTasks: 24, completedTasks: 16, accentColor: "bg-indigo-600",
  },
  {
    id: "p2", name: "HRMS Migration",
    description: "Full data migration from legacy system to Unikove platform.",
    status: "Active", progress: 45, dueDate: "Jul 15, 2026",
    members: ["/images/user/user-04.png", "/images/user/user-06.png", "/images/user/user-08.png", "/images/user/user-10.png"],
    totalTasks: 40, completedTasks: 18, accentColor: "bg-sky-dark",
  },
  {
    id: "p3", name: "Employee Portal Redesign",
    description: "Redesigning the self-service portal for improved UX and accessibility.",
    status: "At Risk", progress: 89, dueDate: "May 20, 2026",
    members: ["/images/user/user-02.png", "/images/user/user-07.png", "/images/user/user-11.png"],
    totalTasks: 18, completedTasks: 16, accentColor: "bg-violet-dark",
  },
  {
    id: "p4", name: "Benefits Package Review",
    description: "Annual review and benchmarking of employee benefits offerings.",
    status: "Active", progress: 30, dueDate: "Jun 10, 2026",
    members: ["/images/user/user-03.png", "/images/user/user-12.png"],
    totalTasks: 20, completedTasks: 6, accentColor: "bg-amber-dark",
  },
  {
    id: "p5", name: "Compliance Training Q2",
    description: "Mandatory compliance and ethics training for all employees.",
    status: "Completed", progress: 100, dueDate: "Apr 30, 2026",
    members: ["/images/user/user-06.png", "/images/user/user-08.png", "/images/user/user-09.png"],
    totalTasks: 15, completedTasks: 15, accentColor: "bg-emerald-dark",
  },
  {
    id: "p6", name: "Onboarding Automation",
    description: "Automating the new hire onboarding workflow with AI-assisted checklists.",
    status: "Active", progress: 55, dueDate: "Jun 1, 2026",
    members: ["/images/user/user-01.png", "/images/user/user-04.png", "/images/user/user-07.png"],
    totalTasks: 22, completedTasks: 12, accentColor: "bg-primary-600",
  },
  {
    id: "p7", name: "Performance Review Cycle",
    description: "Coordinating Q2 performance review process across all departments.",
    status: "Active", progress: 72, dueDate: "May 31, 2026",
    members: ["/images/user/user-02.png", "/images/user/user-05.png", "/images/user/user-11.png", "/images/user/user-03.png"],
    totalTasks: 32, completedTasks: 23, accentColor: "bg-rose-dark",
  },
  {
    id: "p8", name: "Recruitment Campaign 2026",
    description: "Employer branding and talent acquisition campaign for 50+ new hires.",
    status: "Active", progress: 20, dueDate: "Aug 1, 2026",
    members: ["/images/user/user-10.png", "/images/user/user-12.png"],
    totalTasks: 45, completedTasks: 9, accentColor: "bg-violet-600",
  },
];

export const STATUS_COLORS: Record<Project["status"], string> = {
  Active: "rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300",
  Completed: "rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  Overdue: "rounded-full bg-rose-light px-2.5 py-0.5 text-xs font-medium text-rose-dark",
  "At Risk": "rounded-full bg-amber-light px-2.5 py-0.5 text-xs font-medium text-amber-dark",
};

export const PROGRESS_COLORS: Record<Project["status"], string> = {
  Active: "bg-primary-600",
  Completed: "bg-emerald-dark",
  Overdue: "bg-rose-dark",
  "At Risk": "bg-amber-dark",
};

export const PROJECT_STATS = [
  { label: "Active", value: 8, color: "text-primary-600 dark:text-primary-300" },
  { label: "Completed", value: 12, color: "text-emerald-dark dark:text-emerald" },
  { label: "Overdue", value: 2, color: "text-rose-dark" },
  { label: "This Month", value: 3, color: "text-amber-dark" },
];
