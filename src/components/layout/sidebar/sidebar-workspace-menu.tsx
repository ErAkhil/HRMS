"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronUp } from "./icons";
import type { NavItemRole, NavItemPlan } from "./data";

interface Props {
  orgName: string;
  userPlan: NavItemPlan;
  userRole: NavItemRole;
  planLabel: string;
  roleLabel: string;
}

export function SidebarWorkspaceMenu({ orgName, userPlan, userRole, planLabel, roleLabel }: Readonly<Props>) {
  const [showMenu, setShowMenu] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className="mx-3 mb-4" ref={ref}>
      <div className="relative">
        <button
          onClick={() => setShowMenu((v) => !v)}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 transition-colors hover:bg-gray-2 dark:hover:bg-dark-3"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded bg-indigo-100 dark:bg-indigo-900/30">
            <Image src="/images/logo/logo-icon.svg" width={14} height={14} alt="" role="presentation" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-xs font-semibold text-dark dark:text-white">{orgName}</p>
            <p className="text-[10px] text-dark-5 dark:text-dark-6">{planLabel} Plan</p>
          </div>
          <ChevronUp className={cn("size-3 text-dark-5 dark:text-dark-6 transition-transform duration-200", showMenu ? "rotate-0" : "rotate-180")} />
        </button>

        {showMenu && (
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
              <Link href="/admin/users" onClick={() => setShowMenu(false)} className="block p-3 text-xs font-medium text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3">
                Manage Users & Roles
              </Link>
            )}
            {userRole === "SUPER_ADMIN" && (
              <Link href="/admin/organizations" onClick={() => setShowMenu(false)} className="block p-3 text-xs font-medium text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3">
                Manage Organizations
              </Link>
            )}
            {userPlan !== "PRO_MAX" && (
              <Link href="/upgrade" onClick={() => setShowMenu(false)} className="block p-3 text-xs font-semibold text-primary-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/20">
                Upgrade Plan →
              </Link>
            )}
            <div className="border-t border-gray-3 dark:border-dark-3" />
          </div>
        )}
      </div>
    </div>
  );
}
