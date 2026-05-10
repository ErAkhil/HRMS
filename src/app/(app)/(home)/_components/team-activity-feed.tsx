import Image from "next/image";
import Link from "next/link";

const FEED = [
  {
    avatar: "/images/user/user-15.png",
    name: "Sarah Mitchell",
    action: "approved your leave request",
    meta: "Annual Leave · Mar 18–22",
    time: "2m ago",
    type: "approval",
  },
  {
    avatar: "/images/user/user-03.png",
    name: "Daniel Park",
    action: "assigned you a new task",
    meta: "Q2 Workforce Analytics Report",
    time: "18m ago",
    type: "task",
  },
  {
    avatar: "/images/user/user-26.png",
    name: "Priya Sharma",
    action: "joined the team",
    meta: "Senior UX Designer · Product Dept",
    time: "1h ago",
    type: "join",
  },
  {
    avatar: "/images/user/user-28.png",
    name: "James Williams",
    action: "completed onboarding",
    meta: "All tasks marked done ✓",
    time: "2h ago",
    type: "complete",
  },
  {
    avatar: "/images/user/user-27.png",
    name: "Elena Torres",
    action: "sent payroll for approval",
    meta: "May 2026 · 248 employees",
    time: "3h ago",
    type: "payroll",
  },
  {
    avatar: "/images/user/user-23.png",
    name: "Arjun Mehta",
    action: "mentioned you in a channel",
    meta: "#hr-policies · @John check this out",
    time: "5h ago",
    type: "mention",
  },
];

const TYPE_COLORS: Record<string, string> = {
  approval: "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  task: "bg-sky-50 text-sky-dark dark:bg-sky-dark/10 dark:text-sky",
  join: "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-300",
  complete: "bg-violet-light text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300",
  payroll: "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber",
  mention: "bg-rose-light text-rose-dark dark:bg-rose-dark/20 dark:text-rose",
};

const TYPE_ICONS: Record<string, string> = {
  approval: "✓",
  task: "📋",
  join: "👋",
  complete: "🎉",
  payroll: "💰",
  mention: "@",
};

export function TeamActivityFeed() {
  return (
    <div className="flex h-full flex-col card-p">
      <div className="flex items-center justify-between">
        <h3 className="section-title">Team Activity</h3>
        <Link href="/collaboration" className="text-xs font-medium text-primary-600 hover:underline dark:text-primary-400">
          View all
        </Link>
      </div>

      <ul className="mt-4 flex-1 space-y-3 overflow-y-auto">
        {FEED.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <div className="relative shrink-0">
              <Image
                src={item.avatar}
                width={34}
                height={34}
                alt={item.name}
                className="rounded-full object-cover"
              />
              <span className={`absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[8px] ${TYPE_COLORS[item.type]}`}>
                {TYPE_ICONS[item.type]}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs text-dark dark:text-white">
                <span className="font-semibold">{item.name}</span>{" "}
                <span className="text-dark-5 dark:text-dark-6">{item.action}</span>
              </p>
              <p className="mt-0.5 truncate text-[11px] font-medium text-dark-5 dark:text-dark-6">
                {item.meta}
              </p>
            </div>

            <span className="shrink-0 text-[10px] text-dark-5 dark:text-dark-6">{item.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
