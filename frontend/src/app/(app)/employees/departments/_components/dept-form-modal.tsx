import type { FormState, Employee } from "./dept-types";
import { COLOR_SWATCHES } from "./dept-types";

export function DeptFormModal({
  title,
  form,
  setForm,
  onSubmit,
  onClose,
  error,
  isPending,
  employees,
  submitLabel,
}: Readonly<{
  title: string;
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  error: string;
  isPending: boolean;
  employees: Employee[];
  submitLabel: string;
}>) {
  return (
    <div className="modal-overlay">
      <div className="modal-panel max-w-lg p-0">
        <div className="modal-header">
          <h2 className="text-base font-semibold text-dark dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 p-5">
          {error && (
            <div className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-dark/10 dark:text-rose">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="dept-name" className="label-field">
              Department Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="dept-name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
              placeholder="e.g. Engineering"
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="dept-description" className="label-field">
              Description <span className="text-muted font-normal">(optional)</span>
            </label>
            <textarea
              id="dept-description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={2}
              placeholder="What does this department do?"
              className="input-field resize-none"
            />
          </div>

          <div>
            <p className="label-field">Color</p>
            <div className="flex flex-wrap gap-2">
              {COLOR_SWATCHES.map((s) => (
                <button
                  key={s.hex}
                  type="button"
                  title={s.label}
                  onClick={() => setForm((f) => ({ ...f, color: s.hex }))}
                  className={`h-7 w-7 rounded-full transition-transform hover:scale-110 ${
                    form.color === s.hex ? "ring-2 ring-offset-2 ring-dark dark:ring-white" : ""
                  }`}
                  style={{ backgroundColor: s.hex }}
                />
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="dept-head" className="label-field">
              Department Head <span className="text-muted font-normal">(optional)</span>
            </label>
            <select
              id="dept-head"
              value={form.headId}
              onChange={(e) => setForm((f) => ({ ...f, headId: e.target.value }))}
              className="input-field"
            >
              <option value="">— No head assigned —</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName} · {emp.title}
                  {emp.department ? ` (${emp.department.name})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={isPending} className="btn-primary flex-1 disabled:opacity-50">
              {isPending ? "Saving…" : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
