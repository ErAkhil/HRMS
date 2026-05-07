import { HeadcountChart } from "./_components/headcount-chart";

export const metadata = { title: "Reports & Analytics" };

const KPIS = [
  { label: "Total Headcount", value: "248", change: "+8 this quarter", up: true, bg: "bg-indigo-50 dark:bg-indigo-900/20", color: "text-indigo-600 dark:text-indigo-300" },
  { label: "Attrition Rate", value: "7.2%", change: "↓ from 9.1%", up: true, bg: "bg-emerald-light dark:bg-emerald-dark/20", color: "text-emerald-dark dark:text-emerald" },
  { label: "Avg Tenure", value: "3.4 yrs", change: "+0.2 from last yr", up: true, bg: "bg-amber-light dark:bg-amber-dark/20", color: "text-amber-dark" },
  { label: "Open Positions", value: "18", change: "6 in final stage", up: false, bg: "bg-violet-light dark:bg-violet-dark/20", color: "text-violet-dark dark:text-violet-300" },
];

const DEPARTMENTS = [
  { name: "Engineering", count: 52 },
  { name: "Sales", count: 45 },
  { name: "Marketing", count: 31 },
  { name: "Product", count: 28 },
  { name: "Finance", count: 22 },
  { name: "HR", count: 18 },
  { name: "Operations", count: 34 },
  { name: "Support", count: 18 },
];
const maxCount = Math.max(...DEPARTMENTS.map((d) => d.count));

const ATTRITION_MONTHS = [
  { month: "Dec 2025", count: 8, rate: "3.6%" },
  { month: "Jan 2026", count: 5, rate: "2.2%" },
  { month: "Feb 2026", count: 7, rate: "3.0%" },
  { month: "Mar 2026", count: 4, rate: "1.7%" },
  { month: "Apr 2026", count: 6, rate: "2.5%" },
  { month: "May 2026", count: 3, rate: "1.2%" },
];

export default function ReportsPage() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-dark dark:text-white">Reports & Analytics</h1>
          <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">Workforce intelligence for Q2 2026</p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-lg border border-gray-3 px-4 py-2 text-sm font-medium text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6">
            Schedule
          </button>
          <button className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 flex items-center gap-1.5">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {KPIS.map((kpi) => (
          <div key={kpi.label} className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
            <p className="text-xs text-dark-5 dark:text-dark-6">{kpi.label}</p>
            <p className="mt-1 text-2xl font-bold text-dark dark:text-white">{kpi.value}</p>
            <p className={`mt-1 text-xs ${kpi.up ? "text-emerald-dark dark:text-emerald" : "text-dark-5 dark:text-dark-6"}`}>
              {kpi.change}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Headcount Trend */}
        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <h2 className="text-sm font-semibold text-dark dark:text-white mb-4">Headcount Trend (6 Months)</h2>
          <HeadcountChart />
        </div>

        {/* Department Distribution */}
        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <h2 className="text-sm font-semibold text-dark dark:text-white mb-4">Department Distribution</h2>
          <div className="space-y-2.5">
            {DEPARTMENTS.map((dept) => (
              <div key={dept.name} className="flex items-center gap-3">
                <span className="w-20 text-xs text-dark-5 dark:text-dark-6 text-right shrink-0">{dept.name}</span>
                <div className="flex-1 h-2 overflow-hidden rounded-full bg-gray-2 dark:bg-dark-3">
                  <div
                    className="h-full rounded-full bg-indigo-500"
                    style={{ width: `${(dept.count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="w-8 text-xs font-semibold text-dark dark:text-white text-right shrink-0">
                  {dept.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attrition Section */}
      <div className="rounded-xl bg-white shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <div className="border-b border-gray-3 dark:border-dark-3 px-5 py-4">
          <h2 className="text-sm font-semibold text-dark dark:text-white">Attrition Analytics</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-1 dark:bg-dark-3">
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Month</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Departures</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Rate</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Trend</th>
              </tr>
            </thead>
            <tbody>
              {ATTRITION_MONTHS.map((row, idx) => (
                <tr key={row.month} className="border-b border-gray-3 dark:border-dark-3 hover:bg-gray-1 dark:hover:bg-dark-3">
                  <td className="px-5 py-3.5 font-medium text-dark dark:text-white">{row.month}</td>
                  <td className="px-5 py-3.5 text-dark dark:text-white">{row.count}</td>
                  <td className="px-5 py-3.5">
                    <span className="rounded-full bg-amber-light px-2.5 py-0.5 text-xs font-medium text-amber-dark">
                      {row.rate}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    {idx > 0 && ATTRITION_MONTHS[idx - 1].count > row.count ? (
                      <span className="text-emerald-500 text-xs">↓ Improving</span>
                    ) : idx > 0 ? (
                      <span className="text-rose-500 text-xs">↑ Increased</span>
                    ) : (
                      <span className="text-dark-5 dark:text-dark-6 text-xs">Baseline</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Prediction */}
      <div
        className="rounded-xl p-5 text-white"
        style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)" }}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <svg className="h-5 w-5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-white/70 uppercase tracking-wide mb-1">AI Prediction</p>
            <p className="text-sm font-medium text-white">
              At current trend, attrition will reach 6.8% by Q3 2026 — down from the 9.1% peak in Q4 2025.
              The recent flexible work policy change is the likely driver. Continue monitoring Engineering department
              where attrition risk remains slightly elevated (8.1%).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
