export type FilterTab = "All" | "Today" | "This Week" | "Overdue";
export type PriorityFilter = "All" | "High" | "Medium" | "Low";

interface Props {
  filterTab: FilterTab;
  setFilterTab: (t: FilterTab) => void;
  priorityFilter: PriorityFilter;
  setPriorityFilter: (p: PriorityFilter) => void;
}

export function TasksFilterBar({ filterTab, setFilterTab, priorityFilter, setPriorityFilter }: Readonly<Props>) {
  return (
    <div className="card flex flex-wrap items-center justify-between gap-3 p-3">
      <div className="flex gap-1">
        {(["All", "Today", "This Week", "Overdue"] as FilterTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setFilterTab(t)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              filterTab === t
                ? "bg-primary-600 text-white"
                : "text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <select
        value={priorityFilter}
        onChange={(e) => setPriorityFilter(e.target.value as PriorityFilter)}
        className="h-9 rounded-lg border border-gray-3 bg-gray-2 px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
      >
        <option value="All">All Priorities</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
    </div>
  );
}
