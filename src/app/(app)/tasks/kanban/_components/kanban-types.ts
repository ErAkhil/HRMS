export type Priority = "High" | "Medium" | "Low";
export type ColumnKey = "todo" | "inprogress" | "review" | "done";

export interface KanbanTask {
  id: string;
  title: string;
  project: string;
  projectColor: string;
  priority: Priority;
  dueDate: string;
  overdue?: boolean;
  avatar: string;
  comments: number;
  attachments: number;
  subtasks?: { done: number; total: number };
}

export interface KanbanColumn {
  key: ColumnKey;
  label: string;
  headerColor: string;
  dotColor: string;
  tasks: KanbanTask[];
}

export const PRIORITY_CONFIG: Record<Priority, { dot: string; bg: string; text: string }> = {
  High: {
    dot: "bg-rose-dark",
    bg: "bg-rose-light dark:bg-rose-dark/20",
    text: "text-rose-dark",
  },
  Medium: {
    dot: "bg-amber-dark",
    bg: "bg-amber-light dark:bg-amber-dark/20",
    text: "text-amber-dark",
  },
  Low: {
    dot: "bg-emerald-dark",
    bg: "bg-emerald-light dark:bg-emerald-dark/20",
    text: "text-emerald-dark dark:text-emerald",
  },
};

export const PROJECT_COLORS: Record<string, string> = {
  indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300",
  emerald: "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  violet: "bg-violet-light text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300",
  amber: "bg-amber-light text-amber-dark",
  sky: "bg-sky-50 text-sky-dark dark:bg-sky-dark/10 dark:text-sky",
  rose: "bg-rose-light text-rose-dark",
};

export const COLUMN_LABELS: Record<ColumnKey, string> = {
  todo: "To Do",
  inprogress: "In Progress",
  review: "Review",
  done: "Done",
};

export const PROJECTS_LIST = [
  "All Projects",
  "Q2 Workforce Analytics",
  "HRMS Migration",
  "Employee Portal Redesign",
  "Benefits Package Review",
  "Compliance Training Q2",
];
