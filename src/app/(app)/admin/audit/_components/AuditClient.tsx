"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";
import type { AuditLog } from "@prisma/client";

const EVENT_TYPES = ["All", "employee", "leave", "payroll", "auth", "system"] as const;

const severityColors: Record<string, string> = {
  Info: "rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300",
  Warning: "rounded-full bg-amber-light px-2.5 py-0.5 text-xs font-medium text-amber-dark",
  Error: "rounded-full bg-rose-light px-2.5 py-0.5 text-xs font-medium text-rose-dark",
  Critical: "rounded-full bg-rose-600 px-2.5 py-0.5 text-xs font-medium text-white",
};

interface Props {
  logs: AuditLog[];
  from: string;
  to: string;
  type: string;
}

export function AuditClient({ logs, from, to, type }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const [fromDate, setFromDate] = useState(from);
  const [toDate, setToDate] = useState(to);
  const [activeFilter, setActiveFilter] = useState(type);
  const { toast, setToast } = useToast();

  function applyFilters(newFrom: string, newTo: string, newType: string) {
    const params = new URLSearchParams({ from: newFrom, to: newTo, type: newType });
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  function handleDateChange(field: "from" | "to", value: string) {
    if (field === "from") {
      setFromDate(value);
      applyFilters(value, toDate, activeFilter);
    } else {
      setToDate(value);
      applyFilters(fromDate, value, activeFilter);
    }
  }

  function handleTypeFilter(t: string) {
    setActiveFilter(t);
    applyFilters(fromDate, toDate, t);
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-dark dark:text-white">Audit Logs</h1>
          <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">
            Complete activity trail — {logs.length} event{logs.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => handleDateChange("from", e.target.value)}
            className="h-9 rounded-lg border border-gray-3 bg-gray-2 px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
          />
          <span className="text-xs text-dark-5 dark:text-dark-6">to</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => handleDateChange("to", e.target.value)}
            className="h-9 rounded-lg border border-gray-3 bg-gray-2 px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
          />
          <button
            onClick={() => setToast("Audit log exported!")}
            className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
        </div>
      </div>

      {/* Event Type Filter */}
      <div className="flex flex-wrap gap-2">
        {EVENT_TYPES.map((t) => (
          <button
            key={t}
            onClick={() => handleTypeFilter(t)}
            className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors ${
              activeFilter === t
                ? "bg-primary-600 text-white"
                : "border border-gray-3 bg-white text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-dark-6"
            }`}
          >
            {t === "All" ? "All" : t}
          </button>
        ))}
      </div>

      {/* Audit Table */}
      <div className="rounded-xl bg-white shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-1 dark:bg-dark-3">
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Timestamp</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">User</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Action</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Resource</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">IP Address</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Severity</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-dark-5 dark:text-dark-6">
                    No audit events found for the selected period
                  </td>
                </tr>
              )}
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-gray-3 dark:border-dark-3 hover:bg-gray-1 dark:hover:bg-dark-3">
                  <td className="px-5 py-3.5 font-mono text-xs text-dark-5 dark:text-dark-6 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                  </td>
                  <td className="px-5 py-3.5 font-medium text-dark dark:text-white whitespace-nowrap">
                    {log.userEmail}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-dark dark:text-white">{log.action}</span>
                  </td>
                  <td className="px-5 py-3.5 text-dark-5 dark:text-dark-6">{log.resource}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-dark-5 dark:text-dark-6">
                    {log.ipAddress ?? "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={severityColors[log.severity] ?? severityColors.Info}>
                      {log.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Toast message={toast} />
    </div>
  );
}
