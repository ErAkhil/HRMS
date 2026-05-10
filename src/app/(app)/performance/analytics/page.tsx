export const metadata = { title: "Performance Analytics" };

const DEPARTMENTS = [
  { name: "Engineering", avgScore: 89.2, topPerformer: "Alex Rivera", headcount: 52 },
  { name: "Product", avgScore: 86.4, topPerformer: "Priya Patel", headcount: 28 },
  { name: "Sales", avgScore: 84.7, topPerformer: "Marcus Webb", headcount: 45 },
  { name: "HR", avgScore: 85.1, topPerformer: "Sarah Johnson", headcount: 18 },
  { name: "Finance", avgScore: 83.9, topPerformer: "James Liu", headcount: 22 },
  { name: "Marketing", avgScore: 82.3, topPerformer: "Emma Davis", headcount: 31 },
];

const DISTRIBUTION = [
  { label: "Exceptional", range: "91–100", count: 38, pct: 15, color: "bg-primary-500" },
  { label: "Above Average", range: "81–90", count: 87, pct: 35, color: "bg-emerald-500" },
  { label: "Average", range: "71–80", count: 75, pct: 30, color: "bg-amber-500" },
  { label: "Below Average", range: "61–70", count: 35, pct: 14, color: "bg-orange-400" },
  { label: "Needs Improvement", range: "≤60", count: 13, pct: 6, color: "bg-rose-500" },
];

const TOP_PERFORMERS = [
  { name: "Alex Rivera", dept: "Engineering", score: 97, trend: "up", avatar: "user-01.png" },
  { name: "Priya Patel", dept: "Product", score: 95, trend: "up", avatar: "user-02.png" },
  { name: "Marcus Webb", dept: "Sales", score: 93, trend: "stable", avatar: "user-03.png" },
  { name: "James Liu", dept: "Finance", score: 92, trend: "up", avatar: "user-04.png" },
  { name: "Emma Davis", dept: "Marketing", score: 91, trend: "down", avatar: "user-05.png" },
];

export default function PerformanceAnalyticsPage() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-dark dark:text-white">Performance Analytics</h1>
        <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">Q2 2026 — Department comparison and insights</p>
      </div>

      {/* AI Insight Card */}
      <div
        className="rounded-xl p-5 text-white"
        style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)" }}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <svg className="h-5 w-5 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-white/70 uppercase tracking-wide mb-1">AI Insight</p>
            <p className="text-sm font-medium text-white">
              Engineering department leads performance this quarter with an average score of 89.2 — 3.1 points above
              the company average. Consider documenting their goal-setting practices for company-wide adoption.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Department Comparison */}
        <div className="rounded-xl bg-white shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="border-b border-gray-3 dark:border-dark-3 px-5 py-4">
            <h2 className="text-sm font-semibold text-dark dark:text-white">Department Comparison</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-1 dark:bg-dark-3">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Department</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Headcount</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Avg Score</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Top Performer</th>
                </tr>
              </thead>
              <tbody>
                {DEPARTMENTS.map((dept) => (
                  <tr
                    key={dept.name}
                    className="border-b border-gray-3 dark:border-dark-3 hover:bg-gray-1 dark:hover:bg-dark-3"
                  >
                    <td className="px-5 py-3.5 font-medium text-dark dark:text-white">{dept.name}</td>
                    <td className="px-5 py-3.5 text-dark-5 dark:text-dark-6">{dept.headcount}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 overflow-hidden rounded-full bg-gray-2 dark:bg-dark-3">
                          <div
                            className="h-full rounded-full bg-primary-500"
                            style={{ width: `${dept.avgScore}%` }}
                          />
                        </div>
                        <span className="font-semibold text-dark dark:text-white">{dept.avgScore}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-dark-5 dark:text-dark-6">{dept.topPerformer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance Distribution */}
        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <h2 className="text-sm font-semibold text-dark dark:text-white mb-4">Performance Distribution</h2>
          <div className="space-y-3">
            {DISTRIBUTION.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-dark dark:text-white">{item.label}</span>
                    <span className="text-xs text-dark-5 dark:text-dark-6">({item.range})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-dark-5 dark:text-dark-6">{item.count} employees</span>
                    <span className="text-xs font-semibold text-dark dark:text-white w-8 text-right">{item.pct}%</span>
                  </div>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-2 dark:bg-dark-3">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="rounded-xl bg-white shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <div className="border-b border-gray-3 dark:border-dark-3 px-5 py-4">
          <h2 className="text-sm font-semibold text-dark dark:text-white">Top Performers — Q2 2026</h2>
        </div>
        <div className="divide-y divide-gray-3 dark:divide-dark-3">
          {TOP_PERFORMERS.map((emp, idx) => (
            <div key={emp.name} className="flex items-center justify-between px-5 py-4 hover:bg-gray-1 dark:hover:bg-dark-3">
              <div className="flex items-center gap-3">
                <span className="w-6 text-center text-sm font-bold text-dark-5 dark:text-dark-6">
                  {idx + 1}
                </span>
                <div className="h-9 w-9 overflow-hidden rounded-full bg-gray-2 dark:bg-dark-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/images/user/${emp.avatar}`} alt={emp.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-dark dark:text-white">{emp.name}</p>
                  <p className="text-xs text-dark-5 dark:text-dark-6">{emp.dept}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-dark dark:text-white">{emp.score}</span>
                {emp.trend === "up" && (
                  <span className="text-emerald-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  </span>
                )}
                {emp.trend === "down" && (
                  <span className="text-rose-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </span>
                )}
                {emp.trend === "stable" && (
                  <span className="text-dark-5 dark:text-dark-6">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                    </svg>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
