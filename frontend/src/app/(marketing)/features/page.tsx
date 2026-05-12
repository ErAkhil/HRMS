import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Features — Monja" };

const MODULES = [
  {
    icon: "👥",
    title: "Employee Management",
    color: "from-primary-500/20 to-primary-600/10",
    border: "border-primary-500/30",
    tag: "text-primary-400",
    features: [
      "Complete employee profiles with custom fields",
      "Department and reporting hierarchy management",
      "Interactive org chart visualization",
      "Document storage (offer letters, contracts, ID proofs)",
      "Onboarding and offboarding workflows",
      "Role-based access control",
    ],
  },
  {
    icon: "💰",
    title: "Payroll & Compensation",
    color: "from-emerald-500/20 to-emerald-600/10",
    border: "border-emerald-500/30",
    tag: "text-emerald-400",
    features: [
      "Automated monthly payroll runs",
      "CTC breakdown with PF, ESI, TDS components",
      "Downloadable payslips for employees",
      "Expense and reimbursement management",
      "Salary revision history",
      "Compliance-ready statutory reports",
    ],
  },
  {
    icon: "📅",
    title: "Attendance & Leave",
    color: "from-amber-500/20 to-amber-600/10",
    border: "border-amber-500/30",
    tag: "text-amber-400",
    features: [
      "Clock-in / clock-out with location support",
      "Live attendance status dashboard",
      "Flexible leave policies (annual, sick, casual)",
      "Manager approval workflows",
      "Calendar view with team availability",
      "Holiday and shift management",
    ],
  },
  {
    icon: "🤖",
    title: "AI-Powered Insights",
    color: "from-violet-500/20 to-violet-600/10",
    border: "border-violet-500/30",
    tag: "text-violet-400",
    features: [
      "Natural language chat with your HR data",
      "Attrition risk prediction per employee",
      "Automated anomaly detection in attendance",
      "Smart payroll discrepancy alerts",
      "AI-generated performance summaries",
      "Suggested actions and recommendations",
    ],
  },
  {
    icon: "💬",
    title: "Team Collaboration",
    color: "from-sky-500/20 to-sky-600/10",
    border: "border-sky-500/30",
    tag: "text-sky-400",
    features: [
      "Channels for teams, projects, and announcements",
      "Direct messages and group threads",
      "Integrated video meeting scheduling",
      "File sharing and pinned resources",
      "Task boards with Kanban and list views",
      "Company news and announcements feed",
    ],
  },
  {
    icon: "🎯",
    title: "Performance & Growth",
    color: "from-rose-500/20 to-rose-600/10",
    border: "border-rose-500/30",
    tag: "text-rose-400",
    features: [
      "OKR and goal tracking per employee",
      "360° peer review cycles",
      "Manager-led performance appraisals",
      "Learning courses and certification tracking",
      "Career development path planner",
      "Leaderboards and recognition badges",
    ],
  },
  {
    icon: "📊",
    title: "Dashboards & Reports",
    color: "from-primary-500/20 to-violet-600/10",
    border: "border-primary-500/30",
    tag: "text-primary-400",
    features: [
      "Role-specific dashboards (HR, Manager, Leadership)",
      "Headcount and attrition analytics",
      "Payroll cost trend charts",
      "Attendance and leave heatmaps",
      "Custom report builder (export to PDF/CSV)",
      "Real-time KPI cards with drill-down",
    ],
  },
  {
    icon: "🔒",
    title: "Security & Admin",
    color: "from-slate-500/20 to-slate-600/10",
    border: "border-slate-500/30",
    tag: "text-slate-400",
    features: [
      "Google OAuth single sign-on",
      "Fine-grained role-based permissions",
      "Full audit log of all user actions",
      "Organization-level data isolation",
      "Data export and deletion (GDPR)",
      "99.9% uptime SLA with Supabase",
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-primary-600/10 blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-1.5 text-sm font-medium text-primary-300">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-400 animate-pulse" />
            Everything your HR team needs
          </div>
          <h1 className="mx-auto max-w-3xl text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            Powerful features,{" "}
            <span className="bg-gradient-to-r from-primary-400 to-violet-400 bg-clip-text text-transparent">
              built for real teams
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400 leading-relaxed">
            From day-one onboarding to retirement, Monja covers the complete employee lifecycle with intelligent automation across every HR function.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/register/company" className="rounded-xl bg-primary-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 hover:bg-primary-700 transition-all hover:-translate-y-0.5">
              Start Free — No Credit Card
            </Link>
            <Link href="/pricing" className="rounded-xl border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-all">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Feature modules */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {MODULES.map((m) => (
              <div key={m.title} className={`rounded-2xl border ${m.border} bg-gradient-to-br ${m.color} p-6 hover:-translate-y-1 transition-transform`}>
                <div className="mb-3 text-3xl">{m.icon}</div>
                <h3 className="mb-4 text-base font-semibold text-white">{m.title}</h3>
                <ul className="space-y-2">
                  {m.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-400">
                      <svg className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${m.tag}`} viewBox="0 0 24 24" fill="none">
                        <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-primary-900/50 via-violet-900/30 to-primary-900/50 border-y border-white/5">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to see it in action?</h2>
          <p className="text-slate-400 mb-8">Register your company and get all features free on the Basic plan — forever.</p>
          <Link href="/register/company" className="rounded-xl bg-primary-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-primary-700 transition-all hover:-translate-y-0.5">
            Get Started Free →
          </Link>
        </div>
      </section>
    </div>
  );
}
