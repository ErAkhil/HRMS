interface Stats {
  totalGross: number;
  totalNet: number;
  totalDeductions: number;
  employeeCount: number;
  month: string;
}

function fmt(n: number) {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

export function PayrollBreakdown({ stats }: { stats?: Stats }) {
  if (!stats) {
    return (
      <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 h-full flex items-center justify-center">
        <p className="text-sm text-dark-5 dark:text-dark-6 text-center">No payroll data yet.<br />Run payroll to see breakdown.</p>
      </div>
    );
  }

  const gross = stats.totalGross;
  const deductions = stats.totalDeductions;
  const net = stats.totalNet;

  // Basic = totalGross / 1.5 (since gross = basic + 0.4*basic + 0.1*basic = 1.5*basic)
  const basic = gross / 1.5;
  const hra = basic * 0.4;
  const allowances = basic * 0.1;
  const tax = deductions * (10 / 22);
  const pf = deductions * (12 / 22);

  const earnings = [
    { label: "Basic Salary", amount: basic, pct: (basic / gross) * 100, color: "text-primary-600", barColor: "bg-primary-500" },
    { label: "HRA", amount: hra, pct: (hra / gross) * 100, color: "text-violet-dark", barColor: "bg-violet-500" },
    { label: "Allowances", amount: allowances, pct: (allowances / gross) * 100, color: "text-sky-dark", barColor: "bg-sky-500" },
  ];

  const deductionItems = [
    { label: "Income Tax (TDS)", amount: tax, pct: (tax / deductions) * 100, barColor: "bg-rose-500" },
    { label: "Provident Fund", amount: pf, pct: (pf / deductions) * 100, barColor: "bg-amber-500" },
  ];

  const segments = [
    { pct: Math.round((basic / gross) * 100), color: "#6366F1" },
    { pct: Math.round((hra / gross) * 100), color: "#8B5CF6" },
    { pct: Math.round((allowances / gross) * 100), color: "#0EA5E9" },
  ];
  const r = 38;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 h-full">
      <h3 className="text-sm font-semibold text-dark dark:text-white mb-4">Salary Breakdown</h3>

      <div className="flex items-center justify-center mb-5">
        <div className="relative flex h-28 w-28 items-center justify-center">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            {segments.map((seg, i) => {
              const dashLen = (seg.pct / 100) * circumference;
              const el = (
                <circle
                  key={i}
                  cx={50} cy={50} r={r}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="14"
                  strokeDasharray={`${dashLen} ${circumference - dashLen}`}
                  strokeDashoffset={(-offset * circumference) / 100}
                />
              );
              offset += seg.pct;
              return el;
            })}
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-sm font-bold text-dark dark:text-white">{fmt(gross)}</span>
            <span className="text-[10px] text-dark-5 dark:text-dark-6">Gross</span>
          </div>
        </div>
      </div>

      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Earnings</p>
      <div className="space-y-2.5 mb-4">
        {earnings.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-dark-5 dark:text-dark-6">{item.label}</span>
              <span className={`text-xs font-semibold ${item.color}`}>{fmt(item.amount)}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-gray-3 dark:bg-dark-3 overflow-hidden">
              <div className={`h-full rounded-full ${item.barColor}`} style={{ width: `${item.pct}%` }} />
            </div>
          </div>
        ))}
      </div>

      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Deductions</p>
      <div className="space-y-2.5 mb-4">
        {deductionItems.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-dark-5 dark:text-dark-6">{item.label}</span>
              <span className="text-xs font-semibold text-rose-dark dark:text-rose">{fmt(item.amount)}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-gray-3 dark:bg-dark-3 overflow-hidden">
              <div className={`h-full rounded-full ${item.barColor}`} style={{ width: `${item.pct}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-emerald-light dark:bg-emerald-dark/20 p-3 text-center">
        <p className="text-xs text-dark-5 dark:text-dark-6">Net Pay</p>
        <p className="text-lg font-bold text-emerald-dark dark:text-emerald">{fmt(net)}</p>
      </div>
    </div>
  );
}
