"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type ClaimStatus = "Pending" | "Approved" | "Rejected";
type ClaimCategory = "Travel" | "Meals" | "Equipment" | "Medical" | "Training";

interface Claim {
  id: number;
  employee: string;
  avatar: string;
  category: ClaimCategory;
  amount: string;
  date: string;
  receipt: boolean;
  status: ClaimStatus;
}

const claims: Claim[] = [
  { id: 1, employee: "Sarah Mitchell", avatar: "/images/user/user-01.png", category: "Travel", amount: "₹8,500", date: "May 3, 2026", receipt: true, status: "Pending" },
  { id: 2, employee: "Daniel Park", avatar: "/images/user/user-02.png", category: "Equipment", amount: "₹22,000", date: "May 2, 2026", receipt: true, status: "Approved" },
  { id: 3, employee: "Priya Sharma", avatar: "/images/user/user-03.png", category: "Meals", amount: "₹3,200", date: "May 5, 2026", receipt: false, status: "Pending" },
  { id: 4, employee: "James Williams", avatar: "/images/user/user-04.png", category: "Travel", amount: "₹15,800", date: "Apr 28, 2026", receipt: true, status: "Approved" },
  { id: 5, employee: "Elena Torres", avatar: "/images/user/user-05.png", category: "Training", amount: "₹12,500", date: "May 1, 2026", receipt: true, status: "Approved" },
  { id: 6, employee: "Arjun Mehta", avatar: "/images/user/user-06.png", category: "Medical", amount: "₹7,200", date: "May 4, 2026", receipt: false, status: "Rejected" },
  { id: 7, employee: "Lisa Chen", avatar: "/images/user/user-07.png", category: "Travel", amount: "₹18,000", date: "May 6, 2026", receipt: true, status: "Pending" },
  { id: 8, employee: "Marcus Johnson", avatar: "/images/user/user-08.png", category: "Equipment", amount: "₹8,800", date: "Apr 30, 2026", receipt: true, status: "Approved" },
];

const statusBadge: Record<ClaimStatus, string> = {
  Pending: "rounded-full bg-amber-light px-2.5 py-0.5 text-xs font-medium text-amber-dark",
  Approved: "rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  Rejected: "rounded-full bg-rose-light px-2.5 py-0.5 text-xs font-medium text-rose-dark",
};

const categoryColor: Record<ClaimCategory, string> = {
  Travel: "rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-dark dark:bg-sky-dark/10 dark:text-sky",
  Meals: "rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  Equipment: "rounded-full bg-violet-light px-2.5 py-0.5 text-xs font-medium text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300",
  Medical: "rounded-full bg-rose-light px-2.5 py-0.5 text-xs font-medium text-rose-dark",
  Training: "rounded-full bg-amber-light px-2.5 py-0.5 text-xs font-medium text-amber-dark",
};

export default function ReimbursementsPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-dark-5 dark:text-dark-6 mb-1">
            <Link href="/payroll" className="hover:text-primary-600">Payroll</Link>
            <span>/</span>
            <span>Reimbursements</span>
          </div>
          <h1 className="text-xl font-bold text-dark dark:text-white">Reimbursements</h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 flex items-center gap-2"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Submit Claim
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-dark-5 dark:text-dark-6">Pending Claims</p>
              <p className="mt-1 text-2xl font-bold text-dark dark:text-white">8</p>
              <p className="mt-0.5 text-xs text-amber-dark">₹42,500 awaiting review</p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-light dark:bg-amber-dark/20">
              <svg className="h-5 w-5 text-amber-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-dark-5 dark:text-dark-6">Approved This Month</p>
              <p className="mt-1 text-2xl font-bold text-dark dark:text-white">12</p>
              <p className="mt-0.5 text-xs text-emerald-dark dark:text-emerald">₹1,18,000 approved</p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-light dark:bg-emerald-dark/20">
              <svg className="h-5 w-5 text-emerald-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-dark-5 dark:text-dark-6">Average Turnaround</p>
              <p className="mt-1 text-2xl font-bold text-dark dark:text-white">3.2 days</p>
              <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">from submission to approval</p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 dark:bg-sky-dark/10">
              <svg className="h-5 w-5 text-sky-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </span>
          </div>
        </div>
      </div>

      {/* Claims Table */}
      <div className="rounded-xl bg-white shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-gray-3 dark:border-dark-3">
          <h3 className="text-sm font-semibold text-dark dark:text-white">All Claims</h3>
          <div className="flex items-center gap-2">
            <select className="h-9 rounded-lg border border-gray-3 bg-gray-2 px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white">
              <option>All Categories</option>
              <option>Travel</option>
              <option>Meals</option>
              <option>Equipment</option>
              <option>Medical</option>
              <option>Training</option>
            </select>
            <select className="h-9 rounded-lg border border-gray-3 bg-gray-2 px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white">
              <option>All Status</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-1 dark:bg-dark-3">
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Employee</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Category</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-dark-5 dark:text-dark-6">Amount</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Date</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-dark-5 dark:text-dark-6">Receipt</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Action</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((claim) => (
                <tr key={claim.id} className="border-b border-gray-3 last:border-0 hover:bg-gray-1 dark:border-dark-3 dark:hover:bg-dark-3">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Image src={claim.avatar} alt={claim.employee} width={36} height={36} className="rounded-full object-cover" />
                      <span className="text-sm font-medium text-dark dark:text-white">{claim.employee}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={categoryColor[claim.category]}>{claim.category}</span>
                  </td>
                  <td className="px-5 py-3 text-right text-sm font-semibold text-dark dark:text-white">{claim.amount}</td>
                  <td className="px-5 py-3 text-sm text-dark-5 dark:text-dark-6">{claim.date}</td>
                  <td className="px-5 py-3 text-center">
                    {claim.receipt ? (
                      <svg className="mx-auto h-4 w-4 text-emerald-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="mx-auto h-4 w-4 text-rose-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <span className={statusBadge[claim.status]}>{claim.status}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button className="rounded-lg border border-gray-3 px-3 py-1.5 text-xs font-medium text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6">
                        View
                      </button>
                      {claim.status === "Pending" && (
                        <button className="rounded-lg bg-emerald-light px-3 py-1.5 text-xs font-medium text-emerald-dark hover:bg-emerald-100 dark:bg-emerald-dark/20 dark:text-emerald">
                          Approve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submit Claim Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-dark-2 dark:border dark:border-dark-3">
            <div className="flex items-center justify-between mb-5">
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
                <select className="h-9 w-full rounded-lg border border-gray-3 bg-gray-2 px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white">
                  <option>Travel</option>
                  <option>Meals</option>
                  <option>Equipment</option>
                  <option>Medical</option>
                  <option>Training</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-dark dark:text-white">Amount (₹)</label>
                <input type="number" placeholder="Enter amount" className="h-9 w-full rounded-lg border border-gray-3 bg-gray-2 px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white dark:placeholder-dark-6" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-dark dark:text-white">Description</label>
                <textarea rows={3} placeholder="Describe the expense..." className="w-full rounded-lg border border-gray-3 bg-gray-2 px-3 py-2 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white dark:placeholder-dark-6 resize-none" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-dark dark:text-white">Upload Receipt</label>
                <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-3 p-4 dark:border-dark-3">
                  <div className="text-center">
                    <svg className="mx-auto h-8 w-8 text-dark-5 dark:text-dark-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">Click to upload or drag & drop</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="flex-1 rounded-lg border border-gray-3 py-2 text-sm font-medium text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6">
                  Cancel
                </button>
                <button className="flex-1 rounded-lg bg-primary-600 py-2 text-sm font-semibold text-white hover:bg-primary-700">
                  Submit Claim
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
