import { getPayrollInsights } from "@/lib/actions/payroll";
import { PayrollInsightsClient } from "./_components/payroll-insights-client";

export const metadata = { title: "Payroll Insights" };

export default async function PayrollInsightsPage() {
  const data = await getPayrollInsights().catch(() => null);
  return <PayrollInsightsClient data={data} />;
}
