import Link from "next/link";
import { getEmployees, getDepartments } from "@/lib/actions/employees";
import { EmployeeDirectory } from "./_components/employee-directory";
import { EmployeesKpiRow } from "./_components/employees-kpi-row";
import { EmployeesDeptBreakdown } from "./_components/employees-dept-breakdown";
import { EmployeesRecentJoiners } from "./_components/employees-recent-joiners";
import { EmployeesActionItems } from "./_components/employees-action-items";
import { DEPT_COLORS, deptBadgeColor, employmentTypes } from "./_data/employees-data";

export default async function EmployeesPage() {
  let employees: Awaited<ReturnType<typeof getEmployees>> = [];
  let departments: Awaited<ReturnType<typeof getDepartments>> = [];

  try {
    [employees, departments] = await Promise.all([getEmployees(), getDepartments()]);
  } catch {
    // Return empty arrays on error — page still renders
  }

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.isActive).length;

  const newJoiners = [...employees]
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .slice(0, 6);

  const deptMap = new Map<string, number>();
  for (const emp of employees) {
    const name = emp.department?.name ?? "Other";
    deptMap.set(name, (deptMap.get(name) ?? 0) + 1);
  }
  const deptBreakdown = Array.from(deptMap.entries())
    .map(([name, count], i) => ({ name, count, color: DEPT_COLORS[i % DEPT_COLORS.length] }))
    .sort((a, b) => b.count - a.count);

  const etMap = new Map<string, number>();
  for (const emp of employees) {
    const t = emp.employmentType ?? "Full-time";
    etMap.set(t, (etMap.get(t) ?? 0) + 1);
  }
  const etBreakdown = employmentTypes.map((et) => ({
    ...et,
    count: etMap.get(et.label) ?? 0,
    pct: totalEmployees > 0 ? Math.round(((etMap.get(et.label) ?? 0) / totalEmployees) * 100) : 0,
  }));

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <nav className="mb-1 flex items-center gap-1.5 text-sm text-dark-5 dark:text-dark-6">
            <Link href="/" className="hover:text-primary-600">Dashboard</Link>
            <span>/</span>
            <span className="text-dark dark:text-white">Employees</span>
          </nav>
          <h1 className="text-2xl font-bold text-dark dark:text-white">Employees</h1>
          <p className="mt-0.5 text-sm text-dark-5 dark:text-dark-6">{totalEmployees} employees</p>
        </div>
      </div>

      <EmployeesKpiRow
        totalEmployees={totalEmployees}
        activeEmployees={activeEmployees}
        deptCount={deptBreakdown.length}
      />

      <EmployeesDeptBreakdown
        totalEmployees={totalEmployees}
        deptBreakdown={deptBreakdown}
        etBreakdown={etBreakdown}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <EmployeesRecentJoiners newJoiners={newJoiners} deptBadgeColor={deptBadgeColor} />
        <EmployeesActionItems />
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-dark dark:text-white">All Employees</h2>
            <p className="mt-0.5 text-sm text-dark-5 dark:text-dark-6">Search, filter, and manage your full workforce</p>
          </div>
        </div>
        <EmployeeDirectory employees={employees} departments={departments} totalCount={totalEmployees} />
      </div>
    </div>
  );
}
