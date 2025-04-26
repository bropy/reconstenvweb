"use client";
import { useState, useEffect } from "react";

type Project = {
  id: number;
  name: string;
  createdAt: Date;
};

function DashBoard() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    // Потім замінити на реальний запит до API
    const randomProjects: Project[] = [
      {
        id: 1,
        name: "Project Alpha",
        createdAt: new Date(),
      },
      {
        id: 2,
        name: "Project Beta",
        createdAt: new Date(),
      },
      {
        id: 3,
        name: "Project Gamma",
        createdAt: new Date(),
      },
    ];
    setProjects(randomProjects);
  }, []);

  return (
    <div className="m-2 rounded-md">
      <div className="flex justify-between items-center bg-amber-100 rounded-md p-2">
        <h1 className="font-bold text-2xl">DashBoard</h1>
        <button className="bg-amber-200 rounded-xl p-2">Create new</button>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div
              key={project.id}
              className="bg-amber-200 rounded-md p-2 flex justify-between items-center"
            >
              <h2>{project.name}</h2>
              <h2>{project.createdAt.toLocaleDateString()}</h2>
            </div>
          ))
        ) : (
          <div className="text-center mb-2">No projects found</div>
        )}
      </div>
    </div>
  );
}

export default DashBoard;
