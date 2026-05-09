import type { LeaveRequest, Employee } from "@prisma/client";

type LeaveRequestWithEmployee = LeaveRequest & {
  employee: Pick<Employee, "firstName" | "lastName">;
};

interface LeaveRequestsTableProps {
  requests: LeaveRequestWithEmployee[];
}

type DisplayStatus = "Approved" | "Pending" | "Rejected";

const statusBadge: Record<DisplayStatus, string> = {
  Approved: "rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  Pending: "rounded-full bg-amber-light px-2.5 py-0.5 text-xs font-medium text-amber-dark dark:bg-amber-dark/20 dark:text-amber",
  Rejected: "rounded-full bg-rose-light px-2.5 py-0.5 text-xs font-medium text-rose-dark dark:bg-rose-dark/20 dark:text-rose",
};

const typeColors: Record<string, string> = {
  "Annual Leave": "bg-primary-50 text-primary-600 dark:bg-primary-900/20",
  "Sick Leave": "bg-rose-light text-rose-dark dark:bg-rose-dark/20 dark:text-rose",
  "Casual Leave": "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber",
  "Maternity Leave": "bg-pink-50 text-pink-600 dark:bg-pink-900/20",
  "Paternity Leave": "bg-sky-50 text-sky-dark dark:bg-sky-dark/10 dark:text-sky",
  "Unpaid Leave": "bg-gray-100 text-dark-5 dark:bg-dark-3",
  "Other": "bg-violet-100 text-violet-dark dark:bg-violet-dark/20 dark:text-violet-400",
};

const LEAVE_TYPE_DISPLAY: Record<string, string> = {
  ANNUAL: "Annual Leave",
  SICK: "Sick Leave",
  CASUAL: "Casual Leave",
  MATERNITY: "Maternity Leave",
  PATERNITY: "Paternity Leave",
  UNPAID: "Unpaid Leave",
  OTHER: "Other",
};

function mapStatus(status: string): DisplayStatus {
  if (status === "APPROVED") return "Approved";
  if (status === "REJECTED") return "Rejected";
  return "Pending";
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function LeaveRequestsTable({ requests }: LeaveRequestsTableProps) {
  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm font-medium text-dark dark:text-white">No leave requests found</p>
        <p className="text-xs text-dark-5 dark:text-dark-6 mt-1">Apply for leave using the button above.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-3 dark:border-dark-3">
            <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Type</th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">From</th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">To</th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Days</th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Status</th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Applied On</th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => {
            const displayType = LEAVE_TYPE_DISPLAY[req.leaveType] ?? req.leaveType;
            const displayStatus = mapStatus(req.status);
            return (
              <tr key={req.id} className="border-b border-gray-3 last:border-0 hover:bg-gray-1 dark:border-dark-3 dark:hover:bg-dark-3">
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${typeColors[displayType] ?? "bg-gray-2 text-dark-5"}`}>
                    {displayType}
                  </span>
                </td>
                <td className="px-5 py-3 text-sm text-dark dark:text-white">{formatDate(req.startDate)}</td>
                <td className="px-5 py-3 text-sm text-dark dark:text-white">{formatDate(req.endDate)}</td>
                <td className="px-5 py-3">
                  <span className="text-sm font-semibold text-dark dark:text-white">{req.days}d</span>
                </td>
                <td className="px-5 py-3">
                  <span className={statusBadge[displayStatus]}>{displayStatus}</span>
                </td>
                <td className="px-5 py-3 text-sm text-dark-5 dark:text-dark-6">{formatDate(req.createdAt)}</td>
                <td className="px-5 py-3">
                  {displayStatus === "Pending" ? (
                    <button className="rounded-lg border border-gray-3 px-3 py-1.5 text-xs font-medium text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6">
                      Cancel
                    </button>
                  ) : (
                    <button className="rounded-lg border border-gray-3 px-3 py-1.5 text-xs font-medium text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6">
                      View
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
