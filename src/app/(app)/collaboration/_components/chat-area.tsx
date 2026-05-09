"use client";

import Image from "next/image";
import { useState } from "react";
import type { Channel, Message } from "./collaboration-data";
import { MessageItem } from "./message-item";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";

interface ChatAreaProps {
  channel: Channel;
  messages: Message[];
}

export function ChatArea({ channel, messages }: ChatAreaProps) {
  const [input, setInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const { toast, setToast } = useToast();

  // Group messages — first 6 on "Today", rest on "Yesterday"
  const todayMessages = messages.slice(0, 9);
  const recentMessages = messages.slice(9);

  const emojis = ["👍", "❤️", "😊", "🎉", "🔥", "👏", "😂", "🙌", "💯", "✅", "🚀", "😅"];

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Channel header */}
      <div className="flex items-center justify-between border-b border-gray-3 bg-white px-5 py-3 dark:border-dark-3 dark:bg-dark-2">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-dark-5 dark:text-dark-6">#</span>
              <h2 className="text-sm font-bold text-dark dark:text-white">
                {channel.name}
              </h2>
              <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300">
                {channel.members} members
              </span>
            </div>
            <p className="text-xs text-dark-5 dark:text-dark-6">
              {channel.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {[
            {
              label: "Notifications",
              icon: (
                <path
                  d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ),
            },
            {
              label: "Search",
              icon: (
                <path
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ),
            },
            {
              label: "Settings",
              icon: (
                <path
                  d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ),
            },
          ].map((btn) => (
            <button
              key={btn.label}
              aria-label={btn.label}
              className="flex size-8 items-center justify-center rounded-lg text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3"
            >
              <svg className="size-4.5" viewBox="0 0 24 24" fill="none">
                {btn.icon}
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-white px-3 py-4 dark:bg-dark-2">
        {/* Date divider */}
        <div className="mb-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-3 dark:bg-dark-3" />
          <span className="rounded-full border border-gray-3 px-3 py-0.5 text-xs text-dark-5 dark:border-dark-3 dark:text-dark-6">
            Yesterday
          </span>
          <div className="h-px flex-1 bg-gray-3 dark:bg-dark-3" />
        </div>

        <div className="space-y-1">
          {todayMessages.map((msg) => (
            <MessageItem key={msg.id} message={msg} />
          ))}
        </div>

        {/* Today divider */}
        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-3 dark:bg-dark-3" />
          <span className="rounded-full border border-gray-3 px-3 py-0.5 text-xs font-medium text-dark-5 dark:border-dark-3 dark:text-dark-6">
            Today
          </span>
          <div className="h-px flex-1 bg-gray-3 dark:bg-dark-3" />
        </div>

        <div className="space-y-1">
          {recentMessages.map((msg) => (
            <MessageItem key={msg.id} message={msg} />
          ))}
        </div>
      </div>

      {/* Compose box */}
      <div className="border-t border-gray-3 bg-white p-4 dark:border-dark-3 dark:bg-dark-2">
        <div className="overflow-hidden rounded-xl border border-gray-3 dark:border-dark-3">
          {/* Formatting toolbar */}
          <div className="flex items-center gap-1 border-b border-gray-3 px-3 py-2 dark:border-dark-3">
            {[
              { label: "Bold", text: "B", style: "font-bold", insert: "**bold**" },
              { label: "Italic", text: "I", style: "italic", insert: "_italic_" },
              { label: "Strike", text: "S", style: "line-through", insert: "~~strikethrough~~" },
            ].map((f) => (
              <button
                key={f.label}
                onClick={() => setInput((prev) => prev + f.insert)}
                className={`flex size-7 items-center justify-center rounded text-xs ${f.style} text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3`}
              >
                {f.text}
              </button>
            ))}
            <div className="mx-1 h-4 w-px bg-gray-3 dark:bg-dark-3" />
            <button
              onClick={() => setInput((prev) => prev + "`code`")}
              className="flex size-7 items-center justify-center rounded text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3"
            >
              <svg className="size-4" viewBox="0 0 24 24" fill="none">
                <path
                  d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              onClick={() => setToast("File attachment coming soon!")}
              className="flex size-7 items-center justify-center rounded text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3"
            >
              <svg className="size-4" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Input row */}
          <div className="flex items-center gap-3 px-3 py-2.5">
            <Image
              src="/images/user/user-01.png"
              alt="You"
              width={28}
              height={28}
              className="size-7 flex-shrink-0 rounded-full"
            />
            <input
              type="text"
              placeholder={`Message #${channel.name}`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && input.trim()) {
                  setInput("");
                }
              }}
              className="flex-1 bg-transparent text-sm text-dark outline-none placeholder-dark-5 dark:text-white dark:placeholder-dark-6"
            />
            <div className="relative flex items-center gap-1">
              {/* Emoji picker */}
              <button
                onClick={() => setShowEmoji((v) => !v)}
                className="flex size-7 items-center justify-center rounded text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3"
              >
                <svg className="size-4" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {showEmoji && (
                <div className="absolute bottom-9 right-0 z-10 flex flex-wrap gap-1 rounded-xl border border-gray-3 bg-white p-2 shadow-lg dark:border-dark-3 dark:bg-dark-2" style={{ width: "192px" }}>
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        setInput((prev) => prev + emoji);
                        setShowEmoji(false);
                      }}
                      className="flex size-8 items-center justify-center rounded text-lg hover:bg-gray-2 dark:hover:bg-dark-3"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
              <button
                onClick={() => setToast("File attachment coming soon!")}
                className="flex size-7 items-center justify-center rounded text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3"
              >
                <svg className="size-4" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                onClick={() => {
                  if (input.trim()) {
                    setInput("");
                  }
                }}
                className={`ml-1 flex size-8 items-center justify-center rounded-lg transition-colors ${
                  input.trim()
                    ? "bg-primary-600 text-white hover:bg-primary-700"
                    : "bg-gray-3 text-dark-5 dark:bg-dark-3 dark:text-dark-6"
                }`}
              >
                <svg className="size-4" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Toast message={toast} />
    </div>
  );
}
