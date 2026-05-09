import Link from "next/link";
import type { LeaveBalance } from "@prisma/client";

const LEAVE_COLORS: Record<string, string> = {
  ANNUAL: "bg-indigo-500",
  SICK: "bg-amber",
  CASUAL: "bg-emerald",
  MATERNITY: "bg-rose-400",
  PATERNITY: "bg-violet-DEFAULT",
  OTHER: "bg-sky-500",
  UNPAID: "bg-gray-400",
};

const LEAVE_LABELS: Record<string, string> = {
  ANNUAL: "Annual Leave",
  SICK: "Sick Leave",
  CASUAL: "Casual Leave",
  MATERNITY: "Maternity Leave",
  PATERNITY: "Paternity Leave",
  UNPAID: "Unpaid Leave",
  OTHER: "Other Leave",
};

interface Props {
  balances: LeaveBalance[];
}

export function LeaveBalanceCard({ balances }: Props) {
  const totalRemaining = balances.reduce(
    (sum, b) => sum + (b.total - b.used - b.pending),
    0,
  );

  const displayBalances = balances.length > 0
    ? balances.slice(0, 4)
    : [
        { leaveType: "ANNUAL", used: 0, total: 30, pending: 0 },
        { leaveType: "SICK", used: 0, total: 10, pending: 0 },
        { leaveType: "CASUAL", used: 0, total: 10, pending: 0 },
      ];

  return (
    <div className="flex h-full flex-col rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
            <svg className="size-4 text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24" fill="none">
              <path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-dark dark:text-white">Leave Balance</h3>
        </div>
        <span className="text-xs text-dark-5 dark:text-dark-6">FY {new Date().getFullYear()}–{String(new Date().getFullYear() + 1).slice(2)}</span>
      </div>

      {/* Total highlight */}
      <div className="mt-3 rounded-lg bg-gradient-ai-soft px-3 py-2.5 dark:bg-indigo-900/20">
        <p className="text-xs text-dark-5 dark:text-dark-6">Total Available</p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">{totalRemaining}</span>
          <span className="text-xs text-dark-5 dark:text-dark-6">days remaining</span>
        </div>
      </div>

      {/* Leave breakdown */}
      <div className="mt-4 flex-1 space-y-3">
        {displayBalances.map((l) => {
          const remaining = l.total - l.used - (l.pending ?? 0);
          const pct = l.total > 0 ? Math.round((remaining / l.total) * 100) : 0;
          const color = LEAVE_COLORS[l.leaveType] ?? "bg-gray-400";
          const label = LEAVE_LABELS[l.leaveType] ?? l.leaveType;
          return (
            <div key={l.leaveType}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-medium text-dark dark:text-white">{label}</span>
                <span className="text-xs text-dark-5 dark:text-dark-6">
                  <span className="font-semibold text-dark dark:text-white">{remaining}</span>
                  /{l.total}d
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-gray-3 dark:bg-dark-3">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${color}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <Link
        href="/leave"
        className="mt-4 flex items-center justify-center gap-1.5 rounded-lg border border-indigo-200 py-2 text-xs font-semibold text-indigo-600 transition-colors hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
      >
        <svg className="size-3.5" viewBox="0 0 24 24" fill="none">
          <path d="M12 4.5v15m7.5-7.5h-15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Apply Leave
      </Link>
    </div>
  );
}
