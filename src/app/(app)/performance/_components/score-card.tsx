export function ScoreCard() {
  const score = 87;
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div
      className="rounded-xl p-6 text-white"
      style={{ background: "linear-gradient(135deg, #4F46E5, #8B5CF6)" }}
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5">
          {/* Progress Ring */}
          <div className="relative flex-shrink-0">
            <svg width="112" height="112" viewBox="0 0 128 128">
              <circle
                cx="64"
                cy="64"
                r="54"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="10"
              />
              <circle
                cx="64"
                cy="64"
                r="54"
                fill="none"
                stroke="white"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                transform="rotate(-90 64 64)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-white">{score}</span>
              <span className="text-xs text-white/70">/ 100</span>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-white/70">Overall Performance Score</p>
            <h2 className="mt-1 text-2xl font-bold text-white">Excellent</h2>
            <p className="mt-1 text-xs text-white/60">Q2 2026 · Updated May 7, 2026</p>
          </div>
        </div>

        {/* Sub-scores */}
        <div className="flex flex-wrap gap-6 sm:gap-8">
          {[
            { label: "Goals", value: 92 },
            { label: "Skills", value: 84 },
            { label: "Collaboration", value: 85 },
          ].map((item) => (
            <div key={item.label} className="text-center min-w-[64px]">
              <div className="text-2xl font-bold text-white">{item.value}%</div>
              <div className="mt-0.5 text-xs text-white/70">{item.label}</div>
              <div className="mt-2 h-1.5 w-16 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-white"
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
