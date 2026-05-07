import Link from "next/link";

const EVENTS = [
  {
    title: "All-Hands Meeting",
    time: "10:00 AM",
    duration: "1h",
    type: "meeting",
    participants: 48,
  },
  {
    title: "Q2 Performance Review",
    time: "2:00 PM",
    duration: "30m",
    type: "review",
    participants: 3,
  },
  {
    title: "Daniel Park — Leave",
    time: "All day",
    duration: "",
    type: "leave",
    participants: 0,
  },
  {
    title: "Payroll Submission",
    time: "5:00 PM",
    duration: "",
    type: "deadline",
    participants: 0,
  },
  {
    title: "New Hire Onboarding",
    time: "Tomorrow 9:00 AM",
    duration: "2h",
    type: "onboarding",
    participants: 5,
  },
];

const TYPE_STYLE: Record<string, { bar: string; badge: string; label: string }> = {
  meeting: {
    bar: "bg-indigo-500",
    badge: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300",
    label: "Meeting",
  },
  review: {
    bar: "bg-violet-DEFAULT",
    badge: "bg-violet-light text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300",
    label: "Review",
  },
  leave: {
    bar: "bg-amber",
    badge: "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber",
    label: "Leave",
  },
  deadline: {
    bar: "bg-rose",
    badge: "bg-rose-light text-rose-dark dark:bg-rose-dark/20 dark:text-rose",
    label: "Deadline",
  },
  onboarding: {
    bar: "bg-emerald",
    badge: "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
    label: "Onboarding",
  },
};

export function CalendarPreview() {
  return (
    <div className="flex h-full flex-col rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-dark dark:text-white">Today's Schedule</h3>
        <Link href="/calendar" className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">
          Calendar
        </Link>
      </div>

      {/* Mini month strip */}
      <div className="mt-3 flex gap-1">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <div
            key={i}
            className={`flex flex-1 flex-col items-center rounded-lg py-1.5 text-[10px] font-medium ${i === 2 ? "bg-indigo-600 text-white" : "text-dark-5 dark:text-dark-6"}`}
          >
            <span>{d}</span>
            <span className={`mt-0.5 font-bold ${i === 2 ? "text-white" : "text-dark dark:text-white"}`}>
              {[5, 6, 7, 8, 9, 10, 11][i]}
            </span>
          </div>
        ))}
      </div>

      {/* Events */}
      <ul className="mt-4 flex-1 space-y-2.5 overflow-y-auto">
        {EVENTS.map((ev, i) => {
          const style = TYPE_STYLE[ev.type];
          return (
            <li key={i} className="flex items-start gap-2.5">
              <div className={`mt-0.5 h-full w-0.5 shrink-0 self-stretch rounded-full ${style.bar}`} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-dark dark:text-white">{ev.title}</p>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="text-[10px] text-dark-5 dark:text-dark-6">{ev.time}{ev.duration ? ` · ${ev.duration}` : ""}</span>
                  {ev.participants > 0 && (
                    <span className="text-[10px] text-dark-5 dark:text-dark-6">
                      · {ev.participants} attendees
                    </span>
                  )}
                </div>
              </div>
              <span className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${style.badge}`}>
                {style.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
