"use client";

import Link from "next/link";
import { KanbanColumn } from "./_components/KanbanColumn";

const columns = [
  {
    title: "Applied",
    count: 24,
    headerColor: "bg-indigo-50 dark:bg-indigo-900/20",
    dotColor: "bg-indigo-500",
    candidates: [
      { id: 1, name: "Rahul Gupta", avatar: "/images/user/user-09.png", currentRole: "Frontend Engineer", appliedFor: "Senior React Developer", aiScore: 82, stageInfo: "Applied May 5" },
      { id: 2, name: "Mia Thompson", avatar: "/images/user/user-10.png", currentRole: "UI Developer", appliedFor: "Product Designer", aiScore: 76, stageInfo: "Applied May 6" },
      { id: 3, name: "Carlos Vega", avatar: "/images/user/user-11.png", currentRole: "Full Stack Dev", appliedFor: "Backend Engineer", aiScore: 88, stageInfo: "Applied May 7" },
    ],
  },
  {
    title: "Screening",
    count: 18,
    headerColor: "bg-amber-light dark:bg-amber-dark/10",
    dotColor: "bg-amber-500",
    candidates: [
      { id: 4, name: "Ananya Iyer", avatar: "/images/user/user-12.png", currentRole: "HR Generalist", appliedFor: "HR Business Partner", aiScore: 91, stageInfo: "Phone screen done" },
      { id: 5, name: "Jake Morrison", avatar: "/images/user/user-01.png", currentRole: "Data Scientist", appliedFor: "Senior Data Analyst", aiScore: 85, stageInfo: "Resume reviewed" },
      { id: 6, name: "Fatima Al-Rashid", avatar: "/images/user/user-02.png", currentRole: "Marketing Exec", appliedFor: "Marketing Manager", aiScore: 79, stageInfo: "In screening" },
    ],
  },
  {
    title: "Interview",
    count: 12,
    headerColor: "bg-sky-50 dark:bg-sky-dark/10",
    dotColor: "bg-sky-500",
    candidates: [
      { id: 7, name: "Nathan Brooks", avatar: "/images/user/user-03.png", currentRole: "DevOps Engineer", appliedFor: "Cloud Architect", aiScore: 93, stageInfo: "Interview at 2PM" },
      { id: 8, name: "Yuki Tanaka", avatar: "/images/user/user-04.png", currentRole: "Product Manager", appliedFor: "Sr. Product Manager", aiScore: 87, stageInfo: "Round 2 today" },
      { id: 9, name: "Preet Kaur", avatar: "/images/user/user-05.png", currentRole: "Backend Dev", appliedFor: "Lead Engineer", aiScore: 90, stageInfo: "Tech round pending" },
    ],
  },
  {
    title: "Offer",
    count: 4,
    headerColor: "bg-violet-light dark:bg-violet-dark/10",
    dotColor: "bg-violet-500",
    candidates: [
      { id: 10, name: "Leo Martinez", avatar: "/images/user/user-06.png", currentRole: "Sr. Engineer", appliedFor: "Engineering Lead", aiScore: 94, stageInfo: "Offer sent" },
      { id: 11, name: "Aisha Okonkwo", avatar: "/images/user/user-07.png", currentRole: "Finance Lead", appliedFor: "CFO", aiScore: 89, stageInfo: "Negotiating" },
      { id: 12, name: "David Cheng", avatar: "/images/user/user-08.png", currentRole: "Sales Director", appliedFor: "VP Sales", aiScore: 92, stageInfo: "Counter offer" },
    ],
  },
  {
    title: "Hired",
    count: 8,
    headerColor: "bg-emerald-light dark:bg-emerald-dark/10",
    dotColor: "bg-emerald-500",
    candidates: [
      { id: 13, name: "Sasha Williams", avatar: "/images/user/user-09.png", currentRole: "QA Lead", appliedFor: "QA Manager", aiScore: 88, stageInfo: "Starts Jun 1" },
      { id: 14, name: "Omar Hassan", avatar: "/images/user/user-10.png", currentRole: "ML Engineer", appliedFor: "AI Engineer", aiScore: 95, stageInfo: "Starts May 20" },
      { id: 15, name: "Bea Nguyen", avatar: "/images/user/user-11.png", currentRole: "Content Writer", appliedFor: "Content Lead", aiScore: 83, stageInfo: "Starts Jun 15" },
    ],
  },
];

export default function RecruitmentPage() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-dark dark:text-white">Recruitment Pipeline</h1>
          <p className="text-xs text-dark-5 dark:text-dark-6">
            <span className="inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              12 open positions
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/recruitment/jobs"
            className="rounded-lg border border-gray-3 px-4 py-2 text-sm font-medium text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6"
          >
            View Jobs
          </Link>
          <Link
            href="/recruitment/candidates"
            className="rounded-lg border border-gray-3 px-4 py-2 text-sm font-medium text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6"
          >
            All Candidates
          </Link>
          <button className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Job
          </button>
        </div>
      </div>

      {/* Pipeline Stats Bar */}
      <div className="rounded-xl bg-white p-4 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <div className="flex flex-wrap items-center gap-6">
          {columns.map((col) => (
            <div key={col.title} className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${col.dotColor}`} />
              <span className="text-xs text-dark-5 dark:text-dark-6">{col.title}</span>
              <span className="text-xs font-bold text-dark dark:text-white">{col.count}</span>
            </div>
          ))}
          <div className="ml-auto text-xs text-dark-5 dark:text-dark-6">
            Total: <span className="font-bold text-dark dark:text-white">66 candidates</span>
          </div>
        </div>
        <div className="mt-3 h-2 w-full rounded-full overflow-hidden flex gap-0.5">
          <div className="bg-indigo-500 rounded-l-full" style={{ width: "36%" }} />
          <div className="bg-amber-500" style={{ width: "27%" }} />
          <div className="bg-sky-500" style={{ width: "18%" }} />
          <div className="bg-violet-500" style={{ width: "6%" }} />
          <div className="bg-emerald-500 rounded-r-full" style={{ width: "13%" }} />
        </div>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-4 min-w-max">
          {columns.map((col) => (
            <KanbanColumn key={col.title} {...col} />
          ))}
        </div>
      </div>
    </div>
  );
}
