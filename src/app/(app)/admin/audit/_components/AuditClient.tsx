"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";
import type { SerializedAuditLog } from "@/lib/actions/audit";

const EVENT_TYPES = ["All", "employee", "leave", "payroll", "auth", "system"] as const;

const severityColors: Record<string, string> = {
  Info: "badge-ai",
  Warning: "badge-warning",
  Error: "badge-error",
  Critical: "badge-error bg-rose-600 text-white dark:bg-rose-600 dark:text-white",
};

interface Props {
  logs: SerializedAuditLog[];
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
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Audit Logs</h1>
          <p className="mt-0.5 text-muted">
            Complete activity trail — {logs.length} event{logs.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => handleDateChange("from", e.target.value)}
            className="input-field h-9"
          />
          <span className="text-muted">to</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => handleDateChange("to", e.target.value)}
            className="input-field h-9"
          />
          <button
            onClick={() => setToast("Audit log exported!")}
            className="btn-primary flex items-center gap-1.5"
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
                : "btn-secondary"
            }`}
          >
            {t === "All" ? "All" : t}
          </button>
        ))}
      </div>

      {/* Audit Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="thead-row">
                <th className="th">Timestamp</th>
                <th className="th">User</th>
                <th className="th">Action</th>
                <th className="th">Resource</th>
                <th className="th">IP Address</th>
                <th className="th">Severity</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-muted">
                    No audit events found for the selected period
                  </td>
                </tr>
              )}
              {logs.map((log) => (
                <tr key={log.id} className="tr-body">
                  <td className="td font-mono text-xs whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                  </td>
                  <td className="td font-medium whitespace-nowrap">
                    {log.userEmail}
                  </td>
                  <td className="td">
                    <span className="text-body">{log.action}</span>
                  </td>
                  <td className="td text-muted">{log.resource}</td>
                  <td className="td font-mono text-xs text-muted">
                    {log.ipAddress ?? "—"}
                  </td>
                  <td className="td">
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
