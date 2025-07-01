"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Upload } from "lucide-react";
import { useUpdateProjectAvatar } from "@/hooks/project/useUpdateProjectAvatar";
import { useMutation } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/nextjs";
import { sendRequest } from "@/lib/sendRequest";
import { toast } from "react-toastify";
import { uploadFileToCloudinary } from "@/utils/cloudinary";

interface ProjectProfileProps {
  currentProject: any;
  projectId: string;
  queryClient: any;
}

export const ProjectProfile = ({
  currentProject,
  projectId,
  queryClient,
}: ProjectProfileProps) => {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [isUploading, setIsUploading] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update local state when project data loads (only once)
  useEffect(() => {
    if (currentProject?.title && !isEditingName) {
      setProjectName(currentProject.title);
    }
  }, [currentProject?.title, isEditingName]);

  // Update project name mutation
  const updateProjectName = useMutation({
    mutationFn: async (newTitle: string) => {
      const token = await getToken();
      const userId = user?.id;
      if (!userId) throw new Error("User is not signed in");

      const res = await sendRequest.post(
        "/api/graphql",
        {
          query: `
            mutation UpdateProject($projectId: ID!, $title: String!) {
              updateProject(projectId: $projectId, title: $title) {
                id
                title
              }
            }
          `,
          variables: { projectId, title: newTitle },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-user-id": userId,
          },
        }
      );
      return res.data.data.updateProject;
    },
    onSuccess: () => {
      // Invalidate and refetch project data
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  // Avatar upload mutation
  const updateAvatar = useUpdateProjectAvatar();

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Upload file to Cloudinary
      const avatarUrl = await uploadFileToCloudinary(
        file,
        `project-${projectId}-avatar`
      );

      await updateAvatar.mutateAsync({ projectId, avatarUrl });

      // Invalidate and refetch project data
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });

      toast.success("Зураг амжилттай солигдлоо");
    } catch (error) {
      console.error("Error updating avatar:", error);
      toast.error("Алдаа гарлаа");
    } finally {
      setIsUploading(false);
      // Reset the input
      event.target.value = "";
    }
  };

  const handleSaveProjectName = async () => {
    if (!projectName.trim()) {
      toast.error("Төслийн нэр оруулна уу");
      return;
    }

    try {
      await updateProjectName.mutateAsync(projectName);
      setIsEditingName(false);
      toast.success("Төслийн нэр амжилттай солигдлоо");
    } catch (error) {
      console.error("Error updating project name:", error);
      toast.error("Алдаа гарлаа");
    }
  };

  const handleLeaveProject = () => {
    console.log("Амжилттай гаралаа");
  };

  return (
    <div className="flex flex-col w-full">
      <p className="text-[var(--foreground)] font-semibold text-xl">Ерөнхий</p>
      <Separator className="dark my-5" />
      <div className="flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <p className="text-[var(--foreground)] font-semibold text-sm w-40">
            Профайл
          </p>
          <div
            className="w-12 h-12 rounded-lg bg-cover bg-center"
            style={{
              backgroundImage: `url(${
                currentProject?.avatarUrl ||
                "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18xbHlXRFppb2JyNjAwQUtVZVFEb1NsckVtb00iLCJyaWQiOiJvcmdfMnlPbDNOWHdQV2tIQ25pM1VxSFhETVkzcnExIiwiaW5pdGlhbHMiOiI0In0?width=80"
              })`,
            }}
          />
          <p className="text-[var(--foreground)] font-semibold text-sm">
            {currentProject?.title || "Loading..."}
          </p>
        </div>
        <div className="flex gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="hidden"
            id="avatar-upload"
            disabled={isUploading}
          />
          <Button
            className="bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 text-[var(--foreground)]"
            disabled={isUploading}
            type="button"
            onClick={() => document.getElementById("avatar-upload")?.click()}
          >
            <Upload className="w-4" />
            {isUploading ? "Оруулж байна..." : "Зураг оруулах"}
          </Button>
        </div>
      </div>
      <Separator className="dark my-8" />
      <div className="flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <p className="text-[var(--foreground)] font-semibold text-sm w-40">
            Төслийн нэр
          </p>
          {isEditingName ? (
            <Input
              ref={inputRef}
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-56 text-[var(--foreground)] bg-transparent border-[var(--foreground)]/20"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSaveProjectName();
                } else if (e.key === "Escape") {
                  setIsEditingName(false);
                  setProjectName(currentProject?.title || "");
                }
              }}
              autoFocus
            />
          ) : (
            <p className="text-[var(--foreground)] font-semibold text-sm w-56">
              {currentProject?.title || "Loading..."}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {isEditingName ? (
            <>
              <Button
                onClick={handleSaveProjectName}
                className="bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 text-[var(--foreground)]"
                disabled={updateProjectName.isPending}
              >
                {updateProjectName.isPending ? "Saving..." : "Хадгалах"}
              </Button>
              <Button
                onClick={() => {
                  setIsEditingName(false);
                  setProjectName(currentProject?.title || "");
                }}
                className="bg-[var(--foreground)]/0 hover:bg-[var(--foreground)]/5 text-[var(--foreground)]"
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditingName(true)}
              className="bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 text-[var(--foreground)]"
            >
              Edit
            </Button>
          )}
        </div>
      </div>
      <Separator className="dark my-8" />
      <div className="flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <p className="text-[var(--foreground)] font-semibold text-sm w-40">
            Төслөөс гарах
          </p>
          <Button
            onClick={handleLeaveProject}
            className="bg-[var(--foreground)]/0 hover:bg-[var(--foreground)]/5 text-[var(--destructive)]"
          >
            Төслөөс гарах
          </Button>
        </div>
      </div>
    </div>
  );
};
