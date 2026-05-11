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
  ANNUAL: "badge-info",
  SICK: "badge-error",
  CASUAL: "badge-warning",
  MATERNITY: "badge-ai",
  PATERNITY: "badge-ai",
  UNPAID: "badge-gray",
  OTHER: "badge-ai",
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
    <div className="page-container">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2 text-muted">
            <Link href="/leave" className="hover:text-primary-600">Leave</Link>
            <span>/</span>
            <span>Approvals</span>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="page-title">Pending Approvals</h1>
            {pendingCount > 0 && (
              <span className="badge-error">
                {pendingCount}
              </span>
            )}
          </div>
          <p className="text-muted mt-0.5">Review and action team leave requests</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap items-center gap-1">
        {["All", "Annual", "Sick", "Casual"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={filter === cat ? "btn-primary" : "btn-secondary"}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-2 dark:bg-dark-3">
              <svg className="h-6 w-6 text-dark-5 dark:text-dark-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-body-medium">No pending requests</p>
            <p className="text-muted mt-1">All leave requests have been actioned.</p>
          </div>
        ) : (
          filtered.map((req) => {
            const actioned = actionedIds[req.id];

            if (actioned) {
              return (
                <div key={req.id} className="card-p opacity-60">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-2 dark:bg-dark-3 text-sm font-bold text-dark dark:text-white">
                      {req.employeeName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-body-medium">{req.employeeName}</p>
                      <p className="text-muted">{req.leaveType} leave</p>
                    </div>
                    <span className={actioned === "approved" ? "badge-success" : "badge-error"}>
                      {actioned === "approved" ? "Approved" : "Rejected"}
                    </span>
                  </div>
                </div>
              );
            }

            const daysAgo = Math.floor((Date.now() - new Date(req.createdAt).getTime()) / 86400000);

            return (
              <div key={req.id} className="card-p">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
                      {req.employeeName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-body-medium font-semibold">{req.employeeName}</p>
                        <span className={LEAVE_BADGE[req.leaveType] ?? LEAVE_BADGE.OTHER}>
                          {req.leaveType.charAt(0) + req.leaveType.slice(1).toLowerCase()} Leave
                        </span>
                      </div>
                      <p className="text-muted mt-0.5">{req.employeeDept}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <svg className="h-3.5 w-3.5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-body-medium text-xs">
                            {new Date(req.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} —{" "}
                            {new Date(req.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        </div>
                        <span className="badge-gray">
                          {req.days} day{req.days > 1 ? "s" : ""}
                        </span>
                        <span className="text-muted">
                          {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
                        </span>
                      </div>
                      {req.reason && (
                        <p className="text-muted mt-2 italic">"{req.reason}"</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                    <button
                      onClick={() => handleReject(req.id)}
                      disabled={processing === req.id}
                      className="btn-danger"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(req.id)}
                      disabled={processing === req.id}
                      className="btn rounded-lg bg-emerald-500 text-white hover:bg-emerald-600"
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
