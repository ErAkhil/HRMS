import type { Metadata } from "next";

export const metadata: Metadata = { title: "GDPR & Data Privacy — Monja" };

const RIGHTS = [
  {
    icon: "📋",
    title: "Right to access",
    desc: "You can request a full export of all personal data we hold about you at any time. We will deliver it within 30 days.",
  },
  {
    icon: "✏️",
    title: "Right to rectification",
    desc: "If any personal data we hold is inaccurate or incomplete, you have the right to have it corrected.",
  },
  {
    icon: "🗑️",
    title: "Right to erasure",
    desc: "You can request deletion of your personal data. We will complete erasure within 30 days, subject to legal retention requirements.",
  },
  {
    icon: "📦",
    title: "Right to portability",
    desc: "You can request your data in a structured, machine-readable format (JSON/CSV) that you can transfer to another service.",
  },
  {
    icon: "🚫",
    title: "Right to restrict processing",
    desc: "You can ask us to pause processing of your data while a dispute or objection is resolved.",
  },
  {
    icon: "📣",
    title: "Right to object",
    desc: "You can object to certain types of data processing, including direct marketing and profiling.",
  },
];

const MEASURES = [
  { icon: "🔒", title: "Encryption at rest and in transit", desc: "All data is encrypted using AES-256 at rest and TLS 1.3 in transit." },
  { icon: "🏢", title: "Data isolation", desc: "Each organization's data is stored in isolated partitions using row-level security in PostgreSQL." },
  { icon: "🗺️", title: "Data residency", desc: "Customer data is stored in Supabase's EU/India region depending on plan configuration." },
  { icon: "📝", title: "Audit logs", desc: "Every data access and modification is logged with user identity, timestamp, and action type." },
  { icon: "🔑", title: "Access controls", desc: "Role-based access ensures employees only see data they are authorized to view." },
  { icon: "🧪", title: "Regular testing", desc: "We conduct annual penetration testing and quarterly security reviews." },
];

export default function GdprPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <section className="relative pt-32 pb-16">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-primary-600/10 blur-3xl" />
        </div>
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-400 mb-3">Legal</p>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">GDPR & Data Privacy</h1>
          <p className="text-slate-400">Last updated: <span className="text-slate-300">May 1, 2026</span></p>
          <p className="mt-4 text-lg text-slate-400 leading-relaxed">
            Monja is committed to data privacy and complies with the General Data Protection Regulation (GDPR), the Digital Personal Data Protection Act (DPDP) 2023, and other applicable data protection laws.
          </p>
        </div>
      </section>

      {/* Commitment */}
      <section className="pb-16">
        <div className="mx-auto max-w-3xl px-6">
          <div className="rounded-2xl border border-primary-500/30 bg-primary-500/10 p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Our commitment</h2>
            <p className="text-slate-300 leading-relaxed text-sm">
              When you use Monja to manage your workforce, you are the <strong>Data Controller</strong> — you decide what employee data is collected and why. Monja acts as the <strong>Data Processor</strong> — we process that data only on your instructions and solely to provide the service. We never use your employee data for our own commercial purposes.
            </p>
          </div>
        </div>
      </section>

      {/* Your rights */}
      <section className="pb-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold text-white mb-8">Your rights under GDPR & DPDP</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {RIGHTS.map((right) => (
              <div key={right.title} className="rounded-xl border border-white/10 bg-slate-900 p-5">
                <div className="mb-3 text-2xl">{right.icon}</div>
                <h3 className="font-semibold text-white mb-2">{right.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{right.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-slate-500">
            To exercise any of these rights, email us at{" "}
            <a href="mailto:privacy@monja.app" className="text-primary-400 hover:underline">privacy@monja.app</a>.
            We will respond within 30 days. For EU residents, if we fail to respond adequately, you may lodge a complaint with your national Data Protection Authority.
          </p>
        </div>
      </section>

      {/* Security measures */}
      <section className="py-16 border-t border-white/5 bg-slate-900/30">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold text-white mb-8">Technical & organizational measures</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {MEASURES.map((m) => (
              <div key={m.title} className="flex items-start gap-4 rounded-xl border border-white/10 bg-slate-900 p-5">
                <span className="text-xl">{m.icon}</span>
                <div>
                  <h3 className="font-semibold text-white mb-1">{m.title}</h3>
                  <p className="text-sm text-slate-400">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DPA */}
      <section className="py-16 border-t border-white/5">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-2xl font-bold text-white mb-6">Data Processing Agreement</h2>
          <div className="rounded-xl border border-white/10 bg-slate-900 p-6">
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              If your organization operates in the EU or processes personal data of EU residents, you may require a Data Processing Agreement (DPA) to be signed with Monja as part of your GDPR compliance obligations.
            </p>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Our DPA is based on the European Commission&rsquo;s Standard Contractual Clauses (SCCs) and is available to all Pro Max plan customers. Pro plan customers may request a DPA by contacting our legal team.
            </p>
            <a
              href="mailto:legal@monja.app?subject=Data Processing Agreement Request"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
            >
              Request a DPA
            </a>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-12 border-t border-white/5">
        <div className="mx-auto max-w-3xl px-6">
          <div className="rounded-xl border border-white/10 bg-slate-900 p-6">
            <h2 className="text-base font-semibold text-white mb-2">Data Protection Officer</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              For all data privacy enquiries, contact our DPO at{" "}
              <a href="mailto:privacy@monja.app" className="text-primary-400 hover:underline">privacy@monja.app</a>.
              For urgent security incidents, use{" "}
              <a href="mailto:security@monja.app" className="text-primary-400 hover:underline">security@monja.app</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
