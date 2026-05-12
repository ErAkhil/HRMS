import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Join as Employee" };

export default function RegisterUserPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="mb-10 flex items-center justify-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 shadow-lg shadow-primary-500/25">
            <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white">Monja</span>
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 dark:bg-violet-900/30">
              <svg className="h-7 w-7 text-violet-600 dark:text-violet-400" viewBox="0 0 24 24" fill="none">
                <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Join as Employee</h1>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              Employee accounts are created by your HR admin
            </p>
          </div>

          <div className="space-y-4 rounded-xl bg-amber-50 border border-amber-200 p-4 dark:bg-amber-900/20 dark:border-amber-500/30">
            <div className="flex gap-3">
              <svg className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" viewBox="0 0 24 24" fill="none">
                <path d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">How employee access works</p>
                <p className="mt-1 text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                  Your HR administrator needs to add you as an employee in Monja first. Once added, you&apos;ll receive login credentials via email. You can then sign in directly.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <Link
              href="/login"
              className="flex h-11 w-full items-center justify-center rounded-xl bg-primary-600 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
            >
              Sign In with Credentials
            </Link>
            <p className="text-center text-xs text-slate-500 dark:text-slate-400">
              Don&apos;t have credentials yet? Contact your HR admin.
            </p>
          </div>

          <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-6 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Are you an HR manager or company owner?{" "}
              <Link href="/register/company" className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400">
                Register your company →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
