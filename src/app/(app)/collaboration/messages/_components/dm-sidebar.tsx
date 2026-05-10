"use client";

import Image from "next/image";
import { DM_LIST } from "../_data/messages-data";
import type { DMContact } from "../_data/messages-data";

const STATUS_DOT: Record<DMContact["status"], string> = {
  online: "bg-emerald-dark",
  away: "bg-amber-dark",
  offline: "bg-gray-4",
};

interface Props {
  activeDm: number;
  search: string;
  onSelect: (index: number) => void;
  onSearch: (value: string) => void;
  onNewDm: () => void;
}

export function DmSidebar({ activeDm, search, onSelect, onSearch, onNewDm }: Readonly<Props>) {
  const filteredDms = DM_LIST.filter((dm) =>
    dm.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className="flex w-72 flex-shrink-0 flex-col border-r border-gray-3 bg-white dark:border-dark-3 dark:bg-dark-2">
      <div className="flex items-center justify-between border-b border-gray-3 px-4 py-3.5 dark:border-dark-3">
        <span className="text-body font-bold">Direct Messages</span>
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
            placeholder="Search messages..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="h-8 w-full rounded-lg border border-gray-3 bg-gray-2 pl-8 pr-3 text-xs outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white dark:placeholder-dark-6"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {filteredDms.map((dm) => {
          const originalIndex = DM_LIST.findIndex((d) => d.name === dm.name);
          const isActive = originalIndex === activeDm;
          return (
            <button
              key={dm.name}
              onClick={() => onSelect(originalIndex)}
              className={`flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-colors ${isActive ? "bg-indigo-50 dark:bg-indigo-900/20" : "hover:bg-gray-2 dark:hover:bg-dark-3"}`}
            >
              <div className="relative flex-shrink-0">
                <Image src={dm.avatar} alt={dm.name} width={36} height={36} className="size-9 rounded-full" />
                <span className={`absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-white dark:border-dark-2 ${STATUS_DOT[dm.status]}`} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-semibold ${isActive ? "text-primary-600 dark:text-primary-300" : "text-dark dark:text-white"}`}>{dm.name}</span>
                  <span className="text-muted">{dm.time}</span>
                </div>
                <p className="truncate text-muted">{dm.lastMsg}</p>
              </div>
              {dm.unread && (
                <span className="rounded-full bg-rose-dark px-1.5 py-0.5 text-xs font-bold text-white">{dm.unread}</span>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
