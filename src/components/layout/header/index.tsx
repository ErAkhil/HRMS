"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebarContext } from "../sidebar/sidebar-context";
import { Notification } from "./notification";
import { ThemeToggleSwitch } from "./theme-toggle";
import { UserInfo } from "./user-info";
import { GlobalSearch } from "./global-search";

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Dashboard", subtitle: "Overview" },
  "/employees": { title: "Employees", subtitle: "Directory & profiles" },
  "/attendance": { title: "Attendance", subtitle: "Track & manage time" },
  "/leave": { title: "Leave", subtitle: "Manage time off" },
  "/payroll": { title: "Payroll", subtitle: "Salary & compensation" },
  "/recruitment": { title: "Recruitment", subtitle: "Hiring pipeline" },
  "/onboarding": { title: "Onboarding", subtitle: "Employee journeys" },
  "/collaboration": { title: "Collaboration", subtitle: "Channels & messages" },
  "/tasks": { title: "Tasks & Projects", subtitle: "Work management" },
  "/performance": { title: "Performance", subtitle: "KPIs & reviews" },
  "/learning": { title: "Learning", subtitle: "Courses & certifications" },
  "/reports": { title: "Reports", subtitle: "Analytics & insights" },
  "/ai": { title: "AI Assistant", subtitle: "Powered by Unikove AI" },
  "/admin": { title: "Admin", subtitle: "System configuration" },
};

function getPageMeta(pathname: string) {
  const exact = PAGE_TITLES[pathname];
  if (exact) return exact;
  const prefix = Object.keys(PAGE_TITLES).find(
    (k) => k !== "/" && pathname.startsWith(k),
  );
  return prefix ? PAGE_TITLES[prefix] : { title: "Dashboard", subtitle: "" };
}

export function Header() {
  const { toggleSidebar, isMobile } = useSidebarContext();
  const pathname = usePathname();
  const meta = getPageMeta(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b border-gray-3 bg-white/95 backdrop-blur-sm dark:border-dark-3 dark:bg-dark-2/95">
      <div className="flex w-full items-center gap-3 px-4 md:px-6">

        {/* ── Left: toggle + title ── */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="rounded-lg p-2 text-dark-5 transition-colors hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3 lg:hidden"
            aria-label="Toggle sidebar"
          >
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          {isMobile && (
            <Link href="/" className="max-[430px]:hidden">
              <Image
                src="/images/logo/logo-icon.svg"
                width={28}
                height={28}
                alt=""
                role="presentation"
              />
            </Link>
          )}

          <div className="hidden lg:block">
            <h1 className="text-sm font-semibold leading-none text-dark dark:text-white">
              {meta.title}
            </h1>
            {meta.subtitle && (
              <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">
                {meta.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* ── Center: global search ── */}
        <GlobalSearch />

        {/* ── Right: actions ── */}
        <div className="flex shrink-0 items-center gap-1">

          {/* AI Assistant */}
          <Link
            href="/ai"
            className="hidden items-center gap-1.5 rounded-lg bg-gradient-ai px-3 py-1.5 text-xs font-semibold text-white shadow-indigo-glow transition-opacity hover:opacity-90 sm:flex"
            aria-label="Open AI Assistant"
          >
            <svg className="size-3.5" viewBox="0 0 24 24" fill="none">
              <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Ask AI
          </Link>

          {/* Calendar shortcut */}
          <Link
            href="/calendar"
            className="grid size-9 place-items-center rounded-lg text-dark-5 transition-colors hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3"
            aria-label="Calendar"
          >
            <svg className="size-4.5" viewBox="0 0 24 24" fill="none">
              <path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>

          <ThemeToggleSwitch />

          <Notification />

          <UserInfo />
        </div>
      </div>
    </header>
  );
}
