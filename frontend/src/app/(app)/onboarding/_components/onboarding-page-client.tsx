"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";
import Link from "next/link";
import { createOnboarding } from "@/lib/actions/onboarding";

type OnboardingRecord = {
  id: string;
  employeeId: string;
  name: string;
  avatarUrl: string | null;
  role: string;
  department: string;
  startDate: string;
  progress: number;
  pendingTasks: number;
  daysRemaining: number | null;
  status: string;
};

type Stats = {
  inProgress: number;
  completedThisMonth: number;
  completingThisWeek: number;
};

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

const DEPT_COLORS: Record<string, string> = {
  Engineering: "rounded-full bg-primary-50 px-2.5 py-0.5 font-medium text-primary-600 dark:bg-primary-900/20 dark:text-primary-300",
  Marketing: "rounded-full bg-rose-light px-2.5 py-0.5 font-medium text-rose-dark",
  Sales: "rounded-full bg-emerald-light px-2.5 py-0.5 font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  HR: "rounded-full bg-amber-light px-2.5 py-0.5 font-medium text-amber-dark",
  Finance: "rounded-full bg-sky-50 px-2.5 py-0.5 font-medium text-sky-dark dark:bg-sky-dark/10 dark:text-sky",
  Product: "rounded-full bg-violet-light px-2.5 py-0.5 font-medium text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300",
};

function getDeptColor(dept: string) {
  return DEPT_COLORS[dept] ?? "rounded-full bg-gray-100 px-2.5 py-0.5 font-medium text-gray-600 dark:bg-dark-3 dark:text-dark-6";
}

function getProgressColor(pct: number) {
  if (pct >= 80) return "bg-emerald-500";
  if (pct >= 50) return "bg-primary-500";
  if (pct >= 25) return "bg-amber-500";
  return "bg-rose-500";
}

export function OnboardingPageClient({ records, stats }: Readonly<{ records: OnboardingRecord[]; stats: Stats }>) {
  const [showModal, setShowModal] = useState(false);
  const { toast, setToast } = useToast();
  const router = useRouter();

  const [form, setForm] = useState({
    employeeId: "",
    startDate: "",
    dueDate: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await createOnboarding({
        employeeId: form.employeeId,
        startDate: form.startDate,
        dueDate: form.dueDate || undefined,
      });
      setShowModal(false);
      setForm({ employeeId: "", startDate: "", dueDate: "" });
      setToast("Onboarding started successfully!");
      router.refresh();
    } catch (err) {
      setToast(err instanceof Error ? err.message : "Failed to start onboarding.");
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-dark dark:text-white">Onboarding</h1>
            <span className="rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald">
              {stats.inProgress} in progress
            </span>
          </div>
          <p className="text-xs text-dark-5 dark:text-dark-6 mt-0.5">Track new employee onboarding journeys</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/onboarding/offboarding" className="rounded-lg border border-gray-3 px-4 py-2 text-sm font-medium text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6">
            Offboarding
          </Link>
          <button
            onClick={() => setShowModal(true)}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 flex items-center gap-2"
          >
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
              <p className="mt-1 text-2xl font-bold text-dark dark:text-white">{stats.inProgress}</p>
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
              <p className="mt-1 text-2xl font-bold text-dark dark:text-white">{stats.completingThisWeek}</p>
              <p className="mt-0.5 text-xs text-amber-dark">Onboardings due soon</p>
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
              <p className="mt-1 text-2xl font-bold text-dark dark:text-white">{stats.completedThisMonth}</p>
              <p className="mt-0.5 text-xs text-emerald-dark dark:text-emerald">successfully onboarded</p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-light dark:bg-emerald-dark/20">
              <svg className="h-5 w-5 text-emerald-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
        </div>
      </div>

      {/* Onboarding Cards Grid */}
      {records.length === 0 ? (
        <div className="rounded-xl bg-white p-10 shadow-card dark:bg-dark-2 text-center">
          <p className="text-dark-5 dark:text-dark-6 mb-3">No active onboardings.</p>
          <button
            onClick={() => setShowModal(true)}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
          >
            Start First Onboarding
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {records.map((ob) => (
            <div key={ob.id} className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
              <div className="flex items-start gap-3">
                {ob.avatarUrl ? (
                  <img src={ob.avatarUrl} alt={ob.name} className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-600 dark:bg-primary-900/30 dark:text-primary-300">
                    {getInitials(ob.name)}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-dark dark:text-white truncate">{ob.name}</p>
                  <p className="text-xs text-dark-5 dark:text-dark-6">{ob.role}</p>
                  <span className={`text-xs ${getDeptColor(ob.department)}`}>{ob.department}</span>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-dark-5 dark:text-dark-6">Progress</span>
                  <span className="text-xs font-semibold text-dark dark:text-white">{ob.progress}%</span>
                </div>
                <div className="relative h-2 rounded-full bg-gray-2 dark:bg-dark-3 overflow-hidden">
                  <div className={`absolute inset-y-0 left-0 rounded-full ${getProgressColor(ob.progress)}`} style={{ width: `${ob.progress}%` }} />
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-dark-5 dark:text-dark-6">
                <span>Started {ob.startDate}</span>
                {ob.daysRemaining !== null && (
                  <span className={ob.daysRemaining <= 3 ? "text-rose-dark font-semibold" : "text-amber-dark"}>
                    {ob.daysRemaining === 0 ? "Due today" : `${ob.daysRemaining}d remaining`}
                  </span>
                )}
              </div>

              {ob.pendingTasks > 0 && (
                <div className="mt-2">
                  <span className="inline-flex items-center rounded-full bg-amber-light px-2 py-0.5 text-xs font-medium text-amber-dark dark:bg-amber-dark/20 dark:text-amber">
                    {ob.pendingTasks} tasks pending
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* New Onboarding Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-modal dark:bg-dark-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-dark dark:text-white">Start New Onboarding</h2>
              <button
                onClick={() => setShowModal(false)}
                className="flex size-8 items-center justify-center rounded-lg text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3"
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-dark-5 dark:text-dark-6 mb-1">
                  Employee ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Employee ID from the system"
                  value={form.employeeId}
                  onChange={(e) => setForm((p) => ({ ...p, employeeId: e.target.value }))}
                  className="w-full rounded-lg border border-gray-3 bg-white px-3 py-2 text-sm text-dark outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
                />
                <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">Find employee IDs on the Employees page.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-dark-5 dark:text-dark-6 mb-1">
                    Start Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={form.startDate}
                    onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
                    className="w-full rounded-lg border border-gray-3 bg-white px-3 py-2 text-sm text-dark outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-dark-5 dark:text-dark-6 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))}
                    className="w-full rounded-lg border border-gray-3 bg-white px-3 py-2 text-sm text-dark outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-gray-3 px-4 py-2 text-sm font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
                >
                  Start Onboarding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Toast message={toast} />
    </div>
  );
}
