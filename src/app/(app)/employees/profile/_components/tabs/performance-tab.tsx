const SCORE_BARS = [
  { label: "Goal Achievement", pct: 92, color: "bg-emerald" },
  { label: "Collaboration", pct: 88, color: "bg-indigo-600" },
  { label: "Delivery", pct: 85, color: "bg-violet-500" },
  { label: "Leadership", pct: 79, color: "bg-amber" },
];

const TREND_DATA = [
  { period: "Q1 2025", score: 79 },
  { period: "Q2 2025", score: 78 },
  { period: "Q3 2025", score: 81 },
  { period: "Q4 2025", score: 84 },
  { period: "Q1 2026", score: 87 },
];

const REVIEW_HISTORY = [
  { period: "Q1 2026", score: 87, reviewer: "James Williams" },
  { period: "Q4 2025", score: 84, reviewer: "James Williams" },
  { period: "Q3 2025", score: 81, reviewer: "James Williams" },
  { period: "Q2 2025", score: 78, reviewer: "James Williams" },
  { period: "Q1 2025", score: 79, reviewer: "James Williams" },
];

const FEEDBACK_CARDS = [
  { title: "Exceptional Problem-Solving", body: "Sarah consistently delivers elegant solutions to complex technical challenges, often proposing approaches the team hadn't considered.", color: "border-l-emerald" },
  { title: "Strong Collaboration", body: "Always available to help teammates, conducts thorough code reviews, and fosters a positive team environment.", color: "border-l-indigo-600" },
  { title: "Improve Documentation", body: "Encouraged to invest more time in writing clear inline documentation and architecture decision records for future maintainability.", color: "border-l-amber" },
];

export function PerformanceTab() {
  const maxScore = Math.max(...TREND_DATA.map((r) => r.score));

  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <h2 className="mb-5 text-base font-semibold text-dark dark:text-white">Performance History</h2>

        <div className="mb-6 flex flex-wrap items-center gap-8">
          <div className="text-center">
            <p className="text-5xl font-bold text-indigo-600">87<span className="text-2xl font-normal text-dark-5 dark:text-dark-6">/100</span></p>
            <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">Overall Score</p>
            <span className="mt-1 inline-flex items-center rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-semibold text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald">Excellent</span>
          </div>
          <div className="flex-1 space-y-3 min-w-[200px]">
            {SCORE_BARS.map(({ label, pct, color }) => (
              <div key={label}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-dark-5 dark:text-dark-6">{label}</span>
                  <span className="font-semibold text-dark dark:text-white">{pct}%</span>
                </div>
                <div className="relative h-1.5 overflow-hidden rounded-full bg-gray-2 dark:bg-dark-3">
                  <div className={`absolute inset-y-0 left-0 rounded-full ${color}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-gray-3 p-4 dark:border-dark-3">
          <p className="mb-4 text-sm font-semibold text-dark dark:text-white">Score Trend</p>
          <div className="flex items-end justify-around gap-3 h-28">
            {TREND_DATA.map(({ period, score }, idx, arr) => {
              const heightPct = Math.round((score / maxScore) * 100);
              const isCurrent = idx === arr.length - 1;
              return (
                <div key={period} className="flex flex-col items-center gap-1 flex-1">
                  <span className="text-xs font-semibold text-dark dark:text-white">{score}</span>
                  <div className="w-full rounded-t-md" style={{ height: `${heightPct}%`, background: isCurrent ? "#4f46e5" : "#c7d2fe" }} />
                  <span className="text-[10px] text-dark-5 dark:text-dark-6 text-center leading-tight">{period}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-6 overflow-x-auto">
          <p className="mb-3 text-sm font-semibold text-dark dark:text-white">Review History</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-3 dark:border-dark-3">
                {["Period", "Score", "Reviewer", "Status", "Action"].map((h) => (
                  <th key={h} className="pb-3 text-left text-xs font-medium uppercase tracking-wide text-dark-5 dark:text-dark-6">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-3 dark:divide-dark-3">
              {REVIEW_HISTORY.map(({ period, score, reviewer }) => (
                <tr key={period}>
                  <td className="py-3 font-medium text-dark dark:text-white">{period}</td>
                  <td className="py-3"><span className="font-semibold text-indigo-600 dark:text-indigo-400">{score}/100</span></td>
                  <td className="py-3 text-dark-5 dark:text-dark-6">{reviewer}</td>
                  <td className="py-3"><span className="inline-flex items-center rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-semibold text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald">Completed</span></td>
                  <td className="py-3"><button className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-dark dark:text-white">Manager Feedback</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {FEEDBACK_CARDS.map(({ title, body, color }) => (
              <div key={title} className={`rounded-lg border border-gray-3 border-l-4 p-4 dark:border-dark-3 ${color}`}>
                <p className="mb-1.5 text-sm font-semibold text-dark dark:text-white">{title}</p>
                <p className="text-xs leading-relaxed text-dark-5 dark:text-dark-6">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
