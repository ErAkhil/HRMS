import { requireAuth } from "@/lib/session";
import { UpgradeClient } from "./_components/upgrade-client";

export const metadata = { title: "Upgrade Plan" };

export default async function UpgradePage() {
  const user = await requireAuth();
  return <UpgradeClient currentPlan={user.plan} />;
}
