"use client";

import { useState } from "react";
import Image from "next/image";
import type { Task } from "./tasks-data";
import { PROJECT_COLORS, PRIORITY_COLORS } from "./tasks-data";

interface TaskRowProps {
  task: Task;
  completed: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  overdue?: boolean;
}

export function TaskRow({ task, completed, onToggle, onDelete, overdue }: TaskRowProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-gray-1 dark:hover:bg-dark-3/40 ${completed ? "opacity-60" : ""}`}>
      <button
        onClick={() => onToggle(task.id)}
        className={`flex size-5 flex-shrink-0 items-center justify-center rounded border-2 transition-colors ${
          completed
            ? "border-primary-600 bg-primary-600"
            : "border-gray-4 bg-transparent hover:border-primary-600 dark:border-dark-4"
        }`}
        aria-label={completed ? "Mark incomplete" : "Mark complete"}
      >
        {completed && (
          <svg className="size-3 text-white" viewBox="0 0 24 24" fill="none">
            <path d="M4.5 12.75l6 6 9-13.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <span className={`min-w-0 flex-1 text-sm font-medium ${completed ? "line-through text-dark-5 dark:text-dark-6" : "text-dark dark:text-white"}`}>
        {task.title}
      </span>

      <span className={`hidden shrink-0 rounded-full px-2 py-0.5 text-xs font-medium sm:inline-flex ${PROJECT_COLORS[task.projectColor] ?? "bg-gray-2 text-dark-5"}`}>
        {task.project}
      </span>

      <div className="flex shrink-0 items-center gap-1.5">
        <span className={`size-2 rounded-full ${PRIORITY_COLORS[task.priority]}`} />
        <span className="hidden text-xs text-dark-5 dark:text-dark-6 md:inline">{task.priority}</span>
      </div>

      <span className={`hidden shrink-0 text-xs sm:inline ${overdue ? "font-semibold text-rose-dark" : "text-dark-5 dark:text-dark-6"}`}>
        {task.dueDate}
      </span>

      <Image src={task.avatar} alt="" width={24} height={24} className="size-6 flex-shrink-0 rounded-full" />

      <div className="relative flex-shrink-0">
        <button
          onClick={() => setShowMenu((p) => !p)}
          className="flex size-7 items-center justify-center rounded text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3"
        >
          <svg className="size-4" viewBox="0 0 24 24" fill="none">
            <path d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {showMenu && (
          <div className="absolute right-0 top-8 z-20 w-40 rounded-xl border border-gray-3 bg-white shadow-floating dark:border-dark-3 dark:bg-dark-2">
            {!completed && (
              <button
                onClick={() => { setShowMenu(false); onToggle(task.id); }}
                className="flex w-full items-center px-4 py-2.5 text-sm text-dark hover:bg-gray-1 dark:text-white dark:hover:bg-dark-3 rounded-t-xl"
              >
                Mark Complete
              </button>
            )}
            <button
              onClick={() => { setShowMenu(false); onDelete(task.id); }}
              className={`flex w-full items-center px-4 py-2.5 text-sm text-rose-dark hover:bg-gray-1 dark:hover:bg-dark-3 ${completed ? "rounded-t-xl" : ""} rounded-b-xl`}
            >
              Delete Task
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
