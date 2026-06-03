"use client";

import { useEffect, useState, useTransition } from "react";
import { backfillLocation, checkIn, checkOut } from "@/lib/actions/attendance";
import type { MyTodayStatus } from "@/lib/actions/attendance";
import { useRouter } from "next/navigation";
import {
  AttendanceStatusBadge,
  ClockButton,
  WeeklyMiniChart,
  getAttendanceState,
} from "./attendance-widget-parts";
import { getAttendanceCoordinates } from "@/lib/attendance-geolocation";
import { LocationName } from "@/components/location/location-name";
import { useSocket } from "@/hooks/use-socket";
interface Props {
  todayRecord: MyTodayStatus;
}

function formatTime(date: string | null | undefined): string {
  if (!date) return "—";
  return new Date(date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function formatHours(checkIn: string | null | undefined, checkOut: string | null | undefined): string {
  if (!checkIn) return "0h 0m";
  const end = checkOut ? new Date(checkOut) : new Date();
  const ms = end.getTime() - new Date(checkIn).getTime();
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  return `${h}h ${m}m`;
}

function AttendanceHeader({ attendanceState }: Readonly<{ attendanceState: "present" | "done" | "notIn" }>) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-light dark:bg-emerald-dark/20">
          <svg className="size-4 text-emerald" viewBox="0 0 24 24" fill="none">
            <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="section-title">Attendance</h3>
      </div>
      <AttendanceStatusBadge state={attendanceState} />
    </div>
  );
}

function AttendanceTiming({
  checkInTime,
  checkOutTime,
  checkInLatitude,
  checkInLongitude,
  checkOutLatitude,
  checkOutLongitude,
  hasAttendanceRecord,
}: Readonly<{
  checkInTime: string | null | undefined;
  checkOutTime: string | null | undefined;
  checkInLatitude: number | null | undefined;
  checkInLongitude: number | null | undefined;
  checkOutLatitude: number | null | undefined;
  checkOutLongitude: number | null | undefined;
  hasAttendanceRecord: boolean;
}>) {
  return (
    <div>
      <p className="text-muted">{hasAttendanceRecord ? "Clocked in at" : "Not clocked in"}</p>
      <p className="text-body font-bold">{formatTime(checkInTime)}</p>
      {hasAttendanceRecord && (
        <>
          <p className="text-muted">
            Working: <span className="font-medium text-dark dark:text-white">{formatHours(checkInTime, checkOutTime)}</span>
          </p>
          <p className="text-muted">
            In loc: <span className="font-medium text-dark dark:text-white"><LocationName latitude={checkInLatitude} longitude={checkInLongitude} /></span>
          </p>
          <p className="text-muted">
            Out loc: <span className="font-medium text-dark dark:text-white"><LocationName latitude={checkOutLatitude} longitude={checkOutLongitude} /></span>
          </p>
        </>
      )}
    </div>
  );
}

export function AttendanceWidget({ todayRecord }: Readonly<Props>) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const isClockedIn = !!todayRecord?.checkIn && !todayRecord?.checkOut;
  const isCheckedOut = !!todayRecord?.checkOut;
  const attendanceState = getAttendanceState(isClockedIn, isCheckedOut);
  const hasAttendanceRecord = isClockedIn || isCheckedOut;

  useEffect(() => {
    if (!todayRecord?.checkIn) return;
    if (todayRecord.checkInLatitude !== null && todayRecord.checkInLongitude !== null) return;

    let cancelled = false;
    void (async () => {
      try {
        const coords = await getAttendanceCoordinates();
        await backfillLocation(coords);
        if (!cancelled) router.refresh();
      } catch {
        // Keep UI non-blocking if location backfill permission is denied.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [todayRecord?.checkIn, todayRecord?.checkInLatitude, todayRecord?.checkInLongitude, router]);

  useSocket({
    "attendance:checkin": () => router.refresh(),
    "attendance:checkout": () => router.refresh(),
    "attendance:status-changed": () => router.refresh(),
  });

  function handleToggle() {
    setError("");
    startTransition(async () => {
      try {
        const action = isClockedIn ? checkOut : checkIn;
        const coords = await getAttendanceCoordinates();
        await action(coords);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Action failed");
      }
    });
  }

  return (
    <div className="flex h-full flex-col card-p">
      <AttendanceHeader attendanceState={attendanceState} />

      <div className="mt-3 rounded-lg bg-gray-2 px-3 py-2 dark:bg-dark-3">
        <p className="text-muted">Today&apos;s Shift</p>
        <p className="text-body-medium font-semibold">9:00 AM – 6:00 PM</p>
      </div>

      {error && <p className="mt-2 text-xs text-rose-600 dark:text-rose-400">{error}</p>}

      <div className="mt-4 flex items-center justify-between gap-3">
        <AttendanceTiming
          checkInTime={todayRecord?.checkIn}
          checkOutTime={todayRecord?.checkOut}
          checkInLatitude={todayRecord?.checkInLatitude}
          checkInLongitude={todayRecord?.checkInLongitude}
          checkOutLatitude={todayRecord?.checkOutLatitude}
          checkOutLongitude={todayRecord?.checkOutLongitude}
          hasAttendanceRecord={hasAttendanceRecord}
        />
        {!isCheckedOut && <ClockButton isPending={isPending} isClockedIn={isClockedIn} onClick={handleToggle} />}
      </div>

      <WeeklyMiniChart isActive={hasAttendanceRecord} />
    </div>
  );
}
