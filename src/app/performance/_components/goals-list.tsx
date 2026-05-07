const GOALS = [
  {
    id: 1,
    title: "Complete Q2 Workforce Analytics",
    category: "Business",
    progress: 68,
    dueDate: "Jun 30, 2026",
    owner: "John Smith",
    status: "On Track",
  },
  {
    id: 2,
    title: "Reduce Time-to-Hire by 15%",
    category: "Business",
    progress: 45,
    dueDate: "Jun 30, 2026",
    owner: "Sarah Johnson",
    status: "At Risk",
  },
  {
    id: 3,
    title: "Complete Leadership Training",
    category: "Personal",
    progress: 100,
    dueDate: "Apr 30, 2026",
    owner: "John Smith",
    status: "Completed",
  },
  {
    id: 4,
    title: "Improve Team Satisfaction to 90%",
    category: "Team",
    progress: 72,
    dueDate: "Jun 30, 2026",
    owner: "Mike Chen",
    status: "On Track",
  },
  {
    id: 5,
    title: "Implement New HRIS System",
    category: "Business",
    progress: 30,
    dueDate: "Sep 30, 2026",
    owner: "Priya Patel",
    status: "At Risk",
  },
  {
    id: 6,
    title: "Mentor 2 Junior HR Analysts",
    category: "Personal",
    progress: 50,
    dueDate: "Aug 31, 2026",
    owner: "John Smith",
    status: "On Track",
  },
  {
    id: 7,
    title: "Reduce Attrition Rate to < 8%",
    category: "Business",
    progress: 85,
    dueDate: "Dec 31, 2026",
    owner: "Amanda Ross",
    status: "On Track",
  },
  {
    id: 8,
    title: "Launch Employee Wellness Program",
    category: "Team",
    progress: 20,
    dueDate: "Jul 31, 2026",
    owner: "David Kim",
    status: "Not Started",
  },
];

const categoryColors: Record<string, string> = {
  Business: "rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300",
  Personal: "rounded-full bg-violet-light px-2.5 py-0.5 text-xs font-medium text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300",
  Team: "rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
};

const statusConfig: Record<string, { badge: string; bar: string }> = {
  "On Track": {
    badge: "rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
    bar: "bg-emerald-500",
  },
  "At Risk": {
    badge: "rounded-full bg-amber-light px-2.5 py-0.5 text-xs font-medium text-amber-dark",
    bar: "bg-amber-500",
  },
  Completed: {
    badge: "rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300",
    bar: "bg-indigo-500",
  },
  "Not Started": {
    badge: "rounded-full bg-rose-light px-2.5 py-0.5 text-xs font-medium text-rose-dark",
    bar: "bg-gray-300",
  },
};

export function GoalsList() {
  return (
    <div className="space-y-3">
      {GOALS.map((goal) => {
        const sc = statusConfig[goal.status] ?? statusConfig["On Track"];
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
                  <span className={categoryColors[goal.category]}>{goal.category}</span>
                  <span className={sc.badge}>{goal.status}</span>
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
              <div className="flex flex-col items-start sm:items-end gap-1 text-xs text-dark-5 dark:text-dark-6 flex-shrink-0 sm:ml-4">
                <span>Due {goal.dueDate}</span>
                <span>Owner: {goal.owner}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
