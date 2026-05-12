interface Props {
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isPending?: boolean;
}

export function ScheduleReviewModal({ onClose, onSubmit, isPending }: Readonly<Props>) {
  return (
    <div className="modal-overlay">
      <div className="modal-panel max-w-lg p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-dark dark:text-white">Schedule Performance Review</h2>
          <button onClick={onClose} className="flex size-8 items-center justify-center rounded-lg text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3">
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">Review Type</label>
              <select name="type" className="input-field">
                <option value="Annual Review">Annual Review</option>
                <option value="Mid-year Review">Mid-year Review</option>
                <option value="Quarterly Check-in">Quarterly Check-in</option>
                <option value="360� Feedback">360� Feedback</option>
              </select>
            </div>
            <div>
              <label className="label-field">Review Period</label>
              <select name="period" className="input-field">
                <option value="Q2 2026">Q2 2026</option>
                <option value="Q3 2026">Q3 2026</option>
                <option value="Q4 2026">Q4 2026</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label-field">Notes <span className="text-muted">(optional)</span></label>
            <textarea name="notes" rows={2} placeholder="Any notes for the reviewer..." className="input-field resize-none" />
          </div>
          <p className="text-xs text-dark-5 dark:text-dark-6">Your manager will be assigned as the reviewer automatically.</p>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} disabled={isPending} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={isPending} className="btn-primary disabled:opacity-60">
              {isPending ? "Scheduling�" : "Schedule Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
