type RunStatus = "Completed" | "Processing" | "Scheduled";

interface PayrollRun {
  id: number;
  period: string;
  runDate: string;
  employees: number;
  totalPayout: string;
  status: RunStatus;
  runBy: string;
}

const runs: PayrollRun[] = [
  { id: 1, period: "April 2026", runDate: "Apr 30, 2026", employees: 248, totalPayout: "₹47,82,300", status: "Completed", runBy: "Elena Torres" },
  { id: 2, period: "March 2026", runDate: "Mar 31, 2026", employees: 245, totalPayout: "₹46,90,500", status: "Completed", runBy: "Elena Torres" },
  { id: 3, period: "February 2026", runDate: "Feb 28, 2026", employees: 241, totalPayout: "₹45,20,000", status: "Completed", runBy: "Arjun Mehta" },
  { id: 4, period: "January 2026", runDate: "Jan 31, 2026", employees: 238, totalPayout: "₹44,65,800", status: "Completed", runBy: "Arjun Mehta" },
  { id: 5, period: "May 2026", runDate: "In Progress", employees: 248, totalPayout: "₹48,24,500", status: "Processing", runBy: "Elena Torres" },
];

const statusBadge: Record<RunStatus, string> = {
  Completed: "rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  Processing: "rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-dark dark:bg-sky-dark/10 dark:text-sky",
  Scheduled: "rounded-full bg-amber-light px-2.5 py-0.5 text-xs font-medium text-amber-dark",
};

export function RecentPayrollRuns() {
  return (
    <div className="rounded-xl bg-white shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-gray-3 dark:border-dark-3">
        <h3 className="text-sm font-semibold text-dark dark:text-white">Recent Payroll Runs</h3>
        <button className="rounded-lg border border-gray-3 px-4 py-2 text-sm font-medium text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6">
          View All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-1 dark:bg-dark-3">
              <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Period</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Run Date</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-dark-5 dark:text-dark-6">Employees</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-dark-5 dark:text-dark-6">Total Payout</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Run By</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Status</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((run) => (
              <tr key={run.id} className="border-b border-gray-3 last:border-0 hover:bg-gray-1 dark:border-dark-3 dark:hover:bg-dark-3">
                <td className="px-5 py-3 text-sm font-medium text-dark dark:text-white">{run.period}</td>
                <td className="px-5 py-3 text-sm text-dark-5 dark:text-dark-6">{run.runDate}</td>
                <td className="px-5 py-3 text-right text-sm text-dark dark:text-white">{run.employees}</td>
                <td className="px-5 py-3 text-right text-sm font-semibold text-dark dark:text-white">{run.totalPayout}</td>
                <td className="px-5 py-3 text-sm text-dark-5 dark:text-dark-6">{run.runBy}</td>
                <td className="px-5 py-3">
                  <span className={statusBadge[run.status]}>{run.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
