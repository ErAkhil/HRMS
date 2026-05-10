"use client";

import Image from "next/image";
import { useRef, useEffect } from "react";
import { PRIORITY_CONFIG, PROJECT_COLORS } from "./kanban-types";
import type { KanbanTask } from "./kanban-types";

interface Props {
  task: KanbanTask;
  done?: boolean;
  openMenu: string | null;
  setOpenMenu: (id: string | null) => void;
  setToast: (msg: string) => void;
}

export function KanbanCard({ task, done, openMenu, setOpenMenu, setToast }: Readonly<Props>) {
  const p = PRIORITY_CONFIG[task.priority];
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (openMenu !== task.id) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [openMenu, task.id, setOpenMenu]);

  return (
    <div
      className={`group rounded-xl bg-white p-4 shadow-card transition-shadow hover:shadow-floating dark:border dark:border-dark-3 dark:bg-dark-2 ${
        done ? "opacity-70" : ""
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${p.bg} ${p.text}`}>
          <span className={`size-1.5 rounded-full ${p.dot}`} />
          {task.priority}
        </span>
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setOpenMenu(openMenu === task.id ? null : task.id)}
            className="flex size-6 items-center justify-center rounded text-dark-5 opacity-0 transition-opacity hover:bg-gray-2 group-hover:opacity-100 dark:text-dark-6 dark:hover:bg-dark-3"
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {openMenu === task.id && (
            <div className="absolute right-0 top-8 z-20 w-40 rounded-xl border border-gray-3 bg-white shadow-floating dark:border-dark-3 dark:bg-dark-2">
              <button onClick={() => { setOpenMenu(null); setToast("Task opened for editing!"); }} className="flex w-full items-center px-4 py-2.5 text-sm text-dark hover:bg-gray-1 dark:text-white dark:hover:bg-dark-3 rounded-t-xl">Edit</button>
              <button onClick={() => { setOpenMenu(null); setToast("Task moved to next stage!"); }} className="flex w-full items-center px-4 py-2.5 text-sm text-dark hover:bg-gray-1 dark:text-white dark:hover:bg-dark-3">Move to Next Stage</button>
              <button onClick={() => { setOpenMenu(null); setToast("Assignee updated!"); }} className="flex w-full items-center px-4 py-2.5 text-sm text-dark hover:bg-gray-1 dark:text-white dark:hover:bg-dark-3">Assign</button>
              <button onClick={() => { setOpenMenu(null); setToast("Task deleted!"); }} className="flex w-full items-center px-4 py-2.5 text-sm text-rose-dark hover:bg-gray-1 dark:hover:bg-dark-3 rounded-b-xl">Delete</button>
            </div>
          )}
        </div>
      </div>

      <p className={`mb-2 text-sm font-semibold leading-snug ${done ? "line-through text-dark-5 dark:text-dark-6" : "text-dark dark:text-white"}`}>
        {task.title}
      </p>

      <span className={`mb-3 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${PROJECT_COLORS[task.projectColor] ?? "bg-gray-2 text-dark-5"}`}>
        {task.project}
      </span>

      {task.subtasks && (
        <div className="mb-3">
          <div className="mb-1 flex items-center justify-between text-xs text-dark-5 dark:text-dark-6">
            <span>Subtasks</span>
            <span>{task.subtasks.done}/{task.subtasks.total}</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-gray-3 dark:bg-dark-3">
            <div
              className="h-full rounded-full bg-primary-600"
              style={{ width: `${(task.subtasks.done / task.subtasks.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-xs text-dark-5 dark:text-dark-6">
          <span className={`flex items-center gap-1 ${task.overdue ? "font-semibold text-rose-dark" : ""}`}>
            <svg className="size-3" viewBox="0 0 24 24" fill="none">
              <path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {task.dueDate}
          </span>
          {task.comments > 0 && (
            <span className="flex items-center gap-1">
              <svg className="size-3" viewBox="0 0 24 24" fill="none">
                <path d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {task.comments}
            </span>
          )}
          {task.attachments > 0 && (
            <span className="flex items-center gap-1">
              <svg className="size-3" viewBox="0 0 24 24" fill="none">
                <path d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {task.attachments}
            </span>
          )}
        </div>
        <Image src={task.avatar} alt="" width={24} height={24} className="size-6 rounded-full ring-2 ring-white dark:ring-dark-2" />
      </div>
    </div>
  );
}
