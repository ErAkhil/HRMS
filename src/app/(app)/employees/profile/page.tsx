"use client";

import { useState } from "react";
import Link from "next/link";
import { ProfileHeroCard } from "./_components/profile-hero-card";
import { EditProfileModal } from "./_components/edit-profile-modal";
import { OverviewTab } from "./_components/tabs/overview-tab";
import { PerformanceTab } from "./_components/tabs/performance-tab";
import { LeaveTab } from "./_components/tabs/leave-tab";
import { DocumentsTab } from "./_components/tabs/documents-tab";

type Tab = "overview" | "performance" | "leave" | "documents";

const TABS: { key: Tab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "performance", label: "Performance" },
  { key: "leave", label: "Leave History" },
  { key: "documents", label: "Documents" },
];

const MENU_ITEMS = ["View Payslips", "Download Profile", "Flag for Review", "Deactivate Account"];

export default function EmployeeProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav className="flex items-center gap-1.5 text-xs text-dark-5 dark:text-dark-6">
          <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">Dashboard</Link>
          <span>/</span>
          <Link href="/employees" className="hover:text-indigo-600 dark:hover:text-indigo-400">Employees</Link>
          <span>/</span>
          <span className="text-dark dark:text-white">Profile</span>
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowEditModal(true)} className="rounded-lg border border-gray-3 bg-white px-4 py-2 text-sm font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white">
            Edit Profile
          </button>
          <div className="relative">
            <button onClick={() => setShowMenu((v) => !v)} className="rounded-lg border border-gray-3 bg-white px-4 py-2 text-sm font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white">
              &bull;&bull;&bull;
            </button>
            {showMenu && (
              <div className="absolute right-0 top-10 z-20 w-48 rounded-xl border border-gray-3 bg-white shadow-floating dark:border-dark-3 dark:bg-dark-2" onMouseLeave={() => setShowMenu(false)}>
                {MENU_ITEMS.map((item) => (
                  <button key={item} onClick={() => setShowMenu(false)} className="block w-full px-4 py-2.5 text-left text-sm text-dark hover:bg-gray-2 dark:text-white dark:hover:bg-dark-3 first:rounded-t-xl last:rounded-b-xl">
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ProfileHeroCard />

      <div className="rounded-xl bg-white shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <div className="flex gap-6 overflow-x-auto border-b border-gray-3 px-6 dark:border-dark-3">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`shrink-0 border-b-2 py-3.5 text-sm font-medium transition-colors ${
                activeTab === key
                  ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                  : "border-transparent text-dark-5 hover:text-dark dark:text-dark-6 dark:hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === "overview" && <OverviewTab onGoToPerformance={() => setActiveTab("performance")} onGoToLeave={() => setActiveTab("leave")} />}
          {activeTab === "performance" && <PerformanceTab />}
          {activeTab === "leave" && <LeaveTab />}
          {activeTab === "documents" && <DocumentsTab />}
        </div>
      </div>

      {showEditModal && <EditProfileModal onClose={() => setShowEditModal(false)} />}
    </div>
  );
}
