export const DEPT_COLORS = [
  "bg-primary-600", "bg-violet-500", "bg-emerald-500", "bg-amber-500",
  "bg-rose-500", "bg-sky-500", "bg-teal-500", "bg-orange-500",
];

export const deptBadgeColor: Record<string, string> = {
  Engineering: "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-300",
  Product: "bg-violet-light text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300",
  Sales: "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  Finance: "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber",
  HR: "bg-rose-light text-rose-dark dark:bg-rose-dark/20 dark:text-rose",
  Operations: "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-300",
};

export const employmentTypes = [
  { label: "Full-time", dot: "bg-primary-600" },
  { label: "Part-time", dot: "bg-violet-500" },
  { label: "Contract", dot: "bg-amber-500" },
];
