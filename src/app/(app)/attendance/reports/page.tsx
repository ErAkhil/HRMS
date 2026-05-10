import Link from "next/link";
import type { Metadata } from "next";
import { getDeptAttendanceReport } from "@/lib/actions/attendance";

export const metadata: Metadata = { title: "Attendance Reports" };

function getRateColor(pct: number, invert = false): string {
  if (invert) {
    if (pct <= 3) return "text-emerald-dark dark:text-emerald";
    if (pct <= 7) return "text-amber-dark dark:text-amber";
    return "text-rose-dark dark:text-rose";
  }
  if (pct >= 95) return "text-emerald-dark dark:text-emerald";
  if (pct >= 88) return "text-amber-dark dark:text-amber";
  return "text-rose-dark dark:text-rose";
}

export default async function AttendanceReportsPage() {
  const now = new Date();
  const rows = await getDeptAttendanceReport(now.getMonth() + 1, now.getFullYear()).catch(() => []);

  const avgPresent = rows.length > 0
    ? Math.round(rows.reduce((s, r) => s + r.presentPct, 0) / rows.length * 10) / 10
    : 0;
  const avgHours = rows.length > 0
    ? Math.round(rows.reduce((s, r) => s + r.avgHours, 0) / rows.length * 10) / 10
    : 0;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-dark-5 dark:text-dark-6 mb-1">
            <Link href="/attendance" className="hover:text-primary-600">Attendance</Link>
            <span>/</span>
            <span>Reports</span>
          </div>
          <h1 className="text-heading-5 font-bold text-dark dark:text-white">Attendance Reports</h1>
          <p className="text-xs text-dark-5 dark:text-dark-6 mt-0.5">
            {now.toLocaleString("en-US", { month: "long", year: "numeric" })} — department breakdown
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-gray-1 dark:bg-dark-3 p-4">
            <p className="text-xs text-dark-5 dark:text-dark-6">Avg Attendance Rate</p>
            <p className="mt-1 text-3xl font-bold text-emerald-dark dark:text-emerald">{avgPresent}%</p>
            <div className="mt-3 h-2 rounded-full bg-gray-3 dark:bg-dark-4 overflow-hidden">
              <div className="h-full rounded-full bg-emerald" style={{ width: `${avgPresent}%` }} />
            </div>
          </div>
          <div className="rounded-lg bg-gray-1 dark:bg-dark-3 p-4">
            <p className="text-xs text-dark-5 dark:text-dark-6">Avg Working Hours</p>
            <p className="mt-1 text-3xl font-bold text-primary-600 dark:text-primary-400">{avgHours}h</p>
            <div className="mt-3 h-2 rounded-full bg-gray-3 dark:bg-dark-4 overflow-hidden">
              <div className="h-full rounded-full bg-primary-600" style={{ width: `${Math.min(100, (avgHours / 10) * 100)}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 overflow-hidden">
        <div className="p-5 border-b border-gray-3 dark:border-dark-3">
          <h3 className="text-sm font-semibold text-dark dark:text-white">Department-wise Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          {rows.length === 0 ? (
            <p className="p-8 text-center text-sm text-dark-5 dark:text-dark-6">No attendance data for this month.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-3 dark:border-dark-3 bg-gray-1 dark:bg-dark-3/50">
                  {["Department", "Employees", "Present %", "Avg Hours", "Late %", "Remote %"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.dept} className="border-b border-gray-3 last:border-0 hover:bg-gray-1 dark:border-dark-3 dark:hover:bg-dark-3/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-primary-600">{row.dept.slice(0, 2).toUpperCase()}</span>
                        </div>
                        <span className="font-medium text-dark dark:text-white">{row.dept}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-dark-5 dark:text-dark-6">{row.employeeCount}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 rounded-full bg-gray-3 dark:bg-dark-3 overflow-hidden">
                          <div className="h-full rounded-full bg-emerald" style={{ width: `${row.presentPct}%` }} />
                        </div>
                        <span className={`font-semibold ${getRateColor(row.presentPct)}`}>{row.presentPct}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-dark dark:text-white">{row.avgHours}h</td>
                    <td className="px-5 py-3.5">
                      <span className={`font-semibold ${getRateColor(row.latePct, true)}`}>{row.latePct}%</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 rounded-full bg-gray-3 dark:bg-dark-3 overflow-hidden">
                          <div className="h-full rounded-full bg-violet-500" style={{ width: `${row.remotePct}%` }} />
                        </div>
                        <span className="text-dark dark:text-white">{row.remotePct}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
