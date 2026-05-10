import Link from "next/link";

const ACTIONS = [
  {
    label: "Apply Leave",
    href: "/leave",
    icon: (
      <svg className="size-5" viewBox="0 0 24 24" fill="none">
        <path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
    text: "text-indigo-600 dark:text-indigo-300",
  },
  {
    label: "Start Meeting",
    href: "/collaboration/meetings",
    icon: (
      <svg className="size-5" viewBox="0 0 24 24" fill="none">
        <path d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    bg: "bg-emerald-light dark:bg-emerald-dark/20",
    text: "text-emerald-dark dark:text-emerald",
  },
  {
    label: "Add Task",
    href: "/tasks",
    icon: (
      <svg className="size-5" viewBox="0 0 24 24" fill="none">
        <path d="M12 4.5v15m7.5-7.5h-15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    bg: "bg-sky-50 dark:bg-sky-dark/10",
    text: "text-sky-dark dark:text-sky",
  },
  {
    label: "Upload Doc",
    href: "/employees",
    icon: (
      <svg className="size-5" viewBox="0 0 24 24" fill="none">
        <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    bg: "bg-violet-light dark:bg-violet-dark/20",
    text: "text-violet-dark dark:text-violet-300",
  },
  {
    label: "Reimbursement",
    href: "/payroll/reimbursements",
    icon: (
      <svg className="size-5" viewBox="0 0 24 24" fill="none">
        <path d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    bg: "bg-amber-light dark:bg-amber-dark/20",
    text: "text-amber-dark dark:text-amber",
  },
  {
    label: "View Payslip",
    href: "/payroll/payslips",
    icon: (
      <svg className="size-5" viewBox="0 0 24 24" fill="none">
        <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    bg: "bg-rose-light dark:bg-rose-dark/20",
    text: "text-rose-dark dark:text-rose",
  },
];

export function QuickActionsGrid() {
  return (
    <div className="card-p">
      <h3 className="section-title mb-4">Quick Actions</h3>
      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-3">
        {ACTIONS.map((a) => (
          <Link
            key={a.label}
            href={a.href}
            className={`flex flex-col items-center gap-2 rounded-xl p-3 transition-all hover:scale-105 hover:shadow-card ${a.bg}`}
          >
            <div className={a.text}>{a.icon}</div>
            <span className={`text-center text-[10px] font-semibold leading-tight ${a.text}`}>
              {a.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
