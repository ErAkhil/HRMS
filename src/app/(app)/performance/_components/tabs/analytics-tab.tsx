import Link from "next/link";
import { ANALYTICS_METRICS, SCORE_DIST, ATTENTION_EMPLOYEES } from "../performance-data";

export function AnalyticsTab() {
  const maxCount = 7;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-dark dark:text-white">Performance Analytics</h2>
        <Link href="/performance/analytics" className="btn-primary">Full Analytics →</Link>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {ANALYTICS_METRICS.map((m) => (
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
            <div className="flex items-end gap-4 h-36">
              {SCORE_DIST.map((d) => {
                const heightPct = (d.count / maxCount) * 100;
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
            <p className="mt-3 text-muted">12 employees &middot; Q2 2026</p>
          </div>
        </div>

        <div className="md:col-span-6">
          <div className="card-p">
            <h3 className="mb-4 section-title">Employees Needing Attention</h3>
            <p className="mb-3 text-muted">Below 75 performance score</p>
            <div className="space-y-4">
              {ATTENTION_EMPLOYEES.map((emp) => (
                <div key={emp.name} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-dark dark:text-white">{emp.name}</p>
                    <p className="text-muted">{emp.dept} &middot; {emp.score}/100</p>
                  </div>
                  <span className={`flex-shrink-0 ${emp.badge}`}>{emp.note}</span>
                </div>
              ))}
            </div>
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
