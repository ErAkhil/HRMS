import { getMeetings, getMeetingEmployees } from "@/lib/actions/meetings";
import { MeetingsPageClient } from "./_components/meetings-page-client";

export const metadata = { title: "Meetings" };

export default async function MeetingsPage() {
  const [meetings, employees] = await Promise.all([
    getMeetings().catch(() => []),
    getMeetingEmployees().catch(() => []),
  ]);

  return <MeetingsPageClient meetings={meetings} employees={employees} />;
}
