"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useSocket } from "@/hooks/use-socket";
import { applyAttendanceStatusChange, type AttendanceStatusChangePayload } from "@/lib/attendance-live";
import type { AttendanceStats } from "@/lib/actions/attendance";

type Props = Readonly<{
  attendance: Pick<AttendanceStats, "present" | "late" | "onLeave" | "remote" | "absent" | "halfDay">;
  headcount: number;
  pendingLeaveCount: number;
  todayStr: string;
}>;

export function HrAttendanceOverviewClient({ attendance, headcount, pendingLeaveCount, todayStr }: Props) {
  const [liveAttendance, setLiveAttendance] = useState(attendance);

  const onStatusChanged = useCallback((data: unknown) => {
    const payload = (data ?? {}) as AttendanceStatusChangePayload;
    setLiveAttendance((prev) => applyAttendanceStatusChange({ ...prev, total: headcount }, payload.previousStatus, payload.status));
  }, [headcount]);

  useSocket({
    "attendance:status-changed": onStatusChanged,
  });

  const rows = useMemo(() => ([
    { label: "On Leave", count: liveAttendance.onLeave, barColor: "bg-amber-500" },
    { label: "WFH", count: liveAttendance.remote, barColor: "bg-primary-500" },
    { label: "Late", count: liveAttendance.late, barColor: "bg-rose-500" },
    { label: "Present", count: liveAttendance.present, barColor: "bg-emerald-500" },
  ]), [liveAttendance]);

  return (
    <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-dark dark:text-white">Leave Today</h2>
        <span className="text-xs text-dark-5 dark:text-dark-6">{todayStr}</span>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="rounded-lg bg-amber-light dark:bg-amber-dark/20 px-3 py-2 text-center">
          <p className="text-lg font-bold text-amber-dark dark:text-amber">{liveAttendance.onLeave}</p>
          <p className="text-[10px] font-semibold text-amber-dark/80 dark:text-amber/80">On Leave</p>
        </div>
        <div className="rounded-lg bg-primary-50 dark:bg-primary-900/20 px-3 py-2 text-center">
          <p className="text-lg font-bold text-primary-600 dark:text-primary-300">{liveAttendance.remote}</p>
          <p className="text-[10px] font-semibold text-primary-600/80 dark:text-primary-300/80">WFH</p>
        </div>
        <div className="rounded-lg bg-rose-light dark:bg-rose-dark/20 px-3 py-2 text-center">
          <p className="text-lg font-bold text-rose-dark dark:text-rose">{liveAttendance.late}</p>
          <p className="text-[10px] font-semibold text-rose-dark/80 dark:text-rose/80">Late</p>
        </div>
        <div className="rounded-lg bg-emerald-light dark:bg-emerald-dark/20 px-3 py-2 text-center">
          <p className="text-lg font-bold text-emerald-dark dark:text-emerald">{liveAttendance.present}</p>
          <p className="text-[10px] font-semibold text-emerald-dark/80 dark:text-emerald/80">Present</p>
        </div>
      </div>
      <div className="space-y-2 mb-4">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-2">
            <span className="w-16 shrink-0 text-[10px] text-dark-5 dark:text-dark-6">{row.label}</span>
            <div className="flex-1 relative h-1.5 rounded-full bg-gray-2 dark:bg-dark-3 overflow-hidden">
              <div
                className={`absolute inset-y-0 left-0 rounded-full ${row.barColor}`}
                style={{ width: headcount > 0 ? `${((row.count / headcount) * 100).toFixed(1)}%` : "0%" }}
              />
            </div>
            <span className="w-6 shrink-0 text-[10px] font-semibold text-dark-5 dark:text-dark-6 text-right">{row.count}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-gray-3 dark:border-dark-3 pt-3">
        <Link href="/leave/calendar" className="text-xs font-medium text-primary-600 hover:underline dark:text-primary-400">
          View Leave Calendar →
        </Link>
        <Link href="/leave/approvals" className="rounded-lg bg-primary-600 px-3 py-1 text-xs font-semibold text-white hover:bg-primary-700">
          Approvals: {pendingLeaveCount}
        </Link>
      </div>
    </div>
  );
}
