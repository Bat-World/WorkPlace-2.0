"use client";

import { useParams } from "next/navigation";
import { useGetProjectById } from "@/hooks/project/useGetProjectById";

export default function TaskDetail() {
  const params = useParams();
  const projectId = params?.id as string;

  const {
    data: project,
    isLoading,
    isError,
  } = useGetProjectById({ projectId });

  if (isLoading) return <p className="text-white bg-black">Loading project...</p>;
  if (isError) return <p className="text-red-500 bg-black">Failed to load project.</p>;

  return (
    <div className="text-white bg-black">
      <h1 className="text-2xl font-bold mb-2">Project: {project.title}</h1>
      <p className="mb-4 text-gray-400">{project.description}</p>

      <h2 className="text-xl font-semibold mb-2">Tasks</h2>
      <ul className="list-disc pl-6">
        {project.tasks.map((task: any) => (
          <li key={task.id} className="mb-1">
            <strong>{task.title}</strong> – <span className="text-sm">{task.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
