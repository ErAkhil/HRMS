import { getMyPayslips } from "@/lib/actions/payroll";
import { PayslipsClient, type PayslipData } from "./_components/payslips-client";

export default async function PayslipsPage() {
  let rawPayslips: Awaited<ReturnType<typeof getMyPayslips>> = [];

  try {
    rawPayslips = await getMyPayslips();
  } catch {
    // Return empty state on error
  }

  // Serialize Decimal/Date values to plain numbers/dates for the client component
  const payslips: PayslipData[] = rawPayslips.map((p) => ({
    id: p.id,
    basicSalary: Number(p.basicSalary),
    hra: Number(p.hra),
    allowances: Number(p.allowances),
    grossPay: Number(p.grossPay),
    taxDeduction: Number(p.taxDeduction),
    pfDeduction: Number(p.pfDeduction),
    otherDeductions: Number(p.otherDeductions),
    netPay: Number(p.netPay),
    payrollRun: {
      month: p.payrollRun.month,
      year: p.payrollRun.year,
      status: p.payrollRun.status,
    },
    createdAt: p.createdAt,
  }));

  return <PayslipsClient payslips={payslips} />;
}
