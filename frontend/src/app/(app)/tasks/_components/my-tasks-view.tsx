"use client";

import { useState, useMemo } from "react";
import { type Task, type TaskGroup } from "./tasks-data";
import { TaskRow } from "./task-row";
import { TasksFilterBar, type FilterTab, type PriorityFilter } from "./tasks-filter-bar";
import type { SerializedTask } from "@/lib/actions/tasks";

interface MyTasksViewProps {
  tasks: SerializedTask[];
}

const today = new Date();
today.setHours(0, 0, 0, 0);

const weekEnd = new Date(today);
weekEnd.setDate(weekEnd.getDate() + 7);

function mapDbTaskToTask(t: SerializedTask): Task {
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

  function toggleComplete(id: string) {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const allTasks = useMemo<Task[]>(() => {
    return dbTasks.filter((t) => t.status !== "DONE").map(mapDbTaskToTask);
  }, [dbTasks]);

  const overdueTasksList = useMemo<Task[]>(() => {
    return dbTasks
      .filter((t) => {
        if (!t.dueDate || t.status === "DONE") return false;
        const due = new Date(t.dueDate);
        due.setHours(0, 0, 0, 0);
        return due < today;
      })
      .map(mapDbTaskToTask);
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

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <TasksFilterBar
        filterTab={filterTab}
        setFilterTab={setFilterTab}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
      />

      {/* Overdue section */}
      {showOverdue && overdueFiltered.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 border-b border-gray-3 px-5 py-3 dark:border-dark-3">
            <span className="size-2 rounded-full bg-rose-dark" />
            <h2 className="section-title text-rose-dark">
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
              className="card"
            >
              <div className="flex items-center justify-between border-b border-gray-3 px-5 py-3 dark:border-dark-3">
                <h2 className="section-title">
                  {group}
                </h2>
                <span className="text-muted">
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
        <div className="card empty-state">
          <p className="text-body-medium">No tasks found</p>
          <p className="empty-state-text">
            {filterTab !== "All" ? "Try switching to the All tab." : "Create a new task to get started."}
          </p>
        </div>
      )}

      {/* Overdue-only view */}
      {!showGroups && (
        <div className="card">
          <div className="flex items-center gap-2 border-b border-gray-3 px-5 py-3 dark:border-dark-3">
            <span className="size-2 rounded-full bg-rose-dark" />
            <h2 className="section-title text-rose-dark">
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
