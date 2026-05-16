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

function formatPlanLabel(userPlan: NavItemPlan) {
  return userPlan.replace("_", " ").replace("PRO PLUS", "Pro+").replace("PRO MAX", "Pro Max").replace("PRO", "Pro").replace("BASIC", "Basic");
}

function formatRoleLabel(userRole: NavItemRole) {
  return userRole.replace("_", " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function SidebarBackdrop({ isVisible, onClose }: Readonly<{ isVisible: boolean; onClose: () => void }>) {
  if (!isVisible) return null;
  return <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300" onClick={onClose} aria-hidden="true" />;
}

function SidebarHeader({ isMobile, toggleSidebar }: Readonly<{ isMobile: boolean; toggleSidebar: () => void }>) {
  return (
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
  );
}

function useExpandedItems(pathname: string) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]));
  };

  useEffect(() => {
    const titlesToExpand: string[] = [];

    for (const section of NAV_DATA) {
      for (const item of section.items) {
        const subItems = item.items ?? [];
        for (const sub of subItems) {
          if (sub.url === pathname) {
            titlesToExpand.push(item.title);
            break;
          }
        }
      }
    }

    if (titlesToExpand.length === 0) return;

    setExpandedItems((prev) => {
      const next = [...prev];
      for (const title of titlesToExpand) {
        if (!next.includes(title)) next.push(title);
      }
      return next;
    });
  }, [pathname]);

  return { expandedItems, toggleExpanded };
}

function getSidebarAsideClass(isMobile: boolean, isOpen: boolean) {
  return cn(
    "flex max-w-[260px] flex-col border-r border-gray-3 bg-white transition-[width] duration-200 ease-linear dark:border-dark-3 dark:bg-dark-2",
    isMobile ? "fixed bottom-0 top-0 z-50" : "sticky top-0 h-screen",
    isOpen ? "w-full" : "w-0 overflow-hidden",
  );
}

function getSidebarUserName(session: ReturnType<typeof useSession>["data"]) {
  const name = session?.user?.name;
  if (name) return name;
  const email = session?.user?.email;
  if (email) return email.split("@")[0] ?? "User";
  return "User";
}

function getSidebarUserRole(session: ReturnType<typeof useSession>["data"]) {
  const role = session?.user?.role;
  if (role === "SUPER_ADMIN" || role === "HR_ADMIN" || role === "MANAGER" || role === "EMPLOYEE") return role;
  return "EMPLOYEE";
}

function getSidebarUserPlan(session: ReturnType<typeof useSession>["data"]) {
  const plan = session?.user?.plan;
  if (plan === "BASIC" || plan === "PRO" || plan === "PRO_PLUS" || plan === "PRO_MAX") return plan;
  return "BASIC";
}

function getSidebarUserData(session: ReturnType<typeof useSession>["data"]) {
  const userName = getSidebarUserName(session);
  const userRole = getSidebarUserRole(session);
  const userPlan = getSidebarUserPlan(session);

  return {
    userName,
    userRole,
    userPlan,
    orgName: session?.user?.orgName ?? "Monja",
    userImage: session?.user?.image ?? "/images/user/user-03.png",
    planLabel: formatPlanLabel(userPlan),
    roleLabel: formatRoleLabel(userRole),
  };
}

export function Sidebar() {
  const pathname = usePathname();
  const { setIsOpen, isOpen, isMobile, toggleSidebar } = useSidebarContext();
  const { expandedItems, toggleExpanded } = useExpandedItems(pathname);
  const { data: session } = useSession();
  const { userName, userRole, userPlan, orgName, userImage, planLabel, roleLabel } = getSidebarUserData(session);

  return (
    <>
      <SidebarBackdrop isVisible={isMobile && isOpen} onClose={() => setIsOpen(false)} />

      <aside
        className={getSidebarAsideClass(isMobile, isOpen)}
        aria-label="Main navigation"
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <SidebarHeader isMobile={isMobile} toggleSidebar={toggleSidebar} />

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
