"use client";

import { Fragment, useRef, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import Image from "next/image";
import type { ChannelItem, ChannelMessage } from "@/lib/actions/messages";
import type { DmConversation, DmMessage } from "@/lib/actions/dm";

type ReadReceipt = {
  userId: string;
  name: string;
  avatar: string | null;
  readAt: string;
};

type AnyMessage = (ChannelMessage | DmMessage) & { readBy?: ReadReceipt[] };

interface Props {
  mode: "channel" | "dm";
  channel: ChannelItem | null;
  conversation: DmConversation | null;
  messages: AnyMessage[];
  input: string;
  onInputChange: (v: string) => void;
  onSend: () => void;
  onCall: (type: "audio" | "video") => void;
  onSearch: () => void;
  onEmoji: () => void;
  onAttach: () => void;
  onStartDm?: (userId: string, name: string) => void;
  onCallUser?: (userId: string, name: string, type: "audio" | "video") => void;
}

function getHeaderSub(mode: "channel" | "dm", isPrivate?: boolean) {
  if (mode === "dm") return "Direct message";
  return isPrivate ? "Private channel" : "Public channel";
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

function formatDateSeparator(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return "Today";
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  if (d.getFullYear() === now.getFullYear()) {
    return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  }
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function isSameDay(a: string, b: string) {
  return new Date(a).toDateString() === new Date(b).toDateString();
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function formatDuration(secs: number) {
  if (secs < 60) return `${secs}s`;
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function parseCallContent(content: string): { callType: "audio" | "video"; status: "ended" | "missed"; duration: number } | null {
  if (!content.startsWith('{"__call__"')) return null;
  try {
    const p = JSON.parse(content) as { __call__: boolean; callType: "audio" | "video"; status: "ended" | "missed"; duration: number };
    if (!p.__call__) return null;
    return { callType: p.callType, status: p.status, duration: p.duration ?? 0 };
  } catch {
    return null;
  }
}

function CallStamp({ callType, status, duration, createdAt }: Readonly<{ callType: "audio" | "video"; status: "ended" | "missed"; duration: number; createdAt: string }>) {
  const isMissed = status === "missed";
  const callKind = callType === "video" ? "Video" : "Voice";
  let callState = "";
  if (isMissed) {
    callState = `Missed ${callType === "video" ? "video" : "voice"} call`;
  } else {
    const durationSuffix = duration > 0 ? ` · ${formatDuration(duration)}` : "";
    callState = `${callKind} call${durationSuffix}`;
  }
  return (
    <div className="flex justify-center py-2">
      <div className="flex items-center gap-2.5 rounded-xl border border-gray-3 bg-white px-4 py-2.5 shadow-sm dark:border-dark-3 dark:bg-dark-3">
        <div className={`flex size-8 items-center justify-center rounded-full ${isMissed ? "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400" : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"}`}>
          {callType === "video" ? (
            <svg className="size-4" viewBox="0 0 24 24" fill="none">
              <path d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg className="size-4" viewBox="0 0 24 24" fill="none">
              <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-dark dark:text-white">
            {callState}
          </p>
          <p className="text-xs text-dark-5 dark:text-dark-6">{formatTimestamp(createdAt)}</p>
        </div>
      </div>
    </div>
  );
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

interface SenderPopup {
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

interface MessagesPaneProps {
  mode: "channel" | "dm";
  messages: AnyMessage[];
  channelName?: string;
  conversationName?: string;
  senderPop: SenderPopup | null;
  setSenderPop: React.Dispatch<React.SetStateAction<SenderPopup | null>>;
  onStartDm?: (userId: string, name: string) => void;
  onCallUser?: (userId: string, name: string, type: "audio" | "video") => void;
  bottomRef: React.RefObject<HTMLDivElement | null>;
}

function MessagesPane({
  mode,
  messages,
  channelName,
  conversationName,
  senderPop,
  setSenderPop,
  onStartDm,
  onCallUser,
  bottomRef,
}: Readonly<MessagesPaneProps>) {
  return (
    <div className="flex-1 overflow-y-auto bg-white px-5 py-5 dark:bg-dark-2">
      {messages.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-sm text-dark-5 dark:text-dark-6">
            {mode === "dm"
              ? `Start your conversation with ${conversationName ?? "this user"}`
              : `No messages in #${channelName ?? "channel"} yet. Start the conversation!`}
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {messages.map((msg, idx) => {
            const prevMsg = messages[idx - 1];
            const showDateSep = !prevMsg || !isSameDay(msg.createdAt, prevMsg.createdAt);
            const callData = mode === "dm" ? parseCallContent(msg.content) : null;

            return (
              <Fragment key={msg.id}>
                {showDateSep && (
                  <div className="flex items-center gap-3 py-3">
                    <div className="flex-1 border-t border-gray-3 dark:border-dark-3" />
                    <span className="shrink-0 rounded-full border border-gray-3 bg-white px-3 py-0.5 text-xs font-medium text-dark-5 dark:border-dark-3 dark:bg-dark-2 dark:text-dark-6">
                      {formatDateSeparator(msg.createdAt)}
                    </span>
                    <div className="flex-1 border-t border-gray-3 dark:border-dark-3" />
                  </div>
                )}

                {callData ? (
                  <CallStamp {...callData} createdAt={msg.createdAt} />
                ) : (
                  <MessageBubble
                    msg={msg}
                    mode={mode}
                    senderPop={senderPop}
                    setSenderPop={setSenderPop}
                    onStartDm={onStartDm}
                    onCallUser={onCallUser}
                  />
                )}
              </Fragment>
            );
          })}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
}

interface ComposerProps {
  inputRef: React.RefObject<HTMLInputElement | null>;
  placeholder: string;
  input: string;
  onInputChange: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onEmoji: () => void;
  onAttach: () => void;
  onSend: () => void;
}

function Composer({
  inputRef,
  placeholder,
  input,
  onInputChange,
  onKeyDown,
  onEmoji,
  onAttach,
  onSend,
}: Readonly<ComposerProps>) {
  return (
    <div className="border-t border-gray-3 bg-white p-4 dark:border-dark-3 dark:bg-dark-2">
      <div className="overflow-hidden rounded-xl border border-gray-3 dark:border-dark-3">
        <div className="flex items-center gap-3 px-4 py-3">
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={onKeyDown}
            className="flex-1 bg-transparent text-sm text-dark outline-none placeholder-dark-5 dark:text-white dark:placeholder-dark-6"
          />
          <div className="flex items-center gap-1">
            <button onClick={onEmoji} className="flex size-7 items-center justify-center rounded text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3">
              <svg className="size-4" viewBox="0 0 24 24" fill="none">
                <path d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button onClick={onAttach} className="flex size-7 items-center justify-center rounded text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3">
              <svg className="size-4" viewBox="0 0 24 24" fill="none">
                <path d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={onSend}
              disabled={!input.trim()}
              className={`ml-1 flex size-8 items-center justify-center rounded-lg transition-colors ${input.trim() ? "bg-primary-600 text-white hover:bg-primary-700" : "bg-gray-3 text-dark-5 dark:bg-dark-3 dark:text-dark-6"}`}
            >
              <svg className="size-4" viewBox="0 0 24 24" fill="none">
                <path d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ msg, mode, senderPop, setSenderPop, onStartDm, onCallUser }: Readonly<MessageBubbleProps>) {
  const canClickSender = mode === "channel" && !msg.isMe && !!onStartDm;
  function handleAvatarClick(e: { stopPropagation(): void }) {
    if (!canClickSender) return;
    e.stopPropagation();
    setSenderPop((prev) => prev?.msgId === msg.id ? null : { msgId: msg.id, userId: msg.senderId, name: msg.senderName });
  }
  return (
    <div className={`flex gap-3 py-1 ${msg.isMe ? "flex-row-reverse" : ""}`}>
      <div className="relative mt-0.5 shrink-0">
        {msg.senderAvatar ? (
          <Image
            src={msg.senderAvatar}
            alt={msg.senderName}
            width={32}
            height={32}
            className={`size-8 rounded-full object-cover ${canClickSender ? "cursor-pointer ring-2 ring-transparent hover:ring-primary-400 transition-all" : ""}`}
            onClick={handleAvatarClick}
          />
        ) : (
          <button
            type="button"
            aria-label={`Open actions for ${msg.senderName}`}
            className={`flex size-8 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 ${canClickSender ? "cursor-pointer hover:ring-2 hover:ring-primary-400 transition-all" : ""}`}
            onClick={handleAvatarClick}
          >
            {getInitials(msg.senderName)}
          </button>
        )}
        {senderPop?.msgId === msg.id && (
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

export function DmChatArea({
  mode,
  channel,
  conversation,
  messages,
  input,
  onInputChange,
  onSend,
  onCall,
  onSearch,
  onEmoji,
  onAttach,
  onStartDm,
  onCallUser,
}: Readonly<Props>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [senderPop, setSenderPop] = useState<SenderPopup | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const isEmpty = mode === "channel" ? !channel : !conversation;

  if (isEmpty) {
    return (
      <div className="flex flex-1 items-center justify-center bg-white dark:bg-dark-2">
        <p className="text-sm text-dark-5 dark:text-dark-6">Select a channel or conversation to start messaging.</p>
      </div>
    );
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }

  const headerName = mode === "dm" ? conversation?.otherUserName : channel?.name;
  const headerSub = getHeaderSub(mode, channel?.isPrivate);
  const headerAvatar = mode === "dm" ? conversation?.otherUserAvatar : null;
  const placeholder = mode === "dm"
    ? `Message ${conversation?.otherUserName ?? ""}…`
    : `Message #${channel?.name ?? ""}…`;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-3 bg-white px-5 py-3 dark:border-dark-3 dark:bg-dark-2">
        <div className="flex items-center gap-3">
          {mode === "dm" && headerAvatar ? (
            <Image src={headerAvatar} alt={headerName ?? ""} width={36} height={36} className="size-9 rounded-full object-cover" />
          ) : (
            <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${mode === "dm" ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300" : "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"}`}>
              {mode === "dm" ? getInitials(headerName ?? "") : "#"}
            </div>
          )}
          <div>
            <p className="text-body font-bold">{headerName}</p>
            <p className="text-xs text-dark-5 dark:text-dark-6">{headerSub}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {(mode === "dm" || mode === "channel") && (
            <>
              <button aria-label="Audio call" onClick={() => onCall("audio")} className="flex size-8 items-center justify-center rounded-lg text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3">
                <svg className="size-4.5" viewBox="0 0 24 24" fill="none">
                  <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button aria-label="Video call" onClick={() => onCall("video")} className="flex size-8 items-center justify-center rounded-lg text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3">
                <svg className="size-4.5" viewBox="0 0 24 24" fill="none">
                  <path d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </>
          )}
          <button aria-label="Search" onClick={() => { inputRef.current?.focus(); onSearch(); }} className="flex size-8 items-center justify-center rounded-lg text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3">
            <svg className="size-4.5" viewBox="0 0 24 24" fill="none">
              <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <MessagesPane
        mode={mode}
        messages={messages}
        channelName={channel?.name}
        conversationName={conversation?.otherUserName}
        senderPop={senderPop}
        setSenderPop={setSenderPop}
        onStartDm={onStartDm}
        onCallUser={onCallUser}
        bottomRef={bottomRef}
      />

      <Composer
        inputRef={inputRef}
        placeholder={placeholder}
        input={input}
        onInputChange={onInputChange}
        onKeyDown={handleKeyDown}
        onEmoji={onEmoji}
        onAttach={onAttach}
        onSend={onSend}
      />
    </div>
  );
}
