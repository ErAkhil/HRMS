import type { Metadata } from "next";
import { RegisterCompanyForm } from "./_components/register-company-form";
import Link from "next/link";

export const metadata: Metadata = { title: "Register Company" };

export default function RegisterCompanyPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-5/12 flex-col justify-between bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 p-12 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-20 h-80 w-80 rounded-full bg-primary-600/15 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />
        </div>

        <Link href="/" className="relative flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-violet-600">
            <svg className="h-4.5 w-4.5 text-white" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-lg font-bold text-white">Monja</span>
        </Link>

        <div className="relative space-y-6">
          <h2 className="text-3xl font-extrabold text-white leading-tight">
            Start managing your team<br />
            <span className="bg-gradient-to-r from-primary-400 to-violet-400 bg-clip-text text-transparent">
              the smart way.
            </span>
          </h2>
          <p className="text-slate-400 leading-relaxed">
            Create your organization account and get access to the full Monja platform. Free forever on the Basic plan.
          </p>
          <ul className="space-y-3">
            {[
              "No credit card required",
              "Unlimited employees on paid plans",
              "AI-powered HR automation",
              "Setup in under 5 minutes",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-slate-300">
                <svg className="h-4 w-4 shrink-0 text-emerald-400" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-slate-600">
          © {new Date().getFullYear()} Monja Technologies
        </p>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 flex-col items-center justify-center bg-white dark:bg-slate-950 p-6 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* Mobile logo */}
          <Link href="/" className="mb-8 flex items-center justify-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-violet-600">
              <svg className="h-4.5 w-4.5 text-white" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">Monja</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create your organization</h1>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              Set up your workspace in minutes. You&apos;ll be the organization Admin.
            </p>
          </div>

          <RegisterCompanyForm />

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
