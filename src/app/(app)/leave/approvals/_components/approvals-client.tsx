"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";
import { approveLeave, rejectLeave } from "@/lib/actions/leave";

type LeaveRequest = {
  id: string;
  employeeName: string;
  employeeDept: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: string;
  createdAt: string;
};

const LEAVE_BADGE: Record<string, string> = {
  ANNUAL: "rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-dark dark:bg-sky-dark/10 dark:text-sky",
  SICK: "rounded-full bg-rose-light px-2.5 py-0.5 text-xs font-medium text-rose-dark dark:bg-rose-dark/20 dark:text-rose",
  CASUAL: "rounded-full bg-amber-light px-2.5 py-0.5 text-xs font-medium text-amber-dark dark:bg-amber-dark/20 dark:text-amber",
  MATERNITY: "rounded-full bg-violet-light px-2.5 py-0.5 text-xs font-medium text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300",
  PATERNITY: "rounded-full bg-violet-light px-2.5 py-0.5 text-xs font-medium text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300",
  UNPAID: "rounded-full bg-gray-2 px-2.5 py-0.5 text-xs font-medium text-dark-5 dark:bg-dark-3 dark:text-dark-6",
  OTHER: "rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300",
};

export function ApprovalsClient({ requests }: Readonly<{ requests: LeaveRequest[] }>) {
  const router = useRouter();
  const { toast, setToast } = useToast();
  const [filter, setFilter] = useState("All");
  const [processing, setProcessing] = useState<string | null>(null);
  const [actionedIds, setActionedIds] = useState<Record<string, "approved" | "rejected">>({});

  const filtered = requests.filter((r) => {
    if (filter === "All") return true;
    return r.leaveType === filter.toUpperCase();
  });

  async function handleApprove(id: string) {
    setProcessing(id);
    try {
      await approveLeave(id);
      setActionedIds((p) => ({ ...p, [id]: "approved" }));
      setToast("Leave approved successfully!");
      router.refresh();
    } catch {
      setToast("Failed to approve leave.");
    } finally {
      setProcessing(null);
    }
  }

  async function handleReject(id: string) {
    setProcessing(id);
    try {
      await rejectLeave(id);
      setActionedIds((p) => ({ ...p, [id]: "rejected" }));
      setToast("Leave rejected.");
      router.refresh();
    } catch {
      setToast("Failed to reject leave.");
    } finally {
      setProcessing(null);
    }
  }

  const pendingCount = requests.filter((r) => !actionedIds[r.id]).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2 text-xs text-dark-5 dark:text-dark-6">
            <Link href="/leave" className="hover:text-primary-600">Leave</Link>
            <span>/</span>
            <span>Approvals</span>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-heading-5 font-bold text-dark dark:text-white">Pending Approvals</h1>
            {pendingCount > 0 && (
              <span className="rounded-full bg-rose-light px-2.5 py-0.5 text-xs font-medium text-rose-dark dark:bg-rose-dark/20 dark:text-rose">
                {pendingCount}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">Review and action team leave requests</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap items-center gap-1">
        {["All", "Annual", "Sick", "Casual"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filter === cat
                ? "bg-primary-600 text-white"
                : "border border-gray-3 text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6 dark:hover:bg-dark-3"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-xl bg-white p-12 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-2 dark:bg-dark-3">
              <svg className="h-6 w-6 text-dark-5 dark:text-dark-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-dark dark:text-white">No pending requests</p>
            <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">All leave requests have been actioned.</p>
          </div>
        ) : (
          filtered.map((req) => {
            const actioned = actionedIds[req.id];

            if (actioned) {
              return (
                <div key={req.id} className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 opacity-60">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-2 dark:bg-dark-3 text-sm font-bold text-dark dark:text-white">
                      {req.employeeName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-dark dark:text-white">{req.employeeName}</p>
                      <p className="text-xs text-dark-5 dark:text-dark-6">{req.leaveType} leave</p>
                    </div>
                    <span className={actioned === "approved"
                      ? "rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald"
                      : "rounded-full bg-rose-light px-2.5 py-0.5 text-xs font-medium text-rose-dark dark:bg-rose-dark/20 dark:text-rose"
                    }>
                      {actioned === "approved" ? "Approved" : "Rejected"}
                    </span>
                  </div>
                </div>
              );
            }

            const daysAgo = Math.floor((Date.now() - new Date(req.createdAt).getTime()) / 86400000);

            return (
              <div key={req.id} className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
                      {req.employeeName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-dark dark:text-white">{req.employeeName}</p>
                        <span className={LEAVE_BADGE[req.leaveType] ?? LEAVE_BADGE.OTHER}>
                          {req.leaveType.charAt(0) + req.leaveType.slice(1).toLowerCase()} Leave
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">{req.employeeDept}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <svg className="h-3.5 w-3.5 text-dark-5 dark:text-dark-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-xs font-medium text-dark dark:text-white">
                            {new Date(req.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} —{" "}
                            {new Date(req.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        </div>
                        <span className="rounded-full bg-gray-2 px-2 py-0.5 text-xs font-medium text-dark-5 dark:bg-dark-3 dark:text-dark-6">
                          {req.days} day{req.days > 1 ? "s" : ""}
                        </span>
                        <span className="text-xs text-dark-5 dark:text-dark-6">
                          {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
                        </span>
                      </div>
                      {req.reason && (
                        <p className="mt-2 text-xs text-dark-5 dark:text-dark-6 italic">"{req.reason}"</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                    <button
                      onClick={() => handleReject(req.id)}
                      disabled={processing === req.id}
                      className="rounded-lg border border-rose-500 px-4 py-2 text-sm font-medium text-rose-dark transition-colors hover:bg-rose-light disabled:opacity-50 dark:border-rose-dark/50 dark:text-rose dark:hover:bg-rose-dark/10"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(req.id)}
                      disabled={processing === req.id}
                      className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 disabled:opacity-50"
                    >
                      {processing === req.id ? "..." : "Approve"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <Toast message={toast} />
    </div>
  );
}
