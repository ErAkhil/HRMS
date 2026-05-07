"use client";

import Link from "next/link";
import { useState } from "react";
import { EmployeeCard } from "./employee-card";
import { EmployeeListRow } from "./employee-list-row";
import { StatCard } from "./stat-card";
import {
  EMPLOYEES,
  type DepartmentKey,
  type StatusKey,
} from "./employee-data";

const DEPARTMENTS: Array<DepartmentKey | "All"> = [
  "All",
  "Engineering",
  "Product",
  "Sales",
  "HR",
  "Finance",
  "Marketing",
];

const STATUSES: Array<StatusKey | "All"> = ["All", "online", "away", "offline"];

export function EmployeeDirectory() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState<DepartmentKey | "All">("All");
  const [status, setStatus] = useState<StatusKey | "All">("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filtered = EMPLOYEES.filter((e) => {
    const matchSearch =
      search === "" ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase());
    const matchDept = department === "All" || e.department === department;
    const matchStatus = status === "All" || e.status === status;
    return matchSearch && matchDept && matchStatus;
  });

  return (
    <div className="space-y-5">
      {/* ── Page Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-dark dark:text-white">
            Employee Directory
          </h1>
          <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-dark dark:bg-sky-dark/10 dark:text-sky">
            248 employees
          </span>
        </div>
        <Link
          href="#"
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
        >
          + Add Employee
        </Link>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Employees"
          value={248}
          iconBg="bg-indigo-50 dark:bg-indigo-900/20"
          icon={
            <svg
              className="size-5 text-indigo-600 dark:text-indigo-300"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
          trend="3.2%"
          trendUp
        />
        <StatCard
          label="Active"
          value={231}
          iconBg="bg-emerald-light dark:bg-emerald-dark/20"
          icon={
            <svg
              className="size-5 text-emerald-dark dark:text-emerald"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
          trend="1.4%"
          trendUp
        />
        <StatCard
          label="On Leave"
          value={12}
          iconBg="bg-amber-light dark:bg-amber-dark/20"
          icon={
            <svg
              className="size-5 text-amber-dark dark:text-amber"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        />
        <StatCard
          label="New This Month"
          value={8}
          iconBg="bg-violet-light dark:bg-violet-dark/20"
          icon={
            <svg
              className="size-5 text-violet-dark dark:text-violet-300"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
          trend="2 this week"
          trendUp
        />
      </div>

      {/* ── Filters Bar ── */}
      <div className="rounded-xl bg-white p-4 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-dark-5 dark:text-dark-6"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="text"
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-lg border border-gray-3 bg-gray-2 pl-9 pr-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white dark:placeholder-dark-6"
            />
          </div>

          {/* Department */}
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value as DepartmentKey | "All")}
            className="h-9 rounded-lg border border-gray-3 bg-gray-2 px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
          >
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d === "All" ? "All Departments" : d}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusKey | "All")}
            className="h-9 rounded-lg border border-gray-3 bg-gray-2 px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === "All"
                  ? "All Statuses"
                  : s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>

          {/* Grid / List Toggle */}
          <div className="flex rounded-lg border border-gray-3 dark:border-dark-3">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center justify-center rounded-l-lg px-3 py-2 transition-colors ${
                viewMode === "grid"
                  ? "bg-primary-600 text-white"
                  : "bg-transparent text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3"
              }`}
              aria-label="Grid view"
            >
              <svg className="size-4" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25A2.25 2.25 0 0113.5 8.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center justify-center rounded-r-lg px-3 py-2 transition-colors ${
                viewMode === "list"
                  ? "bg-primary-600 text-white"
                  : "bg-transparent text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3"
              }`}
              aria-label="List view"
            >
              <svg className="size-4" viewBox="0 0 24 24" fill="none">
                <path
                  d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Count */}
          <p className="text-xs text-dark-5 dark:text-dark-6">
            {filtered.length} results
          </p>
        </div>
      </div>

      {/* ── Employee Grid / List ── */}
      {filtered.length === 0 ? (
        <div className="rounded-xl bg-white p-10 text-center shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <p className="text-sm text-dark-5 dark:text-dark-6">
            No employees match your filters.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((employee) => (
            <EmployeeCard key={employee.id} employee={employee} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((employee) => (
            <EmployeeListRow key={employee.id} employee={employee} />
          ))}
        </div>
      )}
    </div>
  );
}
