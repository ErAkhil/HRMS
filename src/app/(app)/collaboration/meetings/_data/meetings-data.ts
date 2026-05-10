import type { ReactNode } from "react";

export type MeetingType = "All-Hands" | "Team" | "1:1" | "Interview" | "Review";
export type Platform = "Zoom" | "Teams" | "Google Meet";
export type TabKey = "upcoming" | "live" | "past";

export interface Meeting {
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

export const MEETINGS: Meeting[] = [
  { id: "1", title: "All-Hands Standup", type: "All-Hands", date: "Today", time: "10:00 AM", duration: "30m", participants: ["/images/user/user-01.png", "/images/user/user-02.png", "/images/user/user-03.png", "/images/user/user-04.png"], participantCount: 48, platform: "Zoom", live: true },
  { id: "2", title: "Product Roadmap Review", type: "Team", date: "Today", time: "2:00 PM", duration: "1h", participants: ["/images/user/user-05.png", "/images/user/user-06.png", "/images/user/user-07.png", "/images/user/user-08.png"], participantCount: 8, platform: "Google Meet", live: true },
  { id: "3", title: "Sarah Mitchell — 1:1", type: "1:1", date: "Tomorrow", time: "11:00 AM", duration: "30m", participants: ["/images/user/user-01.png", "/images/user/user-12.png"], participantCount: 2, platform: "Zoom" },
  { id: "4", title: "Q2 Performance Reviews", type: "Review", date: "May 10", time: "9:00 AM", duration: "2h", participants: ["/images/user/user-09.png", "/images/user/user-10.png", "/images/user/user-11.png", "/images/user/user-02.png"], participantCount: 15, platform: "Teams" },
  { id: "5", title: "New Hire Interview — Rahul Gupta", type: "Interview", date: "May 10", time: "3:00 PM", duration: "1h", participants: ["/images/user/user-03.png", "/images/user/user-07.png", "/images/user/user-08.png", "/images/user/user-04.png"], participantCount: 4, platform: "Zoom" },
  { id: "6", title: "Engineering Sync", type: "Team", date: "May 12", time: "10:00 AM", duration: "45m", participants: ["/images/user/user-06.png", "/images/user/user-05.png", "/images/user/user-11.png", "/images/user/user-09.png"], participantCount: 22, platform: "Google Meet" },
];

export const PAST_MEETINGS: Meeting[] = [
  { id: "p1", title: "HR Leadership Sync", type: "Team", date: "May 6", time: "9:00 AM", duration: "1h", participants: ["/images/user/user-01.png", "/images/user/user-02.png"], participantCount: 6, platform: "Zoom" },
  { id: "p2", title: "Onboarding Kickoff — Batch 12", type: "All-Hands", date: "May 5", time: "10:00 AM", duration: "45m", participants: ["/images/user/user-03.png", "/images/user/user-04.png", "/images/user/user-05.png"], participantCount: 18, platform: "Teams" },
];

export const TYPE_COLORS: Record<MeetingType, string> = {
  "All-Hands": "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300",
  Team: "bg-sky-50 text-sky-dark dark:bg-sky-dark/10 dark:text-sky",
  "1:1": "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  Interview: "bg-violet-light text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300",
  Review: "bg-amber-light text-amber-dark",
};

export const PLATFORM_ICONS: Record<Platform, ReactNode> = {
  Zoom: <span className="rounded bg-blue-light-5 px-1.5 py-0.5 text-xs font-semibold text-primary-600 dark:bg-primary-900/20 dark:text-primary-300">Zoom</span>,
  Teams: <span className="rounded bg-violet-light px-1.5 py-0.5 text-xs font-semibold text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300">Teams</span>,
  "Google Meet": <span className="rounded bg-emerald-light px-1.5 py-0.5 text-xs font-semibold text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald">Meet</span>,
};
