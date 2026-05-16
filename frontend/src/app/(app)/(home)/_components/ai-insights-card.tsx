import Link from "next/link";
import { getInsightsData } from "@/lib/actions/ai-context";

const COLOR_MAP = {
  positive: "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  info: "bg-sky-50 text-sky-dark dark:bg-sky-dark/10 dark:text-sky",
  warning: "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber",
};

type InsightType = keyof typeof COLOR_MAP;
type InsightItem = {
  type: InsightType;
  iconPath: string;
  title: string;
  body: string;
};

const INSIGHT_ICON_PATHS = {
  attendance: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z",
  tasks: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
  leave: "M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941",
} as const;

function getTaskInsight(pendingTasks: number, overdueTasks: number): Pick<InsightItem, "type" | "title" | "body"> {
  const taskSuffix = pendingTasks === 1 ? "" : "s";
  const overdueSuffix = overdueTasks === 1 ? "" : "s";

  if (overdueTasks === 0) {
    return {
      type: "positive",
      title: `${pendingTasks} task${taskSuffix} in progress`,
      body: "No overdue tasks. Stay on top of your upcoming deadlines.",
    };
  }

  return {
    type: "warning",
    title: `${overdueTasks} overdue task${overdueSuffix}`,
    body: "You have tasks past their due date. Clear these to keep your score high.",
  };
}

function getLeaveInsight(annualLeaveRemaining: number | null): Pick<InsightItem, "type" | "title" | "body"> {
  if (annualLeaveRemaining === null) {
    return {
      type: "info",
      title: "Leave balance available",
      body: "You have annual leave days available. Plan your time off early.",
    };
  }

  if (annualLeaveRemaining <= 3) {
    const leaveSuffix = annualLeaveRemaining === 1 ? "" : "s";
    return {
      type: "warning",
      title: `${annualLeaveRemaining} leave day${leaveSuffix} remaining`,
      body: "Your annual leave balance is running low. Plan accordingly.",
    };
  }

  const leaveSuffix = annualLeaveRemaining === 1 ? "" : "s";
  return {
    type: "info",
    title: `${annualLeaveRemaining} leave day${leaveSuffix} remaining`,
    body: "You have annual leave days available. Plan your time off early.",
  };
}

function buildInsights({
  checkedIn,
  overdueTasks,
  pendingTasks,
  annualLeaveRemaining,
}: Readonly<{ checkedIn: boolean; overdueTasks: number; pendingTasks: number; annualLeaveRemaining: number | null }>): InsightItem[] {
  const taskInsight = getTaskInsight(pendingTasks, overdueTasks);
  const leaveInsight = getLeaveInsight(annualLeaveRemaining);

  return [
    {
      type: checkedIn ? "positive" : "warning",
      iconPath: INSIGHT_ICON_PATHS.attendance,
      title: checkedIn ? "Attendance logged" : "Not checked in yet",
      body: checkedIn ? "Your attendance is recorded for today. Keep it up!" : "Don't forget to check in via the Attendance module.",
    },
    { ...taskInsight, iconPath: INSIGHT_ICON_PATHS.tasks },
    { ...leaveInsight, iconPath: INSIGHT_ICON_PATHS.leave },
  ];
}

function InsightsHeader() {
  return (
    <div className="bg-gradient-ai px-5 py-4">
      <div className="flex items-center gap-2">
        <svg className="size-4 text-white/90" viewBox="0 0 24 24" fill="none">
          <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h3 className="section-title text-white dark:text-white">AI Productivity Insights</h3>
      </div>
      <p className="mt-0.5 text-xs text-white/60">Live · based on your data</p>
    </div>
  );
}

function InsightsBody({ insights }: Readonly<{ insights: InsightItem[] }>) {
  return (
    <div className="flex flex-1 flex-col gap-2.5 p-5">
      {insights.map((item) => (
        <div key={`${item.type}-${item.title}`} className={`flex items-start gap-3 rounded-lg p-3 text-xs ${COLOR_MAP[item.type]}`}>
          <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none">
            <path d={item.iconPath} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div>
            <p className="font-semibold">{item.title}</p>
            <p className="mt-0.5 opacity-80">{item.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function InsightsFooter() {
  return (
    <div className="divider px-5 py-3">
      <Link href="/ai" className="flex items-center gap-1 text-xs font-semibold text-violet-DEFAULT hover:text-violet-dark dark:text-violet-300">
        Ask AI for more insights
        <svg className="size-3.5" viewBox="0 0 24 24" fill="none">
          <path d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  );
}

export async function AIInsightsCard() {
  const { overdueTasks, pendingTasks, annualLeaveRemaining, checkedIn } =
    await getInsightsData().catch(() => ({
      overdueTasks: 0,
      pendingTasks: 0,
      annualLeaveRemaining: null as number | null,
      checkedIn: false,
    }));
  const insights = buildInsights({ checkedIn, overdueTasks, pendingTasks, annualLeaveRemaining });

  return (
    <div className="flex h-full flex-col card overflow-hidden">
      <InsightsHeader />
      <InsightsBody insights={insights} />
      <InsightsFooter />
    </div>
  );
}
