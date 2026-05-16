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
    color: "bg-primary-100 text-primary-700 hover:bg-primary-200 dark:bg-primary-900/30 dark:text-primary-300 dark:hover:bg-primary-900/50",
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

function extractUserInfo(session: any) {
  return {
    name: session?.user?.name ?? session?.user?.email?.split("@")[0] ?? "there",
    role: (session?.user?.role ?? "EMPLOYEE").replaceAll("_", " ").toLowerCase(),
    org: session?.user?.orgName ?? "Monja",
  };
}

function QuickActionButton({ action }: Readonly<{ action: (typeof QUICK_ACTIONS)[0] }>) {
  return (
    <Link href={action.href} className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${action.color}`}>
      {action.icon}
      {action.label}
    </Link>
  );
}

export function GreetingHeader() {
  const { data: session } = useSession();
  const user = extractUserInfo(session);

  return (
    <div className="card-p md:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-muted font-medium">{formatDate()}</p>
          <h2 className="page-title md:text-2xl capitalize">{getGreeting()}, {user.name}</h2>
          <p className="text-sm text-dark-5 dark:text-dark-6 capitalize">{user.role} · {user.org}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          {QUICK_ACTIONS.map((a) => (
            <QuickActionButton key={a.label} action={a} />
          ))}
        </div>
      </div>
    </div>
  );
}
