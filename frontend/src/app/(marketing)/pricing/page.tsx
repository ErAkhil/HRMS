import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Pricing — Monja" };

const PLANS = [
  {
    name: "Basic",
    price: "Free",
    period: "",
    desc: "Perfect for small teams getting started with modern HR.",
    features: [
      "Up to 10 employees",
      "Core HR & employee profiles",
      "Basic payroll processing",
      "Attendance & leave tracking",
      "Email support",
    ],
    notIncluded: ["Recruitment pipeline", "Learning & certifications", "Workforce reports", "AI insights & chat", "SSO / Google OAuth", "Dedicated support"],
    cta: "Start Free",
    href: "/register/company",
    highlight: false,
  },
  {
    name: "Pro",
    price: "₹2,499",
    period: "/month",
    desc: "For growing teams that need more power and flexibility.",
    features: [
      "Up to 100 employees",
      "Everything in Basic",
      "Leave approval workflows",
      "Performance reviews & OKRs",
      "Task & project management",
      "Google OAuth sign-in",
      "Priority support",
    ],
    notIncluded: ["Recruitment pipeline", "Learning & certifications", "Workforce reports", "AI insights & chat", "Dedicated support"],
    cta: "Get Pro",
    href: "/register/company",
    highlight: false,
  },
  {
    name: "Pro+",
    price: "₹4,999",
    period: "/month",
    desc: "Advanced tools for data-driven HR teams scaling fast.",
    features: [
      "Up to 500 employees",
      "Everything in Pro",
      "Recruitment pipeline",
      "Learning & certifications",
      "Workforce & payroll reports",
      "Performance analytics",
      "Advanced audit logs",
    ],
    notIncluded: ["AI insights & chat", "Team collaboration", "Onboarding workflows", "SSO & dedicated support"],
    cta: "Get Pro+",
    href: "/register/company",
    highlight: true,
  },
  {
    name: "Pro Max",
    price: "₹8,999",
    period: "/month",
    desc: "Enterprise-grade for large organizations with complex needs.",
    features: [
      "Unlimited employees",
      "Everything in Pro+",
      "AI-powered insights & chat",
      "Attrition risk prediction",
      "Team collaboration suite",
      "Onboarding & offboarding",
      "SSO & advanced security",
      "Data export & GDPR tools",
      "Dedicated account manager",
      "Custom SLA (99.9% uptime)",
    ],
    notIncluded: [],
    cta: "Contact Sales",
    href: "/contact",
    highlight: false,
  },
];

const FAQS = [
  {
    q: "Can I switch plans later?",
    a: "Yes, you can upgrade or downgrade your plan at any time. Upgrades take effect immediately; downgrades apply at the next billing cycle.",
  },
  {
    q: "Is there a free trial for paid plans?",
    a: "All new organizations start on the Basic plan (free forever). Paid plans can be evaluated — contact us at sales@monja.app for a 14-day trial on Pro or Pro Max.",
  },
  {
    q: "How does the employee count work?",
    a: "Employee count is based on active employee records in your organization. Archived or offboarded employees do not count toward your limit.",
  },
  {
    q: "Do you offer annual billing discounts?",
    a: "Yes! Annual billing gives you 2 months free — effectively a 17% discount on Pro and Pro Max plans.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept all major credit/debit cards, UPI, net banking, and bank transfers for annual plans.",
  },
  {
    q: "Is my data secure?",
    a: "All data is stored in Supabase (PostgreSQL) with row-level security. Each organization's data is fully isolated. We are GDPR-compliant and support data export and deletion on request.",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-primary-600/10 blur-3xl" />
        </div>
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-1.5 text-sm font-medium text-primary-300">
            Simple, transparent pricing
          </div>
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            Plans for every{" "}
            <span className="bg-gradient-to-r from-primary-400 to-violet-400 bg-clip-text text-transparent">
              stage of growth
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-slate-400">
            Start free and scale as your team grows. No hidden fees, no setup costs.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PLANS.map((plan) => (
              <div key={plan.name} className={`relative flex flex-col rounded-2xl p-8 ${plan.highlight ? "bg-primary-600 border-2 border-primary-400 shadow-2xl shadow-primary-500/30" : "border border-white/10 bg-slate-900"}`}>
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-1 text-xs font-bold text-primary-600">
                    MOST POPULAR
                  </div>
                )}
                <div className="mb-6">
                  <p className={`text-sm font-semibold mb-2 ${plan.highlight ? "text-primary-100" : "text-slate-400"}`}>{plan.name}</p>
                  <div className="flex items-end gap-1 mb-3">
                    <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                    {plan.period && <span className={`mb-1 text-sm ${plan.highlight ? "text-primary-100" : "text-slate-400"}`}>{plan.period}</span>}
                  </div>
                  <p className={`text-sm leading-relaxed ${plan.highlight ? "text-primary-100" : "text-slate-400"}`}>{plan.desc}</p>
                </div>

                <ul className="flex-1 space-y-2.5 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <svg className={`mt-0.5 h-4 w-4 shrink-0 ${plan.highlight ? "text-white" : "text-primary-400"}`} viewBox="0 0 24 24" fill="none">
                        <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className={plan.highlight ? "text-white" : "text-slate-300"}>{f}</span>
                    </li>
                  ))}
                  {plan.notIncluded.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm opacity-40">
                      <svg className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
                        <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className={plan.highlight ? "text-white" : "text-slate-400"}>{f}</span>
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

          <p className="mt-6 text-center text-sm text-slate-500">
            All prices exclude GST. Annual billing available with 2 months free.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-slate-900/30 border-t border-white/5">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Frequently asked questions</h2>
          <div className="space-y-6">
            {FAQS.map((faq) => (
              <div key={faq.q} className="rounded-xl border border-white/10 bg-slate-900 p-6">
                <h3 className="text-base font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-white/5">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Still have questions?</h2>
          <p className="text-slate-400 mb-6">Our team is happy to help you pick the right plan for your organization.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700 transition-all">
            Talk to Sales
          </Link>
        </div>
      </section>
    </div>
  );
}
