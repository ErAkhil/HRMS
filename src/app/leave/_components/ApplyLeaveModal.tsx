"use client";

interface ApplyLeaveModalProps {
  onClose: () => void;
}

export function ApplyLeaveModal({ onClose }: ApplyLeaveModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-modal dark:bg-dark-2 dark:border dark:border-dark-3">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-dark dark:text-white">Apply for Leave</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-2 dark:hover:bg-dark-3 text-dark-5 dark:text-dark-6"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-dark dark:text-white">Leave Type</label>
            <select className="h-9 w-full rounded-lg border border-gray-3 bg-gray-2 px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white">
              <option>Annual Leave</option>
              <option>Sick Leave</option>
              <option>Casual Leave</option>
              <option>Comp Off</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-dark dark:text-white">From Date</label>
              <input
                type="date"
                className="h-9 w-full rounded-lg border border-gray-3 bg-gray-2 px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-dark dark:text-white">To Date</label>
              <input
                type="date"
                className="h-9 w-full rounded-lg border border-gray-3 bg-gray-2 px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-dark dark:text-white">Reason</label>
            <textarea
              rows={3}
              placeholder="Briefly describe the reason for leave..."
              className="w-full rounded-lg border border-gray-3 bg-gray-2 px-3 py-2 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white dark:placeholder-dark-6 resize-none"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-3 px-4 py-2 text-sm font-medium text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6"
            >
              Cancel
            </button>
            <button className="flex-1 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700">
              Submit Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
