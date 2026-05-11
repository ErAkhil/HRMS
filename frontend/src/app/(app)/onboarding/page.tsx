import { getOnboardingRecords, getOnboardingStats } from "@/lib/actions/onboarding";
import { OnboardingPageClient } from "./_components/onboarding-page-client";

export const metadata = { title: "Onboarding" };

export default async function OnboardingPage() {
  const [records, stats] = await Promise.all([
    getOnboardingRecords(),
    getOnboardingStats(),
  ]);

  return <OnboardingPageClient records={records} stats={stats} />;
}
