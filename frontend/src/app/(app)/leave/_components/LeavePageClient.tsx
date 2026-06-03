"use client";

import { useState } from "react";
import type { SerializedLeaveBalance, SerializedLeaveRequest } from "@/lib/actions/leave";
import type { LeaveCalendarEvent } from "@/lib/actions/reports";
import { LeaveBalanceCards } from "./LeaveBalanceCards";
import { LeaveRequestsTable } from "./LeaveRequestsTable";
import { ApplyLeaveModal } from "./ApplyLeaveModal";
import { LeaveViewModal } from "./LeaveViewModal";
import { LeaveCalendarTab } from "./LeaveCalendarTab";

type Tab = "My Requests" | "Team Calendar" | "History";

interface LeavePageClientProps {
  balances: SerializedLeaveBalance[];
  requests: SerializedLeaveRequest[];
  calendarEvents: LeaveCalendarEvent[];
  calendarMonth: number;
  calendarYear: number;
}

export function LeavePageClient({ balances, requests, calendarEvents, calendarMonth, calendarYear }: Readonly<LeavePageClientProps>) {
  const [activeTab, setActiveTab] = useState<Tab>("My Requests");
  const [showModal, setShowModal] = useState(false);
  const [viewRequest, setViewRequest] = useState<SerializedLeaveRequest | null>(null);

  const pendingRequests = requests.filter((r) => r.status === "PENDING");
  const historyRequests = requests.filter((r) => r.status !== "PENDING");

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">My Leave</h1>
          <p className="text-muted mt-0.5">Manage your leave requests and balances</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-1.5 w-fit"
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
      <div className="card-p">
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
              {tab === "My Requests" && pendingRequests.length > 0 && (
                <span className="ml-1.5 rounded-full bg-amber-light px-1.5 py-0.5 text-[10px] font-medium text-amber-dark dark:bg-amber-dark/20 dark:text-amber">
                  {pendingRequests.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {activeTab === "My Requests" && (
          pendingRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-12 w-12 rounded-xl bg-gray-2 dark:bg-dark-3 flex items-center justify-center mb-3">
                <svg className="h-6 w-6 text-dark-5 dark:text-dark-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-body-medium">No pending requests</p>
              <p className="text-muted mt-1">You have no leave requests awaiting approval.</p>
            </div>
          ) : (
            <LeaveRequestsTable
              requests={pendingRequests}
              onView={(req) => setViewRequest(req)}
            />
          )
        )}

        {activeTab === "Team Calendar" && (
          <LeaveCalendarTab
            initialEvents={calendarEvents}
            initialMonth={calendarMonth}
            initialYear={calendarYear}
          />
        )}

        {activeTab === "History" && (
          historyRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-12 w-12 rounded-xl bg-gray-2 dark:bg-dark-3 flex items-center justify-center mb-3">
                <svg className="h-6 w-6 text-dark-5 dark:text-dark-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-body-medium">No leave history yet</p>
              <p className="text-muted mt-1">Approved and rejected leave requests will appear here.</p>
            </div>
          ) : (
            <LeaveRequestsTable
              requests={historyRequests}
              onView={(req) => setViewRequest(req)}
            />
          )
        )}
      </div>

      {/* Apply Leave Modal */}
      {showModal && <ApplyLeaveModal onClose={() => setShowModal(false)} />}

      {/* View / Cancel Modal */}
      {viewRequest && (
        <LeaveViewModal
          request={viewRequest}
          onClose={() => setViewRequest(null)}
        />
      )}
    </div>
  );
}
