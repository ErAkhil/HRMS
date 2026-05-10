import Link from "next/link";
import { badgeClass, actionItems, leaveBars, payrollSteps } from "./_data/hr-data";
import { HrKpiRow } from "./_components/hr-kpi-row";
import { HrThreeColumns } from "./_components/hr-three-columns";
import { HrHeadcountAttrition } from "./_components/hr-headcount-attrition";

export const metadata = { title: "HR Dashboard | Unikove" };

export default function HRDashboardPage() {
  return (
    <div className="space-y-4 md:space-y-6">

      {/* Greeting / Command Header */}
      <div className="bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-xl p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3">
            <div>
              <h1 className="text-xl font-bold text-white">Good morning, Meera 👋</h1>
              <p className="text-sm text-white/70 mt-0.5">Wednesday, May 7, 2026 &nbsp;·&nbsp; HR Operations Center</p>
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
            <span className="rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-xs font-semibold text-white">11 Pending Actions</span>
            <span className="rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-xs font-semibold text-white">3 Open Positions</span>
            <span className="rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-xs font-semibold text-white">2 Exits This Month</span>
            <span className="rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-xs font-semibold text-white">Payroll Due May 31</span>
          </div>
        </div>
      </div>

      <HrKpiRow />

      {/* Pending Actions + Leave / Payroll */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6">

        {/* HR Action Items */}
        <div className="md:col-span-8 rounded-xl bg-white shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h2 className="font-semibold text-dark dark:text-white">Pending Actions</h2>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${badgeClass.rose}`}>11</span>
          </div>
          <div className="px-5 pb-5">
            {actionItems.map((item, i) => (
              <div key={i} className="py-2.5 border-b border-gray-3 dark:border-dark-3 flex items-center justify-between gap-3 last:border-0">
                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                  <span className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${badgeClass[item.urgencyColor]}`}>
                    {item.urgency}
                  </span>
                  <p className="text-xs text-dark-5 dark:text-dark-6 leading-snug">{item.description}</p>
                </div>
                <Link
                  href={item.href}
                  className="shrink-0 rounded-lg border border-gray-3 bg-white px-3 py-1 text-xs font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                >
                  {item.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Leave + Payroll */}
        <div className="md:col-span-4 flex flex-col gap-4">

          {/* Leave Overview */}
          <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-dark dark:text-white">Leave Today</h2>
              <span className="text-xs text-dark-5 dark:text-dark-6">May 7, 2026</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="rounded-lg bg-amber-light dark:bg-amber-dark/20 px-3 py-2 text-center">
                <p className="text-lg font-bold text-amber-dark dark:text-amber">12</p>
                <p className="text-[10px] font-semibold text-amber-dark/80 dark:text-amber/80">On Leave</p>
              </div>
              <div className="rounded-lg bg-primary-50 dark:bg-primary-900/20 px-3 py-2 text-center">
                <p className="text-lg font-bold text-primary-600 dark:text-primary-300">18</p>
                <p className="text-[10px] font-semibold text-primary-600/80 dark:text-primary-300/80">WFH</p>
              </div>
              <div className="rounded-lg bg-rose-light dark:bg-rose-dark/20 px-3 py-2 text-center">
                <p className="text-lg font-bold text-rose-dark dark:text-rose">4</p>
                <p className="text-[10px] font-semibold text-rose-dark/80 dark:text-rose/80">Late</p>
              </div>
              <div className="rounded-lg bg-emerald-light dark:bg-emerald-dark/20 px-3 py-2 text-center">
                <p className="text-lg font-bold text-emerald-dark dark:text-emerald">214</p>
                <p className="text-[10px] font-semibold text-emerald-dark/80 dark:text-emerald/80">Present</p>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              {leaveBars.map((row) => (
                <div key={row.label} className="flex items-center gap-2">
                  <span className="w-16 shrink-0 text-[10px] text-dark-5 dark:text-dark-6">{row.label}</span>
                  <div className="flex-1 relative h-1.5 rounded-full bg-gray-2 dark:bg-dark-3 overflow-hidden">
                    <div className={`absolute inset-y-0 left-0 rounded-full ${row.barColor}`} style={{ width: `${row.pct.toFixed(1)}%` }} />
                  </div>
                  <span className="w-6 shrink-0 text-[10px] font-semibold text-dark-5 dark:text-dark-6 text-right">{row.count}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-gray-3 dark:border-dark-3 pt-3">
              <Link href="/leave/calendar" className="text-xs font-medium text-primary-600 hover:underline dark:text-primary-400">
                View Leave Calendar →
              </Link>
              <Link href="/leave/approvals" className="rounded-lg bg-primary-600 px-3 py-1 text-xs font-semibold text-white hover:bg-primary-700">
                Approvals: 5
              </Link>
            </div>
          </div>

          {/* Payroll Status */}
          <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-dark dark:text-white">Payroll Status</h2>
              <span className="text-xs text-dark-5 dark:text-dark-6">May 2026</span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeClass.amber}`}>Processing not started</span>
            </div>
            <p className="text-xs text-dark-5 dark:text-dark-6 mb-3">Cutoff: May 25 &nbsp;·&nbsp; Payday: May 31</p>
            <div className="space-y-2 mb-4">
              {payrollSteps.map((step) => (
                <div key={step.label} className="flex items-center gap-2">
                  {step.done ? (
                    <span className="shrink-0 text-emerald-dark dark:text-emerald text-sm font-bold">✓</span>
                  ) : step.pending ? (
                    <span className="shrink-0 w-4 h-4 rounded-full border-2 border-amber-500 bg-amber-light dark:bg-amber-dark/20" />
                  ) : (
                    <span className="shrink-0 w-4 h-4 rounded-full border-2 border-gray-3 dark:border-dark-3" />
                  )}
                  <span className={`text-xs ${step.done ? "text-emerald-dark dark:text-emerald" : step.pending ? "text-amber-dark dark:text-amber" : "text-dark-5 dark:text-dark-6"}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
            <Link href="/payroll" className="block w-full rounded-lg bg-primary-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-primary-700">
              Start Payroll →
            </Link>
          </div>

        </div>
      </div>

      <HrThreeColumns />
      <HrHeadcountAttrition />

    </div>
  );
}
