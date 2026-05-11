import type { AttendanceStats } from "@/lib/actions/attendance";

interface Props { stats: AttendanceStats; }

export function LiveStatusPanel({ stats }: Readonly<Props>) {
  const checkedIn = stats.present + stats.late + stats.remote + stats.halfDay;
  const total = stats.total || 1;

  const segments = [
    { pct: (stats.present / total) * 100, color: "#10B981", label: "Present", count: stats.present },
    { pct: (stats.remote / total) * 100, color: "#8B5CF6", label: "Remote", count: stats.remote },
    { pct: (stats.onLeave / total) * 100, color: "#38BDF8", label: "On Leave", count: stats.onLeave },
    { pct: (stats.late / total) * 100, color: "#F59E0B", label: "Late", count: stats.late },
    { pct: (stats.absent / total) * 100, color: "#F43F5E", label: "Absent", count: stats.absent },
  ];

  const dotColors = ["bg-emerald", "bg-violet-500", "bg-sky", "bg-amber", "bg-rose-500"];

  let cumulative = 0;
  const r = 15.915;
  const circumference = 2 * Math.PI * r;

  return (
    <div className="card-p h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="section-title">Live Status</h3>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-emerald animate-pulse" />
          <span className="text-xs text-emerald-dark dark:text-emerald">Live</span>
        </span>
      </div>

      <div className="flex items-center justify-center mb-5">
        <div className="relative flex h-32 w-32 items-center justify-center">
          <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
            {segments.map((seg, i) => {
              const dash = (seg.pct / 100) * circumference;
              const offset = circumference - cumulative * circumference / 100;
              cumulative += seg.pct;
              return (
                <circle
                  key={i}
                  cx="18" cy="18" r={r}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="3.5"
                  strokeDasharray={`${dash} ${circumference - dash}`}
                  strokeDashoffset={-((100 - cumulative + seg.pct) / 100 * circumference - circumference)}
                  style={{ strokeDashoffset: `-${(cumulative - seg.pct) / 100 * circumference}` }}
                />
              );
            })}
          </svg>
          <div className="absolute text-center">
            <p className="text-2xl font-bold text-dark dark:text-white">{checkedIn}</p>
            <p className="text-xs text-dark-5 dark:text-dark-6">of {stats.total}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        {segments.map((seg, i) => (
          <div key={seg.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${dotColors[i]}`} />
              <span className="text-sm text-dark-5 dark:text-dark-6">{seg.label}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-gray-2 dark:bg-dark-3">
                <div className="h-full rounded-full" style={{ width: `${seg.pct}%`, backgroundColor: seg.color }} />
              </div>
              <span className="w-6 text-right text-sm font-semibold text-dark dark:text-white">{seg.count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
