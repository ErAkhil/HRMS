import { weekBars, maxDone, projectProgress } from "../_data/tasks-data";

export function TasksProgressChart() {
  return (
    <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="font-semibold text-dark dark:text-white">Task Progress This Week</h2>
          <p className="text-xs text-dark-5 dark:text-dark-6">May 5–11, 2026</p>
        </div>
      </div>

      <div className="flex items-end justify-around gap-1.5 h-32 mb-5">
        {weekBars.map((bar, i) => {
          const height = Math.round((bar.done / maxDone) * 96);
          return (
            <div key={i} className="flex flex-col items-center gap-1 flex-1">
              <span className="text-[10px] font-bold text-dark-5 dark:text-dark-6">{bar.done}</span>
              <div
                className={`w-full rounded-t-sm ${bar.today ? "bg-primary-600" : "bg-primary-200 dark:bg-primary-900/40"}`}
                style={{ height: `${height}px` }}
              />
              <span className="text-[10px] text-dark-5 dark:text-dark-6">{bar.day}</span>
            </div>
          );
        })}
      </div>

      <div className="space-y-3 border-t border-gray-2 dark:border-dark-3 pt-4">
        {projectProgress.map((proj) => (
          <div key={proj.name}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium text-dark dark:text-white">{proj.name}</span>
              <span className="text-xs text-dark-5 dark:text-dark-6">{proj.done}/{proj.total} tasks · {proj.pct}%</span>
            </div>
            <div className="relative h-1.5 rounded-full bg-gray-2 dark:bg-dark-3 overflow-hidden">
              <div className={`absolute inset-y-0 left-0 rounded-full ${proj.bar}`} style={{ width: `${proj.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
