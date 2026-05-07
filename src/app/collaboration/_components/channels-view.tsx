"use client";

import { useState } from "react";
import { CHANNELS, DM_USERS, GENERAL_MESSAGES, type ChannelKey } from "./collaboration-data";
import { ChannelSidebar } from "./channel-sidebar";
import { ChatArea } from "./chat-area";

export function ChannelsView() {
  const [selectedChannel, setSelectedChannel] = useState<ChannelKey>("general");

  const channel = CHANNELS.find((c) => c.id === selectedChannel) ?? CHANNELS[0];

  return (
    <div className="flex h-[calc(100vh-10rem)] overflow-hidden rounded-xl shadow-card">
      <ChannelSidebar
        channels={CHANNELS}
        dmUsers={DM_USERS}
        selectedChannel={selectedChannel}
        onSelectChannel={setSelectedChannel}
      />
      <ChatArea channel={channel} messages={GENERAL_MESSAGES} />
    </div>
  );
}
