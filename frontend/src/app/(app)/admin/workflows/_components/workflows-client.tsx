"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";
import { toggleWorkflow, createWorkflow } from "@/lib/actions/admin";
import type { Workflow } from "@/lib/actions/admin";

function formatDate(iso: string | null) {
  if (!iso) return "Never run";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function StatsGrid({ workflows }: Readonly<{ workflows: Workflow[] }>) {
  const stats = [
    { label: "Total Workflows", value: workflows.length, color: "text-dark dark:text-white" },
    { label: "Active", value: workflows.filter((w) => w.isEnabled).length, color: "text-emerald-dark dark:text-emerald" },
    { label: "Total Runs", value: workflows.reduce((a, w) => a + w.runsCount, 0), color: "text-primary-600 dark:text-primary-300" },
    { label: "Disabled", value: workflows.filter((w) => !w.isEnabled).length, color: "text-rose-dark dark:text-rose" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="stat-card">
          <p className="stat-label">{stat.label}</p>
          <p className={`stat-value ${stat.color}`}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
}

function WorkflowCard({ workflow, onToggle }: Readonly<{ workflow: Workflow; onToggle: (id: string) => void }>) {
  return (
    <div className="card-p">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="section-title">{workflow.name}</h3>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${workflow.isEnabled ? "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald" : "bg-gray-100 text-gray-500 dark:bg-dark-3 dark:text-dark-6"}`}>
              {workflow.isEnabled ? "Active" : "Disabled"}
            </span>
          </div>
          {workflow.description && <p className="mt-1 empty-state-text">{workflow.description}</p>}
          <div className="mt-2 flex flex-wrap gap-3 text-muted">
            {workflow.orgName && <span>Organization: <strong className="text-dark dark:text-white">{workflow.orgName}</strong></span>}
            <span>Trigger: <strong className="text-dark dark:text-white">{workflow.trigger}</strong></span>
            <span>Runs: <strong className="text-dark dark:text-white">{workflow.runsCount}</strong></span>
            <span>Last run: <strong className="text-dark dark:text-white">{formatDate(workflow.lastRunAt)}</strong></span>
          </div>
        </div>
        <button
          onClick={() => onToggle(workflow.id)}
          className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${workflow.isEnabled ? "bg-rose-light text-rose-dark hover:bg-rose-dark hover:text-white" : "bg-emerald-light text-emerald-dark hover:bg-emerald-dark hover:text-white"}`}
        >
          {workflow.isEnabled ? "Disable" : "Enable"}
        </button>
      </div>
    </div>
  );
}

function EmptyState({ onCreateClick }: Readonly<{ onCreateClick: () => void }>) {
  return (
    <div className="card p-10 text-center">
      <p className="empty-state-text mb-3">No workflows yet.</p>
      <button onClick={onCreateClick} className="btn-primary">
        Create First Workflow
      </button>
    </div>
  );
}

function WorkflowsHeader({ onCreateClick }: Readonly<{ onCreateClick: () => void }>) {
  return (
    <div className="page-header">
      <div>
        <h1 className="page-title">Workflows</h1>
        <p className="mt-0.5 text-muted">Automate HR processes and notifications</p>
      </div>
      <button onClick={onCreateClick} className="btn-primary flex items-center gap-2">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        New Workflow
      </button>
    </div>
  );
}

function CreateWorkflowModal({ open, form, onClose, onChange, onCreate }: Readonly<{ open: boolean; form: { name: string; description: string; trigger: string }; onClose: () => void; onChange: (key: string, value: string) => void; onCreate: (e: React.FormEvent) => void }>) {
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-panel w-full max-w-lg">
        <div className="modal-header">
          <h2 className="text-lg font-bold text-dark dark:text-white">New Workflow</h2>
          <button onClick={onClose} className="flex size-8 items-center justify-center rounded-lg text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3">
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={onCreate} className="space-y-4 p-6">
          <div>
            <label htmlFor="workflow-name" className="label-field">Name <span className="text-rose-500">*</span></label>
            <input id="workflow-name" required type="text" placeholder="e.g. Leave Approval Flow" value={form.name} onChange={(e) => onChange("name", e.target.value)} className="input-field w-full" />
          </div>
          <div>
            <label htmlFor="workflow-description" className="label-field">Description</label>
            <textarea id="workflow-description" rows={2} value={form.description} onChange={(e) => onChange("description", e.target.value)} className="input-field w-full resize-none" />
          </div>
          <div>
            <label htmlFor="workflow-trigger" className="label-field">Trigger <span className="text-rose-500">*</span></label>
            <input id="workflow-trigger" required type="text" placeholder="e.g. Leave request submitted" value={form.trigger} onChange={(e) => onChange("trigger", e.target.value)} className="input-field w-full" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
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
      <WorkflowsHeader onCreateClick={() => setShowModal(true)} />
      <StatsGrid workflows={workflows} />
      {workflows.length === 0 ? (
        <EmptyState onCreateClick={() => setShowModal(true)} />
      ) : (
        <div className="space-y-3">
          {workflows.map((wf) => (
            <WorkflowCard key={wf.id} workflow={wf} onToggle={handleToggle} />
          ))}
        </div>
      )}
      <CreateWorkflowModal open={showModal} form={form} onClose={() => setShowModal(false)} onChange={(key, value) => setForm((p) => ({ ...p, [key]: value }))} onCreate={handleCreate} />
      <Toast message={toast} />
    </div>
  );
}
