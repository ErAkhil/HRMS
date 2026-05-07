"use client";

import { useState } from "react";
import { LeaveBalanceCards } from "./_components/LeaveBalanceCards";
import { LeaveRequestsTable } from "./_components/LeaveRequestsTable";
import { ApplyLeaveModal } from "./_components/ApplyLeaveModal";

type Tab = "My Requests" | "Team Calendar" | "History";

const leaveBalances = [
  {
    type: "Annual Leave",
    used: 12,
    total: 30,
    iconBg: "bg-primary-50 dark:bg-primary-900/20",
    iconColor: "text-primary-600",
    barColor: "bg-primary-600",
    icon: (
      <svg className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    type: "Sick Leave",
    used: 4,
    total: 10,
    iconBg: "bg-rose-light dark:bg-rose-dark/20",
    iconColor: "text-rose-dark",
    barColor: "bg-rose-500",
    icon: (
      <svg className="h-5 w-5 text-rose-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    type: "Casual Leave",
    used: 7,
    total: 10,
    iconBg: "bg-amber-light dark:bg-amber-dark/20",
    iconColor: "text-amber-dark",
    barColor: "bg-amber-400",
    icon: (
      <svg className="h-5 w-5 text-amber-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    type: "Comp Off",
    used: 1,
    total: 3,
    iconBg: "bg-violet-100 dark:bg-violet-dark/20",
    iconColor: "text-violet-dark",
    barColor: "bg-violet-500",
    icon: (
      <svg className="h-5 w-5 text-violet-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function LeavePage() {
  const [activeTab, setActiveTab] = useState<Tab>("My Requests");
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-heading-5 font-bold text-dark dark:text-white">My Leave</h1>
          <p className="text-xs text-dark-5 dark:text-dark-6 mt-0.5">Manage your leave requests and balances</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 flex items-center gap-1.5 w-fit"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Apply Leave
        </button>
      </div>

      {/* Leave Balance Cards */}
      <LeaveBalanceCards balances={leaveBalances} />

      {/* Tabs */}
      <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <div className="flex items-center gap-1 border-b border-gray-3 dark:border-dark-3 -mx-5 px-5 mb-5">
          {(["My Requests", "Team Calendar", "History"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-primary-600 text-primary-600"
                  : "border-transparent text-dark-5 hover:text-dark dark:text-dark-6 dark:hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "My Requests" && <LeaveRequestsTable />}

        {activeTab === "Team Calendar" && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-12 w-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mb-3">
              <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-dark dark:text-white">Team Calendar</p>
            <p className="text-xs text-dark-5 dark:text-dark-6 mt-1">
              View the full team calendar at{" "}
              <a href="/leave/calendar" className="text-primary-600 hover:underline">Leave Calendar</a>
            </p>
          </div>
        )}

        {activeTab === "History" && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-12 w-12 rounded-xl bg-gray-2 dark:bg-dark-3 flex items-center justify-center mb-3">
              <svg className="h-6 w-6 text-dark-5 dark:text-dark-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-dark dark:text-white">Leave History</p>
            <p className="text-xs text-dark-5 dark:text-dark-6 mt-1">All past leave records are shown in My Requests.</p>
          </div>
        )}
      </div>

      {/* Apply Leave Modal */}
      {showModal && <ApplyLeaveModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
