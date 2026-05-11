"use client";

import { useState } from "react";

type Channel = { id: string; name: string };

interface Props {
  channels: Channel[];
  onSend: (channelId: string, body: string) => Promise<void>;
  onClose: () => void;
}

export function NewMessageModal({ channels, onSend, onClose }: Readonly<Props>) {
  const [selectedChannelId, setSelectedChannelId] = useState<string>("");
  const [msgBody, setMsgBody] = useState("");

  async function handleSend() {
    if (!selectedChannelId || !msgBody.trim()) return;
    await onSend(selectedChannelId, msgBody.trim());
    setSelectedChannelId("");
    setMsgBody("");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-modal dark:bg-dark-2">
        <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">New Message</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-dark dark:text-white">Channel</label>
            <select
              value={selectedChannelId}
              onChange={(e) => setSelectedChannelId(e.target.value)}
              className="w-full rounded-lg border border-gray-3 bg-gray-2 px-3 py-2 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
            >
              <option value="">Select a channel...</option>
              {channels.map((ch) => (
                <option key={ch.id} value={ch.id}>#{ch.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-dark dark:text-white">Message</label>
            <textarea
              rows={3}
              value={msgBody}
              onChange={(e) => setMsgBody(e.target.value)}
              className="w-full rounded-lg border border-gray-3 bg-gray-2 px-3 py-2 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white dark:placeholder-dark-6 resize-none"
            />
          </div>
        </div>
        <div className="mt-5 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-gray-3 px-4 py-2.5 text-sm font-semibold text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6 dark:hover:bg-dark-3">
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={!selectedChannelId || !msgBody.trim()}
            className="flex-1 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
