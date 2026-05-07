export type ChannelKey =
  | "general"
  | "hr-policies"
  | "announcements"
  | "engineering"
  | "product-team"
  | "social";

export interface Channel {
  id: ChannelKey;
  name: string;
  members: number;
  unread?: number;
  description: string;
}

export interface DMUser {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "away" | "offline";
  unread?: number;
}

export interface Reaction {
  emoji: string;
  count: number;
}

export interface FileAttachment {
  name: string;
  size: string;
  type: string;
}

export interface Message {
  id: string;
  author: string;
  avatar: string;
  timestamp: string;
  text: string;
  reactions?: Reaction[];
  threadCount?: number;
  attachment?: FileAttachment;
}

export const CHANNELS: Channel[] = [
  {
    id: "general",
    name: "general",
    members: 248,
    unread: 3,
    description: "Company-wide announcements and general discussion",
  },
  {
    id: "hr-policies",
    name: "hr-policies",
    members: 45,
    description: "HR policy updates and discussions",
  },
  {
    id: "announcements",
    name: "announcements",
    members: 248,
    unread: 12,
    description: "Important company announcements",
  },
  {
    id: "engineering",
    name: "engineering",
    members: 87,
    description: "Engineering team discussions and updates",
  },
  {
    id: "product-team",
    name: "product-team",
    members: 32,
    description: "Product roadmap and feature discussions",
  },
  {
    id: "social",
    name: "social",
    members: 180,
    description: "Non-work chat, events, and fun stuff",
  },
];

export const DM_USERS: DMUser[] = [
  { id: "sarah", name: "Sarah Mitchell", avatar: "/images/user/user-01.png", status: "online", unread: 2 },
  { id: "daniel", name: "Daniel Park", avatar: "/images/user/user-02.png", status: "online" },
  { id: "elena", name: "Elena Torres", avatar: "/images/user/user-03.png", status: "away" },
];

export const GENERAL_MESSAGES: Message[] = [
  {
    id: "m1",
    author: "Sarah Mitchell",
    avatar: "/images/user/user-01.png",
    timestamp: "9:02 AM",
    text: "Good morning everyone! Just a reminder that the Q2 performance reviews are kicking off next week. Please make sure your self-assessments are submitted by Friday EOD.",
    reactions: [
      { emoji: "👍", count: 12 },
      { emoji: "✅", count: 8 },
    ],
  },
  {
    id: "m2",
    author: "Daniel Park",
    avatar: "/images/user/user-02.png",
    timestamp: "9:15 AM",
    text: "Thanks Sarah! Quick question — will the review portal be the same as last quarter? I want to make sure I'm using the right template.",
    reactions: [{ emoji: "🙋", count: 4 }],
  },
  {
    id: "m3",
    author: "Elena Torres",
    avatar: "/images/user/user-03.png",
    timestamp: "9:18 AM",
    text: "Yes Daniel, same portal at hr.unikove.com/reviews — I've updated the Q2 templates this morning so they should be ready to go!",
    reactions: [
      { emoji: "🎉", count: 6 },
      { emoji: "👏", count: 3 },
    ],
  },
  {
    id: "m4",
    author: "Marcus Liu",
    avatar: "/images/user/user-04.png",
    timestamp: "9:31 AM",
    text: "Has anyone seen the updated benefits enrollment deadline? I got an email but the dates look different from what was posted internally.",
    threadCount: 5,
  },
  {
    id: "m5",
    author: "Priya Sharma",
    avatar: "/images/user/user-05.png",
    timestamp: "9:45 AM",
    text: "Just shared the updated benefits guide in #hr-policies — deadline is May 15th. The email had an error, sorry about that!",
    attachment: {
      name: "Benefits_Guide_Q2_2026.pdf",
      size: "2.4 MB",
      type: "PDF",
    },
    reactions: [
      { emoji: "📄", count: 9 },
      { emoji: "❤️", count: 2 },
    ],
  },
  {
    id: "m6",
    author: "James Okafor",
    avatar: "/images/user/user-06.png",
    timestamp: "10:02 AM",
    text: "Team lunch is happening this Friday at 12:30 PM in the rooftop dining area. Sign-up sheet is on the break room door. It's the last Friday before the long weekend!",
    reactions: [
      { emoji: "🍕", count: 18 },
      { emoji: "🙌", count: 11 },
    ],
  },
  {
    id: "m7",
    author: "Aisha Patel",
    avatar: "/images/user/user-07.png",
    timestamp: "10:14 AM",
    text: "Heads up — the main conference room (3rd floor) will be under AV maintenance from 2 PM to 5 PM today. Please use the satellite rooms for meetings.",
  },
  {
    id: "m8",
    author: "Tom Walters",
    avatar: "/images/user/user-08.png",
    timestamp: "10:28 AM",
    text: "Engineering just pushed the new onboarding automation to staging. If anyone from HR wants to take a look before we go live Friday, I can set up a quick demo.",
    reactions: [
      { emoji: "🚀", count: 7 },
      { emoji: "👀", count: 5 },
    ],
    threadCount: 3,
  },
  {
    id: "m9",
    author: "Sarah Mitchell",
    avatar: "/images/user/user-01.png",
    timestamp: "10:35 AM",
    text: "Tom that would be great! Can we do 11 AM tomorrow? I'll rope in Elena too so we can sign off from the HR side.",
  },
  {
    id: "m10",
    author: "Nina Ruiz",
    avatar: "/images/user/user-09.png",
    timestamp: "11:00 AM",
    text: "PSA: The new Employee Handbook 2026 is live on the intranet. Big changes to the remote work policy and PTO accrual schedule — worth a read!",
    reactions: [
      { emoji: "📚", count: 14 },
      { emoji: "👍", count: 8 },
    ],
  },
  {
    id: "m11",
    author: "Rahul Gupta",
    avatar: "/images/user/user-10.png",
    timestamp: "11:22 AM",
    text: "Quick reminder: all expense reports for April need to be submitted by tomorrow noon. Finance is closing the books. Let me know if you need help with the submission portal.",
  },
  {
    id: "m12",
    author: "Chloe Bennett",
    avatar: "/images/user/user-11.png",
    timestamp: "11:45 AM",
    text: "Welcome to the team @Marcus Liu! 🎉 Marcus is joining us as a Senior Data Analyst on the Workforce Analytics team. Say hi!",
    reactions: [
      { emoji: "👋", count: 24 },
      { emoji: "🎉", count: 17 },
      { emoji: "🥳", count: 9 },
    ],
  },
];
