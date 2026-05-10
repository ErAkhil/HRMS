import Image from "next/image";
import type { OffboardingRecord } from "../_data/offboarding-data";
import { taskIcons } from "../_data/offboarding-data";

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
          <Image src={ob.avatar} alt={ob.name} width={44} height={44} className="rounded-full object-cover" />
          <div>
            <p className="text-body-medium font-semibold">{ob.name}</p>
            <p className="text-muted">{ob.role}</p>
          </div>
        </div>
        <div className="text-right">
          <span className={ob.departmentColor}>{ob.department}</span>
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
