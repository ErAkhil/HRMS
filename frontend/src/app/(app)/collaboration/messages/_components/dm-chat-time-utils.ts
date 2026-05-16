export type ParsedCallData = {
  callType: "audio" | "video";
  status: "ended" | "missed";
  duration: number;
};

export function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export function formatTimestamp(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const time = formatTime(iso);

  if (d.toDateString() === now.toDateString()) return time;

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return `Yesterday, ${time}`;

  if (d.getFullYear() === now.getFullYear()) {
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + `, ${time}`;
  }
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + `, ${time}`;
}

export function formatDateSeparator(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return "Today";
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  if (d.getFullYear() === now.getFullYear()) {
    return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  }
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function isSameDay(a: string, b: string) {
  return new Date(a).toDateString() === new Date(b).toDateString();
}

export function formatDuration(secs: number) {
  if (secs < 60) return `${secs}s`;
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

export function parseCallContent(content: string): ParsedCallData | null {
  if (!content.startsWith('{"__call__"')) return null;
  try {
    const p = JSON.parse(content) as { __call__: boolean; callType: "audio" | "video"; status: "ended" | "missed"; duration: number };
    if (!p.__call__) return null;
    return { callType: p.callType, status: p.status, duration: p.duration ?? 0 };
  } catch {
    return null;
  }
}
