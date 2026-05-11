"use client";

import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";

type DeptData = { name: string; count: number };

type ReportsData = {
  totalEmployees: number;
  openJobs: number;
  deptData: DeptData[];
  leaveMap: Record<string, number>;
  taskMap: Record<string, number>;
};

export function ReportsClient({ data }: Readonly<{ data: ReportsData }>) {
  const { toast, setToast } = useToast();

  const maxCount = data.deptData.length > 0 ? Math.max(...data.deptData.map((d) => d.count), 1) : 1;
  const approvedLeave = data.leaveMap["APPROVED"] ?? 0;
  const pendingLeave = data.leaveMap["PENDING"] ?? 0;
  const doneTasks = data.taskMap["DONE"] ?? 0;
  const totalTasks = Object.values(data.taskMap).reduce((a, b) => a + b, 0);
  const taskCompletionRate = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-dark dark:text-white">Reports & Analytics</h1>
          <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">Workforce intelligence · Live data</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setToast("Report scheduled for weekly delivery!")}
            className="rounded-lg border border-gray-3 px-4 py-2 text-sm font-medium text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6"
          >
            Schedule
          </button>
          <button
            onClick={() => setToast("Workforce report exported successfully!")}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 flex items-center gap-1.5"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Total Headcount", value: data.totalEmployees.toString(), change: "Active employees", up: true, bg: "bg-primary-50 dark:bg-primary-900/20", color: "text-primary-600 dark:text-primary-300" },
          { label: "Open Positions", value: data.openJobs.toString(), change: "Active job postings", up: data.openJobs === 0, bg: "bg-amber-light dark:bg-amber-dark/20", color: "text-amber-dark" },
          { label: "Task Completion", value: `${taskCompletionRate}%`, change: `${doneTasks} of ${totalTasks} tasks done`, up: taskCompletionRate > 50, bg: "bg-emerald-light dark:bg-emerald-dark/20", color: "text-emerald-dark dark:text-emerald" },
          { label: "Leaves (Approved)", value: approvedLeave.toString(), change: `${pendingLeave} pending review`, up: true, bg: "bg-violet-light dark:bg-violet-dark/20", color: "text-violet-dark dark:text-violet-300" },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
            <div className={`mb-3 inline-flex rounded-lg p-2 ${kpi.bg}`}>
              <span className={`text-lg ${kpi.color}`}>📊</span>
            </div>
            <p className="text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">{kpi.label}</p>
            <p className={`mt-1 text-3xl font-bold ${kpi.color}`}>{kpi.value}</p>
            <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">{kpi.change}</p>
          </div>
        ))}
      </div>

      {/* Department Breakdown */}
      <div className="grid gap-4 md:grid-cols-12">
        <div className="md:col-span-7 rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-dark dark:text-white">Headcount by Department</h2>
            <Link href="/employees" className="text-xs text-primary-600 hover:underline dark:text-primary-400">View All →</Link>
          </div>
          {data.deptData.length === 0 ? (
            <p className="text-sm text-dark-5 dark:text-dark-6">No department data yet.</p>
          ) : (
            <div className="space-y-3">
              {data.deptData.map((dept) => (
                <div key={dept.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-dark dark:text-white">{dept.name}</span>
                    <span className="text-sm font-semibold text-dark dark:text-white">{dept.count}</span>
                  </div>
                  <div className="relative h-2 rounded-full bg-gray-2 dark:bg-dark-3 overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-primary-500"
                      style={{ width: `${Math.round((dept.count / maxCount) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="md:col-span-5 flex flex-col gap-4">
          {/* Leave Summary */}
          <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
            <h2 className="font-semibold text-dark dark:text-white mb-3">Leave Summary</h2>
            <div className="space-y-2">
              {[
                { label: "Approved", count: data.leaveMap["APPROVED"] ?? 0, color: "text-emerald-dark dark:text-emerald", bg: "bg-emerald-light dark:bg-emerald-dark/20" },
                { label: "Pending", count: data.leaveMap["PENDING"] ?? 0, color: "text-amber-dark", bg: "bg-amber-light dark:bg-amber-dark/20" },
                { label: "Rejected", count: data.leaveMap["REJECTED"] ?? 0, color: "text-rose-dark", bg: "bg-rose-light dark:bg-rose-dark/20" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-dark-5 dark:text-dark-6">{item.label}</span>
                  <span className={`rounded-full px-3 py-0.5 text-sm font-semibold ${item.bg} ${item.color}`}>
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
            <Link href="/leave/approvals" className="mt-3 block text-xs font-medium text-primary-600 hover:underline dark:text-primary-400">
              View all leave requests →
            </Link>
          </div>

          {/* Task Summary */}
          <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
            <h2 className="font-semibold text-dark dark:text-white mb-3">Task Summary</h2>
            <div className="space-y-2">
              {[
                { label: "To Do", count: data.taskMap["TODO"] ?? 0 },
                { label: "In Progress", count: data.taskMap["IN_PROGRESS"] ?? 0 },
                { label: "In Review", count: data.taskMap["IN_REVIEW"] ?? 0 },
                { label: "Done", count: data.taskMap["DONE"] ?? 0 },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <span className="text-dark-5 dark:text-dark-6">{item.label}</span>
                  <span className="font-semibold text-dark dark:text-white">{item.count}</span>
                </div>
              ))}
            </div>
            <Link href="/tasks" className="mt-3 block text-xs font-medium text-primary-600 hover:underline dark:text-primary-400">
              View all tasks →
            </Link>
          </div>
        </div>
      </div>

      <Toast message={toast} />
    </div>
  );
}
