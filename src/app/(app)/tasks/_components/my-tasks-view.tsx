"use client";

import { useState, useMemo } from "react";
import { OVERDUE_TASKS, type Task, type TaskGroup } from "./tasks-data";
import { TaskRow } from "./task-row";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";

type FilterTab = "All" | "Today" | "This Week" | "Overdue";
type PriorityFilter = "All" | "High" | "Medium" | "Low";

type DbTask = {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  dueDate?: Date | null;
  project?: { name: string } | null;
  assignee?: { firstName: string; lastName: string; avatarUrl?: string | null } | null;
};

interface MyTasksViewProps {
  tasks?: DbTask[];
}

const today = new Date();
today.setHours(0, 0, 0, 0);

const weekEnd = new Date(today);
weekEnd.setDate(weekEnd.getDate() + 7);

function mapDbTaskToTask(t: DbTask): Task {
  let group: TaskGroup = "Later";
  if (t.dueDate) {
    const due = new Date(t.dueDate);
    due.setHours(0, 0, 0, 0);
    if (due.getTime() === today.getTime()) group = "Today";
    else if (due < weekEnd) group = "This Week";
  }

  const priorityMap: Record<string, Task["priority"]> = {
    HIGH: "High",
    MEDIUM: "Medium",
    LOW: "Low",
  };

  return {
    id: t.id,
    title: t.title,
    project: t.project?.name ?? "General",
    projectColor: "indigo",
    priority: priorityMap[t.priority] ?? "Medium",
    dueDate: t.dueDate
      ? new Date(t.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : "No due date",
    avatar: t.assignee?.avatarUrl ?? "/images/user/user-01.png",
    group,
  };
}

export function MyTasksView({ tasks: dbTasks }: MyTasksViewProps) {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [filterTab, setFilterTab] = useState<FilterTab>("All");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("All");
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const { toast, setToast } = useToast();

  function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    setShowNewTaskModal(false);
    setToast("Task created successfully!");
  }

  function toggleComplete(id: string) {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const allTasks = useMemo<Task[]>(() => {
    if (dbTasks && dbTasks.length > 0) {
      return dbTasks
        .filter((t) => t.status !== "DONE")
        .map(mapDbTaskToTask);
    }
    // Fallback to static data when no DB tasks
    return [];
  }, [dbTasks]);

  const overdueTasksList = useMemo<Task[]>(() => {
    if (dbTasks && dbTasks.length > 0) {
      return dbTasks
        .filter((t) => {
          if (!t.dueDate || t.status === "DONE") return false;
          const due = new Date(t.dueDate);
          due.setHours(0, 0, 0, 0);
          return due < today;
        })
        .map(mapDbTaskToTask);
    }
    return OVERDUE_TASKS;
  }, [dbTasks]);

  const totalCount = allTasks.length + overdueTasksList.length;

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

  const overdueFiltered = overdueTasksList.filter(
    (t) => priorityFilter === "All" || t.priority === priorityFilter,
  );

  const groups: TaskGroup[] = ["Today", "This Week", "Later"];

  const tasksForGroup = (group: TaskGroup) =>
    filtered.filter((t) => t.group === group);

  const showOverdue = filterTab === "All" || filterTab === "Overdue";
  const showGroups = filterTab !== "Overdue";

  const completedCount = completed.size;

  const stats = [
    { label: "Today", value: allTasks.filter((t) => t.group === "Today").length, color: "text-primary-600 dark:text-primary-300" },
    { label: "This Week", value: allTasks.filter((t) => t.group === "This Week").length, color: "text-primary-600 dark:text-primary-300" },
    { label: "Overdue", value: overdueTasksList.length, color: "text-rose-dark" },
    { label: "Completed", value: completedCount, color: "text-emerald-dark dark:text-emerald" },
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
            {totalCount} tasks
          </span>
        </div>
        <button
          onClick={() => setShowNewTaskModal(true)}
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
        >
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

      {/* Empty state */}
      {showGroups && filtered.length === 0 && overdueFiltered.length === 0 && (
        <div className="rounded-xl bg-white p-12 text-center shadow-card dark:border dark:border-dark-3 dark:bg-dark-2">
          <p className="text-sm font-medium text-dark dark:text-white">No tasks found</p>
          <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">
            {filterTab !== "All" ? "Try switching to the All tab." : "Create a new task to get started."}
          </p>
        </div>
      )}

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

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-modal dark:bg-dark-2">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-dark dark:text-white">New Task</h2>
              <button
                onClick={() => setShowNewTaskModal(false)}
                className="flex size-8 items-center justify-center rounded-lg text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3"
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-dark-5 dark:text-dark-6 mb-1">
                  Task Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter task title"
                  className="w-full rounded-lg border border-gray-3 bg-white px-3 py-2 text-sm text-dark outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-dark-5 dark:text-dark-6 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the task..."
                  className="w-full rounded-lg border border-gray-3 bg-white px-3 py-2 text-sm text-dark outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-dark-5 dark:text-dark-6 mb-1">
                    Priority
                  </label>
                  <select className="w-full rounded-lg border border-gray-3 bg-white px-3 py-2 text-sm text-dark outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white">
                    <option value="">Select priority</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-dark-5 dark:text-dark-6 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-gray-3 bg-white px-3 py-2 text-sm text-dark outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="rounded-lg border border-gray-3 px-4 py-2 text-sm font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Toast message={toast} />
    </div>
  );
}
