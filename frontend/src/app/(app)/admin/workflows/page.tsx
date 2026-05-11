import { getWorkflows } from "@/lib/actions/admin";
import { WorkflowsClient } from "./_components/workflows-client";

export const metadata = { title: "Workflows" };

export default async function WorkflowsPage() {
  const workflows = await getWorkflows();
  return <WorkflowsClient workflows={workflows} />;
}
