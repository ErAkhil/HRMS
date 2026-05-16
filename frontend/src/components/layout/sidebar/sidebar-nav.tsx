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

type Section = (typeof NAV_DATA)[number];
type NavItem = Section["items"][number];

function formatPlanLabel(plan: string | undefined): string {
  return (plan ?? "")
    .replace("_", " ")
    .replace("PRO PLUS", "Pro+")
    .replace("PRO MAX", "Pro Max")
    .replace("PRO", "Pro");
}

function getVisibleSubItems(item: NavItem, userRole: NavItemRole, userPlan: NavItemPlan) {
  return (item.items ?? []).filter((sub) =>
    canSeeRole(sub.roles, userRole) &&
    hasPlan((sub as { minPlan?: string }).minPlan, userPlan),
  );
}

function LockedMenuItem({ item }: Readonly<{ item: NavItem }>) {
  return (
    <li key={item.title}>
      <Link href="/upgrade" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-dark-5/50 dark:text-dark-6/50 hover:bg-gray-1 dark:hover:bg-dark-3/50 transition-colors">
        <item.icon className="size-[18px] shrink-0 opacity-50" aria-hidden="true" />
        <span className="flex-1">{item.title}</span>
        <span className="rounded-full bg-amber-light px-1.5 py-0.5 text-[9px] font-semibold text-amber-dark dark:bg-amber-dark/20">
          {formatPlanLabel(item.minPlan)}
        </span>
      </Link>
    </li>
  );
}

function LeafMenuItem({ item, pathname }: Readonly<{ item: NavItem; pathname: string }>) {
  const href = "url" in item ? (item.url as string) : "/";
  const isActive = "url" in item ? pathname === item.url : false;

  return (
    <li key={item.title}>
      <MenuItem as="link" href={href} isActive={isActive}>
        <item.icon
          className={cn("size-[18px] shrink-0", isActive ? "text-primary-600 dark:text-primary-300" : "text-dark-5 dark:text-dark-6")}
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

function ParentMenuItem({
  item,
  pathname,
  userRole,
  userPlan,
  expandedItems,
  onToggleExpanded,
}: Readonly<{
  item: NavItem;
  pathname: string;
  userRole: NavItemRole;
  userPlan: NavItemPlan;
  expandedItems: string[];
  onToggleExpanded: (title: string) => void;
}>) {
  const visibleSubItems = getVisibleSubItems(item, userRole, userPlan);
  if (visibleSubItems.length === 0) return null;

  const isExpanded = expandedItems.includes(item.title);
  const isItemActive = visibleSubItems.some(({ url }) => url === pathname);

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
        <ul className="mt-0.5 space-y-0.5">
          {visibleSubItems.map((sub) => (
            <li key={sub.title}>
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
}

export function SidebarNav({ userRole, userPlan, expandedItems, onToggleExpanded }: Readonly<Props>) {
  const pathname = usePathname();

  return (
    <nav className="custom-scrollbar flex-1 overflow-y-auto px-3 pb-4" aria-label="Sidebar navigation">
      {NAV_DATA.map((section) => {
        const visibleItems = section.items.filter((item) => canSeeRole(item.roles, userRole));
        if (visibleItems.length === 0) return null;

        return (
          <div key={section.label} className="mb-5">
            <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-dark-5 dark:text-dark-6">
              {section.label}
            </p>
            <ul className="space-y-0.5">
              {visibleItems.map((item) => {
                const isLocked = !hasPlan(item.minPlan, userPlan);
                const hasChildren = item.items && item.items.length > 0;

                if (isLocked) {
                  return <LockedMenuItem key={item.title} item={item} />;
                }

                if (!hasChildren) {
                  return <LeafMenuItem key={item.title} item={item} pathname={pathname} />;
                }

                return (
                  <ParentMenuItem
                    key={item.title}
                    item={item}
                    pathname={pathname}
                    userRole={userRole}
                    userPlan={userPlan}
                    expandedItems={expandedItems}
                    onToggleExpanded={onToggleExpanded}
                  />
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
