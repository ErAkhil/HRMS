interface BreakdownItem {
  label: string;
  amount: string;
  percentage: number;
  color: string;
  barColor: string;
}

const breakdownItems: BreakdownItem[] = [
  { label: "Basic Salary", amount: "₹28,94,700", percentage: 60, color: "text-indigo-600", barColor: "bg-indigo-500" },
  { label: "HRA", amount: "₹9,64,900", percentage: 20, color: "text-violet-dark", barColor: "bg-violet-500" },
  { label: "Allowances", amount: "₹4,82,450", percentage: 10, color: "text-sky-dark", barColor: "bg-sky-500" },
  { label: "Bonus", amount: "₹4,82,450", percentage: 10, color: "text-emerald-dark", barColor: "bg-emerald-500" },
];

const deductionItems = [
  { label: "Income Tax (TDS)", amount: "₹3,86,000", percentage: 63, barColor: "bg-rose-500" },
  { label: "Provident Fund", amount: "₹1,68,000", percentage: 27, barColor: "bg-amber-500" },
  { label: "Professional Tax", amount: "₹58,400", percentage: 10, barColor: "bg-orange-400" },
];

export function PayrollBreakdown() {
  return (
    <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 h-full">
      <h3 className="text-sm font-semibold text-dark dark:text-white mb-4">Salary Breakdown</h3>

      {/* Visual ring */}
      <div className="flex items-center justify-center mb-5">
        <div className="relative flex h-28 w-28 items-center justify-center">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            {(() => {
              const segments = [
                { pct: 60, color: "#6366F1" },
                { pct: 20, color: "#8B5CF6" },
                { pct: 10, color: "#0EA5E9" },
                { pct: 10, color: "#10B981" },
              ];
              const r = 38;
              const circumference = 2 * Math.PI * r;
              let offset = 0;
              return segments.map((seg, i) => {
                const dashLen = (seg.pct / 100) * circumference;
                const el = (
                  <circle
                    key={i}
                    cx={50}
                    cy={50}
                    r={r}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth="14"
                    strokeDasharray={`${dashLen} ${circumference - dashLen}`}
                    strokeDashoffset={(-offset * circumference) / 100}
                  />
                );
                offset += seg.pct;
                return el;
              });
            })()}
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-base font-bold text-dark dark:text-white">₹48L</span>
            <span className="text-[10px] text-dark-5 dark:text-dark-6">Gross</span>
          </div>
        </div>
      </div>

      {/* Earnings */}
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Earnings</p>
      <div className="space-y-2.5 mb-4">
        {breakdownItems.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-dark-5 dark:text-dark-6">{item.label}</span>
              <span className={`text-xs font-semibold ${item.color}`}>{item.amount}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-gray-3 dark:bg-dark-3 overflow-hidden">
              <div className={`h-full rounded-full ${item.barColor}`} style={{ width: `${item.percentage}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Deductions */}
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Deductions</p>
      <div className="space-y-2.5">
        {deductionItems.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-dark-5 dark:text-dark-6">{item.label}</span>
              <span className="text-xs font-semibold text-rose-dark dark:text-rose">{item.amount}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-gray-3 dark:bg-dark-3 overflow-hidden">
              <div className={`h-full rounded-full ${item.barColor}`} style={{ width: `${item.percentage}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
