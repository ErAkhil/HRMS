"use client";

import type { ChannelItem } from "@/lib/actions/messages";

interface Props {
  channels: ChannelItem[];
  activeId: string | null;
  search: string;
  onSelect: (id: string) => void;
  onSearch: (value: string) => void;
  onNewDm: () => void;
}

function formatTime(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays === 0) return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  if (diffDays === 1) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function DmSidebar({ channels, activeId, search, onSelect, onSearch, onNewDm }: Readonly<Props>) {
  const filtered = channels.filter((ch) =>
    ch.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className="flex w-72 flex-shrink-0 flex-col border-r border-gray-3 bg-white dark:border-dark-3 dark:bg-dark-2">
      <div className="flex items-center justify-between border-b border-gray-3 px-4 py-3.5 dark:border-dark-3">
        <span className="text-body font-bold">Channels</span>
        <button onClick={onNewDm} className="flex size-7 items-center justify-center rounded-lg text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3">
          <svg className="size-4" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="p-3">
        <div className="relative">
          <svg className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-dark-5" viewBox="0 0 24 24" fill="none">
            <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <input
            placeholder="Search channels..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="h-8 w-full rounded-lg border border-gray-3 bg-gray-2 pl-8 pr-3 text-xs outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white dark:placeholder-dark-6"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {filtered.length === 0 && (
          <p className="px-2 py-4 text-center text-xs text-dark-5 dark:text-dark-6">No channels found.</p>
        )}
        {filtered.map((ch) => {
          const isActive = ch.id === activeId;
          return (
            <button
              key={ch.id}
              onClick={() => onSelect(ch.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-colors ${isActive ? "bg-primary-50 dark:bg-primary-900/20" : "hover:bg-gray-2 dark:hover:bg-dark-3"}`}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                #
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-semibold ${isActive ? "text-primary-600 dark:text-primary-300" : "text-dark dark:text-white"}`}>
                    {ch.name}
                  </span>
                  <span className="text-muted">{formatTime(ch.lastMessageAt)}</span>
                </div>
                <p className="truncate text-muted">{ch.lastMessage ?? "No messages yet"}</p>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
