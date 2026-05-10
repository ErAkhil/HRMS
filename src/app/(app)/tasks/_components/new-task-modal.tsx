interface Props {
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function NewTaskModal({ onClose, onSubmit }: Readonly<Props>) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-modal dark:bg-dark-2">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-dark dark:text-white">New Task</h2>
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
            <label className="block text-xs font-medium text-dark-5 dark:text-dark-6 mb-1">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Enter task title"
              className="w-full rounded-lg border border-gray-3 bg-white px-3 py-2 text-sm text-dark outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-dark-5 dark:text-dark-6 mb-1">Description</label>
            <textarea
              rows={3}
              placeholder="Describe the task..."
              className="w-full rounded-lg border border-gray-3 bg-white px-3 py-2 text-sm text-dark outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-dark-5 dark:text-dark-6 mb-1">Priority</label>
              <select className="w-full rounded-lg border border-gray-3 bg-white px-3 py-2 text-sm text-dark outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white">
                <option value="">Select priority</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-5 dark:text-dark-6 mb-1">Due Date</label>
              <input
                type="date"
                className="w-full rounded-lg border border-gray-3 bg-white px-3 py-2 text-sm text-dark outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-3 px-4 py-2 text-sm font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white"
            >
              Cancel
            </button>
            <button type="submit" className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700">
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
