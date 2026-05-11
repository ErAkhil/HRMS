import type { AttendanceStats } from "@/lib/actions/attendance";

interface Props { stats: AttendanceStats; }

function KpiCard({ title, value, sub, iconBg, icon }: {
  title: string; value: string | number; sub: string;
  iconBg: string; icon: React.ReactNode;
}) {
  return (
    <div className="card-p">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted">{title}</p>
          <p className="mt-1 text-2xl font-bold text-dark dark:text-white">{value}</p>
          <p className="mt-1 text-muted">{sub}</p>
        </div>
        <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBg}`}>{icon}</span>
      </div>
    </div>
  );
}

export function AttendanceKpiCards({ stats }: Readonly<Props>) {
  const checkedIn = stats.present + stats.late + stats.remote + stats.halfDay;
  const notYet = Math.max(0, stats.total - checkedIn - stats.onLeave - stats.absent);

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <KpiCard
        title="Present Today" value={checkedIn} sub={`of ${stats.total} employees`}
        iconBg="bg-emerald-light dark:bg-emerald-dark/20"
        icon={<svg className="h-5 w-5 text-emerald-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
      />
      <KpiCard
        title="Late Arrivals" value={stats.late} sub="checked in late today"
        iconBg="bg-amber-light dark:bg-amber-dark/20"
        icon={<svg className="h-5 w-5 text-amber-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
      />
      <KpiCard
        title="On Leave" value={stats.onLeave} sub="approved leaves today"
        iconBg="bg-sky-50 dark:bg-sky-dark/10"
        icon={<svg className="h-5 w-5 text-sky-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
      />
      <KpiCard
        title="Remote / WFH" value={stats.remote}
        sub={notYet > 0 ? `${notYet} not checked in yet` : "all accounted for"}
        iconBg="bg-violet-light dark:bg-violet-dark/20"
        icon={<svg className="h-5 w-5 text-violet-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
      />
    </div>
  );
}
