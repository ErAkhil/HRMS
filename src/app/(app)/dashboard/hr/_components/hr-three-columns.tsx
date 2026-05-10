import Image from "next/image";
import Link from "next/link";
import { badgeClass, recruitmentRoles, onboardingPeople, complianceItems } from "../_data/hr-data";

export function HrThreeColumns() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">

      {/* Recruitment Pipeline */}
      <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-dark dark:text-white">Open Roles · 17</h2>
          <Link href="/recruitment" className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">View All →</Link>
        </div>
        <div className="space-y-3">
          {recruitmentRoles.map((role) => (
            <div key={role.title} className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-dark dark:text-white truncate">{role.title}</p>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${badgeClass[role.deptColor]}`}>{role.dept}</span>
                  <span className="text-[10px] text-dark-5 dark:text-dark-6">{role.applicants} applicants</span>
                </div>
              </div>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${badgeClass[role.stageColor]}`}>{role.stage}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 border-t border-gray-3 dark:border-dark-3 pt-3">
          <p className="text-xs text-dark-5 dark:text-dark-6">3 offers pending · Avg 18 days to hire</p>
        </div>
      </div>

      {/* Active Onboarding */}
      <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-dark dark:text-white">Active Onboarding · 6</h2>
          <Link href="/onboarding" className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">View →</Link>
        </div>
        <div className="space-y-3">
          {onboardingPeople.map((person) => (
            <div key={person.name} className="flex items-center gap-2.5">
              <Image src={person.img} alt={person.name} width={28} height={28} className="rounded-full object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <p className="text-xs font-semibold text-dark dark:text-white truncate">{person.name}</p>
                  <span className="text-[10px] text-dark-5 dark:text-dark-6 shrink-0">{person.pct}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative h-1 w-20 rounded-full bg-gray-2 dark:bg-dark-3 overflow-hidden">
                    <div className={`absolute inset-y-0 left-0 rounded-full ${person.barColor}`} style={{ width: `${person.pct}%` }} />
                  </div>
                  <span className="text-[10px] text-dark-5 dark:text-dark-6">Day {person.day}/30</span>
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${badgeClass[person.color]}`}>{person.dept}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 border-t border-gray-3 dark:border-dark-3 pt-3">
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${badgeClass.emerald}`}>3 completing this week</span>
        </div>
      </div>

      {/* Compliance Tracker */}
      <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-dark dark:text-white">Compliance</h2>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeClass.amber}`}>4 items</span>
        </div>
        <div className="space-y-3">
          {complianceItems.map((item) => (
            <div key={item.title} className="border-b border-gray-3 dark:border-dark-3 pb-3 last:border-0 last:pb-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-dark dark:text-white">{item.title}</p>
                  <p className="mt-0.5 text-[10px] text-dark-5 dark:text-dark-6">{item.detail}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${badgeClass[item.statusColor]}`}>{item.status}</span>
              </div>
              <p className="mt-1 text-[10px] text-dark-5 dark:text-dark-6">{item.due}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 border-t border-gray-3 dark:border-dark-3 pt-3">
          <Link href="/reports" className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">
            View All Compliance →
          </Link>
        </div>
      </div>

    </div>
  );
}
