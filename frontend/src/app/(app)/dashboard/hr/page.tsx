import Link from "next/link";
import { getHrDashboardData } from "@/lib/actions/dashboard";
import { HrKpiRow } from "./_components/hr-kpi-row";
import { HrThreeColumns } from "./_components/hr-three-columns";
import { HrHeadcountAttrition } from "./_components/hr-headcount-attrition";
import { HrAttendanceOverviewClient } from "./_components/hr-attendance-overview-client";

export const metadata = { title: "HR Dashboard | Monja" };

const badge = {
  rose: "bg-rose-light text-rose-dark dark:bg-rose-dark/20 dark:text-rose",
  amber: "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber",
  indigo: "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-300",
} as const;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function HRDashboardPage() {
  const data = await getHrDashboardData().catch(() => null);

  const firstName = data?.userName ?? "there";
  const att = data?.attendance ?? { present: 0, late: 0, onLeave: 0, remote: 0 };
  const pendingLeaveCount = data?.pendingLeaveCount ?? 0;
  const pendingReviewsCount = data?.pendingReviewsCount ?? 0;
  const openJobsCount = data?.openJobsCount ?? 0;
  const headcount = data?.headcount ?? 0;
  const totalActions = pendingLeaveCount + (pendingReviewsCount > 0 ? 1 : 0);

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
  const monthStr = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const todayStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="space-y-4 md:space-y-6">

      {/* Greeting / Command Header */}
      <div className="bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-xl p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3">
            <div>
              <h1 className="text-xl font-bold text-white">Good morning, {firstName} 👋</h1>
              <p className="text-sm text-white/70 mt-0.5">{dateStr} &nbsp;·&nbsp; HR Operations Center</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/payroll" className="rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 transition-colors">
                Run Payroll
              </Link>
              <Link href="/employees/new" className="rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 transition-colors">
                Add Employee
              </Link>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 md:flex-col md:items-end lg:flex-row">
            {pendingLeaveCount > 0 && (
              <span className="rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-xs font-semibold text-white">
                {pendingLeaveCount} Pending Leave{pendingLeaveCount === 1 ? "" : "s"}
              </span>
            )}
            {openJobsCount > 0 && (
              <span className="rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-xs font-semibold text-white">
                {openJobsCount} Open Position{openJobsCount === 1 ? "" : "s"}
              </span>
            )}
            {pendingReviewsCount > 0 && (
              <span className="rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-xs font-semibold text-white">
                {pendingReviewsCount} Pending Review{pendingReviewsCount === 1 ? "" : "s"}
              </span>
            )}
            <span className="rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-xs font-semibold text-white">
              Payroll Due {monthStr}
            </span>
          </div>
        </div>
      </div>

      <HrKpiRow headcount={headcount} openJobsCount={openJobsCount} />

      {/* Pending Actions + Leave / Payroll */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6">

        {/* HR Action Items */}
        <div className="md:col-span-8 rounded-xl bg-white shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h2 className="font-semibold text-dark dark:text-white">Pending Actions</h2>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${badge.rose}`}>{totalActions}</span>
          </div>
          <div className="px-5 pb-5">
            {(data?.pendingLeaveItems ?? []).map((item) => (
              <div key={item.id} className="py-2.5 border-b border-gray-3 dark:border-dark-3 flex items-center justify-between gap-3 last:border-0">
                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                  <span className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${badge.amber}`}>
                    LEAVE
                  </span>
                  <p className="text-xs text-dark-5 dark:text-dark-6 leading-snug">
                    {item.employeeName} requested {item.days} day{item.days === 1 ? "" : "s"} of {item.leaveType.toLowerCase()} leave starting {formatDate(item.startDate)}
                  </p>
                </div>
                <Link
                  href="/leave/approvals"
                  className="shrink-0 rounded-lg border border-gray-3 bg-white px-3 py-1 text-xs font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                >
                  Review
                </Link>
              </div>
            ))}
            {pendingReviewsCount > 0 && (
              <div className="py-2.5 border-b border-gray-3 dark:border-dark-3 flex items-center justify-between gap-3 last:border-0">
                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                  <span className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${badge.indigo}`}>
                    REVIEW
                  </span>
                  <p className="text-xs text-dark-5 dark:text-dark-6 leading-snug">
                    {pendingReviewsCount} performance review{pendingReviewsCount === 1 ? "" : "s"} pending completion
                  </p>
                </div>
                <Link
                  href="/performance/reviews"
                  className="shrink-0 rounded-lg border border-gray-3 bg-white px-3 py-1 text-xs font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                >
                  View
                </Link>
              </div>
            )}
            {totalActions === 0 && (
              <p className="py-6 text-center text-sm text-dark-5 dark:text-dark-6">No pending actions — all caught up!</p>
            )}
          </div>
        </div>

        {/* Leave + Payroll */}
        <div className="md:col-span-4 flex flex-col gap-4">

          {/* Leave Overview */}
          <HrAttendanceOverviewClient
            attendance={{ ...att, absent: 0, halfDay: 0 }}
            headcount={headcount}
            pendingLeaveCount={pendingLeaveCount}
            todayStr={todayStr}
          />

          {/* Payroll Status */}
          <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-dark dark:text-white">Payroll Status</h2>
              <span className="text-xs text-dark-5 dark:text-dark-6">{monthStr}</span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge.amber}`}>Processing not started</span>
            </div>
            <p className="text-xs text-dark-5 dark:text-dark-6 mb-3">Cutoff: 25th &nbsp;·&nbsp; Payday: 31st</p>
            <Link href="/payroll" className="block w-full rounded-lg bg-primary-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-primary-700">
              Start Payroll →
            </Link>
          </div>

        </div>
      </div>

      <HrThreeColumns jobPostings={data?.jobPostings ?? []} onboarding={data?.onboarding ?? []} />
      <HrHeadcountAttrition headcount={headcount} deptHeadcount={data?.deptHeadcount ?? []} />

    </div>
  );
}
