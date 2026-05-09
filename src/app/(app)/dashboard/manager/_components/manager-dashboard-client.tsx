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
  indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300",
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
    <div className="space-y-4 md:space-y-6">
      {/* Section 1: Greeting Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3">
            <div>
              <h1 className="text-xl font-bold text-white">Good morning, {userName} 👋</h1>
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
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Team Size</p>
              <p className="mt-1.5 text-3xl font-bold text-dark dark:text-white">{data.teamSize}</p>
              <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">{data.onLeaveCount} on leave today</p>
            </div>
            <span className="rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300 text-lg">👥</span>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Present Today</p>
              <p className="mt-1.5 text-3xl font-bold text-dark dark:text-white">{data.presentCount}</p>
              <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">{data.attendancePct}% attendance</p>
            </div>
            <span className="rounded-lg bg-emerald-light p-2 text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald text-lg">✅</span>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Pending Approvals</p>
              <p className="mt-1.5 text-3xl font-bold text-dark dark:text-white">{data.pendingLeave}</p>
              <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">Leave requests</p>
            </div>
            <span className="rounded-lg bg-amber-light p-2 text-amber-dark dark:bg-amber-dark/20 dark:text-amber text-lg">⏳</span>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Tasks</p>
              <p className="mt-1.5 text-3xl font-bold text-dark dark:text-white">{inProgress}</p>
              <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">In progress</p>
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
        <div className="md:col-span-8 rounded-xl bg-white shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <div>
              <h2 className="font-semibold text-dark dark:text-white">Team Status Today</h2>
              <p className="text-xs text-dark-5 dark:text-dark-6">
                {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
            <Link href="/employees" className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">View All</Link>
          </div>
          <div className="overflow-x-auto">
            {data.teamMembers.length === 0 ? (
              <p className="px-5 pb-5 text-sm text-dark-5 dark:text-dark-6">No team members found.</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-3 dark:border-dark-3">
                    <th className="px-5 pb-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Member</th>
                    <th className="px-3 pb-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Status</th>
                    <th className="px-3 pb-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Check-in</th>
                    <th className="px-3 pb-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Department</th>
                    <th className="px-5 pb-2.5 text-right text-[10px] font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-3 dark:divide-dark-3">
                  {data.teamMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-1 dark:hover:bg-dark-3/40 transition-colors">
                      <td className="px-5 py-2.5">
                        <div className="flex items-center gap-2">
                          {member.avatarUrl ? (
                            <img src={member.avatarUrl} alt={member.name} width={28} height={28} className="rounded-full object-cover w-7 h-7" />
                          ) : (
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
                              {getInitials(member.name)}
                            </span>
                          )}
                          <span className="text-xs font-medium text-dark dark:text-white whitespace-nowrap">{member.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${statusBadgeClass[member.statusColor] ?? statusBadgeClass.rose}`}>
                          <span>{statusIcon[member.statusColor] ?? "❓"}</span>
                          {member.status}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-xs text-dark-5 dark:text-dark-6 whitespace-nowrap">{member.checkin}</td>
                      <td className="px-3 py-2.5 max-w-[160px]">
                        <span className="block truncate text-xs text-dark-5 dark:text-dark-6">{member.department}</span>
                      </td>
                      <td className="px-5 py-2.5 text-right">
                        <Link href="/employees" className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400">View</Link>
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
          <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-dark dark:text-white">Sprint Tasks</h2>
              <Link href="/tasks/kanban" className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">View Kanban →</Link>
            </div>
            <div className="space-y-3">
              {[
                { label: "To Do", count: todo, color: "bg-indigo-500", max: Math.max(todo, 1) },
                { label: "In Progress", count: inProgress, color: "bg-violet-500", max: Math.max(inProgress, 1) },
                { label: "In Review", count: inReview, color: "bg-amber-500", max: Math.max(inReview, 1) },
                { label: "Completed", count: done, color: "bg-emerald-500", max: Math.max(done, 1) },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-dark dark:text-white">{item.label}</span>
                    <span className="text-xs text-dark-5 dark:text-dark-6">{item.count} tasks</span>
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
                <Link href="/tasks" className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400">View →</Link>
              </div>
            )}
          </div>

          {/* Manager Actions */}
          <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-dark dark:text-white">Manager Actions</h2>
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
