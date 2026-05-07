interface LeaveBalance {
  type: string;
  used: number;
  total: number;
  iconBg: string;
  iconColor: string;
  barColor: string;
  icon: React.ReactNode;
}

interface LeaveBalanceCardsProps {
  balances: LeaveBalance[];
}

export function LeaveBalanceCards({ balances }: LeaveBalanceCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {balances.map((b) => {
        const remaining = b.total - b.used;
        const usedPct = (b.used / b.total) * 100;
        return (
          <div key={b.type} className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
            <div className="flex items-start justify-between mb-3">
              <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${b.iconBg}`}>
                {b.icon}
              </span>
              <span className="text-xs text-dark-5 dark:text-dark-6">{b.used}/{b.total} used</span>
            </div>
            <p className="text-xs text-dark-5 dark:text-dark-6">{b.type}</p>
            <p className="mt-0.5 text-2xl font-bold text-dark dark:text-white">
              {remaining}
              <span className="text-sm font-normal text-dark-5 dark:text-dark-6 ml-1">days left</span>
            </p>
            <div className="mt-3 h-1.5 rounded-full bg-gray-3 dark:bg-dark-3 overflow-hidden">
              <div className={`h-full rounded-full ${b.barColor}`} style={{ width: `${usedPct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
