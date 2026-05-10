export function HrKpiRow() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
      <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Total Headcount</p>
            <p className="mt-1.5 text-3xl font-bold text-dark dark:text-white">248</p>
            <p className="mt-1 text-xs text-indigo-600 dark:text-indigo-400 font-medium">↑ 14 this month</p>
          </div>
          <span className="rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300 text-lg">👥</span>
        </div>
      </div>
      <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Open Positions</p>
            <p className="mt-1.5 text-3xl font-bold text-dark dark:text-white">17</p>
            <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">Across 6 departments</p>
          </div>
          <span className="rounded-lg bg-amber-light p-2 text-amber-dark dark:bg-amber-dark/20 dark:text-amber text-lg">📋</span>
        </div>
      </div>
      <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Monthly Attrition</p>
            <p className="mt-1.5 text-3xl font-bold text-dark dark:text-white">2</p>
            <p className="mt-1 text-xs text-rose-dark dark:text-rose font-medium">0.8% rate</p>
          </div>
          <span className="rounded-lg bg-rose-light p-2 text-rose-dark dark:bg-rose-dark/20 dark:text-rose text-lg">📉</span>
        </div>
      </div>
      <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Time to Hire</p>
            <p className="mt-1.5 text-3xl font-bold text-dark dark:text-white">18d</p>
            <p className="mt-1 text-xs text-emerald-dark dark:text-emerald font-medium">↓ 3 days vs last month</p>
          </div>
          <span className="rounded-lg bg-emerald-light p-2 text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald text-lg">⏱️</span>
        </div>
      </div>
    </div>
  );
}
