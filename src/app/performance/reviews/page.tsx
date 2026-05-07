export const metadata = { title: "Performance Reviews" };

const PAST_CYCLES = [
  { cycle: "Q1 2026", period: "Feb 1 – Feb 28", participants: 242, avgScore: 84.1, status: "Completed" },
  { cycle: "Q4 2025", period: "Nov 1 – Nov 30", participants: 238, avgScore: 82.7, status: "Completed" },
  { cycle: "Q3 2025", period: "Aug 1 – Aug 31", participants: 230, avgScore: 81.3, status: "Completed" },
  { cycle: "Q2 2025", period: "May 1 – May 31", participants: 225, avgScore: 79.8, status: "Completed" },
];

export default function ReviewsPage() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-dark dark:text-white">Performance Reviews</h1>
          <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">
            Manage review cycles and track submission progress
          </p>
        </div>
        <button className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700">
          + New Review Cycle
        </button>
      </div>

      {/* Active Cycle */}
      <div
        className="rounded-xl p-6 text-white"
        style={{ background: "linear-gradient(135deg, #4F46E5, #8B5CF6)" }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white">
                Active
              </span>
            </div>
            <h2 className="text-xl font-bold text-white">Q2 2026 Performance Review</h2>
            <p className="mt-1 text-sm text-white/70">May 1 – May 31, 2026</p>
          </div>
          <button className="self-start rounded-lg bg-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/30 backdrop-blur-sm">
            View My Review
          </button>
        </div>

        {/* Overall progress */}
        <div className="mt-4">
          <div className="flex justify-between mb-1.5">
            <span className="text-sm text-white/80">Overall Submissions</span>
            <span className="text-sm font-bold text-white">68%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/20">
            <div className="h-full rounded-full bg-white" style={{ width: "68%" }} />
          </div>
        </div>

        {/* Breakdown */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          {[
            { label: "Self Review", value: 82 },
            { label: "Manager Review", value: 54 },
            { label: "Peer Review", value: 67 },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-white/70">{item.label}</span>
                <span className="text-xs font-semibold text-white">{item.value}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-white/80"
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past Cycles */}
      <div className="rounded-xl bg-white shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <div className="border-b border-gray-3 dark:border-dark-3 px-5 py-4">
          <h2 className="text-sm font-semibold text-dark dark:text-white">Past Review Cycles</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-1 dark:bg-dark-3">
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Cycle</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Period</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Participants</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Avg Score</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {PAST_CYCLES.map((cycle) => (
                <tr
                  key={cycle.cycle}
                  className="border-b border-gray-3 dark:border-dark-3 hover:bg-gray-1 dark:hover:bg-dark-3"
                >
                  <td className="px-5 py-3.5 font-medium text-dark dark:text-white">{cycle.cycle}</td>
                  <td className="px-5 py-3.5 text-dark-5 dark:text-dark-6">{cycle.period}</td>
                  <td className="px-5 py-3.5 text-dark dark:text-white">{cycle.participants}</td>
                  <td className="px-5 py-3.5">
                    <span className="font-semibold text-dark dark:text-white">{cycle.avgScore}</span>
                    <span className="text-dark-5 dark:text-dark-6">/100</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald">
                      {cycle.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button className="rounded-lg border border-gray-3 px-3 py-1 text-xs font-medium text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6">
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
