"use client";

import Image from "next/image";
import type { Channel, ChannelKey, DMUser } from "./collaboration-data";

interface ChannelSidebarProps {
  channels: Channel[];
  dmUsers: DMUser[];
  selectedChannel: ChannelKey;
  onSelectChannel: (id: ChannelKey) => void;
}

export function ChannelSidebar({
  channels,
  dmUsers,
  selectedChannel,
  onSelectChannel,
}: ChannelSidebarProps) {
  return (
    <aside className="flex w-70 flex-shrink-0 flex-col border-r border-gray-3 bg-white dark:border-dark-3 dark:bg-dark-2">
      {/* Workspace header */}
      <div className="flex items-center justify-between border-b border-gray-3 px-4 py-3.5 dark:border-dark-3">
        <span className="text-sm font-bold text-dark dark:text-white">Unikove HQ</span>
        <button className="flex size-7 items-center justify-center rounded-lg text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3">
          <svg className="size-4" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 5l7 7-7 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-dark-5 dark:text-dark-6"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            className="h-8 w-full rounded-lg border border-gray-3 bg-gray-2 pl-8 pr-3 text-xs outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white dark:placeholder-dark-6"
          />
        </div>
      </div>

      {/* Channels section */}
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        <div className="mb-1 flex items-center justify-between px-2 py-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">
            Channels
          </span>
          <button className="flex size-5 items-center justify-center rounded text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3">
            <svg className="size-3.5" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 5v14m-7-7h14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <ul className="space-y-0.5">
          {channels.map((ch) => (
            <li key={ch.id}>
              <button
                onClick={() => onSelectChannel(ch.id)}
                className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left transition-colors ${
                  selectedChannel === ch.id
                    ? "bg-primary-600 text-white"
                    : "text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3"
                }`}
              >
                <span className="flex items-center gap-1.5 text-sm">
                  <span className="font-medium opacity-60">#</span>
                  <span className="font-medium">{ch.name}</span>
                </span>
                {ch.unread && ch.unread > 0 && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${
                      selectedChannel === ch.id
                        ? "bg-white/20 text-white"
                        : "bg-rose-dark text-white"
                    }`}
                  >
                    {ch.unread}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>

        {/* Direct Messages section */}
        <div className="mb-1 mt-5 flex items-center justify-between px-2 py-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">
            Direct Messages
          </span>
          <button className="flex size-5 items-center justify-center rounded text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3">
            <svg className="size-3.5" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 5v14m-7-7h14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <ul className="space-y-0.5">
          {dmUsers.map((user) => (
            <li key={user.id}>
              <button className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-dark-5 transition-colors hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      width={22}
                      height={22}
                      className="rounded-full"
                    />
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-white dark:border-dark-2 ${
                        user.status === "online"
                          ? "bg-emerald-dark"
                          : user.status === "away"
                          ? "bg-amber-dark"
                          : "bg-gray-4"
                      }`}
                    />
                  </div>
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                {user.unread && user.unread > 0 && (
                  <span className="rounded-full bg-rose-dark px-1.5 py-0.5 text-xs font-bold text-white">
                    {user.unread}
                  </span>
                )}
              </button>
            </li>
          ))}
          <li>
            <button className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-dark-5 transition-colors hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3">
              <span className="flex size-5 items-center justify-center rounded-full bg-gray-3 dark:bg-dark-3">
                <span className="text-xs font-bold">+8</span>
              </span>
              <span className="text-xs">more</span>
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
}
