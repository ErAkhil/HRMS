"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  createDepartment,
  updateDepartment,
  deleteDepartment,
  type DepartmentRow,
} from "@/lib/actions/departments";
import { type Employee, type FormState, BLANK_FORM } from "./dept-types";
import { DeptCard } from "./dept-card";
import { DeptFormModal } from "./dept-form-modal";
import { DeleteConfirmModal } from "./delete-confirm-modal";

interface Props {
  departments: DepartmentRow[];
  employees: Employee[];
}

export function DepartmentsClient({ departments, employees }: Readonly<Props>) {
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  const [editDept, setEditDept] = useState<DepartmentRow | null>(null);
  const [deleteDept, setDeleteDept] = useState<DepartmentRow | null>(null);
  const [form, setForm] = useState<FormState>(BLANK_FORM);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const totalHeadcount = departments.reduce((sum, d) => sum + d.employeeCount, 0);
  const avgTeamSize = departments.length > 0 ? (totalHeadcount / departments.length).toFixed(1) : "—";
  const missingHead = departments.filter((d) => !d.headId).length;

  function openCreate() {
    setForm(BLANK_FORM);
    setError("");
    setShowCreate(true);
  }

  function openEdit(dept: DepartmentRow) {
    setForm({ name: dept.name, description: dept.description ?? "", color: dept.color, headId: dept.headId ?? "" });
    setError("");
    setEditDept(dept);
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      try {
        await createDepartment({ ...form, headId: form.headId || undefined });
        setShowCreate(false);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create department");
      }
    });
  }

  function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editDept) return;
    setError("");
    startTransition(async () => {
      try {
        await updateDepartment(editDept.id, { ...form, headId: form.headId || undefined });
        setEditDept(null);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update department");
      }
    });
  }

  function handleDelete() {
    if (!deleteDept) return;
    startTransition(async () => {
      try {
        await deleteDepartment(deleteDept.id);
        setDeleteDept(null);
        router.refresh();
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to delete department");
        setDeleteDept(null);
      }
    });
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <nav className="mb-1 flex items-center gap-1.5 text-xs text-dark-5 dark:text-dark-6">
            <Link href="/employees" className="hover:text-dark dark:hover:text-white transition-colors">Employees</Link>
            <span>/</span>
            <span className="text-dark dark:text-white font-medium">Departments</span>
          </nav>
          <h1 className="page-title">Departments</h1>
          <p className="mt-0.5 text-muted">
            {departments.length} department{departments.length === 1 ? "" : "s"} · {totalHeadcount} employees
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary">+ New Department</button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="stat-card">
          <p className="stat-label">Total Departments</p>
          <p className="stat-value text-indigo-600">{departments.length}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Total Headcount</p>
          <p className="stat-value text-emerald-600">{totalHeadcount}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Avg Team Size</p>
          <p className="stat-value text-violet-600">{avgTeamSize}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Missing Head</p>
          <p className={`stat-value ${missingHead > 0 ? "text-amber-600" : "text-dark dark:text-white"}`}>
            {missingHead}
          </p>
          {missingHead > 0 && <p className="mt-0.5 text-muted">needs attention</p>}
        </div>
      </div>

      {departments.length === 0 ? (
        <div className="empty-state card py-16">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-900/20">
            <svg className="h-7 w-7 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-dark dark:text-white">No departments yet</p>
          <p className="mt-1 empty-state-text">Create your first department to organise your workforce.</p>
          <button onClick={openCreate} className="btn-primary mt-4">+ Create Department</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {departments.map((dept) => (
            <DeptCard key={dept.id} dept={dept} onEdit={openEdit} onDelete={setDeleteDept} />
          ))}
        </div>
      )}

      {showCreate && (
        <DeptFormModal
          title="New Department"
          form={form}
          setForm={setForm}
          onSubmit={handleCreate}
          onClose={() => { setShowCreate(false); setError(""); }}
          error={error}
          isPending={isPending}
          employees={employees}
          submitLabel="Create Department"
        />
      )}

      {editDept && (
        <DeptFormModal
          title="Edit Department"
          form={form}
          setForm={setForm}
          onSubmit={handleUpdate}
          onClose={() => { setEditDept(null); setError(""); }}
          error={error}
          isPending={isPending}
          employees={employees}
          submitLabel="Save Changes"
        />
      )}

      {deleteDept && (
        <DeleteConfirmModal
          dept={deleteDept}
          onConfirm={handleDelete}
          onClose={() => setDeleteDept(null)}
          isPending={isPending}
        />
      )}
    </div>
  );
}
