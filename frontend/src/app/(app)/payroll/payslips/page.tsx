import { getMyPayslips } from "@/lib/actions/payroll";
import { PayslipsClient, type PayslipData } from "./_components/payslips-client";

export default async function PayslipsPage() {
  let rawPayslips: Awaited<ReturnType<typeof getMyPayslips>> = [];

  try {
    rawPayslips = await getMyPayslips();
  } catch {
    // Return empty state on error
  }

  const payslips: PayslipData[] = rawPayslips.map((p) => ({
    id: p.id,
    basicSalary: p.basicSalary,
    hra: p.hra,
    allowances: p.allowances,
    grossPay: p.grossPay,
    taxDeduction: p.taxDeduction,
    pfDeduction: p.pfDeduction,
    otherDeductions: p.otherDeductions,
    netPay: p.netPay,
    payrollRun: {
      month: p.payrollRun.month,
      year: p.payrollRun.year,
      status: p.payrollRun.status,
    },
    createdAt: p.createdAt,
  }));

  return <PayslipsClient payslips={payslips} />;
}
