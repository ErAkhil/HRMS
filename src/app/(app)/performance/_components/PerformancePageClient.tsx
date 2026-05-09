"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";
import Image from "next/image";
import Link from "next/link";
import { ScoreCard } from "./score-card";
import { GoalsList } from "./goals-list";

type Tab = "goals" | "reviews" | "team" | "analytics";

const TABS: { id: Tab; label: string }[] = [
  { id: "goals", label: "Goals" },
  { id: "reviews", label: "Reviews" },
  { id: "team", label: "Team" },
  { id: "analytics", label: "Analytics" },
];

const REVIEW_ROWS = [
  { period: "Q1 2026", type: "Annual Review", score: "87", reviewer: "James Williams", status: "Completed", action: "View" },
  { period: "Q4 2025", type: "Mid-year", score: "84", reviewer: "James Williams", status: "Completed", action: "View" },
  { period: "Q3 2025", type: "Quarterly", score: "81", reviewer: "James Williams", status: "Completed", action: "View" },
  { period: "Q2 2025", type: "Quarterly", score: "78", reviewer: "James Williams", status: "Completed", action: "View" },
  { period: "Q1 2025", type: "Annual Review", score: "79", reviewer: "James Williams", status: "Completed", action: "View" },
  { period: "Q2 2026", type: "Annual Review", score: "—", reviewer: "James Williams", status: "Pending", action: "Start →" },
];

const SCORE_BARS = [
  { label: "Q1'25", value: 79, current: false },
  { label: "Q2'25", value: 78, current: false },
  { label: "Q3'25", value: 81, current: false },
  { label: "Q4'25", value: 84, current: false },
  { label: "Q1'26", value: 87, current: true },
  { label: "Q2'26", value: 0, current: false, pending: true },
];

const FEEDBACK_HIGHLIGHTS = [
  { text: "Exceptional problem-solving skills", category: "Technical", badge: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300" },
  { text: "Strong team collaboration", category: "Soft Skills", badge: "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald" },
  { text: "Could improve documentation practices", category: "Growth Area", badge: "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber" },
];

const TEAM_MEMBERS = [
  { name: "Sarah Mitchell", avatar: "/images/user/user-15.png", score: 87, role: "Senior SE", barColor: "bg-indigo-500" },
  { name: "Daniel Park", avatar: "/images/user/user-03.png", score: 82, role: "Frontend Eng", barColor: "bg-indigo-400" },
  { name: "Priya Sharma", avatar: "/images/user/user-26.png", score: 91, role: "Product Designer", barColor: "bg-emerald-500" },
  { name: "Arjun Mehta", avatar: "/images/user/user-23.png", score: 78, role: "Backend Eng", barColor: "bg-indigo-400" },
  { name: "Elena Torres", avatar: "/images/user/user-27.png", score: 85, role: "QA Engineer", barColor: "bg-indigo-500" },
  { name: "Marcus Chen", avatar: "/images/user/user-09.png", score: 88, role: "DevOps", barColor: "bg-indigo-500" },
];

const TEAM_GOALS = [
  { title: "Ship Platform v2.0", dept: "Engineering", progress: 72, status: "In Progress", statusBadge: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300", barColor: "bg-indigo-500" },
  { title: "Reduce API latency to < 100ms", dept: "Engineering", progress: 55, status: "In Progress", statusBadge: "bg-violet-light text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300", barColor: "bg-violet-500" },
  { title: "Complete Q2 Design System", dept: "Product", progress: 88, status: "Near Complete", statusBadge: "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald", barColor: "bg-emerald-500" },
  { title: "Zero critical bugs in prod", dept: "QA", progress: 94, status: "Near Complete", statusBadge: "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald", barColor: "bg-emerald-500" },
];

const TOP_PERFORMERS = [
  { rank: "🥇", name: "Priya Sharma", avatar: "/images/user/user-26.png", score: 91, delta: "↑ 7pts vs Q1", dept: "Product" },
  { rank: "🥈", name: "Marcus Chen", avatar: "/images/user/user-09.png", score: 88, delta: "↑ 5pts vs Q1", dept: "Engineering" },
  { rank: "🥉", name: "Sarah Mitchell", avatar: "/images/user/user-15.png", score: 87, delta: "↑ 3pts vs Q1", dept: "Engineering" },
];

const ANALYTICS_METRICS = [
  { label: "Dept Avg Score", value: "83.4", sub: "↑ 4.2% QoQ", color: "text-indigo-600" },
  { label: "On-Track Goals", value: "18/24", sub: "75% completion rate", color: "text-emerald-600" },
  { label: "Reviews Completed", value: "11/12", sub: "92% on time", color: "text-violet-600" },
  { label: "Improvement Plans", value: "2", sub: "active", color: "text-amber-600" },
];

const SCORE_DIST = [
  { bucket: "90–100", count: 2 },
  { bucket: "80–89", count: 7 },
  { bucket: "70–79", count: 2 },
  { bucket: "60–69", count: 1 },
];

const ATTENTION_EMPLOYEES = [
  { name: "John Doe", score: 71, dept: "Sales", note: "Improvement Plan Active", badge: "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber" },
  { name: "Mike Smith", score: 68, dept: "Operations", note: "Review Scheduled", badge: "bg-violet-light text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300" },
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

  function handleScheduleReview(e: React.FormEvent) {
    e.preventDefault();
    setShowReviewModal(false);
    setToast("Review scheduled successfully!");
  }

  function handleCreateGoal(e: React.FormEvent) {
    e.preventDefault();
    setShowGoalModal(false);
    setToast("Goal created successfully!");
  }

  // Compute goal KPI stats from real data
  const totalGoals = goals.length;
  const completedGoals = goals.filter((g) => g.status === "COMPLETED").length;
  const inProgressGoals = goals.filter((g) => g.status === "IN_PROGRESS").length;
  const completionPct = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-dark-5 dark:text-dark-6">
        <Link href="/" className="hover:text-dark dark:hover:text-white transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-dark dark:text-white font-medium">Performance</span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white">Performance</h1>
          <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
            Track goals, reviews, and team performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowReviewModal(true)}
            className="rounded-lg border border-gray-3 bg-white px-4 py-2 text-sm font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          >
            Schedule Review
          </button>
          <button
            onClick={() => setShowGoalModal(true)}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
          >
            Set New Goal
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {/* My Score */}
        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <p className="text-xs font-medium text-dark-5 dark:text-dark-6">My Score</p>
          <div className="mt-2 flex items-end gap-1">
            <span className="text-3xl font-bold text-indigo-600">87</span>
            <span className="mb-1 text-sm text-dark-5 dark:text-dark-6">/100</span>
          </div>
          <span className="mt-1 inline-block rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300">
            Q2 2026
          </span>
        </div>

        {/* Goals Completed */}
        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <p className="text-xs font-medium text-dark-5 dark:text-dark-6">Goals Completed</p>
          <div className="mt-2 flex items-end gap-1">
            <span className="text-3xl font-bold text-emerald-600">{completedGoals}</span>
            <span className="mb-1 text-sm text-dark-5 dark:text-dark-6">/{totalGoals}</span>
          </div>
          <span className="mt-1 inline-block rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald">
            {completionPct}% this quarter
          </span>
        </div>

        {/* Next Review */}
        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <p className="text-xs font-medium text-dark-5 dark:text-dark-6">Next Review</p>
          <div className="mt-2">
            <span className="text-3xl font-bold text-violet-600">June 15</span>
          </div>
          <span className="mt-1 inline-block rounded-full bg-violet-light px-2.5 py-0.5 text-xs font-medium text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300">
            in 39 days
          </span>
        </div>

        {/* Team Avg Score */}
        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <p className="text-xs font-medium text-dark-5 dark:text-dark-6">Team Avg Score</p>
          <div className="mt-2 flex items-end gap-1">
            <span className="text-3xl font-bold text-amber-600">82</span>
            <span className="mb-1 text-sm text-dark-5 dark:text-dark-6">/100</span>
          </div>
          <span className="mt-1 inline-block rounded-full bg-amber-light px-2.5 py-0.5 text-xs font-medium text-amber-dark dark:bg-amber-dark/20 dark:text-amber">
            ↑ 3pts vs Q1
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
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

      {/* ── TAB: GOALS ── */}
      {activeTab === "goals" && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
          <div className="md:col-span-4">
            <ScoreCard />
          </div>
          <div className="md:col-span-8">
            <GoalsList goals={goals} />
          </div>
        </div>
      )}

      {/* ── TAB: REVIEWS ── */}
      {activeTab === "reviews" && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
          {/* Review History */}
          <div className="md:col-span-8">
            <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-semibold text-dark dark:text-white">Review History</h2>
                <Link
                  href="/performance/reviews"
                  className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  View full review →
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-sm">
                  <thead>
                    <tr className="border-b border-gray-3 dark:border-dark-3">
                      {["Review Period", "Type", "Score", "Reviewer", "Status", "Action"].map((h) => (
                        <th
                          key={h}
                          className="pb-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6 first:pl-0 last:pr-0 px-3"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {REVIEW_ROWS.map((row, i) => (
                      <tr
                        key={i}
                        className="border-b border-gray-3 last:border-0 dark:border-dark-3"
                      >
                        <td className="py-3 pl-0 pr-3 text-sm font-medium text-dark dark:text-white">
                          {row.period}
                        </td>
                        <td className="px-3 py-3 text-sm text-dark-5 dark:text-dark-6">{row.type}</td>
                        <td className="px-3 py-3 text-sm font-semibold text-dark dark:text-white">
                          {row.score}/100
                        </td>
                        <td className="px-3 py-3 text-sm text-dark-5 dark:text-dark-6">{row.reviewer}</td>
                        <td className="px-3 py-3">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              row.status === "Completed"
                                ? "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald"
                                : "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber"
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td className="py-3 pl-3 pr-0">
                          {row.action === "View" ? (
                            <Link
                              href="/performance/reviews"
                              className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                            >
                              View
                            </Link>
                          ) : (
                            <Link
                              href="/performance/reviews/new"
                              className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                            >
                              Start →
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="md:col-span-4 flex flex-col gap-4">
            {/* Score Trend */}
            <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
              <h2 className="mb-4 text-base font-semibold text-dark dark:text-white">Score Trend</h2>
              <div className="flex items-end gap-2 h-32">
                {SCORE_BARS.map((bar) => {
                  const heightPct = bar.pending ? 0 : (bar.value / 100) * 100;
                  return (
                    <div key={bar.label} className="flex flex-1 flex-col items-center gap-1">
                      {!bar.pending && (
                        <span className="text-[10px] font-medium text-dark-5 dark:text-dark-6">
                          {bar.value}
                        </span>
                      )}
                      <div className="relative w-full flex-1 flex items-end">
                        {bar.pending ? (
                          <div
                            className="w-full rounded-t border-2 border-dashed border-gray-3 dark:border-dark-3"
                            style={{ height: "30%" }}
                          />
                        ) : (
                          <div
                            className={`w-full rounded-t transition-all ${
                              bar.current ? "bg-indigo-600" : "bg-indigo-200 dark:bg-indigo-900/40"
                            }`}
                            style={{ height: `${heightPct}%` }}
                          />
                        )}
                      </div>
                      <span className="text-[10px] text-dark-5 dark:text-dark-6">{bar.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Review Feedback */}
            <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
              <h2 className="mb-4 text-base font-semibold text-dark dark:text-white">
                Review Feedback
              </h2>
              <p className="mb-3 text-xs text-dark-5 dark:text-dark-6">
                Highlights from last review
              </p>
              <div className="space-y-3">
                {FEEDBACK_HIGHLIGHTS.map((fb, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 text-lg leading-none text-dark-5 dark:text-dark-6">&ldquo;</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-dark dark:text-white">{fb.text}</p>
                      <span
                        className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${fb.badge}`}
                      >
                        {fb.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: TEAM ── */}
      {activeTab === "team" && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
          {/* Team Performance */}
          <div className="md:col-span-5">
            <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-dark dark:text-white">
                    Team Performance
                  </h2>
                  <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">
                    Engineering Team &middot; 12 members
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {TEAM_MEMBERS.map((member) => (
                  <div key={member.name} className="flex items-center gap-3">
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      width={36}
                      height={36}
                      className="h-9 w-9 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <span className="text-sm font-medium text-dark dark:text-white">
                            {member.name}
                          </span>
                          <span className="ml-2 text-xs text-dark-5 dark:text-dark-6">
                            {member.role}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-dark dark:text-white">
                          {member.score}/100
                        </span>
                      </div>
                      <div className="relative h-1.5 rounded-full bg-gray-2 dark:bg-dark-3 overflow-hidden">
                        <div
                          className={`absolute inset-y-0 left-0 rounded-full ${member.barColor}`}
                          style={{ width: `${member.score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-gray-3 pt-4 dark:border-dark-3">
                <span className="text-sm font-semibold text-dark dark:text-white">
                  Team Average: 85.2 / 100
                </span>
                <Link
                  href="/performance/analytics"
                  className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  View Full Analytics →
                </Link>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="md:col-span-7 flex flex-col gap-4">
            {/* Team Goals Status */}
            <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
              <h2 className="mb-4 text-base font-semibold text-dark dark:text-white">
                Team Goals Status
              </h2>
              <div className="space-y-4">
                {TEAM_GOALS.map((goal) => (
                  <div key={goal.title}>
                    <div className="mb-1.5 flex items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2 min-w-0">
                        <span className="text-sm font-medium text-dark dark:text-white truncate">
                          {goal.title}
                        </span>
                        <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300 flex-shrink-0">
                          {goal.dept}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs font-semibold text-dark dark:text-white">
                          {goal.progress}%
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${goal.statusBadge}`}
                        >
                          {goal.status}
                        </span>
                      </div>
                    </div>
                    <div className="relative h-1.5 rounded-full bg-gray-2 dark:bg-dark-3 overflow-hidden">
                      <div
                        className={`absolute inset-y-0 left-0 rounded-full ${goal.barColor}`}
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performers */}
            <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
              <h2 className="mb-4 text-base font-semibold text-dark dark:text-white">
                Top Performers This Quarter
              </h2>
              <div className="space-y-3">
                {TOP_PERFORMERS.map((p) => (
                  <div
                    key={p.name}
                    className="flex items-center gap-3"
                  >
                    <span className="text-xl leading-none">{p.rank}</span>
                    <Image
                      src={p.avatar}
                      alt={p.name}
                      width={36}
                      height={36}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-dark dark:text-white">
                          {p.name}
                        </span>
                        <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300">
                          {p.dept}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-2">
                        <span className="text-xs text-dark-5 dark:text-dark-6">
                          {p.score}/100
                        </span>
                        <span className="rounded-full bg-emerald-light px-2 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald">
                          {p.delta}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: ANALYTICS ── */}
      {activeTab === "analytics" && (
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-dark dark:text-white">
              Performance Analytics
            </h2>
            <Link
              href="/performance/analytics"
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
            >
              Full Analytics →
            </Link>
          </div>

          {/* 4 Metric Summary Cards */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {ANALYTICS_METRICS.map((m) => (
              <div
                key={m.label}
                className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3"
              >
                <p className="text-xs font-medium text-dark-5 dark:text-dark-6">{m.label}</p>
                <p className={`mt-2 text-2xl font-bold ${m.color}`}>{m.value}</p>
                <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">{m.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
            {/* Score Distribution */}
            <div className="md:col-span-6">
              <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
                <h3 className="mb-4 text-sm font-semibold text-dark dark:text-white">
                  Score Distribution
                </h3>
                <div className="flex items-end gap-4 h-36">
                  {SCORE_DIST.map((d) => {
                    const maxCount = 7;
                    const heightPct = (d.count / maxCount) * 100;
                    return (
                      <div key={d.bucket} className="flex flex-1 flex-col items-center gap-1">
                        <span className="text-xs font-semibold text-dark dark:text-white">
                          {d.count}
                        </span>
                        <div className="relative w-full flex-1 flex items-end">
                          <div
                            className="w-full rounded-t bg-indigo-500"
                            style={{ height: `${heightPct}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-dark-5 dark:text-dark-6 text-center">
                          {d.bucket}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-3 text-xs text-dark-5 dark:text-dark-6">
                  12 employees &middot; Q2 2026
                </p>
              </div>
            </div>

            {/* Employees Needing Attention */}
            <div className="md:col-span-6">
              <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
                <h3 className="mb-4 text-sm font-semibold text-dark dark:text-white">
                  Employees Needing Attention
                </h3>
                <p className="mb-3 text-xs text-dark-5 dark:text-dark-6">
                  Below 75 performance score
                </p>
                <div className="space-y-4">
                  {ATTENTION_EMPLOYEES.map((emp) => (
                    <div
                      key={emp.name}
                      className="flex items-center justify-between gap-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-dark dark:text-white">
                          {emp.name}
                        </p>
                        <p className="text-xs text-dark-5 dark:text-dark-6">
                          {emp.dept} &middot; {emp.score}/100
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium flex-shrink-0 ${emp.badge}`}
                      >
                        {emp.note}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 border-t border-gray-3 pt-4 dark:border-dark-3">
                  <Link
                    href="/performance/analytics"
                    className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    View full analytics report →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-modal dark:bg-dark-2">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-dark dark:text-white">Schedule Performance Review</h2>
              <button
                onClick={() => setShowReviewModal(false)}
                className="flex size-8 items-center justify-center rounded-lg text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3"
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleScheduleReview} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-dark-5 dark:text-dark-6 mb-1">
                    Review Type
                  </label>
                  <select className="w-full rounded-lg border border-gray-3 bg-white px-3 py-2 text-sm text-dark outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white">
                    <option>Annual Review</option>
                    <option>Mid-year Review</option>
                    <option>Quarterly Check-in</option>
                    <option>360° Feedback</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-dark-5 dark:text-dark-6 mb-1">
                    Review Period
                  </label>
                  <select className="w-full rounded-lg border border-gray-3 bg-white px-3 py-2 text-sm text-dark outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white">
                    <option>Q2 2026</option>
                    <option>Q3 2026</option>
                    <option>Q4 2026</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-dark-5 dark:text-dark-6 mb-1">
                    Reviewer
                  </label>
                  <select className="w-full rounded-lg border border-gray-3 bg-white px-3 py-2 text-sm text-dark outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white">
                    <option>James Williams</option>
                    <option>Sarah Mitchell</option>
                    <option>Priya Sharma</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-dark-5 dark:text-dark-6 mb-1">
                    Review Date
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-gray-3 bg-white px-3 py-2 text-sm text-dark outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-dark-5 dark:text-dark-6 mb-1">
                  Notes <span className="text-dark-5 dark:text-dark-6">(optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Any notes for the reviewer..."
                  className="w-full rounded-lg border border-gray-3 bg-white px-3 py-2 text-sm text-dark outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white resize-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="rounded-lg border border-gray-3 px-4 py-2 text-sm font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
                >
                  Schedule Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Set New Goal Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-modal dark:bg-dark-2">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-dark dark:text-white">Set New Goal</h2>
              <button
                onClick={() => setShowGoalModal(false)}
                className="flex size-8 items-center justify-center rounded-lg text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3"
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-dark-5 dark:text-dark-6 mb-1">
                  Goal Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter goal title"
                  className="w-full rounded-lg border border-gray-3 bg-white px-3 py-2 text-sm text-dark outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-dark-5 dark:text-dark-6 mb-1">
                    Category
                  </label>
                  <select className="w-full rounded-lg border border-gray-3 bg-white px-3 py-2 text-sm text-dark outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white">
                    <option>Technical</option>
                    <option>Collaboration</option>
                    <option>Leadership</option>
                    <option>Delivery</option>
                    <option>Learning</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-dark-5 dark:text-dark-6 mb-1">
                    Target Date
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-gray-3 bg-white px-3 py-2 text-sm text-dark outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-dark-5 dark:text-dark-6 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe the goal..."
                  className="w-full rounded-lg border border-gray-3 bg-white px-3 py-2 text-sm text-dark outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-dark-5 dark:text-dark-6 mb-1">
                  Key Result 1
                </label>
                <input
                  type="text"
                  placeholder="Measurable outcome"
                  className="w-full rounded-lg border border-gray-3 bg-white px-3 py-2 text-sm text-dark outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-dark-5 dark:text-dark-6 mb-1">
                  Key Result 2 <span className="text-dark-5 dark:text-dark-6">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Measurable outcome"
                  className="w-full rounded-lg border border-gray-3 bg-white px-3 py-2 text-sm text-dark outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGoalModal(false)}
                  className="rounded-lg border border-gray-3 px-4 py-2 text-sm font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
                >
                  Create Goal
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
