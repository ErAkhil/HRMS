import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Sarah Mitchell — Employee Profile | Unikove",
};

export default function EmployeeProfilePage() {
  return (
    <div className="space-y-5">
      {/* ── Section 1: Breadcrumb + Actions ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav className="flex items-center gap-1.5 text-xs text-dark-5 dark:text-dark-6">
          <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">
            Dashboard
          </Link>
          <span>/</span>
          <Link href="/employees" className="hover:text-indigo-600 dark:hover:text-indigo-400">
            Employees
          </Link>
          <span>/</span>
          <span className="text-dark dark:text-white">Profile</span>
        </nav>
        <div className="flex items-center gap-2">
          <button className="rounded-lg border border-gray-3 bg-white px-4 py-2 text-sm font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white">
            Edit Profile
          </button>
          <button className="rounded-lg border border-gray-3 bg-white px-4 py-2 text-sm font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white">
            &bull;&bull;&bull;
          </button>
        </div>
      </div>

      {/* ── Section 2: Profile Hero Card ── */}
      <div className="rounded-xl bg-white p-6 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <div className="flex flex-wrap items-start gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            <Image
              src="/images/user/user-15.png"
              alt="Sarah Mitchell"
              width={80}
              height={80}
              className="rounded-full object-cover"
            />
            <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald dark:border-dark-2" />
          </div>

          {/* Name + Role */}
          <div className="min-w-[160px]">
            <h1 className="text-xl font-bold text-dark dark:text-white">Sarah Mitchell</h1>
            <p className="mt-0.5 text-sm text-dark-5 dark:text-dark-6">Senior Software Engineer</p>
            <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">
              Joined March 2022 &middot; 3 years 2 months
            </p>
          </div>

          {/* Middle Info */}
          <div className="flex-1 min-w-[200px] space-y-2.5">
            <div>
              <span className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300">
                Engineering
              </span>
            </div>
            <p className="flex items-center gap-1.5 text-sm text-dark-5 dark:text-dark-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              Remote &middot; Bengaluru, India
            </p>
            <div className="flex items-center gap-2">
              <Image
                src="/images/user/user-28.png"
                alt="James Williams"
                width={24}
                height={24}
                className="rounded-full object-cover"
              />
              <span className="text-sm text-dark-5 dark:text-dark-6">
                Reports to <span className="font-medium text-dark dark:text-white">James Williams</span>, VP Engineering
              </span>
            </div>
            <p className="text-sm text-dark-5 dark:text-dark-6">
              Employee ID:{" "}
              <span className="font-semibold text-dark dark:text-white">EMP-0042</span>
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-center sm:grid-cols-4">
            <div>
              <p className="text-2xl font-bold text-indigo-600">87<span className="text-base font-normal text-dark-5 dark:text-dark-6">/100</span></p>
              <p className="text-xs text-dark-5 dark:text-dark-6 mt-0.5">Performance</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-dark dark:text-white">18</p>
              <p className="text-xs text-dark-5 dark:text-dark-6 mt-0.5">Leave Days</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-dark dark:text-white">6</p>
              <p className="text-xs text-dark-5 dark:text-dark-6 mt-0.5">Active Tasks</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-dark dark:text-white leading-tight">Platform<br />Team</p>
              <p className="text-xs text-dark-5 dark:text-dark-6 mt-0.5">Team</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 3: Tab Navigation ── */}
      <div className="rounded-xl bg-white shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <div className="flex border-b border-gray-3 dark:border-dark-3 px-6 gap-6 overflow-x-auto">
          {[
            { label: "Overview", active: true },
            { label: "Performance", active: false },
            { label: "Leave History", active: false },
            { label: "Documents", active: false },
          ].map(({ label, active }) => (
            <button
              key={label}
              className={`py-3.5 text-sm font-medium shrink-0 border-b-2 ${
                active
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                  : "border-transparent text-dark-5 hover:text-dark dark:text-dark-6 dark:hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Section 4: Overview Tab Content ── */}
        <div className="p-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
            {/* Left Column */}
            <div className="md:col-span-8 space-y-5">
              {/* Personal Information */}
              <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
                <h2 className="mb-4 text-base font-semibold text-dark dark:text-white">
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                  {[
                    { label: "Full Name", value: "Sarah Mitchell" },
                    { label: "Date of Birth", value: "August 14, 1992" },
                    { label: "Phone", value: "+91 98765 43210" },
                    { label: "Email", value: "sarah.mitchell@acme.com" },
                    { label: "Location", value: "Bengaluru, Karnataka" },
                    { label: "Nationality", value: "Indian" },
                    { label: "Emergency Contact", value: "Michael Mitchell (Spouse)\n+91 98765 00000", wide: true },
                  ].map(({ label, value, wide }) => (
                    <div key={label} className={wide ? "sm:col-span-2" : ""}>
                      <p className="text-xs font-medium uppercase tracking-wide text-dark-5 dark:text-dark-6">
                        {label}
                      </p>
                      <p className="mt-1 text-sm font-medium text-dark dark:text-white whitespace-pre-line">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Employment Details */}
              <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
                <h2 className="mb-4 text-base font-semibold text-dark dark:text-white">
                  Employment Details
                </h2>
                <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                  {[
                    { label: "Employee ID", value: "EMP-0042" },
                    { label: "Department", value: "Engineering" },
                    { label: "Designation", value: "Senior Software Engineer" },
                    { label: "Employment Type", value: "Full-time" },
                    { label: "Work Location", value: "Remote" },
                    { label: "Shift", value: "Flexible (9 AM - 6 PM)" },
                    { label: "Contract Type", value: "Permanent" },
                    { label: "Probation", value: "Completed" },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-xs font-medium uppercase tracking-wide text-dark-5 dark:text-dark-6">
                        {label}
                      </p>
                      <p className="mt-1 text-sm font-medium text-dark dark:text-white">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills & Expertise */}
              <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
                <h2 className="mb-4 text-base font-semibold text-dark dark:text-white">
                  Skills &amp; Expertise
                </h2>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: "React", color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300" },
                    { name: "TypeScript", color: "bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-300" },
                    { name: "Node.js", color: "bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-300" },
                    { name: "PostgreSQL", color: "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald" },
                    { name: "AWS", color: "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber" },
                    { name: "Docker", color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300" },
                    { name: "GraphQL", color: "bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-300" },
                    { name: "System Design", color: "bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-300" },
                  ].map(({ name, color }) => (
                    <span
                      key={name}
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${color}`}
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="md:col-span-4 space-y-5">
              {/* Performance Overview */}
              <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
                <h2 className="mb-4 text-base font-semibold text-dark dark:text-white">
                  Performance Overview
                </h2>
                <div className="mb-4 text-center">
                  <p className="text-4xl font-bold text-indigo-600">
                    87<span className="text-xl font-normal text-dark-5 dark:text-dark-6">/100</span>
                  </p>
                  <span className="mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald">
                    Excellent
                  </span>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Goal Achievement", pct: 92, color: "bg-emerald" },
                    { label: "Collaboration", pct: 88, color: "bg-indigo-600" },
                    { label: "Delivery", pct: 85, color: "bg-violet-500" },
                    { label: "Leadership", pct: 79, color: "bg-amber" },
                  ].map(({ label, pct, color }) => (
                    <div key={label}>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="text-dark-5 dark:text-dark-6">{label}</span>
                        <span className="font-semibold text-dark dark:text-white">{pct}%</span>
                      </div>
                      <div className="relative h-1.5 rounded-full bg-gray-2 dark:bg-dark-3 overflow-hidden">
                        <div
                          className={`absolute inset-y-0 left-0 rounded-full ${color}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 border-t border-gray-3 dark:border-dark-3 pt-3 text-right">
                  <Link
                    href="#"
                    className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    View Full Review &rarr;
                  </Link>
                </div>
              </div>

              {/* Leave Balance */}
              <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
                <h2 className="mb-4 text-base font-semibold text-dark dark:text-white">
                  Leave Balance
                </h2>
                <div className="space-y-3">
                  {[
                    { label: "Annual Leave", used: 12, total: 24, color: "bg-indigo-600" },
                    { label: "Sick Leave", used: 4, total: 12, color: "bg-amber" },
                    { label: "Casual Leave", used: 2, total: 6, color: "bg-violet-500" },
                  ].map(({ label, used, total, color }) => (
                    <div key={label}>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="text-dark-5 dark:text-dark-6">{label}</span>
                        <span className="font-semibold text-dark dark:text-white">
                          {used} / {total} days
                        </span>
                      </div>
                      <div className="relative h-1.5 rounded-full bg-gray-2 dark:bg-dark-3 overflow-hidden">
                        <div
                          className={`absolute inset-y-0 left-0 rounded-full ${color}`}
                          style={{ width: `${Math.round((used / total) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between rounded-lg bg-gray-2 dark:bg-dark-3 px-3 py-2 text-xs">
                    <span className="text-dark-5 dark:text-dark-6">Comp-off Available</span>
                    <span className="font-semibold text-dark dark:text-white">2 days</span>
                  </div>
                </div>
                <button className="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
                  Apply Leave
                </button>
              </div>

              {/* Team Members */}
              <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
                <h2 className="mb-4 text-base font-semibold text-dark dark:text-white">
                  Team Members
                </h2>
                <div className="space-y-3">
                  {[
                    { name: "Daniel Park", role: "Frontend Engineer", avatar: "/images/user/user-03.png" },
                    { name: "Priya Sharma", role: "Product Designer", avatar: "/images/user/user-26.png" },
                    { name: "Arjun Mehta", role: "Backend Engineer", avatar: "/images/user/user-23.png" },
                    { name: "Elena Torres", role: "QA Engineer", avatar: "/images/user/user-27.png" },
                  ].map(({ name, role, avatar }) => (
                    <div key={name} className="flex items-center gap-3">
                      <Image
                        src={avatar}
                        alt={name}
                        width={36}
                        height={36}
                        className="rounded-full object-cover shrink-0"
                      />
                      <div>
                        <p className="text-sm font-medium text-dark dark:text-white">{name}</p>
                        <p className="text-xs text-dark-5 dark:text-dark-6">{role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Section 5: Activity Timeline ── */}
          <div className="mt-5 rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
            <h2 className="mb-5 text-base font-semibold text-dark dark:text-white">
              Recent Activity
            </h2>
            <ol className="relative border-l border-gray-3 dark:border-dark-3 ml-2 space-y-5">
              {[
                {
                  dot: "bg-indigo-600",
                  title: "Code review completed",
                  desc: "Q2 authentication module",
                  time: "Today, 10:30 AM",
                },
                {
                  dot: "bg-emerald",
                  title: "Leave approved",
                  desc: "2 days annual leave approved",
                  time: "Yesterday",
                },
                {
                  dot: "bg-emerald",
                  title: "Task completed",
                  desc: "API rate limiting implementation",
                  time: "2 days ago",
                },
                {
                  dot: "bg-violet-500",
                  title: "Performance review submitted",
                  desc: "Q1 2026 self-assessment",
                  time: "1 week ago",
                },
                {
                  dot: "bg-amber",
                  title: "Certification earned",
                  desc: "AWS Solutions Architect",
                  time: "2 weeks ago",
                },
              ].map(({ dot, title, desc, time }, idx) => (
                <li key={idx} className="ml-5">
                  <span
                    className={`absolute -left-1.5 mt-1 h-3 w-3 rounded-full border-2 border-white dark:border-dark-2 ${dot}`}
                  />
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-dark dark:text-white">{title}</p>
                      <p className="text-xs text-dark-5 dark:text-dark-6 mt-0.5">{desc}</p>
                    </div>
                    <time className="shrink-0 text-xs text-dark-5 dark:text-dark-6">{time}</time>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Performance Tab placeholder */}
          {/* Leave History Tab placeholder */}
          {/* Documents Tab placeholder */}
        </div>
      </div>
    </div>
  );
}
