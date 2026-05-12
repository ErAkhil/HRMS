import type { Metadata } from "next";

export const metadata: Metadata = { title: "Changelog — Monja" };

const RELEASES = [
  {
    version: "v2.4.0",
    date: "May 2026",
    tag: "Latest",
    tagColor: "bg-primary-500/20 text-primary-300 border-primary-500/30",
    changes: [
      { type: "new", text: "AI Chat — talk to your HR data in natural language" },
      { type: "new", text: "Attrition risk prediction dashboard for managers" },
      { type: "new", text: "Google OAuth sign-in for all organization members" },
      { type: "improved", text: "Payroll engine now supports PF/ESI auto-calculation" },
      { type: "improved", text: "Leave calendar redesigned with team availability overlay" },
      { type: "fixed", text: "Attendance sync delay on mobile clock-in resolved" },
    ],
  },
  {
    version: "v2.3.0",
    date: "April 2026",
    tag: "Major",
    tagColor: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    changes: [
      { type: "new", text: "Performance module — OKRs, 360° reviews, and appraisals" },
      { type: "new", text: "Learning & certifications with progress tracking" },
      { type: "new", text: "Recruitment pipeline with candidate profiles" },
      { type: "improved", text: "Dashboard redesigned with role-specific views (HR, Manager, Leadership)" },
      { type: "improved", text: "Employee onboarding checklist now supports custom steps" },
      { type: "fixed", text: "Payslip PDF generation encoding issue on macOS" },
    ],
  },
  {
    version: "v2.2.0",
    date: "March 2026",
    tag: "Feature",
    tagColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    changes: [
      { type: "new", text: "Team Collaboration — channels, DMs, and video meetings" },
      { type: "new", text: "Task & project boards with Kanban view" },
      { type: "new", text: "Company news and announcements feed" },
      { type: "improved", text: "Sidebar navigation redesigned with section grouping" },
      { type: "improved", text: "Global search now includes employees, tasks, and messages" },
      { type: "fixed", text: "Dark mode toggle state not persisting across sessions" },
    ],
  },
  {
    version: "v2.1.0",
    date: "February 2026",
    tag: "Feature",
    tagColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    changes: [
      { type: "new", text: "Expense and reimbursement management module" },
      { type: "new", text: "Org chart visualization with drag-to-reorder" },
      { type: "new", text: "Admin audit log — full trail of all user actions" },
      { type: "improved", text: "Employee profile page redesigned with tabbed layout" },
      { type: "fixed", text: "Leave balance not updating after admin manual adjustment" },
      { type: "fixed", text: "Notification bell showing stale unread count" },
    ],
  },
  {
    version: "v2.0.0",
    date: "January 2026",
    tag: "Major",
    tagColor: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    changes: [
      { type: "new", text: "Complete platform rebuild with Next.js 15 App Router" },
      { type: "new", text: "Multi-organization architecture with plan-based access" },
      { type: "new", text: "Full payroll module with payslip generation" },
      { type: "new", text: "Attendance tracking with live status panel" },
      { type: "new", text: "Leave management with configurable policy engine" },
      { type: "new", text: "Role-based access: Super Admin, HR Admin, Manager, Employee" },
    ],
  },
];

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  new: { label: "New", color: "bg-primary-500/20 text-primary-300" },
  improved: { label: "Improved", color: "bg-amber-500/20 text-amber-300" },
  fixed: { label: "Fixed", color: "bg-emerald-500/20 text-emerald-300" },
};

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <section className="relative pt-32 pb-16">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-primary-600/10 blur-3xl" />
        </div>
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight">Changelog</h1>
          <p className="mt-4 text-lg text-slate-400">
            New features, improvements, and fixes — shipped every month.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="pb-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10" />
            <div className="space-y-12">
              {RELEASES.map((release) => (
                <div key={release.version} className="relative pl-8">
                  <div className="absolute -left-1.5 top-1 h-3 w-3 rounded-full border-2 border-primary-500 bg-slate-950" />

                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <span className="text-xl font-bold text-white">{release.version}</span>
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${release.tagColor}`}>{release.tag}</span>
                    <span className="text-sm text-slate-500">{release.date}</span>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-slate-900 p-5 space-y-3">
                    {release.changes.map((c, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-xs font-semibold ${TYPE_LABELS[c.type].color}`}>
                          {TYPE_LABELS[c.type].label}
                        </span>
                        <span className="text-sm text-slate-300">{c.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
