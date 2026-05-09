const weeks = [
  [
    { day: 1, pct: 88 }, { day: 2, pct: 92 }, { day: 3, pct: 90 }, { day: 4, pct: 85 }, { day: 5, pct: 78 },
    { day: 6, pct: 40 }, { day: 7, pct: 20 },
  ],
  [
    { day: 8, pct: 93 }, { day: 9, pct: 91 }, { day: 10, pct: 87 }, { day: 11, pct: 96 }, { day: 12, pct: 89 },
    { day: 13, pct: 35 }, { day: 14, pct: 18 },
  ],
  [
    { day: 15, pct: 94 }, { day: 16, pct: 90 }, { day: 17, pct: 88 }, { day: 18, pct: 82 }, { day: 19, pct: 95 },
    { day: 20, pct: 42 }, { day: 21, pct: 22 },
  ],
  [
    { day: 22, pct: 91 }, { day: 23, pct: 93 }, { day: 24, pct: 97 }, { day: 25, pct: 89 }, { day: 26, pct: 86 },
    { day: 27, pct: 38 }, { day: 28, pct: 15 },
  ],
  [
    { day: 29, pct: 92 }, { day: 30, pct: 88 }, { day: 31, pct: 0 }, { day: 0, pct: 0 }, { day: 0, pct: 0 },
    { day: 0, pct: 0 }, { day: 0, pct: 0 },
  ],
];

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getIndigoShade(pct: number): string {
  if (pct === 0) return "bg-gray-2 dark:bg-dark-3";
  if (pct < 30) return "bg-indigo-100 dark:bg-indigo-900/30";
  if (pct < 60) return "bg-indigo-200 dark:bg-indigo-800/40";
  if (pct < 75) return "bg-indigo-300 dark:bg-indigo-700/50";
  if (pct < 85) return "bg-indigo-400 dark:bg-indigo-600/70";
  if (pct < 92) return "bg-indigo-500 dark:bg-indigo-500/80";
  return "bg-indigo-700 dark:bg-indigo-400";
}

export function AttendanceHeatmap() {
  return (
    <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-dark dark:text-white">Attendance Heatmap</h3>
          <p className="text-xs text-dark-5 dark:text-dark-6 mt-0.5">May 2026 — color intensity shows attendance %</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-dark-5 dark:text-dark-6">Low</span>
          <div className="flex gap-0.5">
            {["bg-indigo-100", "bg-indigo-200", "bg-indigo-300", "bg-indigo-400", "bg-indigo-500", "bg-indigo-700"].map((shade, i) => (
              <span key={i} className={`h-3 w-4 rounded-sm ${shade}`} />
            ))}
          </div>
          <span className="text-xs text-dark-5 dark:text-dark-6">High</span>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1.5 mb-1">
        {dayLabels.map((label) => (
          <div key={label} className="text-center text-xs text-dark-5 dark:text-dark-6 font-medium">
            {label}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="space-y-1.5">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-1.5">
            {week.map((cell, di) => (
              <div
                key={di}
                title={cell.day > 0 ? `May ${cell.day}: ${cell.pct}% attendance` : ""}
                className={`relative flex h-10 items-center justify-center rounded-md transition-all hover:ring-2 hover:ring-indigo-400 cursor-default ${
                  cell.day === 0 ? "invisible" : getIndigoShade(cell.pct)
                }`}
              >
                {cell.day > 0 && (
                  <>
                    <span
                      className={`text-xs font-semibold ${
                        cell.pct >= 85 ? "text-white" : cell.pct >= 60 ? "text-indigo-900 dark:text-indigo-100" : "text-dark-5 dark:text-dark-6"
                      }`}
                    >
                      {cell.day}
                    </span>
                    {cell.pct > 0 && (
                      <span
                        className={`absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] ${
                          cell.pct >= 85 ? "text-white/70" : "text-indigo-600/70 dark:text-indigo-300/70"
                        }`}
                      >
                        {cell.pct}%
                      </span>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
