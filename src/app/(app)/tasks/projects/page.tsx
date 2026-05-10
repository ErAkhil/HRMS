"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";
import { PROJECTS, PROJECT_STATS } from "./_data/projects-data";
import { ProjectCard } from "./_components/project-card";
import { NewProjectModal } from "./_components/new-project-modal";

export default function ProjectsPage() {
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const { toast, setToast } = useToast();

  function handleCreateProject() {
    setShowNewProjectModal(false);
    setToast("Project created successfully!");
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="text-muted">Track all HR initiatives and projects in one place</p>
        </div>
        <button onClick={() => setShowNewProjectModal(true)} className="btn-primary">+ New Project</button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {PROJECT_STATS.map((s) => (
          <div key={s.label} className="card-p">
            <p className="stat-label">{s.label}</p>
            <p className={`mt-1 text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onOpen={() => setToast("Opening project workspace...")}
          />
        ))}
      </div>

      {showNewProjectModal && (
        <NewProjectModal
          onClose={() => setShowNewProjectModal(false)}
          onCreate={handleCreateProject}
        />
      )}

      <Toast message={toast} />
    </div>
  );
}
