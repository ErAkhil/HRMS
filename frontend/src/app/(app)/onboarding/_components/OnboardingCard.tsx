import Image from "next/image";

interface OnboardingCardProps {
  name: string;
  avatar: string;
  role: string;
  department: string;
  startDate: string;
  progress: number;
  pendingTasks: number;
  daysRemaining: number;
  departmentColor: string;
}

export function OnboardingCard({
  name,
  avatar,
  role,
  department,
  startDate,
  progress,
  pendingTasks,
  daysRemaining,
  departmentColor,
}: OnboardingCardProps) {
  const progressColor =
    progress >= 80 ? "bg-emerald-500" : progress >= 50 ? "bg-sky-500" : progress >= 25 ? "bg-amber-400" : "bg-rose-500";

  return (
    <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 flex flex-col gap-4">
      {/* Top */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Image
            src={avatar}
            alt={name}
            width={44}
            height={44}
            className="rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-semibold text-dark dark:text-white">{name}</p>
            <p className="text-xs text-dark-5 dark:text-dark-6">{role}</p>
          </div>
        </div>
        <span className={`shrink-0 text-xs ${departmentColor}`}>{department}</span>
      </div>

      {/* Start Date */}
      <div className="flex items-center gap-2 text-xs text-dark-5 dark:text-dark-6">
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Started: <span className="font-medium text-dark dark:text-white">{startDate}</span>
      </div>

      {/* Progress */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-dark-5 dark:text-dark-6">Onboarding Progress</span>
          <span className="text-xs font-bold text-dark dark:text-white">{progress}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-3 dark:bg-dark-3 overflow-hidden">
          <div className={`h-full rounded-full ${progressColor} transition-all`} style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between rounded-lg bg-gray-1 dark:bg-dark-3 px-4 py-2.5">
        <div className="text-center">
          <p className={`text-base font-bold ${pendingTasks > 0 ? "text-amber-dark" : "text-emerald-dark dark:text-emerald"}`}>
            {pendingTasks}
          </p>
          <p className="text-xs text-dark-5 dark:text-dark-6">Pending tasks</p>
        </div>
        <div className="h-8 w-px bg-gray-3 dark:bg-dark-3" />
        <div className="text-center">
          <p className={`text-base font-bold ${daysRemaining <= 3 ? "text-rose-dark" : "text-sky-dark dark:text-sky"}`}>
            {daysRemaining}d
          </p>
          <p className="text-xs text-dark-5 dark:text-dark-6">Days remaining</p>
        </div>
      </div>

      {/* Action */}
      <button className="w-full rounded-lg border border-gray-3 py-2 text-sm font-medium text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6 transition-colors">
        View Journey
      </button>
    </div>
  );
}
