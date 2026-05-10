import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  valueClassName?: string;
  sub?: string;
  icon?: React.ReactNode;
  iconBg?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  valueClassName,
  sub,
  icon,
  iconBg,
  className,
}: StatCardProps) {
  return (
    <div className={cn("stat-card", className)}>
      {icon && (
        <div className={cn("mb-3 flex h-10 w-10 items-center justify-center rounded-lg", iconBg)}>
          {icon}
        </div>
      )}
      <p className="stat-label">{label}</p>
      <p className={cn("stat-value", valueClassName)}>{value}</p>
      {sub && <p className="text-muted mt-0.5">{sub}</p>}
    </div>
  );
}
