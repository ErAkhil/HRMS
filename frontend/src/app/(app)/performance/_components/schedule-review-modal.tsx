interface Props {
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ScheduleReviewModal({ onClose, onSubmit }: Readonly<Props>) {
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
              <select className="input-field">
                <option>Annual Review</option>
                <option>Mid-year Review</option>
                <option>Quarterly Check-in</option>
                <option>360° Feedback</option>
              </select>
            </div>
            <div>
              <label className="label-field">Review Period</label>
              <select className="input-field">
                <option>Q2 2026</option>
                <option>Q3 2026</option>
                <option>Q4 2026</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">Reviewer</label>
              <select className="input-field">
                <option>James Williams</option>
                <option>Sarah Mitchell</option>
                <option>Priya Sharma</option>
              </select>
            </div>
            <div>
              <label className="label-field">Review Date</label>
              <input type="date" className="input-field" />
            </div>
          </div>
          <div>
            <label className="label-field">Notes <span className="text-muted">(optional)</span></label>
            <textarea rows={2} placeholder="Any notes for the reviewer..." className="input-field resize-none" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Schedule Review</button>
          </div>
        </form>
      </div>
    </div>
  );
}
