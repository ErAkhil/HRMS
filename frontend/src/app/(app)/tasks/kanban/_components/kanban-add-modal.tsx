"use client";

import { PROJECTS_LIST, COLUMN_LABELS } from "./kanban-types";
import type { Priority, ColumnKey } from "./kanban-types";

interface Props {
  taskTitle: string;
  taskProject: string;
  taskPriority: Priority;
  taskColumn: ColumnKey;
  taskAssignee: string;
  taskDueDate: string;
  onTitleChange: (v: string) => void;
  onProjectChange: (v: string) => void;
  onPriorityChange: (v: Priority) => void;
  onColumnChange: (v: ColumnKey) => void;
  onAssigneeChange: (v: string) => void;
  onDueDateChange: (v: string) => void;
  onAdd: () => void;
  onClose: () => void;
}

export function KanbanAddModal({
  taskTitle, taskProject, taskPriority, taskColumn,
  taskAssignee, taskDueDate,
  onTitleChange, onProjectChange, onPriorityChange,
  onColumnChange, onAssigneeChange, onDueDateChange,
  onAdd, onClose,
}: Readonly<Props>) {
  return (
    <div className="modal-overlay">
      <div className="modal-panel w-full max-w-md p-6">
        <div className="modal-header mb-5 flex items-center justify-between">
          <h2 className="section-title">New Task</h2>
          <button onClick={onClose} className="flex size-8 items-center justify-center rounded-lg text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3">
            <svg className="size-4" viewBox="0 0 24 24" fill="none">
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label-field mb-1.5">Title <span className="text-rose-dark">*</span></label>
            <input type="text" value={taskTitle} onChange={(e) => onTitleChange(e.target.value)} placeholder="Enter task title" className="input-field w-full" />
          </div>
          <div>
            <label className="label-field mb-1.5">Project</label>
            <select value={taskProject} onChange={(e) => onProjectChange(e.target.value)} className="input-field w-full">
              <option value="">Select project</option>
              {PROJECTS_LIST.filter((p) => p !== "All Projects").map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field mb-1.5">Priority</label>
              <select value={taskPriority} onChange={(e) => onPriorityChange(e.target.value as Priority)} className="input-field w-full">
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label className="label-field mb-1.5">Column</label>
              <select value={taskColumn} onChange={(e) => onColumnChange(e.target.value as ColumnKey)} className="input-field w-full">
                {(Object.keys(COLUMN_LABELS) as ColumnKey[]).map((k) => (
                  <option key={k} value={k}>{COLUMN_LABELS[k]}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="label-field mb-1.5">Assignee</label>
            <input type="text" value={taskAssignee} onChange={(e) => onAssigneeChange(e.target.value)} placeholder="Enter assignee name" className="input-field w-full" />
          </div>
          <div>
            <label className="label-field mb-1.5">Due Date</label>
            <input type="date" value={taskDueDate} onChange={(e) => onDueDateChange(e.target.value)} className="input-field w-full" />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={onAdd} className="btn-primary">Add Task</button>
        </div>
      </div>
    </div>
  );
}
