const LEAVE_STATS = [
  { label: "Annual Leave", used: 12, total: 24, color: "text-indigo-600" },
  { label: "Sick Leave", used: 4, total: 12, color: "text-amber" },
  { label: "Casual Leave", used: 2, total: 6, color: "text-violet-500" },
  { label: "Comp-off", used: null, total: 2, color: "text-emerald" },
];

const LEAVE_HISTORY = [
  { date: "May 1–2, 2026", type: "Annual Leave", duration: "2 days" },
  { date: "Apr 15, 2026", type: "Sick Leave", duration: "1 day" },
  { date: "Mar 20–21, 2026", type: "Casual Leave", duration: "2 days" },
  { date: "Mar 10, 2026", type: "Work From Home", duration: "1 day" },
  { date: "Feb 14, 2026", type: "Annual Leave", duration: "3 days" },
  { date: "Jan 5, 2026", type: "Sick Leave", duration: "2 days" },
];

export function LeaveTab() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {LEAVE_STATS.map(({ label, used, total, color }) => (
          <div key={label} className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 text-center">
            <p className={`text-3xl font-bold ${color}`}>{used !== null ? total - used : total}</p>
            <p className="mt-1 text-xs font-medium text-dark dark:text-white">{label}</p>
            <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">{used !== null ? `${used}/${total} days used` : "days available"}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <h2 className="mb-4 text-base font-semibold text-dark dark:text-white">Leave Request History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-3 dark:border-dark-3">
                {["Date", "Type", "Duration", "Status"].map((h) => (
                  <th key={h} className="pb-3 text-left text-xs font-medium uppercase tracking-wide text-dark-5 dark:text-dark-6">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-3 dark:divide-dark-3">
              {LEAVE_HISTORY.map(({ date, type, duration }) => (
                <tr key={date + type}>
                  <td className="py-3 font-medium text-dark dark:text-white">{date}</td>
                  <td className="py-3 text-dark-5 dark:text-dark-6">{type}</td>
                  <td className="py-3 text-dark-5 dark:text-dark-6">{duration}</td>
                  <td className="py-3">
                    <span className="inline-flex items-center rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-semibold text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald">Approved</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-start">
        <button className="rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-700">Apply Leave</button>
      </div>
    </div>
  );
}
