"use client";

import { useState } from "react";
import Link from "next/link";
import { getLeaveCalendarEvents } from "@/lib/actions/reports";
import type { LeaveCalendarEvent as LeaveEvent } from "@/lib/actions/reports";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_LABELS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const STATUS_COLORS: Record<string, string> = {
  APPROVED: "bg-emerald-500",
  PENDING: "bg-amber-400",
  REJECTED: "bg-rose-500",
};

const LEAVE_TYPE_COLORS: Record<string, string> = {
  ANNUAL: "bg-primary-500",
  SICK: "bg-rose-500",
  CASUAL: "bg-amber-400",
  MATERNITY: "bg-violet-500",
  PATERNITY: "bg-violet-500",
  UNPAID: "bg-gray-400",
  OTHER: "bg-sky-500",
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
function getEventsForDay(events: LeaveEvent[], day: number, month: number, year: number) {
  const dayStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return events.filter((e) => {
    const start = e.startDate.slice(0, 10);
    const end = e.endDate.slice(0, 10);
    return dayStr >= start && dayStr <= end;
  });
}

export function LeaveCalendarClient({ events: initialEvents, currentMonth, currentYear }: Readonly<{
  events: LeaveEvent[];
  currentMonth: number;
  currentYear: number;
}>) {
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [events, setEvents] = useState<LeaveEvent[]>(initialEvents);
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

  const approvedCount = events.filter((e) => e.status === "APPROVED").length;
  const pendingCount = events.filter((e) => e.status === "PENDING").length;
  const rejectedCount = events.filter((e) => e.status === "REJECTED").length;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="page-title">Leave Calendar</h1>
            {pendingCount > 0 && (
              <span className="rounded-full bg-amber-light px-2.5 py-0.5 text-xs font-medium text-amber-dark dark:bg-amber-dark/20 dark:text-amber">
                {pendingCount} pending
              </span>
            )}
          </div>
          <p className="text-muted mt-0.5">Team leave overview</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/leave/approvals" className="btn-secondary">
            Approvals {pendingCount > 0 && `(${pendingCount})`}
          </Link>
          <Link href="/leave" className="btn-primary">
            Apply Leave
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Approved", value: approvedCount, color: "text-emerald-dark dark:text-emerald" },
          { label: "Pending", value: pendingCount, color: "text-amber-dark dark:text-amber" },
          { label: "Rejected", value: rejectedCount, color: "text-rose-dark dark:text-rose" },
          { label: "Unique Employees", value: new Set(events.map((e) => e.name)).size, color: "text-violet-dark dark:text-violet-300" },
        ].map((stat) => (
          <div key={stat.label} className="stat-card">
            <p className="stat-label">{stat.label}</p>
            <p className={`stat-value ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div className="card-p">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">
            {MONTHS[month]} {year}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateMonth(-1)}
              disabled={loading}
              className="btn-secondary btn-sm"
            >
              ‹ Prev
            </button>
            <button
              onClick={() => navigateMonth(1)}
              disabled={loading}
              className="btn-secondary btn-sm"
            >
              Next ›
            </button>
          </div>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7 mb-1">
          {DAY_LABELS.map((d) => (
            <div key={d} className="py-1 text-center text-muted text-xs font-semibold uppercase">{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-px bg-gray-3 dark:bg-dark-3 border border-gray-3 dark:border-dark-3 rounded-lg overflow-hidden">
          {calDays.map((day, idx) => {
            const dayEvents = day ? getEventsForDay(events, day, month, year) : [];
            const isToday = day !== null
              && today.getDate() === day
              && today.getMonth() === month
              && today.getFullYear() === year;

            return (
              <div
                key={idx}
                className={`min-h-[80px] bg-white p-1.5 dark:bg-dark-2 ${!day ? "bg-gray-1 dark:bg-dark-3/50" : ""}`}
              >
                {day !== null && (
                  <>
                    <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold mb-1 ${
                      isToday ? "bg-primary-600 text-white" : "text-dark dark:text-white"
                    }`}>
                      {day}
                    </div>
                    <div className="space-y-0.5">
                      {dayEvents.slice(0, 2).map((ev) => (
                        <div
                          key={`${ev.id}-${day}`}
                          title={`${ev.name} — ${ev.leaveType} (${ev.status})`}
                          className={`rounded px-1 py-0.5 text-[10px] font-medium text-white truncate ${STATUS_COLORS[ev.status] ?? "bg-gray-400"}`}
                        >
                          {ev.name}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-muted text-[10px]">+{dayEvents.length - 2} more</div>
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
      <div className="flex flex-wrap gap-3">
        {[
          { label: "Approved", color: "bg-emerald-500" },
          { label: "Pending", color: "bg-amber-400" },
          { label: "Rejected", color: "bg-rose-500" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span className={`h-3 w-3 rounded-full ${item.color}`} />
            <span className="text-muted">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Event List */}
      {events.length > 0 && (
        <div className="card-p">
          <h2 className="section-title mb-3">All Leave Events — {MONTHS[month]} {year}</h2>
          <div className="space-y-2">
            {events.map((ev) => (
              <div key={ev.id} className="flex items-center justify-between rounded-lg border border-gray-2 p-3 dark:border-dark-3">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${STATUS_COLORS[ev.status] ?? "bg-gray-400"}`} />
                  <div>
                    <p className="text-body-medium">{ev.name}</p>
                    <p className="text-muted">
                      {ev.dept} · {ev.leaveType.toLowerCase()} · {ev.days} day{ev.days !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-muted">
                    {new Date(ev.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} –{" "}
                    {new Date(ev.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                  <span className={`text-[10px] font-medium ${
                    ev.status === "APPROVED" ? "text-emerald-dark dark:text-emerald" :
                    ev.status === "PENDING" ? "text-amber-dark dark:text-amber" : "text-rose-dark dark:text-rose"
                  }`}>
                    {ev.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
