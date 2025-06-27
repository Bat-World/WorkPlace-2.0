"use client";

import { useGetProjects } from "@/hooks/project/useGetProjects";
import CreateProjectDialog from "@/app/projects/_components/CreateProjectDialog";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Project } from "@/lib/types";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { User, Grid } from "lucide-react";

export const Projects = () => {
  const { data: projects, isLoading } = useGetProjects();
  const { user } = useUser();
  const router = useRouter();

  const myProjects = projects?.filter(
    (project: Project) => project.createdBy?.id === user?.id
  );
  const otherProjects = projects?.filter(
    (project: Project) => project.createdBy?.id !== user?.id
  );

  return (
    <div className="w-full flex flex-col justify-center px-4 md:px-10 lg:px-28 xl:px-32">
      <div className="w-full mt-10 flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-white">Төслүүд</h1>
        <CreateProjectDialog />
      </div>

      <Tabs defaultValue="mine" className="mt-6">
        <TabsList className="bg-[#141318]">
          <TabsTrigger value="mine" className="flex items-center gap-2 px-4 py-2 rounded-md text-white data-[state=active]:bg-[#2A2A2A] data-[state=inactive]:text-gray-400 data-[state=active]:text-white transition-colors"><User/>Миний төслүүд</TabsTrigger>
          <TabsTrigger value="others" className="flex items-center gap-2 px-4 py-2 rounded-md text-white data-[state=active]:bg-[#2A2A2A] data-[state=inactive]:text-gray-400 data-[state=active]:text-white transition-colors"><Grid/>Бусад төслүүд</TabsTrigger>
        </TabsList>

        <TabsContent value="mine">
          <ProjectGrid projects={myProjects} router={router} />
        </TabsContent>

        <TabsContent value="others">
          <ProjectGrid projects={otherProjects} router={router} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const ProjectGrid = ({ projects, router }: { projects: Project[]; router: any }) => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-8">
      {projects?.map((project: Project) => (
        <div
          key={project.id}
          className="w-70 h-70 py-4 px-5 bg-[#141318] rounded-2xl flex justify-between items-center hover:bg-[#1c1b22] transition-all duration-200 ease-in-out cursor-pointer"
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
              <p className="text-xl text-white font-bold">{project.title}</p>
              <p className="text-sm text-white/50">
                {project.description || "No description"}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
