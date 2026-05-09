import { getManagerDashboardData } from "@/lib/actions/dashboard";
import { ManagerDashboardClient } from "./_components/manager-dashboard-client";
import { requireAuth } from "@/lib/session";

export const metadata = { title: "Manager Dashboard" };

export default async function ManagerDashboardPage() {
  const [user, data] = await Promise.all([
    requireAuth(),
    getManagerDashboardData(),
  ]);

  return <ManagerDashboardClient data={data} userName={user.email?.split("@")[0] ?? "Manager"} />;
}
