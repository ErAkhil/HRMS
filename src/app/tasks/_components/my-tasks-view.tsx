"use client";

import { useState } from "react";
import { TASKS, OVERDUE_TASKS, type TaskGroup } from "./tasks-data";
import { TaskRow } from "./task-row";

type FilterTab = "All" | "Today" | "This Week" | "Overdue";
type PriorityFilter = "All" | "High" | "Medium" | "Low";

export function MyTasksView() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [filterTab, setFilterTab] = useState<FilterTab>("All");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("All");

  function toggleComplete(id: string) {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const allTasks = [...TASKS];

  const filtered = allTasks.filter((t) => {
    const matchTab =
      filterTab === "All" ||
      (filterTab === "Today" && t.group === "Today") ||
      (filterTab === "This Week" && t.group === "This Week") ||
      filterTab === "Overdue";
    const matchPriority =
      priorityFilter === "All" || t.priority === priorityFilter;
    return matchTab && matchPriority;
  });

  const overdueFiltered = OVERDUE_TASKS.filter(
    (t) => priorityFilter === "All" || t.priority === priorityFilter,
  );

  const groups: TaskGroup[] = ["Today", "This Week", "Later"];

  const tasksForGroup = (group: TaskGroup) =>
    filtered.filter((t) => t.group === group);

  const showOverdue = filterTab === "All" || filterTab === "Overdue";
  const showGroups = filterTab !== "Overdue";

  const completedCount = completed.size;

  const stats = [
    { label: "Today", value: 4, color: "text-primary-600 dark:text-primary-300" },
    { label: "This Week", value: 8, color: "text-indigo-600 dark:text-indigo-300" },
    { label: "Overdue", value: 3, color: "text-rose-dark" },
    { label: "Completed", value: completedCount + 12, color: "text-emerald-dark dark:text-emerald" },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-dark dark:text-white">
            My Tasks
          </h1>
          <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-dark dark:bg-sky-dark/10 dark:text-sky">
            18 tasks
          </span>
        </div>
        <button className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700">
          + New Task
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl bg-white p-5 shadow-card dark:border dark:border-dark-3 dark:bg-dark-2"
          >
            <p className="text-xs text-dark-5 dark:text-dark-6">{s.label}</p>
            <p className={`mt-1 text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-3 shadow-card dark:border dark:border-dark-3 dark:bg-dark-2">
        <div className="flex gap-1">
          {(["All", "Today", "This Week", "Overdue"] as FilterTab[]).map(
            (t) => (
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
            ),
          )}
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

      {/* Overdue section */}
      {showOverdue && overdueFiltered.length > 0 && (
        <div className="rounded-xl bg-white shadow-card dark:border dark:border-dark-3 dark:bg-dark-2">
          <div className="flex items-center gap-2 border-b border-gray-3 px-5 py-3 dark:border-dark-3">
            <span className="size-2 rounded-full bg-rose-dark" />
            <h2 className="text-sm font-semibold text-rose-dark">
              Overdue ({overdueFiltered.length})
            </h2>
          </div>
          <div className="p-3">
            {overdueFiltered.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                completed={completed.has(task.id)}
                onToggle={toggleComplete}
                overdue
              />
            ))}
          </div>
        </div>
      )}

      {/* Grouped task lists */}
      {showGroups &&
        groups.map((group) => {
          const groupTasks = tasksForGroup(group);
          if (groupTasks.length === 0) return null;
          return (
            <div
              key={group}
              className="rounded-xl bg-white shadow-card dark:border dark:border-dark-3 dark:bg-dark-2"
            >
              <div className="flex items-center justify-between border-b border-gray-3 px-5 py-3 dark:border-dark-3">
                <h2 className="text-sm font-semibold text-dark dark:text-white">
                  {group}
                </h2>
                <span className="text-xs text-dark-5 dark:text-dark-6">
                  {groupTasks.length} tasks
                </span>
              </div>
              <div className="p-3">
                {groupTasks.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    completed={completed.has(task.id)}
                    onToggle={toggleComplete}
                  />
                ))}
              </div>
            </div>
          );
        })}

      {/* Overdue-only view */}
      {!showGroups && (
        <div className="rounded-xl bg-white shadow-card dark:border dark:border-dark-3 dark:bg-dark-2">
          <div className="flex items-center gap-2 border-b border-gray-3 px-5 py-3 dark:border-dark-3">
            <span className="size-2 rounded-full bg-rose-dark" />
            <h2 className="text-sm font-semibold text-rose-dark">
              Overdue ({overdueFiltered.length})
            </h2>
          </div>
          <div className="p-3">
            {overdueFiltered.length > 0 ? (
              overdueFiltered.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  completed={completed.has(task.id)}
                  onToggle={toggleComplete}
                  overdue
                />
              ))
            ) : (
              <p className="py-6 text-center text-sm text-dark-5 dark:text-dark-6">
                No overdue tasks!
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
