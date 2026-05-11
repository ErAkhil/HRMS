"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateEmployee, type EmployeeProfile } from "@/lib/actions/employees";

const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Intern"];

interface Props {
  employee: EmployeeProfile;
  departments: { id: string; name: string }[];
  onClose: () => void;
}

export function EditProfileModal({ employee, departments, onClose }: Readonly<Props>) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    firstName: employee.firstName,
    lastName: employee.lastName,
    phone: employee.phone ?? "",
    title: employee.title,
    departmentId: employee.departmentId ?? "",
    employmentType: employee.employmentType,
    salary: String(employee.salary),
  });

  function set(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      try {
        await updateEmployee(employee.id, {
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone || undefined,
          title: form.title,
          departmentId: form.departmentId || undefined,
          employmentType: form.employmentType,
          salary: Number(form.salary),
        });
        router.refresh();
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update profile");
      }
    });
  }

  const inputCls = "w-full rounded-lg border border-gray-3 bg-white px-3.5 py-2.5 text-sm text-dark focus:border-primary-600 focus:outline-none dark:border-dark-3 dark:bg-dark-3 dark:text-white dark:focus:border-primary-600";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-modal dark:bg-dark-2 max-h-[90vh] overflow-y-auto">
        <h2 className="mb-5 text-lg font-semibold text-dark dark:text-white">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-dark-5 dark:text-dark-6">First Name</label>
              <input type="text" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} className={inputCls} required />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-dark-5 dark:text-dark-6">Last Name</label>
              <input type="text" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} className={inputCls} required />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-dark-5 dark:text-dark-6">Phone</label>
            <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-dark-5 dark:text-dark-6">Title / Designation</label>
            <input type="text" value={form.title} onChange={(e) => set("title", e.target.value)} className={inputCls} required />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-dark-5 dark:text-dark-6">Department</label>
            <select value={form.departmentId} onChange={(e) => set("departmentId", e.target.value)} className={inputCls}>
              <option value="">No Department</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-dark-5 dark:text-dark-6">Employment Type</label>
              <select value={form.employmentType} onChange={(e) => set("employmentType", e.target.value)} className={inputCls}>
                {EMPLOYMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-dark-5 dark:text-dark-6">Salary</label>
              <input type="number" value={form.salary} onChange={(e) => set("salary", e.target.value)} className={inputCls} min={0} required />
            </div>
          </div>

          {error && <p className="text-sm text-rose-600">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="rounded-lg border border-gray-3 bg-white px-5 py-2.5 text-sm font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white">
              Cancel
            </button>
            <button type="submit" disabled={isPending} className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60">
              {isPending ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
