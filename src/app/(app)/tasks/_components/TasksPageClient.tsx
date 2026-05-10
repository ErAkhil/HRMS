"use client";

import { useState } from "react";
import Link from "next/link";
import { MyTasksView } from "./my-tasks-view";
import { TasksProgressChart } from "./tasks-progress-chart";
import { TasksTeamWorkload } from "./tasks-team-workload";
import { TasksQuickLinks } from "./tasks-quick-links";
import { NewTaskModal } from "./new-task-modal";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";

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

interface TasksPageClientProps {
  tasks: DbTask[];
}

export function TasksPageClient({ tasks }: TasksPageClientProps) {
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const { toast, setToast } = useToast();

  function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    setShowNewTaskModal(false);
    setToast("Task created successfully!");
  }

  const totalAssigned = tasks.length;
  const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  const overdue = tasks.filter((t) => {
    if (!t.dueDate || t.status === "DONE") return false;
    const due = new Date(t.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < todayDate;
  }).length;

  const kpis = [
    {
      label: "Total Assigned",
      value: String(totalAssigned),
      sub: `across ${new Set(tasks.map((t) => t.project?.name).filter(Boolean)).size || 0} projects`,
      iconColor: "text-indigo-600 dark:text-indigo-300",
    },
    {
      label: "Completed",
      value: String(tasks.filter((t) => t.status === "DONE").length),
      sub: "tasks done",
      iconColor: "text-emerald-dark dark:text-emerald",
    },
    {
      label: "In Progress",
      value: String(inProgress),
      sub: "actively worked on",
      iconColor: "text-violet-dark dark:text-violet-300",
    },
    {
      label: "Overdue",
      value: String(overdue),
      sub: overdue > 0 ? "Needs attention" : "All on track",
      iconColor: "text-rose-dark dark:text-rose",
    },
  ];

  const highCount = tasks.filter((t) => t.priority === "HIGH").length;
  const mediumCount = tasks.filter((t) => t.priority === "MEDIUM").length;
  const lowCount = tasks.filter((t) => t.priority === "LOW").length;
  const totalForPriority = highCount + mediumCount + lowCount || 1;

  const priorities = [
    { label: "High Priority", count: highCount, pct: Math.round((highCount / totalForPriority) * 100), dot: "bg-rose-500" },
    { label: "Medium Priority", count: mediumCount, pct: Math.round((mediumCount / totalForPriority) * 100), dot: "bg-amber-500" },
    { label: "Low Priority", count: lowCount, pct: Math.round((lowCount / totalForPriority) * 100), dot: "bg-indigo-500" },
  ];

  const upcomingDeadlines = tasks
    .filter((t) => t.dueDate && t.status !== "DONE")
    .sort((a, b) => (a.dueDate as Date).getTime() - (b.dueDate as Date).getTime())
    .slice(0, 4)
    .map((t) => {
      const due = new Date(t.dueDate as Date);
      due.setHours(0, 0, 0, 0);
      const diffDays = Math.round((due.getTime() - todayDate.getTime()) / 86400000);
      let dueLabel: string;
      let badgeClass: string;
      let dot: string;
      if (diffDays < 0) {
        dueLabel = "Overdue";
        badgeClass = "bg-rose-light text-rose-dark dark:bg-rose-dark/20 dark:text-rose";
        dot = "bg-rose-500";
      } else if (diffDays === 0) {
        dueLabel = "Due Today";
        badgeClass = "bg-rose-light text-rose-dark dark:bg-rose-dark/20 dark:text-rose";
        dot = "bg-rose-500";
      } else if (diffDays === 1) {
        dueLabel = "Due Tomorrow";
        badgeClass = "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber";
        dot = "bg-amber-500";
      } else {
        dueLabel = `Due ${due.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
        badgeClass = "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300";
        dot = "bg-indigo-500";
      }
      return { task: t.title, project: t.project?.name ?? "General", due: dueLabel, badgeClass, dot };
    });

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-1 text-sm text-dark-5 dark:text-dark-6">
            <Link href="/" className="hover:text-indigo-600">Dashboard</Link>
            <span className="mx-1">/</span>
            <span>Tasks</span>
          </p>
          <h1 className="text-2xl font-bold text-dark dark:text-white">My Tasks</h1>
          <p className="mt-0.5 text-sm text-dark-5 dark:text-dark-6">Track and manage your work</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/tasks/projects"
            className="rounded-lg border border-gray-3 bg-white px-4 py-2 text-sm font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          >
            View Projects
          </Link>
          <button
            onClick={() => setShowNewTaskModal(true)}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
          >
            New Task
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
            <p className="text-sm text-dark-5 dark:text-dark-6">{kpi.label}</p>
            <p className="mt-1 text-3xl font-bold text-dark dark:text-white">{kpi.value}</p>
            <p className={`mt-1 text-xs font-medium ${kpi.iconColor}`}>{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Chart + Priority + Deadlines */}
      <div className="grid gap-4 md:grid-cols-12">
        <div className="md:col-span-8">
          <TasksProgressChart />
        </div>
        <div className="md:col-span-4 flex flex-col gap-4">
          <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
            <h2 className="mb-4 font-semibold text-dark dark:text-white">Priority Breakdown</h2>
            <div className="space-y-3">
              {priorities.map((p) => (
                <div key={p.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`h-3 w-3 rounded-full ${p.dot}`} />
                    <span className="text-sm text-dark dark:text-white">{p.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-dark dark:text-white">{p.count}</span>
                    <span className="text-xs text-dark-5 dark:text-dark-6">{p.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-gray-2 dark:border-dark-3 pt-3 text-xs text-dark-5 dark:text-dark-6">
              Total: {totalAssigned} tasks
            </div>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
            <h2 className="mb-4 font-semibold text-dark dark:text-white">Upcoming Deadlines</h2>
            {upcomingDeadlines.length > 0 ? (
              <div className="space-y-3">
                {upcomingDeadlines.map((d) => (
                  <div key={d.task} className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${d.dot}`} />
                        <p className="truncate text-sm font-medium text-dark dark:text-white">{d.task}</p>
                      </div>
                      <p className="ml-3.5 text-xs text-dark-5 dark:text-dark-6">{d.project}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${d.badgeClass}`}>{d.due}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-dark-5 dark:text-dark-6">No upcoming deadlines.</p>
            )}
          </div>
        </div>
      </div>

      {/* Team Workload + Quick Links */}
      <div className="grid gap-4 md:grid-cols-12">
        <div className="md:col-span-5">
          <TasksTeamWorkload />
        </div>
        <div className="md:col-span-7">
          <TasksQuickLinks />
        </div>
      </div>

      {/* All My Tasks */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-dark dark:text-white">All My Tasks</h2>
        <MyTasksView tasks={tasks} />
      </div>

      {showNewTaskModal && (
        <NewTaskModal onClose={() => setShowNewTaskModal(false)} onSubmit={handleCreateTask} />
      )}
      <Toast message={toast} />
    </div>
  );
}
