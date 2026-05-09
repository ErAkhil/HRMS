import Image from "next/image";
import Link from "next/link";

export const metadata = { title: "HR Dashboard | Unikove" };

const badgeClass = {
  indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300",
  emerald: "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  amber: "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber",
  rose: "bg-rose-light text-rose-dark dark:bg-rose-dark/20 dark:text-rose",
  violet: "bg-violet-light text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300",
};

const actionItems = [
  { urgency: "URGENT", urgencyColor: "rose" as const, description: "Contract renewal: Arjun Mehta (EMP-0089) — expires May 15", cta: "Renew", href: "/employees/EMP-0089" },
  { urgency: "URGENT", urgencyColor: "rose" as const, description: "Exit formalities: John Doe (EMP-0121) — last day May 10", cta: "Process", href: "/employees/EMP-0121" },
  { urgency: "URGENT", urgencyColor: "rose" as const, description: "Probation decision: James Chen (EMP-0201) — 90-day period ends May 9", cta: "Review", href: "/performance/reviews" },
  { urgency: "THIS WEEK", urgencyColor: "amber" as const, description: "Leave approval: 5 pending requests awaiting approval", cta: "View All", href: "/leave/approvals" },
  { urgency: "THIS WEEK", urgencyColor: "amber" as const, description: "Onboarding: 3 new joiners starting May 12 — setup incomplete", cta: "Setup", href: "/onboarding" },
  { urgency: "THIS WEEK", urgencyColor: "amber" as const, description: "Expense approvals: 4 reimbursement claims (₹41,200 total)", cta: "Review", href: "/payroll/expenses" },
  { urgency: "UPCOMING", urgencyColor: "indigo" as const, description: "Payroll processing: May 2026 payroll due May 31", cta: "Start", href: "/payroll" },
  { urgency: "UPCOMING", urgencyColor: "indigo" as const, description: "Performance cycle: Q2 reviews start June 1 — configure reviewers", cta: "Configure", href: "/performance" },
  { urgency: "UPCOMING", urgencyColor: "indigo" as const, description: "Policy update: Remote work policy needs manager sign-off", cta: "Send", href: "/employees" },
  { urgency: "UPCOMING", urgencyColor: "indigo" as const, description: "Compliance: POSH training completion deadline June 30 (68% done)", cta: "Track", href: "/reports" },
  { urgency: "UPCOMING", urgencyColor: "indigo" as const, description: "Salary revision: Annual appraisal cycle — 248 employees pending", cta: "Plan", href: "/performance/analytics" },
];

const recruitmentRoles = [
  { title: "Senior Backend Engineer", dept: "Engineering", deptColor: "indigo" as const, applicants: 14, stage: "Interview", stageColor: "violet" as const },
  { title: "Product Designer", dept: "Product", deptColor: "violet" as const, applicants: 8, stage: "Screening", stageColor: "amber" as const },
  { title: "Sales Executive ×2", dept: "Sales", deptColor: "emerald" as const, applicants: 21, stage: "Applied", stageColor: "indigo" as const },
  { title: "HR Business Partner", dept: "HR", deptColor: "rose" as const, applicants: 5, stage: "Offer", stageColor: "emerald" as const },
  { title: "DevOps Engineer", dept: "Engineering", deptColor: "indigo" as const, applicants: 11, stage: "Interview", stageColor: "violet" as const },
];

const onboardingPeople = [
  { name: "Marcus Chen", img: "/user-09.png", pct: 85, day: 14, dept: "Engineering", color: "indigo" as const, barColor: "bg-indigo-500" },
  { name: "Nina Foster", img: "/user-06.png", pct: 60, day: 12, dept: "HR", color: "violet" as const, barColor: "bg-violet-500" },
  { name: "Tom Bradley", img: "/user-08.png", pct: 40, day: 8, dept: "Sales", color: "amber" as const, barColor: "bg-amber-500" },
  { name: "Lisa Wang", img: "/user-07.png", pct: 20, day: 4, dept: "Finance", color: "rose" as const, barColor: "bg-rose-500" },
  { name: "Raj Kumar", img: "/user-10.png", pct: 95, day: 28, dept: "Engineering", color: "emerald" as const, barColor: "bg-emerald-500" },
  { name: "Anika Patel", img: "/user-11.png", pct: 10, day: 2, dept: "Product", color: "indigo" as const, barColor: "bg-indigo-500" },
];

const complianceItems = [
  { title: "POSH Training", detail: "68% complete (168/248)", status: "In Progress", statusColor: "amber" as const, due: "Due Jun 30" },
  { title: "Fire Safety Drill", detail: "Scheduled May 20", status: "Upcoming", statusColor: "indigo" as const, due: "Upcoming" },
  { title: "IT Security Audit", detail: "92% done (228/248)", status: "On Track", statusColor: "emerald" as const, due: "Due May 15" },
  { title: "Annual Health Check", detail: "Not started", status: "Not Started", statusColor: "rose" as const, due: "Due Jul 31" },
];

const headcountMonths = [
  { label: "Dec '25", count: 228, height: 55 },
  { label: "Jan '26", count: 231, height: 62 },
  { label: "Feb '26", count: 235, height: 72 },
  { label: "Mar '26", count: 238, height: 80 },
  { label: "Apr '26", count: 242, height: 95 },
  { label: "May '26", count: 248, height: 120 },
];

const deptHeadcount = [
  { dept: "Engineering", count: 89, delta: "+3", deltaColor: "text-emerald-dark dark:text-emerald" },
  { dept: "Sales", count: 54, delta: "+2", deltaColor: "text-emerald-dark dark:text-emerald" },
  { dept: "Product", count: 38, delta: "+4", deltaColor: "text-emerald-dark dark:text-emerald" },
  { dept: "Finance", count: 29, delta: "+2", deltaColor: "text-emerald-dark dark:text-emerald" },
  { dept: "HR", count: 22, delta: "+3", deltaColor: "text-emerald-dark dark:text-emerald" },
  { dept: "Ops", count: 16, delta: "0", deltaColor: "text-dark-5 dark:text-dark-6" },
];

const attritionRisk = [
  { name: "Alex Turner", img: "/user-15.png", dept: "Sales", reason: "Low engagement score 42%", risk: "High Risk", riskColor: "rose" as const },
  { name: "Mike Brown", img: "/user-03.png", dept: "Engineering", reason: "No performance review in 180 days", risk: "Medium", riskColor: "amber" as const },
  { name: "Sara Patel", img: "/user-26.png", dept: "Finance", reason: "3 unapproved expenses", risk: "Medium", riskColor: "amber" as const },
  { name: "Chris Lee", img: "/user-23.png", dept: "Operations", reason: "Absent 8 days this month", risk: "High Risk", riskColor: "rose" as const },
];

const exitReasons = [
  { reason: "Better Opportunity", exits: 5, pct: 45, barColor: "bg-rose-500", width: "45%" },
  { reason: "Work-Life Balance", exits: 3, pct: 27, barColor: "bg-amber-500", width: "27%" },
  { reason: "Compensation", exits: 3, pct: 27, barColor: "bg-violet-500", width: "27%" },
];

export default function HRDashboardPage() {
  return (
    <div className="space-y-4 md:space-y-6">

      {/* Section 1: Greeting / Command Header */}
      <div className="bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-xl p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3">
            <div>
              <h1 className="text-xl font-bold text-white">Good morning, Meera 👋</h1>
              <p className="text-sm text-white/70 mt-0.5">Wednesday, May 7, 2026 &nbsp;·&nbsp; HR Operations Center</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/payroll" className="rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 transition-colors">
                Run Payroll
              </Link>
              <Link href="/employees/new" className="rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 transition-colors">
                Add Employee
              </Link>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 md:flex-col md:items-end lg:flex-row">
            <span className="rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-xs font-semibold text-white">11 Pending Actions</span>
            <span className="rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-xs font-semibold text-white">3 Open Positions</span>
            <span className="rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-xs font-semibold text-white">2 Exits This Month</span>
            <span className="rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-xs font-semibold text-white">Payroll Due May 31</span>
          </div>
        </div>
      </div>

      {/* Section 2: KPI Row */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Total Headcount</p>
              <p className="mt-1.5 text-3xl font-bold text-dark dark:text-white">248</p>
              <p className="mt-1 text-xs text-indigo-600 dark:text-indigo-400 font-medium">↑ 14 this month</p>
            </div>
            <span className="rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300 text-lg">👥</span>
          </div>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Open Positions</p>
              <p className="mt-1.5 text-3xl font-bold text-dark dark:text-white">17</p>
              <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">Across 6 departments</p>
            </div>
            <span className="rounded-lg bg-amber-light p-2 text-amber-dark dark:bg-amber-dark/20 dark:text-amber text-lg">📋</span>
          </div>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Monthly Attrition</p>
              <p className="mt-1.5 text-3xl font-bold text-dark dark:text-white">2</p>
              <p className="mt-1 text-xs text-rose-dark dark:text-rose font-medium">0.8% rate</p>
            </div>
            <span className="rounded-lg bg-rose-light p-2 text-rose-dark dark:bg-rose-dark/20 dark:text-rose text-lg">📉</span>
          </div>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Time to Hire</p>
              <p className="mt-1.5 text-3xl font-bold text-dark dark:text-white">18d</p>
              <p className="mt-1 text-xs text-emerald-dark dark:text-emerald font-medium">↓ 3 days vs last month</p>
            </div>
            <span className="rounded-lg bg-emerald-light p-2 text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald text-lg">⏱️</span>
          </div>
        </div>
      </div>

      {/* Section 3: Action Items + Leave / Payroll */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6">

        {/* Left: HR Action Items */}
        <div className="md:col-span-8 rounded-xl bg-white shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h2 className="font-semibold text-dark dark:text-white">Pending Actions</h2>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${badgeClass.rose}`}>11</span>
          </div>
          <div className="px-5 pb-5">
            {actionItems.map((item, i) => (
              <div
                key={i}
                className="py-2.5 border-b border-gray-3 dark:border-dark-3 flex items-center justify-between gap-3 last:border-0"
              >
                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                  <span className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${badgeClass[item.urgencyColor]}`}>
                    {item.urgency}
                  </span>
                  <p className="text-xs text-dark-5 dark:text-dark-6 leading-snug">{item.description}</p>
                </div>
                <Link
                  href={item.href}
                  className="shrink-0 rounded-lg border border-gray-3 bg-white px-3 py-1 text-xs font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                >
                  {item.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Leave + Payroll */}
        <div className="md:col-span-4 flex flex-col gap-4">

          {/* Leave Overview */}
          <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-dark dark:text-white">Leave Today</h2>
              <span className="text-xs text-dark-5 dark:text-dark-6">May 7, 2026</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="rounded-lg bg-amber-light dark:bg-amber-dark/20 px-3 py-2 text-center">
                <p className="text-lg font-bold text-amber-dark dark:text-amber">12</p>
                <p className="text-[10px] font-semibold text-amber-dark/80 dark:text-amber/80">On Leave</p>
              </div>
              <div className="rounded-lg bg-indigo-50 dark:bg-indigo-900/20 px-3 py-2 text-center">
                <p className="text-lg font-bold text-indigo-600 dark:text-indigo-300">18</p>
                <p className="text-[10px] font-semibold text-indigo-600/80 dark:text-indigo-300/80">WFH</p>
              </div>
              <div className="rounded-lg bg-rose-light dark:bg-rose-dark/20 px-3 py-2 text-center">
                <p className="text-lg font-bold text-rose-dark dark:text-rose">4</p>
                <p className="text-[10px] font-semibold text-rose-dark/80 dark:text-rose/80">Late</p>
              </div>
              <div className="rounded-lg bg-emerald-light dark:bg-emerald-dark/20 px-3 py-2 text-center">
                <p className="text-lg font-bold text-emerald-dark dark:text-emerald">214</p>
                <p className="text-[10px] font-semibold text-emerald-dark/80 dark:text-emerald/80">Present</p>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              {[
                { label: "On Leave", count: 12, pct: (12 / 248) * 100, barColor: "bg-amber-500" },
                { label: "WFH", count: 18, pct: (18 / 248) * 100, barColor: "bg-indigo-500" },
                { label: "Late", count: 4, pct: (4 / 248) * 100, barColor: "bg-rose-500" },
                { label: "Present", count: 214, pct: (214 / 248) * 100, barColor: "bg-emerald-500" },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-2">
                  <span className="w-16 shrink-0 text-[10px] text-dark-5 dark:text-dark-6">{row.label}</span>
                  <div className="flex-1 relative h-1.5 rounded-full bg-gray-2 dark:bg-dark-3 overflow-hidden">
                    <div className={`absolute inset-y-0 left-0 rounded-full ${row.barColor}`} style={{ width: `${row.pct.toFixed(1)}%` }} />
                  </div>
                  <span className="w-6 shrink-0 text-[10px] font-semibold text-dark-5 dark:text-dark-6 text-right">{row.count}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-gray-3 dark:border-dark-3 pt-3">
              <Link href="/leave/calendar" className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">
                View Leave Calendar →
              </Link>
              <Link href="/leave/approvals" className="rounded-lg bg-primary-600 px-3 py-1 text-xs font-semibold text-white hover:bg-primary-700">
                Approvals: 5
              </Link>
            </div>
          </div>

          {/* Payroll Status */}
          <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-dark dark:text-white">Payroll Status</h2>
              <span className="text-xs text-dark-5 dark:text-dark-6">May 2026</span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeClass.amber}`}>Processing not started</span>
            </div>
            <p className="text-xs text-dark-5 dark:text-dark-6 mb-3">Cutoff: May 25 &nbsp;·&nbsp; Payday: May 31</p>
            <div className="space-y-2 mb-4">
              {[
                { label: "Attendance data collected", done: true },
                { label: "Leave deductions calculated", done: true },
                { label: "Reimbursements approved", done: false, pending: true },
                { label: "Salary revisions updated", done: false, pending: false },
                { label: "Payroll run", done: false, pending: false },
              ].map((step) => (
                <div key={step.label} className="flex items-center gap-2">
                  {step.done ? (
                    <span className="shrink-0 text-emerald-dark dark:text-emerald text-sm font-bold">✓</span>
                  ) : step.pending ? (
                    <span className="shrink-0 w-4 h-4 rounded-full border-2 border-amber-500 bg-amber-light dark:bg-amber-dark/20" />
                  ) : (
                    <span className="shrink-0 w-4 h-4 rounded-full border-2 border-gray-3 dark:border-dark-3" />
                  )}
                  <span className={`text-xs ${step.done ? "text-emerald-dark dark:text-emerald" : step.pending ? "text-amber-dark dark:text-amber" : "text-dark-5 dark:text-dark-6"}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
            <Link href="/payroll" className="block w-full rounded-lg bg-primary-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-primary-700">
              Start Payroll →
            </Link>
          </div>

        </div>
      </div>

      {/* Section 4: Three Columns */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">

        {/* Card A: Recruitment Pipeline */}
        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-dark dark:text-white">Open Roles · 17</h2>
            <Link href="/recruitment" className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">View All →</Link>
          </div>
          <div className="space-y-3">
            {recruitmentRoles.map((role) => (
              <div key={role.title} className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-dark dark:text-white truncate">{role.title}</p>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${badgeClass[role.deptColor]}`}>{role.dept}</span>
                    <span className="text-[10px] text-dark-5 dark:text-dark-6">{role.applicants} applicants</span>
                  </div>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${badgeClass[role.stageColor]}`}>{role.stage}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-gray-3 dark:border-dark-3 pt-3">
            <p className="text-xs text-dark-5 dark:text-dark-6">3 offers pending · Avg 18 days to hire</p>
          </div>
        </div>

        {/* Card B: Onboarding Status */}
        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-dark dark:text-white">Active Onboarding · 6</h2>
            <Link href="/onboarding" className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">View →</Link>
          </div>
          <div className="space-y-3">
            {onboardingPeople.map((person) => (
              <div key={person.name} className="flex items-center gap-2.5">
                <Image src={person.img} alt={person.name} width={28} height={28} className="rounded-full object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <p className="text-xs font-semibold text-dark dark:text-white truncate">{person.name}</p>
                    <span className="text-[10px] text-dark-5 dark:text-dark-6 shrink-0">{person.pct}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative h-1 w-20 rounded-full bg-gray-2 dark:bg-dark-3 overflow-hidden">
                      <div className={`absolute inset-y-0 left-0 rounded-full ${person.barColor}`} style={{ width: `${person.pct}%` }} />
                    </div>
                    <span className="text-[10px] text-dark-5 dark:text-dark-6">Day {person.day}/30</span>
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${badgeClass[person.color]}`}>{person.dept}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-gray-3 dark:border-dark-3 pt-3">
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${badgeClass.emerald}`}>3 completing this week</span>
          </div>
        </div>

        {/* Card C: Compliance Tracker */}
        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-dark dark:text-white">Compliance</h2>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeClass.amber}`}>4 items</span>
          </div>
          <div className="space-y-3">
            {complianceItems.map((item) => (
              <div key={item.title} className="border-b border-gray-3 dark:border-dark-3 pb-3 last:border-0 last:pb-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-dark dark:text-white">{item.title}</p>
                    <p className="mt-0.5 text-[10px] text-dark-5 dark:text-dark-6">{item.detail}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${badgeClass[item.statusColor]}`}>{item.status}</span>
                </div>
                <p className="mt-1 text-[10px] text-dark-5 dark:text-dark-6">{item.due}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-gray-3 dark:border-dark-3 pt-3">
            <Link href="/reports" className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">
              View All Compliance →
            </Link>
          </div>
        </div>

      </div>

      {/* Section 5: Headcount Trend + Attrition Risk */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6">

        {/* Left: Headcount Trend */}
        <div className="md:col-span-7 rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-dark dark:text-white">Headcount · Last 6 Months</h2>
            <Link href="/reports" className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">Export →</Link>
          </div>

          {/* Bar Chart */}
          <div className="flex items-end gap-2 h-32 mb-3">
            {headcountMonths.map((m, i) => (
              <div key={m.label} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[10px] font-semibold text-dark-5 dark:text-dark-6">{m.count}</span>
                <div
                  className={`w-full rounded-t-md ${i === headcountMonths.length - 1 ? "bg-indigo-600" : "bg-indigo-200 dark:bg-indigo-900/40"}`}
                  style={{ height: `${m.height}px` }}
                />
                <span className="text-[10px] text-dark-5 dark:text-dark-6 whitespace-nowrap">{m.label}</span>
              </div>
            ))}
          </div>

          {/* Summary Row */}
          <div className="flex items-center gap-4 py-3 border-t border-b border-gray-3 dark:border-dark-3 mb-4">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-emerald-dark dark:text-emerald">+14</span>
              <span className="text-xs text-dark-5 dark:text-dark-6">New Hires (May)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-rose-dark dark:text-rose">-2</span>
              <span className="text-xs text-dark-5 dark:text-dark-6">Exits (May)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">+12</span>
              <span className="text-xs text-dark-5 dark:text-dark-6">Net Growth</span>
            </div>
          </div>

          {/* Department Headcount Table */}
          <h3 className="text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6 mb-2">Department Headcount</h3>
          <div className="divide-y divide-gray-3 dark:divide-dark-3">
            {deptHeadcount.map((row) => (
              <div key={row.dept} className="flex items-center justify-between py-1.5">
                <span className="text-xs font-medium text-dark dark:text-white">{row.dept}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-dark dark:text-white">{row.count}</span>
                  <span className={`text-xs font-semibold ${row.deltaColor}`}>{row.delta}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Attrition Risk + Exit Summary */}
        <div className="md:col-span-5 flex flex-col gap-4">

          {/* Attrition Risk */}
          <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-dark dark:text-white">Attrition Watch</h2>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeClass.amber}`}>4 at risk</span>
            </div>
            <div className="space-y-3">
              {attritionRisk.map((emp) => (
                <div key={emp.name} className="flex items-start gap-2.5 border-b border-gray-3 dark:border-dark-3 pb-3 last:border-0 last:pb-0">
                  <Image src={emp.img} alt={emp.name} width={28} height={28} className="rounded-full object-cover shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-semibold text-dark dark:text-white">{emp.name}</p>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${badgeClass[emp.riskColor]}`}>{emp.risk}</span>
                    </div>
                    <p className="text-[10px] text-dark-5 dark:text-dark-6 mt-0.5">{emp.dept} · {emp.reason}</p>
                    <button className="mt-1.5 rounded px-2 py-0.5 text-[10px] font-semibold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-300 transition-colors">
                      Schedule 1:1
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-gray-3 dark:border-dark-3 pt-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6 mb-2">Attrition Stats</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "This month", value: "2 exits" },
                  { label: "Last month", value: "3 exits" },
                  { label: "YTD", value: "11 exits" },
                  { label: "Rate", value: "4.4%" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-lg bg-gray-1 dark:bg-dark-3/40 px-3 py-2">
                    <p className="text-[10px] text-dark-5 dark:text-dark-6">{stat.label}</p>
                    <p className="text-xs font-bold text-dark dark:text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Exit Interview Summary */}
          <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-dark dark:text-white">Exit Interview Summary</h2>
              <span className="text-xs text-dark-5 dark:text-dark-6">11 exits YTD</span>
            </div>
            <div className="space-y-3">
              {exitReasons.map((item) => (
                <div key={item.reason}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-dark dark:text-white">{item.reason}</span>
                    <span className="text-xs text-dark-5 dark:text-dark-6">{item.exits} exits ({item.pct}%)</span>
                  </div>
                  <div className="relative h-1.5 rounded-full bg-gray-2 dark:bg-dark-3 overflow-hidden">
                    <div className={`absolute inset-y-0 left-0 rounded-full ${item.barColor}`} style={{ width: item.width }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
