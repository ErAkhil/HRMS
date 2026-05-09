import { getWorkflows } from "@/lib/actions/admin";
import { WorkflowsClient } from "./_components/workflows-client";

export const metadata = { title: "Workflows" };

export default async function WorkflowsPage() {
  const workflows = await getWorkflows();

  return (
    <WorkflowsClient
      workflows={workflows.map((w) => ({
        id: w.id,
        name: w.name,
        description: w.description ?? "",
        trigger: w.trigger,
        isEnabled: w.isEnabled,
        runsCount: w.runsCount,
        lastRunAt: w.lastRunAt?.toISOString() ?? null,
        createdAt: w.createdAt.toISOString(),
      }))}
    />
  );
}
