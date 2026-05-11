import Link from "next/link";

type DeptCount = {
  dept: string;
  count: number;
};

type HrHeadcountAttritionProps = {
  headcount: number;
  deptHeadcount: DeptCount[];
};

export function HrHeadcountAttrition({ headcount, deptHeadcount }: HrHeadcountAttritionProps) {
  const maxCount = Math.max(...deptHeadcount.map((d) => d.count), 1);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6">

      {/* Headcount by Department */}
      <div className="md:col-span-7 rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-dark dark:text-white">Headcount by Department</h2>
          <Link href="/reports" className="text-xs font-medium text-primary-600 hover:underline dark:text-primary-400">Export →</Link>
        </div>

        {deptHeadcount.length === 0 ? (
          <p className="text-sm text-dark-5 dark:text-dark-6 py-4">No departments found.</p>
        ) : (
          <>
            <div className="flex items-end gap-2 h-32 mb-3">
              {deptHeadcount.map((d, i) => {
                const heightPct = Math.max(8, Math.round((d.count / maxCount) * 100));
                const isLast = i === deptHeadcount.length - 1;
                return (
                  <div key={d.dept} className="flex flex-1 flex-col items-center gap-1">
                    <span className="text-[10px] font-semibold text-dark-5 dark:text-dark-6">{d.count}</span>
                    <div
                      className={`w-full rounded-t-md ${isLast ? "bg-primary-600" : "bg-primary-200 dark:bg-primary-900/40"}`}
                      style={{ height: `${heightPct}%` }}
                    />
                    <span className="text-[10px] text-dark-5 dark:text-dark-6 whitespace-nowrap truncate w-full text-center" title={d.dept}>
                      {d.dept.length > 8 ? d.dept.slice(0, 7) + "…" : d.dept}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-4 py-3 border-t border-b border-gray-3 dark:border-dark-3 mb-4">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">{headcount}</span>
                <span className="text-xs text-dark-5 dark:text-dark-6">Total Active</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-dark dark:text-white">{deptHeadcount.length}</span>
                <span className="text-xs text-dark-5 dark:text-dark-6">Departments</span>
              </div>
            </div>

            <h3 className="text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6 mb-2">Department Breakdown</h3>
            <div className="divide-y divide-gray-3 dark:divide-dark-3">
              {deptHeadcount.map((row) => (
                <div key={row.dept} className="flex items-center justify-between py-1.5">
                  <span className="text-xs font-medium text-dark dark:text-white">{row.dept}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-dark dark:text-white">{row.count}</span>
                    <span className="text-xs text-dark-5 dark:text-dark-6">
                      {headcount > 0 ? `${Math.round((row.count / headcount) * 100)}%` : "—"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Attrition Summary */}
      <div className="md:col-span-5 flex flex-col gap-4">

        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-dark dark:text-white">Attrition Summary</h2>
            <Link href="/employees" className="text-xs font-medium text-primary-600 hover:underline dark:text-primary-400">
              View All →
            </Link>
          </div>
          <p className="text-sm text-dark-5 dark:text-dark-6 mb-4">
            Attrition tracking requires exit interview data. Use the employee directory to manage offboarding.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Total Active", value: String(headcount) },
              { label: "Departments", value: String(deptHeadcount.length) },
              { label: "Attrition Rate", value: "—" },
              { label: "Exits YTD", value: "—" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg bg-gray-1 dark:bg-dark-3/40 px-3 py-2">
                <p className="text-[10px] text-dark-5 dark:text-dark-6">{stat.label}</p>
                <p className="text-xs font-bold text-dark dark:text-white">{stat.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-gray-3 dark:border-dark-3 pt-3">
            <Link href="/employees" className="block w-full rounded-lg bg-primary-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-primary-700">
              Manage Employees →
            </Link>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-dark dark:text-white">Quick Links</h2>
          </div>
          <div className="space-y-2">
            {[
              { label: "Recruitment Pipeline", href: "/recruitment" },
              { label: "Leave Approvals", href: "/leave/approvals" },
              { label: "Performance Reviews", href: "/performance/reviews" },
              { label: "Payroll Management", href: "/payroll" },
              { label: "HR Reports", href: "/reports" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-dark hover:bg-gray-1 dark:text-white dark:hover:bg-dark-3/40 transition-colors"
              >
                {link.label}
                <span className="text-dark-5 dark:text-dark-6">→</span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
