import { getLeadershipDashboardData } from "@/lib/actions/dashboard";
import { LeadershipDashboardClient } from "./_components/leadership-dashboard-client";
import { requireAuth } from "@/lib/session";

export const metadata = { title: "Leadership Dashboard" };

export default async function LeadershipDashboardPage() {
  const [user, data] = await Promise.all([
    requireAuth(),
    getLeadershipDashboardData(),
  ]);

  return <LeadershipDashboardClient data={data} orgName={user.orgName ?? "Organization"} />;
}
