"use client";

import { Clock, FileBox } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetProjects } from "@/hooks/project/useGetProjects";
import CreateProjectDialog from "@/app/projects/_components/CreateProjectDialog";
import { Project } from "@/lib/types";
import { useRouter } from "next/navigation";



export const Projects = () => {
  const { data: projects, isLoading, error } = useGetProjects();
const router = useRouter();
  return (
    <div className="w-full flex flex-col justify-center px-4 md:px-10 lg:px-28 xl:px-32">
      <div className="w-full mt-10 flex justify-between items-center">
        <div className="flex flex-col">
          <p className="text-start text-[var(--background)] text-3xl font-semibold mt-1">
            Төслүүд
          </p>
        </div>
        <CreateProjectDialog />
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-10">
        {projects?.map((project: Project) => (
          <div
            key={project.id}
            className="w-full py-4 px-5 bg-[#141318] rounded-2xl flex justify-between items-center hover:bg-[#1c1b22] transition-all duration-200 ease-in-out cursor-pointer"
            onClick={() => router.push(`/${project.id}/dashboard`)}
          >
            <div className="flex gap-6 items-center">
              <div
                className="w-18 h-auto aspect-square rounded-lg bg-cover bg-center"
                style={{
                  backgroundImage: `url(https://platform.theverge.com/wp-content/uploads/sites/2/2025/02/STK143_Tinder_01.jpg?quality=90&strip=all&crop=0,0,100,100)`,
                }}
              ></div>
              <div className="flex flex-col">
                <p className="text-xl text-[var(--background)] font-bold">
                  {project.title}
                </p>
                <p className="text-sm text-[var(--background)]/50">
                  {project.description || "No description"}
                </p>
              </div>
            </div>
            <div className="flex gap-5">
              <div className="text-[var(--background)] flex gap-2 py-2 px-4 rounded-lg bg-[#101014]">
                <FileBox className="w-5!" strokeWidth={1.5} />
                {project.tasks?.length || 0}
              </div>
              <div className="text-[var(--background)]/50 flex gap-2 py-2 px-4 rounded-lg bg-[#101014]">
                <Clock className="w-5!" strokeWidth={1.5} />
                {new Date(project.createdAt).toLocaleDateString("mn-MN", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale dark ml-10">
                {project.members?.slice(0, 3).map((member) => (
                  <Avatar key={member.id}>
                    <AvatarImage src={member.user?.avatarUrl || undefined} />
                    <AvatarFallback>
                      {member.user?.name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
