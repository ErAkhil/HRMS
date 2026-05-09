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
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-dark dark:text-white">Performance Reviews</h1>
          <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">Manage review cycles and track progress</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
        >
          + New Review Cycle
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Reviews", value: reviews.length, color: "text-indigo-600 dark:text-indigo-300" },
          { label: "Pending", value: pending, color: "text-amber-dark" },
          { label: "Completed", value: completed, color: "text-emerald-dark dark:text-emerald" },
          { label: "Avg Score", value: avgScore > 0 ? `${avgScore}/100` : "—", color: "text-violet-dark dark:text-violet-300" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-white p-4 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
            <p className="text-xs text-dark-5 dark:text-dark-6">{s.label}</p>
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
      <div className="rounded-xl bg-white shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-3 px-5 py-4 dark:border-dark-3">
          <h2 className="text-sm font-semibold text-dark dark:text-white">All Reviews</h2>
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
              <tr className="bg-gray-1 dark:bg-dark-3">
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Employee</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Period</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Reviewer</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Score</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-dark-5 dark:text-dark-6">No reviews found.</td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="border-b border-gray-3 last:border-0 hover:bg-gray-1 dark:border-dark-3 dark:hover:bg-dark-3">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-dark dark:text-white">{r.revieweeName}</p>
                      <p className="text-xs text-dark-5 dark:text-dark-6">{r.revieweeTitle} · {r.revieweeDept}</p>
                    </td>
                    <td className="px-5 py-3.5 text-dark-5 dark:text-dark-6">{r.period}</td>
                    <td className="px-5 py-3.5 text-dark-5 dark:text-dark-6">{r.reviewerName}</td>
                    <td className="px-5 py-3.5">
                      {r.score !== null ? (
                        <>
                          <span className="font-semibold text-dark dark:text-white">{r.score}</span>
                          <span className="text-dark-5 dark:text-dark-6">/100</span>
                        </>
                      ) : (
                        <span className="text-dark-5 dark:text-dark-6">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-floating dark:bg-dark-2">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-bold text-dark dark:text-white">Create Review Cycle</h2>
              <button onClick={() => setShowModal(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none"><path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-dark dark:text-white">Cycle Name</label>
                <input type="text" value={cycleName} onChange={(e) => setCycleName(e.target.value)} placeholder="e.g. Q3 2026 Review" className="h-9 w-full rounded-lg border border-gray-3 bg-gray-1 px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-dark dark:text-white">Type</label>
                <select value={reviewType} onChange={(e) => setReviewType(e.target.value)} className="h-9 w-full rounded-lg border border-gray-3 bg-gray-1 px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white">
                  <option value="Annual">Annual</option>
                  <option value="Mid-year">Mid-year</option>
                  <option value="Quarterly">Quarterly</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-dark dark:text-white">Start Date</label>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-9 w-full rounded-lg border border-gray-3 bg-gray-1 px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-dark dark:text-white">End Date</label>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-9 w-full rounded-lg border border-gray-3 bg-gray-1 px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white" />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="rounded-lg border border-gray-3 px-4 py-2 text-sm font-medium text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6">Cancel</button>
              <button onClick={() => { setShowModal(false); setToast("Review cycle created!"); router.refresh(); }} className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700">Create</button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toast} />
    </div>
  );
}
