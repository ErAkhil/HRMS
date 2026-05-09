import type { PayrollRun } from "@prisma/client";

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const statusBadge: Record<string, string> = {
  PROCESSED: "rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  PROCESSING: "rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-dark dark:bg-sky-dark/10 dark:text-sky",
  DRAFT: "rounded-full bg-amber-light px-2.5 py-0.5 text-xs font-medium text-amber-dark",
  CANCELLED: "rounded-full bg-rose-light px-2.5 py-0.5 text-xs font-medium text-rose-dark dark:bg-rose-dark/20 dark:text-rose",
};

type RunWithCount = PayrollRun & { _count: { payslips: number } };

function fmt(n: { toString(): string } | number | string) {
  return "₹" + Math.round(Number(n.toString())).toLocaleString("en-IN");
}

export function RecentPayrollRuns({ runs = [] }: { runs?: RunWithCount[] }) {
  const display = runs.length > 0 ? runs : [];

  return (
    <div className="rounded-xl bg-white shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-gray-3 dark:border-dark-3">
        <h3 className="text-sm font-semibold text-dark dark:text-white">Recent Payroll Runs</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-1 dark:bg-dark-3">
              <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Period</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Processed</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-dark-5 dark:text-dark-6">Employees</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-dark-5 dark:text-dark-6">Total Payout</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Status</th>
            </tr>
          </thead>
          <tbody>
            {display.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-sm text-dark-5 dark:text-dark-6">
                  No payroll runs yet
                </td>
              </tr>
            )}
            {display.map((run) => (
              <tr key={run.id} className="border-b border-gray-3 last:border-0 hover:bg-gray-1 dark:border-dark-3 dark:hover:bg-dark-3">
                <td className="px-5 py-3 text-sm font-medium text-dark dark:text-white">
                  {MONTH_NAMES[run.month - 1]} {run.year}
                </td>
                <td className="px-5 py-3 text-sm text-dark-5 dark:text-dark-6">
                  {run.processedAt ? new Date(run.processedAt).toLocaleDateString("en-IN") : "—"}
                </td>
                <td className="px-5 py-3 text-right text-sm text-dark dark:text-white">
                  {run._count.payslips}
                </td>
                <td className="px-5 py-3 text-right text-sm font-semibold text-dark dark:text-white">
                  {fmt(run.totalNet)}
                </td>
                <td className="px-5 py-3">
                  <span className={statusBadge[run.status] ?? statusBadge.DRAFT}>
                    {run.status.charAt(0) + run.status.slice(1).toLowerCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
