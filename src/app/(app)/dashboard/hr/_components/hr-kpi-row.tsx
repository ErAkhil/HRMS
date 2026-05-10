type HrKpiRowProps = {
  headcount: number;
  openJobsCount: number;
};

export function HrKpiRow({ headcount, openJobsCount }: HrKpiRowProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
      <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Total Headcount</p>
            <p className="mt-1.5 text-3xl font-bold text-dark dark:text-white">{headcount}</p>
            <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">Active employees</p>
          </div>
          <span className="rounded-lg bg-primary-50 p-2 text-primary-600 dark:bg-primary-900/20 dark:text-primary-300 text-lg">👥</span>
        </div>
      </div>
      <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Open Positions</p>
            <p className="mt-1.5 text-3xl font-bold text-dark dark:text-white">{openJobsCount}</p>
            <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">Active job postings</p>
          </div>
          <span className="rounded-lg bg-amber-light p-2 text-amber-dark dark:bg-amber-dark/20 dark:text-amber text-lg">📋</span>
        </div>
      </div>
      <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Monthly Attrition</p>
            <p className="mt-1.5 text-3xl font-bold text-dark dark:text-white">—</p>
            <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">No exits this month</p>
          </div>
          <span className="rounded-lg bg-rose-light p-2 text-rose-dark dark:bg-rose-dark/20 dark:text-rose text-lg">📉</span>
        </div>
      </div>
      <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Time to Hire</p>
            <p className="mt-1.5 text-3xl font-bold text-dark dark:text-white">—</p>
            <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">Track via recruitment</p>
          </div>
          <span className="rounded-lg bg-emerald-light p-2 text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald text-lg">⏱️</span>
        </div>
      </div>
    </div>
  );
}
