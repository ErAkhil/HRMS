interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg: string;
  trend?: string;
  trendUp?: boolean;
}

export function StatCard({
  label,
  value,
  icon,
  iconBg,
  trend,
  trendUp,
}: StatCardProps) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
      <div className="flex items-center justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBg}`}
        >
          {icon}
        </div>
        {trend && (
          <span
            className={`text-xs font-medium ${trendUp ? "text-emerald-dark dark:text-emerald" : "text-rose-dark dark:text-rose"}`}
          >
            {trendUp ? "▲" : "▼"} {trend}
          </span>
        )}
      </div>
      <p className="mt-3 text-2xl font-bold text-dark dark:text-white">
        {value}
      </p>
      <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">{label}</p>
    </div>
  );
}
