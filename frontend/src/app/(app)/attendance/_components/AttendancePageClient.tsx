"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { checkIn, checkOut, type AttendanceRecord, type AttendanceStats, type MyTodayStatus } from "@/lib/actions/attendance";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";
import { useSocket } from "@/hooks/use-socket";
import { AttendanceKpiCards } from "./KpiCards";
import { AttendanceTable } from "./AttendanceTable";
import { LiveStatusPanel } from "./LiveStatusPanel";
import { AttendanceHeatmap } from "./AttendanceHeatmap";

interface Props {
  records: AttendanceRecord[];
  myStatus: MyTodayStatus;
  stats: AttendanceStats;
  heatmap: { day: number; pct: number }[];
  month: number;
  year: number;
}

export function AttendancePageClient({ records, myStatus, stats: initialStats, heatmap, month, year }: Readonly<Props>) {
  const router = useRouter();
  const { toast, setToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [stats, setStats] = useState<AttendanceStats>(initialStats);

  const onCheckIn = useCallback((_data: unknown) => {
    setStats((prev) => ({ ...prev, present: prev.present + 1 }));
    router.refresh();
  }, [router]);

  const onCheckOut = useCallback((_data: unknown) => {
    router.refresh();
  }, [router]);

  useSocket({
    "attendance:checkin": onCheckIn,
    "attendance:checkout": onCheckOut,
  });

  function handleCheckIn() {
    startTransition(async () => {
      try {
        await checkIn();
        setToast("Checked in successfully!");
        router.refresh();
      } catch (err) {
        setToast(err instanceof Error ? err.message : "Check-in failed");
      }
    });
  }

  function handleCheckOut() {
    startTransition(async () => {
      try {
        await checkOut();
        setToast("Checked out successfully!");
        router.refresh();
      } catch (err) {
        setToast(err instanceof Error ? err.message : "Check-out failed");
      }
    });
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Attendance</h1>
          <p className="text-muted mt-0.5">Track and manage employee attendance records</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {!myStatus && (
            <button onClick={handleCheckIn} disabled={isPending} className="btn-primary disabled:opacity-60">
              {isPending ? "Processing…" : "Check In"}
            </button>
          )}
          {myStatus && !myStatus.checkOut && (
            <button onClick={handleCheckOut} disabled={isPending} className="rounded-lg bg-amber px-4 py-2 text-sm font-semibold text-white hover:bg-amber-dark disabled:opacity-60">
              {isPending ? "Processing…" : "Check Out"}
            </button>
          )}
          {myStatus?.checkOut && (
            <span className="rounded-lg bg-emerald-light px-4 py-2 text-sm font-semibold text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald">
              Done for today ✓
            </span>
          )}
        </div>
      </div>

      <AttendanceKpiCards stats={stats} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <AttendanceTable records={records} myStatus={myStatus} />
        </div>
        <div className="lg:col-span-4">
          <LiveStatusPanel stats={stats} />
        </div>
      </div>

      <AttendanceHeatmap heatmap={heatmap} month={month} year={year} />

      <Toast message={toast} />
    </div>
  );
}
