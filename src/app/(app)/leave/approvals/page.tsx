import { getLeaveRequests } from "@/lib/actions/leave";
import { ApprovalsClient } from "./_components/approvals-client";

export const metadata = { title: "Leave Approvals" };

export default async function ApprovalsPage() {
  const raw = await getLeaveRequests("PENDING").catch(() => []);

  const requests = raw.map((r) => ({
    id: r.id,
    employeeName: `${r.employee.firstName} ${r.employee.lastName}`,
    employeeDept: r.employee.department?.name ?? "—",
    leaveType: r.leaveType,
    startDate: r.startDate,
    endDate: r.endDate,
    days: r.days,
    reason: r.reason,
    status: r.status,
    createdAt: r.createdAt,
  }));

  return <ApprovalsClient requests={requests} />;
}
