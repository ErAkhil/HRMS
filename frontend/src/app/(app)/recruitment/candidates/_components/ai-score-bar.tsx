export function AiScoreBar({ score }: { score: number }) {
  const color = score >= 90 ? "bg-emerald-500" : score >= 80 ? "bg-sky-500" : score >= 70 ? "bg-amber-400" : "bg-rose-500";
  const textColor = score >= 90 ? "text-emerald-dark dark:text-emerald" : score >= 80 ? "text-sky-dark dark:text-sky" : score >= 70 ? "text-amber-dark" : "text-rose-dark";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 rounded-full bg-gray-3 dark:bg-dark-3 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-xs font-semibold ${textColor}`}>{score}%</span>
    </div>
  );
}
