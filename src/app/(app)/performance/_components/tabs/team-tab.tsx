import Image from "next/image";
import Link from "next/link";
import type { TeamPerformanceSummary } from "@/lib/actions/performance";

const BAR_COLORS = ["bg-primary-600", "bg-primary-500", "bg-primary-400", "bg-emerald-500", "bg-violet-500", "bg-amber-500"];

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function goalStatusBadge(status: string, progress: number) {
  if (progress >= 80) return "badge-success";
  if (progress >= 50) return "badge-ai";
  return "badge-warning";
}

function goalStatusLabel(status: string, progress: number) {
  if (progress >= 80) return "Near Complete";
  if (progress >= 50) return "In Progress";
  return "Getting Started";
}

function goalBarColor(progress: number) {
  if (progress >= 80) return "bg-emerald-500";
  if (progress >= 50) return "bg-primary-500";
  return "bg-amber-500";
}

interface Props {
  teamData: TeamPerformanceSummary | null;
}

export function TeamTab({ teamData }: Readonly<Props>) {
  if (!teamData) {
    return (
      <div className="card-p py-10 text-center">
        <p className="text-sm text-dark-5 dark:text-dark-6">Team performance data unavailable.</p>
      </div>
    );
  }

  const MEDALS = ["🥇", "🥈", "🥉", "4.", "5."];

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
      <div className="md:col-span-5">
        <div className="card-p">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="section-title">Team Performance</h2>
              <p className="mt-0.5 text-muted">{teamData.teamMembers.length} members</p>
            </div>
          </div>
          {teamData.teamMembers.length === 0 ? (
            <p className="text-sm text-dark-5 dark:text-dark-6">No team members with reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {teamData.teamMembers.map((member, i) => (
                <div key={member.id} className="flex items-center gap-3">
                  {member.avatarUrl ? (
                    <Image src={member.avatarUrl} alt={member.name} width={36} height={36} className="h-9 w-9 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                      {getInitials(member.name)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <span className="text-sm font-medium text-dark dark:text-white">{member.name}</span>
                        <span className="ml-2 text-muted">{member.role}</span>
                      </div>
                      <span className="text-sm font-semibold text-dark dark:text-white">
                        {member.score !== null ? `${member.score}/100` : "—"}
                      </span>
                    </div>
                    <div className="relative h-1.5 rounded-full bg-gray-2 dark:bg-dark-3 overflow-hidden">
                      <div
                        className={`absolute inset-y-0 left-0 rounded-full ${BAR_COLORS[i % BAR_COLORS.length]}`}
                        style={{ width: `${member.score ?? 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-5 flex items-center justify-between border-t border-gray-3 pt-4 dark:border-dark-3">
            <span className="text-sm font-semibold text-dark dark:text-white">
              Team Average: {teamData.avgScore > 0 ? `${teamData.avgScore} / 100` : "No data"}
            </span>
            <Link href="/performance/analytics" className="text-xs font-medium text-primary-600 hover:underline dark:text-primary-400">
              View Full Analytics →
            </Link>
          </div>
        </div>
      </div>

      <div className="md:col-span-7 flex flex-col gap-4">
        <div className="card-p">
          <h2 className="mb-4 section-title">Team Goals Status</h2>
          {teamData.teamGoals.length === 0 ? (
            <p className="text-sm text-dark-5 dark:text-dark-6">No active team goals.</p>
          ) : (
            <div className="space-y-4">
              {teamData.teamGoals.map((goal) => (
                <div key={goal.id}>
                  <div className="mb-1.5 flex items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2 min-w-0">
                      <span className="text-sm font-medium text-dark dark:text-white truncate">{goal.title}</span>
                      <span className="badge-ai flex-shrink-0">{goal.dept}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs font-semibold text-dark dark:text-white">{goal.progress}%</span>
                      <span className={goalStatusBadge(goal.status, goal.progress)}>
                        {goalStatusLabel(goal.status, goal.progress)}
                      </span>
                    </div>
                  </div>
                  <div className="relative h-1.5 rounded-full bg-gray-2 dark:bg-dark-3 overflow-hidden">
                    <div
                      className={`absolute inset-y-0 left-0 rounded-full ${goalBarColor(goal.progress)}`}
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card-p">
          <h2 className="mb-4 section-title">Top Performers</h2>
          {teamData.topPerformers.length === 0 ? (
            <p className="text-sm text-dark-5 dark:text-dark-6">No completed reviews yet.</p>
          ) : (
            <div className="space-y-3">
              {teamData.topPerformers.map((p, idx) => (
                <div key={p.id} className="flex items-center gap-3">
                  <span className="text-xl leading-none w-7 shrink-0 text-center">{MEDALS[idx] ?? `${idx + 1}.`}</span>
                  {p.avatarUrl ? (
                    <Image src={p.avatarUrl} alt={p.name} width={36} height={36} className="h-9 w-9 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                      {getInitials(p.name)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-dark dark:text-white">{p.name}</span>
                      <span className="badge-ai">{p.dept}</span>
                    </div>
                    <p className="mt-0.5 text-muted">{p.score}/100</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
