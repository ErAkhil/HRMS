"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";
import { submitClaim, approveClaim } from "@/lib/actions/reimbursements";

type ClaimItem = {
  id: string;
  employeeName: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  status: string;
};

const STATUS_BADGE: Record<string, string> = {
  PENDING: "rounded-full bg-amber-light px-2.5 py-0.5 text-xs font-medium text-amber-dark",
  APPROVED: "rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  REJECTED: "rounded-full bg-rose-light px-2.5 py-0.5 text-xs font-medium text-rose-dark",
};

const CATEGORY_COLOR: Record<string, string> = {
  TRAVEL: "rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-dark dark:bg-sky-dark/10 dark:text-sky",
  MEALS: "rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  EQUIPMENT: "rounded-full bg-violet-light px-2.5 py-0.5 text-xs font-medium text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300",
  MEDICAL: "rounded-full bg-rose-light px-2.5 py-0.5 text-xs font-medium text-rose-dark",
  TRAINING: "rounded-full bg-amber-light px-2.5 py-0.5 text-xs font-medium text-amber-dark",
  OTHER: "rounded-full bg-gray-2 px-2.5 py-0.5 text-xs font-medium text-dark-5 dark:bg-dark-3 dark:text-dark-6",
};

export function ReimbursementsClient({
  claims,
  isAdmin,
  pendingTotal,
  approvedTotal,
}: Readonly<{
  claims: ClaimItem[];
  isAdmin: boolean;
  pendingTotal: number;
  approvedTotal: number;
}>) {
  const router = useRouter();
  const { toast, setToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [form, setForm] = useState({ category: "TRAVEL", amount: "", date: "", description: "" });
  const [submitting, setSubmitting] = useState(false);

  const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const filtered = claims.filter((c) => {
    const catMatch = filterCategory === "All" || c.category === filterCategory;
    const statusMatch = filterStatus === "All" || c.status === filterStatus;
    return catMatch && statusMatch;
  });

  async function handleSubmit() {
    if (!form.amount || !form.date || !form.description) {
      setToast("Please fill all required fields");
      return;
    }
    setSubmitting(true);
    try {
      await submitClaim({ category: form.category as "TRAVEL" | "MEALS" | "EQUIPMENT" | "MEDICAL" | "TRAINING" | "OTHER", amount: Number(form.amount), date: form.date, description: form.description });
      setShowModal(false);
      setForm({ category: "TRAVEL", amount: "", date: "", description: "" });
      setToast("Claim submitted successfully!");
      router.refresh();
    } catch {
      setToast("Failed to submit claim. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleApprove(id: string) {
    try {
      await approveClaim(id);
      setToast("Claim approved!");
      router.refresh();
    } catch {
      setToast("Failed to approve claim.");
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-dark dark:text-white">Reimbursements</h1>
          <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">Expense claims · Live data</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Submit Claim
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Pending Claims", value: claims.filter((c) => c.status === "PENDING").length, sub: `₹${pendingTotal.toLocaleString("en-IN")} awaiting review`, color: "text-amber-dark", bg: "bg-amber-light dark:bg-amber-dark/20", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
          { label: "Approved", value: claims.filter((c) => c.status === "APPROVED").length, sub: `₹${approvedTotal.toLocaleString("en-IN")} approved`, color: "text-emerald-dark dark:text-emerald", bg: "bg-emerald-light dark:bg-emerald-dark/20", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
          { label: "Total Claims", value: claims.length, sub: "All time", color: "text-indigo-600 dark:text-indigo-300", bg: "bg-indigo-50 dark:bg-indigo-900/20", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-dark-5 dark:text-dark-6">{s.label}</p>
                <p className="mt-1 text-2xl font-bold text-dark dark:text-white">{s.value}</p>
                <p className={`mt-0.5 text-xs ${s.color}`}>{s.sub}</p>
              </div>
              <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.bg}`}>
                <svg className={`h-5 w-5 ${s.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} />
                </svg>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl bg-white shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-3 p-5 dark:border-dark-3">
          <h3 className="text-sm font-semibold text-dark dark:text-white">All Claims</h3>
          <div className="flex items-center gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="h-9 rounded-lg border border-gray-3 bg-gray-2 px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
            >
              <option value="All">All Categories</option>
              <option value="TRAVEL">Travel</option>
              <option value="MEALS">Meals</option>
              <option value="EQUIPMENT">Equipment</option>
              <option value="MEDICAL">Medical</option>
              <option value="TRAINING">Training</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-9 rounded-lg border border-gray-3 bg-gray-2 px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
            >
              <option value="All">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-dark-5 dark:text-dark-6">No claims found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-1 dark:bg-dark-3">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Employee</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Category</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-dark-5 dark:text-dark-6">Amount</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Date</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Description</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Status</th>
                  {isAdmin && <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Action</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map((claim) => (
                  <tr key={claim.id} className="border-b border-gray-3 last:border-0 hover:bg-gray-1 dark:border-dark-3 dark:hover:bg-dark-3">
                    <td className="px-5 py-3 font-medium text-dark dark:text-white">{claim.employeeName}</td>
                    <td className="px-5 py-3">
                      <span className={CATEGORY_COLOR[claim.category] ?? CATEGORY_COLOR.OTHER}>
                        {claim.category.charAt(0) + claim.category.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-dark dark:text-white">
                      ₹{claim.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-5 py-3 text-dark-5 dark:text-dark-6">
                      {new Date(claim.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3 max-w-[200px] truncate text-dark-5 dark:text-dark-6" title={claim.description}>
                      {claim.description}
                    </td>
                    <td className="px-5 py-3">
                      <span className={STATUS_BADGE[claim.status] ?? STATUS_BADGE.PENDING}>{claim.status}</span>
                    </td>
                    {isAdmin && (
                      <td className="px-5 py-3">
                        {claim.status === "PENDING" && (
                          <button
                            onClick={() => handleApprove(claim.id)}
                            className="rounded-lg bg-emerald-light px-3 py-1.5 text-xs font-medium text-emerald-dark hover:bg-emerald-100 dark:bg-emerald-dark/20 dark:text-emerald"
                          >
                            Approve
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Submit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-dark-2 dark:border dark:border-dark-3">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-dark dark:text-white">Submit Reimbursement Claim</h3>
              <button onClick={() => setShowModal(false)} className="text-dark-5 hover:text-dark dark:text-dark-6">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-dark dark:text-white">Category</label>
                <select value={form.category} onChange={(e) => update("category", e.target.value)} className="h-9 w-full rounded-lg border border-gray-3 bg-gray-2 px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white">
                  <option value="TRAVEL">Travel</option>
                  <option value="MEALS">Meals</option>
                  <option value="EQUIPMENT">Equipment</option>
                  <option value="MEDICAL">Medical</option>
                  <option value="TRAINING">Training</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-dark dark:text-white">Amount (₹)</label>
                <input type="number" placeholder="Enter amount" value={form.amount} onChange={(e) => update("amount", e.target.value)} className="h-9 w-full rounded-lg border border-gray-3 bg-gray-2 px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white dark:placeholder-dark-6" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-dark dark:text-white">Date</label>
                <input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} className="h-9 w-full rounded-lg border border-gray-3 bg-gray-2 px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-dark dark:text-white">Description</label>
                <textarea rows={3} placeholder="Describe the expense..." value={form.description} onChange={(e) => update("description", e.target.value)} className="w-full resize-none rounded-lg border border-gray-3 bg-gray-2 px-3 py-2 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white dark:placeholder-dark-6" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="flex-1 rounded-lg border border-gray-3 py-2 text-sm font-medium text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6">Cancel</button>
                <button onClick={handleSubmit} disabled={submitting} className="flex-1 rounded-lg bg-primary-600 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60">
                  {submitting ? "Submitting..." : "Submit Claim"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Toast message={toast} />
    </div>
  );
}
