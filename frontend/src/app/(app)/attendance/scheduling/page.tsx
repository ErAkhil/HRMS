import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getEmployees } from "@/lib/actions/employees";

export const metadata: Metadata = { title: "Shift Scheduling" };

type ShiftType = "Morning" | "Evening" | "Night" | "Off" | "Not Set";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const shiftStyles: Record<ShiftType, string> = {
  Morning: "rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  Evening: "rounded-full bg-amber-light px-2.5 py-0.5 text-xs font-medium text-amber-dark dark:bg-amber-dark/20 dark:text-amber",
  Night: "rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-dark dark:bg-sky-dark/10 dark:text-sky",
  Off: "rounded-full bg-gray-2 px-2.5 py-0.5 text-xs font-medium text-dark-5 dark:bg-dark-3 dark:text-dark-6",
  "Not Set": "rounded-full bg-gray-2 px-2.5 py-0.5 text-xs font-medium text-dark-5 dark:bg-dark-3 dark:text-dark-6",
};

const shiftLegend: { type: ShiftType; time: string }[] = [
  { type: "Morning", time: "8:00 AM – 4:00 PM" },
  { type: "Evening", time: "4:00 PM – 12:00 AM" },
  { type: "Night", time: "12:00 AM – 8:00 AM" },
  { type: "Off", time: "No shift assigned" },
];

function getCurrentWeekLabel() {
  const now = new Date();
  const day = now.getDay();
  const diffToMon = (day === 0 ? -6 : 1 - day);
  const mon = new Date(now);
  mon.setDate(now.getDate() + diffToMon);
  const sun = new Date(mon);
  sun.setDate(mon.getDate() + 6);

  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const year = sun.getFullYear();
  return `${fmt(mon)} – ${fmt(sun)}, ${year}`;
}

export default async function SchedulingPage() {
  const employees = await getEmployees().catch(() => []);
  const weekLabel = getCurrentWeekLabel();

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-dark-5 dark:text-dark-6 mb-1">
            <Link href="/attendance" className="hover:text-primary-600">Attendance</Link>
            <span>/</span>
            <span>Scheduling</span>
          </div>
          <h1 className="text-heading-5 font-bold text-dark dark:text-white">Shift Scheduling</h1>
          <p className="text-xs text-dark-5 dark:text-dark-6 mt-0.5">Weekly shift overview for all employees</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-lg border border-gray-3 px-4 py-2 text-sm font-medium text-dark-5 dark:border-dark-3 dark:text-dark-6">
            {weekLabel}
          </span>
        </div>
      </div>

      <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <h3 className="text-sm font-semibold text-dark dark:text-white mb-3">Shift Types</h3>
        <div className="flex flex-wrap gap-4">
          {shiftLegend.map((item) => (
            <div key={item.type} className="flex items-center gap-2">
              <span className={shiftStyles[item.type]}>{item.type}</span>
              <span className="text-xs text-dark-5 dark:text-dark-6">{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-white shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-3 dark:border-dark-3 px-5 py-4">
          <h3 className="text-sm font-semibold text-dark dark:text-white">
            Weekly Schedule — {weekLabel}
          </h3>
          <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-600 dark:bg-primary-900/20 dark:text-primary-300">
            {employees.length} employees
          </span>
        </div>

        {employees.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm font-medium text-dark dark:text-white">No employees found</p>
            <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">Add employees to manage shift scheduling.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-3 dark:border-dark-3">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6 w-52">Employee</th>
                  {days.map((day) => (
                    <th key={day} className="px-3 py-3 text-center text-xs font-semibold text-dark-5 dark:text-dark-6">{day}</th>
                  ))}
                  <th className="px-5 py-3 text-center text-xs font-semibold text-dark-5 dark:text-dark-6">Dept</th>
                </tr>
              </thead>
              <tbody>
                {employees.slice(0, 20).map((emp) => (
                  <tr key={emp.id} className="border-b border-gray-3 last:border-0 hover:bg-gray-1 dark:border-dark-3 dark:hover:bg-dark-3">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <Image
                          src={emp.avatarUrl ?? "/images/user/default-avatar.png"}
                          alt={`${emp.firstName} ${emp.lastName}`}
                          width={32}
                          height={32}
                          className="rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-dark dark:text-white">{emp.firstName} {emp.lastName}</p>
                          <p className="text-xs text-dark-5 dark:text-dark-6">{emp.title}</p>
                        </div>
                      </div>
                    </td>
                    {days.map((day) => (
                      <td key={day} className="px-3 py-3 text-center">
                        <span className={shiftStyles["Not Set"]}>—</span>
                      </td>
                    ))}
                    <td className="px-5 py-3 text-center">
                      <span className="text-xs text-dark-5 dark:text-dark-6">{emp.department?.name ?? "—"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 dark:bg-amber-900/10 dark:border-amber-800">
        <div className="flex items-start gap-3">
          <svg className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Shift Assignment Coming Soon</p>
            <p className="mt-0.5 text-xs text-amber-700 dark:text-amber-400">
              Individual shift assignment and editing will be available in the next release. Employee roster is pulled live from the system.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
