"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";
import { DmSidebar } from "./dm-sidebar";
import { DmChatArea } from "./dm-chat-area";
import { getChannelMessages, sendMessage } from "@/lib/actions/messages";
import type { ChannelItem, ChannelMessage } from "@/lib/actions/messages";

interface Props {
  channels: ChannelItem[];
  initialMessages: ChannelMessage[];
  initialChannelId: string | null;
}

export function MessagesPageClient({ channels, initialMessages, initialChannelId }: Readonly<Props>) {
  const router = useRouter();
  const [activeId, setActiveId] = useState<string | null>(initialChannelId);
  const [messages, setMessages] = useState<ChannelMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const { toast, setToast } = useToast();

  const activeChannel = channels.find((ch) => ch.id === activeId) ?? null;

  function handleSelect(id: string) {
    setActiveId(id);
    startTransition(async () => {
      try {
        const msgs = await getChannelMessages(id);
        setMessages(msgs);
      } catch {
        setMessages([]);
      }
    });
  }

  function handleSend() {
    if (!activeId || !input.trim()) return;
    const content = input.trim();
    setInput("");
    startTransition(async () => {
      try {
        await sendMessage(activeId, content);
        const msgs = await getChannelMessages(activeId);
        setMessages(msgs);
        router.refresh();
      } catch (err) {
        setToast(err instanceof Error ? err.message : "Failed to send message");
        setInput(content);
      }
    });
  }

  return (
    <div className="page-container">
      <div className={`flex h-[calc(100vh-10rem)] overflow-hidden rounded-xl shadow-card transition-opacity ${isPending ? "opacity-70" : ""}`}>
        <DmSidebar
          channels={channels}
          activeId={activeId}
          search={search}
          onSelect={handleSelect}
          onSearch={setSearch}
          onNewDm={() => setToast("Channel creation coming soon")}
        />
        <DmChatArea
          channel={activeChannel}
          messages={messages}
          input={input}
          onInputChange={setInput}
          onSend={handleSend}
          onCall={() => setToast("Starting audio call...")}
          onVideo={() => setToast("Starting video call...")}
          onSearch={() => setToast("Search in channel coming soon")}
          onEmoji={() => setToast("Emoji picker coming soon!")}
          onAttach={() => setToast("File attachment coming soon!")}
        />
      </div>
      <Toast message={toast} />
    </div>
  );
}
