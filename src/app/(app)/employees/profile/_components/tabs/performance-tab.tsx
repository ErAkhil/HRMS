import type { SerializedReview } from "@/lib/actions/performance";

interface Props {
  reviews: SerializedReview[];
}

export function PerformanceTab({ reviews }: Readonly<Props>) {
  const completed = reviews.filter((r) => r.status === "COMPLETED" && r.score !== null);
  const latestScore = completed[0]?.score ?? null;

  const trendData = [...completed]
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .slice(-6);
  const maxScore = trendData.length > 0 ? Math.max(...trendData.map((r) => r.score ?? 0), 1) : 100;

  function scoreLabel(score: number) {
    if (score >= 91) return { text: "Exceptional", cls: "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-300" };
    if (score >= 81) return { text: "Excellent", cls: "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald" };
    if (score >= 71) return { text: "Good", cls: "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber" };
    return { text: "Needs Improvement", cls: "bg-rose-light text-rose-dark dark:bg-rose-dark/20 dark:text-rose" };
  }

  if (reviews.length === 0) {
    return (
      <div className="rounded-xl bg-white p-8 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 text-center">
        <p className="text-sm text-dark-5 dark:text-dark-6">No performance reviews on record.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <h2 className="mb-5 text-base font-semibold text-dark dark:text-white">Performance History</h2>

        {latestScore !== null && (
          <div className="mb-6 flex flex-wrap items-center gap-6">
            <div className="text-center">
              <p className="text-5xl font-bold text-primary-600">
                {latestScore}
                <span className="text-2xl font-normal text-dark-5 dark:text-dark-6">/100</span>
              </p>
              <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">Latest Score</p>
              <span className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${scoreLabel(latestScore).cls}`}>
                {scoreLabel(latestScore).text}
              </span>
            </div>
            <div className="flex-1 min-w-[160px]">
              <p className="mb-1 text-xs text-dark-5 dark:text-dark-6">
                Period: <span className="font-medium text-dark dark:text-white">{completed[0]?.period ?? "—"}</span>
              </p>
              <p className="text-xs text-dark-5 dark:text-dark-6">
                Reviewer:{" "}
                <span className="font-medium text-dark dark:text-white">
                  {completed[0]?.reviewer
                    ? `${completed[0].reviewer.firstName} ${completed[0].reviewer.lastName}`
                    : "—"}
                </span>
              </p>
              <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">
                Total reviews: <span className="font-medium text-dark dark:text-white">{completed.length}</span>
              </p>
            </div>
          </div>
        )}

        {trendData.length > 1 && (
          <div className="mb-6 rounded-xl border border-gray-3 p-4 dark:border-dark-3">
            <p className="mb-4 text-sm font-semibold text-dark dark:text-white">Score Trend</p>
            <div className="flex items-end justify-around gap-3 h-28">
              {trendData.map(({ id, period, score }, idx, arr) => {
                const s = score ?? 0;
                const heightPct = Math.round((s / maxScore) * 100);
                const isCurrent = idx === arr.length - 1;
                return (
                  <div key={id} className="flex flex-col items-center gap-1 flex-1">
                    <span className="text-xs font-semibold text-dark dark:text-white">{s}</span>
                    <div
                      className="w-full rounded-t-md"
                      style={{ height: `${heightPct}%`, background: isCurrent ? "#4f46e5" : "#c7d2fe" }}
                    />
                    <span className="text-[10px] text-dark-5 dark:text-dark-6 text-center leading-tight">{period}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <p className="mb-3 text-sm font-semibold text-dark dark:text-white">All Reviews</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-3 dark:border-dark-3">
                {["Period", "Type", "Score", "Reviewer", "Status"].map((h) => (
                  <th key={h} className="pb-3 text-left text-xs font-medium uppercase tracking-wide text-dark-5 dark:text-dark-6">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-3 dark:divide-dark-3">
              {reviews.map((r) => (
                <tr key={r.id}>
                  <td className="py-3 font-medium text-dark dark:text-white">{r.period}</td>
                  <td className="py-3 text-dark-5 dark:text-dark-6 capitalize">{r.type.toLowerCase().replace("_", " ")}</td>
                  <td className="py-3">
                    {r.score !== null
                      ? <span className="font-semibold text-primary-600 dark:text-primary-400">{r.score}/100</span>
                      : <span className="text-dark-5 dark:text-dark-6">—</span>}
                  </td>
                  <td className="py-3 text-dark-5 dark:text-dark-6">
                    {r.reviewer ? `${r.reviewer.firstName} ${r.reviewer.lastName}` : "—"}
                  </td>
                  <td className="py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      r.status === "COMPLETED"
                        ? "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald"
                        : "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber"
                    }`}>
                      {r.status.charAt(0) + r.status.slice(1).toLowerCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {completed.some((r) => r.comments) && (
          <div className="mt-6">
            <p className="mb-3 text-sm font-semibold text-dark dark:text-white">Reviewer Comments</p>
            <div className="space-y-3">
              {completed.filter((r) => r.comments).slice(0, 3).map((r) => (
                <div key={r.id} className="rounded-lg border border-gray-3 border-l-4 border-l-primary-600 p-4 dark:border-dark-3">
                  <p className="mb-1 text-xs font-medium text-dark-5 dark:text-dark-6">{r.period} — {r.reviewer ? `${r.reviewer.firstName} ${r.reviewer.lastName}` : "Reviewer"}</p>
                  <p className="text-sm leading-relaxed text-dark dark:text-white">{r.comments}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
