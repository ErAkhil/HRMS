import Link from "next/link";

const FEATURES = [
  {
    icon: "👥",
    title: "Employee Management",
    desc: "Complete employee lifecycle from onboarding to offboarding. Profiles, departments, org charts, and more.",
    color: "from-primary-500/20 to-primary-600/10",
    border: "border-primary-500/30",
  },
  {
    icon: "💰",
    title: "Payroll & Compensation",
    desc: "Automated payroll processing, payslips, reimbursements, and real-time compensation analytics.",
    color: "from-emerald-500/20 to-emerald-600/10",
    border: "border-emerald-500/30",
  },
  {
    icon: "📅",
    title: "Attendance & Leave",
    desc: "Smart attendance tracking, flexible leave policies, calendar views, and manager approval workflows.",
    color: "from-amber-500/20 to-amber-600/10",
    border: "border-amber-500/30",
  },
  {
    icon: "🤖",
    title: "AI-Powered Insights",
    desc: "Get intelligent recommendations, predict attrition, automate repetitive tasks, and chat with your HR data.",
    color: "from-violet-500/20 to-violet-600/10",
    border: "border-violet-500/30",
  },
  {
    icon: "💬",
    title: "Team Collaboration",
    desc: "Channels, direct messages, video meetings, and task management — all in one unified workspace.",
    color: "from-sky-500/20 to-sky-600/10",
    border: "border-sky-500/30",
  },
  {
    icon: "🎯",
    title: "Performance & Growth",
    desc: "OKR tracking, 360° reviews, goal setting, learning courses, and career development paths.",
    color: "from-rose-500/20 to-rose-600/10",
    border: "border-rose-500/30",
  },
];

const STATS = [
  { value: "500+", label: "Companies trust Monja" },
  { value: "50K+", label: "Employees managed" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "4.9/5", label: "Customer satisfaction" },
];

const PLANS = [
  {
    name: "Basic",
    price: "Free",
    period: "",
    desc: "Perfect for small teams getting started",
    features: ["Up to 10 employees", "Core HR features", "Basic payroll", "Email support"],
    cta: "Start Free",
    href: "/register/company",
    highlight: false,
  },
  {
    name: "Pro",
    price: "₹2,499",
    period: "/mo",
    desc: "Everything you need to scale your team",
    features: ["Up to 100 employees", "All Basic features", "Leave management", "Performance reviews & OKRs", "Priority support"],
    cta: "Get Pro",
    href: "/register/company",
    highlight: false,
  },
  {
    name: "Pro+",
    price: "₹4,999",
    period: "/mo",
    desc: "Advanced tools for data-driven HR teams",
    features: ["Up to 500 employees", "All Pro features", "Recruitment pipeline", "Learning & certifications", "Workforce reports & analytics"],
    cta: "Get Pro+",
    href: "/register/company",
    highlight: true,
  },
  {
    name: "Pro Max",
    price: "₹8,999",
    period: "/mo",
    desc: "Enterprise-grade for large organizations",
    features: ["Unlimited employees", "All Pro+ features", "AI insights & chat", "Team collaboration", "Onboarding workflows", "SSO & dedicated support"],
    cta: "Contact Sales",
    href: "/contact",
    highlight: false,
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-primary-600/10 blur-3xl" />
          <div className="absolute right-0 top-1/4 h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-1.5 text-sm font-medium text-primary-300">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-400 animate-pulse" />
            AI-Powered HRMS Platform — Now in India
          </div>

          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            The Modern Workplace{" "}
            <span className="bg-gradient-to-r from-primary-400 via-violet-400 to-primary-400 bg-clip-text text-transparent">
              Your Team Deserves
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400 leading-relaxed">
            Monja brings together HR management, payroll, collaboration, and AI-powered insights in one platform — so your people can focus on what matters most.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register/company"
              className="rounded-xl bg-primary-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 hover:bg-primary-700 transition-all hover:shadow-primary-500/40 hover:-translate-y-0.5"
            >
              Start Free — No Credit Card
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-all"
            >
              Sign In →
            </Link>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            Free forever on Basic · No setup fees · Cancel anytime
          </p>

          {/* Mock dashboard preview */}
          <div className="relative mx-auto mt-16 max-w-5xl">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/50">
              {/* Browser bar */}
              <div className="flex items-center gap-2 border-b border-white/10 bg-slate-800/50 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-rose-500/60" />
                <span className="h-3 w-3 rounded-full bg-amber-500/60" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/60" />
                <div className="ml-4 flex-1 rounded bg-slate-700/50 px-3 py-1 text-xs text-slate-500">app.Monja.com/dashboard</div>
              </div>
              {/* Dashboard preview */}
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="h-6 w-48 rounded-md bg-slate-700/60" />
                    <div className="mt-1.5 h-3.5 w-32 rounded bg-slate-700/40" />
                  </div>
                  <div className="h-9 w-28 rounded-lg bg-primary-600/40" />
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {["bg-primary-600/20", "bg-emerald-600/20", "bg-amber-600/20"].map((c, i) => (
                    <div key={i} className={`rounded-xl ${c} border border-white/5 p-4`}>
                      <div className="h-3 w-20 rounded bg-white/10 mb-2" />
                      <div className="h-8 w-12 rounded bg-white/20 mb-1" />
                      <div className="h-2.5 w-16 rounded bg-white/10" />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-3 rounded-xl border border-white/5 bg-slate-800/40 p-4">
                    {[1,2,3,4].map((i) => <div key={i} className="mb-3 flex items-center gap-2"><div className="h-6 w-6 rounded-full bg-slate-600" /><div className="h-3 flex-1 rounded bg-slate-600/60" /></div>)}
                  </div>
                  <div className="col-span-5 rounded-xl border border-white/5 bg-slate-800/40 p-4">
                    <div className="h-3 w-24 rounded bg-slate-600 mb-3" />
                    {[1,2,3].map((i) => <div key={i} className="mb-2.5 flex items-center gap-3"><div className="h-8 w-8 rounded-full bg-slate-600" /><div className="flex-1"><div className="h-2.5 w-3/4 rounded bg-slate-600/60 mb-1" /><div className="h-2 w-1/2 rounded bg-slate-600/40" /></div></div>)}
                  </div>
                  <div className="col-span-4 rounded-xl border border-white/5 bg-slate-800/40 p-4">
                    <div className="h-3 w-20 rounded bg-slate-600 mb-3" />
                    <div className="grid grid-cols-7 gap-0.5">
                      {Array.from({ length: 35 }).map((_, i) => (
                        <div key={i} className={`aspect-square rounded-sm ${i % 7 === 0 || i % 7 === 6 ? 'bg-slate-700/30' : Math.random() > 0.6 ? 'bg-primary-500/40' : 'bg-slate-700/50'}`} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Glow under screenshot */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/5 bg-slate-900/50 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-extrabold text-white">{s.value}</p>
                <p className="mt-1 text-sm text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary-400 mb-3">Everything in one place</p>
            <h2 className="text-4xl font-bold text-white">All the tools your HR team needs</h2>
            <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
              From hiring to retirement, Monja covers the entire employee journey with intelligent automation and real-time insights.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className={`group rounded-2xl border ${f.border} bg-gradient-to-br ${f.color} p-6 transition-transform hover:-translate-y-1`}>
                <div className="mb-4 text-3xl">{f.icon}</div>
                <h3 className="mb-2 text-lg font-semibold text-white">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary-400 mb-3">Get started in minutes</p>
            <h2 className="text-4xl font-bold text-white">Up and running in 3 steps</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { step: "01", title: "Register your company", desc: "Create your organization account with your company name and admin email — takes under 2 minutes." },
              { step: "02", title: "Invite your team", desc: "Add employees, set up departments, and configure roles. Import from CSV or add them one by one." },
              { step: "03", title: "Start managing smarter", desc: "Run payroll, track attendance, manage leave, and let AI handle the repetitive work for you." },
            ].map((s) => (
              <div key={s.step} className="relative pl-16">
                <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600/20 border border-primary-500/30">
                  <span className="text-sm font-bold text-primary-400">{s.step}</span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">{s.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary-400 mb-3">Simple, transparent pricing</p>
            <h2 className="text-4xl font-bold text-white">Plans for every stage</h2>
            <p className="mt-4 text-slate-400">Start free. Upgrade as you grow. No hidden fees.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PLANS.map((plan) => (
              <div key={plan.name} className={`relative rounded-2xl p-8 ${plan.highlight ? "bg-primary-600 border-2 border-primary-400 shadow-2xl shadow-primary-500/30" : "border border-white/10 bg-slate-900"}`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-1 text-xs font-bold text-primary-600">
                    MOST POPULAR
                  </div>
                )}
                <p className="text-sm font-semibold text-slate-400 mb-1">{plan.name}</p>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                  {plan.period && <span className="text-slate-400 mb-1">{plan.period}</span>}
                </div>
                <p className={`text-sm mb-6 ${plan.highlight ? "text-primary-100" : "text-slate-400"}`}>{plan.desc}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <svg className={`h-4 w-4 shrink-0 ${plan.highlight ? "text-white" : "text-primary-400"}`} viewBox="0 0 24 24" fill="none">
                        <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className={plan.highlight ? "text-white" : "text-slate-300"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`block rounded-xl py-3 text-center text-sm font-semibold transition-all ${plan.highlight ? "bg-white text-primary-600 hover:bg-primary-50" : "border border-white/20 text-white hover:bg-white/10"}`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 bg-gradient-to-r from-primary-900/50 via-violet-900/30 to-primary-900/50 border-y border-white/5">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to transform how you manage your people?
          </h2>
          <p className="text-slate-400 mb-8 text-lg">
            Join 500+ companies using Monja to build better workplaces.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/register/company" className="rounded-xl bg-primary-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-primary-700 transition-all hover:-translate-y-0.5">
              Register Your Company →
            </Link>
            <Link href="/register/user" className="rounded-xl border border-white/20 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-all">
              Join as Employee
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
