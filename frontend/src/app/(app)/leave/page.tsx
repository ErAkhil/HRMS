import { getMyLeaveBalances, getLeaveRequests } from "@/lib/actions/leave";
import { LeavePageClient } from "./_components/LeavePageClient";

export default async function LeavePage() {
  const [balances, requests] = await Promise.all([
    getMyLeaveBalances().catch(() => []),
    getLeaveRequests().catch(() => []),
  ]);

  return <LeavePageClient balances={balances} requests={requests} />;
}
