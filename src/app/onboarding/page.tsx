import Link from "next/link";
import { OnboardingCard } from "./_components/OnboardingCard";

const onboardings = [
  {
    id: 1,
    name: "Sasha Williams",
    avatar: "/images/user/user-01.png",
    role: "QA Manager",
    department: "Engineering",
    startDate: "May 1, 2026",
    progress: 75,
    pendingTasks: 3,
    daysRemaining: 8,
    departmentColor: "rounded-full bg-indigo-50 px-2.5 py-0.5 font-medium text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300",
  },
  {
    id: 2,
    name: "Omar Hassan",
    avatar: "/images/user/user-02.png",
    role: "AI Engineer",
    department: "Engineering",
    startDate: "May 5, 2026",
    progress: 52,
    pendingTasks: 5,
    daysRemaining: 12,
    departmentColor: "rounded-full bg-indigo-50 px-2.5 py-0.5 font-medium text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300",
  },
  {
    id: 3,
    name: "Bea Nguyen",
    avatar: "/images/user/user-03.png",
    role: "Content Lead",
    department: "Marketing",
    startDate: "May 3, 2026",
    progress: 88,
    pendingTasks: 1,
    daysRemaining: 2,
    departmentColor: "rounded-full bg-rose-light px-2.5 py-0.5 font-medium text-rose-dark",
  },
  {
    id: 4,
    name: "Raj Nair",
    avatar: "/images/user/user-04.png",
    role: "Sales Executive",
    department: "Sales",
    startDate: "May 6, 2026",
    progress: 30,
    pendingTasks: 7,
    daysRemaining: 18,
    departmentColor: "rounded-full bg-emerald-light px-2.5 py-0.5 font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  },
  {
    id: 5,
    name: "Tara Pinto",
    avatar: "/images/user/user-05.png",
    role: "HR Specialist",
    department: "HR",
    startDate: "Apr 28, 2026",
    progress: 95,
    pendingTasks: 0,
    daysRemaining: 1,
    departmentColor: "rounded-full bg-amber-light px-2.5 py-0.5 font-medium text-amber-dark",
  },
  {
    id: 6,
    name: "Niko Stavros",
    avatar: "/images/user/user-06.png",
    role: "Financial Analyst",
    department: "Finance",
    startDate: "May 7, 2026",
    progress: 15,
    pendingTasks: 9,
    daysRemaining: 23,
    departmentColor: "rounded-full bg-sky-50 px-2.5 py-0.5 font-medium text-sky-dark dark:bg-sky-dark/10 dark:text-sky",
  },
];

export const metadata = {
  title: "Onboarding",
};

export default function OnboardingPage() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-dark dark:text-white">Onboarding</h1>
            <span className="rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald">
              6 in progress
            </span>
          </div>
          <p className="text-xs text-dark-5 dark:text-dark-6 mt-0.5">Track new employee onboarding journeys</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/onboarding/offboarding"
            className="rounded-lg border border-gray-3 px-4 py-2 text-sm font-medium text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6"
          >
            Offboarding
          </Link>
          <button className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Onboarding
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-dark-5 dark:text-dark-6">In Progress</p>
              <p className="mt-1 text-2xl font-bold text-dark dark:text-white">6</p>
              <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">active onboarding journeys</p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 dark:bg-sky-dark/10">
              <svg className="h-5 w-5 text-sky-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </span>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-dark-5 dark:text-dark-6">Completing This Week</p>
              <p className="mt-1 text-2xl font-bold text-dark dark:text-white">2</p>
              <p className="mt-0.5 text-xs text-amber-dark">Bea Nguyen &amp; Tara Pinto</p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-light dark:bg-amber-dark/20">
              <svg className="h-5 w-5 text-amber-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-dark-5 dark:text-dark-6">Completed This Month</p>
              <p className="mt-1 text-2xl font-bold text-dark dark:text-white">9</p>
              <p className="mt-0.5 text-xs text-emerald-dark dark:text-emerald">average 96% satisfaction</p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-light dark:bg-emerald-dark/20">
              <svg className="h-5 w-5 text-emerald-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
        </div>
      </div>

      {/* AI Insight */}
      <div
        className="rounded-xl p-4 text-white"
        style={{ background: "linear-gradient(135deg, #4F46E5, #8B5CF6)" }}
      >
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/20">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-white/70 mb-0.5">AI Insight</p>
            <p className="text-sm font-medium text-white">
              Bea Nguyen and Tara Pinto are completing onboarding this week. Send welcome-to-team announcements and schedule 30-day check-ins. Niko Stavros (Day 1) needs IT setup completed immediately.
            </p>
          </div>
          <span className="ml-auto shrink-0 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white">AI</span>
        </div>
      </div>

      {/* Onboarding Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {onboardings.map((ob) => (
          <OnboardingCard key={ob.id} {...ob} />
        ))}
      </div>
    </div>
  );
}
