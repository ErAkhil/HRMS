"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { deactivateEmployee, type EmployeeProfile } from "@/lib/actions/employees";
import { ProfileHeroCard } from "./profile-hero-card";
import { EditProfileModal } from "./edit-profile-modal";
import { OverviewTab } from "./tabs/overview-tab";
import { PerformanceTab } from "./tabs/performance-tab";
import { LeaveTab } from "./tabs/leave-tab";
import { DocumentsTab } from "./tabs/documents-tab";

type Tab = "overview" | "performance" | "leave" | "documents";

const TABS: { key: Tab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "performance", label: "Performance" },
  { key: "leave", label: "Leave History" },
  { key: "documents", label: "Documents" },
];

interface Props {
  employee: EmployeeProfile;
  departments: { id: string; name: string }[];
}

export function ProfilePageClient({ employee, departments }: Readonly<Props>) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [showEdit, setShowEdit] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDeactivate() {
    if (!confirm(`Deactivate ${employee.firstName} ${employee.lastName}? They will lose access immediately.`)) return;
    startTransition(async () => {
      await deactivateEmployee(employee.id);
      router.push("/employees");
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav className="flex items-center gap-1.5 text-xs text-dark-5 dark:text-dark-6">
          <Link href="/employees" className="hover:text-primary-600 dark:hover:text-primary-400">Employees</Link>
          <span>/</span>
          <span className="text-dark dark:text-white">{employee.firstName} {employee.lastName}</span>
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEdit(true)}
            className="rounded-lg border border-gray-3 bg-white px-4 py-2 text-sm font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          >
            Edit Profile
          </button>
          <div className="relative">
            <button
              onClick={() => setShowMenu((v) => !v)}
              className="rounded-lg border border-gray-3 bg-white px-4 py-2 text-sm font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            >
              &bull;&bull;&bull;
            </button>
            {showMenu && (
              <div className="absolute right-0 top-10 z-20 w-48 rounded-xl border border-gray-3 bg-white shadow-floating dark:border-dark-3 dark:bg-dark-2" onMouseLeave={() => setShowMenu(false)}>
                <button
                  onClick={() => { setShowMenu(false); handleDeactivate(); }}
                  disabled={isPending}
                  className="block w-full px-4 py-2.5 text-left text-sm text-rose-600 hover:bg-gray-2 dark:hover:bg-dark-3 rounded-xl disabled:opacity-50"
                >
                  Deactivate Account
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ProfileHeroCard employee={employee} />

      <div className="rounded-xl bg-white shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <div className="flex gap-6 overflow-x-auto border-b border-gray-3 px-6 dark:border-dark-3">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`shrink-0 border-b-2 py-3.5 text-sm font-medium transition-colors ${
                activeTab === key
                  ? "border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400"
                  : "border-transparent text-dark-5 hover:text-dark dark:text-dark-6 dark:hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="p-6">
          {activeTab === "overview" && (
            <OverviewTab employee={employee} onGoToPerformance={() => setActiveTab("performance")} onGoToLeave={() => setActiveTab("leave")} />
          )}
          {activeTab === "performance" && <PerformanceTab />}
          {activeTab === "leave" && <LeaveTab leaveBalances={employee.leaveBalances} />}
          {activeTab === "documents" && <DocumentsTab />}
        </div>
      </div>

      {showEdit && (
        <EditProfileModal
          employee={employee}
          departments={departments}
          onClose={() => setShowEdit(false)}
        />
      )}
    </div>
  );
}
