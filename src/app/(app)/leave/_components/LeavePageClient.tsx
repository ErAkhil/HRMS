"use client";

import { useState } from "react";
import type { LeaveBalance, LeaveRequest, Employee } from "@prisma/client";
import { LeaveBalanceCards } from "./LeaveBalanceCards";
import { LeaveRequestsTable } from "./LeaveRequestsTable";
import { ApplyLeaveModal } from "./ApplyLeaveModal";

type Tab = "My Requests" | "Team Calendar" | "History";

type LeaveRequestWithEmployee = LeaveRequest & {
  employee: Pick<Employee, "firstName" | "lastName">;
};

interface LeavePageClientProps {
  balances: LeaveBalance[];
  requests: LeaveRequestWithEmployee[];
}

export function LeavePageClient({ balances, requests }: LeavePageClientProps) {
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
      <LeaveBalanceCards balances={balances} />

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

        {activeTab === "My Requests" && <LeaveRequestsTable requests={requests} />}

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
