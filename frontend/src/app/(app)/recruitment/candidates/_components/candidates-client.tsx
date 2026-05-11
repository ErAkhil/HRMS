"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";
import { addCandidate } from "@/lib/actions/recruitment";
import type { SerializedCandidate, SerializedJobPosting } from "@/lib/actions/recruitment";

const STAGE_BADGE: Record<string, string> = {
  APPLIED:   "rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-600 dark:bg-primary-900/20 dark:text-primary-300",
  SCREENING: "rounded-full bg-amber-light px-2.5 py-0.5 text-xs font-medium text-amber-dark",
  INTERVIEW: "rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-dark dark:bg-sky-dark/10 dark:text-sky",
  OFFER:     "rounded-full bg-violet-light px-2.5 py-0.5 text-xs font-medium text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300",
  HIRED:     "rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  REJECTED:  "rounded-full bg-rose-light px-2.5 py-0.5 text-xs font-medium text-rose-dark dark:bg-rose-dark/20 dark:text-rose",
};

interface Props {
  candidates: SerializedCandidate[];
  jobs: SerializedJobPosting[];
}

export function CandidatesClient({ candidates, jobs }: Readonly<Props>) {
  const router = useRouter();
  const { toast, setToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [stageFilter, setStageFilter] = useState("All");
  const [isPending, startTransition] = useTransition();

  const stages = ["All", "APPLIED", "SCREENING", "INTERVIEW", "OFFER", "HIRED", "REJECTED"];
  const filtered = stageFilter === "All" ? candidates : candidates.filter((c) => c.stage === stageFilter);

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await addCandidate({
          jobId: fd.get("jobId") as string,
          name: fd.get("name") as string,
          email: fd.get("email") as string,
          phone: (fd.get("phone") as string) || undefined,
          source: (fd.get("source") as string) || undefined,
        });
        setShowModal(false);
        setToast("Candidate added successfully!");
        router.refresh();
      } catch (err) {
        setToast(err instanceof Error ? err.message : "Failed to add candidate");
      }
    });
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <div className="flex items-center gap-2 text-muted mb-1">
            <Link href="/recruitment" className="hover:text-primary-600">Recruitment</Link>
            <span>/</span>
            <span>Candidates</span>
          </div>
          <h1 className="page-title">All Candidates</h1>
          <p className="text-muted">{candidates.length} candidate{candidates.length !== 1 ? "s" : ""} across all stages</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Candidate
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {stages.map((s) => (
          <button
            key={s}
            onClick={() => setStageFilter(s)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              stageFilter === s
                ? "bg-primary-600 text-white"
                : "border border-gray-3 text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6"
            }`}
          >
            {s === "All" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-dark-5 dark:text-dark-6">No candidates found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="thead-row">
                  <th className="th">Name</th>
                  <th className="th">Position</th>
                  <th className="th">Source</th>
                  <th className="th">Stage</th>
                  <th className="th">Applied</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="tr-body">
                    <td className="td">
                      <div>
                        <p className="text-body-medium">{c.name}</p>
                        <p className="text-xs text-dark-5 dark:text-dark-6">{c.email}</p>
                      </div>
                    </td>
                    <td className="td text-muted">{c.jobTitle}</td>
                    <td className="td text-muted">{c.source ?? "—"}</td>
                    <td className="td">
                      <span className={STAGE_BADGE[c.stage] ?? STAGE_BADGE.APPLIED}>
                        {c.stage.charAt(0) + c.stage.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="td text-muted">
                      {new Date(c.appliedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-panel max-w-lg p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-dark dark:text-white">Add Candidate</h2>
              <button onClick={() => setShowModal(false)} className="flex size-8 items-center justify-center rounded-lg text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="label-field">Position <span className="text-rose-500">*</span></label>
                <select name="jobId" required className="input-field">
                  <option value="">Select a position</option>
                  {jobs.filter((j) => j.isActive).map((j) => (
                    <option key={j.id} value={j.id}>{j.title}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-field">Full Name <span className="text-rose-500">*</span></label>
                  <input name="name" type="text" required placeholder="John Doe" className="input-field" />
                </div>
                <div>
                  <label className="label-field">Email <span className="text-rose-500">*</span></label>
                  <input name="email" type="email" required placeholder="john@example.com" className="input-field" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-field">Phone</label>
                  <input name="phone" type="tel" placeholder="+1 234 567 8900" className="input-field" />
                </div>
                <div>
                  <label className="label-field">Source</label>
                  <select name="source" className="input-field">
                    <option value="">Select source</option>
                    {["LinkedIn", "Indeed", "Referral", "Direct", "Other"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={isPending} className="btn-primary disabled:opacity-60">
                  {isPending ? "Adding…" : "Add Candidate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Toast message={toast} />
    </div>
  );
}
