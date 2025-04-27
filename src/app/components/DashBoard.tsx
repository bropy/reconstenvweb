'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion"; 

type Project = {
  id: number;
  name: string;
  createdAt: Date;
};
type Props = {
  setOpen: (open: boolean) => void;
};

function DashBoard({ setOpen }: Props) {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const Projects: Project[] = [
      {
        id: 1,
        name: "Слов'янськ",
        createdAt: new Date(2025, 3, 26),
      },
      {
        id: 2,
        name: "Херсон",
        createdAt: new Date(2025, 3, 15),
      },
      {
        id: 3,
        name: "Ізюм",
        createdAt: new Date(2025, 1, 31),
      },
    ];
    setProjects(Projects);
  }, []);



  return (
    <div className="m-4 p-4 rounded-lg from-blue-500 to-blue-900 text-white">
      <div className="flex justify-between items-center bg-white/20 backdrop-blur-xl rounded-lg p-4 mb-6">
        <motion.h1
          className="font-bold text-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Активні проекти
        </motion.h1>
        <motion.button
          className="bg-gradient-to-t from-indigo-700 to-indigo-900 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 hover:from-indigo-600 hover:to-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-300"
          onClick={() => setOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          Сворити новий
        </motion.button>

      </div>
      <div className="flex flex-wrap gap-4">
        {projects.length > 0 ? (
          projects.map((project) => (
            <motion.div
              key={project.id}
              className="bg-white/30 rounded-xl p-4 flex justify-between items-center w-full md:w-1/2 xl:w-1/3 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link
                href="/map"
                className="w-full flex justify-between items-center text-white hover:text-indigo-300 transition-colors duration-300"
              >
                <h2 className="text-xl font-semibold">{project.name}</h2>
                <span className="text-sm">{project.createdAt.toLocaleDateString()}</span>
              </Link>
            </motion.div>
          ))
        ) : (
          <div className="text-center text-lg text-white mb-6 w-full">No projects found</div>
        )}
      </div>
    </div>
  );
}

export default DashBoard;
