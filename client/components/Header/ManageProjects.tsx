"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Building, UserRound, Settings, Upload } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetProjectById } from "@/hooks/project/useGetProjectById";
import { useUpdateProjectAvatar } from "@/hooks/project/useUpdateProjectAvatar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/nextjs";
import { sendRequest } from "@/lib/sendRequest";
import { toast } from "react-toastify";
import { uploadFileToCloudinary } from "@/utils/cloudinary";
import { ProjectProfile } from "./ProjectProfile";
import { ProjectMembers } from "./ProjectMembers";

export default function ManageProjects() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { user } = useUser();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("general");

  // Get current project data
  const {
    data: currentProject,
    isLoading,
    error,
  } = useGetProjectById({
    projectId,
    skip: 0,
    take: 10,
  });

  if (isLoading) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <div className="flex gap-1 items-center px-2 py-1 border-1 border-[#2A2A2A] rounded-lg text-[var(--foreground)]/50 hover:text-[var(--foreground)] transition-all group cursor-pointer">
            <Settings className="group-hover:stroke-[var(--foreground)] w-[14px]! transition-all" />
            <p className="text-sm tracking-normal font-medium">Хянах</p>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-4xl h-[45rem] dark rounded-3xl bg-[#141318] border-none flex">
          <div className="w-full flex items-center justify-center">
            <p className="text-[var(--foreground)]">Loading project data...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex gap-1 items-center px-2 py-1 border-1 border-[#2A2A2A] rounded-lg text-[var(--foreground)]/50 hover:text-[var(--foreground)] transition-all group cursor-pointer">
          <Settings className="group-hover:stroke-[var(--foreground)] w-[14px]! transition-all" />
          <p className="text-sm tracking-normal font-medium">Хянах</p>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl h-[45rem] dark rounded-3xl bg-[#141318] border-none flex">
        <div className="w-3/12 h-full flex flex-col p-2">
          <p className="text-[var(--foreground)] text-2xl font-semibold">
            Projects
          </p>
          <p className="text-[var(--foreground)]/50 text-sm mt-1">
            Manage your projects
          </p>
          <div className="w-full flex flex-col gap-2 mt-10">
            <div
              className={`flex w-full px-3 py-1 rounded-lg justify-start items-center cursor-pointer transition-colors ${
                activeTab === "general"
                  ? "bg-[var(--foreground)]/10"
                  : "hover:bg-[var(--foreground)]/5"
              }`}
              onClick={() => setActiveTab("general")}
            >
              <p className="text-[var(--foreground)] text-sm flex items-center gap-2">
                <Building className="w-4" />
                Профайл
              </p>
            </div>
            <div
              className={`flex w-full px-3 py-1 rounded-lg justify-start items-center cursor-pointer transition-colors ${
                activeTab === "members"
                  ? "bg-[var(--foreground)]/10"
                  : "hover:bg-[var(--foreground)]/5"
              }`}
              onClick={() => setActiveTab("members")}
            >
              <p className="text-[var(--foreground)] text-sm flex items-center gap-2">
                <UserRound className="w-4" />
                Гишүүд
              </p>
            </div>
          </div>
        </div>
        <div className="w-9/12 h-full p-6">
          {activeTab === "general" && (
            <ProjectProfile
              currentProject={currentProject}
              projectId={projectId}
              queryClient={queryClient}
            />
          )}

          {activeTab === "members" && (
            <ProjectMembers
              currentProject={currentProject}
              projectId={projectId}
              queryClient={queryClient}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
