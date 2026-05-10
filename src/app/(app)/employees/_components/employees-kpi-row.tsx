interface Props {
  totalEmployees: number;
  activeEmployees: number;
  deptCount: number;
}

export function EmployeesKpiRow({ totalEmployees, activeEmployees, deptCount }: Readonly<Props>) {
  const activePct = totalEmployees > 0 ? Math.round((activeEmployees / totalEmployees) * 100) : 0;

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
      <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-dark-5 dark:text-dark-6">Total Employees</p>
          <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300">All</span>
        </div>
        <p className="mt-3 text-3xl font-bold text-dark dark:text-white">{totalEmployees}</p>
        <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">
          <span className="font-semibold text-indigo-600">{deptCount}</span> departments
        </p>
      </div>

      <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-dark-5 dark:text-dark-6">Active</p>
          <span className="rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald">Active</span>
        </div>
        <p className="mt-3 text-3xl font-bold text-dark dark:text-white">{activeEmployees}</p>
        <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">
          <span className="font-semibold text-emerald-600">{activePct}%</span> of total
        </p>
      </div>

      <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-dark-5 dark:text-dark-6">On Leave Today</p>
          <span className="rounded-full bg-amber-light px-2.5 py-0.5 text-xs font-medium text-amber-dark dark:bg-amber-dark/20 dark:text-amber">Leave</span>
        </div>
        <p className="mt-3 text-3xl font-bold text-dark dark:text-white">—</p>
        <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">See leave calendar</p>
      </div>

      <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-dark-5 dark:text-dark-6">Open Positions</p>
          <span className="rounded-full bg-violet-light px-2.5 py-0.5 text-xs font-medium text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300">Hiring</span>
        </div>
        <p className="mt-3 text-3xl font-bold text-dark dark:text-white">—</p>
        <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">See recruitment</p>
      </div>
    </div>
  );
}
