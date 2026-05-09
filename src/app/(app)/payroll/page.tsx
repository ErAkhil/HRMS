import { auth } from "@/auth";
import { getPayrollRuns } from "@/lib/actions/payroll";
import { PayrollPageClient } from "./_components/PayrollPageClient";

export default async function PayrollPage() {
  const session = await auth();
  const isAdmin = ["SUPER_ADMIN", "HR_ADMIN"].includes(session?.user?.role ?? "");

  let payrollRuns: Awaited<ReturnType<typeof getPayrollRuns>> = [];
  if (isAdmin) {
    payrollRuns = await getPayrollRuns().catch(() => []);
  }

  const latest = payrollRuns[0];
  const latestStats = latest
    ? {
        totalGross: Number(latest.totalGross),
        totalNet: Number(latest.totalNet),
        totalDeductions: Number(latest.totalDeductions),
        employeeCount: latest._count.payslips,
        month: `${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][latest.month - 1]} ${latest.year}`,
      }
    : undefined;

  return (
    <PayrollPageClient
      payrollRuns={payrollRuns}
      latestStats={latestStats}
      isAdmin={isAdmin}
    />
  );
}
