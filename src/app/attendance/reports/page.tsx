import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Attendance Reports",
};

interface DepartmentRow {
  dept: string;
  presentPct: number;
  avgHours: number;
  latePct: number;
  wfhPct: number;
}

const departments: DepartmentRow[] = [
  { dept: "Engineering",    presentPct: 93.2, avgHours: 8.6, latePct: 5.1, wfhPct: 34.0 },
  { dept: "Design",         presentPct: 96.1, avgHours: 8.3, latePct: 2.8, wfhPct: 28.5 },
  { dept: "Marketing",      presentPct: 91.8, avgHours: 8.1, latePct: 7.2, wfhPct: 22.0 },
  { dept: "Sales",          presentPct: 97.3, avgHours: 9.1, latePct: 1.9, wfhPct: 10.0 },
  { dept: "HR",             presentPct: 98.0, avgHours: 8.0, latePct: 1.2, wfhPct: 15.0 },
  { dept: "Finance",        presentPct: 95.5, avgHours: 8.5, latePct: 3.4, wfhPct: 18.0 },
];

function getRateColor(pct: number, invert = false): string {
  if (invert) {
    if (pct <= 3) return "text-emerald-dark dark:text-emerald";
    if (pct <= 7) return "text-amber-dark dark:text-amber";
    return "text-rose-dark dark:text-rose";
  }
  if (pct >= 95) return "text-emerald-dark dark:text-emerald";
  if (pct >= 88) return "text-amber-dark dark:text-amber";
  return "text-rose-dark dark:text-rose";
}

export default function AttendanceReportsPage() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-dark-5 dark:text-dark-6 mb-1">
            <Link href="/attendance" className="hover:text-primary-600">Attendance</Link>
            <span>/</span>
            <span>Reports</span>
          </div>
          <h1 className="text-heading-5 font-bold text-dark dark:text-white">Attendance Reports</h1>
          <p className="text-xs text-dark-5 dark:text-dark-6 mt-0.5">Analyze attendance patterns across departments</p>
        </div>
        <button className="rounded-lg border border-gray-3 px-4 py-2 text-sm font-medium text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6 flex items-center gap-1.5 w-fit">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Report
        </button>
      </div>

      {/* Period Tabs */}
      <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <div className="flex items-center gap-1 border-b border-gray-3 dark:border-dark-3 -mx-5 px-5 mb-5">
          {["Weekly", "Monthly", "Quarterly"].map((tab, i) => (
            <button
              key={tab}
              className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                i === 1
                  ? "border-primary-600 text-primary-600"
                  : "border-transparent text-dark-5 hover:text-dark dark:text-dark-6 dark:hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-gray-1 dark:bg-dark-3 p-4">
            <p className="text-xs text-dark-5 dark:text-dark-6">Avg Attendance Rate</p>
            <p className="mt-1 text-3xl font-bold text-emerald-dark dark:text-emerald">94.2%</p>
            <div className="mt-2 flex items-center gap-1">
              <svg className="h-3 w-3 text-emerald-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span className="text-xs text-emerald-dark dark:text-emerald">+1.3% vs last month</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-gray-3 dark:bg-dark-4 overflow-hidden">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: "94.2%" }} />
            </div>
          </div>
          <div className="rounded-lg bg-gray-1 dark:bg-dark-3 p-4">
            <p className="text-xs text-dark-5 dark:text-dark-6">Avg Working Hours</p>
            <p className="mt-1 text-3xl font-bold text-primary-600 dark:text-primary-400">8.4h</p>
            <div className="mt-2 flex items-center gap-1">
              <svg className="h-3 w-3 text-emerald-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span className="text-xs text-emerald-dark dark:text-emerald">+0.2h vs last month</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-gray-3 dark:bg-dark-4 overflow-hidden">
              <div className="h-full rounded-full bg-primary-600" style={{ width: "84%" }} />
            </div>
          </div>
        </div>
      </div>

      {/* AI Insight Card */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/20">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">AI Insight</p>
            <p className="mt-1 text-sm text-white/80">
              Engineering dept has the highest WFH rate at <span className="font-semibold text-white">34%</span>.
              Consider reviewing hybrid policy to ensure team collaboration is maintained.
              Attendance rates across all departments remain above 91%.
            </p>
          </div>
        </div>
      </div>

      {/* Department-wise table */}
      <div className="rounded-xl bg-white shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 overflow-hidden">
        <div className="p-5 border-b border-gray-3 dark:border-dark-3">
          <h3 className="text-sm font-semibold text-dark dark:text-white">Department-wise Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-3 dark:border-dark-3">
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Department</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Present %</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Avg Hours</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Late %</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">WFH %</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((row) => (
                <tr key={row.dept} className="border-b border-gray-3 last:border-0 hover:bg-gray-1 dark:border-dark-3 dark:hover:bg-dark-3">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary-600">{row.dept.slice(0, 2).toUpperCase()}</span>
                      </div>
                      <span className="text-sm font-medium text-dark dark:text-white">{row.dept}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 rounded-full bg-gray-3 dark:bg-dark-3 overflow-hidden">
                        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${row.presentPct}%` }} />
                      </div>
                      <span className={`text-sm font-semibold ${getRateColor(row.presentPct)}`}>{row.presentPct}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-sm font-medium text-dark dark:text-white">{row.avgHours}h</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-sm font-semibold ${getRateColor(row.latePct, true)}`}>{row.latePct}%</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 rounded-full bg-gray-3 dark:bg-dark-3 overflow-hidden">
                        <div className="h-full rounded-full bg-violet-500" style={{ width: `${row.wfhPct}%` }} />
                      </div>
                      <span className="text-sm font-medium text-dark dark:text-white">{row.wfhPct}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
