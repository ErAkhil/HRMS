import {
  getTodayAttendance,
  getMyTodayStatus,
  getAttendanceStats,
  getMonthlyHeatmap,
} from "@/lib/actions/attendance";
import { AttendancePageClient } from "./_components/AttendancePageClient";

export const metadata = { title: "Attendance" };

export default async function AttendancePage() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const [records, myStatus, stats, heatmap] = await Promise.all([
    getTodayAttendance(),
    getMyTodayStatus().catch(() => null),
    getAttendanceStats(),
    getMonthlyHeatmap(month, year),
  ]);

  return (
    <AttendancePageClient
      records={records}
      myStatus={myStatus ? {
        id: myStatus.id,
        checkIn: myStatus.checkIn?.toISOString() ?? null,
        checkOut: myStatus.checkOut?.toISOString() ?? null,
        status: myStatus.status,
        hoursWorked: myStatus.hoursWorked ? Number(myStatus.hoursWorked) : null,
      } : null}
      stats={stats}
      heatmap={heatmap}
      month={month}
      year={year}
    />
  );
}
