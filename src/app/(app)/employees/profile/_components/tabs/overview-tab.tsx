import Image from "next/image";

const PERSONAL_FIELDS = [
  { label: "Full Name", value: "Sarah Mitchell" },
  { label: "Date of Birth", value: "August 14, 1992" },
  { label: "Phone", value: "+91 98765 43210" },
  { label: "Email", value: "sarah.mitchell@acme.com" },
  { label: "Location", value: "Bengaluru, Karnataka" },
  { label: "Nationality", value: "Indian" },
  { label: "Emergency Contact", value: "Michael Mitchell (Spouse)\n+91 98765 00000", wide: true },
];

const EMPLOYMENT_FIELDS = [
  { label: "Employee ID", value: "EMP-0042" },
  { label: "Department", value: "Engineering" },
  { label: "Designation", value: "Senior Software Engineer" },
  { label: "Employment Type", value: "Full-time" },
  { label: "Work Location", value: "Remote" },
  { label: "Shift", value: "Flexible (9 AM - 6 PM)" },
  { label: "Contract Type", value: "Permanent" },
  { label: "Probation", value: "Completed" },
];

const SKILLS = [
  { name: "React", color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300" },
  { name: "TypeScript", color: "bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-300" },
  { name: "Node.js", color: "bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-300" },
  { name: "PostgreSQL", color: "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald" },
  { name: "AWS", color: "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber" },
  { name: "Docker", color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300" },
  { name: "GraphQL", color: "bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-300" },
  { name: "System Design", color: "bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-300" },
];

const PERFORMANCE_BARS = [
  { label: "Goal Achievement", pct: 92, color: "bg-emerald" },
  { label: "Collaboration", pct: 88, color: "bg-indigo-600" },
  { label: "Delivery", pct: 85, color: "bg-violet-500" },
  { label: "Leadership", pct: 79, color: "bg-amber" },
];

const LEAVE_BALANCES = [
  { label: "Annual Leave", used: 12, total: 24, color: "bg-indigo-600" },
  { label: "Sick Leave", used: 4, total: 12, color: "bg-amber" },
  { label: "Casual Leave", used: 2, total: 6, color: "bg-violet-500" },
];

const TEAM_MEMBERS = [
  { name: "Daniel Park", role: "Frontend Engineer", avatar: "/images/user/user-03.png" },
  { name: "Priya Sharma", role: "Product Designer", avatar: "/images/user/user-26.png" },
  { name: "Arjun Mehta", role: "Backend Engineer", avatar: "/images/user/user-23.png" },
  { name: "Elena Torres", role: "QA Engineer", avatar: "/images/user/user-27.png" },
];

const ACTIVITY_ITEMS = [
  { dot: "bg-indigo-600", title: "Code review completed", desc: "Q2 authentication module", time: "Today, 10:30 AM" },
  { dot: "bg-emerald", title: "Leave approved", desc: "2 days annual leave approved", time: "Yesterday" },
  { dot: "bg-emerald", title: "Task completed", desc: "API rate limiting implementation", time: "2 days ago" },
  { dot: "bg-violet-500", title: "Performance review submitted", desc: "Q1 2026 self-assessment", time: "1 week ago" },
  { dot: "bg-amber", title: "Certification earned", desc: "AWS Solutions Architect", time: "2 weeks ago" },
];

interface Props {
  onGoToPerformance: () => void;
  onGoToLeave: () => void;
}

export function OverviewTab({ onGoToPerformance, onGoToLeave }: Readonly<Props>) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
        <div className="space-y-5 md:col-span-8">
          <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
            <h2 className="mb-4 text-base font-semibold text-dark dark:text-white">Personal Information</h2>
            <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              {PERSONAL_FIELDS.map(({ label, value, wide }) => (
                <div key={label} className={wide ? "sm:col-span-2" : ""}>
                  <p className="text-xs font-medium uppercase tracking-wide text-dark-5 dark:text-dark-6">{label}</p>
                  <p className="mt-1 whitespace-pre-line text-sm font-medium text-dark dark:text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
            <h2 className="mb-4 text-base font-semibold text-dark dark:text-white">Employment Details</h2>
            <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              {EMPLOYMENT_FIELDS.map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs font-medium uppercase tracking-wide text-dark-5 dark:text-dark-6">{label}</p>
                  <p className="mt-1 text-sm font-medium text-dark dark:text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
            <h2 className="mb-4 text-base font-semibold text-dark dark:text-white">Skills &amp; Expertise</h2>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map(({ name, color }) => (
                <span key={name} className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${color}`}>{name}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5 md:col-span-4">
          <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
            <h2 className="mb-4 text-base font-semibold text-dark dark:text-white">Performance Overview</h2>
            <div className="mb-4 text-center">
              <p className="text-4xl font-bold text-indigo-600">87<span className="text-xl font-normal text-dark-5 dark:text-dark-6">/100</span></p>
              <span className="mt-1 inline-flex items-center rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-semibold text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald">Excellent</span>
            </div>
            <div className="space-y-3">
              {PERFORMANCE_BARS.map(({ label, pct, color }) => (
                <div key={label}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-dark-5 dark:text-dark-6">{label}</span>
                    <span className="font-semibold text-dark dark:text-white">{pct}%</span>
                  </div>
                  <div className="relative h-1.5 overflow-hidden rounded-full bg-gray-2 dark:bg-dark-3">
                    <div className={`absolute inset-y-0 left-0 rounded-full ${color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-gray-3 pt-3 text-right dark:border-dark-3">
              <button onClick={onGoToPerformance} className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">
                View Full Review &rarr;
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
            <h2 className="mb-4 text-base font-semibold text-dark dark:text-white">Leave Balance</h2>
            <div className="space-y-3">
              {LEAVE_BALANCES.map(({ label, used, total, color }) => (
                <div key={label}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-dark-5 dark:text-dark-6">{label}</span>
                    <span className="font-semibold text-dark dark:text-white">{used} / {total} days</span>
                  </div>
                  <div className="relative h-1.5 overflow-hidden rounded-full bg-gray-2 dark:bg-dark-3">
                    <div className={`absolute inset-y-0 left-0 rounded-full ${color}`} style={{ width: `${Math.round((used / total) * 100)}%` }} />
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between rounded-lg bg-gray-2 px-3 py-2 text-xs dark:bg-dark-3">
                <span className="text-dark-5 dark:text-dark-6">Comp-off Available</span>
                <span className="font-semibold text-dark dark:text-white">2 days</span>
              </div>
            </div>
            <button onClick={onGoToLeave} className="mt-4 w-full rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700">Apply Leave</button>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
            <h2 className="mb-4 text-base font-semibold text-dark dark:text-white">Team Members</h2>
            <div className="space-y-3">
              {TEAM_MEMBERS.map(({ name, role, avatar }) => (
                <div key={name} className="flex items-center gap-3">
                  <Image src={avatar} alt={name} width={36} height={36} className="shrink-0 rounded-full object-cover" />
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

      <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <h2 className="mb-5 text-base font-semibold text-dark dark:text-white">Recent Activity</h2>
        <ol className="relative ml-2 space-y-5 border-l border-gray-3 dark:border-dark-3">
          {ACTIVITY_ITEMS.map(({ dot, title, desc, time }, idx) => (
            <li key={idx} className="ml-5">
              <span className={`absolute -left-1.5 mt-1 h-3 w-3 rounded-full border-2 border-white dark:border-dark-2 ${dot}`} />
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-dark dark:text-white">{title}</p>
                  <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">{desc}</p>
                </div>
                <time className="shrink-0 text-xs text-dark-5 dark:text-dark-6">{time}</time>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
