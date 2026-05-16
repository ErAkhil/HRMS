import Link from "next/link";
import type { SerializedReview } from "@/lib/actions/performance";

const TYPE_DISPLAY: Record<string, string> = {
  ANNUAL: "Annual Review",
  MID_YEAR: "Mid-year",
  QUARTERLY: "Quarterly",
  PROBATION: "Probation",
  PEER: "Peer Review",
};

export function ReviewsTab({ reviews }: Readonly<{ reviews: readonly SerializedReview[] }>) {
  if (reviews.length === 0) {
    return (
      <div className="card-p flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm font-medium text-dark dark:text-white">No reviews yet</p>
        <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">Performance reviews will appear here once they are completed.</p>
      </div>
    );
  }

  const scoreBars = reviews
    .filter((r) => r.score !== null)
    .slice(0, 6)
    .reverse();

  const maxScore = Math.max(...scoreBars.map((r) => r.score ?? 0), 1);

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
      <div className="md:col-span-8">
        <div className="card-p">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="section-title">Review History</h2>
            <Link href="/performance/reviews" className="text-xs font-medium text-primary-600 hover:underline dark:text-primary-400">
              {"View all ->"}
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-gray-3 dark:border-dark-3">
                  {["Date", "Type", "Score", "Reviewer", "Status"].map((h) => (
                    <th key={h} className="pb-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6 first:pl-0 last:pr-0 px-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reviews.map((row) => (
                  <tr key={row.id} className="border-b border-gray-3 last:border-0 dark:border-dark-3">
                    <td className="py-3 pl-0 pr-3 text-sm font-medium text-dark dark:text-white">
                      {new Date(row.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    </td>
                    <td className="px-3 py-3 text-muted">{TYPE_DISPLAY[row.type] ?? row.type}</td>
                    <td className="px-3 py-3 text-sm font-semibold text-dark dark:text-white">
                      {row.score === null ? "-" : `${row.score}/100`}
                    </td>
                    <td className="px-3 py-3 text-muted">
                      {row.reviewer ? `${row.reviewer.firstName} ${row.reviewer.lastName}` : "-"}
                    </td>
                    <td className="px-3 py-3">
                      <span className={row.status === "COMPLETED" ? "badge-success" : "badge-warning"}>
                        {row.status === "COMPLETED" ? "Completed" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="md:col-span-4 flex flex-col gap-4">
        {scoreBars.length > 0 && (
          <div className="card-p">
            <h2 className="mb-4 section-title">Score Trend</h2>
            <div className="flex items-end gap-2 h-32">
              {scoreBars.map((r) => {
                const heightPct = ((r.score ?? 0) / maxScore) * 100;
                return (
                  <div key={r.id} className="flex flex-1 flex-col items-center gap-1">
                    <span className="text-[10px] font-medium text-dark-5 dark:text-dark-6">{r.score}</span>
                    <div className="relative w-full flex-1 flex items-end">
                      <div className="w-full rounded-t bg-primary-600" style={{ height: `${heightPct}%` }} />
                    </div>
                    <span className="text-[10px] text-dark-5 dark:text-dark-6">
                      {new Date(r.createdAt).toLocaleDateString("en-US", { month: "short" })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {reviews[0]?.comments && (
          <div className="card-p">
            <h2 className="mb-3 section-title">Latest Feedback</h2>
            <p className="text-xs text-dark-5 dark:text-dark-6 italic">&ldquo;{reviews[0].comments}&rdquo;</p>
            <p className="mt-2 text-xs text-dark-5 dark:text-dark-6">
              - {reviews[0].reviewer ? `${reviews[0].reviewer.firstName} ${reviews[0].reviewer.lastName}` : "Reviewer"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
