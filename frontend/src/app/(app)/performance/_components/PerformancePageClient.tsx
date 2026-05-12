"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";
import Link from "next/link";
import { createGoal, scheduleReview } from "@/lib/actions/performance";
import { ScoreCard } from "./score-card";
import { GoalsList } from "./goals-list";
import { ReviewsTab } from "./tabs/reviews-tab";
import { TeamTab } from "./tabs/team-tab";
import { AnalyticsTab } from "./tabs/analytics-tab";
import { ScheduleReviewModal } from "./schedule-review-modal";
import type { SerializedGoal, SerializedReview, TeamPerformanceSummary } from "@/lib/actions/performance";

type Tab = "goals" | "reviews" | "team" | "analytics";

const TABS: { id: Tab; label: string }[] = [
  { id: "goals", label: "Goals" },
  { id: "reviews", label: "Reviews" },
  { id: "team", label: "Team" },
  { id: "analytics", label: "Analytics" },
];

interface PerformancePageClientProps {
  goals: SerializedGoal[];
  reviews: SerializedReview[];
  teamData: TeamPerformanceSummary | null;
}

export function PerformancePageClient({ goals: initialGoals, reviews, teamData }: PerformancePageClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("goals");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goals, setGoals] = useState(initialGoals);
  const [isPending, startTransition] = useTransition();
  const { toast, setToast } = useToast();

  useEffect(() => { setGoals(initialGoals); }, [initialGoals]);

  const totalGoals = goals.length;
  const completedGoals = goals.filter((g) => g.status === "COMPLETED").length;
  const completionPct = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
  const latestScore = reviews.find((r) => r.score !== null)?.score ?? null;
  const latestReview = reviews[0];

  function handleCreateGoal(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await createGoal({
          title: fd.get("title") as string,
          description: (fd.get("description") as string) || undefined,
          dueDate: (fd.get("dueDate") as string) || undefined,
        });
        setShowGoalModal(false);
        setToast("Goal created successfully!");
        router.refresh();
      } catch (err) {
        setToast(err instanceof Error ? err.message : "Failed to create goal");
      }
    });
  }

  return (
    <div className="page-container">
      <nav className="flex items-center gap-1.5 text-xs text-dark-5 dark:text-dark-6">
        <Link href="/dashboard" className="hover:text-dark dark:hover:text-white transition-colors">Dashboard</Link>
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
            <span className="text-3xl font-bold text-primary-600">{latestScore ?? "—"}</span>
            {latestScore && <span className="mb-1 text-muted">/ 100</span>}
          </div>
          <span className="mt-1 badge-ai">
            {latestReview ? new Date(latestReview.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "No review yet"}
          </span>
        </div>
        <div className="card-p">
          <p className="text-muted">Goals Completed</p>
          <div className="mt-2 flex items-end gap-1">
            <span className="text-3xl font-bold text-emerald-600">{completedGoals}</span>
            <span className="mb-1 text-muted">/ {totalGoals}</span>
          </div>
          <span className="mt-1 badge-success">{completionPct}% completion rate</span>
        </div>
        <div className="card-p">
          <p className="text-muted">Reviews Done</p>
          <div className="mt-2">
            <span className="text-3xl font-bold text-violet-600">{reviews.filter((r) => r.status === "COMPLETED").length}</span>
          </div>
          <span className="mt-1 badge-ai">{reviews.length} total</span>
        </div>
        <div className="card-p">
          <p className="text-muted">In Progress Goals</p>
          <div className="mt-2 flex items-end gap-1">
            <span className="text-3xl font-bold text-amber-600">{goals.filter((g) => g.status === "IN_PROGRESS").length}</span>
            <span className="mb-1 text-muted">active</span>
          </div>
          <span className="mt-1 badge-warning">of {totalGoals} total</span>
        </div>
      </div>

      <div className="border-b border-gray-3 dark:border-dark-3 flex gap-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "border-b-2 border-primary-600 text-primary-600 dark:text-primary-400"
                : "border-b-2 border-transparent text-dark-5 hover:text-dark dark:text-dark-6 dark:hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "goals" && (
        <div className="space-y-5">
          <ScoreCard score={latestScore} reviews={reviews} />
          <GoalsList goals={goals} setToast={setToast} />
        </div>
      )}
      {activeTab === "reviews" && <ReviewsTab reviews={reviews} />}
      {activeTab === "team" && <TeamTab teamData={teamData} />}
      {activeTab === "analytics" && <AnalyticsTab teamData={teamData} />}

      {showReviewModal && (
        <ScheduleReviewModal
          onClose={() => setShowReviewModal(false)}
          isPending={isPending}
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            startTransition(async () => {
              try {
                await scheduleReview({
                  type: fd.get("type") as string,
                  period: fd.get("period") as string,
                  notes: (fd.get("notes") as string) || undefined,
                });
                setShowReviewModal(false);
                setToast("Review scheduled successfully!");
                router.refresh();
              } catch (err) {
                setToast(err instanceof Error ? err.message : "Failed to schedule review");
              }
            });
          }}
        />
      )}

      {showGoalModal && (
        <div className="modal-overlay">
          <div className="modal-panel max-w-lg p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-dark dark:text-white">Set New Goal</h2>
              <button onClick={() => setShowGoalModal(false)} className="flex size-8 items-center justify-center rounded-lg text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="label-field">Goal Title <span className="text-rose-500">*</span></label>
                <input name="title" type="text" required placeholder="Enter goal title" className="input-field" />
              </div>
              <div>
                <label className="label-field">Target Date</label>
                <input name="dueDate" type="date" className="input-field" />
              </div>
              <div>
                <label className="label-field">Description</label>
                <textarea name="description" rows={2} placeholder="Describe the goal..." className="input-field resize-none" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowGoalModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={isPending} className="btn-primary disabled:opacity-60">
                  {isPending ? "Creating…" : "Create Goal"}
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
