"use client";

import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";

type DeptHealth = { name: string; headcount: number };

type LeadershipData = {
  totalEmployees: number;
  deptHealth: DeptHealth[];
  totalPayroll: number;
  pendingLeave: number;
  openJobs: number;
  taskMap: Record<string, number>;
};

const DEPT_COLORS = [
  "bg-emerald-50 text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-300",
  "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber",
  "bg-violet-light text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300",
  "bg-rose-light text-rose-dark dark:bg-rose-dark/20 dark:text-rose",
];

export function LeadershipDashboardClient({ data, orgName }: Readonly<{ data: LeadershipData; orgName: string }>) {
  const { toast, setToast } = useToast();

  const done = data.taskMap["DONE"] ?? 0;
  const total = Object.values(data.taskMap).reduce((a, b) => a + b, 0);
  const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

  const formattedPayroll = data.totalPayroll > 0
    ? `₹${(data.totalPayroll / 100000).toFixed(1)}L`
    : "N/A";

  return (
    <div className="page-container">
      {/* Section 1: Executive Header */}
      <div className="bg-gradient-to-r from-slate-800 to-primary-900 text-white rounded-xl p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <h1 className="page-title text-white">{orgName} · Executive Overview</h1>
            <p className="mt-0.5 text-sm text-white/70">
              {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })} · Q2 Performance
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white">
                {data.totalEmployees} Employees
              </span>
              <span className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white">
                {data.openJobs} Open Roles
              </span>
              <span className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white">
                {data.pendingLeave} Pending Approvals
              </span>
              {data.totalPayroll > 0 && (
                <span className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white">
                  {formattedPayroll} Monthly Payroll
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <p className="text-xs text-white/50">
              Last updated: {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} IST
            </p>
            <button
              onClick={() => {
                const lines = [
                  `Executive Report — ${new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}`,
                  `Organization: ${orgName}`,
                  "",
                  "KPIs",
                  `Total Employees,${data.totalEmployees}`,
                  `Open Positions,${data.openJobs}`,
                  `Pending Leave Approvals,${data.pendingLeave}`,
                  `Task Completion Rate,${completionRate}%`,
                  `Monthly Payroll,${formattedPayroll}`,
                  "",
                  "Department Headcount",
                  "Department,Headcount",
                  ...data.deptHealth.map((d) => `${d.name},${d.headcount}`),
                ];
                const blob = new Blob([lines.join("\n")], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `executive-report-${new Date().toISOString().slice(0, 7)}.csv`;
                a.click();
                URL.revokeObjectURL(url);
                setToast("Executive report downloaded!");
              }}
              className="rounded-lg border border-white/40 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
            >
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Section 2: KPI Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
        <div className="card p-5 border-t-4 border-primary-500">
          <p className="text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Total Employees</p>
          <p className="mt-2 text-3xl font-bold text-primary-600">{data.totalEmployees}</p>
          <p className="text-muted mt-1">Active headcount</p>
        </div>

        <div className="card p-5 border-t-4 border-emerald-500">
          <p className="text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Task Completion</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">{completionRate}%</p>
          <p className="text-muted mt-1">{done} of {total} tasks</p>
        </div>

        <div className="card p-5 border-t-4 border-amber-500">
          <p className="text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Open Positions</p>
          <p className="mt-2 text-3xl font-bold text-amber-600">{data.openJobs}</p>
          <p className="text-muted mt-1">Active job postings</p>
        </div>

        <div className="card p-5 border-t-4 border-violet-500">
          <p className="text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Departments</p>
          <p className="mt-2 text-3xl font-bold text-violet-600">{data.deptHealth.length}</p>
          <p className="text-muted mt-1">Active departments</p>
        </div>
      </div>

      {/* Section 3: Org Layout */}
      <div className="grid gap-4 md:grid-cols-12 md:gap-6">
        {/* Department Headcount */}
        <div className="md:col-span-7 card-p">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Department Headcount</h2>
            <Link href="/employees" className="text-xs text-primary-600 hover:underline dark:text-primary-400">View All →</Link>
          </div>

          {data.deptHealth.length === 0 ? (
            <p className="text-sm text-dark-5 dark:text-dark-6">No department data yet.</p>
          ) : (
            <div className="space-y-3">
              {data.deptHealth.map((dept, idx) => (
                <div key={dept.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-body-medium">{dept.name}</span>
                    <span className="text-muted font-semibold">{dept.headcount}</span>
                  </div>
                  <div className="relative h-2 rounded-full bg-gray-2 dark:bg-dark-3 overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-primary-500"
                      style={{ width: data.totalEmployees > 0 ? `${Math.round((dept.headcount / data.totalEmployees) * 100)}%` : "0%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Department Health + Payroll Snapshot */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <div className="card-p">
            <h2 className="section-title mb-3">Department Overview</h2>
            <div className="space-y-2.5">
              {data.deptHealth.slice(0, 6).map((dept, idx) => (
                <div key={dept.name} className="flex items-center justify-between">
                  <span className="text-body-medium">{dept.name}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${DEPT_COLORS[idx % DEPT_COLORS.length]}`}>
                    {dept.headcount} people
                  </span>
                </div>
              ))}
              {data.deptHealth.length === 0 && (
                <p className="text-muted">No departments yet.</p>
              )}
            </div>
          </div>

          <div className="card-p">
            <h2 className="section-title mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/employees" className="flex items-center gap-2 rounded-lg border border-gray-3 p-2.5 text-xs font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3">
                <span>👥</span> Employees
              </Link>
              <Link href="/reports" className="flex items-center gap-2 rounded-lg border border-gray-3 p-2.5 text-xs font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3">
                <span>📊</span> Reports
              </Link>
              <Link href="/payroll" className="flex items-center gap-2 rounded-lg border border-gray-3 p-2.5 text-xs font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3">
                <span>💰</span> Payroll
              </Link>
              <Link href="/recruitment" className="flex items-center gap-2 rounded-lg border border-gray-3 p-2.5 text-xs font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3">
                <span>🎯</span> Recruitment
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Toast message={toast} />
    </div>
  );
}
