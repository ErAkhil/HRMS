"use client";

import Image from "next/image";
import { useState } from "react";

type Priority = "High" | "Medium" | "Low";
type ColumnKey = "todo" | "inprogress" | "review" | "done";

interface KanbanTask {
  id: string;
  title: string;
  project: string;
  projectColor: string;
  priority: Priority;
  dueDate: string;
  overdue?: boolean;
  avatar: string;
  comments: number;
  attachments: number;
  subtasks?: { done: number; total: number };
}

interface KanbanColumn {
  key: ColumnKey;
  label: string;
  headerColor: string;
  dotColor: string;
  tasks: KanbanTask[];
}

const PRIORITY_CONFIG: Record<
  Priority,
  { dot: string; bg: string; text: string }
> = {
  High: {
    dot: "bg-rose-dark",
    bg: "bg-rose-light dark:bg-rose-dark/20",
    text: "text-rose-dark",
  },
  Medium: {
    dot: "bg-amber-dark",
    bg: "bg-amber-light dark:bg-amber-dark/20",
    text: "text-amber-dark",
  },
  Low: {
    dot: "bg-emerald-dark",
    bg: "bg-emerald-light dark:bg-emerald-dark/20",
    text: "text-emerald-dark dark:text-emerald",
  },
};

const PROJECT_COLORS: Record<string, string> = {
  indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300",
  emerald: "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  violet: "bg-violet-light text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300",
  amber: "bg-amber-light text-amber-dark",
  sky: "bg-sky-50 text-sky-dark dark:bg-sky-dark/10 dark:text-sky",
  rose: "bg-rose-light text-rose-dark",
};

const COLUMNS: KanbanColumn[] = [
  {
    key: "todo",
    label: "To Do",
    headerColor: "border-gray-4",
    dotColor: "bg-gray-4",
    tasks: [
      {
        id: "td1",
        title: "Finalize Q3 headcount forecast model",
        project: "Analytics",
        projectColor: "indigo",
        priority: "High",
        dueDate: "May 15",
        avatar: "/images/user/user-01.png",
        comments: 2,
        attachments: 1,
        subtasks: { done: 0, total: 4 },
      },
      {
        id: "td2",
        title: "Draft updated remote work policy section",
        project: "HR Policies",
        projectColor: "emerald",
        priority: "Medium",
        dueDate: "May 18",
        avatar: "/images/user/user-02.png",
        comments: 0,
        attachments: 2,
      },
      {
        id: "td3",
        title: "Design interview scorecard template",
        project: "Recruitment",
        projectColor: "violet",
        priority: "Medium",
        dueDate: "May 20",
        avatar: "/images/user/user-03.png",
        comments: 1,
        attachments: 0,
      },
      {
        id: "td4",
        title: "Research new LMS vendors for compliance training",
        project: "Compliance",
        projectColor: "rose",
        priority: "Low",
        dueDate: "May 22",
        avatar: "/images/user/user-04.png",
        comments: 3,
        attachments: 1,
      },
    ],
  },
  {
    key: "inprogress",
    label: "In Progress",
    headerColor: "border-indigo-600",
    dotColor: "bg-indigo-600",
    tasks: [
      {
        id: "ip1",
        title: "Build onboarding automation workflow",
        project: "Onboarding",
        projectColor: "emerald",
        priority: "High",
        dueDate: "May 12",
        avatar: "/images/user/user-05.png",
        comments: 8,
        attachments: 3,
        subtasks: { done: 3, total: 6 },
      },
      {
        id: "ip2",
        title: "Review JDs for 3 Engineering roles",
        project: "Recruitment",
        projectColor: "violet",
        priority: "High",
        dueDate: "May 9",
        overdue: true,
        avatar: "/images/user/user-06.png",
        comments: 4,
        attachments: 2,
      },
      {
        id: "ip3",
        title: "Migrate employee records to new HRMS",
        project: "HRMS Migration",
        projectColor: "sky",
        priority: "High",
        dueDate: "May 14",
        avatar: "/images/user/user-07.png",
        comments: 6,
        attachments: 5,
        subtasks: { done: 2, total: 8 },
      },
      {
        id: "ip4",
        title: "Create Q2 benefits enrollment comms",
        project: "Benefits",
        projectColor: "amber",
        priority: "Medium",
        dueDate: "May 13",
        avatar: "/images/user/user-08.png",
        comments: 2,
        attachments: 1,
      },
      {
        id: "ip5",
        title: "Analyze attrition data for Engineering dept",
        project: "Analytics",
        projectColor: "indigo",
        priority: "Medium",
        dueDate: "May 16",
        avatar: "/images/user/user-09.png",
        comments: 1,
        attachments: 2,
        subtasks: { done: 1, total: 3 },
      },
    ],
  },
  {
    key: "review",
    label: "Review",
    headerColor: "border-amber-dark",
    dotColor: "bg-amber-dark",
    tasks: [
      {
        id: "rv1",
        title: "Employee handbook 2026 full draft",
        project: "HR Policies",
        projectColor: "emerald",
        priority: "High",
        dueDate: "May 10",
        overdue: true,
        avatar: "/images/user/user-10.png",
        comments: 12,
        attachments: 4,
        subtasks: { done: 5, total: 6 },
      },
      {
        id: "rv2",
        title: "Compensation benchmarking report",
        project: "Benefits",
        projectColor: "amber",
        priority: "High",
        dueDate: "May 11",
        avatar: "/images/user/user-11.png",
        comments: 5,
        attachments: 2,
      },
      {
        id: "rv3",
        title: "New hire offer letter templates",
        project: "Recruitment",
        projectColor: "violet",
        priority: "Medium",
        dueDate: "May 14",
        avatar: "/images/user/user-12.png",
        comments: 3,
        attachments: 1,
      },
      {
        id: "rv4",
        title: "Data privacy audit for HRMS migration",
        project: "Compliance",
        projectColor: "rose",
        priority: "High",
        dueDate: "May 15",
        avatar: "/images/user/user-01.png",
        comments: 7,
        attachments: 6,
        subtasks: { done: 3, total: 4 },
      },
    ],
  },
  {
    key: "done",
    label: "Done",
    headerColor: "border-emerald-dark",
    dotColor: "bg-emerald-dark",
    tasks: [
      {
        id: "dn1",
        title: "Q1 performance review cycle close-out",
        project: "Performance",
        projectColor: "indigo",
        priority: "High",
        dueDate: "Apr 30",
        avatar: "/images/user/user-02.png",
        comments: 4,
        attachments: 2,
      },
      {
        id: "dn2",
        title: "Compliance training Q2 rollout",
        project: "Compliance",
        projectColor: "rose",
        priority: "High",
        dueDate: "Apr 28",
        avatar: "/images/user/user-03.png",
        comments: 9,
        attachments: 3,
        subtasks: { done: 8, total: 8 },
      },
      {
        id: "dn3",
        title: "April payroll reconciliation",
        project: "Benefits",
        projectColor: "amber",
        priority: "High",
        dueDate: "May 2",
        avatar: "/images/user/user-04.png",
        comments: 2,
        attachments: 5,
      },
      {
        id: "dn4",
        title: "Publish internal job postings — May batch",
        project: "Recruitment",
        projectColor: "violet",
        priority: "Medium",
        dueDate: "May 1",
        avatar: "/images/user/user-05.png",
        comments: 1,
        attachments: 1,
      },
    ],
  },
];

function KanbanCard({ task, done }: { task: KanbanTask; done?: boolean }) {
  const p = PRIORITY_CONFIG[task.priority];

  return (
    <div
      className={`group rounded-xl bg-white p-4 shadow-card transition-shadow hover:shadow-floating dark:border dark:border-dark-3 dark:bg-dark-2 ${
        done ? "opacity-70" : ""
      }`}
    >
      {/* Priority badge */}
      <div className="mb-3 flex items-center justify-between">
        <span
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${p.bg} ${p.text}`}
        >
          <span className={`size-1.5 rounded-full ${p.dot}`} />
          {task.priority}
        </span>
        <button className="flex size-6 items-center justify-center rounded text-dark-5 opacity-0 transition-opacity hover:bg-gray-2 group-hover:opacity-100 dark:text-dark-6 dark:hover:bg-dark-3">
          <svg className="size-4" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Title */}
      <p
        className={`mb-2 text-sm font-semibold leading-snug ${
          done
            ? "line-through text-dark-5 dark:text-dark-6"
            : "text-dark dark:text-white"
        }`}
      >
        {task.title}
      </p>

      {/* Project tag */}
      <span
        className={`mb-3 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
          PROJECT_COLORS[task.projectColor] ?? "bg-gray-2 text-dark-5"
        }`}
      >
        {task.project}
      </span>

      {/* Subtask progress bar */}
      {task.subtasks && (
        <div className="mb-3">
          <div className="mb-1 flex items-center justify-between text-xs text-dark-5 dark:text-dark-6">
            <span>Subtasks</span>
            <span>
              {task.subtasks.done}/{task.subtasks.total}
            </span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-gray-3 dark:bg-dark-3">
            <div
              className="h-full rounded-full bg-primary-600"
              style={{
                width: `${(task.subtasks.done / task.subtasks.total) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-xs text-dark-5 dark:text-dark-6">
          <span
            className={`flex items-center gap-1 ${
              task.overdue ? "font-semibold text-rose-dark" : ""
            }`}
          >
            <svg className="size-3" viewBox="0 0 24 24" fill="none">
              <path
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {task.dueDate}
          </span>
          {task.comments > 0 && (
            <span className="flex items-center gap-1">
              <svg className="size-3" viewBox="0 0 24 24" fill="none">
                <path
                  d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {task.comments}
            </span>
          )}
          {task.attachments > 0 && (
            <span className="flex items-center gap-1">
              <svg className="size-3" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {task.attachments}
            </span>
          )}
        </div>
        <Image
          src={task.avatar}
          alt=""
          width={24}
          height={24}
          className="size-6 rounded-full ring-2 ring-white dark:ring-dark-2"
        />
      </div>
    </div>
  );
}

const PROJECTS = [
  "All Projects",
  "Q2 Workforce Analytics",
  "HRMS Migration",
  "Employee Portal Redesign",
  "Benefits Package Review",
  "Compliance Training Q2",
];

export default function KanbanPage() {
  const [selectedProject, setSelectedProject] = useState("All Projects");

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-dark dark:text-white">
            Kanban Board
          </h1>
          <p className="text-xs text-dark-5 dark:text-dark-6">
            Visualize and manage your workflow
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="h-9 rounded-lg border border-gray-3 bg-gray-2 px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
          >
            {PROJECTS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <button className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700">
            + Add Task
          </button>
        </div>
      </div>

      {/* Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex min-w-max gap-4">
          {COLUMNS.map((col) => (
            <div key={col.key} className="flex w-72 flex-shrink-0 flex-col">
              {/* Column header */}
              <div
                className={`mb-3 flex items-center justify-between rounded-xl border-l-4 bg-white px-4 py-3 shadow-card dark:border-dark-3 dark:bg-dark-2 ${col.headerColor}`}
              >
                <div className="flex items-center gap-2">
                  <span className={`size-2.5 rounded-full ${col.dotColor}`} />
                  <span className="text-sm font-semibold text-dark dark:text-white">
                    {col.label}
                  </span>
                  <span className="rounded-full bg-gray-2 px-2 py-0.5 text-xs font-medium text-dark-5 dark:bg-dark-3 dark:text-dark-6">
                    {col.tasks.length}
                  </span>
                </div>
                <button className="flex size-7 items-center justify-center rounded-lg text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3">
                  <svg className="size-4" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 5v14m-7-7h14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-3">
                {col.tasks.map((task) => (
                  <KanbanCard
                    key={task.id}
                    task={task}
                    done={col.key === "done"}
                  />
                ))}

                {/* Add card button */}
                <button className="flex items-center gap-2 rounded-xl border-2 border-dashed border-gray-3 px-4 py-3 text-sm text-dark-5 transition-colors hover:border-primary-600 hover:text-primary-600 dark:border-dark-3 dark:text-dark-6 dark:hover:border-primary-600 dark:hover:text-primary-300">
                  <svg className="size-4" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 5v14m-7-7h14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  Add task
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
