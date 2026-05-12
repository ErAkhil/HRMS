import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Register" };

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="mb-10 flex items-center justify-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 shadow-lg shadow-primary-500/25">
            <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white">Monja</span>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Get started with Monja</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Choose how you want to join the platform</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Register as Company */}
          <Link
            href="/register/company"
            className="group relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-white p-6 text-left transition-all hover:border-primary-500 hover:shadow-lg hover:shadow-primary-500/10 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-primary-500"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 group-hover:bg-primary-100 dark:bg-primary-900/30 transition-colors">
              <svg className="h-6 w-6 text-primary-600 dark:text-primary-400" viewBox="0 0 24 24" fill="none">
                <path d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-1">Register a Company</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Set up your organization, invite your team, and start managing your workforce.
            </p>
            <div className="mt-4 text-xs font-medium text-primary-600 dark:text-primary-400 group-hover:text-primary-700">
              Get started free →
            </div>
          </Link>

          {/* Register as User */}
          <Link
            href="/register/user"
            className="group relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-white p-6 text-left transition-all hover:border-violet-500 hover:shadow-lg hover:shadow-violet-500/10 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-violet-500"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 group-hover:bg-violet-100 dark:bg-violet-900/30 transition-colors">
              <svg className="h-6 w-6 text-violet-600 dark:text-violet-400" viewBox="0 0 24 24" fill="none">
                <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-1">Join as Employee</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Join your company&apos;s Monja workspace using an invite code from your HR team.
            </p>
            <div className="mt-4 text-xs font-medium text-violet-600 dark:text-violet-400 group-hover:text-violet-700">
              Join with invite →
            </div>
          </Link>
        </div>

        <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
