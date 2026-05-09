"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";
import Link from "next/link";
import { sendMessage, createChannel } from "@/lib/actions/collaboration";
import { useRouter } from "next/navigation";

type Channel = {
  id: string;
  name: string;
  isPrivate: boolean;
  messageCount: number;
  lastMessage: string | null;
  lastMessageAt: Date | string | null;
};

type Stats = { channelCount: number; messagesToday: number };

function formatTime(date: Date | string | null) {
  if (!date) return "";
  const d = new Date(date);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

export function CollaborationPageClient({ channels, stats }: Readonly<{ channels: Channel[]; stats: Stats }>) {
  const { toast, setToast } = useToast();
  const router = useRouter();
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [msgTo, setMsgTo] = useState("");
  const [msgBody, setMsgBody] = useState("");
  const [meetingName, setMeetingName] = useState("");
  const [meetingPlatform, setMeetingPlatform] = useState("Zoom");
  const [newChannelName, setNewChannelName] = useState("");
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);

  async function handleSendMessage() {
    if (!selectedChannelId || !msgBody.trim()) return;
    try {
      await sendMessage({ channelId: selectedChannelId, content: msgBody.trim() });
      setShowNewMessageModal(false);
      setMsgTo("");
      setMsgBody("");
      setSelectedChannelId(null);
      setToast("Message sent!");
      router.refresh();
    } catch {
      setToast("Failed to send message.");
    }
  }

  async function handleCreateChannel() {
    if (!newChannelName.trim()) return;
    try {
      await createChannel(newChannelName.trim());
      setShowChannelModal(false);
      setNewChannelName("");
      setToast("Channel created!");
      router.refresh();
    } catch {
      setToast("Failed to create channel.");
    }
  }

  const card = "rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <nav className="mb-1 flex items-center gap-1.5 text-sm text-dark-5 dark:text-dark-6">
            <Link href="/" className="hover:text-indigo-600">Dashboard</Link>
            <span>/</span>
            <span className="text-dark dark:text-white">Collaboration</span>
          </nav>
          <h1 className="text-2xl font-bold text-dark dark:text-white">Collaboration</h1>
          <p className="mt-0.5 text-sm text-dark-5 dark:text-dark-6">Stay connected with your team</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNewMessageModal(true)}
            className="rounded-lg border border-gray-3 bg-white px-4 py-2 text-sm font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          >
            New Message
          </button>
          <button
            onClick={() => setShowMeetingModal(true)}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
          >
            Start Meeting
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className={card}>
          <p className="text-sm font-medium text-dark-5 dark:text-dark-6">Active Channels</p>
          <p className="mt-2 text-3xl font-bold text-dark dark:text-white">{stats.channelCount}</p>
          <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">team channels</p>
        </div>
        <div className={card}>
          <p className="text-sm font-medium text-dark-5 dark:text-dark-6">Messages Today</p>
          <p className="mt-2 text-3xl font-bold text-dark dark:text-white">{stats.messagesToday}</p>
          <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">across all channels</p>
        </div>
        <div className={card}>
          <p className="text-sm font-medium text-dark-5 dark:text-dark-6">Total Messages</p>
          <p className="mt-2 text-3xl font-bold text-dark dark:text-white">
            {channels.reduce((a, c) => a + c.messageCount, 0)}
          </p>
          <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">all time</p>
        </div>
        <div className={card}>
          <p className="text-sm font-medium text-dark-5 dark:text-dark-6">Meetings Today</p>
          <p className="mt-2 text-3xl font-bold text-dark dark:text-white">—</p>
          <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">
            <Link href="/collaboration/meetings" className="text-indigo-600 hover:underline">Schedule one →</Link>
          </p>
        </div>
      </div>

      {/* Channels List */}
      <div className={card}>
        <div className="flex items-center justify-between pb-4">
          <h2 className="text-base font-semibold text-dark dark:text-white">Channels ({channels.length})</h2>
          <button
            onClick={() => setShowChannelModal(true)}
            className="text-sm font-medium text-indigo-600 hover:underline"
          >
            + New Channel
          </button>
        </div>

        {channels.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-sm text-dark-5 dark:text-dark-6 mb-3">No channels yet.</p>
            <button
              onClick={() => setShowChannelModal(true)}
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
            >
              Create First Channel
            </button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {channels.map((ch) => (
              <div key={ch.id} className="rounded-lg border border-gray-2 p-3 dark:border-dark-3 hover:bg-gray-1 dark:hover:bg-dark-3/40 transition-colors cursor-pointer"
                onClick={() => {
                  setSelectedChannelId(ch.id);
                  setMsgTo(`#${ch.name}`);
                  setShowNewMessageModal(true);
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-100 text-xs font-bold text-dark-5 dark:bg-dark-3 dark:text-dark-6">
                    #
                  </span>
                  <p className="text-sm font-semibold text-dark dark:text-white">#{ch.name}</p>
                  {ch.isPrivate && (
                    <span className="ml-auto rounded-full bg-amber-light px-1.5 py-0.5 text-[10px] font-medium text-amber-dark">Private</span>
                  )}
                </div>
                {ch.lastMessage && (
                  <p className="text-xs text-dark-5 dark:text-dark-6 truncate">{ch.lastMessage}</p>
                )}
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-[10px] text-dark-5 dark:text-dark-6">{ch.messageCount} messages</span>
                  {ch.lastMessageAt && (
                    <span className="text-[10px] text-dark-5 dark:text-dark-6">{formatTime(ch.lastMessageAt)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-4 border-t border-gray-2 dark:border-dark-3 mt-4">
          <Link href="/collaboration/messages" className="text-sm font-medium text-indigo-600 hover:underline">
            Open Messages →
          </Link>
        </div>
      </div>

      {/* New Message Modal */}
      {showNewMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-modal dark:bg-dark-2">
            <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">New Message</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-dark dark:text-white">Channel</label>
                <select
                  value={selectedChannelId ?? ""}
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
              <button
                onClick={() => { setShowNewMessageModal(false); setSelectedChannelId(null); setMsgBody(""); }}
                className="flex-1 rounded-xl border border-gray-3 px-4 py-2.5 text-sm font-semibold text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6 dark:hover:bg-dark-3"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!selectedChannelId || !msgBody.trim()}
                className="flex-1 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Channel Modal */}
      {showChannelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-modal dark:bg-dark-2">
            <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">Create Channel</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-dark dark:text-white">Channel Name</label>
                <input
                  type="text"
                  placeholder="e.g. engineering, announcements"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  className="w-full rounded-lg border border-gray-3 bg-gray-2 px-3 py-2 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
                />
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <button onClick={() => setShowChannelModal(false)} className="flex-1 rounded-xl border border-gray-3 px-4 py-2.5 text-sm font-semibold text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6">
                Cancel
              </button>
              <button onClick={handleCreateChannel} disabled={!newChannelName.trim()} className="flex-1 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50">
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Start Meeting Modal */}
      {showMeetingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-modal dark:bg-dark-2">
            <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">Start Meeting</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-dark dark:text-white">Meeting Name</label>
                <input
                  type="text"
                  value={meetingName}
                  onChange={(e) => setMeetingName(e.target.value)}
                  className="w-full rounded-lg border border-gray-3 bg-gray-2 px-3 py-2 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-dark dark:text-white">Platform</label>
                <select
                  value={meetingPlatform}
                  onChange={(e) => setMeetingPlatform(e.target.value)}
                  className="w-full rounded-lg border border-gray-3 bg-gray-2 px-3 py-2 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
                >
                  <option>Zoom</option>
                  <option>Google Meet</option>
                  <option>Microsoft Teams</option>
                </select>
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <button onClick={() => setShowMeetingModal(false)} className="flex-1 rounded-xl border border-gray-3 px-4 py-2.5 text-sm font-semibold text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6">
                Cancel
              </button>
              <button
                onClick={() => { setShowMeetingModal(false); setMeetingName(""); setToast("Meeting started! Share the link with your team."); }}
                className="flex-1 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
              >
                Start Now
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toast} />
    </div>
  );
}
