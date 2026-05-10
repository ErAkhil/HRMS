"use client";

import { useState } from "react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";
import { offboardings } from "./_data/offboarding-data";
import { OffboardingCard } from "./_components/offboarding-card";
import { NewOffboardingModal } from "./_components/new-offboarding-modal";

const SUMMARY_STATS = [
  { label: "Exiting This Month", value: "3", color: "text-rose-dark" },
  { label: "Assets Pending", value: "2", color: "text-amber-dark" },
  { label: "Exit Interviews", value: "1/4", color: "text-sky-dark" },
  { label: "Completed", value: "7", color: "text-emerald-dark" },
];

export default function OffboardingPage() {
  const [showModal, setShowModal] = useState(false);
  const { toast, setToast } = useToast();

  function handleSubmit() {
    setShowModal(false);
    setToast("Offboarding process initiated!");
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
            <span className="rounded-full bg-rose-light px-2.5 py-0.5 text-xs font-medium text-rose-dark">4 active</span>
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
        {SUMMARY_STATS.map((stat) => (
          <div key={stat.label} className="card-p">
            <p className="text-muted">{stat.label}</p>
            <p className={`mt-1 text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {offboardings.map((ob) => (
          <OffboardingCard
            key={ob.id}
            ob={ob}
            onViewDetails={() => setToast("Opening offboarding details...")}
            onSendReminder={() => setToast("Reminder sent to employee!")}
          />
        ))}
      </div>

      {showModal && (
        <NewOffboardingModal onClose={() => setShowModal(false)} onSubmit={handleSubmit} />
      )}

      <Toast message={toast} />
    </div>
  );
}
