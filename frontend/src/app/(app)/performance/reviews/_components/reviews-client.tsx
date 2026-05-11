"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";

type Review = {
  id: string;
  revieweeName: string;
  revieweeTitle: string;
  revieweeDept: string;
  reviewerName: string;
  period: string;
  type: string;
  score: number | null;
  status: string;
  completedAt: string | null;
};

const STATUS_BADGE: Record<string, string> = {
  PENDING: "rounded-full bg-amber-light px-2.5 py-0.5 text-xs font-medium text-amber-dark",
  IN_PROGRESS: "rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-dark dark:bg-sky-dark/10 dark:text-sky",
  COMPLETED: "rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
};

export function ReviewsClient({ reviews }: Readonly<{ reviews: Review[] }>) {
  const router = useRouter();
  const { toast, setToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [cycleName, setCycleName] = useState("");
  const [reviewType, setReviewType] = useState("Quarterly");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filtered = reviews.filter((r) => filterStatus === "All" || r.status === filterStatus);
  const pending = reviews.filter((r) => r.status === "PENDING").length;
  const completed = reviews.filter((r) => r.status === "COMPLETED").length;
  const avgScore = reviews.filter((r) => r.score !== null).length > 0
    ? Math.round(reviews.filter((r) => r.score !== null).reduce((s, r) => s + (r.score ?? 0), 0) / reviews.filter((r) => r.score !== null).length)
    : 0;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Performance Reviews</h1>
          <p className="text-muted mt-0.5">Manage review cycles and track progress</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary"
        >
          + New Review Cycle
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Reviews", value: reviews.length, color: "text-primary-600 dark:text-primary-300" },
          { label: "Pending", value: pending, color: "text-amber-dark" },
          { label: "Completed", value: completed, color: "text-emerald-dark dark:text-emerald" },
          { label: "Avg Score", value: avgScore > 0 ? `${avgScore}/100` : "—", color: "text-violet-dark dark:text-violet-300" },
        ].map((s) => (
          <div key={s.label} className="card-p">
            <p className="stat-label">{s.label}</p>
            <p className={`mt-1 text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Active cycle banner */}
      <div className="rounded-xl p-6 text-white" style={{ background: "linear-gradient(135deg, #4F46E5, #8B5CF6)" }}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white">Active</span>
            <h2 className="mt-1 text-xl font-bold text-white">Q2 2026 Performance Review</h2>
            <p className="mt-1 text-sm text-white/70">May 1 – May 31, 2026</p>
          </div>
          <button
            onClick={() => router.push("/performance")}
            className="self-start rounded-lg bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/30"
          >
            View My Review
          </button>
        </div>
        <div className="mt-4">
          <div className="mb-1.5 flex justify-between">
            <span className="text-sm text-white/80">Overall Completion</span>
            <span className="text-sm font-bold text-white">{reviews.length > 0 ? Math.round((completed / reviews.length) * 100) : 0}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/20">
            <div className="h-full rounded-full bg-white" style={{ width: `${reviews.length > 0 ? Math.round((completed / reviews.length) * 100) : 0}%` }} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="page-header border-b border-gray-3 px-5 py-4 dark:border-dark-3">
          <h2 className="section-title">All Reviews</h2>
          <div className="flex gap-2">
            {["All", "PENDING", "COMPLETED"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  filterStatus === s
                    ? "bg-primary-600 text-white"
                    : "border border-gray-3 text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6"
                }`}
              >
                {s === "All" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="thead-row">
                <th className="th">Employee</th>
                <th className="th">Period</th>
                <th className="th">Reviewer</th>
                <th className="th">Score</th>
                <th className="th">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="td py-10 text-center text-dark-5 dark:text-dark-6">No reviews found.</td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="tr-body">
                    <td className="td">
                      <p className="text-body-medium">{r.revieweeName}</p>
                      <p className="text-muted">{r.revieweeTitle} · {r.revieweeDept}</p>
                    </td>
                    <td className="td text-dark-5 dark:text-dark-6">{r.period}</td>
                    <td className="td text-dark-5 dark:text-dark-6">{r.reviewerName}</td>
                    <td className="td">
                      {r.score !== null ? (
                        <>
                          <span className="font-semibold text-dark dark:text-white">{r.score}</span>
                          <span className="text-dark-5 dark:text-dark-6">/100</span>
                        </>
                      ) : (
                        <span className="text-dark-5 dark:text-dark-6">—</span>
                      )}
                    </td>
                    <td className="td">
                      <span className={STATUS_BADGE[r.status] ?? STATUS_BADGE.PENDING}>{r.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-panel w-full max-w-md p-6">
            <div className="modal-header mb-5 flex items-center justify-between">
              <h2 className="section-title">Create Review Cycle</h2>
              <button onClick={() => setShowModal(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none"><path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label-field mb-1.5">Cycle Name</label>
                <input type="text" value={cycleName} onChange={(e) => setCycleName(e.target.value)} placeholder="e.g. Q3 2026 Review" className="input-field h-9 w-full" />
              </div>
              <div>
                <label className="label-field mb-1.5">Type</label>
                <select value={reviewType} onChange={(e) => setReviewType(e.target.value)} className="input-field h-9 w-full">
                  <option value="Annual">Annual</option>
                  <option value="Mid-year">Mid-year</option>
                  <option value="Quarterly">Quarterly</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-field mb-1.5">Start Date</label>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input-field h-9 w-full" />
                </div>
                <div>
                  <label className="label-field mb-1.5">End Date</label>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input-field h-9 w-full" />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={() => { setShowModal(false); setToast("Review cycle created!"); router.refresh(); }} className="btn-primary">Create</button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toast} />
    </div>
  );
}
