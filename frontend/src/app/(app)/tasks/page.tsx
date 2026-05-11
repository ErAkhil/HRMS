import { getMyTasks, getProjects, getTeamTaskWorkload } from "@/lib/actions/tasks";
import { TasksPageClient } from "./_components/TasksPageClient";

export default async function TasksPage() {
  const [tasks, projects, teamWorkload] = await Promise.all([
    getMyTasks().catch(() => []),
    getProjects().catch(() => []),
    getTeamTaskWorkload().catch(() => []),
  ]);

  return <TasksPageClient tasks={tasks} projects={projects} teamWorkload={teamWorkload} />;
}
