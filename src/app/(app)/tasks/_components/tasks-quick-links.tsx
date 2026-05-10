import Link from "next/link";

export function TasksQuickLinks() {
  return (
    <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
      <h2 className="mb-4 font-semibold text-dark dark:text-white">Quick Navigation</h2>
      <div className="grid grid-cols-2 gap-4 h-[calc(100%-2.5rem)]">
        <Link
          href="/tasks/kanban"
          className="group flex flex-col justify-between rounded-xl border border-gray-2 p-5 hover:border-violet-400 dark:border-dark-3 dark:hover:border-violet-500 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="rounded-lg bg-violet-light p-2 dark:bg-violet-dark/20">
              <svg className="h-5 w-5 text-violet-dark dark:text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            </span>
            <svg className="h-4 w-4 text-dark-5 group-hover:text-violet-600 dark:text-dark-6 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <div className="mt-4">
            <p className="font-semibold text-dark dark:text-white">Kanban Board</p>
            <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">View tasks by status</p>
          </div>
        </Link>

        <Link
          href="/tasks/projects"
          className="group flex flex-col justify-between rounded-xl border border-gray-2 p-5 hover:border-indigo-400 dark:border-dark-3 dark:hover:border-indigo-500 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="rounded-lg bg-indigo-50 p-2 dark:bg-indigo-900/20">
              <svg className="h-5 w-5 text-indigo-600 dark:text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h3.5L10 7H19a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
              </svg>
            </span>
            <svg className="h-4 w-4 text-dark-5 group-hover:text-indigo-600 dark:text-dark-6 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <div className="mt-4">
            <p className="font-semibold text-dark dark:text-white">Projects Overview</p>
            <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">Track project milestones</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
