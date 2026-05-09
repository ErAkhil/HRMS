"use client";

import Image from "next/image";
import { useState } from "react";
import type { ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";

type MeetingType = "All-Hands" | "Team" | "1:1" | "Interview" | "Review";
type Platform = "Zoom" | "Teams" | "Google Meet";
type TabKey = "upcoming" | "live" | "past";

interface Meeting {
  id: string;
  title: string;
  type: MeetingType;
  date: string;
  time: string;
  duration: string;
  participants: string[];
  participantCount: number;
  platform: Platform;
  live?: boolean;
}

const MEETINGS: Meeting[] = [
  {
    id: "1",
    title: "All-Hands Standup",
    type: "All-Hands",
    date: "Today",
    time: "10:00 AM",
    duration: "30m",
    participants: [
      "/images/user/user-01.png",
      "/images/user/user-02.png",
      "/images/user/user-03.png",
      "/images/user/user-04.png",
    ],
    participantCount: 48,
    platform: "Zoom",
    live: true,
  },
  {
    id: "2",
    title: "Product Roadmap Review",
    type: "Team",
    date: "Today",
    time: "2:00 PM",
    duration: "1h",
    participants: [
      "/images/user/user-05.png",
      "/images/user/user-06.png",
      "/images/user/user-07.png",
      "/images/user/user-08.png",
    ],
    participantCount: 8,
    platform: "Google Meet",
    live: true,
  },
  {
    id: "3",
    title: "Sarah Mitchell — 1:1",
    type: "1:1",
    date: "Tomorrow",
    time: "11:00 AM",
    duration: "30m",
    participants: [
      "/images/user/user-01.png",
      "/images/user/user-12.png",
    ],
    participantCount: 2,
    platform: "Zoom",
  },
  {
    id: "4",
    title: "Q2 Performance Reviews",
    type: "Review",
    date: "May 10",
    time: "9:00 AM",
    duration: "2h",
    participants: [
      "/images/user/user-09.png",
      "/images/user/user-10.png",
      "/images/user/user-11.png",
      "/images/user/user-02.png",
    ],
    participantCount: 15,
    platform: "Teams",
  },
  {
    id: "5",
    title: "New Hire Interview — Rahul Gupta",
    type: "Interview",
    date: "May 10",
    time: "3:00 PM",
    duration: "1h",
    participants: [
      "/images/user/user-03.png",
      "/images/user/user-07.png",
      "/images/user/user-08.png",
      "/images/user/user-04.png",
    ],
    participantCount: 4,
    platform: "Zoom",
  },
  {
    id: "6",
    title: "Engineering Sync",
    type: "Team",
    date: "May 12",
    time: "10:00 AM",
    duration: "45m",
    participants: [
      "/images/user/user-06.png",
      "/images/user/user-05.png",
      "/images/user/user-11.png",
      "/images/user/user-09.png",
    ],
    participantCount: 22,
    platform: "Google Meet",
  },
];

const PAST_MEETINGS: Meeting[] = [
  {
    id: "p1",
    title: "HR Leadership Sync",
    type: "Team",
    date: "May 6",
    time: "9:00 AM",
    duration: "1h",
    participants: ["/images/user/user-01.png", "/images/user/user-02.png"],
    participantCount: 6,
    platform: "Zoom",
  },
  {
    id: "p2",
    title: "Onboarding Kickoff — Batch 12",
    type: "All-Hands",
    date: "May 5",
    time: "10:00 AM",
    duration: "45m",
    participants: [
      "/images/user/user-03.png",
      "/images/user/user-04.png",
      "/images/user/user-05.png",
    ],
    participantCount: 18,
    platform: "Teams",
  },
];

const TYPE_COLORS: Record<MeetingType, string> = {
  "All-Hands": "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300",
  Team: "bg-sky-50 text-sky-dark dark:bg-sky-dark/10 dark:text-sky",
  "1:1": "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  Interview: "bg-violet-light text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300",
  Review: "bg-amber-light text-amber-dark",
};

const PLATFORM_ICONS: Record<Platform, ReactNode> = {
  Zoom: (
    <span className="rounded bg-blue-light-5 px-1.5 py-0.5 text-xs font-semibold text-primary-600 dark:bg-primary-900/20 dark:text-primary-300">
      Zoom
    </span>
  ),
  Teams: (
    <span className="rounded bg-violet-light px-1.5 py-0.5 text-xs font-semibold text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300">
      Teams
    </span>
  ),
  "Google Meet": (
    <span className="rounded bg-emerald-light px-1.5 py-0.5 text-xs font-semibold text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald">
      Meet
    </span>
  ),
};

function MeetingCard({
  meeting,
  onJoin,
  onDetails,
}: {
  meeting: Meeting;
  onJoin: () => void;
  onDetails: () => void;
}) {
  const overflow = meeting.participantCount - 4;

  return (
    <div className="rounded-xl bg-white p-5 shadow-card dark:border dark:border-dark-3 dark:bg-dark-2">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-dark dark:text-white">
            {meeting.title}
          </h3>
        </div>
        <span
          className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${TYPE_COLORS[meeting.type]}`}
        >
          {meeting.type}
        </span>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-dark-5 dark:text-dark-6">
        <span className="flex items-center gap-1">
          <svg className="size-3.5" viewBox="0 0 24 24" fill="none">
            <path
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {meeting.date} · {meeting.time}
        </span>
        <span className="flex items-center gap-1">
          <svg className="size-3.5" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {meeting.duration}
        </span>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex -space-x-2">
            {meeting.participants.slice(0, 4).map((src, i) => (
              <Image
                key={i}
                src={src}
                alt=""
                width={28}
                height={28}
                className="size-7 rounded-full ring-2 ring-white dark:ring-dark-2"
              />
            ))}
          </div>
          {overflow > 0 && (
            <span className="ml-1 text-xs text-dark-5 dark:text-dark-6">
              +{overflow}
            </span>
          )}
        </div>
        {PLATFORM_ICONS[meeting.platform]}
      </div>

      <div className="flex gap-2">
        <button
          onClick={onJoin}
          className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
            meeting.live
              ? "bg-emerald-dark text-white hover:opacity-90"
              : "bg-primary-600 text-white hover:bg-primary-700"
          }`}
        >
          {meeting.live ? "Join Now" : "Join"}
        </button>
        <button
          onClick={onDetails}
          className="rounded-lg border border-gray-3 px-3 py-1.5 text-sm font-medium text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6"
        >
          Details
        </button>
      </div>
    </div>
  );
}

export default function MeetingsPage() {
  const [tab, setTab] = useState<TabKey>("upcoming");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const { toast, setToast } = useToast();

  // Schedule meeting form state
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [meetingDuration, setMeetingDuration] = useState("30 min");
  const [meetingPlatform, setMeetingPlatform] = useState("Zoom");
  const [meetingParticipants, setMeetingParticipants] = useState("");
  const [meetingAgenda, setMeetingAgenda] = useState("");

  const liveMeetings = MEETINGS.filter((m) => m.live);
  const upcomingMeetings = MEETINGS.filter((m) => !m.live);

  const displayMeetings =
    tab === "upcoming"
      ? upcomingMeetings
      : tab === "live"
      ? liveMeetings
      : PAST_MEETINGS;

  function handleScheduleSubmit() {
    setShowScheduleModal(false);
    setMeetingTitle("");
    setMeetingDate("");
    setMeetingTime("");
    setMeetingDuration("30 min");
    setMeetingPlatform("Zoom");
    setMeetingParticipants("");
    setMeetingAgenda("");
    setToast("Meeting scheduled successfully!");
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-dark dark:text-white">
            Meetings
          </h1>
          <p className="text-xs text-dark-5 dark:text-dark-6">
            Schedule, join, and manage your meetings
          </p>
        </div>
        <button
          onClick={() => setShowScheduleModal(true)}
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
        >
          + Schedule Meeting
        </button>
      </div>

      {/* Live banner */}
      {liveMeetings.length > 0 && (
        <div className="overflow-hidden rounded-xl bg-gradient-success p-4 text-white shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-full bg-white/20">
                <span className="size-2.5 animate-pulse rounded-full bg-white" />
              </span>
              <div>
                <p className="text-sm font-semibold">
                  {liveMeetings.length} meetings in progress
                </p>
                <p className="text-xs text-white/80">
                  {liveMeetings.map((m) => m.title).join(" · ")}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {liveMeetings.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setToast("Launching meeting...")}
                  className="rounded-lg bg-white/20 px-3 py-1.5 text-sm font-semibold text-white hover:bg-white/30"
                >
                  Join {m.title.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-white p-1 shadow-card dark:bg-dark-2">
        {(
          [
            { key: "upcoming", label: "Upcoming", count: upcomingMeetings.length },
            { key: "live", label: "Live", count: liveMeetings.length },
            { key: "past", label: "Past", count: PAST_MEETINGS.length },
          ] as Array<{ key: TabKey; label: string; count: number }>
        ).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.key
                ? "bg-primary-600 text-white shadow-sm"
                : "text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3"
            }`}
          >
            {t.label}
            {t.key === "live" && t.count > 0 && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${
                  tab === t.key
                    ? "bg-white/20 text-white"
                    : "bg-emerald-dark text-white"
                }`}
              >
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Grid */}
      {displayMeetings.length === 0 ? (
        <div className="rounded-xl bg-white p-10 text-center shadow-card dark:border dark:border-dark-3 dark:bg-dark-2">
          <p className="text-sm text-dark-5 dark:text-dark-6">
            No meetings in this category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayMeetings.map((meeting) => (
            <MeetingCard
              key={meeting.id}
              meeting={meeting}
              onJoin={() => setToast("Launching meeting...")}
              onDetails={() => setToast("Opening meeting details...")}
            />
          ))}
        </div>
      )}

      {/* Schedule Meeting Modal */}
      {showScheduleModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowScheduleModal(false);
          }}
        >
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-modal dark:bg-dark-2">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-bold text-dark dark:text-white">
                Schedule Meeting
              </h2>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="flex size-7 items-center justify-center rounded-lg text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3"
              >
                <svg className="size-4" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 18L18 6M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Meeting Title */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-dark dark:text-white">
                  Meeting Title <span className="text-rose-dark">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Team Sync, 1:1 with Sarah..."
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  className="h-9 w-full rounded-lg border border-gray-3 px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white dark:placeholder-dark-6"
                />
              </div>

              {/* Date + Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-dark dark:text-white">
                    Date <span className="text-rose-dark">*</span>
                  </label>
                  <input
                    type="date"
                    value={meetingDate}
                    onChange={(e) => setMeetingDate(e.target.value)}
                    className="h-9 w-full rounded-lg border border-gray-3 px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-dark dark:text-white">
                    Time <span className="text-rose-dark">*</span>
                  </label>
                  <input
                    type="time"
                    value={meetingTime}
                    onChange={(e) => setMeetingTime(e.target.value)}
                    className="h-9 w-full rounded-lg border border-gray-3 px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
                  />
                </div>
              </div>

              {/* Duration + Platform */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-dark dark:text-white">
                    Duration
                  </label>
                  <select
                    value={meetingDuration}
                    onChange={(e) => setMeetingDuration(e.target.value)}
                    className="h-9 w-full rounded-lg border border-gray-3 px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
                  >
                    <option>15 min</option>
                    <option>30 min</option>
                    <option>45 min</option>
                    <option>1 hour</option>
                    <option>1.5 hours</option>
                    <option>2 hours</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-dark dark:text-white">
                    Platform
                  </label>
                  <select
                    value={meetingPlatform}
                    onChange={(e) => setMeetingPlatform(e.target.value)}
                    className="h-9 w-full rounded-lg border border-gray-3 px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
                  >
                    <option>Zoom</option>
                    <option>Google Meet</option>
                    <option>Microsoft Teams</option>
                    <option>In-person</option>
                  </select>
                </div>
              </div>

              {/* Participants */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-dark dark:text-white">
                  Participants
                </label>
                <input
                  type="text"
                  placeholder="Add team members..."
                  value={meetingParticipants}
                  onChange={(e) => setMeetingParticipants(e.target.value)}
                  className="h-9 w-full rounded-lg border border-gray-3 px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white dark:placeholder-dark-6"
                />
              </div>

              {/* Agenda */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-dark dark:text-white">
                  Agenda{" "}
                  <span className="font-normal text-dark-5 dark:text-dark-6">
                    (optional)
                  </span>
                </label>
                <textarea
                  rows={2}
                  placeholder="What will be discussed?"
                  value={meetingAgenda}
                  onChange={(e) => setMeetingAgenda(e.target.value)}
                  className="w-full resize-none rounded-lg border border-gray-3 px-3 py-2 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white dark:placeholder-dark-6"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="rounded-lg border border-gray-3 px-4 py-2 text-sm font-medium text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6 dark:hover:bg-dark-3"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleSubmit}
                className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
              >
                Schedule Meeting
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toast} />
    </div>
  );
}
