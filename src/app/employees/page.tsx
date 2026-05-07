import Link from "next/link";
import Image from "next/image";
import { EmployeeDirectory } from "./_components/employee-directory";

export const metadata = {
  title: "Employees | Unikove",
};

const departments = [
  { name: "Engineering", count: 89, color: "bg-indigo-600" },
  { name: "Sales", count: 54, color: "bg-violet-500" },
  { name: "Product", count: 38, color: "bg-emerald-500" },
  { name: "Finance", count: 29, color: "bg-amber-500" },
  { name: "HR", count: 22, color: "bg-rose-500" },
  { name: "Operations", count: 16, color: "bg-sky-500" },
];
const totalEmployees = 248;

const employmentTypes = [
  { label: "Full-time", count: 189, pct: 76, dot: "bg-indigo-600" },
  { label: "Part-time", count: 42, pct: 17, dot: "bg-violet-500" },
  { label: "Contract", count: 17, pct: 7, dot: "bg-amber-500" },
];

const tenureBands = [
  { label: "< 1 year", count: 48, color: "bg-rose-400" },
  { label: "1–3 years", count: 87, color: "bg-amber-400" },
  { label: "3–5 years", count: 63, color: "bg-indigo-500" },
  { label: "5+ years", count: 50, color: "bg-emerald-500" },
];

const newJoiners = [
  { name: "Marcus Chen", role: "Software Engineer", dept: "Engineering", daysAgo: 2, avatar: "/images/user/user-03.png" },
  { name: "Anika Patel", role: "Product Manager", dept: "Product", daysAgo: 3, avatar: "/images/user/user-07.png" },
  { name: "Tom Bradley", role: "Sales Executive", dept: "Sales", daysAgo: 5, avatar: "/images/user/user-11.png" },
  { name: "Lisa Wang", role: "Financial Analyst", dept: "Finance", daysAgo: 8, avatar: "/images/user/user-14.png" },
  { name: "Raj Kumar", role: "DevOps Engineer", dept: "Engineering", daysAgo: 11, avatar: "/images/user/user-18.png" },
  { name: "Nina Foster", role: "HR Specialist", dept: "HR", daysAgo: 14, avatar: "/images/user/user-22.png" },
];

const deptBadgeColor: Record<string, string> = {
  Engineering: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300",
  Product: "bg-violet-light text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300",
  Sales: "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  Finance: "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber",
  HR: "bg-rose-light text-rose-dark dark:bg-rose-dark/20 dark:text-rose",
  Operations: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300",
};

const actionItems = [
  {
    icon: (
      <svg className="h-5 w-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3-3v6M4.5 19.5l15-15M4.5 4.5l15 15" />
      </svg>
    ),
    description: "3 Contract renewals due this week",
    badge: "Urgent",
    badgeClass: "bg-rose-light text-rose-dark dark:bg-rose-dark/20 dark:text-rose",
    action: "Review",
  },
  {
    icon: (
      <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    description: "5 Probation reviews scheduled",
    badge: "This Week",
    badgeClass: "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber",
    action: "Schedule",
  },
  {
    icon: (
      <svg className="h-5 w-5 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h2m10-4H7a2 2 0 00-2 2v4h14V6a2 2 0 00-2-2z" />
      </svg>
    ),
    description: "2 Exit interviews pending",
    badge: "Pending",
    badgeClass: "bg-violet-light text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300",
    action: "Start",
  },
  {
    icon: (
      <svg className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    description: "1 Promotion approval awaiting",
    badge: "Review",
    badgeClass: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300",
    action: "Approve",
  },
  {
    icon: (
      <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    description: "Annual performance cycle starts June 1",
    badge: "Upcoming",
    badgeClass: "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
    action: "Prepare",
  },
];

export default function EmployeesPage() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Section 1: Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <nav className="mb-1 flex items-center gap-1.5 text-sm text-dark-5 dark:text-dark-6">
            <Link href="/" className="hover:text-indigo-600">Dashboard</Link>
            <span>/</span>
            <span className="text-dark dark:text-white">Employees</span>
          </nav>
          <h1 className="text-2xl font-bold text-dark dark:text-white">Employees</h1>
          <p className="mt-0.5 text-sm text-dark-5 dark:text-dark-6">Acme Corp · 248 employees</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-lg border border-gray-3 bg-white px-4 py-2 text-sm font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white">
            Import
          </button>
          <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
            Add Employee
          </button>
        </div>
      </div>

      {/* Section 2: KPI Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {/* Total Employees */}
        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-dark-5 dark:text-dark-6">Total Employees</p>
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300">
              All
            </span>
          </div>
          <p className="mt-3 text-3xl font-bold text-dark dark:text-white">248</p>
          <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">
            <span className="font-semibold text-indigo-600">↑ 14</span> new this month
          </p>
        </div>

        {/* Active */}
        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-dark-5 dark:text-dark-6">Active</p>
            <span className="rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald">
              Active
            </span>
          </div>
          <p className="mt-3 text-3xl font-bold text-dark dark:text-white">231</p>
          <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">
            <span className="font-semibold text-emerald-600">93%</span> of total
          </p>
        </div>

        {/* On Leave Today */}
        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-dark-5 dark:text-dark-6">On Leave Today</p>
            <span className="rounded-full bg-amber-light px-2.5 py-0.5 text-xs font-medium text-amber-dark dark:bg-amber-dark/20 dark:text-amber">
              Leave
            </span>
          </div>
          <p className="mt-3 text-3xl font-bold text-dark dark:text-white">12</p>
          <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">
            <span className="font-semibold text-amber-600">4.9%</span> of workforce
          </p>
        </div>

        {/* Open Positions */}
        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-dark-5 dark:text-dark-6">Open Positions</p>
            <span className="rounded-full bg-violet-light px-2.5 py-0.5 text-xs font-medium text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300">
              Hiring
            </span>
          </div>
          <p className="mt-3 text-3xl font-bold text-dark dark:text-white">17</p>
          <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">
            across <span className="font-semibold text-violet-600">6</span> departments
          </p>
        </div>
      </div>

      {/* Section 3: Department Breakdown + Employment Type */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Left: Department Breakdown */}
        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 md:col-span-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-dark dark:text-white">Headcount by Department</h2>
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300">
              {totalEmployees}
            </span>
          </div>
          <div className="space-y-3">
            {departments.map((dept) => {
              const pct = Math.round((dept.count / totalEmployees) * 100);
              return (
                <div key={dept.name} className="flex items-center gap-3">
                  <span className="w-24 shrink-0 text-sm font-medium text-dark dark:text-white">{dept.name}</span>
                  <div className="flex-1">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-dark-3">
                      <div
                        className={`h-2 rounded-full ${dept.color}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <span className="w-8 shrink-0 text-right text-sm font-semibold text-dark dark:text-white">{dept.count}</span>
                  <span className="w-10 shrink-0 text-right text-xs text-dark-5 dark:text-dark-6">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Employment Type + Tenure */}
        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 md:col-span-4">
          <h2 className="mb-4 text-base font-semibold text-dark dark:text-white">Employment Type</h2>
          <div className="space-y-3">
            {employmentTypes.map((et) => (
              <div key={et.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${et.dot}`} />
                  <span className="text-sm text-dark dark:text-white">{et.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-dark dark:text-white">{et.count}</span>
                  <span className="text-xs text-dark-5 dark:text-dark-6">{et.pct}%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="my-4 border-t border-gray-100 dark:border-dark-3" />

          <h3 className="mb-3 text-sm font-semibold text-dark dark:text-white">Tenure Breakdown</h3>
          <div className="space-y-2.5">
            {tenureBands.map((t) => (
              <div key={t.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${t.color}`} />
                  <span className="text-sm text-dark-5 dark:text-dark-6">{t.label}</span>
                </div>
                <span className="text-sm font-semibold text-dark dark:text-white">{t.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 4: New Joiners + HR Action Items */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Left: Recent Joiners */}
        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 md:col-span-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-dark dark:text-white">New Joiners This Month</h2>
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300">
              14
            </span>
          </div>
          <div className="space-y-3">
            {newJoiners.map((emp) => (
              <div key={emp.name} className="flex items-center gap-3">
                <Image
                  src={emp.avatar}
                  alt={emp.name}
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-dark dark:text-white">{emp.name}</p>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${deptBadgeColor[emp.dept] ?? "bg-indigo-50 text-indigo-600"}`}>
                      {emp.dept}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="truncate text-xs text-dark-5 dark:text-dark-6">{emp.role}</p>
                    <span className="text-xs text-dark-5 dark:text-dark-6">· {emp.daysAgo}d ago</span>
                  </div>
                </div>
                <Link
                  href={`/employees/${emp.name.toLowerCase().replace(/\s+/g, "-")}`}
                  className="shrink-0 text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-gray-100 pt-3 dark:border-dark-3">
            <Link href="/employees?filter=new" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
              View all new joiners →
            </Link>
          </div>
        </div>

        {/* Right: HR Action Items */}
        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 md:col-span-7">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-dark dark:text-white">HR Action Items</h2>
            <span className="rounded-full bg-rose-light px-2.5 py-0.5 text-xs font-medium text-rose-dark dark:bg-rose-dark/20 dark:text-rose">
              9 pending
            </span>
          </div>
          <div className="space-y-3">
            {actionItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-dark-3">
                <div className="shrink-0">{item.icon}</div>
                <p className="flex-1 text-sm text-dark dark:text-white">{item.description}</p>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${item.badgeClass}`}>
                  {item.badge}
                </span>
                <button className="shrink-0 rounded-lg border border-gray-3 bg-white px-3 py-1 text-xs font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white">
                  {item.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 5: All Employees Directory */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-dark dark:text-white">All Employees</h2>
            <p className="mt-0.5 text-sm text-dark-5 dark:text-dark-6">Search, filter, and manage your full workforce</p>
          </div>
        </div>
        <EmployeeDirectory />
      </div>
    </div>
  );
}
