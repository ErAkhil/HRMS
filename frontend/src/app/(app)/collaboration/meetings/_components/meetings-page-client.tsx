"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";
import { MeetingCard } from "./meeting-card";
import { ScheduleMeetingModal } from "./schedule-meeting-modal";
import type { SerializedMeeting, MeetingEmployee } from "@/lib/actions/meetings";

type TabKey = "upcoming" | "live" | "past";
const TAB_KEYS: TabKey[] = ["upcoming", "live", "past"];

interface Props {
  meetings: SerializedMeeting[];
  employees: MeetingEmployee[];
}

export function MeetingsPageClient({ meetings, employees }: Readonly<Props>) {
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>("upcoming");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const { toast, setToast } = useToast();

  const liveMeetings = meetings.filter((m) => m.isLive);
  const upcomingMeetings = meetings.filter((m) => !m.isLive && !m.isPast);
  const pastMeetings = meetings.filter((m) => m.isPast);

  const displayMeetings =
    tab === "upcoming" ? upcomingMeetings :
    tab === "live" ? liveMeetings :
    pastMeetings;

  const TAB_META: Record<TabKey, { label: string; count: number }> = {
    upcoming: { label: "Upcoming", count: upcomingMeetings.length },
    live: { label: "Live", count: liveMeetings.length },
    past: { label: "Past", count: pastMeetings.length },
  };

  function formatScheduledAt(iso: string) {
    const d = new Date(iso);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const meetingDay = new Date(d);
    meetingDay.setHours(0, 0, 0, 0);

    let dateLabel: string;
    if (meetingDay.getTime() === today.getTime()) dateLabel = "Today";
    else if (meetingDay.getTime() === tomorrow.getTime()) dateLabel = "Tomorrow";
    else dateLabel = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    const timeLabel = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    return { dateLabel, timeLabel };
  }

  function durationLabel(mins: number) {
    if (mins < 60) return `${mins}m`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Meetings</h1>
          <p className="text-muted">Schedule, join, and manage your meetings</p>
        </div>
        <button onClick={() => setShowScheduleModal(true)} className="btn-primary">+ Schedule Meeting</button>
      </div>

      {liveMeetings.length > 0 && (
        <div className="overflow-hidden rounded-xl bg-gradient-success p-4 text-white shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-full bg-white/20">
                <span className="size-2.5 animate-pulse rounded-full bg-white" />
              </span>
              <div>
                <p className="text-sm font-semibold">{liveMeetings.length} meeting{liveMeetings.length !== 1 ? "s" : ""} in progress</p>
                <p className="text-xs text-white/80">{liveMeetings.map((m) => m.title).join(" · ")}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {liveMeetings.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    if (m.meetingUrl) {
                      window.open(m.meetingUrl, "_blank", "noopener,noreferrer");
                    } else {
                      setToast("No meeting link available — ask the organizer to add one");
                    }
                  }}
                  className="rounded-lg bg-white/20 px-3 py-1.5 text-sm font-semibold text-white hover:bg-white/30"
                >
                  Join {m.title.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-1 rounded-xl bg-white p-1 shadow-card dark:bg-dark-2">
        {TAB_KEYS.map((key) => {
          const { label, count } = TAB_META[key];
          return (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${tab === key ? "bg-primary-600 text-white shadow-sm" : "text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3"}`}
            >
              {label}
              {key === "live" && count > 0 && (
                <span className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${tab === key ? "bg-white/20 text-white" : "bg-emerald-dark text-white"}`}>{count}</span>
              )}
            </button>
          );
        })}
      </div>

      {displayMeetings.length === 0 ? (
        <div className="card-p p-10 text-center">
          <p className="text-muted">No {tab} meetings.</p>
          {tab === "upcoming" && (
            <button onClick={() => setShowScheduleModal(true)} className="mt-3 btn-primary">Schedule a Meeting</button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayMeetings.map((meeting) => {
            const { dateLabel, timeLabel } = formatScheduledAt(meeting.scheduledAt);
            return (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
                dateLabel={dateLabel}
                timeLabel={timeLabel}
                durationLabel={durationLabel(meeting.durationMins)}
                onJoin={() => {
                  if (meeting.meetingUrl) {
                    window.open(meeting.meetingUrl, "_blank", "noopener,noreferrer");
                  } else {
                    setToast("No meeting link — add one when scheduling");
                  }
                }}
                onDetails={() => setToast("Opening meeting details...")}
              />
            );
          })}
        </div>
      )}

      {showScheduleModal && (
        <ScheduleMeetingModal
          employees={employees}
          onClose={() => setShowScheduleModal(false)}
          onSchedule={() => {
            setShowScheduleModal(false);
            setToast("Meeting scheduled successfully!");
            router.refresh();
          }}
        />
      )}

      <Toast message={toast} />
    </div>
  );
}
