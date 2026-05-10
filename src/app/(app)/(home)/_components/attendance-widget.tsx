"use client";

import { useState, useTransition } from "react";
import { checkIn, checkOut } from "@/lib/actions/attendance";
import { useRouter } from "next/navigation";
type SerializedAttendance = {
  id: string;
  employeeId: string;
  date: Date;
  checkIn: Date | null;
  checkOut: Date | null;
  status: string;
  hoursWorked: number | null;
  notes: string | null;
  createdAt: Date;
};

interface Props {
  todayRecord: SerializedAttendance | null;
}

function formatTime(date: Date | null | undefined): string {
  if (!date) return "—";
  return new Date(date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function formatHours(checkIn: Date | null | undefined, checkOut: Date | null | undefined): string {
  if (!checkIn) return "0h 0m";
  const end = checkOut ? new Date(checkOut) : new Date();
  const ms = end.getTime() - new Date(checkIn).getTime();
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  return `${h}h ${m}m`;
}

export function AttendanceWidget({ todayRecord }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const isClockedIn = !!todayRecord?.checkIn && !todayRecord?.checkOut;
  const isCheckedOut = !!todayRecord?.checkOut;

  function handleToggle() {
    setError("");
    startTransition(async () => {
      try {
        if (isClockedIn) {
          await checkOut();
        } else {
          await checkIn();
        }
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Action failed");
      }
    });
  }

  return (
    <div className="flex h-full flex-col card-p">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-light dark:bg-emerald-dark/20">
            <svg className="size-4 text-emerald" viewBox="0 0 24 24" fill="none">
              <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className="section-title">Attendance</h3>
        </div>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
          isClockedIn
            ? "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald"
            : isCheckedOut
            ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300"
            : "bg-rose-light text-rose-dark dark:bg-rose-dark/20 dark:text-rose"
        }`}>
          {isClockedIn ? "● Present" : isCheckedOut ? "● Done" : "● Not In"}
        </span>
      </div>

      {/* Shift info */}
      <div className="mt-3 rounded-lg bg-gray-2 px-3 py-2 dark:bg-dark-3">
        <p className="text-muted">Today&apos;s Shift</p>
        <p className="text-body-medium font-semibold">9:00 AM – 6:00 PM</p>
      </div>

      {error && (
        <p className="mt-2 text-xs text-rose-600 dark:text-rose-400">{error}</p>
      )}

      {/* Clock in/out button */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-muted">
            {isClockedIn || isCheckedOut ? "Clocked in at" : "Not clocked in"}
          </p>
          <p className="text-body font-bold">
            {formatTime(todayRecord?.checkIn)}
          </p>
          {(isClockedIn || isCheckedOut) && (
            <p className="text-muted">
              Working: <span className="font-medium text-dark dark:text-white">
                {formatHours(todayRecord?.checkIn, todayRecord?.checkOut)}
              </span>
            </p>
          )}
        </div>
        {!isCheckedOut && (
          <button
            onClick={handleToggle}
            disabled={isPending}
            className={`flex h-14 w-14 flex-col items-center justify-center rounded-xl text-[10px] font-bold text-white shadow-floating transition-all active:scale-95 disabled:opacity-60 ${
              isClockedIn ? "bg-rose hover:bg-rose-dark" : "bg-emerald hover:bg-emerald-dark"
            }`}
          >
            <svg className="mb-0.5 size-5" viewBox="0 0 24 24" fill="none">
              <path d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {isPending ? "…" : isClockedIn ? "OUT" : "IN"}
          </button>
        )}
      </div>

      {/* Weekly mini chart placeholder */}
      <div className="mt-4 divider pt-4">
        <p className="mb-2 text-muted font-medium">This Week</p>
        <div className="flex items-end gap-1.5">
          {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, i) => {
            const isToday = new Date().getDay() === i + 1;
            return (
              <div key={day} className="flex flex-1 flex-col items-center gap-1">
                <div className="relative w-full overflow-hidden rounded-t-sm" style={{ height: 36 }}>
                  <div
                    className={`absolute bottom-0 left-0 right-0 rounded-t-sm ${
                      isToday && (isClockedIn || isCheckedOut) ? "bg-emerald" : "bg-gray-3 dark:bg-dark-3"
                    }`}
                    style={{ height: isToday && (isClockedIn || isCheckedOut) ? "70%" : "20%" }}
                  />
                </div>
                <span className="text-muted text-[10px]">{day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
