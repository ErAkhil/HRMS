import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shift Scheduling",
};

type ShiftType = "Morning" | "Evening" | "Night" | "Off";

interface ScheduleEmployee {
  id: number;
  name: string;
  role: string;
  avatar: string;
  shifts: ShiftType[];
}

const schedule: ScheduleEmployee[] = [
  {
    id: 1, name: "Sarah Mitchell", role: "Product Manager", avatar: "/images/user/user-01.png",
    shifts: ["Morning", "Morning", "Morning", "Morning", "Morning", "Off", "Off"],
  },
  {
    id: 2, name: "Daniel Park", role: "Frontend Engineer", avatar: "/images/user/user-02.png",
    shifts: ["Morning", "Morning", "Off", "Morning", "Morning", "Off", "Off"],
  },
  {
    id: 3, name: "Priya Sharma", role: "UX Designer", avatar: "/images/user/user-03.png",
    shifts: ["Evening", "Evening", "Evening", "Evening", "Evening", "Off", "Off"],
  },
  {
    id: 4, name: "James Williams", role: "Backend Engineer", avatar: "/images/user/user-04.png",
    shifts: ["Morning", "Night", "Morning", "Morning", "Off", "Off", "Off"],
  },
  {
    id: 5, name: "Marcus Johnson", role: "DevOps Engineer", avatar: "/images/user/user-07.png",
    shifts: ["Night", "Night", "Night", "Night", "Night", "Off", "Off"],
  },
  {
    id: 6, name: "Zara Ahmed", role: "Marketing Lead", avatar: "/images/user/user-08.png",
    shifts: ["Morning", "Morning", "Evening", "Morning", "Morning", "Off", "Off"],
  },
  {
    id: 7, name: "Tom Bradley", role: "Sales Manager", avatar: "/images/user/user-09.png",
    shifts: ["Off", "Morning", "Morning", "Morning", "Morning", "Morning", "Off"],
  },
  {
    id: 8, name: "Nina Patel", role: "QA Engineer", avatar: "/images/user/user-10.png",
    shifts: ["Evening", "Evening", "Off", "Evening", "Evening", "Off", "Off"],
  },
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const shiftStyles: Record<ShiftType, string> = {
  Morning: "rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  Evening: "rounded-full bg-amber-light px-2.5 py-0.5 text-xs font-medium text-amber-dark dark:bg-amber-dark/20 dark:text-amber",
  Night: "rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-dark dark:bg-sky-dark/10 dark:text-sky",
  Off: "rounded-full bg-gray-2 px-2.5 py-0.5 text-xs font-medium text-dark-5 dark:bg-dark-3 dark:text-dark-6",
};

const shiftLegend: { type: ShiftType; time: string }[] = [
  { type: "Morning", time: "8:00 AM – 4:00 PM" },
  { type: "Evening", time: "4:00 PM – 12:00 AM" },
  { type: "Night", time: "12:00 AM – 8:00 AM" },
  { type: "Off", time: "No shift assigned" },
];

export default function SchedulingPage() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-dark-5 dark:text-dark-6 mb-1">
            <Link href="/attendance" className="hover:text-primary-600">Attendance</Link>
            <span>/</span>
            <span>Scheduling</span>
          </div>
          <h1 className="text-heading-5 font-bold text-dark dark:text-white">Shift Scheduling</h1>
          <p className="text-xs text-dark-5 dark:text-dark-6 mt-0.5">Manage weekly shifts for all employees</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-lg border border-gray-3 px-4 py-2 text-sm font-medium text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6">
            May 5–11, 2026
          </button>
          <button className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 flex items-center gap-1.5">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Shift
          </button>
        </div>
      </div>

      {/* Shift Types Legend */}
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

      {/* Schedule Grid */}
      <div className="rounded-xl bg-white shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 overflow-hidden">
        <div className="p-5 border-b border-gray-3 dark:border-dark-3">
          <h3 className="text-sm font-semibold text-dark dark:text-white">Weekly Schedule — May 5–11, 2026</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-3 dark:border-dark-3">
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6 w-52">Employee</th>
                {days.map((day) => (
                  <th key={day} className="px-3 py-3 text-center text-xs font-semibold text-dark-5 dark:text-dark-6">
                    {day}
                  </th>
                ))}
                <th className="px-5 py-3 text-center text-xs font-semibold text-dark-5 dark:text-dark-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((emp) => (
                <tr key={emp.id} className="border-b border-gray-3 last:border-0 hover:bg-gray-1 dark:border-dark-3 dark:hover:bg-dark-3">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <Image
                        src={emp.avatar}
                        alt={emp.name}
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-dark dark:text-white">{emp.name}</p>
                        <p className="text-xs text-dark-5 dark:text-dark-6">{emp.role}</p>
                      </div>
                    </div>
                  </td>
                  {emp.shifts.map((shift, i) => (
                    <td key={i} className="px-3 py-3 text-center">
                      <span className={shiftStyles[shift]}>{shift}</span>
                    </td>
                  ))}
                  <td className="px-5 py-3 text-center">
                    <button className="rounded-lg border border-gray-3 px-3 py-1.5 text-xs font-medium text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Morning Shifts", count: 32, color: "text-emerald-dark dark:text-emerald" },
          { label: "Evening Shifts", count: 16, color: "text-amber-dark dark:text-amber" },
          { label: "Night Shifts", count: 8, color: "text-sky-dark dark:text-sky" },
          { label: "Days Off", count: 24, color: "text-dark-5 dark:text-dark-6" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 text-center">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
            <p className="text-xs text-dark-5 dark:text-dark-6 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
