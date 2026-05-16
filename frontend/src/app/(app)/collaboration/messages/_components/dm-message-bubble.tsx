import Image from "next/image";
import type { Dispatch, SetStateAction } from "react";
import type { ChannelMessage } from "@/lib/actions/messages";
import type { DmMessage } from "@/lib/actions/dm";

export type ReadReceipt = {
  userId: string;
  name: string;
  avatar: string | null;
  readAt: string;
};

export type AnyMessage = (ChannelMessage | DmMessage) & { readBy?: ReadReceipt[] };

export interface SenderPopup {
  msgId: string;
  userId: string;
  name: string;
}

interface MessageBubbleProps {
  msg: AnyMessage;
  mode: "channel" | "dm";
  senderPop: SenderPopup | null;
  setSenderPop: Dispatch<SetStateAction<SenderPopup | null>>;
  onStartDm?: (userId: string, name: string) => void;
  onCallUser?: (userId: string, name: string, type: "audio" | "video") => void;
}

interface SenderAvatarProps {
  msg: AnyMessage;
  canClickSender: boolean;
  onAvatarClick: (e: { stopPropagation(): void }) => void;
}

interface SenderQuickActionsProps {
  senderPop: SenderPopup;
  onStartDm?: (userId: string, name: string) => void;
  onCallUser?: (userId: string, name: string, type: "audio" | "video") => void;
  setSenderPop: Dispatch<SetStateAction<SenderPopup | null>>;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function formatTimestamp(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const time = formatTime(iso);

  if (d.toDateString() === now.toDateString()) return time;

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return `Yesterday, ${time}`;

  if (d.getFullYear() === now.getFullYear()) {
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + `, ${time}`;
  }
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + `, ${time}`;
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function ReadAvatars({ readBy }: Readonly<{ readBy?: ReadReceipt[] }>) {
  const receipts = (readBy ?? []).filter((receipt, index, list) => list.findIndex((item) => item.userId === receipt.userId) === index);
  if (receipts.length === 0) return null;

  return (
    <div className="mt-1 flex items-center -space-x-1.5">
      {receipts.slice(0, 3).map((receipt) => (
        receipt.avatar ? (
          <Image
            key={receipt.userId}
            src={receipt.avatar}
            alt={receipt.name}
            width={16}
            height={16}
            className="size-4 rounded-full border border-white object-cover dark:border-dark-2"
            title={receipt.name}
          />
        ) : (
          <div
            key={receipt.userId}
            className="flex size-4 items-center justify-center rounded-full border border-white bg-primary-100 text-[8px] font-bold text-primary-700 dark:border-dark-2 dark:bg-primary-900/40 dark:text-primary-300"
            title={receipt.name}
          >
            {getInitials(receipt.name)}
          </div>
        )
      ))}
      {receipts.length > 3 && (
        <span className="ml-1 text-[10px] font-medium text-dark-5 dark:text-dark-6">+{receipts.length - 3}</span>
      )}
    </div>
  );
}

function SenderAvatar({ msg, canClickSender, onAvatarClick }: Readonly<SenderAvatarProps>) {
  if (msg.senderAvatar) {
    return (
      <Image
        src={msg.senderAvatar}
        alt={msg.senderName}
        width={32}
        height={32}
        className={`size-8 rounded-full object-cover ${canClickSender ? "cursor-pointer ring-2 ring-transparent hover:ring-primary-400 transition-all" : ""}`}
        onClick={onAvatarClick}
      />
    );
  }

  return (
    <button
      type="button"
      aria-label={`Open actions for ${msg.senderName}`}
      className={`flex size-8 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 ${canClickSender ? "cursor-pointer hover:ring-2 hover:ring-primary-400 transition-all" : ""}`}
      onClick={onAvatarClick}
    >
      {getInitials(msg.senderName)}
    </button>
  );
}

function SenderQuickActions({ senderPop, onStartDm, onCallUser, setSenderPop }: Readonly<SenderQuickActionsProps>) {
  return (
    <div className="absolute left-9 top-0 z-30 flex items-center gap-0.5 rounded-xl border border-gray-3 bg-white px-1.5 py-1.5 shadow-card dark:border-dark-3 dark:bg-dark-2">
      <p className="mr-1 max-w-[80px] truncate px-1 text-xs font-semibold text-dark dark:text-white">{senderPop.name.split(" ")[0]}</p>
      <button
        title="Send message"
        onClick={() => { onStartDm?.(senderPop.userId, senderPop.name); setSenderPop(null); }}
        className="flex size-7 items-center justify-center rounded-lg text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20"
      >
        <svg className="size-4" viewBox="0 0 24 24" fill="none"><path d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <button
        title="Audio call"
        onClick={() => { onCallUser?.(senderPop.userId, senderPop.name, "audio"); setSenderPop(null); }}
        className="flex size-7 items-center justify-center rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
      >
        <svg className="size-4" viewBox="0 0 24 24" fill="none"><path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <button
        title="Video call"
        onClick={() => { onCallUser?.(senderPop.userId, senderPop.name, "video"); setSenderPop(null); }}
        className="flex size-7 items-center justify-center rounded-lg text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20"
      >
        <svg className="size-4" viewBox="0 0 24 24" fill="none"><path d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
    </div>
  );
}

export function MessageBubble({ msg, mode, senderPop, setSenderPop, onStartDm, onCallUser }: Readonly<MessageBubbleProps>) {
  const canClickSender = mode === "channel" && !msg.isMe && !!onStartDm;

  function handleAvatarClick(e: { stopPropagation(): void }) {
    if (!canClickSender) return;
    e.stopPropagation();
    setSenderPop((prev) => prev?.msgId === msg.id ? null : { msgId: msg.id, userId: msg.senderId, name: msg.senderName });
  }

  return (
    <div className={`flex gap-3 py-1 ${msg.isMe ? "flex-row-reverse" : ""}`}>
      <div className="relative mt-0.5 shrink-0">
        <SenderAvatar msg={msg} canClickSender={canClickSender} onAvatarClick={handleAvatarClick} />
        {senderPop?.msgId === msg.id && (
          <SenderQuickActions senderPop={senderPop} onStartDm={onStartDm} onCallUser={onCallUser} setSenderPop={setSenderPop} />
        )}
      </div>
      <div className={`max-w-sm flex flex-col gap-0.5 ${msg.isMe ? "items-end" : "items-start"}`}>
        <p className="text-xs text-dark-5 dark:text-dark-6">{msg.isMe ? "You" : msg.senderName}</p>
        <div className={`rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${msg.isMe ? "bg-primary-600 text-white" : "bg-gray-1 text-dark-4 dark:bg-dark-3 dark:text-dark-7"}`}>
          {msg.content}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-dark-5 dark:text-dark-6">{formatTimestamp(msg.createdAt)}</span>
          {msg.readBy && <ReadAvatars readBy={msg.readBy} />}
        </div>
      </div>
    </div>
  );
}
