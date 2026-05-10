"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";
import { toggleWorkflow, createWorkflow } from "@/lib/actions/admin";

type Workflow = {
  id: string;
  name: string;
  description: string;
  trigger: string;
  isEnabled: boolean;
  runsCount: number;
  lastRunAt: string | null;
  createdAt: string;
};

function formatDate(iso: string | null) {
  if (!iso) return "Never run";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function WorkflowsClient({ workflows }: Readonly<{ workflows: Workflow[] }>) {
  const { toast, setToast } = useToast();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", trigger: "" });

  async function handleToggle(id: string) {
    try {
      await toggleWorkflow(id);
      router.refresh();
    } catch {
      setToast("Failed to toggle workflow.");
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      await createWorkflow({ name: form.name, description: form.description, trigger: form.trigger });
      setShowModal(false);
      setForm({ name: "", description: "", trigger: "" });
      setToast("Workflow created!");
      router.refresh();
    } catch {
      setToast("Failed to create workflow.");
    }
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Workflows</h1>
          <p className="mt-0.5 text-muted">Automate HR processes and notifications</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Workflow
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Workflows", value: workflows.length, color: "text-dark dark:text-white" },
          { label: "Active", value: workflows.filter((w) => w.isEnabled).length, color: "text-emerald-dark dark:text-emerald" },
          { label: "Total Runs", value: workflows.reduce((a, w) => a + w.runsCount, 0), color: "text-indigo-600 dark:text-indigo-300" },
          { label: "Disabled", value: workflows.filter((w) => !w.isEnabled).length, color: "text-rose-dark dark:text-rose" },
        ].map((stat) => (
          <div key={stat.label} className="stat-card">
            <p className="stat-label">{stat.label}</p>
            <p className={`stat-value ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Workflows List */}
      {workflows.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="empty-state-text mb-3">No workflows yet.</p>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            Create First Workflow
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {workflows.map((wf) => (
            <div key={wf.id} className="card-p">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="section-title">{wf.name}</h3>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${wf.isEnabled ? "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald" : "bg-gray-100 text-gray-500 dark:bg-dark-3 dark:text-dark-6"}`}>
                      {wf.isEnabled ? "Active" : "Disabled"}
                    </span>
                  </div>
                  {wf.description && (
                    <p className="mt-1 empty-state-text">{wf.description}</p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-3 text-muted">
                    <span>Trigger: <strong className="text-dark dark:text-white">{wf.trigger}</strong></span>
                    <span>Runs: <strong className="text-dark dark:text-white">{wf.runsCount}</strong></span>
                    <span>Last run: <strong className="text-dark dark:text-white">{formatDate(wf.lastRunAt)}</strong></span>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(wf.id)}
                  className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    wf.isEnabled
                      ? "bg-rose-light text-rose-dark hover:bg-rose-dark hover:text-white"
                      : "bg-emerald-light text-emerald-dark hover:bg-emerald-dark hover:text-white"
                  }`}
                >
                  {wf.isEnabled ? "Disable" : "Enable"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-panel w-full max-w-lg">
            <div className="modal-header">
              <h2 className="text-lg font-bold text-dark dark:text-white">New Workflow</h2>
              <button onClick={() => setShowModal(false)} className="flex size-8 items-center justify-center rounded-lg text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4 p-6">
              <div>
                <label className="label-field">Name <span className="text-rose-500">*</span></label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Leave Approval Flow"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="label-field">Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  className="input-field w-full resize-none"
                />
              </div>
              <div>
                <label className="label-field">Trigger <span className="text-rose-500">*</span></label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Leave request submitted"
                  value={form.trigger}
                  onChange={(e) => setForm((p) => ({ ...p, trigger: e.target.value }))}
                  className="input-field w-full"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create
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
