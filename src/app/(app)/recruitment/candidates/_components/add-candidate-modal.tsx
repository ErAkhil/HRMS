"use client";

import { useState } from "react";

interface Props {
  onClose: () => void;
  onAdd: () => void;
}

export function AddCandidateModal({ onClose, onAdd }: Readonly<Props>) {
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", role: "", source: "", resumeLink: "", notes: "",
  });

  function handleSubmit() {
    setForm({ fullName: "", email: "", phone: "", role: "", source: "", resumeLink: "", notes: "" });
    onAdd();
  }

  return (
    <div className="modal-overlay">
      <div className="modal-panel w-full max-w-lg">
        <div className="modal-header">
          <h2 className="section-title">Add Candidate</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-4 px-6 py-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label-field">Full Name *</label>
              <input type="text" value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} className="input-field" placeholder="e.g. Rahul Gupta" />
            </div>
            <div>
              <label className="label-field">Email *</label>
              <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="input-field" placeholder="email@example.com" />
            </div>
            <div>
              <label className="label-field">Phone</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="input-field" placeholder="+91 98765 43210" />
            </div>
            <div>
              <label className="label-field">Role Applying For</label>
              <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} className="input-field">
                <option value="">Select role</option>
                <option>Senior Backend Engineer</option>
                <option>Product Designer</option>
                <option>Sales Executive</option>
                <option>HR Business Partner</option>
                <option>DevOps Engineer</option>
              </select>
            </div>
            <div>
              <label className="label-field">Source</label>
              <select value={form.source} onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))} className="input-field">
                <option value="">Select source</option>
                <option>LinkedIn</option>
                <option>Referral</option>
                <option>Website</option>
                <option>Job Board</option>
                <option>Other</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="label-field">Resume Link</label>
              <input type="text" value={form.resumeLink} onChange={(e) => setForm((f) => ({ ...f, resumeLink: e.target.value }))} className="input-field" placeholder="Paste LinkedIn or drive link" />
            </div>
            <div className="col-span-2">
              <label className="label-field">Notes</label>
              <textarea rows={2} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} className="input-field" placeholder="Any additional notes..." />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-gray-3 px-6 py-4 dark:border-dark-3">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={handleSubmit} className="btn-primary">Add Candidate</button>
        </div>
      </div>
    </div>
  );
}
