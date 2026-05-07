"use client";

import Image from "next/image";
import { useState } from "react";

interface DMMessage {
  id: string;
  from: "me" | "sarah";
  text: string;
  timestamp: string;
  read?: boolean;
  attachment?: { name: string; size: string; type: string };
}

const DM_MESSAGES: DMMessage[] = [
  {
    id: "1",
    from: "sarah",
    text: "Hey! Do you have a few minutes to chat about the Q2 headcount plan?",
    timestamp: "9:05 AM",
  },
  {
    id: "2",
    from: "me",
    text: "Of course! What's on your mind?",
    timestamp: "9:07 AM",
    read: true,
  },
  {
    id: "3",
    from: "sarah",
    text: "We got a green light from leadership to open 3 new roles in Engineering — 2 seniors and 1 staff-level. I want to make sure we align on job descriptions before posting.",
    timestamp: "9:08 AM",
  },
  {
    id: "4",
    from: "me",
    text: "That's great news! I can draft the JDs by tomorrow. Do you want to use our standard template or customize for these roles?",
    timestamp: "9:10 AM",
    read: true,
  },
  {
    id: "5",
    from: "sarah",
    text: "Let's customize — especially the staff role. I'll send you the competency framework we discussed last month.",
    timestamp: "9:11 AM",
  },
  {
    id: "6",
    from: "sarah",
    text: "Here's the competency doc I mentioned. Pay special attention to Section 3 — that's the new leadership criteria we finalized.",
    timestamp: "9:12 AM",
    attachment: {
      name: "Engineering_Competency_Framework_2026.pdf",
      size: "1.8 MB",
      type: "PDF",
    },
  },
  {
    id: "7",
    from: "me",
    text: "Got it, reviewing now. This is really well structured. I like the distinction between IC levels and the new Staff expectations.",
    timestamp: "9:20 AM",
    read: true,
  },
  {
    id: "8",
    from: "sarah",
    text: "Thanks! Tom and Elena spent a lot of time on it. Quick note — for the Senior roles, we want at least 5 years of distributed systems experience. Can you add that to the requirements?",
    timestamp: "9:22 AM",
  },
  {
    id: "9",
    from: "me",
    text: "Absolutely, I'll include that. Should I also add a preferred qualification for cloud architecture experience (AWS/GCP)?",
    timestamp: "9:25 AM",
    read: true,
  },
  {
    id: "10",
    from: "sarah",
    text: "Yes please — and Kubernetes too. We're deep in container orchestration on the platform side.",
    timestamp: "9:26 AM",
  },
  {
    id: "11",
    from: "me",
    text: "Perfect. I'll have first drafts ready by 3 PM tomorrow. Should I send them to you directly or post in #engineering?",
    timestamp: "9:28 AM",
    read: true,
  },
  {
    id: "12",
    from: "sarah",
    text: "Send them to me first for a quick review, then we can post in #engineering for broader feedback before finalizing.",
    timestamp: "9:29 AM",
  },
  {
    id: "13",
    from: "me",
    text: "Sounds like a plan! I'll also loop in Legal for a quick compliance review — especially for the remote work language.",
    timestamp: "9:31 AM",
    read: true,
  },
  {
    id: "14",
    from: "sarah",
    text: "Great thinking. One more thing — can we schedule a 30-min sync for Friday morning to go through the interview panel structure? I want to make sure we have diverse representation.",
    timestamp: "9:33 AM",
  },
  {
    id: "15",
    from: "me",
    text: "Friday works! How about 10 AM? I'll send a calendar invite.",
    timestamp: "9:34 AM",
    read: true,
  },
  {
    id: "16",
    from: "sarah",
    text: "10 AM is perfect. See you then! 🙌",
    timestamp: "9:35 AM",
  },
];

export default function MessagesPage() {
  const [input, setInput] = useState("");

  return (
    <div className="space-y-5">
      <div className="flex h-[calc(100vh-10rem)] overflow-hidden rounded-xl shadow-card">
        {/* Left: DM list */}
        <aside className="flex w-72 flex-shrink-0 flex-col border-r border-gray-3 bg-white dark:border-dark-3 dark:bg-dark-2">
          <div className="flex items-center justify-between border-b border-gray-3 px-4 py-3.5 dark:border-dark-3">
            <span className="text-sm font-bold text-dark dark:text-white">
              Direct Messages
            </span>
            <button className="flex size-7 items-center justify-center rounded-lg text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3">
              <svg className="size-4" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 5v14m-7-7h14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div className="p-3">
            <div className="relative">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-dark-5"
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
                placeholder="Search messages..."
                className="h-8 w-full rounded-lg border border-gray-3 bg-gray-2 pl-8 pr-3 text-xs outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white dark:placeholder-dark-6"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2 pb-4">
            {[
              {
                name: "Sarah Mitchell",
                avatar: "/images/user/user-01.png",
                status: "online",
                lastMsg: "10 AM is perfect. See you then!",
                time: "9:35 AM",
                unread: 2,
                active: true,
              },
              {
                name: "Daniel Park",
                avatar: "/images/user/user-02.png",
                status: "online",
                lastMsg: "Let me check and get back to you",
                time: "Yesterday",
                active: false,
              },
              {
                name: "Elena Torres",
                avatar: "/images/user/user-03.png",
                status: "away",
                lastMsg: "Thanks for the update!",
                time: "Yesterday",
                active: false,
              },
              {
                name: "Marcus Liu",
                avatar: "/images/user/user-04.png",
                status: "offline",
                lastMsg: "See you at the standup",
                time: "Mon",
                active: false,
              },
              {
                name: "Priya Sharma",
                avatar: "/images/user/user-05.png",
                status: "online",
                lastMsg: "The report is ready for review",
                time: "Mon",
                active: false,
              },
            ].map((dm) => (
              <button
                key={dm.name}
                className={`flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-colors ${
                  dm.active
                    ? "bg-primary-50 dark:bg-primary-600/10"
                    : "hover:bg-gray-2 dark:hover:bg-dark-3"
                }`}
              >
                <div className="relative flex-shrink-0">
                  <Image
                    src={dm.avatar}
                    alt={dm.name}
                    width={36}
                    height={36}
                    className="size-9 rounded-full"
                  />
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-white dark:border-dark-2 ${
                      dm.status === "online"
                        ? "bg-emerald-dark"
                        : dm.status === "away"
                        ? "bg-amber-dark"
                        : "bg-gray-4"
                    }`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-semibold ${
                        dm.active
                          ? "text-primary-600 dark:text-primary-300"
                          : "text-dark dark:text-white"
                      }`}
                    >
                      {dm.name}
                    </span>
                    <span className="text-xs text-dark-5 dark:text-dark-6">
                      {dm.time}
                    </span>
                  </div>
                  <p className="truncate text-xs text-dark-5 dark:text-dark-6">
                    {dm.lastMsg}
                  </p>
                </div>
                {"unread" in dm && dm.unread && (
                  <span className="rounded-full bg-rose-dark px-1.5 py-0.5 text-xs font-bold text-white">
                    {dm.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </aside>

        {/* Right: Conversation */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-3 bg-white px-5 py-3 dark:border-dark-3 dark:bg-dark-2">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Image
                  src="/images/user/user-01.png"
                  alt="Sarah Mitchell"
                  width={36}
                  height={36}
                  className="size-9 rounded-full"
                />
                <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-white bg-emerald-dark dark:border-dark-2" />
              </div>
              <div>
                <p className="text-sm font-bold text-dark dark:text-white">
                  Sarah Mitchell
                </p>
                <p className="text-xs text-emerald-dark">Online</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {[
                {
                  label: "Call",
                  path: "M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z",
                },
                {
                  label: "Video",
                  path: "M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z",
                },
                {
                  label: "Search",
                  path: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z",
                },
              ].map((btn) => (
                <button
                  key={btn.label}
                  aria-label={btn.label}
                  className="flex size-8 items-center justify-center rounded-lg text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3"
                >
                  <svg className="size-4.5" viewBox="0 0 24 24" fill="none">
                    <path
                      d={btn.path}
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-white px-5 py-5 dark:bg-dark-2">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-3 dark:bg-dark-3" />
              <span className="rounded-full border border-gray-3 px-3 py-0.5 text-xs text-dark-5 dark:border-dark-3 dark:text-dark-6">
                Today · May 7, 2026
              </span>
              <div className="h-px flex-1 bg-gray-3 dark:bg-dark-3" />
            </div>

            <div className="space-y-4">
              {DM_MESSAGES.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.from === "me" ? "flex-row-reverse" : ""}`}
                >
                  {msg.from === "sarah" && (
                    <Image
                      src="/images/user/user-01.png"
                      alt="Sarah Mitchell"
                      width={32}
                      height={32}
                      className="mt-0.5 size-8 flex-shrink-0 rounded-full"
                    />
                  )}
                  {msg.from === "me" && (
                    <Image
                      src="/images/user/user-12.png"
                      alt="You"
                      width={32}
                      height={32}
                      className="mt-0.5 size-8 flex-shrink-0 rounded-full"
                    />
                  )}
                  <div
                    className={`max-w-sm ${msg.from === "me" ? "items-end" : "items-start"} flex flex-col gap-1`}
                  >
                    {msg.attachment ? (
                      <div
                        className={`rounded-xl border border-gray-3 px-3 py-2.5 dark:border-dark-3 ${
                          msg.from === "me"
                            ? "bg-primary-600 text-white"
                            : "bg-gray-1 dark:bg-dark-3"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex size-8 flex-shrink-0 items-center justify-center rounded-lg bg-rose-light dark:bg-rose-dark/20">
                            <svg
                              className="size-4 text-rose-dark"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          <div>
                            <p
                              className={`text-xs font-medium ${
                                msg.from === "me" ? "text-white" : "text-dark dark:text-white"
                              }`}
                            >
                              {msg.attachment.name}
                            </p>
                            <p
                              className={`text-xs ${
                                msg.from === "me"
                                  ? "text-white/70"
                                  : "text-dark-5 dark:text-dark-6"
                              }`}
                            >
                              {msg.attachment.type} · {msg.attachment.size}
                            </p>
                          </div>
                        </div>
                        {msg.text && (
                          <p
                            className={`mt-2 text-sm ${
                              msg.from === "me" ? "text-white" : "text-dark-4 dark:text-dark-7"
                            }`}
                          >
                            {msg.text}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div
                        className={`rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                          msg.from === "me"
                            ? "bg-primary-600 text-white"
                            : "bg-gray-1 text-dark-4 dark:bg-dark-3 dark:text-dark-7"
                        }`}
                      >
                        {msg.text}
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-dark-5 dark:text-dark-6">
                        {msg.timestamp}
                      </span>
                      {msg.from === "me" && msg.read && (
                        <svg
                          className="size-3.5 text-primary-300"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M4.5 12.75l6 6 9-13.5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              <div className="flex items-end gap-3">
                <Image
                  src="/images/user/user-01.png"
                  alt="Sarah Mitchell"
                  width={32}
                  height={32}
                  className="size-8 flex-shrink-0 rounded-full"
                />
                <div className="flex items-center gap-2 rounded-xl bg-gray-1 px-4 py-3 dark:bg-dark-3">
                  <div className="flex gap-1">
                    <span className="size-2 animate-bounce rounded-full bg-dark-5 [animation-delay:0ms] dark:bg-dark-6" />
                    <span className="size-2 animate-bounce rounded-full bg-dark-5 [animation-delay:150ms] dark:bg-dark-6" />
                    <span className="size-2 animate-bounce rounded-full bg-dark-5 [animation-delay:300ms] dark:bg-dark-6" />
                  </div>
                  <span className="text-xs text-dark-5 dark:text-dark-6">
                    Sarah is typing...
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Compose */}
          <div className="border-t border-gray-3 bg-white p-4 dark:border-dark-3 dark:bg-dark-2">
            <div className="overflow-hidden rounded-xl border border-gray-3 dark:border-dark-3">
              <div className="flex items-center gap-3 px-4 py-3">
                <Image
                  src="/images/user/user-12.png"
                  alt="You"
                  width={28}
                  height={28}
                  className="size-7 flex-shrink-0 rounded-full"
                />
                <input
                  type="text"
                  placeholder="Message Sarah Mitchell..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-dark outline-none placeholder-dark-5 dark:text-white dark:placeholder-dark-6"
                />
                <div className="flex items-center gap-1">
                  <button className="flex size-7 items-center justify-center rounded text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3">
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
                  <button className="flex size-7 items-center justify-center rounded text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3">
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
        </div>
      </div>
    </div>
  );
}
