interface Props {
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function SetGoalModal({ onClose, onSubmit }: Readonly<Props>) {
  return (
    <div className="modal-overlay">
      <div className="modal-panel max-w-lg p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-dark dark:text-white">Set New Goal</h2>
          <button onClick={onClose} className="flex size-8 items-center justify-center rounded-lg text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3">
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="label-field">Goal Title <span className="text-rose-500">*</span></label>
            <input type="text" required placeholder="Enter goal title" className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">Category</label>
              <select className="input-field">
                <option>Technical</option>
                <option>Collaboration</option>
                <option>Leadership</option>
                <option>Delivery</option>
                <option>Learning</option>
              </select>
            </div>
            <div>
              <label className="label-field">Target Date</label>
              <input type="date" className="input-field" />
            </div>
          </div>
          <div>
            <label className="label-field">Description</label>
            <textarea rows={2} placeholder="Describe the goal..." className="input-field resize-none" />
          </div>
          <div>
            <label className="label-field">Key Result 1</label>
            <input type="text" placeholder="Measurable outcome" className="input-field" />
          </div>
          <div>
            <label className="label-field">Key Result 2 <span className="text-muted">(optional)</span></label>
            <input type="text" placeholder="Measurable outcome" className="input-field" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Create Goal</button>
          </div>
        </form>
      </div>
    </div>
  );
}
