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
import { ProjectGrid } from "./ProjectGrid";
import ProjectGridSkeleton from "./ProjectGridSkeleton";

export const Projects = () => {
  const { data: projects = [], isPending } = useGetProjects() as { data: Project[]; isPending: boolean };
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
          <TabsTrigger value="mine" className="flex items-center gap-2 px-4 py-2 rounded-md text-white data-[state=active]:bg-[#2A2A2A] data-[state=inactive]:text-gray-400 data-[state=active]:text-white transition-colors"><User />Миний төслүүд</TabsTrigger>
          <TabsTrigger value="others" className="flex items-center gap-2 px-4 py-2 rounded-md text-white data-[state=active]:bg-[#2A2A2A] data-[state=inactive]:text-gray-400 data-[state=active]:text-white transition-colors"><Grid />Бусад төслүүд</TabsTrigger>
        </TabsList>
     <TabsContent value="mine">
  {isPending ? (
    <ProjectGridSkeleton />
  ) : (
    <ProjectGrid projects={myProjects} router={router} userId={user?.id} />
  )}
</TabsContent>

<TabsContent value="others">
  {isPending ? (
    <ProjectGridSkeleton />
  ) : (
    <ProjectGrid projects={otherProjects} router={router} userId={user?.id} />
  )}
</TabsContent>


      </Tabs>
    </div>
  );
};

