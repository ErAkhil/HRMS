"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";
import { useSocket } from "@/hooks/use-socket";
import type { AttendanceStatusChangePayload } from "@/lib/attendance-live";

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

const statusMetaByAttendanceStatus: Record<string, { status: string; statusColor: string }> = {
  PRESENT: { status: "Present", statusColor: "emerald" },
  LATE: { status: "Late", statusColor: "rose" },
  REMOTE: { status: "Remote", statusColor: "indigo" },
  ON_LEAVE: { status: "On Leave", statusColor: "amber" },
  ABSENT: { status: "Absent", statusColor: "rose" },
  HALF_DAY: { status: "Half Day", statusColor: "amber" },
};

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

type DashboardMetrics = {
  todo: number;
  inProgress: number;
  inReview: number;
  done: number;
  totalTasks: number;
};

type TaskBucket = {
  label: string;
  count: number;
  color: string;
};

const MANAGER_ACTIONS = [
  { href: "/reports", icon: "📋", label: "View Reports", className: "border-gray-3 text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3" },
  { href: "/tasks", icon: "📅", label: "My Tasks", className: "border-gray-3 text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3" },
  { href: "/leave/approvals", icon: "✅", label: "Approvals", className: "border-emerald-200 bg-emerald-light text-emerald-dark hover:bg-emerald-500 hover:text-white dark:border-emerald-800 dark:bg-emerald-dark/20 dark:text-emerald" },
  { href: "/performance/analytics", icon: "📊", label: "Analytics", className: "border-gray-3 text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3" },
  { href: "/performance", icon: "🎯", label: "Set Goals", className: "border-gray-3 text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3" },
  { href: "/collaboration/messages", icon: "📨", label: "Messages", className: "border-gray-3 text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3" },
] as const;

function KpiCard({
  label,
  value,
  subtitle,
  icon,
  iconClass,
}: Readonly<{ label: string; value: number; subtitle: string; icon: string; iconClass: string }>) {
  return (
    <div className="card-p">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">{label}</p>
          <p className="mt-1.5 text-3xl font-bold text-dark dark:text-white">{value}</p>
          <p className="text-muted mt-1">{subtitle}</p>
        </div>
        <span className={`rounded-lg p-2 text-lg ${iconClass}`}>{icon}</span>
      </div>
    </div>
  );
}

function HeaderAlertPills({
  pendingLeave,
  overdueTasks,
  pendingReviews,
}: Readonly<{ pendingLeave: number; overdueTasks: number; pendingReviews: number }>) {
  return (
    <div className="flex flex-wrap gap-2 md:flex-col md:items-end lg:flex-row">
      {pendingLeave > 0 && <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white border border-white/20">{pendingLeave} Pending Approvals</span>}
      {overdueTasks > 0 && <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white border border-white/20">{overdueTasks} Overdue Tasks</span>}
      {pendingReviews > 0 && <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white border border-white/20">{pendingReviews} Reviews Due</span>}
    </div>
  );
}

function DashboardHeader({
  userName,
  teamSize,
  pendingLeave,
  overdueTasks,
  pendingReviews,
}: Readonly<{ userName: string; teamSize: number; pendingLeave: number; overdueTasks: number; pendingReviews: number }>) {
  return (
    <div className="bg-gradient-to-r from-primary-600 to-violet-600 text-white rounded-xl p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3">
          <div>
            <h1 className="page-title text-white">Good morning, {userName} 👋</h1>
            <p className="text-sm text-white/70 mt-0.5">
              {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              &nbsp;|&nbsp;{teamSize} reports
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/tasks" className="rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 transition-colors">Schedule 1:1</Link>
            <Link href="/reports" className="rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 transition-colors">Team Report</Link>
          </div>
        </div>
        <HeaderAlertPills pendingLeave={pendingLeave} overdueTasks={overdueTasks} pendingReviews={pendingReviews} />
      </div>
    </div>
  );
}

function KpiRow({ data, metrics }: Readonly<{ data: DashboardData; metrics: DashboardMetrics }>) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
      <KpiCard label="Team Size" value={data.teamSize} subtitle={`${data.onLeaveCount} on leave today`} icon="👥" iconClass="bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-300" />
      <KpiCard label="Present Today" value={data.presentCount} subtitle={`${data.attendancePct}% attendance`} icon="✅" iconClass="bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald" />
      <KpiCard label="Pending Approvals" value={data.pendingLeave} subtitle="Leave requests" icon="⏳" iconClass="bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber" />
      <div className="card-p">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Tasks</p>
            <p className="mt-1.5 text-3xl font-bold text-dark dark:text-white">{metrics.inProgress}</p>
            <p className="text-muted mt-1">In progress</p>
          </div>
          <span className="rounded-lg bg-violet-light p-2 text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300 text-lg">🎯</span>
        </div>
        <div className="mt-3 relative h-1.5 rounded-full bg-gray-2 dark:bg-dark-3 overflow-hidden">
          <div className="absolute inset-y-0 left-0 rounded-full bg-violet-500" style={{ width: metrics.totalTasks > 0 ? `${Math.round((metrics.done / metrics.totalTasks) * 100)}%` : "0%" }} />
        </div>
      </div>
    </div>
  );
}

function TeamMemberRow({ member }: Readonly<{ member: TeamMember }>) {
  return (
    <tr className="tr-body">
      <td className="td">
        <div className="flex items-center gap-2">
          {member.avatarUrl ? (
            <Image src={member.avatarUrl} alt={member.name} width={28} height={28} className="rounded-full object-cover w-7 h-7" />
          ) : (
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-600 dark:bg-primary-900/30 dark:text-primary-300">{getInitials(member.name)}</span>
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
      <td className="td max-w-[160px]"><span className="block truncate text-muted">{member.department}</span></td>
      <td className="td text-right"><Link href="/employees" className="text-xs font-semibold text-primary-600 hover:underline dark:text-primary-400">View</Link></td>
    </tr>
  );
}

function TeamStatusCard({ teamMembers }: Readonly<{ teamMembers: TeamMember[] }>) {
  return (
    <div className="md:col-span-8 card">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div>
          <h2 className="section-title">Team Status Today</h2>
          <p className="text-muted">{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
        </div>
        <Link href="/employees" className="text-xs font-medium text-primary-600 hover:underline dark:text-primary-400">View All</Link>
      </div>
      <div className="overflow-x-auto">
        {teamMembers.length === 0 ? (
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
            <tbody>{teamMembers.map((member) => <TeamMemberRow key={member.id} member={member} />)}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function SprintTasksCard({ metrics, overdueTasks }: Readonly<{ metrics: DashboardMetrics; overdueTasks: number }>) {
  const taskBuckets: readonly TaskBucket[] = [
    { label: "To Do", count: metrics.todo, color: "bg-primary-500" },
    { label: "In Progress", count: metrics.inProgress, color: "bg-violet-500" },
    { label: "In Review", count: metrics.inReview, color: "bg-amber-500" },
    { label: "Completed", count: metrics.done, color: "bg-emerald-500" },
  ];

  return (
    <div className="card-p">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">Sprint Tasks</h2>
        <Link href="/tasks/kanban" className="text-xs font-medium text-primary-600 hover:underline dark:text-primary-400">View Kanban →</Link>
      </div>
      <div className="space-y-3">
        {taskBuckets.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-dark dark:text-white">{item.label}</span>
              <span className="text-muted">{item.count} tasks</span>
            </div>
            <div className="relative h-1.5 rounded-full bg-gray-2 dark:bg-dark-3 overflow-hidden">
              <div className={`absolute inset-y-0 left-0 rounded-full ${item.color}`} style={{ width: metrics.totalTasks > 0 ? `${Math.round((item.count / metrics.totalTasks) * 100)}%` : "0%" }} />
            </div>
          </div>
        ))}
      </div>
      {overdueTasks > 0 && (
        <div className="mt-4 flex items-center justify-between border-t border-gray-3 pt-3 dark:border-dark-3">
          <span className="text-xs font-semibold text-rose-dark dark:text-rose">Overdue: {overdueTasks}</span>
          <Link href="/tasks" className="text-xs font-semibold text-primary-600 hover:underline dark:text-primary-400">View →</Link>
        </div>
      )}
    </div>
  );
}

function ManagerActionsCard() {
  return (
    <div className="card-p">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">Manager Actions</h2>
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {MANAGER_ACTIONS.map((action) => (
          <Link key={action.href} href={action.href} className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-medium transition-colors ${action.className}`}>
            <span className="text-lg">{action.icon}</span>
            <span className="text-center leading-tight">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function SidePanel({ metrics, overdueTasks }: Readonly<{ metrics: DashboardMetrics; overdueTasks: number }>) {
  return (
    <div className="md:col-span-4 flex flex-col gap-4">
      <SprintTasksCard metrics={metrics} overdueTasks={overdueTasks} />
      <ManagerActionsCard />
    </div>
  );
}

export function ManagerDashboardClient({ data, userName }: Readonly<{ data: DashboardData; userName: string }>) {
  const { toast } = useToast();
  const [liveData, setLiveData] = useState<DashboardData>(data);

  const metrics: DashboardMetrics = useMemo(() => ({
    todo: liveData.taskMap["TODO"] ?? 0,
    inProgress: liveData.taskMap["IN_PROGRESS"] ?? 0,
    inReview: liveData.taskMap["IN_REVIEW"] ?? 0,
    done: liveData.taskMap["DONE"] ?? 0,
    totalTasks:
      (liveData.taskMap["TODO"] ?? 0)
      + (liveData.taskMap["IN_PROGRESS"] ?? 0)
      + (liveData.taskMap["IN_REVIEW"] ?? 0)
      + (liveData.taskMap["DONE"] ?? 0),
  }), [liveData.taskMap]);

  const recalcSummary = useCallback((teamMembers: TeamMember[]) => {
    const presentCount = teamMembers.filter((m) => m.status === "Present" || m.status === "Remote").length;
    const onLeaveCount = teamMembers.filter((m) => m.status === "On Leave").length;
    const teamSize = teamMembers.length;
    const attendancePct = teamSize > 0 ? Math.round((presentCount / teamSize) * 100) : 0;

    return { presentCount, onLeaveCount, attendancePct };
  }, []);

  const onAttendanceCheckIn = useCallback((eventData: unknown) => {
    const payload = (eventData ?? {}) as { employeeId?: string; checkIn?: string | null; status?: string | null };
    if (!payload.employeeId) return;

    setLiveData((prev) => {
      const teamMembers = prev.teamMembers.map((member) => {
        if (member.id !== payload.employeeId) return member;

        const meta = statusMetaByAttendanceStatus[payload.status ?? "PRESENT"] ?? statusMetaByAttendanceStatus.PRESENT;
        const checkin = payload.checkIn
          ? new Date(payload.checkIn).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
          : member.checkin;

        return {
          ...member,
          status: meta.status,
          statusColor: meta.statusColor,
          checkin,
        };
      });

      return {
        ...prev,
        teamMembers,
        ...recalcSummary(teamMembers),
      };
    });
  }, [recalcSummary]);

  const onAttendanceStatusChanged = useCallback((eventData: unknown) => {
    const payload = (eventData ?? {}) as AttendanceStatusChangePayload;
    if (!payload.employeeId || !payload.status) return;

    setLiveData((prev) => {
      const teamMembers = prev.teamMembers.map((member) => {
        if (member.id !== payload.employeeId) return member;

        const meta = statusMetaByAttendanceStatus[payload.status ?? "ABSENT"] ?? statusMetaByAttendanceStatus.ABSENT;
        return {
          ...member,
          status: meta.status,
          statusColor: meta.statusColor,
          checkin: payload.status === "ABSENT" || payload.status === "ON_LEAVE" ? "—" : member.checkin,
        };
      });

      return {
        ...prev,
        teamMembers,
        ...recalcSummary(teamMembers),
      };
    });
  }, [recalcSummary]);

  useSocket({
    "attendance:checkin": onAttendanceCheckIn,
    "attendance:status-changed": onAttendanceStatusChanged,
  });

  return (
    <div className="page-container">
      <DashboardHeader
        userName={userName}
        teamSize={liveData.teamSize}
        pendingLeave={liveData.pendingLeave}
        overdueTasks={liveData.overdueTasks}
        pendingReviews={liveData.pendingReviews}
      />
      <KpiRow data={liveData} metrics={metrics} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6">
        <TeamStatusCard teamMembers={liveData.teamMembers} />
        <SidePanel metrics={metrics} overdueTasks={liveData.overdueTasks} />
      </div>

      <Toast message={toast} />
    </div>
  );
}
