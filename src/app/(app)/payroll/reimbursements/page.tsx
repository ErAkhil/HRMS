import { getClaims } from "@/lib/actions/reimbursements";
import { auth } from "@/auth";
import { ReimbursementsClient } from "./_components/reimbursements-client";

export const metadata = { title: "Reimbursements" };

export default async function ReimbursementsPage() {
  const session = await auth();
  const isAdmin = ["SUPER_ADMIN", "HR_ADMIN", "MANAGER"].includes(session?.user?.role ?? "");

  const rawClaims = await getClaims().catch(() => []);

  const claims = rawClaims.map((c) => ({
    id: c.id,
    employeeName: `${c.employee.firstName} ${c.employee.lastName}`,
    category: c.category,
    amount: Number(c.amount),
    date: c.date.toISOString(),
    description: c.description,
    status: c.status,
  }));

  const pendingTotal = claims.filter((c) => c.status === "PENDING").reduce((s, c) => s + c.amount, 0);
  const approvedTotal = claims.filter((c) => c.status === "APPROVED").reduce((s, c) => s + c.amount, 0);

  return <ReimbursementsClient claims={claims} isAdmin={isAdmin} pendingTotal={pendingTotal} approvedTotal={approvedTotal} />;
}
