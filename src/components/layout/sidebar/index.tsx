"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { NAV_DATA, type NavItemRole, type NavItemPlan } from "./data";
import { ArrowLeftIcon, ChevronUp, AIAssistantIcon } from "./icons";
import { MenuItem } from "./menu-item";
import { useSidebarContext } from "./sidebar-context";

const PLAN_RANK: Record<string, number> = { BASIC: 0, PRO: 1, PRO_PLUS: 2, PRO_MAX: 3 };

function canSeeRole(itemRoles: string[] | undefined, userRole: string): boolean {
  if (!itemRoles) return true;
  return itemRoles.includes(userRole);
}

function hasPlan(itemPlan: string | undefined, userPlan: string): boolean {
  if (!itemPlan) return true;
  return PLAN_RANK[userPlan] >= PLAN_RANK[itemPlan];
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { setIsOpen, isOpen, isMobile, toggleSidebar } = useSidebarContext();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  const userName = session?.user?.name ?? session?.user?.email?.split("@")[0] ?? "User";
  const userRole = (session?.user?.role ?? "EMPLOYEE") as NavItemRole;
  const userPlan = (session?.user?.plan ?? "BASIC") as NavItemPlan;
  const orgName = session?.user?.orgName ?? "Unikove";
  const userImage = session?.user?.image ?? "/images/user/user-03.png";

  const planLabel = userPlan.replace("_", " ").replace("PRO PLUS", "Pro+").replace("PRO MAX", "Pro Max").replace("PRO", "Pro").replace("BASIC", "Basic");
  const roleLabel = userRole.replace("_", " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    );
  };

  useEffect(() => {
    NAV_DATA.forEach((section) => {
      section.items.forEach((item) => {
        if (item.items?.some((sub) => sub.url === pathname)) {
          setExpandedItems((prev) =>
            prev.includes(item.title) ? prev : [...prev, item.title],
          );
        }
      });
    });
  }, [pathname]);

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (workspaceRef.current && !workspaceRef.current.contains(e.target as Node)) {
        setShowWorkspaceMenu(false);
      }
    }
    if (showWorkspaceMenu) {
      document.addEventListener("mousedown", handleMouseDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [showWorkspaceMenu]);

  return (
    <>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "flex max-w-[260px] flex-col border-r border-gray-3 bg-white transition-[width] duration-200 ease-linear dark:border-dark-3 dark:bg-dark-2",
          isMobile ? "fixed bottom-0 top-0 z-50" : "sticky top-0 h-screen",
          isOpen ? "w-full" : "w-0 overflow-hidden",
        )}
        aria-label="Main navigation"
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5">
          <Link
            href="/"
            onClick={() => isMobile && toggleSidebar()}
            className="flex items-center gap-2.5"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-ai shadow-indigo-glow">
              <AIAssistantIcon className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-dark dark:text-white">Unikove</span>
          </Link>

          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="rounded-lg p-1.5 text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3"
            >
              <span className="sr-only">Close Menu</span>
              <ArrowLeftIcon className="size-5" />
            </button>
          )}
        </div>

        {/* Workspace / org selector */}
        <div className="mx-3 mb-4" ref={workspaceRef}>
          <div className="relative">
            <button
              onClick={() => setShowWorkspaceMenu((v) => !v)}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 transition-colors hover:bg-gray-2 dark:hover:bg-dark-3"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded bg-indigo-100 dark:bg-indigo-900/30">
                <Image src="/images/logo/logo-icon.svg" width={14} height={14} alt="" role="presentation" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs font-semibold text-dark dark:text-white">{orgName}</p>
                <p className="text-[10px] text-dark-5 dark:text-dark-6">{planLabel} Plan</p>
              </div>
              <ChevronUp
                className={cn(
                  "size-3 text-dark-5 dark:text-dark-6 transition-transform duration-200",
                  showWorkspaceMenu ? "rotate-0" : "rotate-180",
                )}
              />
            </button>

            {showWorkspaceMenu && (
              <div className="absolute left-0 right-0 top-full z-30 mt-1 rounded-xl border border-gray-3 bg-white shadow-floating dark:border-dark-3 dark:bg-dark-2 overflow-hidden">
                <div className="p-3 border-b border-gray-3 dark:border-dark-3">
                  <p className="text-xs font-semibold text-dark dark:text-white">{orgName}</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                      userPlan === "PRO_MAX" ? "bg-violet-light text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300" :
                      userPlan === "PRO_PLUS" ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300" :
                      userPlan === "PRO" ? "bg-sky-50 text-sky-dark dark:bg-sky-dark/10 dark:text-sky" :
                      "bg-gray-2 text-dark-5 dark:bg-dark-3 dark:text-dark-6"
                    )}>
                      {planLabel}
                    </span>
                    <span className="text-[10px] text-dark-5 dark:text-dark-6">{roleLabel}</span>
                  </div>
                </div>
                {(userRole === "SUPER_ADMIN" || userRole === "HR_ADMIN") && (
                  <Link
                    href="/admin/users"
                    onClick={() => setShowWorkspaceMenu(false)}
                    className="block p-3 text-xs font-medium text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3"
                  >
                    Manage Users & Roles
                  </Link>
                )}
                {userRole === "SUPER_ADMIN" && (
                  <Link
                    href="/admin/organizations"
                    onClick={() => setShowWorkspaceMenu(false)}
                    className="block p-3 text-xs font-medium text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3"
                  >
                    Manage Organizations
                  </Link>
                )}
                {userPlan !== "PRO_MAX" && (
                  <Link
                    href="/upgrade"
                    onClick={() => setShowWorkspaceMenu(false)}
                    className="block p-3 text-xs font-semibold text-primary-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
                  >
                    Upgrade Plan →
                  </Link>
                )}
                <div className="border-t border-gray-3 dark:border-dark-3" />
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav
          className="custom-scrollbar flex-1 overflow-y-auto px-3 pb-4"
          aria-label="Sidebar navigation"
        >
          {NAV_DATA.map((section) => {
            const visibleItems = section.items.filter((item) =>
              canSeeRole(item.roles as string[], userRole)
            );
            if (visibleItems.length === 0) return null;

            return (
              <div key={section.label} className="mb-5">
                <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-dark-5 dark:text-dark-6">
                  {section.label}
                </p>

                <ul className="space-y-0.5">
                  {visibleItems.map((item) => {
                    const isLocked = !hasPlan(item.minPlan as string, userPlan);
                    const hasChildren = item.items && item.items.length > 0;
                    const isExpanded = expandedItems.includes(item.title);
                    const isItemActive = hasChildren
                      ? item.items!.some(({ url }) => url === pathname)
                      : "url" in item && item.url === pathname;

                    if (isLocked) {
                      return (
                        <li key={item.title}>
                          <Link
                            href="/upgrade"
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-dark-5/50 dark:text-dark-6/50 hover:bg-gray-1 dark:hover:bg-dark-3/50 transition-colors"
                          >
                            <item.icon className="size-[18px] shrink-0 opacity-50" aria-hidden="true" />
                            <span className="flex-1">{item.title}</span>
                            <span className="rounded-full bg-amber-light px-1.5 py-0.5 text-[9px] font-semibold text-amber-dark dark:bg-amber-dark/20">
                              {(item.minPlan as string)?.replace("_", " ").replace("PRO PLUS", "Pro+").replace("PRO MAX", "Pro Max").replace("PRO", "Pro")}
                            </span>
                          </Link>
                        </li>
                      );
                    }

                    if (!hasChildren) {
                      return (
                        <li key={item.title}>
                          <MenuItem
                            as="link"
                            href={"url" in item ? (item.url as string) : "/"}
                            isActive={"url" in item ? pathname === item.url : false}
                          >
                            <item.icon
                              className={cn(
                                "size-[18px] shrink-0",
                                "url" in item && pathname === item.url
                                  ? "text-indigo-600 dark:text-indigo-300"
                                  : "text-dark-5 dark:text-dark-6",
                              )}
                              aria-hidden="true"
                            />
                            <span className="flex-1">{item.title}</span>
                            {item.title === "AI Assistant" && (
                              <span className="rounded-full bg-gradient-ai px-1.5 py-0.5 text-[10px] font-medium text-white">AI</span>
                            )}
                          </MenuItem>
                        </li>
                      );
                    }

                    // Filter sub-items by role and plan
                    const visibleSubItems = item.items!.filter((sub) =>
                      canSeeRole(sub.roles as string[], userRole) &&
                      hasPlan((sub as { minPlan?: string }).minPlan, userPlan)
                    );

                    if (visibleSubItems.length === 0) return null;

                    return (
                      <li key={item.title}>
                        <MenuItem
                          isActive={isItemActive}
                          onClick={() => toggleExpanded(item.title)}
                        >
                          <item.icon
                            className={cn(
                              "size-[18px] shrink-0",
                              isItemActive ? "text-indigo-600 dark:text-indigo-300" : "text-dark-5 dark:text-dark-6",
                            )}
                            aria-hidden="true"
                          />
                          <span className="flex-1">{item.title}</span>
                          <ChevronUp
                            className={cn(
                              "size-3 transition-transform duration-200",
                              isExpanded ? "rotate-0" : "rotate-180",
                            )}
                            aria-hidden="true"
                          />
                        </MenuItem>

                        {isExpanded && (
                          <ul className="mt-0.5 space-y-0.5" role="menu">
                            {visibleSubItems.map((sub) => (
                              <li key={sub.title} role="none">
                                <MenuItem
                                  as="link"
                                  href={sub.url}
                                  isActive={pathname === sub.url}
                                  isSubItem
                                >
                                  <span
                                    className={cn(
                                      "h-1 w-1 rounded-full",
                                      pathname === sub.url
                                        ? "bg-indigo-600 dark:bg-indigo-300"
                                        : "bg-dark-5 dark:bg-dark-6",
                                    )}
                                  />
                                  {sub.title}
                                </MenuItem>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="border-t border-gray-3 px-3 py-3 dark:border-dark-3">
          <Link
            href="/profile"
            onClick={() => isMobile && toggleSidebar()}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors hover:bg-gray-2 dark:hover:bg-dark-3"
          >
            <div className="relative shrink-0">
              <Image src={userImage} width={32} height={32} alt="Profile" className="rounded-full object-cover" />
              <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-white bg-emerald-DEFAULT dark:border-dark-2" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-dark dark:text-white capitalize">{userName}</p>
              <p className="truncate text-[10px] text-dark-5 dark:text-dark-6">{roleLabel}</p>
            </div>
            <button
              className="rounded p-1 text-dark-5 hover:text-dark dark:text-dark-6 dark:hover:text-white"
              aria-label="Settings"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push("/pages/settings");
              }}
            >
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </Link>
        </div>
      </aside>
    </>
  );
}
