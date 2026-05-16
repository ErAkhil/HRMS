"use client";

type AttendanceState = "present" | "done" | "notIn";

export function getAttendanceState(isClockedIn: boolean, isCheckedOut: boolean): AttendanceState {
  if (isClockedIn) return "present";
  if (isCheckedOut) return "done";
  return "notIn";
}

export function AttendanceStatusBadge({ state }: Readonly<{ state: AttendanceState }>) {
  const classNameByState: Record<AttendanceState, string> = {
    present: "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
    done: "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-300",
    notIn: "bg-rose-light text-rose-dark dark:bg-rose-dark/20 dark:text-rose",
  };

  const labelByState: Record<AttendanceState, string> = {
    present: "● Present",
    done: "● Done",
    notIn: "● Not In",
  };

  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${classNameByState[state]}`}>{labelByState[state]}</span>;
}

export function ClockButton({
  isPending,
  isClockedIn,
  onClick,
}: Readonly<{ isPending: boolean; isClockedIn: boolean; onClick: () => void }>) {
  const buttonClass = isClockedIn ? "bg-rose hover:bg-rose-dark" : "bg-emerald hover:bg-emerald-dark";
  let label = "IN";
  if (isPending) label = "…";
  else if (isClockedIn) label = "OUT";

  return (
    <button
      onClick={onClick}
      disabled={isPending}
      className={`flex h-14 w-14 flex-col items-center justify-center rounded-xl text-[10px] font-bold text-white shadow-floating transition-all active:scale-95 disabled:opacity-60 ${buttonClass}`}
    >
      <svg className="mb-0.5 size-5" viewBox="0 0 24 24" fill="none">
        <path d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label}
    </button>
  );
}

export function WeeklyMiniChart({ isActive }: Readonly<{ isActive: boolean }>) {
  return (
    <div className="mt-4 divider pt-4">
      <p className="mb-2 text-muted font-medium">This Week</p>
      <div className="flex items-end gap-1.5">
        {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, i) => {
          const isToday = new Date().getDay() === i + 1;
          const barClass = isToday && isActive ? "bg-emerald" : "bg-gray-3 dark:bg-dark-3";
          const barHeight = isToday && isActive ? "70%" : "20%";

          return (
            <div key={day} className="flex flex-1 flex-col items-center gap-1">
              <div className="relative w-full overflow-hidden rounded-t-sm" style={{ height: 36 }}>
                <div className={`absolute bottom-0 left-0 right-0 rounded-t-sm ${barClass}`} style={{ height: barHeight }} />
              </div>
              <span className="text-muted text-[10px]">{day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
