"use client";

import Image from "next/image";
import { useRef } from "react";
import { DM_MESSAGES } from "../_data/messages-data";
import type { DMContact } from "../_data/messages-data";

const STATUS_DOT: Record<DMContact["status"], string> = {
  online: "bg-emerald-dark",
  away: "bg-amber-dark",
  offline: "bg-gray-4",
};

const STATUS_LABEL: Record<DMContact["status"], string> = {
  online: "Online",
  away: "Away",
  offline: "Offline",
};

const STATUS_TEXT: Record<DMContact["status"], string> = {
  online: "text-emerald-dark",
  away: "text-amber-dark",
  offline: "text-dark-5 dark:text-dark-6",
};

interface Props {
  activeChat: DMContact;
  input: string;
  onInputChange: (v: string) => void;
  onCall: () => void;
  onVideo: () => void;
  onSearch: () => void;
  onEmoji: () => void;
  onAttach: () => void;
}

export function DmChatArea({ activeChat, input, onInputChange, onCall, onVideo, onSearch, onEmoji, onAttach }: Readonly<Props>) {
  const inputRef = useRef<HTMLInputElement>(null);

  const headerButtons = [
    { label: "Call", path: "M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z", action: onCall },
    { label: "Video", path: "M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z", action: onVideo },
    { label: "Search", path: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z", action: () => { inputRef.current?.focus(); onSearch(); } },
  ];

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-3 bg-white px-5 py-3 dark:border-dark-3 dark:bg-dark-2">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Image src={activeChat.avatar} alt={activeChat.name} width={36} height={36} className="size-9 rounded-full" />
            <span className={`absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-white dark:border-dark-2 ${STATUS_DOT[activeChat.status]}`} />
          </div>
          <div>
            <p className="text-body font-bold">{activeChat.name}</p>
            <p className={`text-xs ${STATUS_TEXT[activeChat.status]}`}>{STATUS_LABEL[activeChat.status]}</p>
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
        <div className="mb-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-3 dark:bg-dark-3" />
          <span className="rounded-full border border-gray-3 px-3 py-0.5 text-muted dark:border-dark-3">Today · May 7, 2026</span>
          <div className="h-px flex-1 bg-gray-3 dark:bg-dark-3" />
        </div>

        <div className="space-y-4">
          {DM_MESSAGES.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.from === "me" ? "flex-row-reverse" : ""}`}>
              <Image
                src={msg.from === "sarah" ? "/images/user/user-01.png" : "/images/user/user-12.png"}
                alt={msg.from === "sarah" ? "Sarah Mitchell" : "You"}
                width={32} height={32}
                className="mt-0.5 size-8 flex-shrink-0 rounded-full"
              />
              <div className={`max-w-sm ${msg.from === "me" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                {msg.attachment ? (
                  <div className={`rounded-xl border border-gray-3 px-3 py-2.5 dark:border-dark-3 ${msg.from === "me" ? "bg-primary-600 text-white" : "bg-gray-1 dark:bg-dark-3"}`}>
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 flex-shrink-0 items-center justify-center rounded-lg bg-rose-light dark:bg-rose-dark/20">
                        <svg className="size-4 text-rose-dark" viewBox="0 0 24 24" fill="none">
                          <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div>
                        <p className={`text-xs font-medium ${msg.from === "me" ? "text-white" : "text-dark dark:text-white"}`}>{msg.attachment.name}</p>
                        <p className={`text-xs ${msg.from === "me" ? "text-white/70" : "text-dark-5 dark:text-dark-6"}`}>{msg.attachment.type} · {msg.attachment.size}</p>
                      </div>
                    </div>
                    {msg.text && <p className={`mt-2 text-sm ${msg.from === "me" ? "text-white" : "text-dark-4 dark:text-dark-7"}`}>{msg.text}</p>}
                  </div>
                ) : (
                  <div className={`rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${msg.from === "me" ? "bg-primary-600 text-white" : "bg-gray-1 text-dark-4 dark:bg-dark-3 dark:text-dark-7"}`}>
                    {msg.text}
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <span className="text-muted">{msg.timestamp}</span>
                  {msg.from === "me" && msg.read && (
                    <svg className="size-3.5 text-primary-300" viewBox="0 0 24 24" fill="none">
                      <path d="M4.5 12.75l6 6 9-13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div className="flex items-end gap-3">
            <Image src="/images/user/user-01.png" alt="Sarah Mitchell" width={32} height={32} className="size-8 flex-shrink-0 rounded-full" />
            <div className="flex items-center gap-2 rounded-xl bg-gray-1 px-4 py-3 dark:bg-dark-3">
              <div className="flex gap-1">
                <span className="size-2 animate-bounce rounded-full bg-dark-5 [animation-delay:0ms] dark:bg-dark-6" />
                <span className="size-2 animate-bounce rounded-full bg-dark-5 [animation-delay:150ms] dark:bg-dark-6" />
                <span className="size-2 animate-bounce rounded-full bg-dark-5 [animation-delay:300ms] dark:bg-dark-6" />
              </div>
              <span className="text-muted">Sarah is typing...</span>
            </div>
          </div>
        </div>
      </div>

      {/* Compose */}
      <div className="border-t border-gray-3 bg-white p-4 dark:border-dark-3 dark:bg-dark-2">
        <div className="overflow-hidden rounded-xl border border-gray-3 dark:border-dark-3">
          <div className="flex items-center gap-3 px-4 py-3">
            <Image src="/images/user/user-12.png" alt="You" width={28} height={28} className="size-7 flex-shrink-0 rounded-full" />
            <input
              ref={inputRef}
              type="text"
              placeholder={`Message ${activeChat.name}...`}
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
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
                onClick={() => { if (input.trim()) onInputChange(""); }}
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
