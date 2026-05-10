import Image from "next/image";
import type { Project } from "../_data/projects-data";
import { STATUS_COLORS, PROGRESS_COLORS } from "../_data/projects-data";

export function ProjectCard({ project, onOpen }: Readonly<{ project: Project; onOpen: () => void }>) {
  const overflow = project.members.length - 4;
  return (
    <div className="card overflow-hidden">
      <div className={`h-1.5 w-full ${project.accentColor}`} />
      <div className="p-5">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="section-title">{project.name}</h3>
          <span className={STATUS_COLORS[project.status]}>{project.status}</span>
        </div>

        <p className="text-muted mb-4 line-clamp-1">{project.description}</p>

        <div className="mb-1 flex items-center justify-between">
          <span className="text-muted">Progress</span>
          <span className="text-xs font-semibold text-dark dark:text-white">{project.progress}%</span>
        </div>
        <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-gray-3 dark:bg-dark-3">
          <div className={`h-full rounded-full ${PROGRESS_COLORS[project.status]}`} style={{ width: `${project.progress}%` }} />
        </div>

        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex -space-x-2">
              {project.members.slice(0, 4).map((src, i) => (
                <Image key={i} src={src} alt="" width={26} height={26} className="size-7 rounded-full ring-2 ring-white dark:ring-dark-2" />
              ))}
            </div>
            {overflow > 0 && <span className="text-muted ml-1">+{overflow}</span>}
          </div>
          <span className="text-muted">{project.completedTasks}/{project.totalTasks} tasks</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-muted flex items-center gap-1">
            <svg className="size-3.5" viewBox="0 0 24 24" fill="none">
              <path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {project.dueDate}
          </div>
          <button onClick={onOpen} className="btn-secondary px-3 py-1.5 text-xs">Open</button>
        </div>
      </div>
    </div>
  );
}
