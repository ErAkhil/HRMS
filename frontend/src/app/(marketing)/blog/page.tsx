import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Blog — Monja" };

const POSTS = [
  {
    slug: "ai-hr-india-2026",
    category: "AI & HR",
    categoryColor: "text-violet-400 bg-violet-500/10 border-violet-500/30",
    title: "How AI is reshaping HR operations for Indian companies in 2026",
    excerpt: "From payroll anomaly detection to attrition prediction, here's how leading HR teams are using AI to work smarter — not harder.",
    author: "Priya Sharma",
    initials: "PS",
    authorColor: "from-violet-500 to-primary-600",
    date: "May 8, 2026",
    readTime: "6 min read",
  },
  {
    slug: "payroll-compliance-checklist",
    category: "Payroll",
    categoryColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    title: "The ultimate payroll compliance checklist for Indian startups",
    excerpt: "PF, ESI, TDS, professional tax — everything your finance and HR team needs to stay compliant in FY 2026-27.",
    author: "Rahul Nair",
    initials: "RN",
    authorColor: "from-emerald-500 to-primary-600",
    date: "April 29, 2026",
    readTime: "8 min read",
  },
  {
    slug: "remote-team-attendance",
    category: "Attendance",
    categoryColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    title: "Managing attendance for hybrid and remote teams: What actually works",
    excerpt: "Clock-in apps, trust-based policies, shift management — a practical guide to attendance for modern distributed teams.",
    author: "Ananya Kumar",
    initials: "AK",
    authorColor: "from-rose-500 to-violet-600",
    date: "April 15, 2026",
    readTime: "5 min read",
  },
  {
    slug: "performance-reviews-guide",
    category: "Performance",
    categoryColor: "text-rose-400 bg-rose-500/10 border-rose-500/30",
    title: "Running your first 360° performance review: A manager's guide",
    excerpt: "Step-by-step walkthrough of setting up a fair, bias-resistant 360° review cycle that employees actually find valuable.",
    author: "Sneha Iyer",
    initials: "SI",
    authorColor: "from-amber-500 to-rose-600",
    date: "April 3, 2026",
    readTime: "7 min read",
  },
  {
    slug: "onboarding-best-practices",
    category: "Onboarding",
    categoryColor: "text-sky-400 bg-sky-500/10 border-sky-500/30",
    title: "The 30-60-90 day onboarding plan that reduces early attrition by 40%",
    excerpt: "Data from 300+ Monja customers shows what separates high-retention onboarding programs from the ones that fail.",
    author: "Vikram Das",
    initials: "VD",
    authorColor: "from-sky-500 to-primary-600",
    date: "March 20, 2026",
    readTime: "9 min read",
  },
  {
    slug: "hrms-roi-calculator",
    category: "HR Strategy",
    categoryColor: "text-primary-400 bg-primary-500/10 border-primary-500/30",
    title: "How to calculate the ROI of switching to a modern HRMS",
    excerpt: "Spreadsheet vs. platform — a framework for calculating the true cost of manual HR processes and the payback period of switching.",
    author: "Arjun Mehta",
    initials: "AM",
    authorColor: "from-primary-500 to-violet-600",
    date: "March 10, 2026",
    readTime: "6 min read",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <section className="relative pt-32 pb-16">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-primary-600/10 blur-3xl" />
        </div>
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight">Monja Blog</h1>
          <p className="mt-4 text-lg text-slate-400">
            Insights on HR, payroll, people management, and building better workplaces.
          </p>
        </div>
      </section>

      {/* Featured post */}
      <section className="pb-8">
        <div className="mx-auto max-w-6xl px-6">
          <div className="rounded-2xl border border-white/10 bg-slate-900 overflow-hidden">
            <div className="p-8 sm:p-10">
              <div className="mb-4 flex items-center gap-3">
                <span className={`rounded-full border px-3 py-0.5 text-xs font-semibold ${POSTS[0].categoryColor}`}>{POSTS[0].category}</span>
                <span className="text-xs text-slate-500">Featured</span>
              </div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl mb-3">{POSTS[0].title}</h2>
              <p className="text-slate-400 leading-relaxed mb-6">{POSTS[0].excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${POSTS[0].authorColor} text-xs font-bold text-white`}>
                    {POSTS[0].initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{POSTS[0].author}</p>
                    <p className="text-xs text-slate-500">{POSTS[0].date} · {POSTS[0].readTime}</p>
                  </div>
                </div>
                <Link href={`/blog/${POSTS[0].slug}`} className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                  Read article →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Post grid */}
      <section className="py-8 pb-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {POSTS.slice(1).map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group rounded-xl border border-white/10 bg-slate-900 p-6 hover:border-white/20 transition-all hover:-translate-y-0.5">
                <span className={`mb-4 inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ${post.categoryColor}`}>{post.category}</span>
                <h3 className="mb-2 font-semibold text-white leading-snug group-hover:text-primary-300 transition-colors">{post.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-5 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center gap-2.5">
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${post.authorColor} text-xs font-bold text-white`}>
                    {post.initials}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-300">{post.author}</p>
                    <p className="text-xs text-slate-500">{post.date} · {post.readTime}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
