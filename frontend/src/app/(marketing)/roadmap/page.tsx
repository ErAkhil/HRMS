import type { Metadata } from "next";

export const metadata: Metadata = { title: "Roadmap — Monja" };

const QUARTERS = [
  {
    period: "Q2 2026",
    label: "In Progress",
    labelColor: "bg-primary-500/20 text-primary-300 border-primary-500/30",
    items: [
      { icon: "📱", title: "Mobile App (iOS & Android)", desc: "Native apps for clock-in, leave requests, and payslips on the go.", status: "in-progress" },
      { icon: "🔔", title: "Smart Notifications Engine", desc: "Customizable push, email, and in-app notifications for all events.", status: "in-progress" },
      { icon: "🗂️", title: "Document Management", desc: "Centralized storage for contracts, policies, and compliance documents with e-sign.", status: "in-progress" },
      { icon: "📊", title: "Custom Report Builder", desc: "Drag-and-drop report designer with scheduled PDF/CSV delivery.", status: "planned" },
    ],
  },
  {
    period: "Q3 2026",
    label: "Planned",
    labelColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    items: [
      { icon: "🤝", title: "Vendor & Contractor Management", desc: "Track external contractors, freelancers, and agencies alongside full-time employees.", status: "planned" },
      { icon: "🌐", title: "Multi-currency Payroll", desc: "Support for global teams with automatic currency conversion and regional tax rules.", status: "planned" },
      { icon: "🧪", title: "Automated Compliance Checks", desc: "Real-time alerts for PF deadlines, ESI filings, and statutory compliance.", status: "planned" },
      { icon: "🎙️", title: "Voice AI Commands", desc: "Ask Monja AI questions by voice — get spoken summaries of headcount, leave balance, and more.", status: "planned" },
    ],
  },
  {
    period: "Q4 2026",
    label: "Exploration",
    labelColor: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    items: [
      { icon: "🏢", title: "Multi-branch & Office Management", desc: "Manage employees across multiple office locations with location-specific policies.", status: "exploration" },
      { icon: "🤖", title: "AI-Assisted Recruitment", desc: "Resume screening, candidate scoring, and interview scheduling — all automated.", status: "exploration" },
      { icon: "💳", title: "Integrated Benefits & Insurance", desc: "Connect employee health insurance, wellness perks, and flexible benefit plans.", status: "exploration" },
      { icon: "🔗", title: "Third-party Integrations", desc: "Slack, Jira, Zoho, QuickBooks, and Tally integrations for a connected HR stack.", status: "exploration" },
    ],
  },
];

const STATUS_STYLES: Record<string, string> = {
  "in-progress": "border-primary-500/40 bg-primary-500/10",
  "planned": "border-amber-500/30 bg-amber-500/5",
  "exploration": "border-violet-500/30 bg-violet-500/5",
};

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <section className="relative pt-32 pb-16">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-3xl" />
        </div>
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-300">
            What&rsquo;s coming next
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight">Product Roadmap</h1>
          <p className="mt-4 text-lg text-slate-400">
            A transparent look at what we&rsquo;re building next. Features are subject to change based on customer feedback.
          </p>
        </div>
      </section>

      {/* Legend */}
      <div className="mx-auto max-w-6xl px-6 mb-8">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          {[
            { label: "In Progress", color: "bg-primary-500/30 text-primary-300" },
            { label: "Planned", color: "bg-amber-500/30 text-amber-300" },
            { label: "Exploration", color: "bg-violet-500/30 text-violet-300" },
          ].map((l) => (
            <span key={l.label} className={`rounded-full px-3 py-1 font-semibold ${l.color}`}>{l.label}</span>
          ))}
        </div>
      </div>

      {/* Roadmap quarters */}
      <section className="pb-24">
        <div className="mx-auto max-w-6xl px-6 space-y-16">
          {QUARTERS.map((q) => (
            <div key={q.period}>
              <div className="mb-6 flex items-center gap-3">
                <h2 className="text-xl font-bold text-white">{q.period}</h2>
                <span className={`rounded-full border px-3 py-0.5 text-xs font-semibold ${q.labelColor}`}>{q.label}</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {q.items.map((item) => (
                  <div key={item.title} className={`rounded-xl border p-5 transition-transform hover:-translate-y-0.5 ${STATUS_STYLES[item.status]}`}>
                    <div className="mb-2 flex items-center gap-2.5">
                      <span className="text-xl">{item.icon}</span>
                      <h3 className="font-semibold text-white">{item.title}</h3>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature request CTA */}
      <section className="border-t border-white/5 py-20">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <p className="text-2xl font-bold text-white mb-3">Have a feature idea?</p>
          <p className="text-slate-400 mb-6">We build based on what our customers need. Send us your suggestions and we&rsquo;ll prioritize the most-requested ones.</p>
          <a
            href="mailto:feedback@monja.app"
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-all"
          >
            Submit a Feature Request
          </a>
        </div>
      </section>
    </div>
  );
}
