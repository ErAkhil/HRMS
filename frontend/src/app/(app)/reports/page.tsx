import { getReportsData } from "@/lib/actions/reports";
import { ReportsClient } from "./_components/reports-client";

export const metadata = { title: "Reports & Analytics" };

export default async function ReportsPage() {
  const data = await getReportsData();
  return <ReportsClient data={data} />;
}
