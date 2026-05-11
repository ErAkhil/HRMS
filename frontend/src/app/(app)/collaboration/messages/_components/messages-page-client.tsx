"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";
import { useSocket } from "@/hooks/use-socket";
import { DmSidebar } from "./dm-sidebar";
import { DmChatArea } from "./dm-chat-area";
import { getChannelMessages, sendMessage } from "@/lib/actions/messages";
import type { ChannelItem, ChannelMessage } from "@/lib/actions/messages";

interface MessageNewPayload {
  id: string;
  channelId: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar: string | null;
  createdAt: string;
}

interface Props {
  channels: ChannelItem[];
  initialMessages: ChannelMessage[];
  initialChannelId: string | null;
}

export function MessagesPageClient({ channels, initialMessages, initialChannelId }: Readonly<Props>) {
  const router = useRouter();
  const { data: session } = useSession();
  const [activeId, setActiveId] = useState<string | null>(initialChannelId);
  const [messages, setMessages] = useState<ChannelMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const { toast, setToast } = useToast();

  const activeChannel = channels.find((ch) => ch.id === activeId) ?? null;

  const handleMessageNew = useCallback((data: unknown) => {
    const payload = data as MessageNewPayload;
    if (payload.channelId !== activeId) return;

    const currentUserId = session?.user?.id;
    setMessages((prev) => {
      if (prev.some((m) => m.id === payload.id)) return prev;
      return [
        ...prev,
        {
          id: payload.id,
          content: payload.content,
          senderId: payload.senderId,
          senderName: payload.senderName,
          senderAvatar: payload.senderAvatar,
          isMe: payload.senderId === currentUserId,
          createdAt: payload.createdAt,
        },
      ];
    });
  }, [activeId, session?.user?.id]);

  useSocket({ "message:new": handleMessageNew });

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
