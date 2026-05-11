import Link from "next/link";
import { getOrgChartData, getDepartments } from "@/lib/actions/employees";
import { OrgTree } from "./_components/org-tree";

export const metadata = { title: "Org Chart" };

export default async function OrgChartPage() {
  const [employees, departments] = await Promise.all([
    getOrgChartData().catch(() => []),
    getDepartments().catch(() => []),
  ]);

  const totalEmployees = employees.length;

  const deptCountMap = new Map<string, number>();
  for (const emp of employees) {
    const name = emp.department?.name ?? "Other";
    deptCountMap.set(name, (deptCountMap.get(name) ?? 0) + 1);
  }

  const deptStats = departments.map((d) => ({ name: d.name, count: deptCountMap.get(d.name) ?? 0 }));

  const DEPT_BADGE_COLORS: Record<string, string> = {
    Engineering: "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-300",
    Product: "bg-violet-light text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300",
    Finance: "bg-sky-50 text-sky-dark dark:bg-sky-dark/10 dark:text-sky",
    HR: "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber",
    Sales: "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
    Operations: "bg-rose-light text-rose-dark dark:bg-rose-dark/20 dark:text-rose",
  };

  const DEPT_COUNT_COLORS: Record<string, string> = {
    Engineering: "text-primary-600 dark:text-primary-300",
    Product: "text-violet-dark dark:text-violet-300",
    Finance: "text-sky-dark dark:text-sky",
    HR: "text-amber-dark dark:text-amber",
    Sales: "text-emerald-dark dark:text-emerald",
    Operations: "text-rose-dark dark:text-rose",
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <nav className="mb-1 flex items-center gap-1.5 text-xs text-dark-5 dark:text-dark-6">
            <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400">Dashboard</Link>
            <span>/</span>
            <Link href="/employees" className="hover:text-primary-600 dark:hover:text-primary-400">Employees</Link>
            <span>/</span>
            <span className="text-dark dark:text-white">Org Chart</span>
          </nav>
          <h1 className="text-xl font-bold text-dark dark:text-white">Org Chart</h1>
          <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">
            {totalEmployees} employees · {deptStats.filter(d => d.count > 0).length} departments
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 rounded-xl bg-white px-5 py-3 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <p className="text-xs font-semibold text-dark dark:text-white">Departments:</p>
        {deptStats.filter(d => d.count > 0).map((dept) => (
          <span key={dept.name} className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${DEPT_BADGE_COLORS[dept.name] ?? "bg-gray-100 text-gray-600"}`}>
            {dept.name}
          </span>
        ))}
      </div>

      <div className="rounded-xl bg-white p-6 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 overflow-x-auto">
        <OrgTree employees={employees} />
      </div>

      {deptStats.filter(d => d.count > 0).length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {deptStats.filter(d => d.count > 0).slice(0, 4).map((item) => (
            <div key={item.name} className="rounded-xl bg-white p-4 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
              <p className={`text-2xl font-bold ${DEPT_COUNT_COLORS[item.name] ?? "text-dark dark:text-white"}`}>{item.count}</p>
              <p className="mt-0.5 text-xs font-medium text-dark dark:text-white">{item.name}</p>
              <p className="text-[10px] text-dark-5 dark:text-dark-6">employees</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
