import { getProjects } from "@/lib/actions/tasks";
import { ProjectsPageClient } from "./_components/projects-page-client";

export const metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const projects = await getProjects().catch(() => []);
  return <ProjectsPageClient projects={projects} />;
}
