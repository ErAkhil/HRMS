interface PayrollStats {
  totalGross: number;
  totalNet: number;
  totalDeductions: number;
  employeeCount: number;
  month: string;
}

interface KpiCardProps {
  label: string;
  value: string;
  sub: string;
  iconBg: string;
  icon: React.ReactNode;
}

function KpiCard({ label, value, sub, iconBg, icon }: KpiCardProps) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-dark-5 dark:text-dark-6">{label}</p>
          <p className="mt-1 text-2xl font-bold text-dark dark:text-white">{value}</p>
          <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">{sub}</p>
        </div>
        <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBg}`}>
          {icon}
        </span>
      </div>
    </div>
  );
}

function fmt(n: number) {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

export function PayrollKpiCards({ stats }: { stats?: PayrollStats }) {
  const gross = stats ? fmt(stats.totalGross) : "₹—";
  const avg = stats && stats.employeeCount > 0 ? fmt(stats.totalGross / stats.employeeCount) : "₹—";
  const deductions = stats ? fmt(stats.totalDeductions) : "₹—";
  const net = stats ? fmt(stats.totalNet) : "₹—";
  const period = stats?.month ?? "Current";

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <KpiCard
        label="Total Payout"
        value={gross}
        sub={period}
        iconBg="bg-indigo-50 dark:bg-indigo-900/20"
        icon={
          <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
      <KpiCard
        label="Average Salary"
        value={avg}
        sub={stats ? `${stats.employeeCount} employees` : "per employee"}
        iconBg="bg-emerald-light dark:bg-emerald-dark/20"
        icon={
          <svg className="h-5 w-5 text-emerald-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        }
      />
      <KpiCard
        label="Deductions"
        value={deductions}
        sub="tax + PF + other"
        iconBg="bg-amber-light dark:bg-amber-dark/20"
        icon={
          <svg className="h-5 w-5 text-amber-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
      <KpiCard
        label="Net Pay"
        value={net}
        sub="disbursed this month"
        iconBg="bg-sky-50 dark:bg-sky-dark/10"
        icon={
          <svg className="h-5 w-5 text-sky-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
    </div>
  );
}
