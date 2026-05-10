"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";
import { KanbanColumn } from "./kanban-column";
import { createTask, updateTaskStatus } from "@/lib/actions/tasks";
import type { SerializedTask } from "@/lib/actions/tasks";
import type { KanbanColumn as KanbanColumnType, KanbanTask, ColumnKey, Priority } from "./kanban-types";

const STATUS_TO_COLUMN: Record<string, ColumnKey> = {
  TODO: "todo",
  IN_PROGRESS: "inprogress",
  IN_REVIEW: "review",
  DONE: "done",
};

const PRIORITY_MAP: Record<string, Priority> = {
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

const COLUMN_CONFIG: { key: ColumnKey; label: string; headerColor: string; dotColor: string }[] = [
  { key: "todo", label: "To Do", headerColor: "border-gray-4", dotColor: "bg-gray-4" },
  { key: "inprogress", label: "In Progress", headerColor: "border-primary-600", dotColor: "bg-primary-600" },
  { key: "review", label: "Review", headerColor: "border-amber-dark", dotColor: "bg-amber-dark" },
  { key: "done", label: "Done", headerColor: "border-emerald-dark", dotColor: "bg-emerald-dark" },
];

const todayStart = new Date();
todayStart.setHours(0, 0, 0, 0);

function toKanbanTask(t: SerializedTask): KanbanTask {
  const due = t.dueDate ? new Date(t.dueDate) : null;
  const isOverdue = due ? due < todayStart && t.status !== "DONE" : false;
  return {
    id: t.id,
    title: t.title,
    project: t.project?.name ?? "General",
    projectColor: "indigo",
    priority: PRIORITY_MAP[t.priority] ?? "Medium",
    dueDate: due
      ? due.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : "No due date",
    overdue: isOverdue,
    avatar: t.assignee?.avatarUrl ?? "/images/user/user-01.png",
    comments: 0,
    attachments: 0,
  };
}

interface Props {
  tasks: SerializedTask[];
}

export function KanbanPageClient({ tasks }: Readonly<Props>) {
  const router = useRouter();
  const { toast, setToast } = useToast();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addColumn, setAddColumn] = useState<ColumnKey>("todo");
  const [isPending, startTransition] = useTransition();

  const columns: KanbanColumnType[] = COLUMN_CONFIG.map((cfg) => ({
    ...cfg,
    tasks: tasks
      .filter((t) => STATUS_TO_COLUMN[t.status] === cfg.key)
      .map(toKanbanTask),
  }));

  const projectNames = Array.from(
    new Set(tasks.map((t) => t.project?.name).filter(Boolean))
  ) as string[];

  function openAddModal(col: ColumnKey) {
    setAddColumn(col);
    setShowAddModal(true);
  }

  function handleAddTask(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await createTask({
          title: fd.get("title") as string,
          priority: (fd.get("priority") as "HIGH" | "MEDIUM" | "LOW") || "MEDIUM",
          dueDate: (fd.get("dueDate") as string) || undefined,
        });
        setShowAddModal(false);
        setToast("Task added to board!");
        router.refresh();
      } catch (err) {
        setToast(err instanceof Error ? err.message : "Failed to create task");
      }
    });
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Kanban Board</h1>
          <p className="text-muted">Visualize and manage your workflow</p>
        </div>
        <button onClick={() => openAddModal("todo")} className="btn-primary">+ Add Task</button>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="flex min-w-max gap-4">
          {columns.map((col) => (
            <KanbanColumn
              key={col.key}
              col={col}
              openMenu={openMenu}
              setOpenMenu={setOpenMenu}
              setToast={setToast}
              onAddTask={openAddModal}
            />
          ))}
        </div>
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-panel max-w-md p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="section-title">Add Task</h2>
              <button onClick={() => setShowAddModal(false)} className="flex size-8 items-center justify-center rounded-lg text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3">
                <svg className="size-4" viewBox="0 0 24 24" fill="none">
                  <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="label-field mb-1">Title <span className="text-rose-dark">*</span></label>
                <input name="title" type="text" required placeholder="Task title" className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-field mb-1">Priority</label>
                  <select name="priority" className="input-field">
                    <option value="HIGH">High</option>
                    <option value="MEDIUM" defaultValue="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
                <div>
                  <label className="label-field mb-1">Due Date</label>
                  <input name="dueDate" type="date" className="input-field" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={isPending} className="btn-primary disabled:opacity-60">
                  {isPending ? "Adding…" : "Add Task"}
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
