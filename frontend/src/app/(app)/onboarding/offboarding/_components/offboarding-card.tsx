import Image from "next/image";

export interface ExitTask {
  label: string;
  done: boolean;
}

export interface OffboardingRecord {
  id: string;
  name: string;
  avatarUrl: string | null;
  role: string;
  department: string;
  lastDay: string;
  reason: string;
  tasks: ExitTask[];
}

const DEPT_COLORS: Record<string, string> = {
  Engineering: "rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-600 dark:bg-primary-900/20 dark:text-primary-300",
  Product: "rounded-full bg-violet-light px-2.5 py-0.5 text-xs font-medium text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300",
  Finance: "rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-dark dark:bg-sky-dark/10 dark:text-sky",
  HR: "rounded-full bg-amber-light px-2.5 py-0.5 text-xs font-medium text-amber-dark dark:bg-amber-dark/20 dark:text-amber",
  Sales: "rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  Operations: "rounded-full bg-rose-light px-2.5 py-0.5 text-xs font-medium text-rose-dark dark:bg-rose-dark/20 dark:text-rose",
};

const taskIcons: Record<string, React.ReactNode> = {
  "Assets Return": (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
    </svg>
  ),
  "Knowledge Transfer": (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  "Exit Interview": (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  ),
  "Final Settlement": (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

interface Props {
  ob: OffboardingRecord;
  onViewDetails: () => void;
  onSendReminder: () => void;
}

export function OffboardingCard({ ob, onViewDetails, onSendReminder }: Readonly<Props>) {
  const doneCount = ob.tasks.filter((t) => t.done).length;
  const progress = Math.round((doneCount / ob.tasks.length) * 100);
  const progressColor =
    progress === 100 ? "bg-emerald-500" : progress >= 50 ? "bg-sky-500" : progress >= 25 ? "bg-amber-400" : "bg-rose-500";

  return (
    <div className="card-p space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Image
            src={ob.avatarUrl ?? "/images/user/default-avatar.png"}
            alt={ob.name}
            width={44}
            height={44}
            className="rounded-full object-cover"
          />
          <div>
            <p className="text-body-medium font-semibold">{ob.name}</p>
            <p className="text-muted">{ob.role}</p>
          </div>
        </div>
        <div className="text-right">
          <span className={DEPT_COLORS[ob.department] ?? "rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-dark-5"}>{ob.department}</span>
          <p className="mt-1 text-muted">
            Last day: <span className="font-medium text-rose-dark">{ob.lastDay}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs">
        <span className="text-dark-5 dark:text-dark-6">Reason:</span>
        <span className="font-medium text-dark dark:text-white">{ob.reason}</span>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-muted">Exit Progress</span>
          <span className="text-xs font-bold text-dark dark:text-white">{doneCount}/{ob.tasks.length} tasks</span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-3 dark:bg-dark-3 overflow-hidden">
          <div className={`h-full rounded-full ${progressColor}`} style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {ob.tasks.map((task) => (
          <div
            key={task.label}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 ${task.done ? "bg-emerald-light dark:bg-emerald-dark/10" : "bg-gray-1 dark:bg-dark-3"}`}
          >
            <span className={task.done ? "text-emerald-dark dark:text-emerald" : "text-dark-5 dark:text-dark-6"}>
              {task.done ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                taskIcons[task.label]
              )}
            </span>
            <span className={`text-xs font-medium ${task.done ? "text-emerald-dark dark:text-emerald line-through" : "text-dark dark:text-white"}`}>
              {task.label}
            </span>
            {!task.done && <span className="ml-auto text-[10px] text-amber-dark">Pending</span>}
          </div>
        ))}
      </div>

      <div className="flex gap-2 border-t border-gray-3 pt-3 dark:border-dark-3">
        <button onClick={onViewDetails} className="flex-1 btn-secondary py-2 text-xs">View Details</button>
        <button onClick={onSendReminder} className="flex-1 btn-primary py-2 text-xs">Send Reminder</button>
      </div>
    </div>
  );
}
