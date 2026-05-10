"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";
import Link from "next/link";
import { ScoreCard } from "./score-card";
import { GoalsList } from "./goals-list";
import { ReviewsTab } from "./tabs/reviews-tab";
import { TeamTab } from "./tabs/team-tab";
import { AnalyticsTab } from "./tabs/analytics-tab";
import { ScheduleReviewModal } from "./schedule-review-modal";
import { SetGoalModal } from "./set-goal-modal";

type Tab = "goals" | "reviews" | "team" | "analytics";

const TABS: { id: Tab; label: string }[] = [
  { id: "goals", label: "Goals" },
  { id: "reviews", label: "Reviews" },
  { id: "team", label: "Team" },
  { id: "analytics", label: "Analytics" },
];

type GoalItem = {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  progress: number;
  dueDate?: Date | null;
  category?: string | null;
};

interface PerformancePageClientProps {
  goals: GoalItem[];
}

export function PerformancePageClient({ goals }: PerformancePageClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>("goals");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const { toast, setToast } = useToast();

  const totalGoals = goals.length;
  const completedGoals = goals.filter((g) => g.status === "COMPLETED").length;
  const inProgressGoals = goals.filter((g) => g.status === "IN_PROGRESS").length;
  const completionPct = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  return (
    <div className="page-container">
      <nav className="flex items-center gap-1.5 text-xs text-dark-5 dark:text-dark-6">
        <Link href="/" className="hover:text-dark dark:hover:text-white transition-colors">Dashboard</Link>
        <span>/</span>
        <span className="text-dark dark:text-white font-medium">Performance</span>
      </nav>

      <div className="page-header">
        <div>
          <h1 className="page-title">Performance</h1>
          <p className="mt-0.5 text-muted text-sm">Track goals, reviews, and team performance</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowReviewModal(true)} className="btn-secondary">Schedule Review</button>
          <button onClick={() => setShowGoalModal(true)} className="btn-primary">Set New Goal</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="card-p">
          <p className="text-muted">My Score</p>
          <div className="mt-2 flex items-end gap-1">
            <span className="text-3xl font-bold text-indigo-600">87</span>
            <span className="mb-1 text-muted">/ 100</span>
          </div>
          <span className="mt-1 badge-indigo">Q2 2026</span>
        </div>
        <div className="card-p">
          <p className="text-muted">Goals Completed</p>
          <div className="mt-2 flex items-end gap-1">
            <span className="text-3xl font-bold text-emerald-600">{completedGoals}</span>
            <span className="mb-1 text-muted">/ {totalGoals}</span>
          </div>
          <span className="mt-1 badge-success">{completionPct}% this quarter</span>
        </div>
        <div className="card-p">
          <p className="text-muted">Next Review</p>
          <div className="mt-2"><span className="text-3xl font-bold text-violet-600">June 15</span></div>
          <span className="mt-1 badge-ai">in 39 days</span>
        </div>
        <div className="card-p">
          <p className="text-muted">Team Avg Score</p>
          <div className="mt-2 flex items-end gap-1">
            <span className="text-3xl font-bold text-amber-600">82</span>
            <span className="mb-1 text-muted">/ 100</span>
          </div>
          <span className="mt-1 badge-warning">↑ 3pts vs Q1</span>
        </div>
      </div>

      <div className="border-b border-gray-3 dark:border-dark-3 flex gap-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-b-2 border-transparent text-dark-5 hover:text-dark dark:text-dark-6 dark:hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "goals" && (
        <div className="space-y-5">
          <ScoreCard />
          <GoalsList goals={goals} />
        </div>
      )}
      {activeTab === "reviews" && <ReviewsTab />}
      {activeTab === "team" && <TeamTab />}
      {activeTab === "analytics" && <AnalyticsTab />}

      {showReviewModal && (
        <ScheduleReviewModal
          onClose={() => setShowReviewModal(false)}
          onSubmit={(e) => { e.preventDefault(); setShowReviewModal(false); setToast("Review scheduled successfully!"); }}
        />
      )}
      {showGoalModal && (
        <SetGoalModal
          onClose={() => setShowGoalModal(false)}
          onSubmit={(e) => { e.preventDefault(); setShowGoalModal(false); setToast("Goal created successfully!"); }}
        />
      )}

      <Toast message={toast} />
    </div>
  );
}
