'use client';

import { useGetProjects } from "@/hooks/project/useGetProjects";

export default function DashboardPage() {
  const { data: projects, isLoading, error } = useGetProjects();

  if (isLoading) return <p className="text-gray-500">Loading projects...</p>;
  if (error) return <p className="text-red-500">Error: {(error as Error).message}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Projects</h1>
      {projects?.length ? (
        <ul className="space-y-4">
          {projects.map((project: any) => (
            <li
              key={project.id}
              className="p-4 rounded border shadow-sm hover:bg-gray-50 transition"
            >
              <h2 className="text-lg font-semibold">{project.title}</h2>
              <p className="text-sm text-gray-500">
                Created at: {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">You don’t have any projects yet.</p>
      )}
    </div>
  );
}
