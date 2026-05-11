import { getOffboardingRecords, getOffboardingStats } from "@/lib/actions/onboarding";
import { OffboardingClient } from "./_components/offboarding-client";

export const metadata = { title: "Offboarding" };

export default async function OffboardingPage() {
  const [records, stats] = await Promise.all([
    getOffboardingRecords().catch(() => []),
    getOffboardingStats().catch(() => ({
      exitingThisMonth: 0,
      assetsPending: 0,
      exitInterviews: 0,
      completed: 0,
    })),
  ]);

  return <OffboardingClient records={records} stats={stats} />;
}
