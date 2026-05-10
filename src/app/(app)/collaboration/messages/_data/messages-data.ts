export interface DMMessage {
  id: string;
  from: "me" | "sarah";
  text: string;
  timestamp: string;
  read?: boolean;
  attachment?: { name: string; size: string; type: string };
}

export interface DMContact {
  name: string;
  avatar: string;
  status: "online" | "away" | "offline";
  lastMsg: string;
  time: string;
  unread?: number;
}

export const DM_MESSAGES: DMMessage[] = [
  { id: "1", from: "sarah", text: "Hey! Do you have a few minutes to chat about the Q2 headcount plan?", timestamp: "9:05 AM" },
  { id: "2", from: "me", text: "Of course! What's on your mind?", timestamp: "9:07 AM", read: true },
  { id: "3", from: "sarah", text: "We got a green light from leadership to open 3 new roles in Engineering — 2 seniors and 1 staff-level. I want to make sure we align on job descriptions before posting.", timestamp: "9:08 AM" },
  { id: "4", from: "me", text: "That's great news! I can draft the JDs by tomorrow. Do you want to use our standard template or customize for these roles?", timestamp: "9:10 AM", read: true },
  { id: "5", from: "sarah", text: "Let's customize — especially the staff role. I'll send you the competency framework we discussed last month.", timestamp: "9:11 AM" },
  { id: "6", from: "sarah", text: "Here's the competency doc I mentioned. Pay special attention to Section 3 — that's the new leadership criteria we finalized.", timestamp: "9:12 AM", attachment: { name: "Engineering_Competency_Framework_2026.pdf", size: "1.8 MB", type: "PDF" } },
  { id: "7", from: "me", text: "Got it, reviewing now. This is really well structured. I like the distinction between IC levels and the new Staff expectations.", timestamp: "9:20 AM", read: true },
  { id: "8", from: "sarah", text: "Thanks! Tom and Elena spent a lot of time on it. Quick note — for the Senior roles, we want at least 5 years of distributed systems experience. Can you add that to the requirements?", timestamp: "9:22 AM" },
  { id: "9", from: "me", text: "Absolutely, I'll include that. Should I also add a preferred qualification for cloud architecture experience (AWS/GCP)?", timestamp: "9:25 AM", read: true },
  { id: "10", from: "sarah", text: "Yes please — and Kubernetes too. We're deep in container orchestration on the platform side.", timestamp: "9:26 AM" },
  { id: "11", from: "me", text: "Perfect. I'll have first drafts ready by 3 PM tomorrow. Should I send them to you directly or post in #engineering?", timestamp: "9:28 AM", read: true },
  { id: "12", from: "sarah", text: "Send them to me first for a quick review, then we can post in #engineering for broader feedback before finalizing.", timestamp: "9:29 AM" },
  { id: "13", from: "me", text: "Sounds like a plan! I'll also loop in Legal for a quick compliance review — especially for the remote work language.", timestamp: "9:31 AM", read: true },
  { id: "14", from: "sarah", text: "Great thinking. One more thing — can we schedule a 30-min sync for Friday morning to go through the interview panel structure? I want to make sure we have diverse representation.", timestamp: "9:33 AM" },
  { id: "15", from: "me", text: "Friday works! How about 10 AM? I'll send a calendar invite.", timestamp: "9:34 AM", read: true },
  { id: "16", from: "sarah", text: "10 AM is perfect. See you then! 🙌", timestamp: "9:35 AM" },
];

export const DM_LIST: DMContact[] = [
  { name: "Sarah Mitchell", avatar: "/images/user/user-01.png", status: "online", lastMsg: "10 AM is perfect. See you then!", time: "9:35 AM", unread: 2 },
  { name: "Daniel Park", avatar: "/images/user/user-02.png", status: "online", lastMsg: "Let me check and get back to you", time: "Yesterday" },
  { name: "Elena Torres", avatar: "/images/user/user-03.png", status: "away", lastMsg: "Thanks for the update!", time: "Yesterday" },
  { name: "Marcus Liu", avatar: "/images/user/user-04.png", status: "offline", lastMsg: "See you at the standup", time: "Mon" },
  { name: "Priya Sharma", avatar: "/images/user/user-05.png", status: "online", lastMsg: "The report is ready for review", time: "Mon" },
];
