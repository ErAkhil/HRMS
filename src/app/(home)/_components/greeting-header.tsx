"use client";

import Link from "next/link";

const QUICK_ACTIONS = [
  {
    label: "Clock In",
    href: "/attendance",
    icon: (
      <svg className="size-4" viewBox="0 0 24 24" fill="none">
        <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: "bg-emerald text-white hover:bg-emerald-dark",
  },
  {
    label: "Apply Leave",
    href: "/leave",
    icon: (
      <svg className="size-4" viewBox="0 0 24 24" fill="none">
        <path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50",
  },
  {
    label: "New Task",
    href: "/tasks",
    icon: (
      <svg className="size-4" viewBox="0 0 24 24" fill="none">
        <path d="M12 4.5v15m7.5-7.5h-15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: "bg-gray-2 text-dark-5 hover:bg-gray-3 dark:bg-dark-3 dark:text-dark-6 dark:hover:bg-dark-4",
  },
];

const STATS = [
  {
    label: "Productivity",
    value: "87%",
    trend: "+5% this week",
    positive: true,
    icon: (
      <svg className="size-4" viewBox="0 0 24 24" fill="none">
        <path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-300",
  },
  {
    label: "Hours Today",
    value: "6h 32m",
    trend: "2h 28m remaining",
    positive: true,
    icon: (
      <svg className="size-4" viewBox="0 0 24 24" fill="none">
        <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: "text-emerald bg-emerald-light dark:bg-emerald-dark/20 dark:text-emerald",
  },
  {
    label: "Tasks Done",
    value: "12 / 18",
    trend: "4 due today",
    positive: false,
    icon: (
      <svg className="size-4" viewBox="0 0 24 24" fill="none">
        <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: "text-amber bg-amber-light dark:bg-amber-dark/20 dark:text-amber",
  },
  {
    label: "Pending Approvals",
    value: "3",
    trend: "Needs attention",
    positive: false,
    icon: (
      <svg className="size-4" viewBox="0 0 24 24" fill="none">
        <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: "text-rose bg-rose-light dark:bg-rose-dark/20 dark:text-rose",
  },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function GreetingHeader() {
  return (
    <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 md:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: greeting */}
        <div className="space-y-1">
          <p className="text-xs font-medium text-dark-5 dark:text-dark-6">
            {formatDate()}
          </p>
          <h2 className="text-xl font-bold text-dark dark:text-white md:text-2xl">
            {getGreeting()}, John Anderson
          </h2>
          <p className="text-sm text-dark-5 dark:text-dark-6">
            HR Manager · Acme Corporation · Engineering Dept
          </p>
        </div>

        {/* Right: quick actions */}
        <div className="flex shrink-0 flex-wrap gap-2">
          {QUICK_ACTIONS.map((a) => (
            <Link
              key={a.label}
              href={a.href}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${a.color}`}
            >
              {a.icon}
              {a.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-gray-3 pt-5 dark:border-dark-3 sm:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="flex items-center gap-3">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${s.color}`}>
              {s.icon}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-dark dark:text-white">{s.value}</p>
              <p className="truncate text-xs text-dark-5 dark:text-dark-6">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
