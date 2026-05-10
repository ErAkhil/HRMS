"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";
import { createProject } from "@/lib/actions/tasks";
import type { SerializedProject } from "@/lib/actions/tasks";

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-600 dark:bg-primary-900/20 dark:text-primary-300",
  COMPLETED: "rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  ON_HOLD: "rounded-full bg-amber-light px-2.5 py-0.5 text-xs font-medium text-amber-dark",
  CANCELLED: "rounded-full bg-rose-light px-2.5 py-0.5 text-xs font-medium text-rose-dark",
};

const PROGRESS_STYLES: Record<string, string> = {
  ACTIVE: "bg-primary-600",
  COMPLETED: "bg-emerald-dark",
  ON_HOLD: "bg-amber-dark",
  CANCELLED: "bg-rose-dark",
};

function formatDueDate(iso: string | null) {
  if (!iso) return "No due date";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

interface Props {
  projects: SerializedProject[];
}

export function ProjectsPageClient({ projects }: Readonly<Props>) {
  const router = useRouter();
  const { toast, setToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  const active = projects.filter((p) => p.status === "ACTIVE").length;
  const completed = projects.filter((p) => p.status === "COMPLETED").length;
  const onHold = projects.filter((p) => p.status === "ON_HOLD").length;

  const stats = [
    { label: "Active", value: active, color: "text-primary-600 dark:text-primary-300" },
    { label: "Completed", value: completed, color: "text-emerald-dark dark:text-emerald" },
    { label: "On Hold", value: onHold, color: "text-amber-dark" },
    { label: "Total", value: projects.length, color: "text-dark dark:text-white" },
  ];

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await createProject({
          name: fd.get("name") as string,
          description: (fd.get("description") as string) || undefined,
          startDate: (fd.get("startDate") as string) || undefined,
          dueDate: (fd.get("dueDate") as string) || undefined,
        });
        setShowModal(false);
        setToast("Project created successfully!");
        router.refresh();
      } catch (err) {
        setToast(err instanceof Error ? err.message : "Failed to create project");
      }
    });
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="text-muted">Track all HR initiatives and projects</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">+ New Project</button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card-p">
            <p className="stat-label">{s.label}</p>
            <p className={`mt-1 text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {projects.length === 0 ? (
        <div className="card empty-state">
          <p className="text-body-medium">No projects yet</p>
          <p className="empty-state-text">Create your first project to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} className="card overflow-hidden">
              <div className={`h-1.5 w-full ${PROGRESS_STYLES[project.status] ?? "bg-primary-600"}`} />
              <div className="p-5">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="section-title">{project.name}</h3>
                  <span className={STATUS_STYLES[project.status] ?? STATUS_STYLES.ACTIVE}>
                    {project.status.charAt(0) + project.status.slice(1).toLowerCase().replace("_", " ")}
                  </span>
                </div>
                <p className="text-muted mb-4 line-clamp-1">{project.description ?? "No description"}</p>

                <div className="mb-1 flex items-center justify-between">
                  <span className="text-muted">Progress</span>
                  <span className="text-xs font-semibold text-dark dark:text-white">{project.progress}%</span>
                </div>
                <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-gray-3 dark:bg-dark-3">
                  <div
                    className={`h-full rounded-full ${PROGRESS_STYLES[project.status] ?? "bg-primary-600"}`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-muted flex items-center gap-1 text-xs">
                    <svg className="size-3.5" viewBox="0 0 24 24" fill="none">
                      <path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {formatDueDate(project.dueDate)}
                  </div>
                  <span className="text-muted text-xs">{project.doneTasks}/{project.totalTasks} tasks</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-panel w-full max-w-md p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="section-title">New Project</h2>
              <button onClick={() => setShowModal(false)} className="flex size-8 items-center justify-center rounded-lg text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3">
                <svg className="size-4" viewBox="0 0 24 24" fill="none">
                  <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="label-field mb-1.5">Project Name <span className="text-rose-dark">*</span></label>
                <input name="name" type="text" required placeholder="Enter project name" className="input-field w-full" />
              </div>
              <div>
                <label className="label-field mb-1.5">Description</label>
                <textarea name="description" placeholder="Brief project description" rows={3} className="input-field w-full resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-field mb-1.5">Start Date</label>
                  <input name="startDate" type="date" className="input-field w-full" />
                </div>
                <div>
                  <label className="label-field mb-1.5">End Date</label>
                  <input name="dueDate" type="date" className="input-field w-full" />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={isPending} className="btn-primary disabled:opacity-60">
                  {isPending ? "Creating…" : "Create Project"}
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
