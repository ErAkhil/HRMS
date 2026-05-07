import Image from "next/image";
import Link from "next/link";
import { ChannelsView } from "./_components/channels-view";

export const metadata = { title: "Collaboration | Unikove" };

// ── helpers ──────────────────────────────────────────────────────────────────
function Badge({
  children,
  variant = "indigo",
}: {
  children: React.ReactNode;
  variant?: "indigo" | "emerald" | "amber" | "violet" | "gray";
}) {
  const cls = {
    indigo:
      "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300",
    emerald:
      "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
    amber:
      "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber",
    violet:
      "bg-violet-light text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300",
    gray: "bg-gray-100 text-gray-600 dark:bg-dark-3 dark:text-dark-6",
  }[variant];
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${cls}`}>
      {children}
    </span>
  );
}

function Avatar({
  src,
  alt,
  size = 36,
}: {
  src: string;
  alt: string;
  size?: number;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="rounded-full object-cover"
    />
  );
}

function SystemIcon() {
  return (
    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-dark-3">
      <svg
        className="h-4 w-4 text-dark-5 dark:text-dark-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z"
        />
      </svg>
    </div>
  );
}

const card =
  "rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3";

// ── page ─────────────────────────────────────────────────────────────────────
export default function CollaborationPage() {
  // ── data ──────────────────────────────────────────────────────────────────
  const channels = [
    { id: 1, name: "general", last: "John: Standup at 10 AM sharp", time: "5m", unread: 3 },
    { id: 2, name: "engineering", last: "Priya: PR review needed on auth module", time: "12m", unread: 7 },
    { id: 3, name: "hr-policies", last: "New remote work guidelines are live", time: "25m", unread: 2 },
    { id: 4, name: "product", last: "Q2 roadmap doc shared", time: "1h", unread: 0 },
    { id: 5, name: "random", last: "Anyone up for coffee? ☕", time: "2h", unread: 0 },
    { id: 6, name: "announcements", last: "Q1 results: 91% satisfaction", time: "Yesterday", unread: 0 },
  ];

  const liveMeetings = [
    { id: 1, title: "All-Hands Standup", participants: 12 },
    { id: 2, title: "Product Sync", participants: 5 },
  ];

  const dms = [
    { id: 1, name: "Sarah Mitchell", avatar: "/images/user/user-15.png", msg: "Can you review the doc?", time: "Just now", unread: 2, online: true },
    { id: 2, name: "Daniel Park", avatar: "/images/user/user-03.png", msg: "Q2 report ready for review", time: "5m", unread: 0, online: true },
    { id: 3, name: "James Williams", avatar: "/images/user/user-28.png", msg: "Thanks for the onboarding help!", time: "1h", unread: 0, online: false },
    { id: 4, name: "Priya Sharma", avatar: "/images/user/user-26.png", msg: "New remote work guidelines are up", time: "2h", unread: 0, online: false },
    { id: 5, name: "Arjun Mehta", avatar: "/images/user/user-23.png", msg: "Will join the standup", time: "Yesterday", unread: 0, online: false },
    { id: 6, name: "Elena Torres", avatar: "/images/user/user-27.png", msg: "Sent the proposal doc", time: "Yesterday", unread: 0, online: false },
    { id: 7, name: "Marcus Chen", avatar: "/images/user/user-09.png", msg: "Deployment done ✓", time: "2 days ago", unread: 0, online: false },
  ];

  const meetings = [
    { id: 1, status: "live", title: "All-Hands Standup", time: "10:00 AM", participants: 12, platform: "Zoom", action: "Join Now", href: "/collaboration/meetings" },
    { id: 2, status: "live", title: "Product Sync", time: "10:30 AM", participants: 5, platform: "Google Meet", action: "Join Now", href: "/collaboration/meetings" },
    { id: 3, status: "upcoming", title: "Q2 Performance Review", time: "2:00 PM", participants: 3, platform: "Zoom", action: "Add to Cal", href: "/collaboration/meetings" },
    { id: 4, status: "upcoming", title: "New Hire Onboarding", time: "Tomorrow 9:00 AM", participants: 5, platform: "", action: "View Details", href: "/collaboration/meetings" },
  ];

  const activityFeed = [
    { id: 1, type: "user", avatar: "/images/user/user-15.png", name: "Sarah Mitchell", text: 'posted in #engineering: "Just pushed the auth module PR, please review before EOD"', time: "Today 10:45 AM" },
    { id: 2, type: "system", name: "", text: 'Meeting "All-Hands Standup" ended · 47 attendees', time: "Today 10:30 AM" },
    { id: 3, type: "user", avatar: "/images/user/user-03.png", name: "Daniel Park", text: 'shared a file in #product: "Q2_Roadmap_v3.pdf"', time: "Today 9:52 AM" },
    { id: 4, type: "user", avatar: "/images/user/user-26.png", name: "Priya Sharma", text: "reacted 👍 to a message in #hr-policies", time: "Today 9:31 AM" },
    { id: 5, type: "system", name: "", text: "#q2-planning channel created by James Williams", time: "Yesterday 5:15 PM" },
    { id: 6, type: "user", avatar: "/images/user/user-27.png", name: "Elena Torres", text: "joined #engineering", time: "Yesterday 2:00 PM" },
    { id: 7, type: "user", avatar: "/images/user/user-09.png", name: "Marcus Chen", text: 'completed task "Deploy auth service"', time: "Yesterday 11:45 AM" },
    { id: 8, type: "system", name: "", text: "All-Hands meeting scheduled for May 8", time: "Yesterday 9:00 AM" },
  ];

  const onlinePeople = [
    { id: 1, name: "Sarah Mitchell", dept: "Engineering", avatar: "/images/user/user-15.png" },
    { id: 2, name: "Daniel Park", dept: "Product", avatar: "/images/user/user-03.png" },
    { id: 3, name: "Marcus Chen", dept: "Engineering", avatar: "/images/user/user-09.png" },
    { id: 4, name: "Nina Foster", dept: "HR", avatar: "/images/user/user-27.png" },
    { id: 5, name: "Anika Patel", dept: "Product", avatar: "/images/user/user-26.png" },
  ];

  const awayPeople = [
    { id: 1, name: "Tom Bradley", dept: "Sales", avatar: "/images/user/user-23.png" },
    { id: 2, name: "Lisa Wang", dept: "Finance", avatar: "/images/user/user-28.png" },
    { id: 3, name: "Raj Kumar", dept: "Engineering", avatar: "/images/user/user-05.png" },
  ];

  return (
    <div className="space-y-6">
      {/* ── Section 1: Page Header ─────────────────────────────────────────── */}
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
          <button className="rounded-lg border border-gray-3 bg-white px-4 py-2 text-sm font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white">
            New Message
          </button>
          <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
            Start Meeting
          </button>
        </div>
      </div>

      {/* ── Section 2: KPI Row ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {/* Online Now */}
        <div className={card}>
          <p className="text-sm font-medium text-dark-5 dark:text-dark-6">Online Now</p>
          <p className="mt-2 text-3xl font-bold text-emerald-dark dark:text-emerald">47</p>
          <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">out of 231 active employees</p>
        </div>
        {/* Messages Today */}
        <div className={card}>
          <p className="text-sm font-medium text-dark-5 dark:text-dark-6">Messages Today</p>
          <p className="mt-2 text-3xl font-bold text-dark dark:text-white">1,284</p>
          <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">↑ 23% vs yesterday</p>
        </div>
        {/* Active Channels */}
        <div className={card}>
          <p className="text-sm font-medium text-dark-5 dark:text-dark-6">Active Channels</p>
          <p className="mt-2 text-3xl font-bold text-dark dark:text-white">18</p>
          <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">across 4 workspaces</p>
        </div>
        {/* Meetings Today */}
        <div className={card}>
          <p className="text-sm font-medium text-dark-5 dark:text-dark-6">Meetings Today</p>
          <p className="mt-2 text-3xl font-bold text-dark dark:text-white">6</p>
          <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">
            <span className="inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
              2 live right now
            </span>
          </p>
        </div>
      </div>

      {/* ── Section 3: Three-column layout ────────────────────────────────── */}
      <div className="grid gap-4 md:grid-cols-12">
        {/* Column A: Active Channels */}
        <div className={`${card} md:col-span-4 flex flex-col gap-0`}>
          <div className="flex items-center justify-between pb-3">
            <h2 className="text-base font-semibold text-dark dark:text-white">Channels</h2>
            <button className="text-sm font-medium text-indigo-600 hover:underline">+ New Channel</button>
          </div>

          {/* Live meetings */}
          <div className="mb-3 space-y-2">
            {liveMeetings.map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-lg bg-emerald-light/40 px-3 py-2 dark:bg-emerald-dark/10">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-dark dark:text-white">{m.title}</p>
                    <p className="text-xs text-dark-5 dark:text-dark-6">{m.participants} participants</p>
                  </div>
                </div>
                <button className="rounded-md bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-indigo-700">
                  Join
                </button>
              </div>
            ))}
          </div>

          {/* Channel list */}
          <div className="divide-y divide-gray-100 dark:divide-dark-3">
            {channels.map((ch) => (
              <div key={ch.id} className="flex items-center gap-2 py-2.5">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-gray-100 text-xs font-bold text-dark-5 dark:bg-dark-3 dark:text-dark-6">
                  #
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-dark dark:text-white">#{ch.name}</p>
                  <p className="truncate text-xs text-dark-5 dark:text-dark-6">{ch.last}</p>
                </div>
                <div className="flex flex-shrink-0 flex-col items-end gap-1">
                  <span className="text-xs text-dark-5 dark:text-dark-6">{ch.time}</span>
                  {ch.unread > 0 && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                      {ch.unread}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3">
            <Link href="/collaboration/messages" className="text-sm font-medium text-indigo-600 hover:underline">
              Open Messages →
            </Link>
          </div>
        </div>

        {/* Column B: Direct Messages */}
        <div className={`${card} md:col-span-4 flex flex-col gap-0`}>
          <div className="flex items-center justify-between pb-3">
            <h2 className="text-base font-semibold text-dark dark:text-white">People</h2>
            <Badge variant="emerald">47 online</Badge>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-dark-3">
            {dms.map((dm) => (
              <div key={dm.id} className="flex items-center gap-2.5 py-2.5">
                <div className="relative flex-shrink-0">
                  <Avatar src={dm.avatar} alt={dm.name} size={36} />
                  <span
                    className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-dark-2 ${
                      dm.online ? "bg-emerald-500" : "bg-gray-400"
                    }`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-dark dark:text-white">{dm.name}</p>
                  <p className="truncate text-xs text-dark-5 dark:text-dark-6">{dm.msg}</p>
                </div>
                <div className="flex flex-shrink-0 flex-col items-end gap-1">
                  <span className="text-xs text-dark-5 dark:text-dark-6">{dm.time}</span>
                  {dm.unread > 0 && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                      {dm.unread}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3">
            <Link href="/collaboration/messages" className="text-sm font-medium text-indigo-600 hover:underline">
              Open all messages →
            </Link>
          </div>
        </div>

        {/* Column C: Today's Meetings */}
        <div className={`${card} md:col-span-4 flex flex-col gap-0`}>
          <div className="flex items-center justify-between pb-3">
            <h2 className="text-base font-semibold text-dark dark:text-white">Meetings</h2>
            <Link href="/collaboration/meetings" className="text-sm font-medium text-indigo-600 hover:underline">
              + Schedule
            </Link>
          </div>

          <div className="space-y-3">
            {meetings.map((m) => (
              <div key={m.id} className="rounded-lg border border-gray-100 p-3 dark:border-dark-3">
                <div className="mb-1.5 flex items-center gap-2">
                  {m.status === "live" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-light px-2 py-0.5 text-xs font-semibold text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                      LIVE
                    </span>
                  ) : (
                    <Badge variant="indigo">UPCOMING</Badge>
                  )}
                </div>
                <p className="text-sm font-semibold text-dark dark:text-white">{m.title}</p>
                <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">
                  {m.time} · {m.participants} {m.participants === 1 ? "person" : "people"}
                  {m.platform ? ` · ${m.platform}` : ""}
                </p>
                <div className="mt-2">
                  {m.status === "live" ? (
                    <Link
                      href={m.href}
                      className="rounded-md bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700"
                    >
                      {m.action}
                    </Link>
                  ) : m.action === "Add to Cal" ? (
                    <button className="rounded-md border border-gray-3 bg-white px-3 py-1 text-xs font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white">
                      {m.action}
                    </button>
                  ) : (
                    <Link href={m.href} className="text-xs font-medium text-indigo-600 hover:underline">
                      {m.action}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3">
            <Link href="/collaboration/meetings" className="text-sm font-medium text-indigo-600 hover:underline">
              View all meetings →
            </Link>
          </div>
        </div>
      </div>

      {/* ── Section 4: Activity + Presence ────────────────────────────────── */}
      <div className="grid gap-4 md:grid-cols-12">
        {/* Left: Recent Activity */}
        <div className={`${card} md:col-span-7`}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-dark dark:text-white">Activity Feed</h2>
            <button className="rounded-md border border-gray-3 bg-white px-3 py-1 text-xs font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white">
              All Channels ▾
            </button>
          </div>

          <div className="space-y-4">
            {activityFeed.map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                {item.type === "user" ? (
                  <div className="flex-shrink-0">
                    <Avatar src={item.avatar!} alt={item.name} size={36} />
                  </div>
                ) : (
                  <SystemIcon />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-dark dark:text-white">
                    {item.name && (
                      <span className="font-semibold">{item.name} </span>
                    )}
                    <span className="text-dark-5 dark:text-dark-6">{item.text}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Team Presence */}
        <div className={`${card} md:col-span-5`}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-dark dark:text-white">Online Now</h2>
            <Badge variant="emerald">47</Badge>
          </div>

          {/* Online */}
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-dark-5 dark:text-dark-6">
            Online
          </p>
          <div className="space-y-2.5">
            {onlinePeople.map((p) => (
              <div key={p.id} className="flex items-center gap-2.5">
                <div className="relative flex-shrink-0">
                  <Avatar src={p.avatar} alt={p.name} size={32} />
                  <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-white bg-emerald-500 dark:border-dark-2" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-dark dark:text-white">{p.name}</p>
                  <p className="text-xs text-dark-5 dark:text-dark-6">{p.dept}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Away */}
          <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wider text-dark-5 dark:text-dark-6">
            Away
          </p>
          <div className="space-y-2.5">
            {awayPeople.map((p) => (
              <div key={p.id} className="flex items-center gap-2.5">
                <div className="relative flex-shrink-0">
                  <Avatar src={p.avatar} alt={p.name} size={32} />
                  <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-white bg-amber-400 dark:border-dark-2" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-dark dark:text-white">{p.name}</p>
                  <p className="text-xs text-dark-5 dark:text-dark-6">{p.dept}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-3 text-xs font-medium text-indigo-600 hover:underline cursor-pointer">
            42 more team members online
          </p>

          {/* Workspace Stats */}
          <div className="mt-5 rounded-lg border border-gray-100 p-3 dark:border-dark-3">
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-dark-5 dark:text-dark-6">
              Workspace Stats
            </p>
            <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
              {[
                { label: "Messages this week", value: "8,432" },
                { label: "Files shared", value: "127" },
                { label: "Reactions given", value: "2,841" },
                { label: "Avg response time", value: "4.2 min" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-xs text-dark-5 dark:text-dark-6">{stat.label}</p>
                  <p className="text-sm font-semibold text-dark dark:text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 5: Workspace Embed ─────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-dark dark:text-white">Messages</h2>
          <Link href="/collaboration/messages" className="text-sm font-medium text-indigo-600 hover:underline">
            Open full view →
          </Link>
        </div>
        <ChannelsView />
      </div>
    </div>
  );
}
