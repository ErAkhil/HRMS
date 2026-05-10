export const REVIEW_ROWS = [
  { period: "Q1 2026", type: "Annual Review", score: "87", reviewer: "James Williams", status: "Completed", action: "View" },
  { period: "Q4 2025", type: "Mid-year", score: "84", reviewer: "James Williams", status: "Completed", action: "View" },
  { period: "Q3 2025", type: "Quarterly", score: "81", reviewer: "James Williams", status: "Completed", action: "View" },
  { period: "Q2 2025", type: "Quarterly", score: "78", reviewer: "James Williams", status: "Completed", action: "View" },
  { period: "Q1 2025", type: "Annual Review", score: "79", reviewer: "James Williams", status: "Completed", action: "View" },
  { period: "Q2 2026", type: "Annual Review", score: "—", reviewer: "James Williams", status: "Pending", action: "Start →" },
];

export const SCORE_BARS = [
  { label: "Q1'25", value: 79, current: false },
  { label: "Q2'25", value: 78, current: false },
  { label: "Q3'25", value: 81, current: false },
  { label: "Q4'25", value: 84, current: false },
  { label: "Q1'26", value: 87, current: true },
  { label: "Q2'26", value: 0, current: false, pending: true },
];

export const FEEDBACK_HIGHLIGHTS = [
  { text: "Exceptional problem-solving skills", category: "Technical", badge: "badge-ai" },
  { text: "Strong team collaboration", category: "Soft Skills", badge: "badge-success" },
  { text: "Could improve documentation practices", category: "Growth Area", badge: "badge-warning" },
];

export const TEAM_MEMBERS = [
  { name: "Sarah Mitchell", avatar: "/images/user/user-15.png", score: 87, role: "Senior SE", barColor: "bg-primary-500" },
  { name: "Daniel Park", avatar: "/images/user/user-03.png", score: 82, role: "Frontend Eng", barColor: "bg-primary-400" },
  { name: "Priya Sharma", avatar: "/images/user/user-26.png", score: 91, role: "Product Designer", barColor: "bg-emerald-500" },
  { name: "Arjun Mehta", avatar: "/images/user/user-23.png", score: 78, role: "Backend Eng", barColor: "bg-primary-400" },
  { name: "Elena Torres", avatar: "/images/user/user-27.png", score: 85, role: "QA Engineer", barColor: "bg-primary-500" },
  { name: "Marcus Chen", avatar: "/images/user/user-09.png", score: 88, role: "DevOps", barColor: "bg-primary-500" },
];

export const TEAM_GOALS = [
  { title: "Ship Platform v2.0", dept: "Engineering", progress: 72, status: "In Progress", statusBadge: "badge-ai", barColor: "bg-primary-500" },
  { title: "Reduce API latency to < 100ms", dept: "Engineering", progress: 55, status: "In Progress", statusBadge: "badge-ai", barColor: "bg-violet-500" },
  { title: "Complete Q2 Design System", dept: "Product", progress: 88, status: "Near Complete", statusBadge: "badge-success", barColor: "bg-emerald-500" },
  { title: "Zero critical bugs in prod", dept: "QA", progress: 94, status: "Near Complete", statusBadge: "badge-success", barColor: "bg-emerald-500" },
];

export const TOP_PERFORMERS = [
  { rank: "🥇", name: "Priya Sharma", avatar: "/images/user/user-26.png", score: 91, delta: "↑ 7pts vs Q1", dept: "Product" },
  { rank: "🥈", name: "Marcus Chen", avatar: "/images/user/user-09.png", score: 88, delta: "↑ 5pts vs Q1", dept: "Engineering" },
  { rank: "🥉", name: "Sarah Mitchell", avatar: "/images/user/user-15.png", score: 87, delta: "↑ 3pts vs Q1", dept: "Engineering" },
];

export const ANALYTICS_METRICS = [
  { label: "Dept Avg Score", value: "83.4", sub: "↑ 4.2% QoQ", color: "text-primary-600" },
  { label: "On-Track Goals", value: "18/24", sub: "75% completion rate", color: "text-emerald-600" },
  { label: "Reviews Completed", value: "11/12", sub: "92% on time", color: "text-violet-600" },
  { label: "Improvement Plans", value: "2", sub: "active", color: "text-amber-600" },
];

export const SCORE_DIST = [
  { bucket: "90–100", count: 2 },
  { bucket: "80–89", count: 7 },
  { bucket: "70–79", count: 2 },
  { bucket: "60–69", count: 1 },
];

export const ATTENTION_EMPLOYEES = [
  { name: "John Doe", score: 71, dept: "Sales", note: "Improvement Plan Active", badge: "badge-warning" },
  { name: "Mike Smith", score: 68, dept: "Operations", note: "Review Scheduled", badge: "badge-ai" },
];
