import Link from "next/link";

const INSIGHTS = [
  {
    type: "positive",
    icon: (
      <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <path d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "23% above team average",
    body: "Your productivity this week is higher than most peers in your department.",
  },
  {
    type: "info",
    icon: (
      <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Peak focus: 10 AM – 12 PM",
    body: "Based on your activity, you work best in the late morning. Schedule deep work then.",
  },
  {
    type: "warning",
    icon: (
      <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "4 overdue tasks detected",
    body: "You have tasks past their deadline. Clear these to keep your productivity score high.",
  },
];

const COLOR_MAP: Record<string, string> = {
  positive: "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  info: "bg-sky-50 text-sky-dark dark:bg-sky-dark/10 dark:text-sky",
  warning: "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber",
};

export function AIInsightsCard() {
  return (
    <div className="flex h-full flex-col rounded-xl bg-white shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 overflow-hidden">
      {/* Gradient header */}
      <div className="bg-gradient-ai px-5 py-4">
        <div className="flex items-center gap-2">
          <svg className="size-4 text-white/90" viewBox="0 0 24 24" fill="none">
            <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h3 className="text-sm font-semibold text-white">AI Productivity Insights</h3>
        </div>
        <p className="mt-0.5 text-xs text-white/60">Updated just now · Unikove AI</p>
      </div>

      {/* Insights */}
      <div className="flex flex-1 flex-col gap-2.5 p-5">
        {INSIGHTS.map((item, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 rounded-lg p-3 text-xs ${COLOR_MAP[item.type]}`}
          >
            {item.icon}
            <div>
              <p className="font-semibold">{item.title}</p>
              <p className="mt-0.5 opacity-80">{item.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-3 px-5 py-3 dark:border-dark-3">
        <Link
          href="/ai"
          className="flex items-center gap-1 text-xs font-semibold text-violet-DEFAULT hover:text-violet-dark dark:text-violet-300"
        >
          Ask AI for more insights
          <svg className="size-3.5" viewBox="0 0 24 24" fill="none">
            <path d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
