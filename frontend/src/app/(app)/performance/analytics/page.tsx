import type { PerformanceAnalytics } from "@/lib/actions/performance";
import { getPerformanceAnalytics } from "@/lib/actions/performance";
import Image from "next/image";

export const metadata = { title: "Performance Analytics" };

type Department = PerformanceAnalytics["departments"][number];
type DistributionItem = PerformanceAnalytics["distribution"][number];
type TopPerformer = PerformanceAnalytics["topPerformers"][number];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function PageHeader({ reviewedCount, companyAvg }: Readonly<{ reviewedCount: number; companyAvg: number }>) {
  return (
    <div>
      <h1 className="text-xl font-bold text-dark dark:text-white">Performance Analytics</h1>
      <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">
        Based on {reviewedCount} completed review{reviewedCount === 1 ? "" : "s"} · Company average: {companyAvg > 0 ? companyAvg : "—"}
      </p>
    </div>
  );
}

function AIInsightCard({ leadingDept, companyAvg }: Readonly<{ leadingDept: Department; companyAvg: number }>) {
  return (
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
            {leadingDept.name} leads performance with an average score of {leadingDept.avgScore}
            {companyAvg > 0 && ` — ${(leadingDept.avgScore - companyAvg).toFixed(1)} points above the company average of ${companyAvg}`}.
            Top performer: {leadingDept.topPerformer}.
          </p>
        </div>
      </div>
    </div>
  );
}

function EmptyAnalyticsState() {
  return (
    <div className="rounded-xl bg-white p-12 text-center shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
      <p className="text-sm font-medium text-dark dark:text-white">No completed performance reviews yet</p>
      <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">Analytics will appear once reviews are scored and completed.</p>
    </div>
  );
}

function DepartmentComparisonTable({ departments }: Readonly<{ departments: readonly Department[] }>) {
  return (
    <div className="rounded-xl bg-white shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
      <div className="border-b border-gray-3 dark:border-dark-3 px-5 py-4">
        <h2 className="text-sm font-semibold text-dark dark:text-white">Department Comparison</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-1 dark:bg-dark-3">
              <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Department</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Reviewed</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Avg Score</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Top Performer</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr
                key={dept.name}
                className="border-b border-gray-3 dark:border-dark-3 hover:bg-gray-1 dark:hover:bg-dark-3"
              >
                <td className="px-5 py-3.5 font-medium text-dark dark:text-white">{dept.name}</td>
                <td className="px-5 py-3.5 text-dark-5 dark:text-dark-6">{dept.headcount}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 overflow-hidden rounded-full bg-gray-2 dark:bg-dark-3">
                      <div className="h-full rounded-full bg-primary-500" style={{ width: `${dept.avgScore}%` }} />
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
  );
}

function PerformanceDistributionCard({ distribution }: Readonly<{ distribution: readonly DistributionItem[] }>) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
      <h2 className="text-sm font-semibold text-dark dark:text-white mb-4">Performance Distribution</h2>
      <div className="space-y-3">
        {distribution.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-dark dark:text-white">{item.label}</span>
                <span className="text-xs text-dark-5 dark:text-dark-6">({item.range})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-dark-5 dark:text-dark-6">{item.count} employee{item.count === 1 ? "" : "s"}</span>
                <span className="text-xs font-semibold text-dark dark:text-white w-8 text-right">{item.pct}%</span>
              </div>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-2 dark:bg-dark-3">
              <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopPerformersCard({ topPerformers }: Readonly<{ topPerformers: readonly TopPerformer[] }>) {
  if (topPerformers.length === 0) return null;

  return (
    <div className="rounded-xl bg-white shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
      <div className="border-b border-gray-3 dark:border-dark-3 px-5 py-4">
        <h2 className="text-sm font-semibold text-dark dark:text-white">Top Performers</h2>
      </div>
      <div className="divide-y divide-gray-3 dark:divide-dark-3">
        {topPerformers.map((emp, idx) => {
          const initials = getInitials(emp.name);

          return (
            <div key={emp.id} className="flex items-center justify-between px-5 py-4 hover:bg-gray-1 dark:hover:bg-dark-3">
              <div className="flex items-center gap-3">
                <span className="w-6 text-center text-sm font-bold text-dark-5 dark:text-dark-6">{idx + 1}</span>
                <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-primary-100 text-sm font-bold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                  {emp.avatarUrl ? (
                    <Image
                      src={emp.avatarUrl}
                      alt={emp.name}
                      width={36}
                      height={36}
                      className="h-full w-full object-cover"
                    />
                  ) : initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-dark dark:text-white">{emp.name}</p>
                  <p className="text-xs text-dark-5 dark:text-dark-6">{emp.dept}</p>
                </div>
              </div>
              <span className="text-lg font-bold text-dark dark:text-white">{emp.score}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default async function PerformanceAnalyticsPage() {
  const data = await getPerformanceAnalytics().catch(() => null);

  const departments = data?.departments ?? [];
  const distribution = data?.distribution ?? [];
  const topPerformers = data?.topPerformers ?? [];
  const companyAvg = data?.companyAvg ?? 0;
  const reviewedCount = data?.reviewedCount ?? 0;
  const leadingDept = departments[0];

  return (
    <div className="space-y-5">
      <PageHeader reviewedCount={reviewedCount} companyAvg={companyAvg} />

      {leadingDept && <AIInsightCard leadingDept={leadingDept} companyAvg={companyAvg} />}

      {reviewedCount === 0 ? (
        <EmptyAnalyticsState />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <DepartmentComparisonTable departments={departments} />
            <PerformanceDistributionCard distribution={distribution} />
          </div>

          <TopPerformersCard topPerformers={topPerformers} />
        </>
      )}
    </div>
  );
}
