import Link from "next/link";
import { REVIEW_ROWS, SCORE_BARS, FEEDBACK_HIGHLIGHTS } from "../performance-data";

export function ReviewsTab() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
      <div className="md:col-span-8">
        <div className="card-p">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="section-title">Review History</h2>
            <Link href="/performance/reviews" className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">
              View full review →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-gray-3 dark:border-dark-3">
                  {["Review Period", "Type", "Score", "Reviewer", "Status", "Action"].map((h) => (
                    <th key={h} className="pb-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6 first:pl-0 last:pr-0 px-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {REVIEW_ROWS.map((row, i) => (
                  <tr key={i} className="border-b border-gray-3 last:border-0 dark:border-dark-3">
                    <td className="py-3 pl-0 pr-3 text-sm font-medium text-dark dark:text-white">{row.period}</td>
                    <td className="px-3 py-3 text-muted">{row.type}</td>
                    <td className="px-3 py-3 text-sm font-semibold text-dark dark:text-white">{row.score}/100</td>
                    <td className="px-3 py-3 text-muted">{row.reviewer}</td>
                    <td className="px-3 py-3">
                      <span className={row.status === "Completed" ? "badge-success" : "badge-warning"}>{row.status}</span>
                    </td>
                    <td className="py-3 pl-3 pr-0">
                      {row.action === "View" ? (
                        <Link href="/performance/reviews" className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">View</Link>
                      ) : (
                        <Link href="/performance/reviews/new" className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400">Start →</Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="md:col-span-4 flex flex-col gap-4">
        <div className="card-p">
          <h2 className="mb-4 section-title">Score Trend</h2>
          <div className="flex items-end gap-2 h-32">
            {SCORE_BARS.map((bar) => {
              const heightPct = bar.pending ? 0 : (bar.value / 100) * 100;
              return (
                <div key={bar.label} className="flex flex-1 flex-col items-center gap-1">
                  {!bar.pending && <span className="text-[10px] font-medium text-dark-5 dark:text-dark-6">{bar.value}</span>}
                  <div className="relative w-full flex-1 flex items-end">
                    {bar.pending ? (
                      <div className="w-full rounded-t border-2 border-dashed border-gray-3 dark:border-dark-3" style={{ height: "30%" }} />
                    ) : (
                      <div className={`w-full rounded-t transition-all ${bar.current ? "bg-indigo-600" : "bg-indigo-200 dark:bg-indigo-900/40"}`} style={{ height: `${heightPct}%` }} />
                    )}
                  </div>
                  <span className="text-[10px] text-dark-5 dark:text-dark-6">{bar.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card-p">
          <h2 className="mb-4 section-title">Review Feedback</h2>
          <p className="mb-3 text-muted">Highlights from last review</p>
          <div className="space-y-3">
            {FEEDBACK_HIGHLIGHTS.map((fb, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="mt-0.5 text-lg leading-none text-dark-5 dark:text-dark-6">&ldquo;</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-dark dark:text-white">{fb.text}</p>
                  <span className={`mt-1 ${fb.badge}`}>{fb.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
