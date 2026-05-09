import { getLeaveCalendarEvents } from "@/lib/actions/reports";
import { LeaveCalendarClient } from "./_components/leave-calendar-client";

export const metadata = { title: "Leave Calendar" };

export default async function LeaveCalendarPage() {
  const now = new Date();
  const events = await getLeaveCalendarEvents(now.getMonth(), now.getFullYear());

  return <LeaveCalendarClient events={events} currentMonth={now.getMonth()} currentYear={now.getFullYear()} />;
}
