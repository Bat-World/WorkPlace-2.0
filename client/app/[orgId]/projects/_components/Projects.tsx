"use client";

import { Button } from "../../../../components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Clock, FileBox, Folder, Plus, Timer } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "next/navigation";
import { useGetProjects } from "@/hooks/project/useGetProjects";
import React, { useEffect, useState } from "react";
import { useCreateProject } from "@/hooks/project/useCreateProject";
import { toast } from "react-toastify";
import { formatToMonthDayTime } from "@/utils/DateFormatter";

interface User {
  id: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
}

interface Task {
  id: string;
  title: string;
  assignedTo?: User | null;
  reviewers?: User[];
}

interface Project {
  id: string;
  title: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  tasks: Task[];
}

export const Projects = () => {
  const params = useParams();
  const orgId = params?.orgId as string;
  const { data: projects, isLoading, error } = useGetProjects(orgId);
  const [projectsData, setProjectsData] = useState<Project[] | undefined>(
    undefined
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);
  const { mutate: createProject, isPending } = useCreateProject();

  useEffect(() => {
    setProjectsData(projects);
  }, [projects]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Мэдээллээ оруулна уу");
      return;
    }
    createProject(
      {
        title,
        description,
        organizationId: orgId,
      },
      {
        onSuccess: (data: { title: string }) => {
          toast.success(`"${data.title}" төсөл амжилттай үүслээ`);
          setTitle("");
          setDescription("");
          setOpen(false);
        },
        onError: () => {
          toast.error("Өө алдаа гарлаа");
        },
      }
    );
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading projects</div>;

  return (
    <div className="w-full flex flex-col justify-center px-4 md:px-10 lg:px-28 xl:px-32">
      <div className="w-full mt-10 flex justify-between items-center">
        <div className="flex flex-col">
          <Breadcrumb className="dark">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Tinder</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Projects</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <p className="text-start text-[var(--background)] text-3xl font-semibold mt-1">
            Төслүүд
          </p>
        </div>
        <div className="flex justify-end gap-6">
          <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale dark">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage src="https://github.com/leerob.png" alt="@leerob" />
              <AvatarFallback>LR</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage
                src="https://github.com/evilrabbit.png"
                alt="@evilrabbit"
              />
              <AvatarFallback>ER</AvatarFallback>
            </Avatar>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                className="text-[var(--background)]"
                type="button"
              >
                <Plus />
                Төсөл үүгэх
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-[#141318] border-[#2A2A2A] dark text-[var(--foreground)] rounded-2xl">
              <DialogHeader>
                <DialogTitle className="">Шинэ төсөл үүсгэх</DialogTitle>
              </DialogHeader>
              <form>
                <div className="grid gap-4 mt-5">
                  <div className="grid gap-3">
                    <Label htmlFor="name-1">Гарчиг</Label>
                    <Input
                      id="name-1"
                      name="name"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-3 mt-2">
                    <Label htmlFor="username-1">Тайлбар</Label>
                    <Textarea
                      id="username-1"
                      name="username"
                      placeholder="Төслийн товч тайлбар"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-full gap-3 flex mt-5">
                  <DialogClose asChild>
                    <Button
                      variant={"outline"}
                      className="flex-1 py-5 rounded-xl"
                      type="button"
                    >
                      Буцах
                    </Button>
                  </DialogClose>
                  <Button
                    className="flex-1 py-5 rounded-xl"
                    type="button"
                    disabled={isPending}
                    onClick={handleCreate}
                  >
                    {isPending ? "Үүсгэж байна..." : "Үүсгэх"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="w-full gap-3 mt-10">
        {projects?.map((project: Project) => (
          <Link
            key={project.id}
            href={`/${orgId}/${project.id}/tasks`}
            className="w-full block"
          >
            <div className="w-full py-4 px-5 bg-[#141318] rounded-2xl flex justify-between items-center hover:bg-[#1c1b22] transition-all duration-200 ease-in-out cursor-pointer mb-4">
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
                    {project.description}
                  </p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="text-[var(--background)] flex gap-2 py-2 px-4 rounded-lg bg-[#101014]">
                  <FileBox className="w-5!" strokeWidth={1.5} />
                  {project.tasks ? project.tasks.length : 0}
                </div>
                <div className="text-[var(--background)]/50 flex gap-2 py-2 px-4 rounded-lg bg-[#101014]">
                  <Clock className="w-5!" strokeWidth={1.5} />
                  {formatToMonthDayTime(project.createdAt ?? "")}
                </div>
                <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale dark">
                  {project.tasks &&
                    project.tasks[0]?.reviewers &&
                    project.tasks[0].reviewers[0] && (
                      <Avatar>
                        <AvatarImage
                          src={
                            project.tasks[0].reviewers[0].avatarUrl || undefined
                          }
                          alt={project.tasks[0].reviewers[0].name || "Reviewer"}
                        />
                        <AvatarFallback>
                          {project.tasks[0].reviewers[0].name?.slice(0, 2) ||
                            "R"}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  {project.tasks && project.tasks[0]?.assignedTo && (
                    <Avatar>
                      <AvatarImage
                        src={project.tasks[0].assignedTo.avatarUrl || undefined}
                        alt={project.tasks[0].assignedTo.name || "Assigned"}
                      />
                      <AvatarFallback>
                        {project.tasks[0].assignedTo.name?.slice(0, 2) || "A"}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  {project.tasks && project.tasks[1]?.assignedTo && (
                    <Avatar>
                      <AvatarImage
                        src={project.tasks[1].assignedTo.avatarUrl || undefined}
                        alt={project.tasks[1].assignedTo.name || "Assigned"}
                      />
                      <AvatarFallback>
                        {project.tasks[1].assignedTo.name?.slice(0, 2) || "A"}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
