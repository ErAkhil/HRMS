"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { NAV_DATA, type NavItemRole, type NavItemPlan } from "./data";
import { ArrowLeftIcon, AIAssistantIcon } from "./icons";
import { useSidebarContext } from "./sidebar-context";
import { SidebarWorkspaceMenu } from "./sidebar-workspace-menu";
import { SidebarNav } from "./sidebar-nav";
import { SidebarUserFooter } from "./sidebar-user-footer";

export function Sidebar() {
  const pathname = usePathname();
  const { setIsOpen, isOpen, isMobile, toggleSidebar } = useSidebarContext();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const { data: session } = useSession();

  const userName = session?.user?.name ?? session?.user?.email?.split("@")[0] ?? "User";
  const userRole = (session?.user?.role ?? "EMPLOYEE") as NavItemRole;
  const userPlan = (session?.user?.plan ?? "BASIC") as NavItemPlan;
  const orgName = session?.user?.orgName ?? "Monja";
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
          <Link href="/dashboard" onClick={() => isMobile && toggleSidebar()} className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-ai shadow-indigo-glow">
              <AIAssistantIcon className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-dark dark:text-white">Monja</span>
          </Link>
          {isMobile && (
            <button onClick={toggleSidebar} className="rounded-lg p-1.5 text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3">
              <span className="sr-only">Close Menu</span>
              <ArrowLeftIcon className="size-5" />
            </button>
          )}
        </div>

        <SidebarWorkspaceMenu
          orgName={orgName}
          userPlan={userPlan}
          userRole={userRole}
          planLabel={planLabel}
          roleLabel={roleLabel}
        />

        <SidebarNav
          userRole={userRole}
          userPlan={userPlan}
          expandedItems={expandedItems}
          onToggleExpanded={toggleExpanded}
        />

        <SidebarUserFooter
          userName={userName}
          roleLabel={roleLabel}
          userImage={userImage}
          onNavigate={() => isMobile && toggleSidebar()}
        />
      </aside>
    </>
  );
}
