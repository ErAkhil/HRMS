"use client";

import { cn } from "@/lib/utils";

type Plan = "BASIC" | "PRO" | "PRO_PLUS" | "PRO_MAX";

const PLANS: {
  id: Plan;
  name: string;
  price: string;
  description: string;
  color: string;
  badge?: string;
}[] = [
  {
    id: "BASIC",
    name: "Basic",
    price: "Free",
    description: "Core HR for small teams getting started",
    color: "border-gray-3 dark:border-dark-3",
  },
  {
    id: "PRO",
    name: "Pro",
    price: "$12",
    description: "Payroll, tasks, and performance tracking",
    color: "border-sky-300 dark:border-sky-700",
  },
  {
    id: "PRO_PLUS",
    name: "Pro+",
    price: "$24",
    description: "Recruitment, learning, and deep analytics",
    color: "border-primary-400 dark:border-primary-600",
    badge: "Popular",
  },
  {
    id: "PRO_MAX",
    name: "Pro Max",
    price: "$49",
    description: "Everything — AI, collaboration, onboarding",
    color: "border-violet-400 dark:border-violet-600",
  },
];

const FEATURES: { label: string; basic: boolean | string; pro: boolean | string; pro_plus: boolean | string; pro_max: boolean | string }[] = [
  // Core
  { label: "Employee Directory", basic: true, pro: true, pro_plus: true, pro_max: true },
  { label: "Org Chart", basic: true, pro: true, pro_plus: true, pro_max: true },
  { label: "Attendance Tracking", basic: true, pro: true, pro_plus: true, pro_max: true },
  { label: "Leave Management", basic: true, pro: true, pro_plus: true, pro_max: true },
  { label: "Calendar", basic: true, pro: true, pro_plus: true, pro_max: true },
  // Pro
  { label: "Payroll & Payslips", basic: false, pro: true, pro_plus: true, pro_max: true },
  { label: "Reimbursements", basic: false, pro: true, pro_plus: true, pro_max: true },
  { label: "Tasks & Projects", basic: false, pro: true, pro_plus: true, pro_max: true },
  { label: "Kanban Board", basic: false, pro: true, pro_plus: true, pro_max: true },
  { label: "Performance KPIs", basic: false, pro: true, pro_plus: true, pro_max: true },
  { label: "Performance Reviews", basic: false, pro: true, pro_plus: true, pro_max: true },
  // Pro+
  { label: "Recruitment Pipeline", basic: false, pro: false, pro_plus: true, pro_max: true },
  { label: "Job Postings", basic: false, pro: false, pro_plus: true, pro_max: true },
  { label: "Learning & Courses", basic: false, pro: false, pro_plus: true, pro_max: true },
  { label: "Certifications", basic: false, pro: false, pro_plus: true, pro_max: true },
  { label: "Workforce Reports", basic: false, pro: false, pro_plus: true, pro_max: true },
  { label: "Payroll Analytics", basic: false, pro: false, pro_plus: true, pro_max: true },
  { label: "Performance Analytics", basic: false, pro: false, pro_plus: true, pro_max: true },
  // Pro Max
  { label: "Collaboration Channels", basic: false, pro: false, pro_plus: false, pro_max: true },
  { label: "Direct Messages", basic: false, pro: false, pro_plus: false, pro_max: true },
  { label: "Video Meetings", basic: false, pro: false, pro_plus: false, pro_max: true },
  { label: "Onboarding Workflows", basic: false, pro: false, pro_plus: false, pro_max: true },
  { label: "Offboarding", basic: false, pro: false, pro_plus: false, pro_max: true },
  { label: "AI Assistant", basic: false, pro: false, pro_plus: false, pro_max: true },
];

const PLAN_RANK: Record<Plan, number> = { BASIC: 0, PRO: 1, PRO_PLUS: 2, PRO_MAX: 3 };

function CheckIcon() {
  return (
    <svg className="h-4 w-4 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg className="h-4 w-4 text-gray-300 dark:text-dark-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  );
}

export function UpgradeClient({ currentPlan }: Readonly<{ currentPlan: Plan }>) {
  const currentRank = PLAN_RANK[currentPlan];

  const planLabels: Record<Plan, string> = { BASIC: "Basic", PRO: "Pro", PRO_PLUS: "Pro+", PRO_MAX: "Pro Max" };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-dark dark:text-white">Choose Your Plan</h1>
        <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
          You are currently on the <span className="font-semibold text-dark dark:text-white">{planLabels[currentPlan]}</span> plan
        </p>
      </div>

      {/* Plan cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((plan) => {
          const rank = PLAN_RANK[plan.id];
          const isCurrent = plan.id === currentPlan;
          const isDowngrade = rank < currentRank;

          return (
            <div
              key={plan.id}
              className={cn(
                "relative rounded-2xl border-2 bg-white p-5 shadow-card dark:bg-dark-2 flex flex-col",
                plan.color,
                isCurrent && "ring-2 ring-primary-300 dark:ring-primary-700",
              )}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-600 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  {plan.badge}
                </div>
              )}
              {isCurrent && (
                <div className="mb-3 inline-flex self-start rounded-full bg-primary-50 px-2.5 py-0.5 text-[10px] font-semibold text-primary-600 dark:bg-primary-900/20 dark:text-primary-300">
                  Current Plan
                </div>
              )}
              <h2 className="text-lg font-bold text-dark dark:text-white">{plan.name}</h2>
              <div className="mt-1 flex items-end gap-1">
                <span className="text-2xl font-extrabold text-dark dark:text-white">{plan.price}</span>
                {plan.price !== "Free" && <span className="mb-0.5 text-xs text-dark-5 dark:text-dark-6">/user/mo</span>}
              </div>
              <p className="mt-2 text-xs text-dark-5 dark:text-dark-6 flex-1">{plan.description}</p>

              <button
                disabled={isCurrent || isDowngrade}
                className={cn(
                  "mt-4 w-full rounded-lg py-2 text-sm font-semibold transition-colors",
                  isCurrent
                    ? "bg-gray-2 text-dark-5 cursor-default dark:bg-dark-3 dark:text-dark-6"
                    : isDowngrade
                    ? "bg-gray-1 text-dark-5/50 cursor-not-allowed dark:bg-dark-3/50 dark:text-dark-6/50"
                    : "bg-primary-600 text-white hover:bg-primary-700",
                )}
              >
                {isCurrent ? "Current Plan" : isDowngrade ? "Downgrade" : "Upgrade Now"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Feature comparison table */}
      <div className="rounded-2xl bg-white shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 overflow-hidden">
        <div className="p-5 border-b border-gray-2 dark:border-dark-3">
          <h2 className="font-semibold text-dark dark:text-white">Feature Comparison</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-2 dark:border-dark-3 bg-gray-1 dark:bg-dark-3/50">
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6 w-1/3">Feature</th>
                {PLANS.map((p) => (
                  <th
                    key={p.id}
                    className={cn(
                      "px-4 py-3 text-center text-xs font-semibold",
                      p.id === currentPlan ? "text-primary-600 dark:text-primary-400" : "text-dark-5 dark:text-dark-6",
                    )}
                  >
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((feat, i) => {
                const vals = [feat.basic, feat.pro, feat.pro_plus, feat.pro_max];
                return (
                  <tr
                    key={feat.label}
                    className={cn(
                      "border-b border-gray-2 dark:border-dark-3 last:border-0",
                      i % 2 === 0 ? "bg-white dark:bg-dark-2" : "bg-gray-1/50 dark:bg-dark-3/20",
                    )}
                  >
                    <td className="px-5 py-3 text-sm text-dark dark:text-white">{feat.label}</td>
                    {vals.map((v, idx) => (
                      <td key={idx} className="px-4 py-3 text-center">
                        {typeof v === "string" ? (
                          <span className="text-xs text-dark-5 dark:text-dark-6">{v}</span>
                        ) : v ? (
                          <div className="flex justify-center"><CheckIcon /></div>
                        ) : (
                          <div className="flex justify-center"><CrossIcon /></div>
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-center text-xs text-dark-5 dark:text-dark-6">
        To change your plan, contact your account manager or{" "}
        <span className="text-primary-600 dark:text-primary-400">reach out to support</span>.
      </p>
    </div>
  );
}
