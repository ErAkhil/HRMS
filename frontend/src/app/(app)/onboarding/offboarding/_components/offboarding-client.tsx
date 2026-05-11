"use client";

import { useState } from "react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";
import { OffboardingCard, type OffboardingRecord } from "./offboarding-card";
import { NewOffboardingModal } from "./new-offboarding-modal";

interface OffboardingStats {
  exitingThisMonth: number;
  assetsPending: number;
  exitInterviews: number;
  completed: number;
}

interface Props {
  records: OffboardingRecord[];
  stats: OffboardingStats;
}

export function OffboardingClient({ records, stats }: Readonly<Props>) {
  const [showModal, setShowModal] = useState(false);
  const { toast, setToast } = useToast();

  const summaryStats = [
    { label: "Exiting This Month", value: String(stats.exitingThisMonth), color: "text-rose-dark" },
    { label: "Assets Pending", value: String(stats.assetsPending), color: "text-amber-dark" },
    { label: "Exit Interviews", value: String(stats.exitInterviews), color: "text-sky-dark" },
    { label: "Completed", value: String(stats.completed), color: "text-emerald-dark" },
  ];

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
            onViewDetails={() => setToast("Opening offboarding details...")}
            onSendReminder={() => setToast("Reminder sent to employee!")}
          />
        ))}
      </div>

      {showModal && (
        <NewOffboardingModal
          onClose={() => setShowModal(false)}
          onSubmit={() => { setShowModal(false); setToast("Offboarding process initiated!"); }}
        />
      )}

      <Toast message={toast} />
    </div>
  );
}
