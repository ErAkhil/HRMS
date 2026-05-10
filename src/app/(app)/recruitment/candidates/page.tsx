"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";
import { candidates, stageBadge, sourceBadge } from "./_data/candidates-data";
import { AiScoreBar } from "./_components/ai-score-bar";
import { AddCandidateModal } from "./_components/add-candidate-modal";

export default function CandidatesPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeSource, setActiveSource] = useState("All");
  const { toast, setToast } = useToast();

  function handleAddCandidate() {
    setShowAddModal(false);
    setToast("Candidate added successfully!");
  }

  const sources = ["All", "LinkedIn", "Indeed", "Referral", "Direct"];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="flex items-center gap-2 text-muted mb-1">
            <Link href="/recruitment" className="hover:text-primary-600">Recruitment</Link>
            <span>/</span>
            <span>Candidates</span>
          </div>
          <h1 className="page-title">All Candidates</h1>
          <p className="text-muted">12 candidates across all stages</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Candidate
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          placeholder="Search candidates..."
          className="h-9 rounded-lg border border-gray-3 bg-white px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:placeholder-dark-6"
        />
        {sources.map((src) => (
          <button
            key={src}
            onClick={() => setActiveSource(src)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              activeSource === src
                ? "bg-indigo-600 text-white"
                : "border border-gray-3 text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6"
            }`}
          >
            {src}
          </button>
        ))}
        <select className="ml-auto h-9 rounded-lg border border-gray-3 bg-white px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-2 dark:text-white">
          <option>All Stages</option>
          <option>Applied</option>
          <option>Screening</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Hired</option>
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="thead-row">
                <th className="th">Name</th>
                <th className="th">Position</th>
                <th className="th">Source</th>
                <th className="th">AI Score</th>
                <th className="th">Stage</th>
                <th className="th">Applied</th>
                <th className="th">Action</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((c) => (
                <tr key={c.id} className="tr-body">
                  <td className="td">
                    <div className="flex items-center gap-3">
                      <Image src={c.avatar} alt={c.name} width={36} height={36} className="rounded-full object-cover" />
                      <span className="text-body-medium">{c.name}</span>
                    </div>
                  </td>
                  <td className="td text-muted max-w-[160px] truncate">{c.position}</td>
                  <td className="td">
                    <span className={sourceBadge[c.source]}>{c.source}</span>
                  </td>
                  <td className="td">
                    <AiScoreBar score={c.aiScore} />
                  </td>
                  <td className="td">
                    <span className={stageBadge[c.stage]}>{c.stage}</span>
                  </td>
                  <td className="td text-muted">{c.appliedDate}</td>
                  <td className="td">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setToast("Opening candidate profile...")}
                        className="btn-secondary px-3 py-1.5 text-xs"
                      >
                        View
                      </button>
                      <button
                        onClick={() => setToast("Candidate stage updated!")}
                        className="btn-secondary px-3 py-1.5 text-xs"
                      >
                        Move
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <AddCandidateModal onClose={() => setShowAddModal(false)} onAdd={handleAddCandidate} />
      )}

      <Toast message={toast} />
    </div>
  );
}
