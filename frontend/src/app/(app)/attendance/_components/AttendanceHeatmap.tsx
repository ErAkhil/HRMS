const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_LABELS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

function getShade(pct: number): string {
  if (pct === 0) return "bg-gray-2 dark:bg-dark-3";
  if (pct < 30) return "bg-primary-100 dark:bg-primary-900/30";
  if (pct < 60) return "bg-primary-200 dark:bg-primary-800/40";
  if (pct < 75) return "bg-primary-300 dark:bg-primary-700/50";
  if (pct < 85) return "bg-primary-400 dark:bg-primary-600/70";
  if (pct < 92) return "bg-primary-500 dark:bg-primary-500/80";
  return "bg-primary-700 dark:bg-primary-400";
}

interface Props {
  heatmap: { day: number; pct: number }[];
  month: number;
  year: number;
}

export function AttendanceHeatmap({ heatmap, month, year }: Readonly<Props>) {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;

  const cells: { day: number; pct: number }[] = [
    ...Array.from({ length: startOffset }, () => ({ day: 0, pct: 0 })),
    ...heatmap,
  ];

  const weeks: { day: number; pct: number }[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    const week = cells.slice(i, i + 7);
    while (week.length < 7) week.push({ day: 0, pct: 0 });
    weeks.push(week);
  }

  return (
    <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-dark dark:text-white">Attendance Heatmap</h3>
          <p className="text-xs text-dark-5 dark:text-dark-6 mt-0.5">
            {MONTH_NAMES[month - 1]} {year} — color intensity shows attendance %
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-dark-5 dark:text-dark-6">Low</span>
          <div className="flex gap-0.5">
            {["bg-primary-100","bg-primary-200","bg-primary-300","bg-primary-400","bg-primary-500","bg-primary-700"].map((shade, i) => (
              <span key={i} className={`h-3 w-4 rounded-sm ${shade}`} />
            ))}
          </div>
          <span className="text-xs text-dark-5 dark:text-dark-6">High</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="grid grid-cols-7 gap-0.5 min-w-[420px]">
          {DAY_LABELS.map((d) => (
            <div key={d} className="pb-1 text-center text-[10px] font-medium text-dark-5 dark:text-dark-6">{d}</div>
          ))}
          {weeks.flatMap((week, wi) =>
            week.map((cell, di) => (
              <div
                key={`${wi}-${di}`}
                title={cell.day > 0 ? `Day ${cell.day}: ${cell.pct}% attendance` : ""}
                className={`aspect-square rounded-sm transition-colors ${cell.day > 0 ? getShade(cell.pct) : "bg-transparent"}`}
              />
            ))
          )}
        </div>
      </div>

      {heatmap.length === 0 && (
        <p className="mt-3 text-center text-xs text-dark-5 dark:text-dark-6">No attendance data for this month yet.</p>
      )}
    </div>
  );
}
