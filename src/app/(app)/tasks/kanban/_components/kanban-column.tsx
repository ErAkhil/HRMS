"use client";

import { KanbanCard } from "./kanban-card";
import type { KanbanColumn as KanbanColumnType, ColumnKey } from "./kanban-types";

interface Props {
  col: KanbanColumnType;
  openMenu: string | null;
  setOpenMenu: (id: string | null) => void;
  setToast: (msg: string) => void;
  onAddTask: (col: ColumnKey) => void;
}

export function KanbanColumn({ col, openMenu, setOpenMenu, setToast, onAddTask }: Readonly<Props>) {
  return (
    <div className="flex w-72 flex-shrink-0 flex-col">
      <div className={`mb-3 flex items-center justify-between rounded-xl border-l-4 bg-white px-4 py-3 shadow-card dark:border-dark-3 dark:bg-dark-2 ${col.headerColor}`}>
        <div className="flex items-center gap-2">
          <span className={`size-2.5 rounded-full ${col.dotColor}`} />
          <span className="text-sm font-semibold text-dark dark:text-white">{col.label}</span>
          <span className="rounded-full bg-gray-2 px-2 py-0.5 text-xs font-medium text-dark-5 dark:bg-dark-3 dark:text-dark-6">
            {col.tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddTask(col.key)}
          className="flex size-7 items-center justify-center rounded-lg text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3"
        >
          <svg className="size-4" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {col.tasks.map((task) => (
          <KanbanCard
            key={task.id}
            task={task}
            done={col.key === "done"}
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
            setToast={setToast}
          />
        ))}

        <button
          onClick={() => setToast("Click '+ Add Task' at the top to create a task")}
          className="flex items-center gap-2 rounded-xl border-2 border-dashed border-gray-3 px-4 py-3 text-sm text-dark-5 transition-colors hover:border-primary-600 hover:text-primary-600 dark:border-dark-3 dark:text-dark-6 dark:hover:border-primary-600 dark:hover:text-primary-300"
        >
          <svg className="size-4" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Add task
        </button>
      </div>
    </div>
  );
}
