"use client";

import Image from "next/image";
import type { ChannelItem } from "@/lib/actions/messages";
import type { DmConversation, DmUser } from "@/lib/actions/dm";

export type SidebarMode = "channel" | "dm";

interface Props {
  channels: ChannelItem[];
  conversations: DmConversation[];
  allUsers: DmUser[];
  activeChannelId: string | null;
  activeDmId: string | null;
  mode: SidebarMode;
  search: string;
  onSelectChannel: (id: string) => void;
  onSelectDm: (id: string) => void;
  onSearch: (value: string) => void;
  onNewDm: () => void;
  onStartDmWithUser: (userId: string, name: string, avatar: string | null) => void;
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

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function SearchBox({ value, onChange }: Readonly<{ value: string; onChange: (val: string) => void }>) {
  return (
    <div className="p-3">
      <div className="relative">
        <svg className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-dark-5" viewBox="0 0 24 24" fill="none">
          <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <input
          placeholder="Search people or channels..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-full rounded-lg border border-gray-3 bg-gray-2 pl-8 pr-3 text-xs outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white dark:placeholder-dark-6"
        />
      </div>
    </div>
  );
}

function ChannelItem({ channel, isActive, onSelect }: Readonly<{ channel: ChannelItem; isActive: boolean; onSelect: () => void }>) {
  return (
    <button
      onClick={onSelect}
      className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors ${isActive ? "bg-primary-50 dark:bg-primary-900/20" : "hover:bg-gray-2 dark:hover:bg-dark-3"}`}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
        #
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <span className={`text-sm font-semibold truncate ${isActive ? "text-primary-600 dark:text-primary-300" : "text-dark dark:text-white"}`}>
            {channel.name}
          </span>
          <span className="text-muted ml-1 shrink-0">{formatTime(channel.lastMessageAt)}</span>
        </div>
        <p className="truncate text-muted">{channel.lastMessage ?? "No messages yet"}</p>
      </div>
    </button>
  );
}

function ChannelsSection({ channels, activeChannelId, onSelectChannel }: Readonly<{ channels: ChannelItem[]; activeChannelId: string | null; onSelectChannel: (id: string) => void }>) {
  if (channels.length === 0) return null;
  return (
    <>
      <p className="px-2 pt-2 pb-1 text-xs font-semibold uppercase tracking-wider text-dark-5 dark:text-dark-6">
        Channels
      </p>
      {channels.map((ch) => (
        <ChannelItem key={ch.id} channel={ch} isActive={ch.id === activeChannelId} onSelect={() => onSelectChannel(ch.id)} />
      ))}
    </>
  );
}

function ConversationItem({ conversation, isActive, onSelect }: Readonly<{ conversation: DmConversation; isActive: boolean; onSelect: () => void }>) {
  return (
    <button
      onClick={onSelect}
      className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors ${isActive ? "bg-primary-50 dark:bg-primary-900/20" : "hover:bg-gray-2 dark:hover:bg-dark-3"}`}
    >
      <div className="relative shrink-0">
        {conversation.otherUserAvatar ? (
          <Image src={conversation.otherUserAvatar} alt={conversation.otherUserName} width={32} height={32} className="size-8 rounded-full object-cover" />
        ) : (
          <div className="flex size-8 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
            {getInitials(conversation.otherUserName)}
          </div>
        )}
        <span className="absolute bottom-0 right-0 size-2 rounded-full bg-emerald-400 ring-1 ring-white dark:ring-dark-2" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <span className={`text-sm font-semibold truncate ${isActive ? "text-primary-600 dark:text-primary-300" : "text-dark dark:text-white"}`}>
            {conversation.otherUserName}
          </span>
          <div className="flex items-center gap-1 ml-1 shrink-0">
            <span className="text-muted">{formatTime(conversation.lastMessageAt)}</span>
            {conversation.unreadCount > 0 && (
              <span className="flex size-4 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white">
                {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
              </span>
            )}
          </div>
        </div>
        <p className="truncate text-muted">{conversation.lastMessage ?? "No messages yet"}</p>
      </div>
    </button>
  );
}

function ConversationsSection({ conversations, activeDmId, onSelectDm }: Readonly<{ conversations: DmConversation[]; activeDmId: string | null; onSelectDm: (id: string) => void }>) {
  return (
    <>
      <p className="px-2 pt-3 pb-1 text-xs font-semibold uppercase tracking-wider text-dark-5 dark:text-dark-6">
        Direct Messages
      </p>
      {conversations.map((c) => (
        <ConversationItem key={c.id} conversation={c} isActive={c.id === activeDmId} onSelect={() => onSelectDm(c.id)} />
      ))}
    </>
  );
}

function UserItem({ user, onStartDm }: Readonly<{ user: DmUser; onStartDm: () => void }>) {
  return (
    <button
      onClick={onStartDm}
      className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-gray-2 dark:hover:bg-dark-3"
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
        {getInitials(user.name)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-dark dark:text-white truncate">{user.name}</p>
        {user.jobTitle && <p className="text-xs text-dark-5 dark:text-dark-6 truncate">{user.jobTitle}</p>}
      </div>
      <span className="shrink-0 text-xs text-primary-600 dark:text-primary-400">Message</span>
    </button>
  );
}

function PeopleSection({ users, onStartDm }: Readonly<{ users: DmUser[]; onStartDm: (userId: string, name: string, avatar: string | null) => void }>) {
  if (users.length === 0) return null;
  return (
    <>
      <p className="px-2 pt-2 pb-1 text-xs font-semibold uppercase tracking-wider text-dark-5 dark:text-dark-6">
        People
      </p>
      {users.map((u) => (
        <UserItem key={u.userId} user={u} onStartDm={() => onStartDm(u.userId, u.name, u.avatar)} />
      ))}
    </>
  );
}

function EmptyState({ hasSearch, searchQuery }: Readonly<{ hasSearch: boolean; searchQuery: string }>) {
  if (hasSearch) {
    return (
      <p className="px-2 py-3 text-center text-xs text-dark-5 dark:text-dark-6">
        No results for &ldquo;{searchQuery}&rdquo;
      </p>
    );
  }
  return (
    <p className="px-2 py-3 text-center text-xs text-dark-5 dark:text-dark-6">
      No conversations yet. Click <strong>+</strong> or search for someone.
    </p>
  );
}

function computeFilteredState(
  channels: ChannelItem[],
  conversations: DmConversation[],
  allUsers: DmUser[],
  search: string
) {
  const q = search.toLowerCase().trim();
  const filteredChannels = q ? channels.filter((ch) => ch.name.toLowerCase().includes(q)) : channels;
  const filteredConvos = q ? conversations.filter((c) => c.otherUserName.toLowerCase().includes(q)) : conversations;
  const existingUserIds = new Set(conversations.map((c) => c.otherUserId));
  const searchableUsers = q ? allUsers.filter((u) => u.name.toLowerCase().includes(q) && !existingUserIds.has(u.userId)) : [];
  const hasResults = filteredChannels.length > 0 || filteredConvos.length > 0 || searchableUsers.length > 0;
  return { filteredChannels, filteredConvos, searchableUsers, hasResults, q };
}

function SidebarHeader({ onNewDm }: Readonly<{ onNewDm: () => void }>) {
  return (
    <div className="flex items-center justify-between border-b border-gray-3 px-4 py-3.5 dark:border-dark-3">
      <span className="text-body font-bold">Messages</span>
      <button
        onClick={onNewDm}
        title="New direct message"
        className="flex size-7 items-center justify-center rounded-lg text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3"
      >
        <svg className="size-4" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}



export function DmSidebar({
  channels,
  conversations,
  allUsers,
  activeChannelId,
  activeDmId,
  search,
  onSelectChannel,
  onSelectDm,
  onSearch,
  onNewDm,
  onStartDmWithUser,
}: Readonly<Props>) {
  const { filteredChannels, filteredConvos, searchableUsers, hasResults, q } = computeFilteredState(
    channels,
    conversations,
    allUsers,
    search
  );

  const shouldShowEmpty = !q && filteredConvos.length === 0 && filteredChannels.length === 0;
  const shouldShowNoResults = q && !hasResults;

  return (
    <aside className="flex w-72 flex-shrink-0 flex-col border-r border-gray-3 bg-white dark:border-dark-3 dark:bg-dark-2">
      <SidebarHeader onNewDm={onNewDm} />
      <SearchBox value={search} onChange={onSearch} />
      <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1">
        <ChannelsSection channels={filteredChannels} activeChannelId={activeChannelId} onSelectChannel={onSelectChannel} />
        <ConversationsSection conversations={filteredConvos} activeDmId={activeDmId} onSelectDm={onSelectDm} />
        <PeopleSection users={searchableUsers} onStartDm={onStartDmWithUser} />
        {shouldShowEmpty && <EmptyState hasSearch={false} searchQuery="" />}
        {shouldShowNoResults && <EmptyState hasSearch={true} searchQuery={search} />}
      </div>
    </aside>
  );
}
