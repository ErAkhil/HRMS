import Image from "next/image";

interface Candidate {
  id: number;
  name: string;
  avatar: string;
  currentRole: string;
  appliedFor: string;
  aiScore: number;
  stageInfo: string;
}

interface KanbanColumnProps {
  title: string;
  count: number;
  headerColor: string;
  dotColor: string;
  candidates: Candidate[];
}

export function KanbanColumn({ title, count, headerColor, dotColor, candidates }: KanbanColumnProps) {
  return (
    <div className="flex flex-col min-w-[260px] flex-1">
      {/* Column Header */}
      <div className={`flex items-center justify-between rounded-t-xl px-4 py-3 ${headerColor}`}>
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${dotColor}`} />
          <span className="text-sm font-semibold text-dark dark:text-white">{title}</span>
        </div>
        <span className="rounded-full bg-white/30 px-2.5 py-0.5 text-xs font-semibold text-dark dark:text-white dark:bg-black/20">
          {count}
        </span>
      </div>

      {/* Cards */}
      <div className="rounded-b-xl bg-gray-1 dark:bg-dark-3/50 p-2 space-y-2 flex-1">
        {candidates.map((candidate) => (
          <div
            key={candidate.id}
            className="rounded-xl bg-white p-3.5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 cursor-pointer hover:shadow-md transition-shadow"
          >
            {/* Top row: avatar + name + menu */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <Image
                  src={candidate.avatar}
                  alt={candidate.name}
                  width={34}
                  height={34}
                  className="rounded-full object-cover shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-dark dark:text-white leading-tight">{candidate.name}</p>
                  <p className="text-xs text-dark-5 dark:text-dark-6 truncate">{candidate.currentRole}</p>
                </div>
              </div>
              <button className="shrink-0 text-dark-5 hover:text-dark dark:text-dark-6 dark:hover:text-white mt-0.5">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>

            {/* Applied for */}
            <p className="mt-2 text-xs text-dark-5 dark:text-dark-6">
              <span className="font-medium text-dark dark:text-white/80">Applying for:</span> {candidate.appliedFor}
            </p>

            {/* Bottom row */}
            <div className="mt-2.5 flex items-center justify-between">
              <span
                className="rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                style={{ background: "linear-gradient(135deg, #4F46E5, #8B5CF6)" }}
              >
                AI {candidate.aiScore}%
              </span>
              <span className="text-xs text-dark-5 dark:text-dark-6">{candidate.stageInfo}</span>
            </div>
          </div>
        ))}

        {/* Add card button */}
        <button className="w-full rounded-lg border-2 border-dashed border-gray-3 py-2.5 text-xs text-dark-5 hover:border-primary-600 hover:text-primary-600 dark:border-dark-3 dark:text-dark-6 transition-colors">
          + Add candidate
        </button>
      </div>
    </div>
  );
}
