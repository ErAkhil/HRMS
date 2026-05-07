export const metadata = { title: "Workflow Automation" };

const WORKFLOWS = [
  {
    id: 1,
    name: "Leave Approval Flow",
    description: "Automatically routes leave requests to the appropriate manager for approval. Sends reminders after 24 hours of inactivity.",
    trigger: "Event-based",
    triggerDetail: "Leave request submitted",
    lastRun: "May 7, 2026 · 9:14 AM",
    status: "Active",
    runs: 1482,
    color: "bg-emerald-light dark:bg-emerald-dark/20",
    iconColor: "text-emerald-dark dark:text-emerald",
  },
  {
    id: 2,
    name: "Onboarding Checklist Trigger",
    description: "Sends automated onboarding tasks, IT setup requests, and welcome messages when a new employee record is created.",
    trigger: "Event-based",
    triggerDetail: "New employee created",
    lastRun: "May 6, 2026 · 3:00 PM",
    status: "Active",
    runs: 248,
    color: "bg-indigo-50 dark:bg-indigo-900/20",
    iconColor: "text-indigo-600 dark:text-indigo-300",
  },
  {
    id: 3,
    name: "Payroll Processing Reminder",
    description: "Notifies HR admins and finance team 5 days before payroll cutoff. Includes pending timesheet report.",
    trigger: "Time-based",
    triggerDetail: "Monthly — 26th at 9:00 AM",
    lastRun: "Apr 26, 2026 · 9:00 AM",
    status: "Scheduled",
    runs: 14,
    color: "bg-amber-light dark:bg-amber-dark/20",
    iconColor: "text-amber-dark",
  },
  {
    id: 4,
    name: "Performance Review Cycle",
    description: "Initiates review cycles, sends self-assessment links, and collects peer nominations at the start of each quarter.",
    trigger: "Time-based",
    triggerDetail: "Quarterly — 1st of month",
    lastRun: "May 1, 2026 · 8:00 AM",
    status: "Draft",
    runs: 4,
    color: "bg-violet-light dark:bg-violet-dark/20",
    iconColor: "text-violet-dark dark:text-violet-300",
  },
  {
    id: 5,
    name: "Exit Process Automation",
    description: "Triggers offboarding checklist, access revocation tasks, and exit interview scheduling upon resignation submission.",
    trigger: "Event-based",
    triggerDetail: "Resignation submitted",
    lastRun: "May 3, 2026 · 2:45 PM",
    status: "Active",
    runs: 63,
    color: "bg-rose-light dark:bg-rose-dark/20",
    iconColor: "text-rose-dark",
  },
  {
    id: 6,
    name: "Birthday & Anniversary Notifications",
    description: "Sends personalized messages to employees and their managers on birthdays and work anniversaries. Posts to company feed.",
    trigger: "Time-based",
    triggerDetail: "Daily at 8:00 AM",
    lastRun: "May 7, 2026 · 8:00 AM",
    status: "Active",
    runs: 892,
    color: "bg-sky-50 dark:bg-sky-dark/10",
    iconColor: "text-sky-600 dark:text-sky-300",
  },
];

const statusColors: Record<string, string> = {
  Active: "rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  Scheduled: "rounded-full bg-amber-light px-2.5 py-0.5 text-xs font-medium text-amber-dark",
  Draft: "rounded-full bg-gray-2 px-2.5 py-0.5 text-xs font-medium text-dark-5 dark:bg-dark-3 dark:text-dark-6",
};

const triggerColors: Record<string, string> = {
  "Time-based": "rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300",
  "Event-based": "rounded-full bg-violet-light px-2.5 py-0.5 text-xs font-medium text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300",
  "Manual": "rounded-full bg-amber-light px-2.5 py-0.5 text-xs font-medium text-amber-dark",
};

export default function WorkflowsPage() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-dark dark:text-white">Workflow Automation</h1>
          <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">Automate repetitive HR processes and notifications</p>
        </div>
        <button className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700">
          + Create Workflow
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Active Workflows", value: "4", color: "text-emerald-dark dark:text-emerald" },
          { label: "Total Runs This Month", value: "328", color: "text-indigo-600 dark:text-indigo-300" },
          { label: "Avg Success Rate", value: "99.2%", color: "text-dark dark:text-white" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
            <p className="text-xs text-dark-5 dark:text-dark-6">{stat.label}</p>
            <p className={`mt-1 text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Workflow Cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {WORKFLOWS.map((wf) => (
          <div
            key={wf.id}
            className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${wf.color}`}>
                  <svg className={`h-5 w-5 ${wf.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-semibold text-dark dark:text-white">{wf.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={triggerColors[wf.trigger]}>{wf.trigger}</span>
                    <span className={statusColors[wf.status]}>{wf.status}</span>
                  </div>
                </div>
              </div>
              {/* Toggle */}
              <div className={`relative h-5 w-9 rounded-full transition-colors ${wf.status === "Active" ? "bg-emerald-500" : "bg-gray-300 dark:bg-dark-3"}`}>
                <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${wf.status === "Active" ? "translate-x-4" : "translate-x-0.5"}`} />
              </div>
            </div>
            <p className="text-xs text-dark-5 dark:text-dark-6 mb-3">{wf.description}</p>
            <div className="flex items-center justify-between text-xs text-dark-5 dark:text-dark-6">
              <span>Trigger: {wf.triggerDetail}</span>
              <span>{wf.runs.toLocaleString()} runs</span>
            </div>
            <div className="mt-2 text-xs text-dark-5 dark:text-dark-6">
              Last run: {wf.lastRun}
            </div>
            <div className="mt-3 flex gap-2">
              <button className="rounded-lg border border-gray-3 px-3 py-1.5 text-xs font-medium text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6">
                Edit
              </button>
              <button className="rounded-lg border border-gray-3 px-3 py-1.5 text-xs font-medium text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6">
                View Logs
              </button>
              <button className="rounded-lg border border-gray-3 px-3 py-1.5 text-xs font-medium text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6">
                Run Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
