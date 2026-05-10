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
  PENDING: "badge-warning",
  APPROVED: "badge-success",
  REJECTED: "badge-error",
};

const CATEGORY_COLOR: Record<string, string> = {
  TRAVEL: "badge-info",
  MEALS: "badge-success",
  EQUIPMENT: "badge-indigo",
  MEDICAL: "badge-error",
  TRAINING: "badge-warning",
  OTHER: "badge-gray",
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
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Reimbursements</h1>
          <p className="mt-0.5 text-muted">Expense claims · Live data</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
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
          <div key={s.label} className="card-p">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted">{s.label}</p>
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
      <div className="card overflow-hidden">
        <div className="page-header divider p-5">
          <h3 className="section-title">All Claims</h3>
          <div className="flex items-center gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input-field h-9"
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
              className="input-field h-9"
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
                <tr className="thead-row">
                  <th className="th">Employee</th>
                  <th className="th">Category</th>
                  <th className="th text-right">Amount</th>
                  <th className="th">Date</th>
                  <th className="th">Description</th>
                  <th className="th">Status</th>
                  {isAdmin && <th className="th">Action</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map((claim) => (
                  <tr key={claim.id} className="tr-body">
                    <td className="td font-medium">{claim.employeeName}</td>
                    <td className="td">
                      <span className={CATEGORY_COLOR[claim.category] ?? CATEGORY_COLOR.OTHER}>
                        {claim.category.charAt(0) + claim.category.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="td text-right font-semibold">
                      ₹{claim.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="td text-dark-5 dark:text-dark-6">
                      {new Date(claim.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="td max-w-[200px] truncate text-dark-5 dark:text-dark-6" title={claim.description}>
                      {claim.description}
                    </td>
                    <td className="td">
                      <span className={STATUS_BADGE[claim.status] ?? STATUS_BADGE.PENDING}>{claim.status}</span>
                    </td>
                    {isAdmin && (
                      <td className="td">
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
        <div className="modal-overlay">
          <div className="modal-panel max-w-md p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="section-title">Submit Reimbursement Claim</h3>
              <button onClick={() => setShowModal(false)} className="text-dark-5 hover:text-dark dark:text-dark-6">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label-field">Category</label>
                <select value={form.category} onChange={(e) => update("category", e.target.value)} className="input-field h-9 w-full">
                  <option value="TRAVEL">Travel</option>
                  <option value="MEALS">Meals</option>
                  <option value="EQUIPMENT">Equipment</option>
                  <option value="MEDICAL">Medical</option>
                  <option value="TRAINING">Training</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="label-field">Amount (₹)</label>
                <input type="number" placeholder="Enter amount" value={form.amount} onChange={(e) => update("amount", e.target.value)} className="input-field h-9 w-full" />
              </div>
              <div>
                <label className="label-field">Date</label>
                <input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} className="input-field h-9 w-full" />
              </div>
              <div>
                <label className="label-field">Description</label>
                <textarea rows={3} placeholder="Describe the expense..." value={form.description} onChange={(e) => update("description", e.target.value)} className="input-field w-full resize-none py-2" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={handleSubmit} disabled={submitting} className="btn-primary flex-1 disabled:opacity-60">
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
