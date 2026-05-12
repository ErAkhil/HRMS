import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "./_components/login-form";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sign In" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  const { callbackUrl, error } = await searchParams;

  return (
    <div className="flex min-h-screen">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 p-12 relative overflow-hidden">
        {/* Background decorations */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-primary-600/15 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />
        </div>

        {/* Logo */}
        <Link href="/" className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 shadow-lg shadow-primary-500/30">
            <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-xl font-bold text-white">Monja</span>
        </Link>

        {/* Main content */}
        <div className="relative space-y-8">
          <div>
            <h2 className="text-4xl font-extrabold text-white leading-tight">
              Your entire workforce,<br />
              <span className="bg-gradient-to-r from-primary-400 to-violet-400 bg-clip-text text-transparent">
                in one place.
              </span>
            </h2>
            <p className="mt-4 text-base text-slate-400 leading-relaxed max-w-sm">
              From HR management and payroll to AI-powered insights — Monja gives your team everything they need to thrive.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: "👥", label: "Employee Management" },
              { icon: "💰", label: "Payroll & Compliance" },
              { icon: "🤖", label: "AI-Powered Insights" },
              { icon: "💬", label: "Team Collaboration" },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <span className="text-lg">{f.icon}</span>
                <span className="text-sm font-medium text-slate-300">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative rounded-xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-300 leading-relaxed italic">
            &ldquo;Monja reduced our HR workload by 60% and gave us real-time visibility into our entire workforce for the first time.&rdquo;
          </p>
          <div className="mt-3 flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-400 to-violet-400 flex items-center justify-center text-xs font-bold text-white">AK</div>
            <div>
              <p className="text-xs font-semibold text-white">Ananya Kumar</p>
              <p className="text-xs text-slate-500">VP of People, TechScale India</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-white dark:bg-slate-950 p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="mb-8 flex items-center justify-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-violet-600">
              <svg className="h-4.5 w-4.5 text-white" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">Monja</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back</h1>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              Sign in to your workspace to continue
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-center gap-3 rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 dark:bg-rose-500/10 dark:border-rose-500/20">
              <svg className="h-4 w-4 shrink-0 text-rose-500" viewBox="0 0 24 24" fill="none">
                <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="text-sm text-rose-600 dark:text-rose-400">
                {error === "CredentialsSignin"
                  ? "Invalid email or password."
                  : error === "GoogleAccountNotFound"
                  ? "No Monja account found for this Google email. Contact your HR admin."
                  : error === "GoogleSignInFailed"
                  ? "Google sign-in failed. Please try again."
                  : "Something went wrong. Please try again."}
              </p>
            </div>
          )}

          <LoginForm callbackUrl={callbackUrl} />

          <div className="mt-6 space-y-3 text-center text-sm text-slate-500 dark:text-slate-400">
            <p>
              New to Monja?{" "}
              <Link href="/register/company" className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400">
                Register your company
              </Link>
              {" "}or{" "}
              <Link href="/register/user" className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400">
                join as employee
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
