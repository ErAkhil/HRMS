import { getOrgTasks } from "@/lib/actions/tasks";
import { KanbanPageClient } from "./_components/kanban-page-client";

export const metadata = { title: "Kanban Board" };

export default async function KanbanPage() {
  const tasks = await getOrgTasks().catch(() => []);
  return <KanbanPageClient tasks={tasks} />;
}
