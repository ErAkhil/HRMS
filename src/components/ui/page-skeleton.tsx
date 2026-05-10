export default function PageSkeleton() {
  return (
    <div className="page-container animate-pulse">
      {/* Header */}
      <div className="page-header">
        <div className="space-y-2">
          <div className="h-7 w-44 rounded-lg bg-gray-200 dark:bg-dark-3" />
          <div className="h-4 w-28 rounded bg-gray-200 dark:bg-dark-3" />
        </div>
        <div className="h-9 w-36 rounded-lg bg-gray-200 dark:bg-dark-3" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="stat-card space-y-2.5">
            <div className="h-3.5 w-20 rounded bg-gray-200 dark:bg-dark-3" />
            <div className="h-8 w-14 rounded-lg bg-gray-200 dark:bg-dark-3" />
          </div>
        ))}
      </div>

      {/* Main content card */}
      <div className="card">
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-5 w-32 rounded bg-gray-200 dark:bg-dark-3" />
            <div className="h-8 w-24 rounded-lg bg-gray-200 dark:bg-dark-3" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-200 dark:bg-dark-3" />
                <div className="flex-1 space-y-1.5">
                  <div
                    className="h-3.5 rounded bg-gray-200 dark:bg-dark-3"
                    style={{ width: `${45 + (i % 3) * 15}%` }}
                  />
                  <div
                    className="h-3 rounded bg-gray-200 dark:bg-dark-3"
                    style={{ width: `${30 + (i % 4) * 10}%` }}
                  />
                </div>
                <div className="h-6 w-16 flex-shrink-0 rounded-full bg-gray-200 dark:bg-dark-3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
