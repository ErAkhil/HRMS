import { getMyGoals, getMyReviews } from "@/lib/actions/performance";
import { PerformancePageClient } from "./_components/PerformancePageClient";

export default async function PerformancePage() {
  const [goals, reviews] = await Promise.all([
    getMyGoals().catch(() => []),
    getMyReviews().catch(() => []),
  ]);

  return <PerformancePageClient goals={goals} reviews={reviews} />;
}
