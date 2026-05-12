"use client";

import type { ActiveEmployee } from "@/lib/actions/onboarding";

interface Props {
  employees: ActiveEmployee[];
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isPending?: boolean;
}

const EXIT_REASONS = ["Resignation", "Termination", "Retirement", "Contract End", "Relocation"];

export function NewOffboardingModal({ employees, onClose, onSubmit, isPending }: Readonly<Props>) {
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
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="label-field">Employee <span className="text-rose-500">*</span></label>
            <select name="employeeId" required className="input-field">
              <option value="">Select employee</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.firstName} {e.lastName} — {e.title}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">Last Working Day <span className="text-rose-500">*</span></label>
              <input name="lastWorkingDay" type="date" required className="input-field" />
            </div>
            <div>
              <label className="label-field">Reason</label>
              <select name="reason" className="input-field">
                <option value="">Select reason</option>
                {EXIT_REASONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} disabled={isPending} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={isPending} className="btn-primary disabled:opacity-60">
              {isPending ? "Initiating…" : "Initiate"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
