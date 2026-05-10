"use client";

import { useState } from "react";
import { ACTIVITY, WORK_INFO, DOCUMENTS, TIMELINE } from "../_data/profile-data";

const TABS = ["Overview", "Work Info", "Documents", "Timeline"] as const;
type Tab = (typeof TABS)[number];

function OverviewTab() {
  return (
    <div className="space-y-5">
      {/* Key Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Days at Company", value: "1,515", sub: "Since Mar 2022" },
          { label: "Leave Balance", value: "14 days", sub: "Annual leaves left" },
          { label: "Tasks Done", value: "342", sub: "All time" },
          { label: "Attendance", value: "97.3%", sub: "Last 90 days" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl bg-white p-4 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3"
          >
            <p className="text-lg font-bold text-dark dark:text-white">
              {stat.value}
            </p>
            <p className="mt-0.5 text-xs font-medium text-dark dark:text-white">
              {stat.label}
            </p>
            <p className="text-[10px] text-dark-5 dark:text-dark-6">
              {stat.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <h4 className="text-sm font-semibold text-dark dark:text-white">
          Recent Activity
        </h4>
        <ul className="mt-4 space-y-3">
          {ACTIVITY.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs ${item.iconBg}`}
              >
                {item.icon}
              </span>
              <div className="flex-1">
                <p className="text-xs text-dark dark:text-white">{item.text}</p>
                <p className="mt-0.5 text-[10px] text-dark-5 dark:text-dark-6">
                  {item.time}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* AI Engagement Score */}
      <div className="rounded-xl bg-gradient-to-br from-violet-600 via-primary-600 to-primary-700 p-5 text-white shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <svg
                className="size-4 text-white/80"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-sm font-semibold">AI Engagement Score</p>
            </div>
            <p className="mt-1 text-xs text-white/60">
              Powered by Unikove AI · Updated today
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">92</p>
            <p className="text-xs text-white/70">/ 100</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-white"
              style={{ width: "92%" }}
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          {[
            { label: "Collaboration", score: "94" },
            { label: "Productivity", score: "91" },
            { label: "Growth", score: "89" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-lg bg-white/10 px-2 py-2"
            >
              <p className="text-sm font-bold">{item.score}</p>
              <p className="text-[10px] text-white/70">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WorkInfoTab() {
  return (
    <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
      <h4 className="text-sm font-semibold text-dark dark:text-white">
        Work Information
      </h4>
      <dl className="mt-4 divide-y divide-gray-3 dark:divide-dark-3">
        {WORK_INFO.map((item) => (
          <div key={item.label} className="flex justify-between py-3">
            <dt className="text-xs text-dark-5 dark:text-dark-6">
              {item.label}
            </dt>
            <dd className="text-xs font-medium text-dark dark:text-white">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function DocumentsTab() {
  return (
    <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-dark dark:text-white">
          Documents
        </h4>
        <button className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700">
          Upload
        </button>
      </div>
      <ul className="mt-4 space-y-2">
        {DOCUMENTS.map((doc) => (
          <li
            key={doc.name}
            className="flex items-center gap-3 rounded-lg p-3 hover:bg-gray-2 dark:hover:bg-dark-3"
          >
            <span className="text-xl">{doc.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-medium text-dark dark:text-white">
                {doc.name}
              </p>
              <p className="text-[10px] text-dark-5 dark:text-dark-6">
                {doc.size} · {doc.date}
              </p>
            </div>
            <button className="text-xs text-primary-600 hover:underline dark:text-primary-400">
              Download
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TimelineTab() {
  return (
    <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
      <h4 className="text-sm font-semibold text-dark dark:text-white">
        Career Timeline
      </h4>
      <ol className="mt-4 space-y-0">
        {TIMELINE.map((item, i) => (
          <li key={i} className="relative flex gap-4 pb-6 last:pb-0">
            {/* Line */}
            {i < TIMELINE.length - 1 && (
              <div className="absolute left-3 top-6 bottom-0 w-px bg-gray-3 dark:bg-dark-3" />
            )}
            {/* Dot */}
            <span
              className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${item.color}`}
            >
              ●
            </span>
            <div className="flex-1 pt-0.5">
              <p className="text-xs font-semibold text-dark dark:text-white">
                {item.event}
              </p>
              <p className="mt-0.5 text-[10px] text-dark-5 dark:text-dark-6">
                {item.date}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function ProfileTabs() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");

  return (
    <div className="space-y-5">
      {/* Tab bar */}
      <div className="rounded-xl bg-white p-1 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? "bg-primary-600 text-white"
                  : "text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === "Overview" && <OverviewTab />}
      {activeTab === "Work Info" && <WorkInfoTab />}
      {activeTab === "Documents" && <DocumentsTab />}
      {activeTab === "Timeline" && <TimelineTab />}
    </div>
  );
}
