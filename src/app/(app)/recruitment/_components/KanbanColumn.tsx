import Image from "next/image";

export interface CandidateCard {
  id: string;
  name: string;
  avatar: string;
  currentRole: string;
  appliedFor: string;
  stageInfo: string;
}

interface KanbanColumnProps {
  title: string;
  headerColor: string;
  dotColor: string;
  candidates: CandidateCard[];
}

export function KanbanColumn({ title, headerColor, dotColor, candidates }: KanbanColumnProps) {
  return (
    <div className="flex flex-col min-w-[260px] flex-1">
      {/* Column Header */}
      <div className={`flex items-center justify-between rounded-t-xl px-4 py-3 ${headerColor}`}>
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${dotColor}`} />
          <span className="text-sm font-semibold text-dark dark:text-white">{title}</span>
        </div>
        <span className="rounded-full bg-white/30 px-2.5 py-0.5 text-xs font-semibold text-dark dark:text-white dark:bg-black/20">
          {candidates.length}
        </span>
      </div>

      {/* Cards */}
      <div className="rounded-b-xl bg-gray-1 dark:bg-dark-3/50 p-2 space-y-2 flex-1">
        {candidates.map((candidate) => (
          <div
            key={candidate.id}
            className="rounded-xl bg-white p-3.5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 cursor-pointer hover:shadow-md transition-shadow"
          >
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
            </div>

            <p className="mt-2 text-xs text-dark-5 dark:text-dark-6">
              <span className="font-medium text-dark dark:text-white/80">Applying for:</span> {candidate.appliedFor}
            </p>

            <div className="mt-2.5 flex items-center justify-between">
              <span className="text-xs text-dark-5 dark:text-dark-6">{candidate.stageInfo}</span>
            </div>
          </div>
        ))}

        {candidates.length === 0 && (
          <p className="py-4 text-center text-xs text-dark-5 dark:text-dark-6">No candidates</p>
        )}
      </div>
    </div>
  );
}
