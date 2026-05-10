export type Priority = "High" | "Medium" | "Low";
export type TaskGroup = "Today" | "This Week" | "Later";

export interface Task {
  id: string;
  title: string;
  project: string;
  projectColor: string;
  priority: Priority;
  dueDate: string;
  avatar: string;
  group: TaskGroup;
  completed?: boolean;
}

export const TASKS: Task[] = [
  // Today (4)
  {
    id: "t1",
    title: "Review Q2 performance self-assessments",
    project: "Performance",
    projectColor: "indigo",
    priority: "High",
    dueDate: "Today",
    avatar: "/images/user/user-01.png",
    group: "Today",
  },
  {
    id: "t2",
    title: "Update onboarding checklist for Batch 12",
    project: "Onboarding",
    projectColor: "emerald",
    priority: "High",
    dueDate: "Today",
    avatar: "/images/user/user-02.png",
    group: "Today",
  },
  {
    id: "t3",
    title: "Draft job descriptions for 3 Engineering roles",
    project: "Recruitment",
    projectColor: "violet",
    priority: "Medium",
    dueDate: "Today",
    avatar: "/images/user/user-12.png",
    group: "Today",
  },
  {
    id: "t4",
    title: "Send calendar invites for Friday panel interviews",
    project: "Recruitment",
    projectColor: "violet",
    priority: "Low",
    dueDate: "Today",
    avatar: "/images/user/user-12.png",
    group: "Today",
  },
  // This Week (8)
  {
    id: "t5",
    title: "Finalize benefits package comparison deck",
    project: "Benefits",
    projectColor: "amber",
    priority: "High",
    dueDate: "May 9",
    avatar: "/images/user/user-03.png",
    group: "This Week",
  },
  {
    id: "t6",
    title: "Review HRMS migration data mapping document",
    project: "HRMS Migration",
    projectColor: "sky",
    priority: "High",
    dueDate: "May 9",
    avatar: "/images/user/user-04.png",
    group: "This Week",
  },
  {
    id: "t7",
    title: "Prepare Q2 workforce analytics report",
    project: "Analytics",
    projectColor: "indigo",
    priority: "Medium",
    dueDate: "May 10",
    avatar: "/images/user/user-05.png",
    group: "This Week",
  },
  {
    id: "t8",
    title: "Schedule compliance training sessions",
    project: "Compliance",
    projectColor: "rose",
    priority: "Medium",
    dueDate: "May 10",
    avatar: "/images/user/user-06.png",
    group: "This Week",
  },
  {
    id: "t9",
    title: "Update employee handbook remote work section",
    project: "HR Policies",
    projectColor: "emerald",
    priority: "Medium",
    dueDate: "May 11",
    avatar: "/images/user/user-07.png",
    group: "This Week",
  },
  {
    id: "t10",
    title: "Coordinate with legal on employment contract templates",
    project: "Compliance",
    projectColor: "rose",
    priority: "Low",
    dueDate: "May 11",
    avatar: "/images/user/user-08.png",
    group: "This Week",
  },
  {
    id: "t11",
    title: "Send weekly HR newsletter to all-staff",
    project: "HR Policies",
    projectColor: "emerald",
    priority: "Low",
    dueDate: "May 12",
    avatar: "/images/user/user-09.png",
    group: "This Week",
  },
  {
    id: "t12",
    title: "Review candidate shortlist for Sales Manager role",
    project: "Recruitment",
    projectColor: "violet",
    priority: "High",
    dueDate: "May 12",
    avatar: "/images/user/user-10.png",
    group: "This Week",
  },
  // Later (6)
  {
    id: "t13",
    title: "Plan Q3 headcount forecasting workshop",
    project: "Analytics",
    projectColor: "indigo",
    priority: "Medium",
    dueDate: "May 20",
    avatar: "/images/user/user-11.png",
    group: "Later",
  },
  {
    id: "t14",
    title: "Design employee engagement survey for H2",
    project: "HR Policies",
    projectColor: "emerald",
    priority: "Medium",
    dueDate: "May 22",
    avatar: "/images/user/user-01.png",
    group: "Later",
  },
  {
    id: "t15",
    title: "Audit payroll data for Q2 reconciliation",
    project: "Benefits",
    projectColor: "amber",
    priority: "High",
    dueDate: "May 28",
    avatar: "/images/user/user-02.png",
    group: "Later",
  },
  {
    id: "t16",
    title: "Create new hire orientation presentation deck",
    project: "Onboarding",
    projectColor: "emerald",
    priority: "Low",
    dueDate: "May 30",
    avatar: "/images/user/user-03.png",
    group: "Later",
  },
  {
    id: "t17",
    title: "Implement automated offboarding checklist workflow",
    project: "Onboarding",
    projectColor: "emerald",
    priority: "Medium",
    dueDate: "Jun 5",
    avatar: "/images/user/user-04.png",
    group: "Later",
  },
  {
    id: "t18",
    title: "Finalize Recruitment Campaign 2026 brief",
    project: "Recruitment",
    projectColor: "violet",
    priority: "High",
    dueDate: "Jun 10",
    avatar: "/images/user/user-05.png",
    group: "Later",
  },
];

// 3 overdue tasks (reuse some with past dates for display)
export const OVERDUE_TASKS: Task[] = [
  {
    id: "o1",
    title: "Submit April expense reports to Finance",
    project: "Benefits",
    projectColor: "amber",
    priority: "High",
    dueDate: "May 2",
    avatar: "/images/user/user-06.png",
    group: "Today",
  },
  {
    id: "o2",
    title: "Resolve payroll discrepancy for 3 employees",
    project: "Benefits",
    projectColor: "amber",
    priority: "High",
    dueDate: "May 3",
    avatar: "/images/user/user-07.png",
    group: "Today",
  },
  {
    id: "o3",
    title: "Renew workplace safety certification",
    project: "Compliance",
    projectColor: "rose",
    priority: "Medium",
    dueDate: "May 4",
    avatar: "/images/user/user-08.png",
    group: "Today",
  },
];

export const PROJECT_COLORS: Record<string, string> = {
  indigo: "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-300",
  emerald: "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  violet: "bg-violet-light text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300",
  amber: "bg-amber-light text-amber-dark",
  sky: "bg-sky-50 text-sky-dark dark:bg-sky-dark/10 dark:text-sky",
  rose: "bg-rose-light text-rose-dark",
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  High: "bg-rose-dark",
  Medium: "bg-amber-dark",
  Low: "bg-emerald-dark",
};
