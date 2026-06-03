"use client";

import { useTransition } from "react";
import type { SerializedLeaveRequest } from "@/lib/actions/leave";
import { cancelLeave } from "@/lib/actions/leave";
import { useRouter } from "next/navigation";

const LEAVE_TYPE_DISPLAY: Record<string, string> = {
  ANNUAL: "Annual Leave",
  SICK: "Sick Leave",
  CASUAL: "Casual Leave",
  MATERNITY: "Maternity Leave",
  PATERNITY: "Paternity Leave",
  UNPAID: "Unpaid Leave",
  OTHER: "Other",
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

interface Props {
  request: SerializedLeaveRequest;
  onClose: () => void;
  onCancelled?: () => void;
}

export function LeaveViewModal({ request, onClose, onCancelled }: Readonly<Props>) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const displayType = LEAVE_TYPE_DISPLAY[request.leaveType] ?? request.leaveType;
  const isPending_ = request.status === "PENDING";

  const statusColors: Record<string, string> = {
    APPROVED: "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
    PENDING: "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber",
    REJECTED: "bg-rose-light text-rose-dark dark:bg-rose-dark/20 dark:text-rose",
  };

  function handleCancel() {
    startTransition(async () => {
      try {
        await cancelLeave(request.id);
        router.refresh();
        onCancelled?.();
        onClose();
      } catch {
        // error surfaced via refresh
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl dark:bg-dark-2">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-3 px-6 py-4 dark:border-dark-3">
          <h2 className="text-base font-semibold text-dark dark:text-white">Leave Request Details</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-gray-1 dark:hover:bg-dark-3"
          >
            <svg className="h-4 w-4 text-dark-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 px-6 py-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-dark-5 dark:text-dark-6">Leave Type</span>
            <span className="text-sm font-medium text-dark dark:text-white">{displayType}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-dark-5 dark:text-dark-6">Status</span>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[request.status] ?? ""}`}>
              {request.status.charAt(0) + request.status.slice(1).toLowerCase()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-dark-5 dark:text-dark-6">From</span>
            <span className="text-sm text-dark dark:text-white">{formatDate(request.startDate)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-dark-5 dark:text-dark-6">To</span>
            <span className="text-sm text-dark dark:text-white">{formatDate(request.endDate)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-dark-5 dark:text-dark-6">Duration</span>
            <span className="text-sm font-semibold text-dark dark:text-white">{request.days} day{request.days === 1 ? "" : "s"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-dark-5 dark:text-dark-6">Applied On</span>
            <span className="text-sm text-dark-5 dark:text-dark-6">{formatDate(request.createdAt)}</span>
          </div>
          {request.approvedAt && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-dark-5 dark:text-dark-6">
                {request.status === "APPROVED" ? "Approved On" : "Rejected On"}
              </span>
              <span className="text-sm text-dark-5 dark:text-dark-6">{formatDate(request.approvedAt)}</span>
            </div>
          )}
          <div className="rounded-lg bg-gray-1 p-3 dark:bg-dark-3">
            <p className="mb-1 text-xs font-medium text-dark-5 dark:text-dark-6">Reason</p>
            <p className="text-sm text-dark dark:text-white">{request.reason}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-gray-3 px-6 py-4 dark:border-dark-3">
          {isPending_ && (
            <button
              onClick={handleCancel}
              disabled={isPending}
              className="rounded-lg border border-rose-300 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-60 dark:border-rose-800 dark:hover:bg-rose-900/20"
            >
              {isPending ? "Cancelling…" : "Cancel Request"}
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-3 px-4 py-2 text-sm font-medium text-dark hover:bg-gray-1 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
