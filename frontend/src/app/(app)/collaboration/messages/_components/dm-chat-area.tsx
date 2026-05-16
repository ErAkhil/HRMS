"use client";

import { useRef, useEffect, useState } from "react";
import type { ChannelItem } from "@/lib/actions/messages";
import type { DmConversation } from "@/lib/actions/dm";
import type { AnyMessage, SenderPopup } from "./dm-message-bubble";
import { DmChatAreaContent } from "./dm-chat-area-content";

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

function EmptyChatState() {
  return (
    <div className="flex flex-1 items-center justify-center bg-white dark:bg-dark-2">
      <p className="text-sm text-dark-5 dark:text-dark-6">Select a channel or conversation to start messaging.</p>
    </div>
  );
}

function isAreaEmpty(mode: "channel" | "dm", channel: ChannelItem | null, conversation: DmConversation | null): boolean {
  if (mode === "channel") return !channel;
  return !conversation;
}

export function DmChatArea(props: Readonly<Props>) {
  const { mode, channel, conversation, messages, input, onInputChange, onSend, onCall, onSearch, onEmoji, onAttach, onStartDm, onCallUser } = props;

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [senderPop, setSenderPop] = useState<SenderPopup | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (isAreaEmpty(mode, channel, conversation)) return <EmptyChatState />;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <DmChatAreaContent
      mode={mode}
      channel={channel}
      conversation={conversation}
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
      onKeyDown={handleKeyDown}
    />
  );
}
