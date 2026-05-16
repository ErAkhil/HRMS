import type { SerializedReview } from "@/lib/actions/performance";

interface Props {
  score: number | null;
  reviews: readonly SerializedReview[];
}

function getScoreLabel(score: number | null): string {
  if (score === null) return "No Reviews Yet";
  if (score >= 90) return "Outstanding";
  if (score >= 80) return "Excellent";
  if (score >= 70) return "Good";
  return "Needs Improvement";
}

export function ScoreCard({ score, reviews }: Readonly<Props>) {
  const displayScore = score ?? 0;
  const scoreText = score === null ? "--" : String(score);
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (displayScore / 100) * circumference;
  const completedReviews = reviews.filter((r) => r.status === "COMPLETED").length;
  const latestReview = reviews.find((r) => r.score !== null);

  return (
    <div
      className="rounded-xl p-6 text-white"
      style={{ background: "linear-gradient(135deg, #4F46E5, #8B5CF6)" }}
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5">
          <div className="relative flex-shrink-0">
            <svg width="112" height="112" viewBox="0 0 128 128">
              <circle cx="64" cy="64" r="54" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="10" />
              <circle
                cx="64" cy="64" r="54"
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
              <span className="text-3xl font-bold text-white">{scoreText}</span>
              {score !== null && <span className="text-xs text-white/70">/ 100</span>}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-white/70">Overall Performance Score</p>
            <h2 className="mt-1 text-2xl font-bold text-white">{getScoreLabel(score)}</h2>
            <p className="mt-1 text-xs text-white/60">
              {latestReview
                ? `Last reviewed ${new Date(latestReview.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}`
                : "No performance reviews yet"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 sm:gap-8">
          {[
            { label: "Reviews", value: completedReviews, suffix: " done" },
            { label: "Total", value: reviews.length, suffix: " total" },
          ].map((item) => (
            <div key={item.label} className="text-center min-w-[64px]">
              <div className="text-2xl font-bold text-white">{item.value}{item.suffix}</div>
              <div className="mt-0.5 text-xs text-white/70">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
