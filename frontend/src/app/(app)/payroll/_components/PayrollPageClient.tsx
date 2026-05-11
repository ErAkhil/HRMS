"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";
import { runPayroll } from "@/lib/actions/payroll";
import type { SerializedPayrollRun, PayslipRow } from "@/lib/actions/payroll";
import { PayrollKpiCards } from "./PayrollKpiCards";
import { PayrollTable } from "./PayrollTable";
import { PayrollBreakdown } from "./PayrollBreakdown";
import { RecentPayrollRuns } from "./RecentPayrollRuns";

interface PayrollStats {
  totalGross: number;
  totalNet: number;
  totalDeductions: number;
  employeeCount: number;
  month: string;
}

interface Props {
  payrollRuns: SerializedPayrollRun[];
  payslipRows: PayslipRow[];
  latestStats?: PayrollStats;
  isAdmin: boolean;
}

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export function PayrollPageClient({ payrollRuns, payslipRows, latestStats, isAdmin }: Props) {
  const router = useRouter();
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const year = now.getFullYear();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast, setToast } = useToast();

  const currentMonthLabel = `${MONTH_NAMES[month - 1]} ${year}`;

  function handleRunPayroll() {
    startTransition(async () => {
      try {
        await runPayroll(month, year);
        setShowConfirmModal(false);
        setToast(`Payroll processed for ${currentMonthLabel}`);
        router.refresh();
      } catch (e) {
        setToast(e instanceof Error ? e.message : "Payroll processing failed");
        setShowConfirmModal(false);
      }
    });
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Payroll</h1>
          <p className="text-muted">Manage and process employee payroll</p>
        </div>
        {isAdmin && (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-gray-3 bg-white px-3 py-2 dark:border-dark-3 dark:bg-dark-2">
              <button
                onClick={() => setMonth((m) => Math.max(1, m - 1))}
                className="text-dark-5 hover:text-dark dark:text-dark-6 dark:hover:text-white"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="w-28 text-center text-sm font-semibold text-dark dark:text-white">
                {currentMonthLabel}
              </span>
              <button
                onClick={() => setMonth((m) => Math.min(12, m + 1))}
                className="text-dark-5 hover:text-dark dark:text-dark-6 dark:hover:text-white"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <button
              onClick={() => setShowConfirmModal(true)}
              disabled={isPending}
              className="btn-primary flex items-center gap-2 disabled:opacity-60"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {isPending ? "Processing…" : "Run Payroll"}
            </button>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <PayrollKpiCards stats={latestStats} />

      {/* Table + Breakdown */}
      <div className="grid gap-5 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <PayrollTable rows={payslipRows} />
        </div>
        <div className="lg:col-span-4">
          <PayrollBreakdown stats={latestStats} />
        </div>
      </div>

      {/* Recent Runs */}
      {isAdmin && <RecentPayrollRuns runs={payrollRuns} />}

      {/* Run Payroll Modal */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-panel max-w-md p-6">
            <div className="mb-4 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-500/20">
                <svg className="h-7 w-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
            </div>
            <h2 className="mb-2 text-center text-lg font-bold text-dark dark:text-white">
              Run {currentMonthLabel} Payroll?
            </h2>
            <p className="mb-6 text-center text-sm text-dark-5 dark:text-dark-6">
              This will calculate and process payroll for all active employees. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 rounded-xl border border-gray-3 px-4 py-2.5 text-sm font-semibold text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6"
              >
                Cancel
              </button>
              <button
                onClick={handleRunPayroll}
                disabled={isPending}
                className="flex-1 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-60"
              >
                Yes, Run Payroll
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toast} />
    </div>
  );
}
