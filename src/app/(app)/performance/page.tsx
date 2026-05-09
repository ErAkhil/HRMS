import { getMyGoals } from "@/lib/actions/performance";
import { PerformancePageClient } from "./_components/PerformancePageClient";

export default async function PerformancePage() {
  const goals = await getMyGoals().catch(() => []);

  return <PerformancePageClient goals={goals} />;
}
