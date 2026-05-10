export interface ExitTask {
  label: string;
  done: boolean;
}

export interface OffboardingRecord {
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

export const offboardings: OffboardingRecord[] = [
  {
    id: 1, name: "Kevin Lee", avatar: "/images/user/user-07.png",
    role: "Data Analyst", department: "Finance",
    departmentColor: "rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-dark dark:bg-sky-dark/10 dark:text-sky",
    lastDay: "May 31, 2026", reason: "New opportunity",
    tasks: [
      { label: "Assets Return", done: true }, { label: "Knowledge Transfer", done: true },
      { label: "Exit Interview", done: false }, { label: "Final Settlement", done: false },
    ],
  },
  {
    id: 2, name: "James Williams", avatar: "/images/user/user-08.png",
    role: "Sales Lead", department: "Sales",
    departmentColor: "rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
    lastDay: "May 22, 2026", reason: "Relocation",
    tasks: [
      { label: "Assets Return", done: true }, { label: "Knowledge Transfer", done: false },
      { label: "Exit Interview", done: false }, { label: "Final Settlement", done: false },
    ],
  },
  {
    id: 3, name: "Lisa Chen", avatar: "/images/user/user-09.png",
    role: "Marketing Head", department: "Marketing",
    departmentColor: "rounded-full bg-rose-light px-2.5 py-0.5 text-xs font-medium text-rose-dark",
    lastDay: "May 15, 2026", reason: "Retirement",
    tasks: [
      { label: "Assets Return", done: true }, { label: "Knowledge Transfer", done: true },
      { label: "Exit Interview", done: true }, { label: "Final Settlement", done: false },
    ],
  },
  {
    id: 4, name: "Tom Bradley", avatar: "/images/user/user-10.png",
    role: "Account Executive", department: "Sales",
    departmentColor: "rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
    lastDay: "Jun 7, 2026", reason: "Contract end",
    tasks: [
      { label: "Assets Return", done: false }, { label: "Knowledge Transfer", done: false },
      { label: "Exit Interview", done: false }, { label: "Final Settlement", done: false },
    ],
  },
];

export const taskIcons: Record<string, React.ReactNode> = {
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
