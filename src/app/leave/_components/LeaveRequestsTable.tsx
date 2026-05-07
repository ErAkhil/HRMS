type LeaveRequestStatus = "Approved" | "Pending" | "Rejected";

interface LeaveRequest {
  id: number;
  type: string;
  from: string;
  to: string;
  days: number;
  status: LeaveRequestStatus;
  appliedOn: string;
}

const requests: LeaveRequest[] = [
  { id: 1, type: "Annual Leave", from: "May 18", to: "May 22", days: 5, status: "Approved", appliedOn: "May 1" },
  { id: 2, type: "Sick Leave", from: "Apr 10", to: "Apr 11", days: 2, status: "Approved", appliedOn: "Apr 9" },
  { id: 3, type: "Annual Leave", from: "Jun 5", to: "Jun 7", days: 3, status: "Pending", appliedOn: "May 6" },
  { id: 4, type: "Casual Leave", from: "Mar 15", to: "Mar 15", days: 1, status: "Approved", appliedOn: "Mar 14" },
  { id: 5, type: "Sick Leave", from: "Mar 3", to: "Mar 4", days: 2, status: "Approved", appliedOn: "Mar 2" },
  { id: 6, type: "Annual Leave", from: "Jul 15", to: "Jul 25", days: 11, status: "Pending", appliedOn: "May 5" },
  { id: 7, type: "Comp Off", from: "Feb 20", to: "Feb 20", days: 1, status: "Approved", appliedOn: "Feb 19" },
  { id: 8, type: "Casual Leave", from: "Jan 10", to: "Jan 10", days: 1, status: "Rejected", appliedOn: "Jan 8" },
];

const statusBadge: Record<LeaveRequestStatus, string> = {
  Approved: "rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  Pending: "rounded-full bg-amber-light px-2.5 py-0.5 text-xs font-medium text-amber-dark dark:bg-amber-dark/20 dark:text-amber",
  Rejected: "rounded-full bg-rose-light px-2.5 py-0.5 text-xs font-medium text-rose-dark dark:bg-rose-dark/20 dark:text-rose",
};

const typeColors: Record<string, string> = {
  "Annual Leave": "bg-primary-50 text-primary-600 dark:bg-primary-900/20",
  "Sick Leave": "bg-rose-light text-rose-dark dark:bg-rose-dark/20 dark:text-rose",
  "Casual Leave": "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber",
  "Comp Off": "bg-violet-100 text-violet-dark dark:bg-violet-dark/20 dark:text-violet-400",
};

export function LeaveRequestsTable() {
  return (
    <div className="rounded-xl bg-white shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 overflow-hidden">
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
            {requests.map((req) => (
              <tr key={req.id} className="border-b border-gray-3 last:border-0 hover:bg-gray-1 dark:border-dark-3 dark:hover:bg-dark-3">
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${typeColors[req.type] ?? "bg-gray-2 text-dark-5"}`}>
                    {req.type}
                  </span>
                </td>
                <td className="px-5 py-3 text-sm text-dark dark:text-white">{req.from}</td>
                <td className="px-5 py-3 text-sm text-dark dark:text-white">{req.to}</td>
                <td className="px-5 py-3">
                  <span className="text-sm font-semibold text-dark dark:text-white">{req.days}d</span>
                </td>
                <td className="px-5 py-3">
                  <span className={statusBadge[req.status]}>{req.status}</span>
                </td>
                <td className="px-5 py-3 text-sm text-dark-5 dark:text-dark-6">{req.appliedOn}</td>
                <td className="px-5 py-3">
                  {req.status === "Pending" ? (
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
