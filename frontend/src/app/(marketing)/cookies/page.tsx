import type { Metadata } from "next";

export const metadata: Metadata = { title: "Cookie Policy — Monja" };

const COOKIE_TYPES = [
  {
    name: "Strictly necessary",
    color: "text-primary-400 bg-primary-500/10 border-primary-500/30",
    canOpt: false,
    desc: "These cookies are required for the platform to function. They include session authentication tokens, CSRF protection tokens, and security preferences. You cannot opt out of these cookies.",
    examples: [
      { name: "next-auth.session-token", purpose: "Maintains your authenticated session", duration: "Session / 30 days" },
      { name: "next-auth.csrf-token", purpose: "Prevents cross-site request forgery attacks", duration: "Session" },
      { name: "__Secure-next-auth.callback-url", purpose: "Stores the post-login redirect URL", duration: "Session" },
    ],
  },
  {
    name: "Functional",
    color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    canOpt: true,
    desc: "These cookies remember your preferences to provide a personalized experience, such as your theme preference (light/dark mode) and sidebar state.",
    examples: [
      { name: "monja-theme", purpose: "Stores your light/dark mode preference", duration: "1 year" },
      { name: "monja-sidebar", purpose: "Stores sidebar open/closed state", duration: "1 year" },
    ],
  },
  {
    name: "Analytics",
    color: "text-sky-400 bg-sky-500/10 border-sky-500/30",
    canOpt: true,
    desc: "These cookies help us understand how users interact with the platform so we can improve it. We use anonymized analytics and do not link usage data to individual users.",
    examples: [
      { name: "_monja_analytics", purpose: "Tracks anonymized page views and feature usage", duration: "90 days" },
    ],
  },
];

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <section className="pt-32 pb-12">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-400 mb-3">Legal</p>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Cookie Policy</h1>
          <p className="text-slate-400">Last updated: <span className="text-slate-300">May 1, 2026</span></p>
          <p className="mt-4 text-slate-400 leading-relaxed">
            This Cookie Policy explains what cookies are, how Monja uses them, and your choices regarding cookies when using the Monja platform.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-3xl px-6 space-y-8">

          {/* What are cookies */}
          <div className="rounded-xl border border-white/10 bg-slate-900 p-6">
            <h2 className="text-lg font-semibold text-white mb-3">What are cookies?</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Cookies are small text files stored in your browser when you visit a website. They help the site remember information about your visit — like your login state or display preferences — to make your next visit easier and the site more useful.
            </p>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              Monja uses cookies and similar technologies (such as local storage) to make the platform work correctly and to improve your experience.
            </p>
          </div>

          {/* Cookie types */}
          {COOKIE_TYPES.map((type) => (
            <div key={type.name} className="rounded-xl border border-white/10 bg-slate-900 p-6">
              <div className="mb-4 flex items-center gap-3">
                <h2 className="text-lg font-semibold text-white">{type.name} cookies</h2>
                <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${type.color}`}>
                  {type.canOpt ? "Optional" : "Required"}
                </span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-5">{type.desc}</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Cookie name</th>
                      <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Purpose</th>
                      <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {type.examples.map((ex) => (
                      <tr key={ex.name} className="border-b border-white/5 last:border-0">
                        <td className="py-3 pr-4 font-mono text-xs text-primary-400">{ex.name}</td>
                        <td className="py-3 pr-4 text-slate-400">{ex.purpose}</td>
                        <td className="py-3 text-slate-500 whitespace-nowrap">{ex.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {/* Managing cookies */}
          <div className="rounded-xl border border-white/10 bg-slate-900 p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Managing your cookies</h2>
            <p className="text-sm text-slate-400 leading-relaxed mb-3">
              You can control and delete cookies through your browser settings. Note that disabling strictly necessary cookies will prevent you from logging in to Monja.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { browser: "Chrome", url: "chrome://settings/cookies" },
                { browser: "Firefox", url: "about:preferences#privacy" },
                { browser: "Safari", url: "Preferences → Privacy" },
                { browser: "Edge", url: "edge://settings/privacy" },
              ].map((b) => (
                <div key={b.browser} className="rounded-lg border border-white/5 bg-slate-800 px-4 py-3">
                  <p className="text-xs font-semibold text-white">{b.browser}</p>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{b.url}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="rounded-xl border border-white/10 bg-slate-900 p-6">
            <h2 className="text-base font-semibold text-white mb-2">Questions?</h2>
            <p className="text-sm text-slate-400">
              If you have questions about our use of cookies, contact our privacy team at{" "}
              <a href="mailto:privacy@monja.app" className="text-primary-400 hover:underline">privacy@monja.app</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
