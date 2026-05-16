import { Fragment, type Dispatch, type RefObject, type SetStateAction } from "react";
import type { ChannelItem } from "@/lib/actions/messages";
import type { DmConversation } from "@/lib/actions/dm";
import { MessageBubble, type AnyMessage, type SenderPopup } from "./dm-message-bubble";
import { ChatHeader } from "./dm-chat-header";
import { formatDateSeparator, formatDuration, formatTimestamp, isSameDay, parseCallContent } from "./dm-chat-time-utils";

export interface DmChatAreaContentProps {
  mode: "channel" | "dm";
  channel: ChannelItem | null;
  conversation: DmConversation | null;
  messages: AnyMessage[];
  senderPop: SenderPopup | null;
  setSenderPop: Dispatch<SetStateAction<SenderPopup | null>>;
  bottomRef: RefObject<HTMLDivElement | null>;
  inputRef: RefObject<HTMLInputElement | null>;
  input: string;
  onInputChange: (v: string) => void;
  onCall: (type: "audio" | "video") => void;
  onSearch: () => void;
  onEmoji: () => void;
  onAttach: () => void;
  onSend: () => void;
  onStartDm?: (userId: string, name: string) => void;
  onCallUser?: (userId: string, name: string, type: "audio" | "video") => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

interface MessagesPaneProps {
  mode: "channel" | "dm";
  messages: AnyMessage[];
  channelName?: string;
  conversationName?: string;
  senderPop: SenderPopup | null;
  setSenderPop: Dispatch<SetStateAction<SenderPopup | null>>;
  onStartDm?: (userId: string, name: string) => void;
  onCallUser?: (userId: string, name: string, type: "audio" | "video") => void;
  bottomRef: RefObject<HTMLDivElement | null>;
}

interface ComposerProps {
  inputRef: RefObject<HTMLInputElement | null>;
  placeholder: string;
  input: string;
  onInputChange: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onEmoji: () => void;
  onAttach: () => void;
  onSend: () => void;
}

interface ChatAreaShellProps {
  mode: "channel" | "dm";
  channelName?: string;
  conversationName?: string;
  messages: AnyMessage[];
  senderPop: SenderPopup | null;
  setSenderPop: Dispatch<SetStateAction<SenderPopup | null>>;
  bottomRef: RefObject<HTMLDivElement | null>;
  inputRef: RefObject<HTMLInputElement | null>;
  input: string;
  onInputChange: (v: string) => void;
  onCall: (type: "audio" | "video") => void;
  onSearch: () => void;
  onEmoji: () => void;
  onAttach: () => void;
  onSend: () => void;
  onStartDm?: (userId: string, name: string) => void;
  onCallUser?: (userId: string, name: string, type: "audio" | "video") => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

function getComposerPlaceholder(mode: "channel" | "dm", channelName?: string, conversationName?: string) {
  if (mode === "dm") return `Message ${conversationName ?? ""}…`;
  return `Message #${channelName ?? ""}…`;
}

function getHeaderMeta(mode: "channel" | "dm", channel: ChannelItem | null, conversation: DmConversation | null) {
  if (mode === "dm") {
    return {
      headerName: conversation?.otherUserName,
      headerSub: "Direct message",
      headerAvatar: conversation?.otherUserAvatar ?? null,
    };
  }

  return {
    headerName: channel?.name,
    headerSub: channel?.isPrivate ? "Private channel" : "Public channel",
    headerAvatar: null,
  };
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
          <p className="text-sm font-medium text-dark dark:text-white">{callState}</p>
          <p className="text-xs text-dark-5 dark:text-dark-6">{formatTimestamp(createdAt)}</p>
        </div>
      </div>
    </div>
  );
}

function MessageTimelineRow({
  mode,
  msg,
  prevMsg,
  senderPop,
  setSenderPop,
  onStartDm,
  onCallUser,
}: Readonly<{
  mode: "channel" | "dm";
  msg: AnyMessage;
  prevMsg?: AnyMessage;
  senderPop: SenderPopup | null;
  setSenderPop: Dispatch<SetStateAction<SenderPopup | null>>;
  onStartDm?: (userId: string, name: string) => void;
  onCallUser?: (userId: string, name: string, type: "audio" | "video") => void;
}>) {
  const showDateSep = !prevMsg || !isSameDay(msg.createdAt, prevMsg.createdAt);
  const callData = mode === "dm" ? parseCallContent(msg.content) : null;

  return (
    <Fragment>
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
          {messages.map((msg, idx) => (
            <MessageTimelineRow
              key={msg.id}
              mode={mode}
              msg={msg}
              prevMsg={messages[idx - 1]}
              senderPop={senderPop}
              setSenderPop={setSenderPop}
              onStartDm={onStartDm}
              onCallUser={onCallUser}
            />
          ))}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
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

function ChatAreaBody({
  mode,
  channelName,
  conversationName,
  messages,
  senderPop,
  setSenderPop,
  bottomRef,
  inputRef,
  input,
  onInputChange,
  onEmoji,
  onAttach,
  onSend,
  onStartDm,
  onCallUser,
  onKeyDown,
}: Readonly<Omit<ChatAreaShellProps, "onCall" | "onSearch">>) {
  const placeholder = getComposerPlaceholder(mode, channelName, conversationName);

  return (
    <>
      <MessagesPane
        mode={mode}
        messages={messages}
        channelName={channelName}
        conversationName={conversationName}
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
        onKeyDown={onKeyDown}
        onEmoji={onEmoji}
        onAttach={onAttach}
        onSend={onSend}
      />
    </>
  );
}

function ChatAreaShell({ mode, channelName, conversationName, messages, senderPop, setSenderPop, bottomRef, inputRef, input, onInputChange, onCall, onSearch, onEmoji, onAttach, onSend, onStartDm, onCallUser, onKeyDown }: Readonly<ChatAreaShellProps>) {
  const meta = getHeaderMeta(mode, channelName ? ({ name: channelName, isPrivate: false } as ChannelItem) : null, mode === "dm" ? ({ otherUserName: conversationName, otherUserAvatar: null } as DmConversation) : null);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <ChatHeader
        mode={mode}
        headerName={meta.headerName}
        headerSub={meta.headerSub}
        headerAvatar={meta.headerAvatar}
        onCall={onCall}
        onSearch={onSearch}
        onSearchFocus={() => inputRef.current?.focus()}
      />
      <ChatAreaBody
        mode={mode}
        channelName={channelName}
        conversationName={conversationName}
        messages={messages}
        senderPop={senderPop}
        setSenderPop={setSenderPop}
        bottomRef={bottomRef}
        inputRef={inputRef}
        input={input}
        onInputChange={onInputChange}
        onEmoji={onEmoji}
        onAttach={onAttach}
        onSend={onSend}
        onStartDm={onStartDm}
        onCallUser={onCallUser}
        onKeyDown={onKeyDown}
      />
    </div>
  );
}

export function DmChatAreaContent({
  mode,
  channel,
  conversation,
  messages,
  senderPop,
  setSenderPop,
  bottomRef,
  inputRef,
  input,
  onInputChange,
  onCall,
  onSearch,
  onEmoji,
  onAttach,
  onSend,
  onStartDm,
  onCallUser,
  onKeyDown,
}: Readonly<DmChatAreaContentProps>) {
  return (
    <ChatAreaShell
      mode={mode}
      channelName={channel?.name}
      conversationName={conversation?.otherUserName}
      messages={messages}
      senderPop={senderPop}
      setSenderPop={setSenderPop}
      bottomRef={bottomRef}
      inputRef={inputRef}
      input={input}
      onInputChange={onInputChange}
      onCall={onCall}
      onSearch={onSearch}
      onEmoji={onEmoji}
      onAttach={onAttach}
      onSend={onSend}
      onStartDm={onStartDm}
      onCallUser={onCallUser}
      onKeyDown={onKeyDown}
    />
  );
}
