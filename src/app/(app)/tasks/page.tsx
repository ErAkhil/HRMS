import { getMyTasks } from "@/lib/actions/tasks";
import { TasksPageClient } from "./_components/TasksPageClient";

export default async function TasksPage() {
  const tasks = await getMyTasks().catch(() => []);

  return <TasksPageClient tasks={tasks} />;
}
