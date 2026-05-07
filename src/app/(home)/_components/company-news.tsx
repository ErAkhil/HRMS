import Link from "next/link";

const NEWS = [
  {
    tag: "Policy",
    tagColor: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300",
    title: "Updated Remote Work Policy — Effective June 2026",
    excerpt: "The HR team has updated the hybrid work guidelines. All employees working remotely must adhere to the new check-in protocols.",
    time: "Today, 9:15 AM",
    author: "HR Team",
    pinned: true,
  },
  {
    tag: "Announcement",
    tagColor: "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
    title: "Q1 Employee Satisfaction Score: 91% Positive",
    excerpt: "We're proud to share that our Q1 engagement survey results are in — and the feedback is overwhelmingly positive.",
    time: "Yesterday",
    author: "Leadership",
    pinned: false,
  },
  {
    tag: "Event",
    tagColor: "bg-violet-light text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300",
    title: "Annual Company Offsite — June 14–16, Goa",
    excerpt: "Registration is now open for the annual company offsite. Spaces are limited. Register by May 31st.",
    time: "2 days ago",
    author: "Admin",
    pinned: false,
  },
  {
    tag: "Recognition",
    tagColor: "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber",
    title: "Employee of the Month: Priya Sharma",
    excerpt: "Congratulations to Priya Sharma from the Product team for outstanding contributions in Q1.",
    time: "3 days ago",
    author: "Management",
    pinned: false,
  },
];

export function CompanyNews() {
  return (
    <div className="flex h-full flex-col rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-dark dark:text-white">Company News</h3>
        <Link href="/" className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">
          View all
        </Link>
      </div>

      <ul className="mt-4 flex-1 space-y-4 overflow-y-auto">
        {NEWS.map((item, i) => (
          <li key={i} className="group">
            <Link href="/" className="block">
              <div className="flex items-start gap-2">
                <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${item.tagColor}`}>
                  {item.tag}
                </span>
                {item.pinned && (
                  <span className="rounded bg-gray-2 px-1.5 py-0.5 text-[9px] font-semibold text-dark-5 dark:bg-dark-3 dark:text-dark-6">
                    📌 Pinned
                  </span>
                )}
              </div>
              <h4 className="mt-1.5 text-xs font-semibold leading-snug text-dark group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 transition-colors">
                {item.title}
              </h4>
              <p className="mt-1 text-[11px] leading-relaxed text-dark-5 dark:text-dark-6 line-clamp-2">
                {item.excerpt}
              </p>
              <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-dark-5 dark:text-dark-6">
                <span>{item.author}</span>
                <span>·</span>
                <span>{item.time}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
