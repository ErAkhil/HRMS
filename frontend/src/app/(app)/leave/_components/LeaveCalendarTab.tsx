"use client";

import { useState } from "react";
import { getLeaveCalendarEvents } from "@/lib/actions/reports";
import type { LeaveCalendarEvent } from "@/lib/actions/reports";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_LABELS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const STATUS_COLORS: Record<string, string> = {
  APPROVED: "bg-emerald-500",
  PENDING: "bg-amber-400",
  REJECTED: "bg-rose-500",
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

function getEventsForDay(events: LeaveCalendarEvent[], day: number, month: number, year: number) {
  const dayStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return events.filter((e) => {
    const start = e.startDate.slice(0, 10);
    const end = e.endDate.slice(0, 10);
    return dayStr >= start && dayStr <= end;
  });
}

interface Props {
  initialEvents: LeaveCalendarEvent[];
  initialMonth: number;
  initialYear: number;
}

export function LeaveCalendarTab({ initialEvents, initialMonth, initialYear }: Readonly<Props>) {
  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);
  const [events, setEvents] = useState<LeaveCalendarEvent[]>(initialEvents);
  const [loading, setLoading] = useState(false);

  const calDays = buildCalendarDays(month, year);
  const today = new Date();

  async function navigateMonth(dir: -1 | 1) {
    let newMonth = month + dir;
    let newYear = year;
    if (newMonth < 0) { newMonth = 11; newYear--; }
    if (newMonth > 11) { newMonth = 0; newYear++; }
    setLoading(true);
    const newEvents = await getLeaveCalendarEvents(newMonth, newYear);
    setEvents(newEvents);
    setMonth(newMonth);
    setYear(newYear);
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-dark dark:text-white">
          {MONTHS[month]} {year}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateMonth(-1)}
            disabled={loading}
            className="rounded-lg border border-gray-3 px-3 py-1.5 text-xs font-medium text-dark hover:bg-gray-1 disabled:opacity-50 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3"
          >
            ‹ Prev
          </button>
          <button
            onClick={() => navigateMonth(1)}
            disabled={loading}
            className="rounded-lg border border-gray-3 px-3 py-1.5 text-xs font-medium text-dark hover:bg-gray-1 disabled:opacity-50 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3"
          >
            Next ›
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: "Approved", color: "bg-emerald-500" },
          { label: "Pending", color: "bg-amber-400" },
          { label: "Rejected", color: "bg-rose-500" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
            <span className="text-xs text-dark-5 dark:text-dark-6">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7">
        {DAY_LABELS.map((d) => (
          <div key={d} className="py-1 text-center text-xs font-semibold uppercase text-dark-5 dark:text-dark-6">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-gray-3 bg-gray-3 dark:border-dark-3 dark:bg-dark-3">
        {calDays.map((day, idx) => {
          const dayEvents = day ? getEventsForDay(events, day, month, year) : [];
          const isToday =
            day !== null &&
            today.getDate() === day &&
            today.getMonth() === month &&
            today.getFullYear() === year;
          const week = Math.floor(idx / 7);
          const dow = idx % 7;

          return (
            <div
              key={`w${week}d${dow}`}
              className={`min-h-[72px] bg-white p-1.5 dark:bg-dark-2 ${day ? "" : "bg-gray-1 dark:bg-dark-3/50"}`}
            >
              {day !== null && (
                <>
                  <div
                    className={`mb-1 flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold ${
                      isToday ? "bg-primary-600 text-white" : "text-dark dark:text-white"
                    }`}
                  >
                    {day}
                  </div>
                  <div className="space-y-0.5">
                    {dayEvents.slice(0, 2).map((ev) => (
                      <div
                        key={`${ev.id}-${day}`}
                        title={`${ev.name} — ${ev.leaveType} (${ev.status})`}
                        className={`truncate rounded px-1 py-0.5 text-[10px] font-medium text-white ${STATUS_COLORS[ev.status] ?? "bg-gray-400"}`}
                      >
                        {ev.name}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-[10px] text-dark-5 dark:text-dark-6">+{dayEvents.length - 2} more</div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {events.length === 0 && !loading && (
        <p className="py-4 text-center text-sm text-dark-5 dark:text-dark-6">No leave events this month.</p>
      )}
    </div>
  );
}
