"use client";

import { useRef } from "react";
import Image from "next/image";
import type { ChannelItem, ChannelMessage } from "@/lib/actions/messages";

interface Props {
  channel: ChannelItem | null;
  messages: ChannelMessage[];
  input: string;
  onInputChange: (v: string) => void;
  onSend: () => void;
  onCall: () => void;
  onVideo: () => void;
  onSearch: () => void;
  onEmoji: () => void;
  onAttach: () => void;
}

function formatMsgTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export function DmChatArea({ channel, messages, input, onInputChange, onSend, onCall, onVideo, onSearch, onEmoji, onAttach }: Readonly<Props>) {
  const inputRef = useRef<HTMLInputElement>(null);

  const headerButtons = [
    { label: "Call", path: "M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z", action: onCall },
    { label: "Video", path: "M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z", action: onVideo },
    { label: "Search", path: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z", action: () => { inputRef.current?.focus(); onSearch(); } },
  ];

  if (!channel) {
    return (
      <div className="flex flex-1 items-center justify-center bg-white dark:bg-dark-2">
        <p className="text-sm text-dark-5 dark:text-dark-6">Select a channel to start messaging.</p>
      </div>
    );
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-3 bg-white px-5 py-3 dark:border-dark-3 dark:bg-dark-2">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
            #
          </div>
          <div>
            <p className="text-body font-bold">{channel.name}</p>
            <p className="text-xs text-dark-5 dark:text-dark-6">{channel.isPrivate ? "Private channel" : "Public channel"}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {headerButtons.map((btn) => (
            <button key={btn.label} aria-label={btn.label} onClick={btn.action} className="flex size-8 items-center justify-center rounded-lg text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3">
              <svg className="size-4.5" viewBox="0 0 24 24" fill="none">
                <path d={btn.path} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-white px-5 py-5 dark:bg-dark-2">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-dark-5 dark:text-dark-6">No messages in #{channel.name} yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.isMe ? "flex-row-reverse" : ""}`}>
                {msg.senderAvatar ? (
                  <Image src={msg.senderAvatar} alt={msg.senderName} width={32} height={32} className="mt-0.5 size-8 flex-shrink-0 rounded-full object-cover" />
                ) : (
                  <div className="mt-0.5 flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                    {getInitials(msg.senderName)}
                  </div>
                )}
                <div className={`max-w-sm flex flex-col gap-1 ${msg.isMe ? "items-end" : "items-start"}`}>
                  <p className="text-xs text-dark-5 dark:text-dark-6">{msg.isMe ? "You" : msg.senderName}</p>
                  <div className={`rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${msg.isMe ? "bg-primary-600 text-white" : "bg-gray-1 text-dark-4 dark:bg-dark-3 dark:text-dark-7"}`}>
                    {msg.content}
                  </div>
                  <span className="text-muted">{formatMsgTime(msg.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Compose */}
      <div className="border-t border-gray-3 bg-white p-4 dark:border-dark-3 dark:bg-dark-2">
        <div className="overflow-hidden rounded-xl border border-gray-3 dark:border-dark-3">
          <div className="flex items-center gap-3 px-4 py-3">
            <input
              ref={inputRef}
              type="text"
              placeholder={`Message #${channel.name}...`}
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
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
    </div>
  );
}
