interface Props {
  email: string;
  password: string;
  onDone: () => void;
}

export function TempPasswordModal({ email, password, onDone }: Readonly<Props>) {
  return (
    <div className="modal-overlay">
      <div className="modal-panel w-full max-w-sm p-6">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-dark/20">
          <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-dark dark:text-white">Employee Created</h2>
        <p className="mt-1 text-body text-dark-5 dark:text-dark-6">Share these login credentials with the employee. The password cannot be retrieved again.</p>
        <div className="mt-4 space-y-2 rounded-lg bg-gray-1 p-4 dark:bg-dark-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Email</p>
            <p className="mt-0.5 font-mono text-sm text-dark dark:text-white">{email}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Temporary Password</p>
            <p className="mt-0.5 font-mono text-sm font-semibold text-dark dark:text-white">{password}</p>
          </div>
        </div>
        <button onClick={onDone} className="btn-primary mt-5 w-full py-2">Done</button>
      </div>
    </div>
  );
}
