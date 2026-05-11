"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";
import Link from "next/link";

const MONTH_NAMES = [
  "", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function fmt(val: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);
}

export interface PayslipData {
  id: string;
  basicSalary: number;
  hra: number;
  allowances: number;
  grossPay: number;
  taxDeduction: number;
  pfDeduction: number;
  otherDeductions: number;
  netPay: number;
  payrollRun: {
    month: number;
    year: number;
    status: string;
  };
  createdAt: string;
}

interface PayslipsClientProps {
  payslips: PayslipData[];
}

export function PayslipsClient({ payslips }: PayslipsClientProps) {
  const { toast, setToast } = useToast();

  const monthLabels = payslips.map(
    (p) => `${MONTH_NAMES[p.payrollRun.month]} ${p.payrollRun.year}`
  );

  const [activeIdx, setActiveIdx] = useState(0);

  const active = payslips[activeIdx];

  // YTD totals
  const ytdGross = payslips.reduce((sum, p) => sum + p.grossPay, 0);
  const ytdNet = payslips.reduce((sum, p) => sum + p.netPay, 0);
  const ytdTax = payslips.reduce((sum, p) => sum + p.taxDeduction, 0);

  if (payslips.length === 0) {
    return (
      <div className="page-container">
        <div className="page-header">
          <div>
            <div className="flex items-center gap-2 text-muted mb-1">
              <Link href="/payroll" className="hover:text-primary-600">Payroll</Link>
              <span>/</span>
              <span>Payslips</span>
            </div>
            <h1 className="page-title">Payslips</h1>
          </div>
        </div>
        <div className="card empty-state">
          <p className="empty-state-text">No payslips found. Payslips will appear here once payroll is processed.</p>
        </div>
      </div>
    );
  }

  const totalDeductions = active.taxDeduction + active.pfDeduction + active.otherDeductions;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="flex items-center gap-2 text-muted mb-1">
            <Link href="/payroll" className="hover:text-primary-600">Payroll</Link>
            <span>/</span>
            <span>Payslips</span>
          </div>
          <h1 className="page-title">Payslips</h1>
        </div>
        {/* YTD summary */}
        <div className="flex items-center gap-6 text-right">
          <div>
            <p className="text-muted">YTD Gross</p>
            <p className="text-sm font-bold text-dark dark:text-white">{fmt(ytdGross)}</p>
          </div>
          <div>
            <p className="text-muted">YTD Net</p>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald">{fmt(ytdNet)}</p>
          </div>
          <div>
            <p className="text-muted">YTD Tax</p>
            <p className="text-sm font-bold text-rose-600 dark:text-rose">{fmt(ytdTax)}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-12">
        {/* Month List */}
        <div className="lg:col-span-3">
          <div className="card overflow-hidden">
            <div className="p-4 divider">
              <p className="section-title">Select Period</p>
            </div>
            <div className="p-2">
              {monthLabels.map((label, idx) => (
                <button
                  key={payslips[idx].id}
                  onClick={() => setActiveIdx(idx)}
                  className={`w-full rounded-lg px-4 py-2.5 text-left text-sm transition-colors ${
                    activeIdx === idx
                      ? "bg-primary-600 font-semibold text-white"
                      : "border border-gray-3 text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Payslip Document */}
        <div className="lg:col-span-9">
          <div className="card overflow-hidden">
            {/* Payslip Header */}
            <div className="divider bg-gray-1 p-6 dark:bg-dark-3">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-dark dark:text-white">Your Organisation</h2>
                  <p className="text-muted">Payroll document</p>
                </div>
                <div className="text-right">
                  <p className="text-body-medium">PAYSLIP</p>
                  <p className="text-muted">
                    {MONTH_NAMES[active.payrollRun.month]} {active.payrollRun.year}
                  </p>
                  <p className="text-muted">
                    Status:{" "}
                    <span className="font-semibold capitalize">{active.payrollRun.status.toLowerCase()}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Period label */}
              <div>
                <p className="text-muted">
                  Pay Period:{" "}
                  <span className="font-semibold text-dark dark:text-white">
                    {MONTH_NAMES[active.payrollRun.month]} {active.payrollRun.year}
                  </span>
                </p>
              </div>

              {/* Earnings & Deductions side by side */}
              <div className="grid gap-5 md:grid-cols-2">
                {/* Earnings */}
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Earnings</p>
                  <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="thead-row">
                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Component</th>
                        <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="tr-body">
                        <td className="px-3 py-2 text-dark dark:text-white">Basic Salary</td>
                        <td className="px-3 py-2 text-right font-medium text-emerald-dark dark:text-emerald">{fmt(active.basicSalary)}</td>
                      </tr>
                      <tr className="tr-body">
                        <td className="px-3 py-2 text-dark dark:text-white">HRA</td>
                        <td className="px-3 py-2 text-right font-medium text-emerald-dark dark:text-emerald">{fmt(active.hra)}</td>
                      </tr>
                      <tr className="tr-body">
                        <td className="px-3 py-2 text-dark dark:text-white">Allowances</td>
                        <td className="px-3 py-2 text-right font-medium text-emerald-dark dark:text-emerald">{fmt(active.allowances)}</td>
                      </tr>
                      <tr className="thead-row">
                        <td className="px-3 py-2 text-sm font-bold text-dark dark:text-white">Gross Earnings</td>
                        <td className="px-3 py-2 text-right text-sm font-bold text-dark dark:text-white">{fmt(active.grossPay)}</td>
                      </tr>
                    </tbody>
                  </table>
                  </div>
                </div>

                {/* Deductions */}
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Deductions</p>
                  <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="thead-row">
                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Component</th>
                        <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="tr-body">
                        <td className="px-3 py-2 text-dark dark:text-white">Provident Fund</td>
                        <td className="px-3 py-2 text-right font-medium text-rose-dark dark:text-rose">{fmt(active.pfDeduction)}</td>
                      </tr>
                      <tr className="tr-body">
                        <td className="px-3 py-2 text-dark dark:text-white">Income Tax (TDS)</td>
                        <td className="px-3 py-2 text-right font-medium text-rose-dark dark:text-rose">{fmt(active.taxDeduction)}</td>
                      </tr>
                      {active.otherDeductions > 0 && (
                        <tr className="tr-body">
                          <td className="px-3 py-2 text-dark dark:text-white">Other Deductions</td>
                          <td className="px-3 py-2 text-right font-medium text-rose-dark dark:text-rose">{fmt(active.otherDeductions)}</td>
                        </tr>
                      )}
                      <tr className="thead-row">
                        <td className="px-3 py-2 text-sm font-bold text-dark dark:text-white">Total Deductions</td>
                        <td className="px-3 py-2 text-right text-sm font-bold text-rose-dark dark:text-rose">{fmt(totalDeductions)}</td>
                      </tr>
                    </tbody>
                  </table>
                  </div>
                </div>
              </div>

              {/* Net Pay */}
              <div className="rounded-xl border-2 border-primary-600 bg-primary-50 p-5 dark:bg-primary-900/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted">Net Pay (Take Home)</p>
                    <p className="text-3xl font-bold text-dark dark:text-white mt-1">{fmt(active.netPay)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted">Pay Period</p>
                    <p className="text-body-medium">
                      {MONTH_NAMES[active.payrollRun.month]} {active.payrollRun.year}
                    </p>
                    <p className="text-muted mt-1">Mode: Bank Transfer</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 divider pt-4">
                <button
                  onClick={() => setToast(`Downloading ${monthLabels[activeIdx]} payslip PDF...`)}
                  className="btn-primary flex items-center gap-2"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download PDF
                </button>
                <button
                  onClick={() => typeof window !== "undefined" && window.print()}
                  className="btn-secondary flex items-center gap-2"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Toast message={toast} />
    </div>
  );
}
