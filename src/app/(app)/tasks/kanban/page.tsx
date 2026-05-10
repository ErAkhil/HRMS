"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";
import { KanbanColumn } from "./_components/kanban-column";
import { KanbanAddModal } from "./_components/kanban-add-modal";
import { COLUMNS, } from "./_components/kanban-data";
import { PROJECTS_LIST } from "./_components/kanban-types";
import type { Priority, ColumnKey } from "./_components/kanban-types";

export default function KanbanPage() {
  const [selectedProject, setSelectedProject] = useState("All Projects");
  const [showAddModal, setShowAddModal] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const { toast, setToast } = useToast();

  const [taskTitle, setTaskTitle] = useState("");
  const [taskProject, setTaskProject] = useState("");
  const [taskPriority, setTaskPriority] = useState<Priority>("Medium");
  const [taskColumn, setTaskColumn] = useState<ColumnKey>("todo");
  const [taskAssignee, setTaskAssignee] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");

  function openAddModal(col: ColumnKey) {
    setTaskColumn(col);
    setTaskTitle("");
    setTaskProject("");
    setTaskPriority("Medium");
    setTaskAssignee("");
    setTaskDueDate("");
    setShowAddModal(true);
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Kanban Board</h1>
          <p className="text-muted">Visualize and manage your workflow</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="h-9 rounded-lg border border-gray-3 bg-gray-2 px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
          >
            {PROJECTS_LIST.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <button onClick={() => openAddModal("todo")} className="btn-primary">+ Add Task</button>
        </div>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="flex min-w-max gap-4">
          {COLUMNS.map((col) => (
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
        <KanbanAddModal
          taskTitle={taskTitle}
          taskProject={taskProject}
          taskPriority={taskPriority}
          taskColumn={taskColumn}
          taskAssignee={taskAssignee}
          taskDueDate={taskDueDate}
          onTitleChange={setTaskTitle}
          onProjectChange={setTaskProject}
          onPriorityChange={setTaskPriority}
          onColumnChange={setTaskColumn}
          onAssigneeChange={setTaskAssignee}
          onDueDateChange={setTaskDueDate}
          onAdd={() => { setShowAddModal(false); setToast("Task added to board!"); }}
          onClose={() => setShowAddModal(false)}
        />
      )}

      <Toast message={toast} />
    </div>
  );
}
