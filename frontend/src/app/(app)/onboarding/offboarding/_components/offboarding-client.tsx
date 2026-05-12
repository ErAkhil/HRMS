"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";
import { initiateOffboarding, sendOffboardingReminder } from "@/lib/actions/onboarding";
import { OffboardingCard, type OffboardingRecord } from "./offboarding-card";
import { NewOffboardingModal } from "./new-offboarding-modal";
import type { ActiveEmployee } from "@/lib/actions/onboarding";

interface OffboardingStats {
  exitingThisMonth: number;
  assetsPending: number;
  exitInterviews: number;
  completed: number;
}

interface Props {
  records: OffboardingRecord[];
  stats: OffboardingStats;
  activeEmployees: ActiveEmployee[];
}

export function OffboardingClient({ records, stats, activeEmployees }: Readonly<Props>) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [detailRecord, setDetailRecord] = useState<OffboardingRecord | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast, setToast } = useToast();

  const summaryStats = [
    { label: "Exiting This Month", value: String(stats.exitingThisMonth), color: "text-rose-dark" },
    { label: "Assets Pending", value: String(stats.assetsPending), color: "text-amber-dark" },
    { label: "Exit Interviews", value: String(stats.exitInterviews), color: "text-sky-dark" },
    { label: "Completed", value: String(stats.completed), color: "text-emerald-dark" },
  ];

  function handleInitiate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await initiateOffboarding({
          employeeId: fd.get("employeeId") as string,
          lastWorkingDay: fd.get("lastWorkingDay") as string,
          reason: (fd.get("reason") as string) || undefined,
        });
        setShowModal(false);
        setToast("Offboarding process initiated successfully!");
        router.refresh();
      } catch (err) {
        setToast(err instanceof Error ? err.message : "Failed to initiate offboarding");
      }
    });
  }

  function handleSendReminder(employeeId: string) {
    startTransition(async () => {
      try {
        const result = await sendOffboardingReminder(employeeId);
        setToast(result.success ? `Reminder sent to ${result.name}` : "Could not send reminder");
      } catch {
        setToast("Failed to send reminder");
      }
    });
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <div className="flex items-center gap-2 text-muted mb-1">
            <Link href="/onboarding" className="hover:text-primary-600">Onboarding</Link>
            <span>/</span>
            <span>Offboarding</span>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="page-title">Offboarding</h1>
            <span className="rounded-full bg-rose-light px-2.5 py-0.5 text-xs font-medium text-rose-dark">
              {records.length} active
            </span>
          </div>
          <p className="text-muted mt-0.5">Manage employee exit workflows</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Offboarding
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {summaryStats.map((stat) => (
          <div key={stat.label} className="card-p">
            <p className="text-muted">{stat.label}</p>
            <p className={`mt-1 text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {records.length === 0 && (
          <div className="card-p col-span-2 py-10 text-center">
            <p className="text-sm text-dark-5 dark:text-dark-6">
              No active offboarding records in the last 90 days. Initiate a process using &ldquo;New Offboarding&rdquo;.
            </p>
          </div>
        )}
        {records.map((ob) => (
          <OffboardingCard
            key={ob.id}
            ob={ob}
            onViewDetails={() => setDetailRecord(ob)}
            onSendReminder={() => handleSendReminder(ob.id)}
          />
        ))}
      </div>

      {showModal && (
        <NewOffboardingModal
          employees={activeEmployees}
          onClose={() => setShowModal(false)}
          onSubmit={handleInitiate}
          isPending={isPending}
        />
      )}

      {detailRecord && (
        <div className="modal-overlay">
          <div className="modal-panel max-w-md p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-dark dark:text-white">Exit Details</h2>
              <button
                onClick={() => setDetailRecord(null)}
                className="flex size-8 items-center justify-center rounded-lg text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3"
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Employee</span>
                <span className="font-medium text-dark dark:text-white">{detailRecord.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Role</span>
                <span className="text-dark dark:text-white">{detailRecord.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Department</span>
                <span className="text-dark dark:text-white">{detailRecord.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Last Day</span>
                <span className="font-medium text-rose-dark">{detailRecord.lastDay}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Exit Reason</span>
                <span className="text-dark dark:text-white">{detailRecord.reason}</span>
              </div>
              <div className="mt-4 border-t border-gray-3 pt-4 dark:border-dark-3">
                <p className="mb-2 text-xs font-semibold text-dark-5 dark:text-dark-6 uppercase tracking-wide">Exit Checklist</p>
                <div className="space-y-2">
                  {detailRecord.tasks.map((t) => (
                    <div key={t.label} className="flex items-center gap-2">
                      <span className={t.done ? "text-emerald-dark" : "text-dark-5"}>
                        {t.done ? "?" : "?"}
                      </span>
                      <span className={`text-sm ${t.done ? "line-through text-dark-5" : "text-dark dark:text-white"}`}>{t.label}</span>
                      {!t.done && <span className="ml-auto text-xs text-amber-dark">Pending</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <button onClick={() => setDetailRecord(null)} className="btn-secondary">Close</button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toast} />
    </div>
  );
}
