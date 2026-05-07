export const metadata = { title: "Audit Logs" };

type EventType = "Login" | "Data Change" | "Permission" | "System";

const AUDIT_LOGS: Array<{
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  ip: string;
  status: "Success" | "Failed" | "Warning";
  type: EventType;
}> = [
  { timestamp: "May 7, 2026 · 09:14:32", user: "Sarah Johnson", action: "User Login", resource: "Auth / Session", ip: "103.21.58.14", status: "Success", type: "Login" },
  { timestamp: "May 7, 2026 · 09:10:15", user: "Alex Rivera", action: "Role Updated", resource: "User: Emma Davis", ip: "49.36.112.88", status: "Success", type: "Permission" },
  { timestamp: "May 7, 2026 · 08:55:42", user: "System", action: "Scheduled Payroll Run", resource: "Payroll Module", ip: "10.0.0.1", status: "Success", type: "System" },
  { timestamp: "May 7, 2026 · 08:44:18", user: "Marcus Webb", action: "Employee Record Modified", resource: "Employee: Omar Hassan", ip: "122.170.45.22", status: "Success", type: "Data Change" },
  { timestamp: "May 7, 2026 · 08:30:07", user: "Unknown", action: "Failed Login Attempt", resource: "Auth / Session", ip: "185.220.101.43", status: "Failed", type: "Login" },
  { timestamp: "May 7, 2026 · 08:22:55", user: "Priya Patel", action: "Policy Document Updated", resource: "Policy: Remote Work", ip: "103.21.58.14", status: "Success", type: "Data Change" },
  { timestamp: "May 6, 2026 · 17:45:12", user: "Amanda Ross", action: "Bulk Employee Import", resource: "Employees (14 records)", ip: "103.21.58.14", status: "Success", type: "Data Change" },
  { timestamp: "May 6, 2026 · 16:30:00", user: "System", action: "Performance Review Cycle Initiated", resource: "Performance Module", ip: "10.0.0.1", status: "Success", type: "System" },
  { timestamp: "May 6, 2026 · 15:18:43", user: "James Liu", action: "Payroll Report Exported", resource: "Reports / Payroll", ip: "49.36.112.88", status: "Success", type: "Data Change" },
  { timestamp: "May 6, 2026 · 14:55:21", user: "Alex Rivera", action: "MFA Policy Modified", resource: "Security Settings", ip: "49.36.112.88", status: "Success", type: "Permission" },
  { timestamp: "May 6, 2026 · 13:02:09", user: "Rachel Torres", action: "User Login", resource: "Auth / Session", ip: "122.170.45.22", status: "Success", type: "Login" },
  { timestamp: "May 6, 2026 · 11:34:58", user: "David Kim", action: "Permission Group Removed", resource: "User: David Kim", ip: "103.21.58.14", status: "Warning", type: "Permission" },
  { timestamp: "May 6, 2026 · 10:15:33", user: "System", action: "Database Backup Completed", resource: "System / DB", ip: "10.0.0.1", status: "Success", type: "System" },
  { timestamp: "May 6, 2026 · 09:45:11", user: "Unknown", action: "Failed Login Attempt (x3)", resource: "Auth / Session", ip: "91.108.4.22", status: "Failed", type: "Login" },
  { timestamp: "May 5, 2026 · 18:00:00", user: "System", action: "Birthday Notification Sent", resource: "Workflow: Notifications", ip: "10.0.0.1", status: "Success", type: "System" },
];

const EVENT_TYPES = ["All", "Login", "Data Change", "Permission", "System"] as const;

const statusColors: Record<string, string> = {
  Success: "rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  Failed: "rounded-full bg-rose-light px-2.5 py-0.5 text-xs font-medium text-rose-dark",
  Warning: "rounded-full bg-amber-light px-2.5 py-0.5 text-xs font-medium text-amber-dark",
};

const typeColors: Record<EventType, string> = {
  Login: "rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300",
  "Data Change": "rounded-full bg-violet-light px-2.5 py-0.5 text-xs font-medium text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300",
  Permission: "rounded-full bg-amber-light px-2.5 py-0.5 text-xs font-medium text-amber-dark",
  System: "rounded-full bg-gray-2 px-2.5 py-0.5 text-xs font-medium text-dark-5 dark:bg-dark-3 dark:text-dark-6",
};

export default function AuditPage() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-dark dark:text-white">Audit Logs</h1>
          <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">
            Complete activity trail for compliance and security monitoring
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <input
              type="date"
              defaultValue="2026-05-01"
              className="h-9 rounded-lg border border-gray-3 bg-gray-2 px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
            />
            <span className="text-xs text-dark-5 dark:text-dark-6">to</span>
            <input
              type="date"
              defaultValue="2026-05-07"
              className="h-9 rounded-lg border border-gray-3 bg-gray-2 px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
            />
          </div>
          <button className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 flex items-center gap-1.5">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
        </div>
      </div>

      {/* Event Type Filter */}
      <div className="flex flex-wrap gap-2">
        {EVENT_TYPES.map((type) => (
          <button
            key={type}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              type === "All"
                ? "bg-primary-600 text-white"
                : "border border-gray-3 text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6 dark:hover:bg-dark-3"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Audit Table */}
      <div className="rounded-xl bg-white shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-1 dark:bg-dark-3">
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Timestamp</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">User</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Action</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Resource</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">IP Address</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Status</th>
              </tr>
            </thead>
            <tbody>
              {AUDIT_LOGS.map((log, idx) => (
                <tr key={idx} className="border-b border-gray-3 dark:border-dark-3 hover:bg-gray-1 dark:hover:bg-dark-3">
                  <td className="px-5 py-3.5 font-mono text-xs text-dark-5 dark:text-dark-6 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="px-5 py-3.5 font-medium text-dark dark:text-white whitespace-nowrap">{log.user}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className={typeColors[log.type]}>{log.type}</span>
                      <span className="text-dark dark:text-white">{log.action}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-dark-5 dark:text-dark-6">{log.resource}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-dark-5 dark:text-dark-6">{log.ip}</td>
                  <td className="px-5 py-3.5">
                    <span className={statusColors[log.status]}>{log.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
