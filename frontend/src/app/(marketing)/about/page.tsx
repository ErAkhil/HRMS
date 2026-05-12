import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "About — Monja" };

const TEAM = [
  { name: "Arjun Mehta", role: "Co-founder & CEO", initials: "AM", color: "from-primary-500 to-violet-600" },
  { name: "Priya Sharma", role: "Co-founder & CTO", initials: "PS", color: "from-violet-500 to-primary-600" },
  { name: "Rahul Nair", role: "Head of Product", initials: "RN", color: "from-emerald-500 to-primary-600" },
  { name: "Sneha Iyer", role: "Head of Design", initials: "SI", color: "from-amber-500 to-rose-600" },
  { name: "Vikram Das", role: "Head of Engineering", initials: "VD", color: "from-sky-500 to-primary-600" },
  { name: "Ananya Kumar", role: "VP of People", initials: "AK", color: "from-rose-500 to-violet-600" },
];

const VALUES = [
  { icon: "🎯", title: "Customer obsession", desc: "Every feature we build starts with a real customer problem. We talk to HR teams every week to stay grounded in what actually matters." },
  { icon: "🔍", title: "Radical transparency", desc: "From our public roadmap to our pricing, we believe in being open and honest — with customers, with partners, and with each other." },
  { icon: "⚡", title: "Bias for action", desc: "We ship fast, learn faster. A good solution today beats a perfect solution next quarter. We iterate in public and fix things quickly." },
  { icon: "🤝", title: "People first", desc: "We build software for people — and we treat our own team the same way. Monja is built on the same principles we ask our customers to adopt." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-24">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-primary-600/10 blur-3xl" />
          <div className="absolute right-0 top-1/3 h-[300px] w-[300px] rounded-full bg-violet-600/10 blur-3xl" />
        </div>
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            We believe every employee{" "}
            <span className="bg-gradient-to-r from-primary-400 to-violet-400 bg-clip-text text-transparent">
              deserves great HR
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400 leading-relaxed">
            Monja was founded in 2024 by a team of engineers and HR professionals who were tired of complex, expensive enterprise software that took months to implement. We set out to build the platform we wished existed.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="border-t border-white/5 py-24 bg-slate-900/30">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-400 mb-4">Our story</p>
          <h2 className="text-3xl font-bold text-white mb-6">Born out of frustration</h2>
          <div className="space-y-5 text-slate-400 leading-relaxed">
            <p>
              In 2024, our founders were running a 200-person startup. They were juggling five different tools — one for payroll, another for attendance, a spreadsheet for leave tracking, a Slack integration for approvals, and a separate performance tool. None of them talked to each other.
            </p>
            <p>
              HR spent 30% of their time just reconciling data across systems. Managers had no visibility. Employees got confused about their leave balances. Payroll ran late. It was a mess — and every enterprise solution they evaluated would take 6 months to implement and cost a fortune.
            </p>
            <p>
              So they built Monja. One unified platform, built for modern Indian companies, with AI that actually makes HR smarter — not just a chatbot bolted on top. Today, 500+ companies use Monja to manage their workforce better.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary-400 mb-3">What we stand for</p>
            <h2 className="text-3xl font-bold text-white">Our values</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-2xl border border-white/10 bg-slate-900 p-6">
                <div className="mb-3 text-3xl">{v.icon}</div>
                <h3 className="mb-2 font-semibold text-white">{v.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-slate-900/30 border-t border-white/5">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary-400 mb-3">The people behind Monja</p>
            <h2 className="text-3xl font-bold text-white">Meet the team</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM.map((member) => (
              <div key={member.name} className="rounded-xl border border-white/10 bg-slate-900 p-6 flex items-center gap-4">
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${member.color} text-sm font-bold text-white`}>
                  {member.initials}
                </div>
                <div>
                  <p className="font-semibold text-white">{member.name}</p>
                  <p className="text-sm text-slate-400">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join */}
      <section className="py-24 border-t border-white/5">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Want to work with us?</h2>
          <p className="text-slate-400 mb-8">
            We&rsquo;re a small, remote-friendly team building the future of work in India. We&rsquo;re always looking for great people.
          </p>
          <Link href="/careers" className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700 transition-all hover:-translate-y-0.5">
            See Open Roles →
          </Link>
        </div>
      </section>
    </div>
  );
}
