import type { AttendanceStatus } from '@prisma/client';

export function resolveCheckOutStatus(
  currentStatus: AttendanceStatus,
  hoursWorked: number,
  halfDayMaxHours: number,
): AttendanceStatus {
  if (currentStatus === 'ON_LEAVE') return 'ON_LEAVE';

  const canBecomeHalfDay = ['PRESENT', 'LATE', 'REMOTE'].includes(currentStatus);
  if (canBecomeHalfDay && hoursWorked < halfDayMaxHours) {
    return 'HALF_DAY';
  }

  return currentStatus;
}

export function shouldCreateOnLeaveRecord(hasAttendanceRecord: boolean, hasApprovedLeave: boolean) {
  return hasApprovedLeave && !hasAttendanceRecord;
}

export function shouldCreateAbsentRecord(hasAttendanceRecord: boolean, hasApprovedLeave: boolean) {
  return !hasAttendanceRecord && !hasApprovedLeave;
}

export function shouldOverrideStatusToOnLeave(
  status: AttendanceStatus,
  hasApprovedLeave: boolean,
  hasCheckIn: boolean,
  hasCheckOut: boolean,
) {
  return hasApprovedLeave && status !== 'ON_LEAVE' && !hasCheckIn && !hasCheckOut;
}
