import type { AttendanceStats } from "@/lib/actions/attendance";

export type AttendanceBucket = "present" | "late" | "remote" | "onLeave" | "absent" | "halfDay";

export type AttendanceStatusChangePayload = {
  employeeId?: string;
  previousStatus?: string | null;
  status?: string | null;
};

export const attendanceStatusToBucket: Record<string, AttendanceBucket> = {
  PRESENT: "present",
  LATE: "late",
  REMOTE: "remote",
  ON_LEAVE: "onLeave",
  ABSENT: "absent",
  HALF_DAY: "halfDay",
};

export function applyAttendanceStatusChange(
  prev: AttendanceStats,
  previousStatus?: string | null,
  nextStatus?: string | null,
): AttendanceStats {
  const next = { ...prev };
  const previousKey = previousStatus ? attendanceStatusToBucket[previousStatus] : undefined;
  const nextKey = nextStatus ? attendanceStatusToBucket[nextStatus] : undefined;

  if (previousKey && next[previousKey] > 0) {
    next[previousKey] -= 1;
  }

  if (nextKey) {
    next[nextKey] += 1;
  }

  return next;
}
