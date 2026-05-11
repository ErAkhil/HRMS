"use client";

import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";
import { approveLeave } from "@/lib/actions/leave";
import { useRouter } from "next/navigation";

type TeamMember = {
  id: string;
  name: string;
  avatarUrl: string | null;
  status: string;
  statusColor: string;
  checkin: string;
  department: string;
};

type DashboardData = {
  teamMembers: TeamMember[];
  teamSize: number;
  presentCount: number;
  onLeaveCount: number;
  attendancePct: number;
  pendingLeave: number;
  taskMap: Record<string, number>;
  overdueTasks: number;
  pendingReviews: number;
};

const statusBadgeClass: Record<string, string> = {
  emerald: "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  amber: "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber",
  indigo: "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-300",
  rose: "bg-rose-light text-rose-dark dark:bg-rose-dark/20 dark:text-rose",
};

const statusIcon: Record<string, string> = {
  emerald: "✅",
  amber: "🏖️",
  indigo: "🌐",
  rose: "⏰",
};

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export function ManagerDashboardClient({ data, userName }: Readonly<{ data: DashboardData; userName: string }>) {
  const { toast, setToast } = useToast();
  const router = useRouter();

  const todo = data.taskMap["TODO"] ?? 0;
  const inProgress = data.taskMap["IN_PROGRESS"] ?? 0;
  const inReview = data.taskMap["IN_REVIEW"] ?? 0;
  const done = data.taskMap["DONE"] ?? 0;
  const totalTasks = todo + inProgress + inReview + done;

  return (
    <div className="page-container">
      {/* Section 1: Greeting Header */}
      <div className="bg-gradient-to-r from-primary-600 to-violet-600 text-white rounded-xl p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3">
            <div>
              <h1 className="page-title text-white">Good morning, {userName} 👋</h1>
              <p className="text-sm text-white/70 mt-0.5">
                {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                &nbsp;|&nbsp;{data.teamSize} reports
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/tasks" className="rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 transition-colors">
                Schedule 1:1
              </Link>
              <Link href="/reports" className="rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 transition-colors">
                Team Report
              </Link>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 md:flex-col md:items-end lg:flex-row">
            {data.pendingLeave > 0 && (
              <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white border border-white/20">
                {data.pendingLeave} Pending Approvals
              </span>
            )}
            {data.overdueTasks > 0 && (
              <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white border border-white/20">
                {data.overdueTasks} Overdue Tasks
              </span>
            )}
            {data.pendingReviews > 0 && (
              <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white border border-white/20">
                {data.pendingReviews} Reviews Due
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Section 2: KPI Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
        <div className="card-p">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Team Size</p>
              <p className="mt-1.5 text-3xl font-bold text-dark dark:text-white">{data.teamSize}</p>
              <p className="text-muted mt-1">{data.onLeaveCount} on leave today</p>
            </div>
            <span className="rounded-lg bg-primary-50 p-2 text-primary-600 dark:bg-primary-900/20 dark:text-primary-300 text-lg">👥</span>
          </div>
        </div>

        <div className="card-p">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Present Today</p>
              <p className="mt-1.5 text-3xl font-bold text-dark dark:text-white">{data.presentCount}</p>
              <p className="text-muted mt-1">{data.attendancePct}% attendance</p>
            </div>
            <span className="rounded-lg bg-emerald-light p-2 text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald text-lg">✅</span>
          </div>
        </div>

        <div className="card-p">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Pending Approvals</p>
              <p className="mt-1.5 text-3xl font-bold text-dark dark:text-white">{data.pendingLeave}</p>
              <p className="text-muted mt-1">Leave requests</p>
            </div>
            <span className="rounded-lg bg-amber-light p-2 text-amber-dark dark:bg-amber-dark/20 dark:text-amber text-lg">⏳</span>
          </div>
        </div>

        <div className="card-p">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Tasks</p>
              <p className="mt-1.5 text-3xl font-bold text-dark dark:text-white">{inProgress}</p>
              <p className="text-muted mt-1">In progress</p>
            </div>
            <span className="rounded-lg bg-violet-light p-2 text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300 text-lg">🎯</span>
          </div>
          <div className="mt-3 relative h-1.5 rounded-full bg-gray-2 dark:bg-dark-3 overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-violet-500"
              style={{ width: totalTasks > 0 ? `${Math.round((done / totalTasks) * 100)}%` : "0%" }}
            />
          </div>
        </div>
      </div>

      {/* Section 3: Team Status Table + Quick Actions */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6">
        <div className="md:col-span-8 card">
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <div>
              <h2 className="section-title">Team Status Today</h2>
              <p className="text-muted">
                {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
            <Link href="/employees" className="text-xs font-medium text-primary-600 hover:underline dark:text-primary-400">View All</Link>
          </div>
          <div className="overflow-x-auto">
            {data.teamMembers.length === 0 ? (
              <p className="px-5 pb-5 text-sm text-dark-5 dark:text-dark-6">No team members found.</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="thead-row">
                    <th className="th">Member</th>
                    <th className="th">Status</th>
                    <th className="th">Check-in</th>
                    <th className="th">Department</th>
                    <th className="th text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.teamMembers.map((member) => (
                    <tr key={member.id} className="tr-body">
                      <td className="td">
                        <div className="flex items-center gap-2">
                          {member.avatarUrl ? (
                            <img src={member.avatarUrl} alt={member.name} width={28} height={28} className="rounded-full object-cover w-7 h-7" />
                          ) : (
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-600 dark:bg-primary-900/30 dark:text-primary-300">
                              {getInitials(member.name)}
                            </span>
                          )}
                          <span className="text-xs font-medium text-dark dark:text-white whitespace-nowrap">{member.name}</span>
                        </div>
                      </td>
                      <td className="td">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${statusBadgeClass[member.statusColor] ?? statusBadgeClass.rose}`}>
                          <span>{statusIcon[member.statusColor] ?? "❓"}</span>
                          {member.status}
                        </span>
                      </td>
                      <td className="td text-muted whitespace-nowrap">{member.checkin}</td>
                      <td className="td max-w-[160px]">
                        <span className="block truncate text-muted">{member.department}</span>
                      </td>
                      <td className="td text-right">
                        <Link href="/employees" className="text-xs font-semibold text-primary-600 hover:underline dark:text-primary-400">View</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="md:col-span-4 flex flex-col gap-4">
          {/* Sprint Tasks */}
          <div className="card-p">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">Sprint Tasks</h2>
              <Link href="/tasks/kanban" className="text-xs font-medium text-primary-600 hover:underline dark:text-primary-400">View Kanban →</Link>
            </div>
            <div className="space-y-3">
              {[
                { label: "To Do", count: todo, color: "bg-primary-500", max: Math.max(todo, 1) },
                { label: "In Progress", count: inProgress, color: "bg-violet-500", max: Math.max(inProgress, 1) },
                { label: "In Review", count: inReview, color: "bg-amber-500", max: Math.max(inReview, 1) },
                { label: "Completed", count: done, color: "bg-emerald-500", max: Math.max(done, 1) },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-dark dark:text-white">{item.label}</span>
                    <span className="text-muted">{item.count} tasks</span>
                  </div>
                  <div className="relative h-1.5 rounded-full bg-gray-2 dark:bg-dark-3 overflow-hidden">
                    <div
                      className={`absolute inset-y-0 left-0 rounded-full ${item.color}`}
                      style={{ width: totalTasks > 0 ? `${Math.round((item.count / totalTasks) * 100)}%` : "0%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
            {data.overdueTasks > 0 && (
              <div className="mt-4 flex items-center justify-between border-t border-gray-3 pt-3 dark:border-dark-3">
                <span className="text-xs font-semibold text-rose-dark dark:text-rose">Overdue: {data.overdueTasks}</span>
                <Link href="/tasks" className="text-xs font-semibold text-primary-600 hover:underline dark:text-primary-400">View →</Link>
              </div>
            )}
          </div>

          {/* Manager Actions */}
          <div className="card-p">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">Manager Actions</h2>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              <Link href="/reports" className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-3 p-3 text-xs font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3 transition-colors">
                <span className="text-lg">📋</span>
                <span className="text-center leading-tight">View Reports</span>
              </Link>
              <Link href="/tasks" className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-3 p-3 text-xs font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3 transition-colors">
                <span className="text-lg">📅</span>
                <span className="text-center leading-tight">My Tasks</span>
              </Link>
              <Link href="/leave/approvals" className="flex flex-col items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-light p-3 text-xs font-medium text-emerald-dark hover:bg-emerald-500 hover:text-white dark:border-emerald-800 dark:bg-emerald-dark/20 dark:text-emerald transition-colors">
                <span className="text-lg">✅</span>
                <span className="text-center leading-tight">Approvals</span>
              </Link>
              <Link href="/performance/analytics" className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-3 p-3 text-xs font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3 transition-colors">
                <span className="text-lg">📊</span>
                <span className="text-center leading-tight">Analytics</span>
              </Link>
              <Link href="/performance" className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-3 p-3 text-xs font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3 transition-colors">
                <span className="text-lg">🎯</span>
                <span className="text-center leading-tight">Set Goals</span>
              </Link>
              <Link href="/collaboration/messages" className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-3 p-3 text-xs font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3 transition-colors">
                <span className="text-lg">📨</span>
                <span className="text-center leading-tight">Messages</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Toast message={toast} />
    </div>
  );
}
