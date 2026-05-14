"use client";

import { Dropdown, DropdownContent, DropdownTrigger } from "@/components/ui/dropdown";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSocket } from "@/hooks/use-socket";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { BellIcon } from "./icons";
import { getNotifications, type NotificationItem } from "@/lib/actions/notifications";

const TYPE_ICONS: Record<string, string> = {
  leave: "🏖️",
  task: "📋",
  performance: "🎯",
  onboarding: "👋",
  payroll: "💰",
  dm: "💬",
  channel: "📢",
  call: "📞",
};

type RtNotif = {
  id: string;
  type: "dm" | "channel" | "call";
  title: string;
  description: string;
  href: string;
  time: string;
  read: boolean;
};

type DisplayNotif = {
  id: string;
  type: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  href: string;
};

export function Notification() {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const [isOpen, setIsOpen] = useState(false);
  const [sysNotifs, setSysNotifs] = useState<NotificationItem[]>([]);
  const [rtNotifs, setRtNotifs] = useState<RtNotif[]>([]);
  const [loaded, setLoaded] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    getNotifications()
      .then(setSysNotifs)
      .catch(() => null)
      .finally(() => setLoaded(true));
  }, []);

  // ─── Real-time handlers ───────────────────────────────────────────────────────

  const handleDmNew = useCallback((data: unknown) => {
    const p = data as { senderId: string; senderName: string; content: string; conversationId: string };
    if (p.senderId === currentUserId) return;
    if (p.content.startsWith('{"__call__"')) return;
    setRtNotifs((prev) => [
      {
        id: `dm-${Date.now()}`,
        type: "dm",
        title: p.senderName,
        description: p.content.length > 70 ? p.content.slice(0, 70) + "…" : p.content,
        href: `/collaboration/messages?dm=${p.conversationId}`,
        time: "Just now",
        read: false,
      },
      ...prev.slice(0, 9),
    ]);
  }, [currentUserId]);

  const handleMessageNew = useCallback((data: unknown) => {
    const p = data as { senderId: string; senderName: string; content: string; channelName?: string; channelId: string };
    if (p.senderId === currentUserId) return;
    const preview = p.content.length > 55 ? p.content.slice(0, 55) + "…" : p.content;
    setRtNotifs((prev) => [
      {
        id: `ch-${Date.now()}`,
        type: "channel",
        title: `#${p.channelName ?? "channel"}`,
        description: `${p.senderName}: ${preview}`,
        href: `/collaboration/messages?channel=${p.channelId}`,
        time: "Just now",
        read: false,
      },
      ...prev.slice(0, 9),
    ]);
  }, [currentUserId]);

  const handleCallInvite = useCallback((data: unknown) => {
    const p = data as { callerName: string; type: "audio" | "video"; conversationId?: string };
    setRtNotifs((prev) => [
      {
        id: `call-${Date.now()}`,
        type: "call",
        title: `Incoming ${p.type} call`,
        description: `from ${p.callerName}`,
        href: p.conversationId ? `/collaboration/messages?dm=${p.conversationId}` : "/collaboration/messages",
        time: "Just now",
        read: false,
      },
      ...prev.slice(0, 9),
    ]);
  }, []);

  useSocket({
    "dm:new": handleDmNew,
    "message:new": handleMessageNew,
    "call:invite": handleCallInvite,
  });

  // ─── Derived state ────────────────────────────────────────────────────────────

  const allNotifs: DisplayNotif[] = [
    ...rtNotifs,
    ...sysNotifs.map((n) => ({ ...n, description: n.description })),
  ];
  const unreadCount = allNotifs.filter((n) => !n.read).length;

  return (
    <Dropdown
      isOpen={isOpen}
      setIsOpen={(value) => {
        const next = typeof value === "function" ? value(isOpen) : value;
        if (next && !isOpen) {
          setRtNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
        }
        setIsOpen(next);
      }}
    >
      <DropdownTrigger
        className="grid size-12 place-items-center rounded-full border bg-gray-2 text-dark outline-none hover:text-primary focus-visible:border-primary focus-visible:text-primary dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus-visible:border-primary"
        aria-label="View Notifications"
      >
        <span className="relative">
          <BellIcon />
          {unreadCount > 0 && (
            <span className={cn("absolute right-0 top-0 z-1 size-2 rounded-full bg-red-light ring-2 ring-gray-2 dark:ring-dark-3")}>
              <span className="absolute inset-0 -z-1 animate-ping rounded-full bg-red-light opacity-75" />
            </span>
          )}
        </span>
      </DropdownTrigger>

      <DropdownContent
        align={isMobile ? "end" : "center"}
        className="border border-stroke bg-white px-3.5 py-3 shadow-md dark:border-dark-3 dark:bg-gray-dark min-[350px]:min-w-[20rem]"
      >
        <div className="mb-1 flex items-center justify-between px-2 py-1.5">
          <span className="text-lg font-medium text-dark dark:text-white">Notifications</span>
          {unreadCount > 0 && (
            <span className="rounded-md bg-primary px-[9px] py-0.5 text-xs font-medium text-white">
              {unreadCount} new
            </span>
          )}
        </div>

        <ul className="mb-3 max-h-[23rem] space-y-1.5 overflow-y-auto">
          {!loaded && rtNotifs.length === 0 ? (
            <li className="px-2 py-4 text-center text-sm text-dark-5 dark:text-dark-6">Loading…</li>
          ) : allNotifs.length === 0 ? (
            <li className="px-2 py-4 text-center text-sm text-dark-5 dark:text-dark-6">All caught up!</li>
          ) : (
            allNotifs.map((item) => (
              <li key={item.id} role="menuitem">
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-start gap-3 rounded-lg px-2 py-2 outline-none hover:bg-gray-2 focus-visible:bg-gray-2 dark:hover:bg-dark-3 dark:focus-visible:bg-dark-3"
                >
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-lg dark:bg-dark-3">
                    {TYPE_ICONS[item.type] ?? "🔔"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <strong className={`block text-sm font-medium ${item.read ? "text-dark-5 dark:text-dark-6" : "text-dark dark:text-white"}`}>
                      {item.title}
                    </strong>
                    <span className="block truncate text-xs text-dark-5 dark:text-dark-6">
                      {item.description}
                    </span>
                    <span className="text-xs text-dark-5 dark:text-dark-6">{item.time}</span>
                  </div>
                  {!item.read && (
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary-500" />
                  )}
                </Link>
              </li>
            ))
          )}
        </ul>

        <Link
          href="/collaboration/messages"
          onClick={() => setIsOpen(false)}
          className="block rounded-lg border border-primary p-2 text-center text-sm font-medium tracking-wide text-primary outline-none transition-colors hover:bg-blue-light-5 focus:bg-blue-light-5 dark:border-dark-3 dark:text-dark-6 dark:hover:border-dark-5 dark:hover:bg-dark-3 dark:hover:text-dark-7"
        >
          Go to Messages
        </Link>
      </DropdownContent>
    </Dropdown>
  );
}
