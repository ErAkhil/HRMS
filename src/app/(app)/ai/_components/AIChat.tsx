"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AI_GRADIENT, AI_ICON_PATH, SUGGESTIONS, RECENT } from "../_data/ai-data";
import { MessageContent } from "./ai-message-content";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

interface Props {
  context: string;
  userName: string;
}

export function AIChat({ context, userName }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [activeConv, setActiveConv] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = useCallback(async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || isStreaming) return;

    setShowWelcome(false);
    setInput("");

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: msg };
    const aiMsg: Message = { id: crypto.randomUUID(), role: "assistant", content: "" };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setIsStreaming(true);

    const history = [...messages, userMsg].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, context }),
        signal: abortRef.current.signal,
      });

      if (!res.ok || !res.body) throw new Error("Request failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        const snapshot = accumulated;
        setMessages((prev) =>
          prev.map((m) => (m.id === aiMsg.id ? { ...m, content: snapshot } : m))
        );
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMsg.id
              ? { ...m, content: "Sorry, I ran into an error. Please try again." }
              : m
          )
        );
      }
    } finally {
      setIsStreaming(false);
    }
  }, [input, isStreaming, messages, context]);

  function startNew() {
    abortRef.current?.abort();
    setMessages([]);
    setShowWelcome(true);
    setActiveConv(-1);
    setIsStreaming(false);
  }

  return (
    <div className="flex h-[calc(100vh-160px)] overflow-hidden rounded-xl shadow-card">
      {/* Sidebar */}
      <div className="w-60 shrink-0 border-r border-gray-3 bg-white dark:border-dark-3 dark:bg-dark-2 flex flex-col">
        <div className="p-4 border-b border-gray-3 dark:border-dark-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg text-white" style={{ background: AI_GRADIENT }}>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={AI_ICON_PATH} />
              </svg>
            </div>
            <span className="text-sm font-semibold text-dark dark:text-white">AI Assistant</span>
          </div>
          <button onClick={startNew} className="w-full rounded-lg bg-primary-600 px-3 py-2 text-sm font-semibold text-white hover:bg-primary-700">
            + New Conversation
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Recent</p>
          {RECENT.map((conv, idx) => (
            <button
              key={idx}
              onClick={() => { setActiveConv(idx); send(conv); }}
              className={`w-full rounded-lg px-3 py-2.5 text-left text-xs transition-colors mb-0.5 ${
                activeConv === idx
                  ? "bg-primary-600/10 text-primary-600 dark:text-primary-400"
                  : "text-dark-5 dark:text-dark-6 hover:bg-gray-1 dark:hover:bg-dark-3"
              }`}
            >
              <div className="flex items-start gap-2">
                <svg className="mt-0.5 h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span className="line-clamp-2">{conv}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat */}
      <div className="flex flex-1 flex-col bg-gray-1 dark:bg-[#111827] overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-3 dark:border-dark-3 bg-white dark:bg-dark-2 px-5 py-3.5 flex items-center gap-3 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl text-white shrink-0" style={{ background: AI_GRADIENT }}>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={AI_ICON_PATH} />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-dark dark:text-white">Unikove AI</p>
            <p className="text-xs text-dark-5 dark:text-dark-6">Powered by Claude · Always learning</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-emerald-500">Online</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {showWelcome && (
            <div className="flex flex-col items-center justify-center h-full py-10">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl text-white mb-4" style={{ background: AI_GRADIENT }}>
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={AI_ICON_PATH} />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-dark dark:text-white mb-1">Hello, {userName}!</h2>
              <p className="text-sm text-dark-5 dark:text-dark-6 mb-8">What can I help you with today?</p>
              <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
                {SUGGESTIONS.map((s) => (
                  <button key={s.label} onClick={() => send(s.label)} className="rounded-xl bg-white dark:bg-dark-2 p-4 text-left border border-gray-3 dark:border-dark-3 hover:border-primary-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/20 mb-2">
                      <svg className="h-4 w-4 text-indigo-600 dark:text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} />
                      </svg>
                    </div>
                    <p className="text-xs font-medium text-dark dark:text-white">{s.label}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {!showWelcome && messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              {msg.role === "assistant" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-white mt-0.5" style={{ background: AI_GRADIENT }}>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={AI_ICON_PATH} />
                  </svg>
                </div>
              )}
              <div className={`max-w-[72%] rounded-xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-primary-600 text-white rounded-tr-sm"
                  : "bg-white dark:bg-dark-2 border-l-4 border-indigo-500 rounded-tl-sm shadow-sm"
              }`}>
                {msg.role === "user" ? (
                  <p className="text-sm text-white">{msg.content}</p>
                ) : msg.content ? (
                  <div className="text-dark dark:text-white">
                    <MessageContent content={msg.content} />
                  </div>
                ) : (
                  <div className="flex items-center gap-1 py-1">
                    <span className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-3 dark:border-dark-3 bg-white dark:bg-dark-2 p-4 shrink-0">
          <div className="flex items-end gap-2 rounded-xl border border-gray-3 dark:border-dark-3 bg-gray-1 dark:bg-dark-3 px-3 py-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Ask anything about HR, payroll, attendance, policies…"
              rows={1}
              disabled={isStreaming}
              className="flex-1 resize-none bg-transparent text-sm text-dark dark:text-white placeholder-dark-5 dark:placeholder-dark-6 outline-none disabled:opacity-60"
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || isStreaming}
              className="rounded-lg bg-primary-600 p-1.5 text-white hover:bg-primary-700 disabled:opacity-40 shrink-0"
            >
              {isStreaming ? (
                <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
          <p className="mt-2 text-center text-xs text-dark-5 dark:text-dark-6">
            Unikove AI may make mistakes. Verify important decisions with HR.
          </p>
        </div>
      </div>
    </div>
  );
}
