"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";
import { DmSidebar } from "./_components/dm-sidebar";
import { DmChatArea } from "./_components/dm-chat-area";
import { DM_LIST } from "./_data/messages-data";

export default function MessagesPage() {
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [activeDm, setActiveDm] = useState(0);
  const { toast, setToast } = useToast();

  const activeChat = DM_LIST[activeDm] ?? DM_LIST[0];

  return (
    <div className="page-container">
      <div className="flex h-[calc(100vh-10rem)] overflow-hidden rounded-xl shadow-card">
        <DmSidebar
          activeDm={activeDm}
          search={search}
          onSelect={setActiveDm}
          onSearch={setSearch}
          onNewDm={() => setToast("Search for a team member to start a conversation")}
        />
        <DmChatArea
          activeChat={activeChat}
          input={input}
          onInputChange={setInput}
          onCall={() => setToast("Starting audio call...")}
          onVideo={() => setToast("Starting video call...")}
          onSearch={() => setToast("Search in conversation coming soon")}
          onEmoji={() => setToast("Emoji picker coming soon!")}
          onAttach={() => setToast("File attachment coming soon!")}
        />
      </div>
      <Toast message={toast} />
    </div>
  );
}
