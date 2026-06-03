import type { Metadata } from "next";
import { requireAuth } from "@/lib/session";
import { getMyWeeklyShiftSchedule, getWeeklyShiftSchedule } from "@/lib/actions/attendance-shifts";
import { ShiftSchedulingClient } from "./_components/ShiftSchedulingClient";

export const metadata: Metadata = { title: "Shift Scheduling" };

type PageProps = {
  searchParams?: Promise<{
    startDate?: string;
  }>;
};

const schedulerRoles = new Set(["SUPER_ADMIN", "HR_ADMIN", "MANAGER"]);

export default async function SchedulingPage({ searchParams }: Readonly<PageProps>) {
  const user = await requireAuth();
  const canEdit = schedulerRoles.has(user.role);
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  const startDate = typeof resolvedSearchParams?.startDate === "string"
    ? resolvedSearchParams.startDate
    : undefined;

  const schedule = canEdit
    ? await getWeeklyShiftSchedule(startDate)
    : await getMyWeeklyShiftSchedule(startDate);

  return (
    <ShiftSchedulingClient
      weekStart={schedule.weekStart}
      weekEnd={schedule.weekEnd}
      days={schedule.days}
      employees={schedule.employees}
      canEdit={canEdit}
    />
  );
}
