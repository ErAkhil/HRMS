import Link from "next/link";
import type { Channel } from "@/lib/actions/collaboration";
import type { SerializedMeeting } from "@/lib/actions/meetings";

interface Props {
  channels: Channel[];
  liveMeetings: SerializedMeeting[];
}

function relativeTime(dateStr: string | null): string {
  if (!dateStr) return "";
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60_000);
  if (diff < 1) return "Just now";
  if (diff < 60) return `${diff}m`;
  const hrs = Math.floor(diff / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

export function CollaborationPreview({ channels, liveMeetings }: Readonly<Props>) {
  const displayChannels = channels.slice(0, 4);

  return (
    <div className="flex h-full flex-col card-p">
      <div className="flex items-center justify-between">
        <h3 className="section-title">Collaboration</h3>
        <Link href="/collaboration" className="text-xs font-medium text-primary-600 hover:underline dark:text-primary-400">
          Open
        </Link>
      </div>

      {liveMeetings.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {liveMeetings.slice(0, 2).map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-1.5 rounded-lg border border-emerald-light bg-emerald-light px-2.5 py-1.5 dark:border-emerald-dark/30 dark:bg-emerald-dark/10"
            >
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald" />
              <span className="text-[11px] font-semibold text-emerald-dark dark:text-emerald">{m.title}</span>
              <span className="text-[10px] text-dark-5 dark:text-dark-6">{m.participants.length} live</span>
            </div>
          ))}
        </div>
      )}

      <ul className="mt-3 flex-1 divide-y divide-gray-3 overflow-y-auto dark:divide-dark-3">
        {displayChannels.length === 0 ? (
          <li className="py-4 text-center text-xs text-dark-5 dark:text-dark-6">No channels yet.</li>
        ) : (
          displayChannels.map((ch) => (
            <li key={ch.id}>
              <Link href="/collaboration/messages" className="flex items-center gap-3 py-2.5 hover:opacity-80">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-900/20">
                  <span className="text-sm font-bold text-primary-600 dark:text-primary-300">#</span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-dark dark:text-white">
                      {ch.name}
                    </span>
                    <span className="text-[10px] text-dark-5 dark:text-dark-6">
                      {relativeTime(ch.lastMessageAt)}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-[11px] text-dark-5 dark:text-dark-6">
                    {ch.lastMessage ?? "No messages yet"}
                  </p>
                </div>

                {ch.messageCount > 0 && (
                  <span className="ml-1 flex min-w-[18px] items-center justify-center rounded-full bg-primary-600 px-1 py-0.5 text-[10px] font-bold text-white">
                    {ch.messageCount > 99 ? "99+" : ch.messageCount}
                  </span>
                )}
              </Link>
            </li>
          ))
        )}
      </ul>

      <div className="mt-3 flex items-center gap-2 rounded-lg border border-gray-3 px-3 py-2 dark:border-dark-3">
        <svg className="size-4 shrink-0 text-dark-5" viewBox="0 0 24 24" fill="none">
          <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="flex-1 text-muted">New message...</span>
      </div>
    </div>
  );
}
