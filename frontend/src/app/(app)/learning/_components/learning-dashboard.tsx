"use client";

import { useState } from "react";

type Tab = "Recommended" | "In Progress" | "Completed";

const RECOMMENDED = [
  { id: 1, title: "Advanced HR Analytics", category: "HR", duration: "4h 20m", rating: 4.8, gradient: "from-primary-500 to-purple-600" },
  { id: 2, title: "Strategic Leadership", category: "Leadership", duration: "6h 10m", rating: 4.7, gradient: "from-emerald-500 to-teal-600" },
  { id: 3, title: "Python for Data Analysis", category: "Tech", duration: "8h 30m", rating: 4.9, gradient: "from-orange-500 to-amber-600" },
  { id: 4, title: "Employment Law 2026", category: "Compliance", duration: "3h 15m", rating: 4.6, gradient: "from-rose-500 to-pink-600" },
  { id: 5, title: "Emotional Intelligence", category: "Soft Skills", duration: "2h 45m", rating: 4.5, gradient: "from-sky-500 to-blue-600" },
];

const IN_PROGRESS = [
  { id: 1, title: "HR Compliance 2026", category: "Compliance", progress: 67, hoursLeft: "1h 20m left" },
  { id: 2, title: "Advanced Excel for HR", category: "HR", progress: 45, hoursLeft: "2h 45m left" },
  { id: 3, title: "Leadership Essentials", category: "Leadership", progress: 30, hoursLeft: "4h 10m left" },
];

const SESSIONS = [
  { title: "Workforce Planning Masterclass", date: "May 12, 2026", time: "10:00 AM", speaker: "Dr. Rachel Kim", seats: 48 },
  { title: "DEI Strategy Workshop", date: "May 15, 2026", time: "2:00 PM", speaker: "Marcus Webb", seats: 30 },
  { title: "Performance Feedback Training", date: "May 20, 2026", time: "11:00 AM", speaker: "Sarah Johnson", seats: 25 },
];

const STATS = [
  { label: "Courses Completed", value: "12", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", bg: "bg-emerald-light dark:bg-emerald-dark/20", color: "text-emerald-dark dark:text-emerald" },
  { label: "In Progress", value: "3", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", bg: "bg-amber-light dark:bg-amber-dark/20", color: "text-amber-dark" },
  { label: "Certificates Earned", value: "5", icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z", bg: "bg-primary-50 dark:bg-primary-900/20", color: "text-primary-600 dark:text-primary-300" },
  { label: "Learning Hours", value: "48h", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", bg: "bg-violet-light dark:bg-violet-dark/20", color: "text-violet-dark dark:text-violet-300" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`h-3 w-3 ${star <= Math.round(rating) ? "text-amber-400" : "text-gray-300 dark:text-dark-3"}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ))}
      <span className="ml-1 text-xs text-dark-5 dark:text-dark-6">{rating}</span>
    </div>
  );
}

export function LearningDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("Recommended");

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-dark dark:text-white">Learning & Development</h1>
          <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">Grow your skills with curated courses and certifications</p>
        </div>
        <a
          href="/learning/courses"
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
        >
          Browse Catalog
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-dark-5 dark:text-dark-6">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold text-dark dark:text-white">{stat.value}</p>
              </div>
              <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}>
                <svg className={`h-5 w-5 ${stat.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                </svg>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="rounded-xl bg-white p-1 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 inline-flex gap-1">
        {(["Recommended", "In Progress", "Completed"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-5 py-2 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-primary-600 text-white"
                : "text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Recommended" && (
        <div>
          <h2 className="text-sm font-semibold text-dark dark:text-white mb-3">Recommended for You</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {RECOMMENDED.map((course) => (
              <div
                key={course.id}
                className="flex-shrink-0 w-60 rounded-xl bg-white shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 overflow-hidden"
              >
                <div className={`h-32 bg-gradient-to-br ${course.gradient} flex items-center justify-center`}>
                  <svg className="h-10 w-10 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="p-4">
                  <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-600 dark:bg-primary-900/20 dark:text-primary-300">
                    {course.category}
                  </span>
                  <p className="mt-2 text-sm font-semibold text-dark dark:text-white line-clamp-2">{course.title}</p>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="text-xs text-dark-5 dark:text-dark-6">{course.duration}</span>
                    <StarRating rating={course.rating} />
                  </div>
                  <button className="mt-3 w-full rounded-lg bg-primary-600 py-1.5 text-sm font-semibold text-white hover:bg-primary-700">
                    Start
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "In Progress" && (
        <div className="space-y-3">
          {IN_PROGRESS.map((course) => (
            <div key={course.id} className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-dark dark:text-white">{course.title}</p>
                  <p className="text-xs text-dark-5 dark:text-dark-6 mt-0.5">{course.hoursLeft}</p>
                </div>
                <span className="rounded-full bg-amber-light px-2.5 py-0.5 text-xs font-medium text-amber-dark">
                  {course.category}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 overflow-hidden rounded-full bg-gray-2 dark:bg-dark-3">
                  <div
                    className="h-full rounded-full bg-primary-600"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-dark dark:text-white w-10 text-right">{course.progress}%</span>
              </div>
              <button className="mt-3 rounded-lg bg-primary-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-primary-700">
                Continue
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === "Completed" && (
        <div className="rounded-xl bg-white p-8 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 text-center">
          <p className="text-sm text-dark-5 dark:text-dark-6">12 courses completed. View all in your learning history.</p>
        </div>
      )}

      {/* Upcoming Live Sessions */}
      <div className="rounded-xl bg-white shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <div className="border-b border-gray-3 dark:border-dark-3 px-5 py-4">
          <h2 className="text-sm font-semibold text-dark dark:text-white">Upcoming Live Sessions</h2>
        </div>
        <div className="divide-y divide-gray-3 dark:divide-dark-3">
          {SESSIONS.map((session) => (
            <div key={session.title} className="flex items-center justify-between px-5 py-4 hover:bg-gray-1 dark:hover:bg-dark-3">
              <div>
                <p className="text-sm font-semibold text-dark dark:text-white">{session.title}</p>
                <p className="text-xs text-dark-5 dark:text-dark-6 mt-0.5">
                  {session.date} · {session.time} · {session.speaker}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-dark-5 dark:text-dark-6">{session.seats} seats</span>
                <button className="rounded-lg border border-gray-3 px-3 py-1.5 text-xs font-medium text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6">
                  Register
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
