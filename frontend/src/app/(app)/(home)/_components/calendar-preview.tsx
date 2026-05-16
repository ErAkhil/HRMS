import Link from "next/link";
import type { CalendarData } from "@/lib/actions/reports";

const TYPE_STYLE: Record<string, { bar: string; badge: string; label: string }> = {
  leave: {
    bar: "bg-amber-dark",
    badge: "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber",
    label: "Leave",
  },
  task: {
    bar: "bg-rose-dark",
    badge: "bg-rose-light text-rose-dark dark:bg-rose-dark/20 dark:text-rose",
    label: "Due",
  },
};

interface Props {
  calendarData: CalendarData;
}

function getCurrentWeekDays(): { label: string; date: number; isToday: boolean }[] {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diffToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMon);

  const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];
  return DAY_LABELS.map((label, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      label,
      date: d.getDate(),
      isToday: d.toDateString() === now.toDateString(),
    };
  });
}

function WeekDayGrid({ weekDays }: Readonly<{ weekDays: ReturnType<typeof getCurrentWeekDays> }>) {
  return (
    <div className="mt-3 flex gap-1">
      {weekDays.map((d) => (
        <div key={`${d.label}-${d.date}`} className={`flex flex-1 flex-col items-center rounded-lg py-1.5 text-[10px] font-medium ${d.isToday ? "bg-primary-600 text-white" : "text-dark-5 dark:text-dark-6"}`}>
          <span>{d.label}</span>
          <span className={`mt-0.5 font-bold ${d.isToday ? "text-white" : "text-dark dark:text-white"}`}>{d.date}</span>
        </div>
      ))}
    </div>
  );
}

function EventItem({ event }: Readonly<{ event: { title: string; time: string; type: "leave" | "task" } }>) {
  const style = TYPE_STYLE[event.type];

  return (
    <li className="flex items-start gap-2.5">
      <div className={`mt-0.5 w-0.5 self-stretch shrink-0 rounded-full ${style.bar}`} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-dark dark:text-white">{event.title}</p>
        <span className="text-[10px] text-dark-5 dark:text-dark-6">{event.time}</span>
      </div>
      <span className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${style.badge}`}>{style.label}</span>
    </li>
  );
}

function EventsList({ events }: Readonly<{ events: Array<{ title: string; time: string; type: "leave" | "task" }> }>) {
  return (
    <ul className="mt-4 flex-1 space-y-2.5 overflow-y-auto">
      {events.length === 0 ? (
        <li className="py-4 text-center text-xs text-dark-5 dark:text-dark-6">No events today.</li>
      ) : (
        events.map((ev) => <EventItem key={`${ev.type}-${ev.title}-${ev.time}`} event={ev} />)
      )}
    </ul>
  );
}

export function CalendarPreview({ calendarData }: Readonly<Props>) {
  const weekDays = getCurrentWeekDays();
  const todayStr = new Date().toDateString();

  const todayLeaves = calendarData.leaveEvents.filter((e) => {
    const start = new Date(e.startDate);
    const end = new Date(e.endDate);
    const now = new Date();
    return start <= now && now <= end && e.status === "APPROVED";
  });

  const todayTasks = calendarData.taskEvents.filter((e) => {
    if (!e.dueDate) return false;
    return new Date(e.dueDate).toDateString() === todayStr && e.status !== "DONE";
  });

  const events = [
    ...todayLeaves.map((e) => ({
      title: e.title,
      time: "All day",
      type: "leave" as const,
    })),
    ...todayTasks.map((e) => ({
      title: e.title,
      time: `Due today · ${e.priority}`,
      type: "task" as const,
    })),
  ];

  return (
    <div className="flex h-full flex-col card-p">
      <div className="flex items-center justify-between">
        <h3 className="section-title">Today&apos;s Schedule</h3>
        <Link href="/calendar" className="text-xs font-medium text-primary-600 hover:underline dark:text-primary-400">
          Calendar
        </Link>
      </div>
      <WeekDayGrid weekDays={weekDays} />
      <EventsList events={events} />
    </div>
  );
}
