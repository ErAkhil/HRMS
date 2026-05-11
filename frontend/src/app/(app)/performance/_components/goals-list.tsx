import type { SerializedGoal } from "@/lib/actions/performance";

interface GoalsListProps {
  goals: SerializedGoal[];
}


const statusConfig: Record<string, { badge: string; bar: string; label: string }> = {
  COMPLETED: {
    badge: "rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-600 dark:bg-primary-900/20 dark:text-primary-300",
    bar: "bg-primary-500",
    label: "Completed",
  },
  IN_PROGRESS: {
    badge: "rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
    bar: "bg-emerald-500",
    label: "In Progress",
  },
  NOT_STARTED: {
    badge: "rounded-full bg-rose-light px-2.5 py-0.5 text-xs font-medium text-rose-dark",
    bar: "bg-gray-300",
    label: "Not Started",
  },
  AT_RISK: {
    badge: "rounded-full bg-amber-light px-2.5 py-0.5 text-xs font-medium text-amber-dark",
    bar: "bg-amber-500",
    label: "At Risk",
  },
};

function getStatusConfig(status: string) {
  return statusConfig[status] ?? statusConfig.IN_PROGRESS;
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function GoalsList({ goals }: Readonly<GoalsListProps>) {
  if (goals.length === 0) {
    return (
      <div className="rounded-xl bg-white p-12 text-center shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <p className="text-sm font-medium text-dark dark:text-white">No goals yet</p>
        <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">Set your first goal to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
      {goals.map((goal) => {
        const sc = getStatusConfig(goal.status);
        return (
          <div
            key={goal.id}
            className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="text-sm font-semibold text-dark dark:text-white">
                    {goal.title}
                  </h3>
                  <span className={sc.badge}>{sc.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 overflow-hidden rounded-full bg-gray-2 dark:bg-dark-3">
                    <div
                      className={`h-full rounded-full ${sc.bar} transition-all`}
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-dark dark:text-white w-10 text-right">
                    {goal.progress}%
                  </span>
                </div>
              </div>
              {goal.dueDate && (
                <div className="flex flex-col items-start sm:items-end gap-1 text-xs text-dark-5 dark:text-dark-6 flex-shrink-0 sm:ml-4">
                  <span>Due {formatDate(goal.dueDate)}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
