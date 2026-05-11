import type { SerializedProject } from "@/lib/actions/tasks";

type TasksProgressChartProps = {
  projects: SerializedProject[];
};

const PROJECT_BAR_COLORS = ["bg-primary-600", "bg-violet-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500", "bg-sky-500"];

export function TasksProgressChart({ projects }: TasksProgressChartProps) {
  if (projects.length === 0) {
    return (
      <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <h2 className="font-semibold text-dark dark:text-white mb-4">Project Progress</h2>
        <p className="text-sm text-dark-5 dark:text-dark-6 py-4">No projects yet. Create a project to track progress.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="font-semibold text-dark dark:text-white">Project Progress</h2>
          <p className="text-xs text-dark-5 dark:text-dark-6">{projects.length} active project{projects.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="space-y-3">
        {projects.slice(0, 5).map((proj, i) => (
          <div key={proj.id}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium text-dark dark:text-white truncate mr-2">{proj.name}</span>
              <span className="shrink-0 text-xs text-dark-5 dark:text-dark-6">{proj.doneTasks}/{proj.totalTasks} tasks · {proj.progress}%</span>
            </div>
            <div className="relative h-1.5 rounded-full bg-gray-2 dark:bg-dark-3 overflow-hidden">
              <div
                className={`absolute inset-y-0 left-0 rounded-full ${PROJECT_BAR_COLORS[i % PROJECT_BAR_COLORS.length]}`}
                style={{ width: `${proj.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
