import { getCalendarData } from "@/lib/actions/reports";
import { CalendarClient } from "./_components/calendar-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calendar",
};

export default async function CalendarPage() {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const data = await getCalendarData(month, year);

  return <CalendarClient data={data} currentMonth={month} currentYear={year} />;
}
