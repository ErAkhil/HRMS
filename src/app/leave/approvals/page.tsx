"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type LeaveCategory = "All" | "Annual" | "Sick" | "Casual";
type RequestStatus = "pending" | "approved" | "rejected";

interface PendingRequest {
  id: number;
  name: string;
  role: string;
  avatar: string;
  leaveType: string;
  leaveCategory: "Annual" | "Sick" | "Casual";
  from: string;
  to: string;
  days: number;
  requestedDaysAgo: number;
  teamImpact: string;
}

const initialRequests: PendingRequest[] = [
  {
    id: 1, name: "Arjun Mehta", role: "Data Analyst", avatar: "/images/user/user-06.png",
    leaveType: "Annual Leave", leaveCategory: "Annual",
    from: "Jun 10", to: "Jun 14", days: 5,
    requestedDaysAgo: 2,
    teamImpact: "2 others from Engineering on leave same period",
  },
  {
    id: 2, name: "Marcus Johnson", role: "DevOps Engineer", avatar: "/images/user/user-07.png",
    leaveType: "Sick Leave", leaveCategory: "Sick",
    from: "May 9", to: "May 10", days: 2,
    requestedDaysAgo: 1,
    teamImpact: "No other team members on leave during this period",
  },
  {
    id: 3, name: "Zara Ahmed", role: "Marketing Lead", avatar: "/images/user/user-08.png",
    leaveType: "Annual Leave", leaveCategory: "Annual",
    from: "Jun 20", to: "Jul 4", days: 15,
    requestedDaysAgo: 3,
    teamImpact: "1 other from Marketing on leave Jun 25–28",
  },
  {
    id: 4, name: "Tom Bradley", role: "Sales Manager", avatar: "/images/user/user-09.png",
    leaveType: "Casual Leave", leaveCategory: "Casual",
    from: "May 8", to: "May 8", days: 1,
    requestedDaysAgo: 1,
    teamImpact: "No impact — team well-staffed for the day",
  },
  {
    id: 5, name: "Kevin Lee", role: "Finance Analyst", avatar: "/images/user/user-11.png",
    leaveType: "Annual Leave", leaveCategory: "Annual",
    from: "Jun 1", to: "Jun 5", days: 5,
    requestedDaysAgo: 4,
    teamImpact: "Quarter-end period — Finance team overlap possible",
  },
  {
    id: 6, name: "Lisa Chen", role: "UI Designer", avatar: "/images/user/user-12.png",
    leaveType: "Sick Leave", leaveCategory: "Sick",
    from: "May 8", to: "May 8", days: 1,
    requestedDaysAgo: 1,
    teamImpact: "No impact on active sprint deliverables",
  },
];

const categoryFilters: LeaveCategory[] = ["All", "Annual", "Sick", "Casual"];

const leaveCategoryBadge: Record<string, string> = {
  "Annual Leave": "rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-dark dark:bg-sky-dark/10 dark:text-sky",
  "Sick Leave": "rounded-full bg-rose-light px-2.5 py-0.5 text-xs font-medium text-rose-dark dark:bg-rose-dark/20 dark:text-rose",
  "Casual Leave": "rounded-full bg-amber-light px-2.5 py-0.5 text-xs font-medium text-amber-dark dark:bg-amber-dark/20 dark:text-amber",
};

export default function ApprovalsPage() {
  const [filter, setFilter] = useState<LeaveCategory>("All");
  const [statuses, setStatuses] = useState<Record<number, RequestStatus>>({});

  const filtered = initialRequests.filter(
    (r) => filter === "All" || r.leaveCategory === filter
  );

  function handleAction(id: number, action: "approved" | "rejected") {
    setStatuses((prev) => ({ ...prev, [id]: action }));
  }

  const pendingCount = initialRequests.filter((r) => !statuses[r.id]).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-dark-5 dark:text-dark-6 mb-1">
            <Link href="/leave" className="hover:text-primary-600">Leave</Link>
            <span>/</span>
            <span>Approvals</span>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-heading-5 font-bold text-dark dark:text-white">Pending Approvals</h1>
            <span className="rounded-full bg-rose-light px-2.5 py-0.5 text-xs font-medium text-rose-dark dark:bg-rose-dark/20 dark:text-rose">
              {pendingCount}
            </span>
          </div>
          <p className="text-xs text-dark-5 dark:text-dark-6 mt-0.5">Review and action team leave requests</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1">
        {categoryFilters.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filter === cat
                ? "bg-primary-600 text-white"
                : "border border-gray-3 text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6 dark:hover:bg-dark-3"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Approval cards */}
      <div className="space-y-4">
        {filtered.map((req) => {
          const status = statuses[req.id];

          if (status === "approved") {
            return (
              <div key={req.id} className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 opacity-60">
                <div className="flex items-center gap-3">
                  <Image src={req.avatar} alt={req.name} width={40} height={40} className="rounded-full object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-dark dark:text-white">{req.name}</p>
                    <p className="text-xs text-dark-5 dark:text-dark-6">{req.leaveType} — {req.from} to {req.to}</p>
                  </div>
                  <span className="rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald">
                    Approved
                  </span>
                </div>
              </div>
            );
          }

          if (status === "rejected") {
            return (
              <div key={req.id} className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 opacity-60">
                <div className="flex items-center gap-3">
                  <Image src={req.avatar} alt={req.name} width={40} height={40} className="rounded-full object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-dark dark:text-white">{req.name}</p>
                    <p className="text-xs text-dark-5 dark:text-dark-6">{req.leaveType} — {req.from} to {req.to}</p>
                  </div>
                  <span className="rounded-full bg-rose-light px-2.5 py-0.5 text-xs font-medium text-rose-dark dark:bg-rose-dark/20 dark:text-rose">
                    Rejected
                  </span>
                </div>
              </div>
            );
          }

          return (
            <div key={req.id} className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                {/* Left: employee info */}
                <div className="flex items-start gap-3">
                  <Image
                    src={req.avatar}
                    alt={req.name}
                    width={44}
                    height={44}
                    className="rounded-full object-cover shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-dark dark:text-white">{req.name}</p>
                      <span className={leaveCategoryBadge[req.leaveType] ?? "rounded-full bg-gray-2 px-2.5 py-0.5 text-xs font-medium text-dark-5"}>
                        {req.leaveType}
                      </span>
                    </div>
                    <p className="text-xs text-dark-5 dark:text-dark-6 mt-0.5">{req.role}</p>

                    {/* Date + duration */}
                    <div className="mt-2 flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <svg className="h-3.5 w-3.5 text-dark-5 dark:text-dark-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs text-dark dark:text-white font-medium">
                          {req.from} — {req.to}
                        </span>
                      </div>
                      <span className="rounded-full bg-gray-2 dark:bg-dark-3 px-2 py-0.5 text-xs font-medium text-dark-5 dark:text-dark-6">
                        {req.days} day{req.days > 1 ? "s" : ""}
                      </span>
                      <span className="text-xs text-dark-5 dark:text-dark-6">
                        Requested {req.requestedDaysAgo} day{req.requestedDaysAgo > 1 ? "s" : ""} ago
                      </span>
                    </div>

                    {/* Team impact */}
                    <div className="mt-2 flex items-start gap-1.5">
                      <svg className="h-3.5 w-3.5 mt-0.5 shrink-0 text-amber-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-xs text-dark-5 dark:text-dark-6">{req.teamImpact}</p>
                    </div>
                  </div>
                </div>

                {/* Right: actions */}
                <div className="flex items-center gap-2 sm:shrink-0 flex-wrap">
                  <Link
                    href="/leave"
                    className="rounded-lg border border-gray-3 px-4 py-2 text-sm font-medium text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleAction(req.id, "rejected")}
                    className="rounded-lg border border-rose-500 px-4 py-2 text-sm font-medium text-rose-dark hover:bg-rose-light dark:border-rose-dark/50 dark:text-rose dark:hover:bg-rose-dark/10 transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleAction(req.id, "approved")}
                    className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-dark transition-colors"
                  >
                    Approve
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="rounded-xl bg-white p-12 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-2 dark:bg-dark-3">
              <svg className="h-6 w-6 text-dark-5 dark:text-dark-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-dark dark:text-white">No pending requests</p>
            <p className="text-xs text-dark-5 dark:text-dark-6 mt-1">All {filter === "All" ? "" : filter + " "}leave requests have been actioned.</p>
          </div>
        )}
      </div>
    </div>
  );
}
