interface StatusItem {
  label: string;
  count: number;
  dotColor: string;
  percentage: number;
}

const statusItems: StatusItem[] = [
  { label: "Present", count: 218, dotColor: "bg-emerald-500", percentage: 87.9 },
  { label: "WFH", count: 24, dotColor: "bg-violet-500", percentage: 9.7 },
  { label: "On Leave", count: 12, dotColor: "bg-amber-400", percentage: 4.8 },
  { label: "Late", count: 14, dotColor: "bg-orange-400", percentage: 5.6 },
  { label: "Absent", count: 6, dotColor: "bg-rose-500", percentage: 2.4 },
];

const total = 248;

export function LiveStatusPanel() {
  return (
    <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-dark dark:text-white">Live Status</h3>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-emerald-dark dark:text-emerald">Live</span>
        </span>
      </div>

      {/* Ring chart visual */}
      <div className="flex items-center justify-center mb-5">
        <div className="relative flex h-32 w-32 items-center justify-center">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            {(() => {
              const segments = [
                { pct: 87.9, color: "#10B981" },
                { pct: 9.7, color: "#8B5CF6" },
                { pct: 4.8, color: "#FBBF24" },
                { pct: 5.6, color: "#FB923C" },
                { pct: 2.4, color: "#F43F5E" },
              ];
              const r = 38;
              const cx = 50;
              const cy = 50;
              const circumference = 2 * Math.PI * r;
              let offset = 0;
              return segments.map((seg, i) => {
                const dashLen = (seg.pct / 100) * circumference;
                const el = (
                  <circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth="12"
                    strokeDasharray={`${dashLen} ${circumference - dashLen}`}
                    strokeDashoffset={-offset * circumference / 100}
                  />
                );
                offset += seg.pct;
                return el;
              });
            })()}
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-xl font-bold text-dark dark:text-white">{total}</span>
            <span className="text-xs text-dark-5 dark:text-dark-6">Total</span>
          </div>
        </div>
      </div>

      {/* Status list */}
      <div className="space-y-3">
        {statusItems.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${item.dotColor}`} />
              <span className="text-xs text-dark-5 dark:text-dark-6">{item.label}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-20 h-1.5 rounded-full bg-gray-3 dark:bg-dark-3 overflow-hidden">
                <div
                  className={`h-full rounded-full ${item.dotColor}`}
                  style={{ width: `${(item.count / total) * 100}%` }}
                />
              </div>
              <span className="w-6 text-right text-sm font-semibold text-dark dark:text-white">{item.count}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-lg bg-gray-1 dark:bg-dark-3 p-3">
        <p className="text-xs text-dark-5 dark:text-dark-6">
          Last updated: <span className="font-medium text-dark dark:text-white">3:47 PM today</span>
        </p>
      </div>
    </div>
  );
}
