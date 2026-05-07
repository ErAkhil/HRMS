import Link from "next/link";

export const metadata = { title: "Leadership Dashboard | Unikove" };

const headcountData = [
  { month: "Jun", count: 218, prev: 215 },
  { month: "Jul", count: 220, prev: 218 },
  { month: "Aug", count: 221, prev: 220 },
  { month: "Sep", count: 225, prev: 221 },
  { month: "Oct", count: 228, prev: 225 },
  { month: "Nov", count: 231, prev: 228 },
  { month: "Dec", count: 231, prev: 231 },
  { month: "Jan", count: 235, prev: 231 },
  { month: "Feb", count: 238, prev: 235 },
  { month: "Mar", count: 238, prev: 238 },
  { month: "Apr", count: 242, prev: 238 },
  { month: "May", count: 248, prev: 242 },
];

const MIN_HC = 218;
const MAX_HC = 248;
const BAR_MAX_PX = 100;
const BAR_MIN_PX = 20;

function barHeight(count: number): number {
  const ratio = (count - MIN_HC) / (MAX_HC - MIN_HC);
  return Math.round(BAR_MIN_PX + ratio * (BAR_MAX_PX - BAR_MIN_PX));
}

const healthIndicators = [
  { label: "Employee Satisfaction", score: 91, max: 100, color: "bg-emerald-500" },
  { label: "Retention Rate", score: 95.6, max: 100, color: "bg-emerald-500" },
  { label: "Goal Completion", score: 74, max: 100, color: "bg-indigo-500" },
  { label: "Manager Effectiveness", score: 82, max: 100, color: "bg-indigo-500" },
  { label: "Learning Participation", score: 68, max: 100, color: "bg-amber-500" },
  { label: "Diversity Index", score: 78, max: 100, color: "bg-violet-500" },
];

const deptHealth = [
  { name: "Engineering", score: 89, headcount: 89, color: "bg-emerald-50 text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald" },
  { name: "Product", score: 85, headcount: 38, color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300" },
  { name: "Sales", score: 79, headcount: 54, color: "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber" },
  { name: "Finance", score: 91, headcount: 29, color: "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald" },
  { name: "HR", score: 88, headcount: 22, color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300" },
];

const okrs = [
  { goal: "Reach 260 headcount by June 30", progress: 95.4, status: "Near Done", badge: "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald", barColor: "bg-emerald-500" },
  { goal: "Achieve <5% attrition", progress: 88, status: "On Track", badge: "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald", barColor: "bg-emerald-500" },
  { goal: "100% Q2 performance reviews", progress: 0, status: "Not Started", badge: "bg-rose-light text-rose-dark dark:bg-rose-dark/20 dark:text-rose", barColor: "bg-rose-500" },
  { goal: "Launch Platform v2.0 by May 31", progress: 68, status: "In Progress", badge: "bg-violet-light text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300", barColor: "bg-violet-500" },
  { goal: "POSH compliance 100%", progress: 68, status: "At Risk", badge: "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber", barColor: "bg-amber-500" },
  { goal: "Employee NPS >60", progress: 100, status: "Achieved", badge: "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald", barColor: "bg-emerald-500" },
];

const decisions = [
  { done: true, text: "Approve Q2 hiring plan", urgency: "Completed", badge: "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald" },
  { done: false, text: "Annual salary revision — 248 employees", urgency: "Urgent", badge: "bg-rose-light text-rose-dark dark:bg-rose-dark/20 dark:text-rose" },
  { done: false, text: "Approve remote work policy v2.0", urgency: "This Week", badge: "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber" },
  { done: false, text: "Q2 performance cycle launch", urgency: "This Week", badge: "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber" },
  { done: false, text: "ESOP allocation for 12 employees", urgency: "Pending", badge: "bg-violet-light text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300" },
  { done: false, text: "New office lease renewal", urgency: "Jun 30", badge: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300" },
  { done: false, text: "Leadership offsite planning", urgency: "Jul", badge: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300" },
  { done: false, text: "DEI initiative budget approval", urgency: "Pending", badge: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300" },
  { done: false, text: "HR tech upgrade decision", urgency: "Q3", badge: "bg-violet-light text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300" },
];

const funnelStages = [
  { label: "Total Applications", count: 312, pct: 100, conv: "—" },
  { label: "Screening Passed", count: 187, pct: 60, conv: "59.9%" },
  { label: "Interviewed", count: 84, pct: 27, conv: "44.9%" },
  { label: "Offers Extended", count: 23, pct: 7.4, conv: "27.4%" },
  { label: "Hired", count: 14, pct: 4.5, conv: "60.9%" },
];

const calendarEvents = [
  {
    date: "May 7",
    isToday: true,
    title: "All-Hands Standup",
    details: "10:00 AM · 248 invited",
    type: "LIVE",
    typeBadge: "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
    pulse: true,
    action: "Join",
  },
  {
    date: "May 8",
    isToday: false,
    title: "Q2 Board Presentation Prep",
    details: "2:00 PM · CEO + CFO + CTO",
    type: "Meeting",
    typeBadge: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300",
    pulse: false,
    action: "View",
  },
  {
    date: "May 12",
    isToday: false,
    title: "All-Hands Company Meeting",
    details: "3:00 PM · All 248 employees",
    type: "Announcement",
    typeBadge: "bg-violet-light text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300",
    pulse: false,
    action: "View",
  },
  {
    date: "May 15",
    isToday: false,
    title: "Q2 Performance Cycle Launch",
    details: "HR + all managers",
    type: "Milestone",
    typeBadge: "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber",
    pulse: false,
    action: "View",
  },
  {
    date: "May 31",
    isToday: false,
    title: "Payroll Cutoff & Processing",
    details: "Finance + HR",
    type: "Deadline",
    typeBadge: "bg-rose-light text-rose-dark dark:bg-rose-dark/20 dark:text-rose",
    pulse: false,
    action: "View",
  },
];

const boardUpdates = [
  { text: "Q1 results presented — 94% targets met", source: "Board", date: "April 30" },
  { text: "Series C roadmap discussed — hiring freeze lifted", source: "CEO", date: "April 15" },
  { text: "ESG report approved for publishing", source: "Compliance", date: "April 10" },
];

export default function LeadershipDashboardPage() {
  return (
    <div className="space-y-4 md:space-y-6">

      {/* ── Section 1: Executive Header ── */}
      <div className="bg-gradient-to-r from-slate-800 to-indigo-900 text-white rounded-xl p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">Acme Corp · Executive Overview</h1>
            <p className="mt-0.5 text-sm text-white/70">May 2026 · Q2 Performance</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                "248 Employees",
                "91% Engagement",
                "4.4% Attrition YTD",
                "₹2.4Cr Monthly Payroll",
                "17 Open Roles",
              ].map((stat) => (
                <span
                  key={stat}
                  className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white"
                >
                  {stat}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <p className="text-xs text-white/50">Last updated: May 7, 2026 · 09:30 AM IST</p>
            <button className="rounded-lg border border-white/40 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 transition-colors">
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* ── Section 2: Strategic KPI Row ── */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {/* Org Health Score */}
        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 border-t-4 border-indigo-500">
          <p className="text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Org Health Score</p>
          <p className="mt-2 text-3xl font-bold text-indigo-600">87<span className="text-lg text-dark-5 dark:text-dark-6">/100</span></p>
          <span className="mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald">
            ↑ 3pts vs Q1
          </span>
        </div>

        {/* Employee Engagement */}
        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 border-t-4 border-emerald-500">
          <p className="text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Employee Engagement</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">91%</p>
          <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">Q1 Survey · 248 responses</p>
        </div>

        {/* YTD Attrition */}
        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 border-t-4 border-amber-500">
          <p className="text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">YTD Attrition</p>
          <p className="mt-2 text-3xl font-bold text-amber-600">4.4%</p>
          <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">11 exits · Industry avg 8.2%</p>
        </div>

        {/* Time to Productivity */}
        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 border-t-4 border-violet-500">
          <p className="text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Time to Productivity</p>
          <p className="mt-2 text-3xl font-bold text-violet-600">32<span className="text-sm font-medium"> days</span></p>
          <span className="mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald">
            ↓ 6 days vs last year
          </span>
        </div>
      </div>

      {/* ── Section 3: Workforce Trends + Org Health ── */}
      <div className="grid gap-4 md:grid-cols-12 md:gap-6">

        {/* Left: Workforce Trends */}
        <div className="md:col-span-8 rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-dark dark:text-white">Headcount &amp; Attrition — 12 Months</h2>
            <button className="text-xs text-indigo-600 hover:underline dark:text-indigo-400">Download →</button>
          </div>

          {/* Bar chart */}
          <div className="mt-4 flex items-end gap-1 overflow-x-auto pb-1">
            {headcountData.map((d) => {
              const h = barHeight(d.count);
              const net = d.count - d.prev;
              return (
                <div key={d.month} className="flex flex-1 min-w-[28px] flex-col items-center gap-0.5">
                  <span className="text-[10px] font-semibold text-dark dark:text-white">{d.count}</span>
                  <div
                    className="w-full rounded-t bg-indigo-600/80"
                    style={{ height: `${h}px` }}
                  />
                  <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                    +{net}
                  </span>
                  <span className="text-[10px] text-dark-5 dark:text-dark-6">{d.month}</span>
                </div>
              );
            })}
          </div>

          {/* Trend metrics */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg bg-gray-50 dark:bg-dark-3 p-3">
              <p className="text-xs text-dark-5 dark:text-dark-6">Total Hired (YTD)</p>
              <p className="mt-0.5 text-lg font-bold text-dark dark:text-white">42</p>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">+12% vs LY</span>
            </div>
            <div className="rounded-lg bg-gray-50 dark:bg-dark-3 p-3">
              <p className="text-xs text-dark-5 dark:text-dark-6">Total Exits (YTD)</p>
              <p className="mt-0.5 text-lg font-bold text-dark dark:text-white">11</p>
              <span className="text-xs font-medium text-rose-500 dark:text-rose-400">Rate 4.4%</span>
            </div>
            <div className="rounded-lg bg-gray-50 dark:bg-dark-3 p-3">
              <p className="text-xs text-dark-5 dark:text-dark-6">Avg Tenure</p>
              <p className="mt-0.5 text-lg font-bold text-dark dark:text-white">2.8 yrs</p>
              <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">↑ from 2.6</span>
            </div>
            <div className="rounded-lg bg-gray-50 dark:bg-dark-3 p-3">
              <p className="text-xs text-dark-5 dark:text-dark-6">Offer Acceptance</p>
              <p className="mt-0.5 text-lg font-bold text-dark dark:text-white">84%</p>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">↑ 6%</span>
            </div>
          </div>
        </div>

        {/* Right: Org Health Indicators */}
        <div className="md:col-span-4 flex flex-col gap-4">

          {/* Health Score card */}
          <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
            <h2 className="text-sm font-semibold text-dark dark:text-white">Health Score · 87/100</h2>
            <div className="mt-3 space-y-3">
              {healthIndicators.map((ind) => (
                <div key={ind.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-dark-5 dark:text-dark-6">{ind.label}</span>
                    <span className="text-xs font-semibold text-dark dark:text-white">{ind.score}</span>
                  </div>
                  <div className="relative h-1.5 rounded-full bg-gray-2 dark:bg-dark-3 overflow-hidden">
                    <div
                      className={`absolute inset-y-0 left-0 rounded-full ${ind.color}`}
                      style={{ width: `${ind.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Department Health card */}
          <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
            <h2 className="text-sm font-semibold text-dark dark:text-white">Department Health</h2>
            <div className="mt-3 space-y-2.5">
              {deptHealth.map((dept) => (
                <div key={dept.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-dark dark:text-white">{dept.name}</span>
                    <span className="rounded-full bg-gray-100 dark:bg-dark-3 px-1.5 py-0.5 text-[10px] text-dark-5 dark:text-dark-6">
                      {dept.headcount}
                    </span>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${dept.color}`}>
                    {dept.score}/100
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 4: Three Columns ── */}
      <div className="grid gap-4 md:grid-cols-3 md:gap-6">

        {/* Card A: Strategic Goals Q2 2026 */}
        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-dark dark:text-white">Strategic Goals Q2 2026</h2>
            <span className="text-xs text-dark-5 dark:text-dark-6">6 objectives</span>
          </div>
          <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">Company OKRs</p>

          <div className="mt-4 space-y-3">
            {okrs.map((okr) => (
              <div key={okr.goal}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-xs text-dark dark:text-white truncate flex-1">{okr.goal}</span>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${okr.badge}`}>
                    {okr.status}
                  </span>
                </div>
                <div className="relative h-1.5 rounded-full bg-gray-2 dark:bg-dark-3 overflow-hidden">
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full ${okr.barColor}`}
                    style={{ width: `${okr.progress}%` }}
                  />
                </div>
                <p className="mt-0.5 text-[10px] text-dark-5 dark:text-dark-6">{okr.progress}% complete</p>
              </div>
            ))}
          </div>

          <p className="mt-4 rounded-lg bg-gray-50 dark:bg-dark-3 px-3 py-2 text-xs text-dark-5 dark:text-dark-6">
            4 on track · 1 at risk · 1 not started
          </p>
        </div>

        {/* Card B: Payroll & Cost Overview */}
        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-dark dark:text-white">Payroll &amp; Cost Overview</h2>
            <Link href="#" className="text-xs text-indigo-600 hover:underline dark:text-indigo-400">CFO Report →</Link>
          </div>
          <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">May 2026 Cost Snapshot</p>

          <div className="mt-4 space-y-3">
            <div>
              <p className="text-xs text-dark-5 dark:text-dark-6">Total Payroll</p>
              <p className="text-2xl font-bold text-indigo-600">₹2.4 Cr</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-gray-50 dark:bg-dark-3 p-2.5">
                <p className="text-[10px] text-dark-5 dark:text-dark-6">Avg CTC</p>
                <p className="text-sm font-semibold text-dark dark:text-white">₹96,774<span className="text-xs font-normal">/mo</span></p>
              </div>
              <div className="rounded-lg bg-gray-50 dark:bg-dark-3 p-2.5">
                <p className="text-[10px] text-dark-5 dark:text-dark-6">Benefits Cost</p>
                <p className="text-sm font-semibold text-dark dark:text-white">₹18.2 L</p>
                <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400">+3% YoY</span>
              </div>
              <div className="rounded-lg bg-gray-50 dark:bg-dark-3 p-2.5 col-span-2">
                <p className="text-[10px] text-dark-5 dark:text-dark-6">Overtime</p>
                <p className="text-sm font-semibold text-dark dark:text-white">
                  ₹2.1 L <span className="text-xs font-normal text-rose-500 dark:text-rose-400">0.87% of payroll</span>
                </p>
              </div>
            </div>
          </div>

          {/* Stacked cost bar */}
          <div className="mt-4">
            <p className="mb-1.5 text-xs text-dark-5 dark:text-dark-6">Cost Breakdown</p>
            <div className="flex h-5 w-full overflow-hidden rounded-full">
              <div className="bg-indigo-600" style={{ width: "82%" }} title="Base Salary 82%" />
              <div className="bg-emerald-500" style={{ width: "7.6%" }} title="Benefits 7.6%" />
              <div className="bg-amber-500" style={{ width: "5.4%" }} title="Bonus 5.4%" />
              <div className="bg-gray-300 dark:bg-dark-3" style={{ width: "5%" }} title="Other 5%" />
            </div>
            <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
              {[
                { label: "Base", pct: "82%", color: "bg-indigo-600" },
                { label: "Benefits", pct: "7.6%", color: "bg-emerald-500" },
                { label: "Bonus", pct: "5.4%", color: "bg-amber-500" },
                { label: "Other", pct: "5%", color: "bg-gray-300 dark:bg-dark-3" },
              ].map((seg) => (
                <div key={seg.label} className="flex items-center gap-1">
                  <span className={`h-2 w-2 rounded-full ${seg.color}`} />
                  <span className="text-[10px] text-dark-5 dark:text-dark-6">{seg.label} {seg.pct}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="rounded-full px-2 py-0.5 text-xs font-medium bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber">
              Payroll: Not Started
            </span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">-2.1% under budget</span>
          </div>
        </div>

        {/* Card C: Upcoming Executive Decisions */}
        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-dark dark:text-white">Upcoming Executive Decisions</h2>
            <span className="text-xs text-dark-5 dark:text-dark-6">9 items</span>
          </div>
          <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">Decision Board</p>

          <div className="mt-4 space-y-2.5">
            {decisions.map((item) => (
              <div key={item.text} className="flex items-start gap-2">
                <span className={`mt-0.5 h-3 w-3 shrink-0 rounded-full border-2 ${item.done ? "border-emerald-500 bg-emerald-500" : "border-gray-300 dark:border-dark-3 bg-transparent"}`} />
                <span className={`flex-1 text-xs text-dark dark:text-white ${item.done ? "opacity-60" : ""}`}>
                  {item.text}
                </span>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${item.badge}`}>
                  {item.urgency}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Section 5: Talent Funnel + Calendar ── */}
      <div className="grid gap-4 md:grid-cols-12 md:gap-6">

        {/* Left: Talent Acquisition Funnel */}
        <div className="md:col-span-5 rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-dark dark:text-white">Talent Acquisition Funnel</h2>
            <span className="text-xs text-dark-5 dark:text-dark-6">Recruitment — May 2026</span>
          </div>

          <div className="mt-4 space-y-2.5">
            {funnelStages.map((stage, idx) => (
              <div key={stage.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-dark dark:text-white">{stage.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-dark dark:text-white">{stage.count}</span>
                    {idx > 0 && (
                      <span className="text-[10px] text-dark-5 dark:text-dark-6">({stage.conv})</span>
                    )}
                  </div>
                </div>
                <div className="relative h-2 rounded-full bg-gray-2 dark:bg-dark-3 overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-indigo-600"
                    style={{ width: `${stage.pct}%`, opacity: 1 - idx * 0.12 }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-gray-50 dark:bg-dark-3 p-3">
            <div className="text-center">
              <p className="text-xs text-dark-5 dark:text-dark-6">Avg Time to Fill</p>
              <p className="text-sm font-bold text-dark dark:text-white">18 days</p>
            </div>
            <div className="text-center border-x border-gray-200 dark:border-dark-3">
              <p className="text-xs text-dark-5 dark:text-dark-6">Cost per Hire</p>
              <p className="text-sm font-bold text-dark dark:text-white">₹42,000</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-dark-5 dark:text-dark-6">Offer Acceptance</p>
              <p className="text-sm font-bold text-dark dark:text-white">84%</p>
            </div>
          </div>
        </div>

        {/* Right: Announcements & Calendar */}
        <div className="md:col-span-7 rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-dark dark:text-white">This Week</h2>
            <Link
              href="/calendar"
              className="text-xs text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Full Calendar →
            </Link>
          </div>

          {/* Timeline */}
          <div className="mt-4 space-y-3">
            {calendarEvents.map((ev) => (
              <div key={ev.title} className="flex items-start gap-3">
                <div className="shrink-0 text-center">
                  <span
                    className={`block rounded-lg px-2 py-1 text-[10px] font-semibold ${
                      ev.isToday
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 dark:bg-dark-3 text-dark-5 dark:text-dark-6"
                    }`}
                  >
                    {ev.date}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    {ev.pulse && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                      </span>
                    )}
                    <p className="text-sm font-semibold text-dark dark:text-white truncate">{ev.title}</p>
                  </div>
                  <p className="text-xs text-dark-5 dark:text-dark-6">{ev.details}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${ev.typeBadge}`}>
                    {ev.type}
                  </span>
                  <button className="rounded-lg border border-gray-3 bg-white px-4 py-2 text-sm font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white text-xs !py-0.5 !px-2">
                    {ev.action}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Board Updates */}
          <div className="mt-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6 mb-2">
              Recent Board Updates
            </h3>
            <div className="space-y-2">
              {boardUpdates.map((update) => (
                <div
                  key={update.text}
                  className="border-l-2 border-indigo-500 pl-3"
                >
                  <p className="text-xs text-dark dark:text-white">{update.text}</p>
                  <p className="text-[10px] text-dark-5 dark:text-dark-6 mt-0.5">
                    {update.source} · {update.date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
