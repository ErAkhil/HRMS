"use client";

import { useState, useRef, useEffect, useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AI_GRADIENT, AI_ICON_PATH, SUGGESTIONS } from "../_data/ai-data";
import { MessageContent } from "./ai-message-content";
import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import {
  createAiConversation,
  appendAiMessages,
  deleteAiConversation,
  getAiConversation,
  listAiConversations,
} from "@/lib/actions/ai-conversations";
import type { AiConversationSummary, AiPlanInfo } from "@/lib/actions/ai-conversations";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

interface Props {
  context: string;
  userName: string;
  planInfo: AiPlanInfo;
  initialConversations: AiConversationSummary[];
}

const REQUEST_HISTORY_LIMIT = 12;

function getProcessingStatus(message: string): string {
  if (/payroll|payout|salary|gross.*pay|net.*pay|total.*pay|disburs/i.test(message)) return "Fetching payroll data…";
  if (/leave|vacation|days off|leave balance|leave request/i.test(message)) return "Fetching leave data…";
  if (/attendance|present|on time|late|clock in|punch|check in/i.test(message)) return "Fetching attendance records…";
  if (/task|todo|overdue|assignment|project/i.test(message)) return "Fetching task data…";
  if (/insight|trend|report|analytics|performance|stat|metric|dashboard|overview/i.test(message)) return "Fetching HR analytics…";
  if (/employee|team|headcount|roster|staff|member/i.test(message)) return "Fetching employee data…";
  if (/department|dept|cost breakdown/i.test(message)) return "Fetching department data…";
  return "Thinking…";
}

function getHistoryLimitLabel(planInfo: AiPlanInfo, conversationCount: number): string | null {
  if (!planInfo.historyEnabled) {
    return null;
  }
  if (planInfo.maxConversations) {
    return `${conversationCount}/${planInfo.maxConversations} saved`;
  }
  return "Unlimited history";
}

function getConversationTitle(message: string): string {
  if (message.length > 60) {
    return message.slice(0, 57) + "...";
  }
  return message;
}

export function AIChat({ context, userName, planInfo, initialConversations }: Readonly<Props>) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<{ convId: string; convTitle: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showProcessingLine, setShowProcessingLine] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("");
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<AiConversationSummary[]>(initialConversations);
  const [loadingConv, setLoadingConv] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Re-fetch on mount in case SSR fetch silently failed (e.g. token expired mid-render)
  useEffect(() => {
    if (!planInfo.historyEnabled) return;
    listAiConversations()
      .then((list) => { if (list.length > 0) setConversations(list); })
      .catch(() => null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const MAX_MESSAGES_PER_THREAD = planInfo.maxMessagesPerThread;

  const bumpConversationCount = useCallback((conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? { ...c, _count: { messages: c._count.messages + 1 }, updatedAt: new Date().toISOString() }
          : c
      )
    );
  }, []);

  const updateAssistantSnapshot = useCallback((aiMsgId: string, content: string) => {
    setMessages((prev) => prev.map((m) => (m.id === aiMsgId ? { ...m, content } : m)));
  }, []);

  const buildRequestHistory = useCallback(
    (msg: string): Array<{ role: "user" | "assistant"; content: string }> => {
      const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: msg };
      return [...messages, userMsg].slice(-REQUEST_HISTORY_LIMIT).map((m) => ({
        role: m.role,
        content: m.content,
      }));
    },
    [messages]
  );

  const ensureConversation = useCallback(
    async (msg: string, currentConvId: string | null): Promise<string | null> => {
      if (!planInfo.historyEnabled || currentConvId) {
        return currentConvId;
      }

      let conv: AiConversationSummary | null = null;
      try {
        conv = await createAiConversation(getConversationTitle(msg));
      } catch {
        return null;
      }

      if (conv === null) {
        return null;
      }

      setActiveConvId(conv.id);
      setConversations((prev) => [{ ...conv, _count: { messages: 1 } }, ...prev]);
      router.refresh();
      return conv.id;
    },
    [planInfo.historyEnabled, router]
  );

  const persistMessage = useCallback(
    async (conversationId: string | null, role: "user" | "assistant", content: string) => {
      const canPersist = Boolean(conversationId && planInfo.historyEnabled && content);
      if (!canPersist || !conversationId) {
        return;
      }

      try {
        await appendAiMessages(conversationId, [{ role, content }]);
      } catch {
        return;
      }

      bumpConversationCount(conversationId);
    },
    [planInfo.historyEnabled, bumpConversationCount]
  );

  const setAssistantError = useCallback((aiMsgId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === aiMsgId
          ? { ...m, content: "Sorry, I ran into an error. Please try again." }
          : m
      )
    );
  }, []);

  const streamAssistantReply = useCallback(
    async (
      history: Array<{ role: "user" | "assistant"; content: string }>,
      aiMsgId: string,
      onFirstVisibleContent: () => void
    ): Promise<string> => {
      abortRef.current = new AbortController();

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, context }),
        signal: abortRef.current.signal,
      });

      if (!res.ok || !res.body) {
        throw new Error("Request failed");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      let firstVisibleContentShown = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantContent += decoder.decode(value, { stream: true });
        if (!firstVisibleContentShown && assistantContent.trim().length > 0) {
          firstVisibleContentShown = true;
          onFirstVisibleContent();
        }
        updateAssistantSnapshot(aiMsgId, assistantContent);
      }

      return assistantContent;
    },
    [context, updateAssistantSnapshot]
  );

  const send = useCallback(async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || isStreaming) return;

    setShowWelcome(false);
    setInput("");

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: msg };
    const aiMsgId = crypto.randomUUID();
    const aiMsg: Message = { id: aiMsgId, role: "assistant", content: "" };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setIsStreaming(true);
    setProcessingStatus(getProcessingStatus(msg));
    setShowProcessingLine(true);

    // Check message limit
    const newMessageCount = messages.length + 2;
    if (newMessageCount > MAX_MESSAGES_PER_THREAD) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMsgId
            ? {
                ...m,
                content: `Thread message limit reached (${MAX_MESSAGES_PER_THREAD} messages). Start a new conversation to continue.`,
              }
            : m
        )
      );
      setIsStreaming(false);
      return;
    }

    const history = buildRequestHistory(msg);
    const conversationPromise = ensureConversation(msg, activeConvId);
    const assistantPromise = streamAssistantReply(history, aiMsgId, () => {
      setShowProcessingLine(false);
    });

    try {
      const currentConvId = await conversationPromise;
      const userPersistPromise = persistMessage(currentConvId, "user", msg);
      const assistantContent = await assistantPromise;
      await Promise.all([
        userPersistPromise,
        persistMessage(currentConvId, "assistant", assistantContent),
      ]);
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setAssistantError(aiMsgId);
      }
    } finally {
      setIsStreaming(false);
      setShowProcessingLine(false);
    }
  }, [
    input,
    isStreaming,
    messages.length,
    MAX_MESSAGES_PER_THREAD,
    activeConvId,
    buildRequestHistory,
    ensureConversation,
    persistMessage,
    streamAssistantReply,
    setAssistantError,
  ]);

  function startNew() {
    abortRef.current?.abort();
    setMessages([]);
    setShowWelcome(true);
    setActiveConvId(null);
    setIsStreaming(false);
  }

  async function loadConversation(id: string) {
    if (loadingConv || id === activeConvId) return;
    setLoadingConv(id);
    try {
      const conv = await getAiConversation(id);
      const loaded: Message[] = conv.messages.map((m) => ({
        id: m.id,
        role: m.role as "user" | "assistant",
        content: m.content,
      }));
      setMessages(loaded);
      setShowWelcome(false);
      setActiveConvId(id);
    } catch {
      // silently fail
    } finally {
      setLoadingConv(null);
    }
  }

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    const conv = conversations.find((c) => c.id === id);
    if (conv) {
      setDeleteConfirm({ convId: id, convTitle: conv.title });
    }
  }

  async function confirmDelete() {
    if (!deleteConfirm) return;
    setIsDeleting(true);
    try {
      await deleteAiConversation(deleteConfirm.convId).catch(() => null);
      setConversations((prev) => prev.filter((c) => c.id !== deleteConfirm.convId));
      if (activeConvId === deleteConfirm.convId) {
        startNew();
      }
      router.refresh();
    } finally {
      setIsDeleting(false);
      setDeleteConfirm(null);
    }
  }

  const historyLimitLabel = getHistoryLimitLabel(planInfo, conversations.length);
  const hasHistory = planInfo.historyEnabled;

  let sidebarContent: ReactNode;
  if (hasHistory && conversations.length > 0) {
    sidebarContent = (
      <ul className="space-y-0.5 pt-0.5">
        {conversations.map((conv) => (
          <li key={conv.id} className="group relative flex items-center gap-1 rounded-xl px-1">
            <button
              type="button"
              onClick={() => loadConversation(conv.id)}
              className={`flex-1 min-w-0 rounded-xl px-3 py-2.5 text-left transition-colors ${
                conv.id === activeConvId
                  ? "bg-white shadow-sm dark:bg-dark-2"
                  : "hover:bg-white/70 dark:hover:bg-dark-2/60"
              }`}
            >
              <p className={`truncate text-[13px] font-medium leading-snug ${
                conv.id === activeConvId ? "text-primary-600" : "text-dark dark:text-white"
              }`}>
                {loadingConv === conv.id ? (
                  <span className="text-dark-5">Loading…</span>
                ) : conv.title}
              </p>
              <p className="mt-0.5 text-[11px] text-dark-5 dark:text-dark-6">
                {conv._count.messages} messages
              </p>
            </button>
            <button
              onClick={(e) => handleDelete(e, conv.id)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1 opacity-0 transition-opacity group-hover:opacity-100 text-gray-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-900/20"
              aria-label="Delete"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    );
  } else if (hasHistory) {
    sidebarContent = (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-dark-3">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <p className="text-xs font-medium text-dark-5 dark:text-dark-6">No conversations yet</p>
        <p className="mt-1 text-[11px] text-gray-400">Ask your first question!</p>
      </div>
    );
  } else {
    sidebarContent = (
      <div className="mx-2 rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/40 dark:bg-amber-900/10">
        <p className="text-[12px] font-semibold text-amber-700 dark:text-amber-400">Chat history requires PRO</p>
        <p className="mt-0.5 text-[11px] text-amber-600/80 dark:text-amber-500/80">Upgrade to save and revisit conversations.</p>
        <a href="/upgrade" className="mt-2 block text-[11px] font-semibold text-primary-600 hover:underline dark:text-primary-400">Upgrade now →</a>
      </div>
    );
  }

  function renderMessageBody(msg: Message): ReactNode {
    if (msg.role === "user") {
      return <p className="text-sm leading-relaxed">{msg.content}</p>;
    }
    if (msg.content) {
      return (
        <div className="text-[13.5px] leading-relaxed text-dark dark:text-gray-100 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:my-2 [&_ol]:my-2 [&_li]:my-0.5 [&_strong]:font-semibold [&_h1]:text-base [&_h1]:font-bold [&_h1]:mb-2 [&_h2]:text-sm [&_h2]:font-bold [&_h2]:mb-1.5 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mb-1 [&_code]:rounded [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_code]:font-mono [&_code]:text-rose-600 dark:[&_code]:bg-dark-3 dark:[&_code]:text-rose-400 [&_a]:text-primary-600 [&_a]:underline-offset-2 hover:[&_a]:underline [&_table]:text-xs [&_th]:font-semibold [&_th]:py-1 [&_th]:px-2 [&_td]:py-1 [&_td]:px-2">
          <MessageContent content={msg.content} />
        </div>
      );
    }
    return (
      <div className="flex items-end gap-1 h-5">
        <span className="h-1.5 w-1.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="h-1.5 w-1.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: "180ms" }} />
        <span className="h-1.5 w-1.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: "360ms" }} />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-160px)] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-dark-3 dark:bg-[#0f1117]">

      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <div className="flex w-64 shrink-0 flex-col border-r border-gray-200 bg-gray-50 dark:border-dark-3 dark:bg-[#161b27]">
        {/* Brand header */}
        <div className="flex items-center gap-2.5 px-4 py-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-white shadow-sm" style={{ background: AI_GRADIENT }}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={AI_ICON_PATH} />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-none text-dark dark:text-white">Monja AI</p>
            <p className="mt-0.5 text-[10px] text-dark-5 dark:text-dark-6">HR Intelligence</p>
          </div>
          <span className="ml-auto flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 inline-block rounded-full bg-emerald-500" />{"Live"}
          </span>
        </div>

        {/* New chat button */}
        <div className="px-3 pb-3">
          <button
            onClick={startNew}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-primary-300 bg-white px-3 py-2.5 text-sm font-medium text-primary-600 transition-all hover:border-primary-500 hover:bg-primary-50 dark:border-primary-800 dark:bg-transparent dark:text-primary-400 dark:hover:bg-primary-900/20"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New conversation
          </button>
        </div>

        {/* Conversations list */}
        <div className="flex flex-1 flex-col overflow-hidden px-2 pb-2">
          <div className="flex items-center justify-between px-2 pb-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-dark-5 dark:text-dark-6">Recent</p>
            {historyLimitLabel && (
              <span className="rounded-full bg-gray-200 px-1.5 py-0.5 text-[10px] text-dark-5 dark:bg-dark-3 dark:text-dark-6">{historyLimitLabel}</span>
            )}
          </div>
          <div className="flex-1 overflow-y-auto">
            {sidebarContent}
          </div>
        </div>
      </div>

      {/* ── Main chat area ───────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden bg-white dark:bg-[#0f1117]">

        {/* Chat header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-white/90 px-6 py-3 backdrop-blur dark:border-dark-3 dark:bg-[#0f1117]/90">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[13px] font-medium text-emerald-600 dark:text-emerald-400">Online</span>
          </div>
          {!showWelcome && (
            <span className={`text-xs font-medium tabular-nums ${
              messages.length >= MAX_MESSAGES_PER_THREAD * 0.9 ? "text-rose-500" : "text-dark-5 dark:text-dark-6"
            }`}>
              {messages.length}/{MAX_MESSAGES_PER_THREAD} messages
            </span>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {showWelcome ? (
            /* ── Welcome screen ── */
            <div className="flex h-full flex-col items-center justify-center px-6 py-12">
              <div
                className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl text-white shadow-lg"
                style={{ background: AI_GRADIENT }}
              >
                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={AI_ICON_PATH} />
                </svg>
              </div>
              <h2 className="mb-1 text-2xl font-bold tracking-tight text-dark dark:text-white">
                Hello, {userName}!
              </h2>
              <p className="mb-10 text-sm text-dark-5 dark:text-dark-6">
                I have access to your live HR data. Ask me anything.
              </p>
              <div className="grid w-full max-w-2xl grid-cols-2 gap-3">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => send(s.label)}
                    className="group flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-md dark:border-dark-3 dark:bg-dark-2 dark:hover:border-primary-700"
                  >
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary-50 transition-colors group-hover:bg-primary-100 dark:bg-primary-900/30 dark:group-hover:bg-primary-900/50">
                      <svg className="h-4 w-4 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} />
                      </svg>
                    </div>
                    <p className="text-xs font-medium leading-snug text-dark dark:text-white">{s.label}</p>
                  </button>
                ))}
              </div>
              <p className="mt-8 text-[11px] text-dark-5 dark:text-dark-6">
                Press <kbd className="rounded border border-gray-200 bg-gray-100 px-1.5 py-0.5 font-mono text-[10px] dark:border-dark-3 dark:bg-dark-3">Enter</kbd> to send · <kbd className="rounded border border-gray-200 bg-gray-100 px-1.5 py-0.5 font-mono text-[10px] dark:border-dark-3 dark:bg-dark-3">Shift+Enter</kbd> for new line
              </p>
            </div>
          ) : (
            /* ── Message thread ── */
            <div className="mx-auto w-full max-w-3xl px-6 py-6 space-y-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div
                      className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
                      style={{ background: AI_GRADIENT }}
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={AI_ICON_PATH} />
                      </svg>
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === "user"
                        ? "rounded-tr-sm bg-primary-600 text-white shadow-sm"
                        : "rounded-tl-sm border border-gray-100 bg-white shadow-sm dark:border-dark-3 dark:bg-dark-2"
                    }`}
                  >
                    {renderMessageBody(msg)}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* ── Input bar ───────────────────────────────────────────── */}
        <div className="shrink-0 border-t border-gray-100 bg-white/95 px-6 py-4 backdrop-blur dark:border-dark-3 dark:bg-[#0f1117]/95">
          {/* Processing one-liner */}
          {isStreaming && showProcessingLine && (
            <div className="mb-3 flex items-center gap-2 overflow-hidden rounded-xl border border-sky-100 bg-gradient-to-r from-sky-50 via-indigo-50 to-violet-50 px-3 py-2 dark:border-indigo-900/40 dark:from-sky-900/15 dark:via-indigo-900/15 dark:to-violet-900/15">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500" />
              </span>
              <span className="min-w-0 truncate text-xs font-medium text-sky-700 dark:text-sky-300">
                {processingStatus}
              </span>
            </div>
          )}

          {/* Text input */}
          <div className="mx-auto w-full max-w-3xl">
            <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 shadow-sm transition-all focus-within:border-primary-400 focus-within:bg-white focus-within:shadow-md dark:border-dark-3 dark:bg-dark-3 dark:focus-within:border-primary-600">
              <textarea
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Ask anything about HR, payroll, leave, attendance…"
                rows={1}
                disabled={isStreaming}
                className="flex-1 resize-none overflow-hidden border-0 bg-transparent text-sm leading-relaxed text-dark placeholder-gray-400 outline-none ring-0 disabled:opacity-50 dark:text-white dark:placeholder-dark-5"
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || isStreaming}
                className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow disabled:opacity-40 disabled:shadow-none"
                aria-label="Send"
              >
                {isStreaming ? (
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </div>
            <p className="mt-2 text-center text-[11px] text-gray-400 dark:text-dark-5">
              Monja AI can make mistakes. Verify critical information with HR.
            </p>
          </div>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={deleteConfirm !== null}
        title="Delete conversation"
        description={deleteConfirm ? `Are you sure you want to delete "${deleteConfirm.convTitle}"? This action cannot be undone.` : undefined}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}
