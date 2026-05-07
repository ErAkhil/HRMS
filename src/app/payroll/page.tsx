"use client";

import { useState } from "react";
import { PayrollKpiCards } from "./_components/PayrollKpiCards";
import { PayrollTable } from "./_components/PayrollTable";
import { PayrollBreakdown } from "./_components/PayrollBreakdown";
import { RecentPayrollRuns } from "./_components/RecentPayrollRuns";

const MONTHS = [
  "January 2026", "February 2026", "March 2026", "April 2026",
  "May 2026", "June 2026",
];

export default function PayrollPage() {
  const [monthIndex, setMonthIndex] = useState(4); // May 2026

  const prevMonth = () => setMonthIndex((i) => Math.max(0, i - 1));
  const nextMonth = () => setMonthIndex((i) => Math.min(MONTHS.length - 1, i + 1));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-dark dark:text-white">Payroll</h1>
          <p className="text-xs text-dark-5 dark:text-dark-6">Manage and process employee payroll</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Month Selector */}
          <div className="flex items-center gap-2 rounded-lg border border-gray-3 bg-white px-3 py-2 dark:border-dark-3 dark:bg-dark-2">
            <button
              onClick={prevMonth}
              disabled={monthIndex === 0}
              className="text-dark-5 hover:text-dark disabled:opacity-30 dark:text-dark-6 dark:hover:text-white"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-sm font-semibold text-dark dark:text-white w-28 text-center">
              {MONTHS[monthIndex]}
            </span>
            <button
              onClick={nextMonth}
              disabled={monthIndex === MONTHS.length - 1}
              className="text-dark-5 hover:text-dark disabled:opacity-30 dark:text-dark-6 dark:hover:text-white"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <button className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Run Payroll
          </button>

          <button className="rounded-lg border border-gray-3 px-4 py-2 text-sm font-medium text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6 flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <PayrollKpiCards />

      {/* AI Insight */}
      <div
        className="rounded-xl p-4 text-white"
        style={{ background: "linear-gradient(135deg, #4F46E5, #8B5CF6)" }}
      >
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/20">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-white/70 mb-0.5">AI Insight</p>
            <p className="text-sm font-medium text-white">
              Payroll processing for {MONTHS[monthIndex]} is <span className="font-bold">94% complete</span>. 14 employees have pending bank details that need to be updated before disbursement.
            </p>
          </div>
          <span className="ml-auto shrink-0 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white">
            AI
          </span>
        </div>
      </div>

      {/* Table + Breakdown */}
      <div className="grid gap-5 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <PayrollTable />
        </div>
        <div className="lg:col-span-4">
          <PayrollBreakdown />
        </div>
      </div>

      {/* Recent Runs */}
      <RecentPayrollRuns />
    </div>
  );
}
