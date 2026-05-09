import type { LeaveBalance } from "@prisma/client";

type LeaveTypeEnum = LeaveBalance["leaveType"];

const LEAVE_TYPE_DISPLAY: Record<LeaveTypeEnum, string> = {
  ANNUAL: "Annual Leave",
  SICK: "Sick Leave",
  CASUAL: "Casual Leave",
  MATERNITY: "Maternity Leave",
  PATERNITY: "Paternity Leave",
  UNPAID: "Unpaid Leave",
  OTHER: "Other",
};

const LEAVE_TYPE_STYLE: Record<
  LeaveTypeEnum,
  { iconBg: string; iconColor: string; barColor: string }
> = {
  ANNUAL: {
    iconBg: "bg-primary-50 dark:bg-primary-900/20",
    iconColor: "text-primary-600",
    barColor: "bg-primary-600",
  },
  SICK: {
    iconBg: "bg-rose-light dark:bg-rose-dark/20",
    iconColor: "text-rose-dark",
    barColor: "bg-rose-500",
  },
  CASUAL: {
    iconBg: "bg-amber-light dark:bg-amber-dark/20",
    iconColor: "text-amber-dark",
    barColor: "bg-amber-400",
  },
  MATERNITY: {
    iconBg: "bg-pink-50 dark:bg-pink-900/20",
    iconColor: "text-pink-600",
    barColor: "bg-pink-500",
  },
  PATERNITY: {
    iconBg: "bg-sky-50 dark:bg-sky-dark/10",
    iconColor: "text-sky-dark",
    barColor: "bg-sky-500",
  },
  UNPAID: {
    iconBg: "bg-gray-100 dark:bg-dark-3",
    iconColor: "text-dark-5",
    barColor: "bg-gray-400",
  },
  OTHER: {
    iconBg: "bg-violet-100 dark:bg-violet-dark/20",
    iconColor: "text-violet-dark",
    barColor: "bg-violet-500",
  },
};

function LeaveTypeIcon({ type, colorClass }: { type: LeaveTypeEnum; colorClass: string }) {
  if (type === "ANNUAL") {
    return (
      <svg className={`h-5 w-5 ${colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    );
  }
  if (type === "SICK") {
    return (
      <svg className={`h-5 w-5 ${colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    );
  }
  if (type === "CASUAL") {
    return (
      <svg className={`h-5 w-5 ${colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    );
  }
  return (
    <svg className={`h-5 w-5 ${colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

interface LeaveBalanceCardsProps {
  balances: LeaveBalance[];
}

export function LeaveBalanceCards({ balances }: LeaveBalanceCardsProps) {
  if (balances.length === 0) {
    return (
      <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 text-center text-sm text-dark-5 dark:text-dark-6">
        No leave balances found for this year.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {balances.map((b) => {
        const style = LEAVE_TYPE_STYLE[b.leaveType] ?? LEAVE_TYPE_STYLE.OTHER;
        const displayName = LEAVE_TYPE_DISPLAY[b.leaveType] ?? "Leave";
        const remaining = b.total - b.used;
        const usedPct = b.total > 0 ? (b.used / b.total) * 100 : 0;
        return (
          <div key={b.id} className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
            <div className="flex items-start justify-between mb-3">
              <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${style.iconBg}`}>
                <LeaveTypeIcon type={b.leaveType} colorClass={style.iconColor} />
              </span>
              <span className="text-xs text-dark-5 dark:text-dark-6">{b.used}/{b.total} used</span>
            </div>
            <p className="text-xs text-dark-5 dark:text-dark-6">{displayName}</p>
            <p className="mt-0.5 text-2xl font-bold text-dark dark:text-white">
              {remaining}
              <span className="text-sm font-normal text-dark-5 dark:text-dark-6 ml-1">days left</span>
            </p>
            <div className="mt-3 h-1.5 rounded-full bg-gray-3 dark:bg-dark-3 overflow-hidden">
              <div className={`h-full rounded-full ${style.barColor}`} style={{ width: `${usedPct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
