import { getMyLeaveBalances } from "@/lib/actions/leave";
import { getMyTodayStatus } from "@/lib/actions/attendance";
import { getUpcomingCelebrations } from "@/lib/actions/celebrations";
import { AIInsightsCard } from "./_components/ai-insights-card";
import { AttendanceWidget } from "./_components/attendance-widget";
import { BirthdayStrip } from "./_components/birthday-strip";
import { CalendarPreview } from "./_components/calendar-preview";
import { CollaborationPreview } from "./_components/collaboration-preview";
import { CompanyNews } from "./_components/company-news";
import { GreetingHeader } from "./_components/greeting-header";
import { LeaveBalanceCard } from "./_components/leave-balance-card";
import { QuickActionsGrid } from "./_components/quick-actions-grid";
import { TeamActivityFeed } from "./_components/team-activity-feed";

export default async function EmployeeDashboard() {
  const [leaveBalances, rawAttendance, celebrations] = await Promise.all([
    getMyLeaveBalances().catch(() => []),
    getMyTodayStatus().catch(() => null),
    getUpcomingCelebrations().catch(() => []),
  ]);

  const todayAttendance = rawAttendance
    ? { ...rawAttendance, hoursWorked: rawAttendance.hoursWorked ? Number(rawAttendance.hoursWorked) : null }
    : null;

  return (
    <div className="space-y-4 md:space-y-6">

      {/* ── Greeting ── */}
      <GreetingHeader />

      {/* ── Row 1: Attendance · Leave · AI Insights ── */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        <AttendanceWidget todayRecord={todayAttendance} />
        <LeaveBalanceCard balances={leaveBalances} />
        <AIInsightsCard />
      </div>

      {/* ── Row 2: Quick Actions · Team Feed · Calendar ── */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6">
        <div className="md:col-span-3">
          <QuickActionsGrid />
        </div>
        <div className="md:col-span-5">
          <TeamActivityFeed />
        </div>
        <div className="md:col-span-4">
          <CalendarPreview />
        </div>
      </div>

      {/* ── Row 3: Collaboration · Company News ── */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6">
        <div className="md:col-span-7">
          <CollaborationPreview />
        </div>
        <div className="md:col-span-5">
          <CompanyNews />
        </div>
      </div>

      {/* ── Row 4: Celebrations ── */}
      <BirthdayStrip celebrations={celebrations} />

    </div>
  );
}
