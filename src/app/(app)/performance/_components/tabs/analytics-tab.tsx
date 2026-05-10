import Link from "next/link";
import type { TeamPerformanceSummary } from "@/lib/actions/performance";

interface Props {
  teamData: TeamPerformanceSummary | null;
}

export function AnalyticsTab({ teamData }: Readonly<Props>) {
  if (!teamData) {
    return (
      <div className="card-p py-10 text-center">
        <p className="text-sm text-dark-5 dark:text-dark-6">Analytics data unavailable.</p>
      </div>
    );
  }

  const maxDistCount = Math.max(...teamData.distribution.map((d) => d.count), 1);

  const metrics = [
    { label: "Team Avg Score", value: teamData.avgScore > 0 ? String(teamData.avgScore) : "—", sub: `${teamData.topPerformers.length} scored`, color: "text-primary-600" },
    { label: "On-Track Goals", value: `${teamData.onTrackGoals}/${teamData.totalGoals}`, sub: teamData.totalGoals > 0 ? `${Math.round((teamData.onTrackGoals / teamData.totalGoals) * 100)}% on track` : "No goals yet", color: "text-emerald-600" },
    { label: "Reviews Done", value: String(teamData.completedReviews), sub: `of ${teamData.totalReviews} total`, color: "text-violet-600" },
    { label: "Need Attention", value: String(teamData.attentionEmployees.length), sub: "score < 75", color: "text-amber-600" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-dark dark:text-white">Performance Analytics</h2>
        <Link href="/performance/analytics" className="btn-primary">Full Analytics →</Link>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="card-p">
            <p className="text-muted">{m.label}</p>
            <p className={`mt-2 text-2xl font-bold ${m.color}`}>{m.value}</p>
            <p className="mt-1 text-muted">{m.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
        <div className="md:col-span-6">
          <div className="card-p">
            <h3 className="mb-4 section-title">Score Distribution</h3>
            {teamData.distribution.every((d) => d.count === 0) ? (
              <p className="text-sm text-dark-5 dark:text-dark-6">No completed reviews to display.</p>
            ) : (
              <>
                <div className="flex items-end gap-4 h-36">
                  {teamData.distribution.map((d) => {
                    const heightPct = (d.count / maxDistCount) * 100;
                    return (
                      <div key={d.bucket} className="flex flex-1 flex-col items-center gap-1">
                        <span className="text-xs font-semibold text-dark dark:text-white">{d.count}</span>
                        <div className="relative w-full flex-1 flex items-end">
                          <div className="w-full rounded-t bg-primary-500" style={{ height: `${heightPct}%` }} />
                        </div>
                        <span className="text-[10px] text-dark-5 dark:text-dark-6 text-center">{d.bucket}</span>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-3 text-muted">{teamData.completedReviews} completed reviews</p>
              </>
            )}
          </div>
        </div>

        <div className="md:col-span-6">
          <div className="card-p">
            <h3 className="mb-4 section-title">Employees Needing Attention</h3>
            <p className="mb-3 text-muted">Below 75 performance score</p>
            {teamData.attentionEmployees.length === 0 ? (
              <p className="text-sm text-emerald-600 dark:text-emerald font-medium">All employees are performing well!</p>
            ) : (
              <div className="space-y-4">
                {teamData.attentionEmployees.map((emp) => (
                  <div key={emp.name} className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-dark dark:text-white">{emp.name}</p>
                      <p className="text-muted">{emp.dept} &middot; {emp.score}/100</p>
                    </div>
                    <span className="badge-warning flex-shrink-0">Below avg</span>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 border-t border-gray-3 pt-4 dark:border-dark-3">
              <Link href="/performance/analytics" className="text-xs font-medium text-primary-600 hover:underline dark:text-primary-400">
                View full analytics report →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
