import type { DepartmentRow } from "@/lib/actions/departments";

export function DeleteConfirmModal({
  dept,
  onConfirm,
  onClose,
  isPending,
}: Readonly<{
  dept: DepartmentRow;
  onConfirm: () => void;
  onClose: () => void;
  isPending: boolean;
}>) {
  return (
    <div className="modal-overlay">
      <div className="modal-panel max-w-sm p-6">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-dark/10">
            <svg className="h-6 w-6 text-rose-600 dark:text-rose" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-dark dark:text-white">Delete Department</h3>
          <p className="mt-2 text-sm text-dark-5 dark:text-dark-6">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-dark dark:text-white">&quot;{dept.name}&quot;</span>?
            {dept.employeeCount > 0 && (
              <span className="mt-1 block text-amber-600 dark:text-amber">
                ⚠ This department has {dept.employeeCount} active employee{dept.employeeCount === 1 ? "" : "s"}. Reassign them first.
              </span>
            )}
          </p>
        </div>
        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending || dept.employeeCount > 0}
            className="btn-danger flex-1 disabled:opacity-50"
          >
            {isPending ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
