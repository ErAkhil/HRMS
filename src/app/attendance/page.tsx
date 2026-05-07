"use client";

import { useState } from "react";
import { AttendanceKpiCards } from "./_components/KpiCards";
import { AttendanceTable } from "./_components/AttendanceTable";
import { LiveStatusPanel } from "./_components/LiveStatusPanel";
import { AttendanceHeatmap } from "./_components/AttendanceHeatmap";

type DateFilter = "Today" | "Week" | "Month";

export default function AttendancePage() {
  const [dateFilter, setDateFilter] = useState<DateFilter>("Today");

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-heading-5 font-bold text-dark dark:text-white">Attendance</h1>
          <p className="text-xs text-dark-5 dark:text-dark-6 mt-0.5">
            Track and manage employee attendance records
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Date range filter */}
          <div className="flex rounded-lg border border-gray-3 dark:border-dark-3 overflow-hidden">
            {(["Today", "Week", "Month"] as DateFilter[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setDateFilter(filter)}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  dateFilter === filter
                    ? "bg-primary-600 text-white"
                    : "bg-white text-dark-5 hover:bg-gray-2 dark:bg-dark-2 dark:text-dark-6 dark:hover:bg-dark-3"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <button className="rounded-lg border border-gray-3 px-4 py-2 text-sm font-medium text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6 flex items-center gap-1.5">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <AttendanceKpiCards />

      {/* Main content: table + live status */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <AttendanceTable />
        </div>
        <div className="lg:col-span-4">
          <LiveStatusPanel />
        </div>
      </div>

      {/* Attendance Heatmap */}
      <AttendanceHeatmap />
    </div>
  );
}
