import Link from "next/link";
import { getLeaveRequests } from "@/lib/actions/leave";
import { getOrgReviews } from "@/lib/actions/performance";

export async function EmployeesActionItems() {
  const [pendingLeave, pendingReviews] = await Promise.all([
    getLeaveRequests("PENDING").catch(() => []),
    getOrgReviews().catch(() => []),
  ]);

  const pendingReviewCount = pendingReviews.filter((r) => r.status === "PENDING").length;

  const items = [
    ...(pendingLeave.length > 0
      ? [{
          icon: (
            <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          ),
          description: `${pendingLeave.length} leave request${pendingLeave.length !== 1 ? "s" : ""} awaiting approval`,
          badge: "Pending",
          badgeClass: "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber",
          action: "Review",
          href: "/leave/approvals",
        }]
      : []),
    ...(pendingReviewCount > 0
      ? [{
          icon: (
            <svg className="h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          description: `${pendingReviewCount} performance review${pendingReviewCount !== 1 ? "s" : ""} pending`,
          badge: "Review",
          badgeClass: "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-300",
          action: "View",
          href: "/performance/reviews",
        }]
      : []),
    {
      icon: (
        <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      description: "Annual performance cycle — configure reviewers",
      badge: "Upcoming",
      badgeClass: "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
      action: "Setup",
      href: "/performance",
    },
  ];

  return (
    <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 md:col-span-7">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-dark dark:text-white">HR Action Items</h2>
        <span className="rounded-full bg-rose-light px-2.5 py-0.5 text-xs font-medium text-rose-dark dark:bg-rose-dark/20 dark:text-rose">
          {pendingLeave.length + pendingReviewCount} pending
        </span>
      </div>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-dark-3">
            <div className="shrink-0">{item.icon}</div>
            <p className="flex-1 text-sm text-dark dark:text-white">{item.description}</p>
            <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${item.badgeClass}`}>{item.badge}</span>
            <Link
              href={item.href}
              className="shrink-0 rounded-lg border border-gray-3 bg-white px-3 py-1 text-xs font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            >
              {item.action}
            </Link>
          </div>
        ))}
        {items.length === 0 && (
          <p className="py-4 text-center text-sm text-dark-5 dark:text-dark-6">No pending items — all caught up!</p>
        )}
      </div>
    </div>
  );
}
