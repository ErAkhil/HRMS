"use client";

import { useState } from "react";

interface Props {
  onClose: () => void;
  onCreate: () => void;
}

export function NewProjectModal({ onClose, onCreate }: Readonly<Props>) {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectTeam, setProjectTeam] = useState("");
  const [projectStartDate, setProjectStartDate] = useState("");
  const [projectEndDate, setProjectEndDate] = useState("");
  const [projectPriority, setProjectPriority] = useState("Medium");

  return (
    <div className="modal-overlay">
      <div className="modal-panel w-full max-w-md p-6">
        <div className="modal-header mb-5 flex items-center justify-between">
          <h2 className="section-title">New Project</h2>
          <button
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-lg text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3"
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="none">
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="label-field mb-1.5">Project Name <span className="text-rose-dark">*</span></label>
            <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="Enter project name" className="input-field w-full" />
          </div>
          <div>
            <label className="label-field mb-1.5">Description</label>
            <textarea value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} placeholder="Brief project description" rows={3} className="input-field w-full resize-none" />
          </div>
          <div>
            <label className="label-field mb-1.5">Team</label>
            <select value={projectTeam} onChange={(e) => setProjectTeam(e.target.value)} className="input-field w-full">
              <option value="">Select team</option>
              <option value="Engineering">Engineering</option>
              <option value="Product">Product</option>
              <option value="Sales">Sales</option>
              <option value="HR">HR</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field mb-1.5">Start Date</label>
              <input type="date" value={projectStartDate} onChange={(e) => setProjectStartDate(e.target.value)} className="input-field w-full" />
            </div>
            <div>
              <label className="label-field mb-1.5">End Date</label>
              <input type="date" value={projectEndDate} onChange={(e) => setProjectEndDate(e.target.value)} className="input-field w-full" />
            </div>
          </div>
          <div>
            <label className="label-field mb-1.5">Priority</label>
            <select value={projectPriority} onChange={(e) => setProjectPriority(e.target.value)} className="input-field w-full">
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={onCreate} className="btn-primary">Create Project</button>
        </div>
      </div>
    </div>
  );
}
