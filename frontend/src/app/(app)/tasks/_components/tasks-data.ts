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
