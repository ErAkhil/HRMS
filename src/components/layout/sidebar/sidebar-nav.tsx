"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronUp } from "./icons";
import { MenuItem } from "./menu-item";
import { NAV_DATA, type NavItemRole, type NavItemPlan } from "./data";

function canSeeRole(itemRoles: string[] | undefined, userRole: string): boolean {
  if (!itemRoles) return true;
  return itemRoles.includes(userRole);
}

function hasPlan(itemPlan: string | undefined, userPlan: string): boolean {
  const PLAN_RANK: Record<string, number> = { BASIC: 0, PRO: 1, PRO_PLUS: 2, PRO_MAX: 3 };
  if (!itemPlan) return true;
  return PLAN_RANK[userPlan] >= PLAN_RANK[itemPlan];
}

interface Props {
  userRole: NavItemRole;
  userPlan: NavItemPlan;
  expandedItems: string[];
  onToggleExpanded: (title: string) => void;
}

export function SidebarNav({ userRole, userPlan, expandedItems, onToggleExpanded }: Readonly<Props>) {
  const pathname = usePathname();

  return (
    <nav className="custom-scrollbar flex-1 overflow-y-auto px-3 pb-4" aria-label="Sidebar navigation">
      {NAV_DATA.map((section) => {
        const visibleItems = section.items.filter((item) => canSeeRole(item.roles as string[], userRole));
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
                  ? (item.items ?? []).some(({ url }) => url === pathname)
                  : "url" in item && item.url === pathname;

                if (isLocked) {
                  return (
                    <li key={item.title}>
                      <Link href="/upgrade" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-dark-5/50 dark:text-dark-6/50 hover:bg-gray-1 dark:hover:bg-dark-3/50 transition-colors">
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
                      <MenuItem as="link" href={"url" in item ? (item.url as string) : "/"} isActive={"url" in item ? pathname === item.url : false}>
                        <item.icon
                          className={cn("size-[18px] shrink-0", "url" in item && pathname === item.url ? "text-primary-600 dark:text-primary-300" : "text-dark-5 dark:text-dark-6")}
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

                const visibleSubItems = (item.items ?? []).filter((sub) =>
                  canSeeRole(sub.roles as string[], userRole) &&
                  hasPlan((sub as { minPlan?: string }).minPlan, userPlan)
                );
                if (visibleSubItems.length === 0) return null;

                return (
                  <li key={item.title}>
                    <MenuItem isActive={isItemActive} onClick={() => onToggleExpanded(item.title)}>
                      <item.icon
                        className={cn("size-[18px] shrink-0", isItemActive ? "text-primary-600 dark:text-primary-300" : "text-dark-5 dark:text-dark-6")}
                        aria-hidden="true"
                      />
                      <span className="flex-1">{item.title}</span>
                      <ChevronUp className={cn("size-3 transition-transform duration-200", isExpanded ? "rotate-0" : "rotate-180")} aria-hidden="true" />
                    </MenuItem>
                    {isExpanded && (
                      <ul className="mt-0.5 space-y-0.5" role="menu">
                        {visibleSubItems.map((sub) => (
                          <li key={sub.title} role="none">
                            <MenuItem as="link" href={sub.url} isActive={pathname === sub.url} isSubItem>
                              <span className={cn("h-1 w-1 rounded-full", pathname === sub.url ? "bg-primary-600 dark:bg-primary-300" : "bg-dark-5 dark:bg-dark-6")} />
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
  );
}
