import type { Metadata } from "next";

export const metadata: Metadata = { title: "Careers — Monja" };

const JOBS = [
  {
    title: "Senior Full-Stack Engineer",
    team: "Engineering",
    teamColor: "text-primary-400 bg-primary-500/10 border-primary-500/30",
    location: "Remote (India)",
    type: "Full-time",
    desc: "Own and ship major product features end-to-end. You'll work across Next.js, NestJS, and Prisma to build new modules and improve existing ones at scale.",
    skills: ["Next.js", "TypeScript", "PostgreSQL", "NestJS"],
  },
  {
    title: "AI / ML Engineer",
    team: "AI",
    teamColor: "text-violet-400 bg-violet-500/10 border-violet-500/30",
    location: "Remote (India)",
    type: "Full-time",
    desc: "Build the intelligence layer of Monja — from natural language HR data queries to attrition prediction models and anomaly detection pipelines.",
    skills: ["Python", "LLMs", "RAG", "ML pipelines"],
  },
  {
    title: "Product Designer (Senior)",
    team: "Design",
    teamColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    location: "Remote (India)",
    type: "Full-time",
    desc: "Design intuitive, beautiful interfaces for complex HR workflows. You'll own end-to-end design from research and wireframes to production-ready Figma specs.",
    skills: ["Figma", "Design systems", "User research", "Motion design"],
  },
  {
    title: "Customer Success Manager",
    team: "Customer Success",
    teamColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    location: "Bangalore / Remote",
    type: "Full-time",
    desc: "Be the trusted advisor for our Pro and Pro Max customers. Drive onboarding, adoption, and expansion — and feed insights back to the product team.",
    skills: ["HRMS domain knowledge", "Onboarding", "Renewal management"],
  },
  {
    title: "Growth & Marketing Lead",
    team: "Marketing",
    teamColor: "text-rose-400 bg-rose-500/10 border-rose-500/30",
    location: "Remote (India)",
    type: "Full-time",
    desc: "Own top-of-funnel growth — content, SEO, paid acquisition, and product-led growth experiments. You'll report directly to the co-founders.",
    skills: ["B2B SaaS marketing", "SEO", "Content strategy", "Analytics"],
  },
];

const PERKS = [
  { icon: "🌍", title: "Fully remote", desc: "Work from anywhere in India. We're async-first and results-driven." },
  { icon: "🏥", title: "Health insurance", desc: "Comprehensive group health insurance for you and your dependents." },
  { icon: "📈", title: "Stock options (ESOPs)", desc: "Everyone who joins gets a stake in the company we're building together." },
  { icon: "📚", title: "Learning budget", desc: "₹50,000/year for courses, books, conferences, and anything that makes you better." },
  { icon: "🏖️", title: "Unlimited PTO", desc: "We trust you to manage your time. Take the breaks you need." },
  { icon: "💻", title: "Equipment budget", desc: "₹80,000 to set up your home office the way you like it." },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-primary-600/10 blur-3xl" />
        </div>
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            We&rsquo;re hiring — {JOBS.length} open roles
          </div>
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            Help us build the{" "}
            <span className="bg-gradient-to-r from-primary-400 to-violet-400 bg-clip-text text-transparent">
              future of work
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            We&rsquo;re a small, high-output team building software that makes millions of employees&rsquo; work lives better. If that sounds exciting, we&rsquo;d love to meet you.
          </p>
        </div>
      </section>

      {/* Perks */}
      <section className="border-t border-white/5 py-16 bg-slate-900/30">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PERKS.map((perk) => (
              <div key={perk.title} className="flex items-start gap-4 rounded-xl border border-white/10 bg-slate-900 p-5">
                <span className="text-2xl">{perk.icon}</span>
                <div>
                  <p className="font-semibold text-white mb-1">{perk.title}</p>
                  <p className="text-sm text-slate-400">{perk.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open roles */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-2xl font-bold text-white mb-8">Open roles</h2>
          <div className="space-y-4">
            {JOBS.map((job) => (
              <div key={job.title} className="rounded-xl border border-white/10 bg-slate-900 p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${job.teamColor}`}>{job.team}</span>
                      <span className="text-xs text-slate-500">{job.location}</span>
                      <span className="text-xs text-slate-500">{job.type}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{job.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed mb-4">{job.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((s) => (
                        <span key={s} className="rounded-md bg-slate-800 px-2.5 py-1 text-xs text-slate-300">{s}</span>
                      ))}
                    </div>
                  </div>
                  <a
                    href={`mailto:careers@monja.app?subject=Application: ${job.title}`}
                    className="shrink-0 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
                  >
                    Apply
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* General application */}
      <section className="border-t border-white/5 py-20">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <p className="text-xl font-bold text-white mb-3">Don&rsquo;t see your role?</p>
          <p className="text-slate-400 mb-6">We&rsquo;re always interested in exceptional people. Send us your resume and tell us how you&rsquo;d contribute.</p>
          <a
            href="mailto:careers@monja.app?subject=General Application"
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-all"
          >
            Send a general application →
          </a>
        </div>
      </section>
    </div>
  );
}
