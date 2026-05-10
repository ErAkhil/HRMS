"use client";

import { useState } from "react";

interface Props {
  onClose: () => void;
  onSubmit: () => void;
}

export function NewOffboardingModal({ onClose, onSubmit }: Readonly<Props>) {
  const [form, setForm] = useState({
    employeeName: "", employeeId: "", lastWorkingDay: "",
    reason: "", exitInterviewDate: "", hrContact: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <div className="modal-overlay">
      <div className="modal-panel w-full max-w-lg p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="page-title">Initiate Offboarding</h2>
          <button
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-lg text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">Employee Name <span className="text-rose-500">*</span></label>
              <input type="text" required placeholder="e.g. Kevin Lee" value={form.employeeName} onChange={(e) => setForm((p) => ({ ...p, employeeName: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="label-field">Employee ID</label>
              <input type="text" placeholder="e.g. EMP-1042" value={form.employeeId} onChange={(e) => setForm((p) => ({ ...p, employeeId: e.target.value }))} className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">Last Working Day <span className="text-rose-500">*</span></label>
              <input type="date" required value={form.lastWorkingDay} onChange={(e) => setForm((p) => ({ ...p, lastWorkingDay: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="label-field">Reason</label>
              <select value={form.reason} onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))} className="input-field">
                <option value="">Select reason</option>
                <option>Resignation</option>
                <option>Termination</option>
                <option>Retirement</option>
                <option>Contract End</option>
                <option>Relocation</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">Exit Interview Date</label>
              <input type="date" value={form.exitInterviewDate} onChange={(e) => setForm((p) => ({ ...p, exitInterviewDate: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="label-field">HR Contact</label>
              <select value={form.hrContact} onChange={(e) => setForm((p) => ({ ...p, hrContact: e.target.value }))} className="input-field">
                <option value="">Select HR contact</option>
                <option>Meera Nair</option>
                <option>Priya Sharma</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Initiate</button>
          </div>
        </form>
      </div>
    </div>
  );
}
