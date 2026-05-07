"use client";

import { useState } from "react";

const WEEKLY_DATA = [
  { day: "Mon", hours: 9.0, present: true },
  { day: "Tue", hours: 8.5, present: true },
  { day: "Wed", hours: 6.5, present: true },
  { day: "Thu", hours: 0, present: false },
  { day: "Fri", hours: 0, present: false },
];

const MAX_HOURS = 9;

export function AttendanceWidget() {
  const [clockedIn, setClockedIn] = useState(true);

  return (
    <div className="flex h-full flex-col rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-light dark:bg-emerald-dark/20">
            <svg className="size-4 text-emerald" viewBox="0 0 24 24" fill="none">
              <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-dark dark:text-white">Attendance</h3>
        </div>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${clockedIn ? "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald" : "bg-rose-light text-rose-dark dark:bg-rose-dark/20 dark:text-rose"}`}>
          {clockedIn ? "● Present" : "● Absent"}
        </span>
      </div>

      {/* Shift info */}
      <div className="mt-3 rounded-lg bg-gray-2 px-3 py-2 dark:bg-dark-3">
        <p className="text-xs text-dark-5 dark:text-dark-6">Today's Shift</p>
        <p className="text-sm font-semibold text-dark dark:text-white">9:00 AM – 6:00 PM</p>
      </div>

      {/* Clock in/out button */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-dark-5 dark:text-dark-6">
            {clockedIn ? "Clocked in at" : "Last clocked out"}
          </p>
          <p className="text-sm font-bold text-dark dark:text-white">
            {clockedIn ? "9:02 AM" : "6:01 PM"}
          </p>
          <p className="text-xs text-dark-5 dark:text-dark-6">
            Working: <span className="font-medium text-dark dark:text-white">6h 32m</span>
          </p>
        </div>
        <button
          onClick={() => setClockedIn((v) => !v)}
          className={`flex h-14 w-14 flex-col items-center justify-center rounded-xl text-[10px] font-bold text-white shadow-floating transition-all active:scale-95 ${clockedIn ? "bg-rose hover:bg-rose-dark" : "bg-emerald hover:bg-emerald-dark"}`}
        >
          <svg className="mb-0.5 size-5" viewBox="0 0 24 24" fill="none">
            <path d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {clockedIn ? "OUT" : "IN"}
        </button>
      </div>

      {/* Weekly mini chart */}
      <div className="mt-4 border-t border-gray-3 pt-4 dark:border-dark-3">
        <p className="mb-2 text-xs font-medium text-dark-5 dark:text-dark-6">This Week</p>
        <div className="flex items-end gap-1.5">
          {WEEKLY_DATA.map((d) => (
            <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
              <div className="relative w-full overflow-hidden rounded-t-sm" style={{ height: 36 }}>
                <div
                  className={`absolute bottom-0 left-0 right-0 rounded-t-sm transition-all duration-500 ${d.present ? "bg-emerald" : "bg-gray-3 dark:bg-dark-3"}`}
                  style={{ height: d.present ? `${(d.hours / MAX_HOURS) * 100}%` : "20%" }}
                />
              </div>
              <span className="text-[10px] text-dark-5 dark:text-dark-6">{d.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
