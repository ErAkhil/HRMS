"use client";

import Link from "next/link";
import { useState } from "react";

export function MarketingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-violet-600 shadow-lg shadow-primary-500/25">
            <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-lg font-bold text-white">Monja</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-8 md:flex">
          <Link href="/features" className="text-sm text-slate-300 hover:text-white transition-colors">Features</Link>
          <Link href="/pricing" className="text-sm text-slate-300 hover:text-white transition-colors">Pricing</Link>
          <Link href="/about" className="text-sm text-slate-300 hover:text-white transition-colors">Customers</Link>
          <Link href="/blog" className="text-sm text-slate-300 hover:text-white transition-colors">Blog</Link>
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link href="/register/user" className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors">
            Register as User
          </Link>
          <Link href="/register/company" className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/25">
            Register Company
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10 md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-slate-950 px-6 pb-6 md:hidden">
          <div className="flex flex-col gap-4 pt-4">
            <Link href="/features" className="text-sm text-slate-300 hover:text-white" onClick={() => setMobileOpen(false)}>Features</Link>
            <Link href="/pricing" className="text-sm text-slate-300 hover:text-white" onClick={() => setMobileOpen(false)}>Pricing</Link>
            <Link href="/about" className="text-sm text-slate-300 hover:text-white" onClick={() => setMobileOpen(false)}>Customers</Link>
            <Link href="/blog" className="text-sm text-slate-300 hover:text-white" onClick={() => setMobileOpen(false)}>Blog</Link>
            <hr className="border-white/10" />
            <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white" onClick={() => setMobileOpen(false)}>Sign In</Link>
            <Link href="/register/user" className="rounded-lg border border-white/20 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-white/10" onClick={() => setMobileOpen(false)}>Register as User</Link>
            <Link href="/register/company" className="rounded-lg bg-primary-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-primary-700" onClick={() => setMobileOpen(false)}>Register Company</Link>
          </div>
        </div>
      )}
    </header>
  );
}
