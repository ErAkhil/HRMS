export const metadata = { title: "Advanced Analytics" };

const GENDER_DATA = [
  { dept: "Engineering", male: 38, female: 14 },
  { dept: "Product", male: 16, female: 12 },
  { dept: "Sales", male: 22, female: 23 },
  { dept: "HR", male: 4, female: 14 },
  { dept: "Finance", male: 12, female: 10 },
  { dept: "Marketing", male: 13, female: 18 },
];

const HIRE_ATTRITION = [
  { month: "Dec", hires: 8, attrition: 8 },
  { month: "Jan", hires: 12, attrition: 5 },
  { month: "Feb", hires: 9, attrition: 7 },
  { month: "Mar", hires: 14, attrition: 4 },
  { month: "Apr", hires: 11, attrition: 6 },
  { month: "May", hires: 7, attrition: 3 },
];

const TIME_TO_HIRE = [
  { dept: "Engineering", avgDays: 34, trend: "up" },
  { dept: "Sales", avgDays: 21, trend: "down" },
  { dept: "Product", avgDays: 28, trend: "stable" },
  { dept: "HR", avgDays: 18, trend: "down" },
  { dept: "Finance", avgDays: 25, trend: "stable" },
  { dept: "Marketing", avgDays: 22, trend: "down" },
];

const maxBar = 14;

export default function AdvancedAnalyticsPage() {
  const totalMale = GENDER_DATA.reduce((s, d) => s + d.male, 0);
  const totalFemale = GENDER_DATA.reduce((s, d) => s + d.female, 0);
  const total = totalMale + totalFemale;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-dark dark:text-white">Advanced Analytics</h1>
        <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">Deep-dive workforce insights — Q2 2026</p>
      </div>

      {/* Diversity Metrics */}
      <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-dark dark:text-white">Diversity Metrics — Gender by Department</h2>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-5 rounded-sm bg-indigo-500" />
              <span className="text-xs text-dark-5 dark:text-dark-6">Male ({totalMale} · {((totalMale / total) * 100).toFixed(0)}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-5 rounded-sm bg-pink-500" />
              <span className="text-xs text-dark-5 dark:text-dark-6">Female ({totalFemale} · {((totalFemale / total) * 100).toFixed(0)}%)</span>
            </div>
          </div>
        </div>
        <div className="space-y-2.5">
          {GENDER_DATA.map((d) => {
            const t = d.male + d.female;
            return (
              <div key={d.dept} className="flex items-center gap-3">
                <span className="w-20 text-xs text-dark-5 dark:text-dark-6 shrink-0 text-right">{d.dept}</span>
                <div className="flex-1 flex h-5 overflow-hidden rounded-full bg-gray-2 dark:bg-dark-3">
                  <div className="h-full bg-indigo-500" style={{ width: `${(d.male / t) * 100}%` }} />
                  <div className="h-full bg-pink-500" style={{ width: `${(d.female / t) * 100}%` }} />
                </div>
                <span className="text-xs text-dark-5 dark:text-dark-6 w-24 shrink-0">
                  {d.male}M / {d.female}F
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hire vs Attrition */}
      <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <h2 className="text-sm font-semibold text-dark dark:text-white mb-4">Hire vs Attrition (Last 6 Months)</h2>
        <div className="flex items-end gap-4 h-40 px-2">
          {HIRE_ATTRITION.map((item) => (
            <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
              <div className="flex items-end gap-0.5 h-28">
                <div
                  className="w-5 rounded-t bg-indigo-500 transition-all"
                  style={{ height: `${(item.hires / maxBar) * 100}%` }}
                  title={`Hires: ${item.hires}`}
                />
                <div
                  className="w-5 rounded-t bg-rose-400 transition-all"
                  style={{ height: `${(item.attrition / maxBar) * 100}%` }}
                  title={`Attrition: ${item.attrition}`}
                />
              </div>
              <span className="text-xs text-dark-5 dark:text-dark-6">{item.month}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-3">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-5 rounded-sm bg-indigo-500" />
            <span className="text-xs text-dark-5 dark:text-dark-6">Hires</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-5 rounded-sm bg-rose-400" />
            <span className="text-xs text-dark-5 dark:text-dark-6">Attrition</span>
          </div>
        </div>
      </div>

      {/* Time to Hire */}
      <div className="rounded-xl bg-white shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <div className="border-b border-gray-3 dark:border-dark-3 px-5 py-4">
          <h2 className="text-sm font-semibold text-dark dark:text-white">Time-to-Hire by Department</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-1 dark:bg-dark-3">
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Department</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Avg Days</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Benchmark</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Trend</th>
              </tr>
            </thead>
            <tbody>
              {TIME_TO_HIRE.map((row) => (
                <tr key={row.dept} className="border-b border-gray-3 dark:border-dark-3 hover:bg-gray-1 dark:hover:bg-dark-3">
                  <td className="px-5 py-3.5 font-medium text-dark dark:text-white">{row.dept}</td>
                  <td className="px-5 py-3.5">
                    <span className={`font-semibold ${row.avgDays > 30 ? "text-rose-500" : row.avgDays > 25 ? "text-amber-500" : "text-emerald-500"}`}>
                      {row.avgDays} days
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-dark-5 dark:text-dark-6">28 days</td>
                  <td className="px-5 py-3.5">
                    {row.trend === "up" && <span className="text-rose-500 text-xs flex items-center gap-1"><svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>Increasing</span>}
                    {row.trend === "down" && <span className="text-emerald-500 text-xs flex items-center gap-1"><svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>Improving</span>}
                    {row.trend === "stable" && <span className="text-dark-5 dark:text-dark-6 text-xs">Stable</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Correlation Note */}
      <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <h2 className="text-sm font-semibold text-dark dark:text-white mb-3">Productivity vs Attendance Correlation</h2>
        <div className="rounded-lg bg-gray-1 dark:bg-dark-3 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/20 shrink-0">
              <svg className="h-4 w-4 text-indigo-600 dark:text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-dark dark:text-white mb-1">Correlation coefficient: 0.74 (Strong positive)</p>
              <p className="text-xs text-dark-5 dark:text-dark-6">
                Analysis of Q1–Q2 2026 data shows a strong positive correlation between attendance consistency and individual
                productivity scores. Employees with 95%+ attendance rate score 12% higher on productivity metrics on average.
                Notably, remote employees show equal correlation strength, suggesting flexible work policies do not negatively
                impact output when attendance targets are maintained.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
