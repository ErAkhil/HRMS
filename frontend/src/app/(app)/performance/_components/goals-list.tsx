"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateGoalProgress } from "@/lib/actions/performance";
import type { SerializedGoal } from "@/lib/actions/performance";

interface GoalsListProps {
  goals: SerializedGoal[];
  setToast: (msg: string) => void;
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

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function GoalsList({ goals, setToast }: Readonly<GoalsListProps>) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState(0);

  function startEdit(goalId: string, current: number) {
    setEditingId(goalId);
    setEditValue(current);
  }

  function handleSave(goalId: string) {
    const clamped = Math.min(100, Math.max(0, editValue));
    setEditingId(null);
    startTransition(async () => {
      try {
        await updateGoalProgress(goalId, clamped);
        setToast("Goal progress updated!");
        router.refresh();
      } catch {
        setToast("Failed to update progress");
      }
    });
  }

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
        const sc = statusConfig[goal.status] ?? statusConfig.IN_PROGRESS;
        const isEditing = editingId === goal.id;
        return (
          <div key={goal.id} className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="text-sm font-semibold text-dark dark:text-white">{goal.title}</h3>
                  <span className={sc.badge}>{sc.label}</span>
                </div>

                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={editValue}
                      onChange={(e) => setEditValue(Number(e.target.value))}
                      className="input-field w-20 py-1 text-sm"
                      autoFocus
                    />
                    <span className="text-xs text-dark-5 dark:text-dark-6">%</span>
                    <button onClick={() => handleSave(goal.id)} className="btn-primary py-1 px-3 text-xs">Save</button>
                    <button onClick={() => setEditingId(null)} className="btn-secondary py-1 px-3 text-xs">Cancel</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 overflow-hidden rounded-full bg-gray-2 dark:bg-dark-3">
                      <div className={`h-full rounded-full ${sc.bar} transition-all`} style={{ width: `${goal.progress}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-dark dark:text-white w-10 text-right">{goal.progress}%</span>
                    <button
                      onClick={() => startEdit(goal.id, goal.progress)}
                      className="flex size-6 items-center justify-center rounded text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3"
                      title="Update progress"
                    >
                      <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  </div>
                )}
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
