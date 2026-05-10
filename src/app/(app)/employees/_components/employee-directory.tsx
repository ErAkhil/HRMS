"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { EmployeeCard } from "./employee-card";
import { EmployeeListRow } from "./employee-list-row";
import { StatCard } from "./stat-card";
import { AddEmployeeModal } from "./add-employee-modal";
import { TempPasswordModal } from "./temp-password-modal";
import { toEmployeeDisplay, type EmployeeWithDept } from "./employee-data";
import { createEmployee } from "@/lib/actions/employees";

const EMPTY_FORM = {
  firstName: "", lastName: "", email: "", phone: "",
  departmentId: "", title: "", employmentType: "Full-time",
  startDate: "", salary: "", role: "EMPLOYEE",
};

interface Department { id: string; name: string; }
interface Props { employees: EmployeeWithDept[]; departments: Department[]; totalCount: number; }

export function EmployeeDirectory({ employees, departments, totalCount }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAddModal, setShowAddModal] = useState(false);
  const [createdPassword, setCreatedPassword] = useState<{ email: string; password: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const filtered = employees.map(toEmployeeDisplay).filter((e) => {
    const matchSearch = search === "" || e.name.toLowerCase().includes(search.toLowerCase()) || e.title.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase());
    const matchDept = department === "All" || e.department === department;
    return matchSearch && matchDept;
  });

  function handleFieldChange(field: keyof typeof formData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit() {
    setFormError(null);
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.title || !formData.startDate || !formData.salary) {
      setFormError("Please fill in all required fields."); return;
    }
    startTransition(async () => {
      try {
        const result = await createEmployee({
          firstName: formData.firstName, lastName: formData.lastName, email: formData.email,
          phone: formData.phone || undefined, title: formData.title,
          departmentId: formData.departmentId || undefined, employmentType: formData.employmentType,
          startDate: formData.startDate, salary: Number(formData.salary),
          role: formData.role as "SUPER_ADMIN" | "HR_ADMIN" | "MANAGER" | "EMPLOYEE",
        });
        setShowAddModal(false); setFormData(EMPTY_FORM);
        setCreatedPassword({ email: formData.email, password: result.tempPassword });
        router.refresh();
      } catch (err: unknown) {
        setFormError(err instanceof Error ? err.message : "Failed to add employee.");
      }
    });
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center gap-3">
          <h1 className="page-title">Employee Directory</h1>
          <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-dark dark:bg-sky-dark/10 dark:text-sky">{totalCount} employees</span>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary">+ Add Employee</button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Employees" value={totalCount} iconBg="bg-indigo-50 dark:bg-indigo-900/20" icon={<svg className="size-5 text-indigo-600 dark:text-indigo-300" viewBox="0 0 24 24" fill="none"><path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>} trend="Active workforce" trendUp />
        <StatCard label="Active" value={totalCount} iconBg="bg-emerald-light dark:bg-emerald-dark/20" icon={<svg className="size-5 text-emerald-dark dark:text-emerald" viewBox="0 0 24 24" fill="none"><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>} trend="All active" trendUp />
        <StatCard label="On Leave" value={0} iconBg="bg-amber-light dark:bg-amber-dark/20" icon={<svg className="size-5 text-amber-dark dark:text-amber" viewBox="0 0 24 24" fill="none"><path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
        <StatCard label="Departments" value={departments.length} iconBg="bg-violet-light dark:bg-violet-dark/20" icon={<svg className="size-5 text-violet-dark dark:text-violet-300" viewBox="0 0 24 24" fill="none"><path d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>} trend="Active depts" trendUp />
      </div>

      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <svg className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-dark-5 dark:text-dark-6" viewBox="0 0 24 24" fill="none">
              <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <input type="text" placeholder="Search employees..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-9 w-full rounded-lg border border-gray-3 bg-gray-2 pl-9 pr-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white dark:placeholder-dark-6" />
          </div>
          <select value={department} onChange={(e) => setDepartment(e.target.value)} className="h-9 rounded-lg border border-gray-3 bg-gray-2 px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white">
            <option value="All">All Departments</option>
            {departments.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
          </select>
          <div className="flex rounded-lg border border-gray-3 dark:border-dark-3">
            <button onClick={() => setViewMode("grid")} className={`flex items-center justify-center rounded-l-lg px-3 py-2 transition-colors ${viewMode === "grid" ? "bg-primary-600 text-white" : "bg-transparent text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3"}`} aria-label="Grid view">
              <svg className="size-4" viewBox="0 0 24 24" fill="none"><path d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25A2.25 2.25 0 0113.5 8.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button onClick={() => setViewMode("list")} className={`flex items-center justify-center rounded-r-lg px-3 py-2 transition-colors ${viewMode === "list" ? "bg-primary-600 text-white" : "bg-transparent text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3"}`} aria-label="List view">
              <svg className="size-4" viewBox="0 0 24 24" fill="none"><path d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
          <p className="text-muted">{filtered.length} results</p>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card empty-state"><p className="empty-state-text">No employees match your filters.</p></div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((employee) => (
            <div key={employee.id} onClick={() => router.push("/employees/profile")} className="cursor-pointer hover:shadow-md transition-shadow">
              <EmployeeCard employee={employee} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((employee) => (
            <div key={employee.id} onClick={() => router.push("/employees/profile")} className="cursor-pointer hover:shadow-md transition-shadow">
              <EmployeeListRow employee={employee} />
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <AddEmployeeModal
          departments={departments} formData={formData} formError={formError}
          isPending={isPending} onFieldChange={handleFieldChange}
          onSubmit={handleSubmit} onClose={() => { setShowAddModal(false); setFormError(null); }}
        />
      )}

      {createdPassword && (
        <TempPasswordModal email={createdPassword.email} password={createdPassword.password} onDone={() => setCreatedPassword(null)} />
      )}
    </div>
  );
}
