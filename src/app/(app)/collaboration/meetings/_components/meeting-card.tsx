import Image from "next/image";
import { TYPE_COLORS, PLATFORM_ICONS } from "../_data/meetings-data";
import type { Meeting } from "../_data/meetings-data";

interface Props {
  meeting: Meeting;
  onJoin: () => void;
  onDetails: () => void;
}

export function MeetingCard({ meeting, onJoin, onDetails }: Readonly<Props>) {
  const overflow = meeting.participantCount - 4;

  return (
    <div className="card-p">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="truncate text-sm font-semibold text-dark dark:text-white min-w-0 flex-1">{meeting.title}</h3>
        <span className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${TYPE_COLORS[meeting.type]}`}>{meeting.type}</span>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-muted">
        <span className="flex items-center gap-1">
          <svg className="size-3.5" viewBox="0 0 24 24" fill="none">
            <path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {meeting.date} · {meeting.time}
        </span>
        <span className="flex items-center gap-1">
          <svg className="size-3.5" viewBox="0 0 24 24" fill="none">
            <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {meeting.duration}
        </span>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex -space-x-2">
            {meeting.participants.slice(0, 4).map((src, i) => (
              <Image key={i} src={src} alt="" width={28} height={28} className="size-7 rounded-full ring-2 ring-white dark:ring-dark-2" />
            ))}
          </div>
          {overflow > 0 && <span className="ml-1 text-muted">+{overflow}</span>}
        </div>
        {PLATFORM_ICONS[meeting.platform]}
      </div>

      <div className="flex gap-2">
        <button onClick={onJoin} className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${meeting.live ? "bg-emerald-dark text-white hover:opacity-90" : "bg-primary-600 text-white hover:bg-primary-700"}`}>
          {meeting.live ? "Join Now" : "Join"}
        </button>
        <button onClick={onDetails} className="btn-secondary px-3 py-1.5 text-sm">Details</button>
      </div>
    </div>
  );
}
