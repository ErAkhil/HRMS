import Image from "next/image";
import Link from "next/link";

export const metadata = { title: "Manager Dashboard | Unikove" };

const teamMembers = [
  { name: "Sarah Mitchell", img: "/user-15.png", status: "Present", statusColor: "emerald", checkin: "9:02 AM", focus: "Auth module PR review", action: "View", actionHref: "/employees" },
  { name: "Daniel Park", img: "/user-03.png", status: "Present", statusColor: "emerald", checkin: "9:15 AM", focus: "Frontend dashboard build", action: "View", actionHref: "/employees" },
  { name: "Priya Sharma", img: "/user-26.png", status: "On Leave", statusColor: "amber", checkin: "—", focus: "Annual leave", action: "Approve", actionHref: "/leave" },
  { name: "Arjun Mehta", img: "/user-23.png", status: "Present", statusColor: "emerald", checkin: "9:30 AM", focus: "API rate limiting", action: "View", actionHref: "/employees" },
  { name: "Elena Torres", img: "/user-27.png", status: "Present", statusColor: "emerald", checkin: "8:58 AM", focus: "QA test suite", action: "View", actionHref: "/employees" },
  { name: "Marcus Chen", img: "/user-09.png", status: "Remote", statusColor: "indigo", checkin: "10:00 AM", focus: "DevOps pipeline", action: "View", actionHref: "/employees" },
  { name: "Nina Foster", img: "/user-06.png", status: "Present", statusColor: "emerald", checkin: "9:10 AM", focus: "Onboarding docs", action: "View", actionHref: "/employees" },
  { name: "Tom Bradley", img: "/user-08.png", status: "Present", statusColor: "emerald", checkin: "9:22 AM", focus: "Client integration", action: "View", actionHref: "/employees" },
  { name: "Lisa Wang", img: "/user-07.png", status: "On Leave", statusColor: "amber", checkin: "—", focus: "Sick leave", action: null, actionHref: null },
  { name: "Raj Kumar", img: "/user-10.png", status: "Remote", statusColor: "indigo", checkin: "9:45 AM", focus: "Infrastructure review", action: "View", actionHref: "/employees" },
  { name: "Anika Patel", img: "/user-11.png", status: "Present", statusColor: "emerald", checkin: "9:05 AM", focus: "Product roadmap sync", action: "View", actionHref: "/employees" },
  { name: "James Chen", img: "/user-12.png", status: "Late", statusColor: "rose", checkin: "10:30 AM", focus: "Sprint planning", action: "Message", actionHref: "/collaboration/messages" },
];

const statusBadgeClass: Record<string, string> = {
  emerald: "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  amber: "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber",
  indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300",
  rose: "bg-rose-light text-rose-dark dark:bg-rose-dark/20 dark:text-rose",
  violet: "bg-violet-light text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300",
};

const statusIcon: Record<string, string> = {
  emerald: "✅",
  amber: "🏖️",
  indigo: "🌐",
  rose: "⏰",
};

export default function ManagerDashboardPage() {
  return (
    <div className="space-y-4 md:space-y-6">

      {/* Section 1: Greeting Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3">
            <div>
              <h1 className="text-xl font-bold text-white">Good morning, James 👋</h1>
              <p className="text-sm text-white/70 mt-0.5">Tuesday, May 7, 2026 &nbsp;|&nbsp; Engineering Team &middot; 12 reports</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/tasks" className="rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 transition-colors">
                Schedule 1:1
              </Link>
              <Link href="/reports" className="rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 transition-colors">
                Team Report
              </Link>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 md:flex-col md:items-end lg:flex-row">
            <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white border border-white/20">3 Pending Approvals</span>
            <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white border border-white/20">2 Overdue Tasks</span>
            <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white border border-white/20">1 Review Due</span>
          </div>
        </div>
      </div>

      {/* Section 2: KPI Row */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {/* Team Size */}
        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Team Size</p>
              <p className="mt-1.5 text-3xl font-bold text-dark dark:text-white">12</p>
              <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">2 on leave today</p>
            </div>
            <span className="rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300 text-lg">👥</span>
          </div>
        </div>

        {/* Present Today */}
        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Present Today</p>
              <p className="mt-1.5 text-3xl font-bold text-dark dark:text-white">9</p>
              <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">75% attendance</p>
            </div>
            <span className="rounded-lg bg-emerald-light p-2 text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald text-lg">✅</span>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Pending Approvals</p>
              <p className="mt-1.5 text-3xl font-bold text-dark dark:text-white">3</p>
              <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">Leave + Expenses</p>
            </div>
            <span className="rounded-lg bg-amber-light p-2 text-amber-dark dark:bg-amber-dark/20 dark:text-amber text-lg">⏳</span>
          </div>
        </div>

        {/* Sprint Progress */}
        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Sprint Progress</p>
              <p className="mt-1.5 text-3xl font-bold text-dark dark:text-white">68%</p>
              <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">Platform v2.0</p>
            </div>
            <span className="rounded-lg bg-violet-light p-2 text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300 text-lg">🎯</span>
          </div>
          <div className="mt-3 relative h-1.5 rounded-full bg-gray-2 dark:bg-dark-3 overflow-hidden">
            <div className="absolute inset-y-0 left-0 rounded-full bg-violet-500" style={{ width: "68%" }} />
          </div>
        </div>
      </div>

      {/* Section 3: Two Columns */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6">

        {/* Left: Team Status Today */}
        <div className="md:col-span-8 rounded-xl bg-white shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <div>
              <h2 className="font-semibold text-dark dark:text-white">Team Status Today</h2>
              <p className="text-xs text-dark-5 dark:text-dark-6">Team · May 7, 2026</p>
            </div>
            <Link href="/employees" className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-3 dark:border-dark-3">
                  <th className="px-5 pb-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Member</th>
                  <th className="px-3 pb-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Status</th>
                  <th className="px-3 pb-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Check-in</th>
                  <th className="px-3 pb-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Today&apos;s Focus</th>
                  <th className="px-5 pb-2.5 text-right text-[10px] font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-3 dark:divide-dark-3">
                {teamMembers.map((member) => (
                  <tr key={member.name} className="hover:bg-gray-1 dark:hover:bg-dark-3/40 transition-colors">
                    <td className="px-5 py-2.5">
                      <div className="flex items-center gap-2">
                        <Image src={member.img} alt={member.name} width={28} height={28} className="rounded-full object-cover" />
                        <span className="text-xs font-medium text-dark dark:text-white whitespace-nowrap">{member.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${statusBadgeClass[member.statusColor]}`}>
                        <span>{statusIcon[member.statusColor]}</span>
                        {member.status}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-xs text-dark-5 dark:text-dark-6 whitespace-nowrap">{member.checkin}</td>
                    <td className="px-3 py-2.5 max-w-[160px]">
                      <span className="block truncate text-xs text-dark-5 dark:text-dark-6">{member.focus}</span>
                    </td>
                    <td className="px-5 py-2.5 text-right">
                      {member.action && member.actionHref ? (
                        <Link href={member.actionHref} className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400">{member.action}</Link>
                      ) : (
                        <span className="text-xs text-dark-5 dark:text-dark-6">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Approvals + Upcoming Reviews */}
        <div className="md:col-span-4 flex flex-col gap-4">

          {/* Pending Approvals */}
          <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-dark dark:text-white">Approvals</h2>
              <span className="rounded-full bg-rose-light px-2 py-0.5 text-xs font-bold text-rose-dark dark:bg-rose-dark/20 dark:text-rose">3</span>
            </div>
            <div className="divide-y divide-gray-3 dark:divide-dark-3">

              {/* Leave Request */}
              <div className="pb-3">
                <div className="flex items-start gap-2 mb-2">
                  <span className="rounded px-2 py-0.5 text-xs font-semibold bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber">Leave</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-dark dark:text-white">Priya Sharma</p>
                    <p className="text-xs text-dark-5 dark:text-dark-6 truncate">Annual Leave · May 8–10 (3 days)</p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <button className="rounded px-2.5 py-1 text-xs font-semibold bg-emerald-light text-emerald-dark hover:bg-emerald-dark hover:text-white transition-colors">Approve</button>
                  <button className="rounded px-2.5 py-1 text-xs font-semibold bg-rose-light text-rose-dark hover:bg-rose-dark hover:text-white transition-colors">Decline</button>
                </div>
              </div>

              {/* Expense Claim */}
              <div className="py-3">
                <div className="flex items-start gap-2 mb-2">
                  <span className="rounded px-2 py-0.5 text-xs font-semibold bg-violet-light text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300">Expense</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-dark dark:text-white">Marcus Chen</p>
                    <p className="text-xs text-dark-5 dark:text-dark-6 truncate">Cloud infrastructure · ₹12,400</p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <button className="rounded px-2.5 py-1 text-xs font-semibold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors">Review</button>
                </div>
              </div>

              {/* WFH Request */}
              <div className="pt-3">
                <div className="flex items-start gap-2 mb-2">
                  <span className="rounded px-2 py-0.5 text-xs font-semibold bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300">WFH</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-dark dark:text-white">Raj Kumar</p>
                    <p className="text-xs text-dark-5 dark:text-dark-6 truncate">Work from Home · May 9 (Friday)</p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <button className="rounded px-2.5 py-1 text-xs font-semibold bg-emerald-light text-emerald-dark hover:bg-emerald-dark hover:text-white transition-colors">Approve</button>
                  <button className="rounded px-2.5 py-1 text-xs font-semibold bg-rose-light text-rose-dark hover:bg-rose-dark hover:text-white transition-colors">Decline</button>
                </div>
              </div>

            </div>
          </div>

          {/* Upcoming Reviews */}
          <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-dark dark:text-white">Performance Reviews</h2>
              <span className="text-xs text-dark-5 dark:text-dark-6">3 scheduled</span>
            </div>
            <div className="divide-y divide-gray-3 dark:divide-dark-3">

              <div className="pb-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-dark dark:text-white">Sarah Mitchell</p>
                  <p className="text-xs text-dark-5 dark:text-dark-6">Annual Review · June 15</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold bg-violet-light text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300">in 39 days</span>
                  <Link href="/performance/reviews" className="text-[10px] font-medium text-indigo-600 hover:underline dark:text-indigo-400">Schedule</Link>
                </div>
              </div>

              <div className="py-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-dark dark:text-white">Daniel Park</p>
                  <p className="text-xs text-dark-5 dark:text-dark-6">Quarterly Check-in · May 20</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber">in 13 days</span>
                  <Link href="/performance/reviews" className="text-[10px] font-medium text-indigo-600 hover:underline dark:text-indigo-400">Schedule</Link>
                </div>
              </div>

              <div className="pt-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-dark dark:text-white">Arjun Mehta</p>
                  <p className="text-xs text-dark-5 dark:text-dark-6">Probation Review · May 14</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold bg-rose-light text-rose-dark dark:bg-rose-dark/20 dark:text-rose">Due Soon</span>
                  <Link href="/performance/reviews" className="text-[10px] font-medium text-indigo-600 hover:underline dark:text-indigo-400">Schedule</Link>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Section 4: Three Columns */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

        {/* Card A: Team Tasks Summary */}
        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-dark dark:text-white">Sprint Tasks</h2>
            <Link href="/tasks/kanban" className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">View Kanban →</Link>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-dark dark:text-white">To Do</span>
                <span className="text-xs text-dark-5 dark:text-dark-6">14 tasks</span>
              </div>
              <div className="relative h-1.5 rounded-full bg-gray-2 dark:bg-dark-3 overflow-hidden">
                <div className="absolute inset-y-0 left-0 rounded-full bg-indigo-500" style={{ width: "58%" }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-dark dark:text-white">In Progress</span>
                <span className="text-xs text-dark-5 dark:text-dark-6">8 tasks</span>
              </div>
              <div className="relative h-1.5 rounded-full bg-gray-2 dark:bg-dark-3 overflow-hidden">
                <div className="absolute inset-y-0 left-0 rounded-full bg-violet-500" style={{ width: "33%" }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-dark dark:text-white">In Review</span>
                <span className="text-xs text-dark-5 dark:text-dark-6">5 tasks</span>
              </div>
              <div className="relative h-1.5 rounded-full bg-gray-2 dark:bg-dark-3 overflow-hidden">
                <div className="absolute inset-y-0 left-0 rounded-full bg-amber-500" style={{ width: "21%" }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-dark dark:text-white">Completed</span>
                <span className="text-xs text-dark-5 dark:text-dark-6">22 tasks</span>
              </div>
              <div className="relative h-1.5 rounded-full bg-gray-2 dark:bg-dark-3 overflow-hidden">
                <div className="absolute inset-y-0 left-0 rounded-full bg-emerald-500" style={{ width: "92%" }} />
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-gray-3 pt-3 dark:border-dark-3">
            <p className="text-xs text-dark-5 dark:text-dark-6">Sprint ends May 14 · 7 days left</p>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-rose-dark dark:text-rose">Overdue: 3</span>
              <Link href="/tasks" className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400">View →</Link>
            </div>
          </div>
        </div>

        {/* Card B: Team Performance */}
        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-dark dark:text-white">Team Performance</h2>
            <span className="text-xs text-dark-5 dark:text-dark-6">Q1 2026 Scores</span>
          </div>
          <div className="space-y-3">
            {[
              { name: "Sarah Mitchell", score: 87, barColor: "bg-indigo-500", barWidth: "87%" },
              { name: "Priya Sharma", score: 91, barColor: "bg-emerald-500", barWidth: "91%" },
              { name: "Marcus Chen", score: 88, barColor: "bg-indigo-500", barWidth: "88%" },
              { name: "Daniel Park", score: 82, barColor: "bg-indigo-500", barWidth: "82%" },
              { name: "Elena Torres", score: 85, barColor: "bg-indigo-500", barWidth: "85%" },
              { name: "Arjun Mehta", score: 78, barColor: "bg-amber-500", barWidth: "78%" },
            ].map((p) => (
              <div key={p.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-dark dark:text-white">{p.name}</span>
                  <span className="text-xs font-semibold text-dark-5 dark:text-dark-6">{p.score}/100</span>
                </div>
                <div className="relative h-1.5 rounded-full bg-gray-2 dark:bg-dark-3 overflow-hidden">
                  <div className={`absolute inset-y-0 left-0 rounded-full ${p.barColor}`} style={{ width: p.barWidth }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-gray-3 pt-3 dark:border-dark-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-dark-5 dark:text-dark-6">Team avg</span>
              <span className="rounded-full bg-violet-light px-2 py-0.5 text-xs font-bold text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300">85.2 avg</span>
            </div>
            <Link href="/performance/reviews" className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">View Full Reviews →</Link>
          </div>
        </div>

        {/* Card C: Quick Actions */}
        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-dark dark:text-white">Manager Actions</h2>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            <Link href="/reports" className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-3 p-3 text-xs font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3 transition-colors">
              <span className="text-lg">📋</span>
              <span className="text-center leading-tight">View Reports</span>
            </Link>
            <Link href="/tasks" className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-3 p-3 text-xs font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3 transition-colors">
              <span className="text-lg">📅</span>
              <span className="text-center leading-tight">Schedule 1:1</span>
            </Link>
            <button className="flex flex-col items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-light p-3 text-xs font-medium text-emerald-dark hover:bg-emerald-500 hover:text-white dark:border-emerald-800 dark:bg-emerald-dark/20 dark:text-emerald transition-colors">
              <span className="text-lg">✅</span>
              <span className="text-center leading-tight">Approve All</span>
            </button>
            <Link href="/performance/analytics" className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-3 p-3 text-xs font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3 transition-colors">
              <span className="text-lg">📊</span>
              <span className="text-center leading-tight">Team Analytics</span>
            </Link>
            <Link href="/performance" className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-3 p-3 text-xs font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3 transition-colors">
              <span className="text-lg">🎯</span>
              <span className="text-center leading-tight">Set Team Goals</span>
            </Link>
            <Link href="/collaboration/messages" className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-3 p-3 text-xs font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3 transition-colors">
              <span className="text-lg">📨</span>
              <span className="text-center leading-tight">Send Update</span>
            </Link>
          </div>
        </div>

      </div>

      {/* Section 5: Calendar + Announcements */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6">

        {/* Left: This Week's Calendar */}
        <div className="md:col-span-7 rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-dark dark:text-white">This Week&apos;s Schedule</h2>
            <Link href="/calendar" className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">View Calendar →</Link>
          </div>
          <div className="space-y-3">
            {[
              { time: "9:00 AM", title: "Daily Standup", type: "Meeting", typeBadge: statusBadgeClass.indigo, duration: "30 min", barColor: "bg-indigo-500" },
              { time: "10:30 AM", title: "Product Sync", type: "Meeting", typeBadge: statusBadgeClass.violet, duration: "45 min", barColor: "bg-violet-500" },
              { time: "2:00 PM", title: "Sarah Mitchell — 1:1", type: "1:1", typeBadge: statusBadgeClass.amber, duration: "30 min", barColor: "bg-amber-500" },
              { time: "3:30 PM", title: "Code Review: Auth Module", type: "Review", typeBadge: statusBadgeClass.rose, duration: "1h", barColor: "bg-rose-500" },
              { time: "Tomorrow 9:00 AM", title: "Sprint Planning", type: "Planning", typeBadge: statusBadgeClass.emerald, duration: "2h", barColor: "bg-emerald-500" },
            ].map((event) => (
              <div key={event.title} className="flex items-center gap-3">
                <div className={`w-1 self-stretch rounded-full ${event.barColor} shrink-0`} />
                <div className="w-28 shrink-0">
                  <span className="text-xs font-medium text-dark-5 dark:text-dark-6 whitespace-nowrap">{event.time}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-dark dark:text-white truncate">{event.title}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${event.typeBadge}`}>{event.type}</span>
                  <span className="text-[10px] text-dark-5 dark:text-dark-6">{event.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Team Announcements */}
        <div className="md:col-span-5 rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-dark dark:text-white">Team Announcements</h2>
            <span className="text-xs text-dark-5 dark:text-dark-6">From Leadership</span>
          </div>
          <div className="space-y-3">
            {[
              {
                title: "Q2 Goals finalized — please review with your teams",
                author: "CEO",
                time: "Today",
                borderColor: "border-indigo-500",
              },
              {
                title: "Remote work policy updated — read before Monday",
                author: "HR",
                time: "Yesterday",
                borderColor: "border-amber-500",
              },
              {
                title: "All-hands meeting moved to May 12",
                author: "Admin",
                time: "2 days ago",
                borderColor: "border-emerald-500",
              },
            ].map((ann) => (
              <div key={ann.title} className={`rounded-lg border-l-4 ${ann.borderColor} bg-gray-1 dark:bg-dark-3/40 px-3 py-2.5`}>
                <p className="text-xs font-semibold text-dark dark:text-white leading-snug">{ann.title}</p>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-[10px] text-dark-5 dark:text-dark-6">{ann.author} · {ann.time}</span>
                  <Link href="#" className="text-[10px] font-semibold text-indigo-600 hover:underline dark:text-indigo-400">Read</Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
