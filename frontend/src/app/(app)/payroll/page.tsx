import { auth } from "@/auth";
import { getPayrollRuns, getLatestRunPayslips } from "@/lib/actions/payroll";
import { PayrollPageClient } from "./_components/PayrollPageClient";

export default async function PayrollPage() {
  const session = await auth();
  const isAdmin = ["SUPER_ADMIN", "HR_ADMIN"].includes(session?.user?.role ?? "");

  const [payrollRuns, payslipRows] = await Promise.all([
    isAdmin ? getPayrollRuns().catch(() => []) : Promise.resolve([]),
    isAdmin ? getLatestRunPayslips().catch(() => []) : Promise.resolve([]),
  ]);

  const latest = payrollRuns[0];
  const latestStats = latest
    ? {
        totalGross: latest.totalGross,
        totalNet: latest.totalNet,
        totalDeductions: latest.totalDeductions,
        employeeCount: latest._count.payslips,
        month: `${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][latest.month - 1]} ${latest.year}`,
      }
    : undefined;

  return (
    <PayrollPageClient
      payrollRuns={payrollRuns}
      payslipRows={payslipRows}
      latestStats={latestStats}
      isAdmin={isAdmin}
    />
  );
}
