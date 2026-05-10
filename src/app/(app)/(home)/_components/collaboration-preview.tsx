import Image from "next/image";
import Link from "next/link";

const CHATS = [
  {
    avatar: "/images/user/user-15.png",
    name: "Sarah Mitchell",
    message: "Can you review the updated attendance policy doc?",
    time: "Just now",
    unread: 2,
    online: true,
  },
  {
    avatar: "/images/user/user-03.png",
    name: "Daniel Park",
    message: "The Q2 report is ready for your review",
    time: "5m",
    unread: 0,
    online: true,
  },
  {
    avatar: "/images/user/user-26.png",
    name: "#hr-policies",
    message: "Priya: New remote work guidelines are up",
    time: "12m",
    unread: 5,
    online: false,
    isChannel: true,
  },
  {
    avatar: "/images/user/user-28.png",
    name: "James Williams",
    message: "Thanks for the onboarding help!",
    time: "1h",
    unread: 0,
    online: false,
  },
];

const ACTIVE_MEETINGS = [
  { title: "All-Hands Standup", count: 12 },
  { title: "Product Sync", count: 5 },
];

export function CollaborationPreview() {
  return (
    <div className="flex h-full flex-col card-p">
      <div className="flex items-center justify-between">
        <h3 className="section-title">Collaboration</h3>
        <Link href="/collaboration" className="text-xs font-medium text-primary-600 hover:underline dark:text-primary-400">
          Open
        </Link>
      </div>

      {/* Active meetings */}
      {ACTIVE_MEETINGS.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {ACTIVE_MEETINGS.map((m) => (
            <div
              key={m.title}
              className="flex items-center gap-1.5 rounded-lg border border-emerald-light bg-emerald-light px-2.5 py-1.5 dark:border-emerald-dark/30 dark:bg-emerald-dark/10"
            >
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald" />
              <span className="text-[11px] font-semibold text-emerald-dark dark:text-emerald">
                {m.title}
              </span>
              <span className="text-[10px] text-dark-5 dark:text-dark-6">
                {m.count} live
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Chat list */}
      <ul className="mt-3 flex-1 divide-y divide-gray-3 overflow-y-auto dark:divide-dark-3">
        {CHATS.map((chat, i) => (
          <li key={i}>
            <Link
              href="/collaboration/messages"
              className="flex items-center gap-3 py-2.5 hover:opacity-80"
            >
              <div className="relative shrink-0">
                <Image
                  src={chat.avatar}
                  width={36}
                  height={36}
                  alt={chat.name}
                  className="rounded-full object-cover"
                />
                {chat.online && (
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald dark:border-dark-2" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-dark dark:text-white">
                    {chat.isChannel && <span className="mr-0.5 text-dark-5">#</span>}
                    {chat.name}
                  </span>
                  <span className="text-[10px] text-dark-5 dark:text-dark-6">{chat.time}</span>
                </div>
                <p className="mt-0.5 truncate text-[11px] text-dark-5 dark:text-dark-6">
                  {chat.message}
                </p>
              </div>

              {chat.unread > 0 && (
                <span className="ml-1 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-primary-600 px-1 text-[10px] font-bold text-white">
                  {chat.unread}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>

      {/* Compose */}
      <div className="mt-3 flex items-center gap-2 rounded-lg border border-gray-3 px-3 py-2 dark:border-dark-3">
        <svg className="size-4 shrink-0 text-dark-5" viewBox="0 0 24 24" fill="none">
          <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="flex-1 text-muted">New message...</span>
        <kbd className="hidden rounded border border-gray-3 bg-gray-2 px-1 py-0.5 text-[9px] text-dark-5 dark:border-dark-3 dark:bg-dark-3 sm:block">⌘N</kbd>
      </div>
    </div>
  );
}
