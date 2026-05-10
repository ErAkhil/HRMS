import Image from "next/image";
import type { SerializedMeeting } from "@/lib/actions/meetings";

const TYPE_COLORS: Record<string, string> = {
  "All-Hands": "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-300",
  "Team": "bg-violet-light text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300",
  "1:1": "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  "Interview": "bg-amber-light text-amber-dark",
  "Review": "bg-rose-light text-rose-dark",
};

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

interface Props {
  meeting: SerializedMeeting;
  dateLabel: string;
  timeLabel: string;
  durationLabel: string;
  onJoin: () => void;
  onDetails: () => void;
}

export function MeetingCard({ meeting, dateLabel, timeLabel, durationLabel, onJoin, onDetails }: Readonly<Props>) {
  const typeColor = TYPE_COLORS[meeting.type] ?? "bg-gray-100 text-gray-600 dark:bg-dark-3 dark:text-dark-6";
  const visible = meeting.participants.slice(0, 4);
  const overflow = meeting.participants.length - 4;

  return (
    <div className="card-p">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="truncate text-sm font-semibold text-dark dark:text-white min-w-0 flex-1">{meeting.title}</h3>
        <span className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${typeColor}`}>{meeting.type}</span>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-muted">
        <span className="flex items-center gap-1">
          <svg className="size-3.5" viewBox="0 0 24 24" fill="none">
            <path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {dateLabel} · {timeLabel}
        </span>
        <span className="flex items-center gap-1">
          <svg className="size-3.5" viewBox="0 0 24 24" fill="none">
            <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {durationLabel}
        </span>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex -space-x-2">
            {visible.map((p) =>
              p.avatarUrl ? (
                <Image key={p.id} src={p.avatarUrl} alt={p.name} width={28} height={28} className="size-7 rounded-full object-cover ring-2 ring-white dark:ring-dark-2" />
              ) : (
                <div key={p.id} className="flex size-7 items-center justify-center rounded-full bg-primary-100 text-[10px] font-bold text-primary-700 ring-2 ring-white dark:bg-primary-900/30 dark:text-primary-300 dark:ring-dark-2">
                  {getInitials(p.name)}
                </div>
              )
            )}
          </div>
          {overflow > 0 && <span className="ml-1 text-muted">+{overflow}</span>}
          {meeting.participants.length === 0 && <span className="text-muted text-xs">No participants</span>}
        </div>
        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-semibold text-dark-5 dark:bg-dark-3 dark:text-dark-6">
          {meeting.platform}
        </span>
      </div>

      {meeting.agenda && (
        <p className="mb-3 truncate text-xs text-dark-5 dark:text-dark-6">{meeting.agenda}</p>
      )}

      <div className="flex gap-2">
        <button
          onClick={onJoin}
          className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${meeting.isLive ? "bg-emerald-dark text-white hover:opacity-90" : "bg-primary-600 text-white hover:bg-primary-700"}`}
        >
          {meeting.isLive ? "Join Now" : "Join"}
        </button>
        <button onClick={onDetails} className="btn-secondary px-3 py-1.5 text-sm">Details</button>
      </div>
    </div>
  );
}
