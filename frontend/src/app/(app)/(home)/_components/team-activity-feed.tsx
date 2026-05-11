import Link from "next/link";
import type { NotificationItem } from "@/lib/actions/notifications";

const TYPE_COLORS: Record<string, string> = {
  leave: "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  task: "bg-sky-50 text-sky-dark dark:bg-sky-dark/10 dark:text-sky",
  performance: "bg-violet-light text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300",
  onboarding: "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-300",
  payroll: "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber",
};

const TYPE_ICONS: Record<string, string> = {
  leave: "✓",
  task: "📋",
  performance: "⭐",
  onboarding: "👋",
  payroll: "💰",
};

interface Props {
  notifications: NotificationItem[];
}

export function TeamActivityFeed({ notifications }: Readonly<Props>) {
  return (
    <div className="flex h-full flex-col card-p">
      <div className="flex items-center justify-between">
        <h3 className="section-title">Team Activity</h3>
        <Link href="/collaboration" className="text-xs font-medium text-primary-600 hover:underline dark:text-primary-400">
          View all
        </Link>
      </div>

      {notifications.length === 0 ? (
        <p className="mt-4 text-xs text-dark-5 dark:text-dark-6">No recent activity.</p>
      ) : (
        <ul className="mt-4 flex-1 space-y-3 overflow-y-auto">
          {notifications.map((item) => (
            <li key={item.id}>
              <Link href={item.href} className="flex items-start gap-3 group">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-2 dark:bg-dark-3 text-sm">
                  {TYPE_ICONS[item.type] ?? "🔔"}
                </div>

                <div className="min-w-0 flex-1">
                  <p className={`text-[10px] font-semibold uppercase tracking-wide ${TYPE_COLORS[item.type] ?? "text-dark-5"} w-fit rounded px-1.5 py-0.5 mb-1`}>
                    {item.title}
                  </p>
                  <p className="text-xs text-dark dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <span className="shrink-0 text-[10px] text-dark-5 dark:text-dark-6 whitespace-nowrap">{item.time}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
