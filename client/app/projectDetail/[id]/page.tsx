"use client";

import { useParams } from "next/navigation";
import { useGetProjectById } from "@/hooks/project/useGetProjectById";
import { ProjectTasks } from "@/components/ProjectTasks";
import { CreateTask } from "@/components/Tasks";

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
    <div className="flex flex-col items-start bg-black">
      <CreateTask />
      <ProjectTasks tasks={project?.tasks} />
    </div>
  );
}


