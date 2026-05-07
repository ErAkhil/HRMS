import Image from "next/image";
import type { Message } from "./collaboration-data";

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  return (
    <div className="group flex gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-gray-1 dark:hover:bg-dark-3/40">
      <Image
        src={message.avatar}
        alt={message.author}
        width={36}
        height={36}
        className="mt-0.5 size-9 flex-shrink-0 rounded-full"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold text-dark dark:text-white">
            {message.author}
          </span>
          <span className="text-xs text-dark-5 dark:text-dark-6">
            {message.timestamp}
          </span>
        </div>
        <p className="mt-0.5 text-sm leading-relaxed text-dark-4 dark:text-dark-7">
          {message.text}
        </p>

        {/* File attachment */}
        {message.attachment && (
          <div className="mt-2 inline-flex items-center gap-3 rounded-lg border border-gray-3 bg-gray-1 px-3 py-2.5 dark:border-dark-3 dark:bg-dark-3">
            <div className="flex size-9 flex-shrink-0 items-center justify-center rounded-lg bg-rose-light dark:bg-rose-dark/20">
              <svg
                className="size-5 text-rose-dark"
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
              <p className="text-sm font-medium text-dark dark:text-white">
                {message.attachment.name}
              </p>
              <p className="text-xs text-dark-5 dark:text-dark-6">
                {message.attachment.type} · {message.attachment.size}
              </p>
            </div>
            <button className="ml-2 flex size-8 items-center justify-center rounded-lg text-dark-5 hover:bg-gray-3 dark:text-dark-6 dark:hover:bg-dark-2">
              <svg className="size-4" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {message.reactions.map((r, i) => (
              <button
                key={i}
                className="flex items-center gap-1 rounded-full border border-gray-3 bg-gray-1 px-2 py-0.5 text-xs hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-3 dark:hover:bg-dark-2"
              >
                <span>{r.emoji}</span>
                <span className="font-medium text-dark-5 dark:text-dark-6">
                  {r.count}
                </span>
              </button>
            ))}
            <button className="flex size-6 items-center justify-center rounded-full border border-gray-3 bg-gray-1 text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-3 dark:hover:bg-dark-2">
              <span className="text-xs">+</span>
            </button>
          </div>
        )}

        {/* Thread count */}
        {message.threadCount && message.threadCount > 0 && (
          <button className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:underline dark:text-primary-300">
            <svg className="size-3.5" viewBox="0 0 24 24" fill="none">
              <path
                d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {message.threadCount} replies
          </button>
        )}
      </div>
    </div>
  );
}
