import { getMyLeaveBalances } from "@/lib/actions/leave";
import { getMyTodayStatus } from "@/lib/actions/attendance";
import { getUpcomingCelebrations } from "@/lib/actions/celebrations";
import { getNotifications } from "@/lib/actions/notifications";
import { getCalendarData } from "@/lib/actions/reports";
import { getChannels } from "@/lib/actions/collaboration";
import { getMeetings } from "@/lib/actions/meetings";
import { AIInsightsCard } from "../(home)/_components/ai-insights-card";
import { AttendanceWidget } from "../(home)/_components/attendance-widget";
import { BirthdayStrip } from "../(home)/_components/birthday-strip";
import { CalendarPreview } from "../(home)/_components/calendar-preview";
import { CollaborationPreview } from "../(home)/_components/collaboration-preview";
import { CompanyNews } from "../(home)/_components/company-news";
import { GreetingHeader } from "../(home)/_components/greeting-header";
import { LeaveBalanceCard } from "../(home)/_components/leave-balance-card";
import { QuickActionsGrid } from "../(home)/_components/quick-actions-grid";
import { TeamActivityFeed } from "../(home)/_components/team-activity-feed";

export default async function EmployeeDashboard() {
  const now = new Date();
  const [leaveBalances, rawAttendance, celebrations, notifications, calendarData, channels, meetings] = await Promise.all([
    getMyLeaveBalances().catch(() => []),
    getMyTodayStatus().catch(() => null),
    getUpcomingCelebrations().catch(() => []),
    getNotifications().catch(() => []),
    getCalendarData(now.getMonth(), now.getFullYear()).catch(() => ({ leaveEvents: [], taskEvents: [] })),
    getChannels().catch(() => []),
    getMeetings().catch(() => []),
  ]);
  const liveMeetings = meetings.filter((m) => m.isLive);

  const todayAttendance = rawAttendance
    ? { ...rawAttendance, hoursWorked: rawAttendance.hoursWorked ? Number(rawAttendance.hoursWorked) : null }
    : null;

  return (
    <div className="space-y-4 md:space-y-6">
      <GreetingHeader />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        <AttendanceWidget todayRecord={todayAttendance} />
        <LeaveBalanceCard balances={leaveBalances} />
        <AIInsightsCard />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6">
        <div className="md:col-span-3">
          <QuickActionsGrid />
        </div>
        <div className="md:col-span-5">
          <TeamActivityFeed notifications={notifications} />
        </div>
        <div className="md:col-span-4">
          <CalendarPreview calendarData={calendarData} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6">
        <div className="md:col-span-7">
          <CollaborationPreview channels={channels} liveMeetings={liveMeetings} />
        </div>
        <div className="md:col-span-5">
          <CompanyNews />
        </div>
      </div>
      <BirthdayStrip celebrations={celebrations} />
    </div>
  );
}
