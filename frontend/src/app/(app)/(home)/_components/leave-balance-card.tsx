import Link from "next/link";
import type { SerializedLeaveBalance } from "@/lib/actions/leave";

const LEAVE_COLORS: Record<string, string> = {
  ANNUAL: "bg-primary-500",
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
  balances: SerializedLeaveBalance[];
}

function LeaveBalanceHeader() {
  const fy = new Date().getFullYear();
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/20">
          <svg className="size-4 text-primary-600 dark:text-primary-400" viewBox="0 0 24 24" fill="none">
            <path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0121 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="section-title">Leave Balance</h3>
      </div>
      <span className="text-muted">FY {fy}–{String(fy + 1).slice(2)}</span>
    </div>
  );
}

function LeaveBalanceTotal({ totalRemaining }: Readonly<{ totalRemaining: number }>) {
  return (
    <div className="mt-3 rounded-lg bg-gradient-ai-soft px-3 py-2.5">
      <p className="text-muted">Total Available</p>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-primary-600 dark:text-primary-300">{totalRemaining}</span>
        <span className="text-muted">days remaining</span>
      </div>
    </div>
  );
}

function LeaveBalanceItem({ leave }: Readonly<{ leave: SerializedLeaveBalance }>) {
  const remaining = leave.total - leave.used - (leave.pending ?? 0);
  const pct = leave.total > 0 ? Math.round((remaining / leave.total) * 100) : 0;
  const color = LEAVE_COLORS[leave.leaveType] ?? "bg-gray-400";
  const label = LEAVE_LABELS[leave.leaveType] ?? leave.leaveType;

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-medium text-dark dark:text-white">{label}</span>
        <span className="text-muted">
          <span className="font-semibold text-dark dark:text-white">{remaining}</span>/{leave.total}d
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-gray-3 dark:bg-dark-3">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function LeaveBalanceCard({ balances }: Readonly<Props>) {
  const totalRemaining = balances.reduce((sum, b) => sum + (b.total - b.used - b.pending), 0);
  const displayBalances = balances.length > 0 ? balances.slice(0, 4) : [
    { id: "mock1", employeeId: "", leaveType: "ANNUAL", year: new Date().getFullYear(), used: 0, total: 30, pending: 0, updatedAt: "" },
    { id: "mock2", employeeId: "", leaveType: "SICK", year: new Date().getFullYear(), used: 0, total: 10, pending: 0, updatedAt: "" },
    { id: "mock3", employeeId: "", leaveType: "CASUAL", year: new Date().getFullYear(), used: 0, total: 10, pending: 0, updatedAt: "" },
  ];

  return (
    <div className="flex h-full flex-col card-p">
      <LeaveBalanceHeader />
      <LeaveBalanceTotal totalRemaining={totalRemaining} />
      <div className="mt-4 flex-1 space-y-3">
        {displayBalances.map((l) => (
          <LeaveBalanceItem key={l.leaveType} leave={l} />
        ))}
      </div>
      <Link
        href="/leave"
        className="mt-4 flex items-center justify-center gap-1.5 rounded-lg border border-primary-200 py-2 text-xs font-semibold text-primary-600 transition-colors hover:bg-primary-50 dark:border-primary-800 dark:text-primary-400 dark:hover:bg-primary-900/20"
      >
        <svg className="size-3.5" viewBox="0 0 24 24" fill="none">
          <path d="M12 4.5v15m7.5-7.5h-15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Apply Leave
      </Link>
    </div>
  );
}
