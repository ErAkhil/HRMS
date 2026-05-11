"use client";

import { useState } from "react";
import { getCalendarData } from "@/lib/actions/reports";

type LeaveEvent = {
  id: string;
  type: "leave";
  title: string;
  status: string;
  leaveType: string;
  startDate: string;
  endDate: string;
};

type TaskEvent = {
  id: string;
  type: "task";
  title: string;
  status: string;
  priority: string;
  dueDate: string;
  assignee: string | null;
};

type CalendarData = {
  leaveEvents: LeaveEvent[];
  taskEvents: TaskEvent[];
};

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_LABELS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const LEAVE_STATUS_BG: Record<string, string> = {
  APPROVED: "bg-emerald-500",
  PENDING: "bg-amber-400",
  REJECTED: "bg-rose-500",
};

const PRIORITY_BG: Record<string, string> = {
  HIGH: "bg-rose-500",
  MEDIUM: "bg-primary-600",
  LOW: "bg-gray-400",
};

function buildCalendarDays(monthIndex: number, year: number): (number | null)[] {
  const firstDayOfWeek = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  while (days.length % 7 !== 0) days.push(null);
  return days;
}

// Use string comparison to avoid local-vs-UTC timezone mismatch
function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function getLeaveEventsForDay(events: LeaveEvent[], day: number, month: number, year: number) {
  const dayStr = toDateStr(year, month, day);
  return events.filter((e) => {
    const start = e.startDate.slice(0, 10);
    const end = e.endDate.slice(0, 10);
    return dayStr >= start && dayStr <= end;
  });
}

function getTaskEventsForDay(tasks: TaskEvent[], day: number, month: number, year: number) {
  const dayStr = toDateStr(year, month, day);
  return tasks.filter((t) => t.dueDate.slice(0, 10) === dayStr);
}

export function CalendarClient({
  data: initialData,
  currentMonth,
  currentYear,
}: Readonly<{
  data: CalendarData;
  currentMonth: number;
  currentYear: number;
}>) {
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [data, setData] = useState<CalendarData>(initialData);
  const [loading, setLoading] = useState(false);

  const calDays = buildCalendarDays(month, year);
  const today = new Date();

  async function navigate(dir: -1 | 1) {
    let m = month + dir;
    let y = year;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setLoading(true);
    const newData = await getCalendarData(m, y);
    setData(newData);
    setMonth(m);
    setYear(y);
    setLoading(false);
  }

  const totalEvents = data.leaveEvents.length + data.taskEvents.length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-dark dark:text-white">Calendar</h1>
          <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">
            Leave events & task deadlines — {totalEvents} events this month
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            disabled={loading}
            className="rounded-lg border border-gray-3 px-3 py-2 text-sm font-medium text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6 disabled:opacity-50"
          >
            ‹ Prev
          </button>
          <span className="min-w-[140px] text-center text-sm font-semibold text-dark dark:text-white">
            {MONTHS[month]} {year}
          </span>
          <button
            onClick={() => navigate(1)}
            disabled={loading}
            className="rounded-lg border border-gray-3 px-3 py-2 text-sm font-medium text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6 disabled:opacity-50"
          >
            Next ›
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="rounded-xl bg-white shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 bg-primary-600">
          {DAY_LABELS.map((d) => (
            <div key={d} className="py-3 text-center text-xs font-semibold uppercase text-white">
              <span className="hidden sm:block">{d === "Thu" ? "Thursday" : d === "Sun" ? "Sunday" : d === "Mon" ? "Monday" : d === "Tue" ? "Tuesday" : d === "Wed" ? "Wednesday" : d === "Fri" ? "Friday" : "Saturday"}</span>
              <span className="block sm:hidden">{d}</span>
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 border-t border-gray-2 dark:border-dark-3">
          {calDays.map((day, idx) => {
            const leaveEvts = day ? getLeaveEventsForDay(data.leaveEvents, day, month, year) : [];
            const taskEvts = day ? getTaskEventsForDay(data.taskEvents, day, month, year) : [];
            const allEvts = [...leaveEvts, ...taskEvts];
            const isToday = day !== null && today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;

            return (
              <div
                key={idx}
                className={`relative min-h-[90px] border-b border-r border-gray-2 p-1.5 transition-colors hover:bg-gray-1 dark:border-dark-3 dark:hover:bg-dark-3/50 ${!day ? "bg-gray-1 dark:bg-dark-3/30" : "bg-white dark:bg-dark-2"}`}
              >
                {day !== null && (
                  <>
                    <div className={`mb-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                      isToday ? "bg-primary-600 text-white" : "text-dark dark:text-white"
                    }`}>
                      {day}
                    </div>
                    <div className="space-y-0.5">
                      {allEvts.slice(0, 3).map((ev) => {
                        if (ev.type === "leave") {
                          return (
                            <div
                              key={ev.id}
                              title={`${ev.title} — ${ev.leaveType} leave (${ev.status})`}
                              className={`truncate rounded px-1 py-0.5 text-[10px] font-medium text-white ${LEAVE_STATUS_BG[ev.status] ?? "bg-gray-400"}`}
                            >
                              {ev.title}
                            </div>
                          );
                        }
                        return (
                          <div
                            key={ev.id}
                            title={`Task: ${ev.title} (${ev.priority})`}
                            className={`truncate rounded px-1 py-0.5 text-[10px] font-medium text-white ${PRIORITY_BG[ev.priority] ?? "bg-gray-400"}`}
                          >
                            ✓ {ev.title}
                          </div>
                        );
                      })}
                      {allEvts.length > 3 && (
                        <div className="text-[10px] text-dark-5 dark:text-dark-6">+{allEvts.length - 3} more</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        {[
          { label: "Leave Approved", color: "bg-emerald-500" },
          { label: "Leave Pending", color: "bg-amber-400" },
          { label: "Task Due (High)", color: "bg-rose-500" },
          { label: "Task Due (Medium)", color: "bg-primary-600" },
          { label: "Task Due (Low)", color: "bg-gray-400" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span className={`h-3 w-3 rounded-full ${item.color}`} />
            <span className="text-xs text-dark-5 dark:text-dark-6">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Event list */}
      {totalEvents > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {/* Leave events */}
          {data.leaveEvents.length > 0 && (
            <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
              <h2 className="mb-3 font-semibold text-dark dark:text-white">
                Leave Events — {MONTHS[month]}
              </h2>
              <div className="space-y-2">
                {data.leaveEvents.map((ev) => (
                  <div key={ev.id} className="flex items-center justify-between rounded-lg border border-gray-2 p-3 dark:border-dark-3">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${LEAVE_STATUS_BG[ev.status] ?? "bg-gray-400"}`} />
                      <div>
                        <p className="text-sm font-medium text-dark dark:text-white">{ev.title}</p>
                        <p className="text-xs text-dark-5 dark:text-dark-6">
                          {ev.leaveType.toLowerCase()} ·{" "}
                          {new Date(ev.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} –{" "}
                          {new Date(ev.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-medium ${ev.status === "APPROVED" ? "text-emerald-dark dark:text-emerald" : "text-amber-dark"}`}>
                      {ev.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Task deadlines */}
          {data.taskEvents.length > 0 && (
            <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
              <h2 className="mb-3 font-semibold text-dark dark:text-white">
                Task Deadlines — {MONTHS[month]}
              </h2>
              <div className="space-y-2">
                {data.taskEvents.map((ev) => (
                  <div key={ev.id} className="flex items-center justify-between rounded-lg border border-gray-2 p-3 dark:border-dark-3">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${PRIORITY_BG[ev.priority] ?? "bg-gray-400"}`} />
                      <div>
                        <p className="text-sm font-medium text-dark dark:text-white">{ev.title}</p>
                        <p className="text-xs text-dark-5 dark:text-dark-6">
                          {ev.assignee ?? "Unassigned"} · due{" "}
                          {new Date(ev.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      ev.priority === "HIGH" ? "bg-rose-light text-rose-dark dark:bg-rose-dark/20" :
                      ev.priority === "MEDIUM" ? "bg-amber-light text-amber-dark dark:bg-amber-dark/20" :
                      "bg-gray-2 text-dark-5"
                    }`}>
                      {ev.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
