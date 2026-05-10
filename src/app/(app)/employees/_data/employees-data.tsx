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

export const actionItems = [
  {
    icon: (
      <svg className="h-5 w-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3-3v6M4.5 19.5l15-15M4.5 4.5l15 15" />
      </svg>
    ),
    description: "3 Contract renewals due this week",
    badge: "Urgent",
    badgeClass: "bg-rose-light text-rose-dark dark:bg-rose-dark/20 dark:text-rose",
    action: "Review",
  },
  {
    icon: (
      <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    description: "5 Probation reviews scheduled",
    badge: "This Week",
    badgeClass: "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber",
    action: "Schedule",
  },
  {
    icon: (
      <svg className="h-5 w-5 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h2m10-4H7a2 2 0 00-2 2v4h14V6a2 2 0 00-2-2z" />
      </svg>
    ),
    description: "2 Exit interviews pending",
    badge: "Pending",
    badgeClass: "bg-violet-light text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300",
    action: "Start",
  },
  {
    icon: (
      <svg className="h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    description: "1 Promotion approval awaiting",
    badge: "Review",
    badgeClass: "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-300",
    action: "Approve",
  },
  {
    icon: (
      <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    description: "Annual performance cycle starts June 1",
    badge: "Upcoming",
    badgeClass: "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
    action: "Prepare",
  },
];

export const employmentTypes = [
  { label: "Full-time", dot: "bg-primary-600" },
  { label: "Part-time", dot: "bg-violet-500" },
  { label: "Contract", dot: "bg-amber-500" },
];
