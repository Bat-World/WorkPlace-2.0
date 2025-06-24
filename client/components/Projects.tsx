"use client";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FileBox, Folder, Timer } from "lucide-react";
import { useState } from "react";
import { useCreateProject } from "@/hooks/project/ useCreateProject";
import { useGetProjects } from "@/hooks/project/useGetProjects";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from 'date-fns';



export const Projects = () => {

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const router = useRouter();
  const { mutate: createProject, isPending } = useCreateProject()
  const {
    data: projects,
    isLoading,
    isError,
  } = useGetProjects();

  const handleCreate = () => {
    if (!title.trim() || !description.trim()) {
      toast.error('Please enter title and description')
      return
    }
    createProject(
      {
        title,
        description,
        organizationId: 'cmc7qevnj0003vtzcekma7gh6',
      },
      {
        onSuccess: (data) => {
          toast.success(`Project "${data.title}" created`)
          setTitle('')
          setDescription('')
        },
        onError: (error) => {
          console.error(error)
          toast.error('Failed to create project')
        },
      }
    )
  }

  return (
    <div className="max-w-[1348px] mx-auto px-4 sm:px-6 lg:px-8 ">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center space-x-4">
          <div className="text-2xl font-bold text-white">Төслүүд</div>
          <div className="text-sm text-gray-500">/ Projects</div>
        </div>
        <Dialog>
          <DialogTrigger asChild >
            <Button className="bg-[#2FC285]">+ Төсөл үүсгэх</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Project</DialogTitle>
              <DialogDescription>Enter project details below</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Input placeholder="Project Title" value={title}
                onChange={(e) => setTitle(e.target.value)} />
              <Input
                placeholder="Project Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Button
                className="bg-blue-600 text-white w-full"
                onClick={handleCreate}
                disabled={isPending}
              >
                {isPending ? 'Creating...' : 'Create'}
              </Button>

            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="w-full flex flex-col gap-4 mt-6">
        {isLoading && <p className="text-gray-400">Loading projects...</p>}
        {isError && (
          <p className="text-red-500">Failed to load projects. Try again.</p>
        )}

        {projects?.map((project: any) => (
          <div
            key={project.id}
            className="w-full h-[86px] bg-[#141318] border border-[#3D3C41] rounded-xl flex items-center justify-between px-6 cursor-pointer"
            onClick={() => router.push(`/projectDetail/${project.id}`)}
          >
            <div className="flex items-center gap-4">
              <img
                src={"/avatar.svg"}
                alt="avatar"
                className="w-[60px] h-[60px] rounded-xl"
              />
              <div className="flex flex-col gap-1">
                <p className="text-white text-[20px] font-semibold leading-6">
                  {project.title}
                </p>
                <p className="text-white/50 text-[12px] leading-[17px]">
                  {project.description ?? "No description"}
                </p>
              </div>
            </div>
            <div className="flex gap-10 items-center">
              <div className="flex items-center gap-2 bg-[#101014] rounded-[9px] px-3 h-[36px]">
                <FileBox color="#FFFFFF" strokeWidth={1.5} />
                <p className="text-white text-[15px]">14</p>
              </div>
              <div className="flex items-center gap-2 bg-[#101014] rounded-[9px] px-3 h-[36px]">
                <Timer color="#A5A5A9" strokeWidth={1.5} />
                <p className="text-white/50 text-sm">
                  {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                </p>

              </div>
            </div>
            <div className="flex -space-x-2">
              <div className="w-8 h-8 bg-[#8F8F8F] rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-[#8F8F8F] rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-[#8F8F8F] rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-[#8F8F8F] rounded-full border-2 border-white"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
