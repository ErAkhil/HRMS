type LeaveBalance = {
  id: string;
  leaveType: string;
  total: number;
  used: number;
  pending: number;
  year: number;
};

const LEAVE_COLORS: Record<string, string> = {
  ANNUAL: "text-primary-600",
  SICK: "text-amber",
  CASUAL: "text-violet-500",
  MATERNITY: "text-emerald",
  PATERNITY: "text-sky-dark",
  UNPAID: "text-dark-4",
  OTHER: "text-rose-600",
};

interface Props {
  leaveBalances: LeaveBalance[];
}

export function LeaveTab({ leaveBalances }: Readonly<Props>) {
  return (
    <div className="space-y-5">
      {leaveBalances.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {leaveBalances.map((lb) => (
            <div key={lb.id} className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 text-center">
              <p className={`text-3xl font-bold ${LEAVE_COLORS[lb.leaveType] ?? "text-primary-600"}`}>
                {lb.total - lb.used - lb.pending}
              </p>
              <p className="mt-1 text-xs font-medium text-dark dark:text-white capitalize">
                {lb.leaveType.toLowerCase()} Leave
              </p>
              <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">
                {lb.used}/{lb.total} used · {lb.pending} pending
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl bg-white p-8 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 text-center">
          <p className="text-sm text-dark-5 dark:text-dark-6">No leave balances set up for this year.</p>
        </div>
      )}

      <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <h2 className="mb-4 text-base font-semibold text-dark dark:text-white">Leave Summary — {new Date().getFullYear()}</h2>
        {leaveBalances.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-3 dark:border-dark-3">
                  {["Type", "Total", "Used", "Pending", "Available"].map((h) => (
                    <th key={h} className="pb-3 text-left text-xs font-medium uppercase tracking-wide text-dark-5 dark:text-dark-6">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-3 dark:divide-dark-3">
                {leaveBalances.map((lb) => (
                  <tr key={lb.id}>
                    <td className="py-3 font-medium text-dark dark:text-white capitalize">{lb.leaveType.toLowerCase()} Leave</td>
                    <td className="py-3 text-dark-5 dark:text-dark-6">{lb.total}</td>
                    <td className="py-3 text-dark-5 dark:text-dark-6">{lb.used}</td>
                    <td className="py-3 text-amber">{lb.pending}</td>
                    <td className="py-3 font-semibold text-emerald-dark dark:text-emerald">{lb.total - lb.used - lb.pending}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-dark-5 dark:text-dark-6">No leave data available.</p>
        )}
      </div>
    </div>
  );
}
