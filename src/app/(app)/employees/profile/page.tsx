"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Tab = "overview" | "performance" | "leave" | "documents";

export default function EmployeeProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "performance", label: "Performance" },
    { key: "leave", label: "Leave History" },
    { key: "documents", label: "Documents" },
  ];

  return (
    <div className="space-y-5">
      {/* ── Breadcrumb + Actions ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav className="flex items-center gap-1.5 text-xs text-dark-5 dark:text-dark-6">
          <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">
            Dashboard
          </Link>
          <span>/</span>
          <Link href="/employees" className="hover:text-indigo-600 dark:hover:text-indigo-400">
            Employees
          </Link>
          <span>/</span>
          <span className="text-dark dark:text-white">Profile</span>
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEditModal(true)}
            className="rounded-lg border border-gray-3 bg-white px-4 py-2 text-sm font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          >
            Edit Profile
          </button>
          <div className="relative">
            <button
              onClick={() => setShowMenu((v) => !v)}
              className="rounded-lg border border-gray-3 bg-white px-4 py-2 text-sm font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            >
              &bull;&bull;&bull;
            </button>
            {showMenu && (
              <div
                className="absolute right-0 top-10 z-20 w-48 rounded-xl border border-gray-3 bg-white shadow-floating dark:border-dark-3 dark:bg-dark-2"
                onMouseLeave={() => setShowMenu(false)}
              >
                {["View Payslips", "Download Profile", "Flag for Review", "Deactivate Account"].map(
                  (item) => (
                    <button
                      key={item}
                      onClick={() => setShowMenu(false)}
                      className="block w-full px-4 py-2.5 text-left text-sm text-dark hover:bg-gray-2 dark:text-white dark:hover:bg-dark-3 first:rounded-t-xl last:rounded-b-xl"
                    >
                      {item}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Profile Hero Card ── */}
      <div className="rounded-xl bg-white p-6 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <div className="flex flex-wrap items-start gap-6">
          <div className="relative shrink-0">
            <Image
              src="/images/user/user-15.png"
              alt="Sarah Mitchell"
              width={80}
              height={80}
              className="rounded-full object-cover"
            />
            <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald dark:border-dark-2" />
          </div>

          <div className="min-w-[160px]">
            <h1 className="text-xl font-bold text-dark dark:text-white">Sarah Mitchell</h1>
            <p className="mt-0.5 text-sm text-dark-5 dark:text-dark-6">Senior Software Engineer</p>
            <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">
              Joined March 2022 &middot; 3 years 2 months
            </p>
          </div>

          <div className="min-w-[200px] flex-1 space-y-2.5">
            <div>
              <span className="inline-flex items-center rounded-md bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300">
                Engineering
              </span>
            </div>
            <p className="flex items-center gap-1.5 text-sm text-dark-5 dark:text-dark-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              Remote &middot; Bengaluru, India
            </p>
            <div className="flex items-center gap-2">
              <Image
                src="/images/user/user-28.png"
                alt="James Williams"
                width={24}
                height={24}
                className="rounded-full object-cover"
              />
              <span className="text-sm text-dark-5 dark:text-dark-6">
                Reports to{" "}
                <span className="font-medium text-dark dark:text-white">James Williams</span>, VP Engineering
              </span>
            </div>
            <p className="text-sm text-dark-5 dark:text-dark-6">
              Employee ID:{" "}
              <span className="font-semibold text-dark dark:text-white">EMP-0042</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-center sm:grid-cols-4">
            <div>
              <p className="text-2xl font-bold text-indigo-600">
                87<span className="text-base font-normal text-dark-5 dark:text-dark-6">/100</span>
              </p>
              <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">Performance</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-dark dark:text-white">18</p>
              <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">Leave Days</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-dark dark:text-white">6</p>
              <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">Active Tasks</p>
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight text-dark dark:text-white">
                Platform
                <br />
                Team
              </p>
              <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">Team</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tab Shell ── */}
      <div className="rounded-xl bg-white shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        {/* Tab Bar */}
        <div className="flex gap-6 overflow-x-auto border-b border-gray-3 px-6 dark:border-dark-3">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`shrink-0 border-b-2 py-3.5 text-sm font-medium transition-colors ${
                activeTab === key
                  ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                  : "border-transparent text-dark-5 hover:text-dark dark:text-dark-6 dark:hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Tab Content ── */}
        <div className="p-6">
          {/* ────────────── OVERVIEW ────────────── */}
          {activeTab === "overview" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
                {/* Left */}
                <div className="space-y-5 md:col-span-8">
                  {/* Personal Information */}
                  <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
                    <h2 className="mb-4 text-base font-semibold text-dark dark:text-white">
                      Personal Information
                    </h2>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                      {[
                        { label: "Full Name", value: "Sarah Mitchell" },
                        { label: "Date of Birth", value: "August 14, 1992" },
                        { label: "Phone", value: "+91 98765 43210" },
                        { label: "Email", value: "sarah.mitchell@acme.com" },
                        { label: "Location", value: "Bengaluru, Karnataka" },
                        { label: "Nationality", value: "Indian" },
                        {
                          label: "Emergency Contact",
                          value: "Michael Mitchell (Spouse)\n+91 98765 00000",
                          wide: true,
                        },
                      ].map(({ label, value, wide }) => (
                        <div key={label} className={wide ? "sm:col-span-2" : ""}>
                          <p className="text-xs font-medium uppercase tracking-wide text-dark-5 dark:text-dark-6">
                            {label}
                          </p>
                          <p className="mt-1 whitespace-pre-line text-sm font-medium text-dark dark:text-white">
                            {value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Employment Details */}
                  <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
                    <h2 className="mb-4 text-base font-semibold text-dark dark:text-white">
                      Employment Details
                    </h2>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                      {[
                        { label: "Employee ID", value: "EMP-0042" },
                        { label: "Department", value: "Engineering" },
                        { label: "Designation", value: "Senior Software Engineer" },
                        { label: "Employment Type", value: "Full-time" },
                        { label: "Work Location", value: "Remote" },
                        { label: "Shift", value: "Flexible (9 AM - 6 PM)" },
                        { label: "Contract Type", value: "Permanent" },
                        { label: "Probation", value: "Completed" },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <p className="text-xs font-medium uppercase tracking-wide text-dark-5 dark:text-dark-6">
                            {label}
                          </p>
                          <p className="mt-1 text-sm font-medium text-dark dark:text-white">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
                    <h2 className="mb-4 text-base font-semibold text-dark dark:text-white">
                      Skills &amp; Expertise
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { name: "React", color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300" },
                        { name: "TypeScript", color: "bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-300" },
                        { name: "Node.js", color: "bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-300" },
                        { name: "PostgreSQL", color: "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald" },
                        { name: "AWS", color: "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber" },
                        { name: "Docker", color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300" },
                        { name: "GraphQL", color: "bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-300" },
                        { name: "System Design", color: "bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-300" },
                      ].map(({ name, color }) => (
                        <span
                          key={name}
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${color}`}
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right */}
                <div className="space-y-5 md:col-span-4">
                  {/* Performance Overview */}
                  <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
                    <h2 className="mb-4 text-base font-semibold text-dark dark:text-white">
                      Performance Overview
                    </h2>
                    <div className="mb-4 text-center">
                      <p className="text-4xl font-bold text-indigo-600">
                        87<span className="text-xl font-normal text-dark-5 dark:text-dark-6">/100</span>
                      </p>
                      <span className="mt-1 inline-flex items-center rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-semibold text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald">
                        Excellent
                      </span>
                    </div>
                    <div className="space-y-3">
                      {[
                        { label: "Goal Achievement", pct: 92, color: "bg-emerald" },
                        { label: "Collaboration", pct: 88, color: "bg-indigo-600" },
                        { label: "Delivery", pct: 85, color: "bg-violet-500" },
                        { label: "Leadership", pct: 79, color: "bg-amber" },
                      ].map(({ label, pct, color }) => (
                        <div key={label}>
                          <div className="mb-1 flex justify-between text-xs">
                            <span className="text-dark-5 dark:text-dark-6">{label}</span>
                            <span className="font-semibold text-dark dark:text-white">{pct}%</span>
                          </div>
                          <div className="relative h-1.5 overflow-hidden rounded-full bg-gray-2 dark:bg-dark-3">
                            <div
                              className={`absolute inset-y-0 left-0 rounded-full ${color}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 border-t border-gray-3 pt-3 text-right dark:border-dark-3">
                      <button
                        onClick={() => setActiveTab("performance")}
                        className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                      >
                        View Full Review &rarr;
                      </button>
                    </div>
                  </div>

                  {/* Leave Balance */}
                  <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
                    <h2 className="mb-4 text-base font-semibold text-dark dark:text-white">
                      Leave Balance
                    </h2>
                    <div className="space-y-3">
                      {[
                        { label: "Annual Leave", used: 12, total: 24, color: "bg-indigo-600" },
                        { label: "Sick Leave", used: 4, total: 12, color: "bg-amber" },
                        { label: "Casual Leave", used: 2, total: 6, color: "bg-violet-500" },
                      ].map(({ label, used, total, color }) => (
                        <div key={label}>
                          <div className="mb-1 flex justify-between text-xs">
                            <span className="text-dark-5 dark:text-dark-6">{label}</span>
                            <span className="font-semibold text-dark dark:text-white">
                              {used} / {total} days
                            </span>
                          </div>
                          <div className="relative h-1.5 overflow-hidden rounded-full bg-gray-2 dark:bg-dark-3">
                            <div
                              className={`absolute inset-y-0 left-0 rounded-full ${color}`}
                              style={{ width: `${Math.round((used / total) * 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                      <div className="flex items-center justify-between rounded-lg bg-gray-2 px-3 py-2 text-xs dark:bg-dark-3">
                        <span className="text-dark-5 dark:text-dark-6">Comp-off Available</span>
                        <span className="font-semibold text-dark dark:text-white">2 days</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab("leave")}
                      className="mt-4 w-full rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
                    >
                      Apply Leave
                    </button>
                  </div>

                  {/* Team Members */}
                  <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
                    <h2 className="mb-4 text-base font-semibold text-dark dark:text-white">
                      Team Members
                    </h2>
                    <div className="space-y-3">
                      {[
                        { name: "Daniel Park", role: "Frontend Engineer", avatar: "/images/user/user-03.png" },
                        { name: "Priya Sharma", role: "Product Designer", avatar: "/images/user/user-26.png" },
                        { name: "Arjun Mehta", role: "Backend Engineer", avatar: "/images/user/user-23.png" },
                        { name: "Elena Torres", role: "QA Engineer", avatar: "/images/user/user-27.png" },
                      ].map(({ name, role, avatar }) => (
                        <div key={name} className="flex items-center gap-3">
                          <Image
                            src={avatar}
                            alt={name}
                            width={36}
                            height={36}
                            className="shrink-0 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-sm font-medium text-dark dark:text-white">{name}</p>
                            <p className="text-xs text-dark-5 dark:text-dark-6">{role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
                <h2 className="mb-5 text-base font-semibold text-dark dark:text-white">
                  Recent Activity
                </h2>
                <ol className="relative ml-2 space-y-5 border-l border-gray-3 dark:border-dark-3">
                  {[
                    { dot: "bg-indigo-600", title: "Code review completed", desc: "Q2 authentication module", time: "Today, 10:30 AM" },
                    { dot: "bg-emerald", title: "Leave approved", desc: "2 days annual leave approved", time: "Yesterday" },
                    { dot: "bg-emerald", title: "Task completed", desc: "API rate limiting implementation", time: "2 days ago" },
                    { dot: "bg-violet-500", title: "Performance review submitted", desc: "Q1 2026 self-assessment", time: "1 week ago" },
                    { dot: "bg-amber", title: "Certification earned", desc: "AWS Solutions Architect", time: "2 weeks ago" },
                  ].map(({ dot, title, desc, time }, idx) => (
                    <li key={idx} className="ml-5">
                      <span className={`absolute -left-1.5 mt-1 h-3 w-3 rounded-full border-2 border-white dark:border-dark-2 ${dot}`} />
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-dark dark:text-white">{title}</p>
                          <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">{desc}</p>
                        </div>
                        <time className="shrink-0 text-xs text-dark-5 dark:text-dark-6">{time}</time>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}

          {/* ────────────── PERFORMANCE ────────────── */}
          {activeTab === "performance" && (
            <div className="space-y-5">
              <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
                <h2 className="mb-5 text-base font-semibold text-dark dark:text-white">
                  Performance History
                </h2>

                {/* Score Summary */}
                <div className="mb-6 flex flex-wrap items-center gap-8">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-indigo-600">
                      87<span className="text-2xl font-normal text-dark-5 dark:text-dark-6">/100</span>
                    </p>
                    <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">Overall Score</p>
                    <span className="mt-1 inline-flex items-center rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-semibold text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald">
                      Excellent
                    </span>
                  </div>
                  <div className="flex-1 space-y-3 min-w-[200px]">
                    {[
                      { label: "Goal Achievement", pct: 92, color: "bg-emerald" },
                      { label: "Collaboration", pct: 88, color: "bg-indigo-600" },
                      { label: "Delivery", pct: 85, color: "bg-violet-500" },
                      { label: "Leadership", pct: 79, color: "bg-amber" },
                    ].map(({ label, pct, color }) => (
                      <div key={label}>
                        <div className="mb-1 flex justify-between text-xs">
                          <span className="text-dark-5 dark:text-dark-6">{label}</span>
                          <span className="font-semibold text-dark dark:text-white">{pct}%</span>
                        </div>
                        <div className="relative h-1.5 overflow-hidden rounded-full bg-gray-2 dark:bg-dark-3">
                          <div
                            className={`absolute inset-y-0 left-0 rounded-full ${color}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Score Trend Bar Chart */}
                <div className="mb-6 rounded-xl border border-gray-3 p-4 dark:border-dark-3">
                  <p className="mb-4 text-sm font-semibold text-dark dark:text-white">Score Trend</p>
                  <div className="flex items-end justify-around gap-3 h-28">
                    {[
                      { period: "Q1 2025", score: 79 },
                      { period: "Q2 2025", score: 78 },
                      { period: "Q3 2025", score: 81 },
                      { period: "Q4 2025", score: 84 },
                      { period: "Q1 2026", score: 87 },
                    ].map(({ period, score }, idx, arr) => {
                      const maxScore = Math.max(...arr.map((r) => r.score));
                      const heightPct = Math.round((score / maxScore) * 100);
                      const isCurrent = idx === arr.length - 1;
                      return (
                        <div key={period} className="flex flex-col items-center gap-1 flex-1">
                          <span className="text-xs font-semibold text-dark dark:text-white">{score}</span>
                          <div className="w-full rounded-t-md" style={{ height: `${heightPct}%`, background: isCurrent ? "#4f46e5" : "#c7d2fe" }} />
                          <span className="text-[10px] text-dark-5 dark:text-dark-6 text-center leading-tight">{period}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Review History Table */}
                <div className="mb-6 overflow-x-auto">
                  <p className="mb-3 text-sm font-semibold text-dark dark:text-white">Review History</p>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-3 dark:border-dark-3">
                        {["Period", "Score", "Reviewer", "Status", "Action"].map((h) => (
                          <th key={h} className="pb-3 text-left text-xs font-medium uppercase tracking-wide text-dark-5 dark:text-dark-6">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-3 dark:divide-dark-3">
                      {[
                        { period: "Q1 2026", score: 87, reviewer: "James Williams" },
                        { period: "Q4 2025", score: 84, reviewer: "James Williams" },
                        { period: "Q3 2025", score: 81, reviewer: "James Williams" },
                        { period: "Q2 2025", score: 78, reviewer: "James Williams" },
                        { period: "Q1 2025", score: 79, reviewer: "James Williams" },
                      ].map(({ period, score, reviewer }) => (
                        <tr key={period}>
                          <td className="py-3 font-medium text-dark dark:text-white">{period}</td>
                          <td className="py-3">
                            <span className="font-semibold text-indigo-600 dark:text-indigo-400">{score}/100</span>
                          </td>
                          <td className="py-3 text-dark-5 dark:text-dark-6">{reviewer}</td>
                          <td className="py-3">
                            <span className="inline-flex items-center rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-semibold text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald">
                              Completed
                            </span>
                          </td>
                          <td className="py-3">
                            <button className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Feedback Cards */}
                <div>
                  <p className="mb-3 text-sm font-semibold text-dark dark:text-white">Manager Feedback</p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {[
                      { title: "Exceptional Problem-Solving", body: "Sarah consistently delivers elegant solutions to complex technical challenges, often proposing approaches the team hadn't considered.", color: "border-l-emerald" },
                      { title: "Strong Collaboration", body: "Always available to help teammates, conducts thorough code reviews, and fosters a positive team environment.", color: "border-l-indigo-600" },
                      { title: "Improve Documentation", body: "Encouraged to invest more time in writing clear inline documentation and architecture decision records for future maintainability.", color: "border-l-amber" },
                    ].map(({ title, body, color }) => (
                      <div key={title} className={`rounded-lg border border-gray-3 border-l-4 p-4 dark:border-dark-3 ${color}`}>
                        <p className="mb-1.5 text-sm font-semibold text-dark dark:text-white">{title}</p>
                        <p className="text-xs leading-relaxed text-dark-5 dark:text-dark-6">{body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ────────────── LEAVE ────────────── */}
          {activeTab === "leave" && (
            <div className="space-y-5">
              {/* Balance Cards */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { label: "Annual Leave", used: 12, total: 24, color: "text-indigo-600" },
                  { label: "Sick Leave", used: 4, total: 12, color: "text-amber" },
                  { label: "Casual Leave", used: 2, total: 6, color: "text-violet-500" },
                  { label: "Comp-off", used: null, total: 2, color: "text-emerald" },
                ].map(({ label, used, total, color }) => (
                  <div key={label} className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 text-center">
                    <p className={`text-3xl font-bold ${color}`}>
                      {used !== null ? total - used : total}
                    </p>
                    <p className="mt-1 text-xs font-medium text-dark dark:text-white">{label}</p>
                    <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">
                      {used !== null ? `${used}/${total} days used` : "days available"}
                    </p>
                  </div>
                ))}
              </div>

              {/* Request History Table */}
              <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
                <h2 className="mb-4 text-base font-semibold text-dark dark:text-white">
                  Leave Request History
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-3 dark:border-dark-3">
                        {["Date", "Type", "Duration", "Status"].map((h) => (
                          <th key={h} className="pb-3 text-left text-xs font-medium uppercase tracking-wide text-dark-5 dark:text-dark-6">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-3 dark:divide-dark-3">
                      {[
                        { date: "May 1–2, 2026", type: "Annual Leave", duration: "2 days" },
                        { date: "Apr 15, 2026", type: "Sick Leave", duration: "1 day" },
                        { date: "Mar 20–21, 2026", type: "Casual Leave", duration: "2 days" },
                        { date: "Mar 10, 2026", type: "Work From Home", duration: "1 day" },
                        { date: "Feb 14, 2026", type: "Annual Leave", duration: "3 days" },
                        { date: "Jan 5, 2026", type: "Sick Leave", duration: "2 days" },
                      ].map(({ date, type, duration }) => (
                        <tr key={date + type}>
                          <td className="py-3 font-medium text-dark dark:text-white">{date}</td>
                          <td className="py-3 text-dark-5 dark:text-dark-6">{type}</td>
                          <td className="py-3 text-dark-5 dark:text-dark-6">{duration}</td>
                          <td className="py-3">
                            <span className="inline-flex items-center rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-semibold text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald">
                              Approved
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Apply Leave Button */}
              <div className="flex justify-start">
                <button className="rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-700">
                  Apply Leave
                </button>
              </div>
            </div>
          )}

          {/* ────────────── DOCUMENTS ────────────── */}
          {activeTab === "documents" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-dark dark:text-white">Documents</h2>
                <button className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700">
                  Upload Document
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { name: "Offer Letter", type: "PDF", date: "Uploaded March 2022", action: "Download" },
                  { name: "Employment Contract", type: "PDF", date: "Uploaded March 2022", action: "Download" },
                  { name: "May 2026 Payslip", type: "PDF", date: "Generated May 1, 2026", action: "Download" },
                  { name: "Apr 2026 Payslip", type: "PDF", date: "Generated Apr 1, 2026", action: "Download" },
                  { name: "PAN Card", type: "PDF", date: "Uploaded March 2022", action: "Download" },
                  { name: "Aadhaar Card", type: "PDF", date: "Uploaded March 2022", action: "View" },
                ].map(({ name, type, date, action }) => (
                  <div
                    key={name}
                    className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 flex flex-col gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-indigo-600 dark:text-indigo-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                          />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-dark dark:text-white">{name}</p>
                        <p className="text-xs text-dark-5 dark:text-dark-6">{date}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300">
                        {type}
                      </span>
                      <button className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">
                        {action}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Edit Profile Modal ── */}
      {showEditModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={(e) => { if (e.target === e.currentTarget) setShowEditModal(false); }}
        >
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-modal dark:bg-dark-2">
            <h2 className="mb-5 text-lg font-semibold text-dark dark:text-white">Edit Profile</h2>
            <div className="space-y-4">
              {[
                { label: "Full Name", defaultValue: "Sarah Mitchell", type: "text" },
                { label: "Phone", defaultValue: "+91 98765 43210", type: "tel" },
                { label: "Email", defaultValue: "sarah.mitchell@acme.com", type: "email" },
                { label: "Location", defaultValue: "Bengaluru, Karnataka", type: "text" },
              ].map(({ label, defaultValue, type }) => (
                <div key={label}>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-dark-5 dark:text-dark-6">
                    {label}
                  </label>
                  <input
                    type={type}
                    defaultValue={defaultValue}
                    className="w-full rounded-lg border border-gray-3 bg-white px-3.5 py-2.5 text-sm text-dark focus:border-primary-600 focus:outline-none dark:border-dark-3 dark:bg-dark-3 dark:text-white dark:focus:border-primary-600"
                  />
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="rounded-lg border border-gray-3 bg-white px-5 py-2.5 text-sm font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
