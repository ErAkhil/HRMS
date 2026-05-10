"use client";

interface Department { id: string; name: string; }

interface FormData {
  firstName: string; lastName: string; email: string; phone: string;
  departmentId: string; title: string; employmentType: string;
  startDate: string; salary: string; role: string;
}

interface Props {
  departments: Department[];
  formData: FormData;
  formError: string | null;
  isPending: boolean;
  onFieldChange: (field: keyof FormData, value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export function AddEmployeeModal({ departments, formData, formError, isPending, onFieldChange, onSubmit, onClose }: Readonly<Props>) {
  const inputClass = "input-field";
  const selectClass = "input-field appearance-none";
  const labelClass = "label-field";

  return (
    <div className="modal-overlay">
      <div className="modal-panel w-full max-w-2xl">
        <div className="modal-header">
          <h2 className="text-lg font-bold text-dark dark:text-white">Add New Employee</h2>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-dark-5 hover:bg-gray-100 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white" aria-label="Close modal">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {formError && (
            <div className="mb-4 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-900/20 dark:text-rose-400">{formError}</div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>First Name <span className="text-rose-500">*</span></label>
              <input type="text" placeholder="e.g. James" value={formData.firstName} onChange={(e) => onFieldChange("firstName", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Last Name <span className="text-rose-500">*</span></label>
              <input type="text" placeholder="e.g. Williams" value={formData.lastName} onChange={(e) => onFieldChange("lastName", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Work Email <span className="text-rose-500">*</span></label>
              <input type="email" placeholder="e.g. james@acme.com" value={formData.email} onChange={(e) => onFieldChange("email", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input type="tel" placeholder="e.g. +1 555 000 0000" value={formData.phone} onChange={(e) => onFieldChange("phone", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Department <span className="text-rose-500">*</span></label>
              <select value={formData.departmentId} onChange={(e) => onFieldChange("departmentId", e.target.value)} className={selectClass}>
                <option value="">Select department</option>
                {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Designation <span className="text-rose-500">*</span></label>
              <input type="text" placeholder="e.g. Software Engineer" value={formData.title} onChange={(e) => onFieldChange("title", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Employment Type</label>
              <select value={formData.employmentType} onChange={(e) => onFieldChange("employmentType", e.target.value)} className={selectClass}>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Date of Joining <span className="text-rose-500">*</span></label>
              <input type="date" value={formData.startDate} onChange={(e) => onFieldChange("startDate", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Salary (Annual) <span className="text-rose-500">*</span></label>
              <input type="number" placeholder="e.g. 80000" value={formData.salary} onChange={(e) => onFieldChange("salary", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>System Role</label>
              <select value={formData.role} onChange={(e) => onFieldChange("role", e.target.value)} className={selectClass}>
                <option value="EMPLOYEE">Employee</option>
                <option value="MANAGER">Manager</option>
                <option value="HR_ADMIN">HR Admin</option>
              </select>
            </div>
          </div>
          <p className="mt-3 text-[11px] text-dark-5 dark:text-dark-6">A login account will be created automatically. You will see the temporary password after saving.</p>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button onClick={onClose} className="btn-secondary" disabled={isPending}>Cancel</button>
            <button onClick={onSubmit} disabled={isPending} className="btn-primary disabled:opacity-60">
              {isPending ? "Adding..." : "Add Employee"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
