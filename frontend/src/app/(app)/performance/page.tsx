import { getMyGoals, getMyReviews, getTeamPerformanceSummary } from "@/lib/actions/performance";
import { PerformancePageClient } from "./_components/PerformancePageClient";

export default async function PerformancePage() {
  const [goals, reviews, teamData] = await Promise.all([
    getMyGoals().catch(() => []),
    getMyReviews().catch(() => []),
    getTeamPerformanceSummary().catch(() => null),
  ]);

  return <PerformancePageClient goals={goals} reviews={reviews} teamData={teamData} />;
}
