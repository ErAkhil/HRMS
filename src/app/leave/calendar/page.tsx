import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team Leave Calendar",
};

interface LeaveEvent {
  id: number;
  name: string;
  dept: string;
  startDay: number;
  endDay: number;
  color: string;
}

const leaveEvents: LeaveEvent[] = [
  { id: 1, name: "Sarah M.", dept: "Engineering",  startDay: 1,  endDay: 3,  color: "bg-primary-600" },
  { id: 2, name: "Daniel P.", dept: "Engineering", startDay: 7,  endDay: 8,  color: "bg-primary-600" },
  { id: 3, name: "Priya S.", dept: "Design",       startDay: 5,  endDay: 9,  color: "bg-violet-500" },
  { id: 4, name: "Elena T.", dept: "HR",           startDay: 12, endDay: 14, color: "bg-emerald-500" },
  { id: 5, name: "Marcus J.", dept: "DevOps",      startDay: 15, endDay: 16, color: "bg-amber-400" },
  { id: 6, name: "Zara A.", dept: "Marketing",     startDay: 19, endDay: 23, color: "bg-sky-dark" },
  { id: 7, name: "Tom B.", dept: "Sales",          startDay: 8,  endDay: 8,  color: "bg-rose-500" },
  { id: 8, name: "Nina P.", dept: "Engineering",   startDay: 26, endDay: 30, color: "bg-primary-600" },
  { id: 9, name: "Kevin L.", dept: "Finance",      startDay: 1,  endDay: 5,  color: "bg-orange-400" },
  { id: 10, name: "Lisa C.", dept: "Design",       startDay: 22, endDay: 25, color: "bg-violet-500" },
];

const deptColors: { dept: string; color: string; bg: string }[] = [
  { dept: "Engineering", color: "bg-primary-600", bg: "bg-primary-50 dark:bg-primary-900/20" },
  { dept: "Design",      color: "bg-violet-500",  bg: "bg-violet-100 dark:bg-violet-dark/20" },
  { dept: "HR",          color: "bg-emerald-500", bg: "bg-emerald-light dark:bg-emerald-dark/20" },
  { dept: "DevOps",      color: "bg-amber-400",   bg: "bg-amber-light dark:bg-amber-dark/20" },
  { dept: "Marketing",   color: "bg-sky-dark",    bg: "bg-sky-50 dark:bg-sky-dark/10" },
  { dept: "Sales",       color: "bg-rose-500",    bg: "bg-rose-light dark:bg-rose-dark/20" },
  { dept: "Finance",     color: "bg-orange-400",  bg: "bg-orange-50 dark:bg-orange-900/20" },
];

// May 2026 starts on Friday
// weeks: Sun Mon Tue Wed Thu Fri Sat
// May 1 = Friday (index 5)
const calendarDays: (number | null)[] = [
  null, null, null, null, null, 1, 2,
  3, 4, 5, 6, 7, 8, 9,
  10, 11, 12, 13, 14, 15, 16,
  17, 18, 19, 20, 21, 22, 23,
  24, 25, 26, 27, 28, 29, 30,
  31, null, null, null, null, null, null,
];

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getEventsForDay(day: number): LeaveEvent[] {
  return leaveEvents.filter((e) => day >= e.startDay && day <= e.endDay);
}

export default function TeamLeaveCalendarPage() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-dark-5 dark:text-dark-6 mb-1">
            <Link href="/leave" className="hover:text-primary-600">Leave</Link>
            <span>/</span>
            <span>Calendar</span>
          </div>
          <h1 className="text-heading-5 font-bold text-dark dark:text-white">Team Leave Calendar</h1>
          <p className="text-xs text-dark-5 dark:text-dark-6 mt-0.5">
            <span className="text-sm font-semibold text-dark dark:text-white">14</span> employees on leave this month
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-lg border border-gray-3 px-4 py-2 text-sm font-medium text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6 flex items-center gap-1.5">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Apr 2026
          </button>
          <span className="text-sm font-semibold text-dark dark:text-white px-2">May 2026</span>
          <button className="rounded-lg border border-gray-3 px-4 py-2 text-sm font-medium text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6 flex items-center gap-1.5">
            Jun 2026
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Summary bar */}
      <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs text-dark-5 dark:text-dark-6 mr-2">Department Legend:</p>
          {deptColors.map((d) => (
            <div key={d.dept} className="flex items-center gap-1.5">
              <span className={`h-2.5 w-2.5 rounded-full ${d.color}`} />
              <span className="text-xs text-dark-5 dark:text-dark-6">{d.dept}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar grid */}
      <div className="rounded-xl bg-white shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 overflow-hidden">
        {/* Day labels */}
        <div className="grid grid-cols-7 border-b border-gray-3 dark:border-dark-3">
          {dayLabels.map((d) => (
            <div key={d} className="py-3 text-center text-xs font-semibold text-dark-5 dark:text-dark-6">
              {d}
            </div>
          ))}
        </div>

        {/* Weeks */}
        {Array.from({ length: 6 }).map((_, weekIdx) => (
          <div key={weekIdx} className="grid grid-cols-7 border-b border-gray-3 dark:border-dark-3 last:border-0">
            {calendarDays.slice(weekIdx * 7, weekIdx * 7 + 7).map((day, dayIdx) => {
              const events = day ? getEventsForDay(day) : [];
              const isToday = day === 7; // May 7 = today
              return (
                <div
                  key={dayIdx}
                  className={`min-h-[90px] p-2 border-r border-gray-3 dark:border-dark-3 last:border-r-0 ${
                    day === null ? "bg-gray-1 dark:bg-dark-3/30" : ""
                  }`}
                >
                  {day !== null && (
                    <>
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium mb-1 ${
                          isToday
                            ? "bg-primary-600 text-white"
                            : "text-dark dark:text-white"
                        }`}
                      >
                        {day}
                      </span>
                      <div className="space-y-0.5">
                        {events.slice(0, 2).map((evt) => (
                          <div
                            key={evt.id}
                            className={`rounded px-1.5 py-0.5 text-[10px] font-medium text-white truncate ${evt.color}`}
                            title={`${evt.name} (${evt.dept})`}
                          >
                            {evt.name}
                          </div>
                        ))}
                        {events.length > 2 && (
                          <div className="text-[10px] text-dark-5 dark:text-dark-6 px-1">
                            +{events.length - 2} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Leave list */}
      <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <h3 className="text-sm font-semibold text-dark dark:text-white mb-4">All Leave Events — May 2026</h3>
        <div className="space-y-2">
          {leaveEvents.map((evt) => (
            <div key={evt.id} className="flex items-center justify-between py-2 border-b border-gray-3 dark:border-dark-3 last:border-0">
              <div className="flex items-center gap-2.5">
                <span className={`h-2.5 w-2.5 rounded-full ${evt.color} shrink-0`} />
                <div>
                  <p className="text-sm font-medium text-dark dark:text-white">{evt.name}</p>
                  <p className="text-xs text-dark-5 dark:text-dark-6">{evt.dept}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-dark dark:text-white">
                  May {evt.startDay}{evt.startDay !== evt.endDay ? ` – May ${evt.endDay}` : ""}
                </p>
                <p className="text-xs text-dark-5 dark:text-dark-6">
                  {evt.endDay - evt.startDay + 1} day{evt.endDay - evt.startDay + 1 > 1 ? "s" : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
