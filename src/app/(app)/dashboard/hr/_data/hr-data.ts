export const badgeClass = {
  indigo: "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-300",
  emerald: "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  amber: "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber",
  rose: "bg-rose-light text-rose-dark dark:bg-rose-dark/20 dark:text-rose",
  violet: "bg-violet-light text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300",
} as const;

export type BadgeColor = keyof typeof badgeClass;

export const actionItems = [
  { urgency: "URGENT", urgencyColor: "rose" as BadgeColor, description: "Contract renewal: Arjun Mehta (EMP-0089) — expires May 15", cta: "Renew", href: "/employees/EMP-0089" },
  { urgency: "URGENT", urgencyColor: "rose" as BadgeColor, description: "Exit formalities: John Doe (EMP-0121) — last day May 10", cta: "Process", href: "/employees/EMP-0121" },
  { urgency: "URGENT", urgencyColor: "rose" as BadgeColor, description: "Probation decision: James Chen (EMP-0201) — 90-day period ends May 9", cta: "Review", href: "/performance/reviews" },
  { urgency: "THIS WEEK", urgencyColor: "amber" as BadgeColor, description: "Leave approval: 5 pending requests awaiting approval", cta: "View All", href: "/leave/approvals" },
  { urgency: "THIS WEEK", urgencyColor: "amber" as BadgeColor, description: "Onboarding: 3 new joiners starting May 12 — setup incomplete", cta: "Setup", href: "/onboarding" },
  { urgency: "THIS WEEK", urgencyColor: "amber" as BadgeColor, description: "Expense approvals: 4 reimbursement claims (₹41,200 total)", cta: "Review", href: "/payroll/expenses" },
  { urgency: "UPCOMING", urgencyColor: "indigo" as BadgeColor, description: "Payroll processing: May 2026 payroll due May 31", cta: "Start", href: "/payroll" },
  { urgency: "UPCOMING", urgencyColor: "indigo" as BadgeColor, description: "Performance cycle: Q2 reviews start June 1 — configure reviewers", cta: "Configure", href: "/performance" },
  { urgency: "UPCOMING", urgencyColor: "indigo" as BadgeColor, description: "Policy update: Remote work policy needs manager sign-off", cta: "Send", href: "/employees" },
  { urgency: "UPCOMING", urgencyColor: "indigo" as BadgeColor, description: "Compliance: POSH training completion deadline June 30 (68% done)", cta: "Track", href: "/reports" },
  { urgency: "UPCOMING", urgencyColor: "indigo" as BadgeColor, description: "Salary revision: Annual appraisal cycle — 248 employees pending", cta: "Plan", href: "/performance/analytics" },
];

export const recruitmentRoles = [
  { title: "Senior Backend Engineer", dept: "Engineering", deptColor: "indigo" as BadgeColor, applicants: 14, stage: "Interview", stageColor: "violet" as BadgeColor },
  { title: "Product Designer", dept: "Product", deptColor: "violet" as BadgeColor, applicants: 8, stage: "Screening", stageColor: "amber" as BadgeColor },
  { title: "Sales Executive ×2", dept: "Sales", deptColor: "emerald" as BadgeColor, applicants: 21, stage: "Applied", stageColor: "indigo" as BadgeColor },
  { title: "HR Business Partner", dept: "HR", deptColor: "rose" as BadgeColor, applicants: 5, stage: "Offer", stageColor: "emerald" as BadgeColor },
  { title: "DevOps Engineer", dept: "Engineering", deptColor: "indigo" as BadgeColor, applicants: 11, stage: "Interview", stageColor: "violet" as BadgeColor },
];

export const onboardingPeople = [
  { name: "Marcus Chen", img: "/user-09.png", pct: 85, day: 14, dept: "Engineering", color: "indigo" as BadgeColor, barColor: "bg-primary-500" },
  { name: "Nina Foster", img: "/user-06.png", pct: 60, day: 12, dept: "HR", color: "violet" as BadgeColor, barColor: "bg-violet-500" },
  { name: "Tom Bradley", img: "/user-08.png", pct: 40, day: 8, dept: "Sales", color: "amber" as BadgeColor, barColor: "bg-amber-500" },
  { name: "Lisa Wang", img: "/user-07.png", pct: 20, day: 4, dept: "Finance", color: "rose" as BadgeColor, barColor: "bg-rose-500" },
  { name: "Raj Kumar", img: "/user-10.png", pct: 95, day: 28, dept: "Engineering", color: "emerald" as BadgeColor, barColor: "bg-emerald-500" },
  { name: "Anika Patel", img: "/user-11.png", pct: 10, day: 2, dept: "Product", color: "indigo" as BadgeColor, barColor: "bg-primary-500" },
];

export const complianceItems = [
  { title: "POSH Training", detail: "68% complete (168/248)", status: "In Progress", statusColor: "amber" as BadgeColor, due: "Due Jun 30" },
  { title: "Fire Safety Drill", detail: "Scheduled May 20", status: "Upcoming", statusColor: "indigo" as BadgeColor, due: "Upcoming" },
  { title: "IT Security Audit", detail: "92% done (228/248)", status: "On Track", statusColor: "emerald" as BadgeColor, due: "Due May 15" },
  { title: "Annual Health Check", detail: "Not started", status: "Not Started", statusColor: "rose" as BadgeColor, due: "Due Jul 31" },
];

export const headcountMonths = [
  { label: "Dec '25", count: 228, height: 55 },
  { label: "Jan '26", count: 231, height: 62 },
  { label: "Feb '26", count: 235, height: 72 },
  { label: "Mar '26", count: 238, height: 80 },
  { label: "Apr '26", count: 242, height: 95 },
  { label: "May '26", count: 248, height: 120 },
];

export const deptHeadcount = [
  { dept: "Engineering", count: 89, delta: "+3", deltaColor: "text-emerald-dark dark:text-emerald" },
  { dept: "Sales", count: 54, delta: "+2", deltaColor: "text-emerald-dark dark:text-emerald" },
  { dept: "Product", count: 38, delta: "+4", deltaColor: "text-emerald-dark dark:text-emerald" },
  { dept: "Finance", count: 29, delta: "+2", deltaColor: "text-emerald-dark dark:text-emerald" },
  { dept: "HR", count: 22, delta: "+3", deltaColor: "text-emerald-dark dark:text-emerald" },
  { dept: "Ops", count: 16, delta: "0", deltaColor: "text-dark-5 dark:text-dark-6" },
];

export const attritionRisk = [
  { name: "Alex Turner", img: "/user-15.png", dept: "Sales", reason: "Low engagement score 42%", risk: "High Risk", riskColor: "rose" as BadgeColor },
  { name: "Mike Brown", img: "/user-03.png", dept: "Engineering", reason: "No performance review in 180 days", risk: "Medium", riskColor: "amber" as BadgeColor },
  { name: "Sara Patel", img: "/user-26.png", dept: "Finance", reason: "3 unapproved expenses", risk: "Medium", riskColor: "amber" as BadgeColor },
  { name: "Chris Lee", img: "/user-23.png", dept: "Operations", reason: "Absent 8 days this month", risk: "High Risk", riskColor: "rose" as BadgeColor },
];

export const exitReasons = [
  { reason: "Better Opportunity", exits: 5, pct: 45, barColor: "bg-rose-500", width: "45%" },
  { reason: "Work-Life Balance", exits: 3, pct: 27, barColor: "bg-amber-500", width: "27%" },
  { reason: "Compensation", exits: 3, pct: 27, barColor: "bg-violet-500", width: "27%" },
];

export const leaveBars = [
  { label: "On Leave", count: 12, pct: (12 / 248) * 100, barColor: "bg-amber-500" },
  { label: "WFH", count: 18, pct: (18 / 248) * 100, barColor: "bg-primary-500" },
  { label: "Late", count: 4, pct: (4 / 248) * 100, barColor: "bg-rose-500" },
  { label: "Present", count: 214, pct: (214 / 248) * 100, barColor: "bg-emerald-500" },
];

export const payrollSteps = [
  { label: "Attendance data collected", done: true, pending: false },
  { label: "Leave deductions calculated", done: true, pending: false },
  { label: "Reimbursements approved", done: false, pending: true },
  { label: "Salary revisions updated", done: false, pending: false },
  { label: "Payroll run", done: false, pending: false },
];
