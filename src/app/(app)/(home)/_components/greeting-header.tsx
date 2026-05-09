"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

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
  const { data: session } = useSession();
  const name = session?.user?.name ?? session?.user?.email?.split("@")[0] ?? "there";
  const role = session?.user?.role?.replace(/_/g, " ").toLowerCase() ?? "employee";
  const org = session?.user?.orgName ?? "Unikove";

  return (
    <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 md:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: greeting */}
        <div className="space-y-1">
          <p className="text-xs font-medium text-dark-5 dark:text-dark-6">
            {formatDate()}
          </p>
          <h2 className="text-xl font-bold text-dark dark:text-white md:text-2xl capitalize">
            {getGreeting()}, {name}
          </h2>
          <p className="text-sm text-dark-5 dark:text-dark-6 capitalize">
            {role} · {org}
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
    </div>
  );
}
