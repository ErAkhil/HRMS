import Image from "next/image";
import Link from "next/link";
import { TEAM_MEMBERS, TEAM_GOALS, TOP_PERFORMERS } from "../performance-data";

export function TeamTab() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
      <div className="md:col-span-5">
        <div className="card-p">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="section-title">Team Performance</h2>
              <p className="mt-0.5 text-muted">Engineering Team &middot; 12 members</p>
            </div>
          </div>
          <div className="space-y-4">
            {TEAM_MEMBERS.map((member) => (
              <div key={member.name} className="flex items-center gap-3">
                <Image src={member.avatar} alt={member.name} width={36} height={36} className="h-9 w-9 rounded-full object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <span className="text-sm font-medium text-dark dark:text-white">{member.name}</span>
                      <span className="ml-2 text-muted">{member.role}</span>
                    </div>
                    <span className="text-sm font-semibold text-dark dark:text-white">{member.score}/100</span>
                  </div>
                  <div className="relative h-1.5 rounded-full bg-gray-2 dark:bg-dark-3 overflow-hidden">
                    <div className={`absolute inset-y-0 left-0 rounded-full ${member.barColor}`} style={{ width: `${member.score}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-gray-3 pt-4 dark:border-dark-3">
            <span className="text-sm font-semibold text-dark dark:text-white">Team Average: 85.2 / 100</span>
            <Link href="/performance/analytics" className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">View Full Analytics →</Link>
          </div>
        </div>
      </div>

      <div className="md:col-span-7 flex flex-col gap-4">
        <div className="card-p">
          <h2 className="mb-4 section-title">Team Goals Status</h2>
          <div className="space-y-4">
            {TEAM_GOALS.map((goal) => (
              <div key={goal.title}>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2 min-w-0">
                    <span className="text-sm font-medium text-dark dark:text-white truncate">{goal.title}</span>
                    <span className="badge-indigo flex-shrink-0">{goal.dept}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs font-semibold text-dark dark:text-white">{goal.progress}%</span>
                    <span className={goal.statusBadge}>{goal.status}</span>
                  </div>
                </div>
                <div className="relative h-1.5 rounded-full bg-gray-2 dark:bg-dark-3 overflow-hidden">
                  <div className={`absolute inset-y-0 left-0 rounded-full ${goal.barColor}`} style={{ width: `${goal.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-p">
          <h2 className="mb-4 section-title">Top Performers This Quarter</h2>
          <div className="space-y-3">
            {TOP_PERFORMERS.map((p) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="text-xl leading-none">{p.rank}</span>
                <Image src={p.avatar} alt={p.name} width={36} height={36} className="h-9 w-9 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-dark dark:text-white">{p.name}</span>
                    <span className="badge-indigo">{p.dept}</span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="text-muted">{p.score}/100</span>
                    <span className="badge-success">{p.delta}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
