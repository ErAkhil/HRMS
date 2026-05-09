import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "./_components/login-form";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sign In" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const session = await auth();
  if (session?.user) redirect("/");

  const { callbackUrl, error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-2 dark:bg-dark-1 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-ai shadow-indigo-glow">
            <Image src="/images/logo/logo-icon.svg" width={22} height={22} alt="Unikove" />
          </div>
          <span className="text-xl font-bold text-dark dark:text-white">Unikove</span>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white p-8 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <h1 className="mb-1.5 text-2xl font-bold text-dark dark:text-white">Welcome back</h1>
          <p className="mb-6 text-sm text-dark-5 dark:text-dark-6">Sign in to your workspace</p>

          {error && (
            <div className="mb-5 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
              {error === "CredentialsSignin"
                ? "Invalid email or password."
                : "Something went wrong. Please try again."}
            </div>
          )}

          <LoginForm callbackUrl={callbackUrl} />
        </div>

        <p className="mt-4 text-center text-xs text-dark-5 dark:text-dark-6">
          © {new Date().getFullYear()} Unikove. All rights reserved.
        </p>
      </div>
    </div>
  );
}
