import { getMyLeaveBalances, getLeaveRequests } from "@/lib/actions/leave";
import { getLeaveCalendarEvents } from "@/lib/actions/reports";
import { LeavePageClient } from "./_components/LeavePageClient";

export default async function LeavePage() {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const [balances, requests, calendarEvents] = await Promise.all([
    getMyLeaveBalances().catch(() => []),
    getLeaveRequests().catch(() => []),
    getLeaveCalendarEvents(currentMonth, currentYear).catch(() => []),
  ]);

  return (
    <LeavePageClient
      balances={balances}
      requests={requests}
      calendarEvents={calendarEvents}
      calendarMonth={currentMonth}
      calendarYear={currentYear}
    />
  );
}
