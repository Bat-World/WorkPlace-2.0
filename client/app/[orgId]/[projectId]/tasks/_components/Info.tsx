"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useGetMembersByOrgId } from "@/hooks/project/useGetMembersByOrgId";
import { useGetProjectById } from "@/hooks/project/useGetProjectById";
import { TaskFormDialog } from "./TaskFormDialog";

export default function ProjectHeader() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const params = useParams();
  const orgId = params?.orgId as string;
  const projectId = params?.projectId as string;
  const { data: members = [] } = useGetMembersByOrgId(orgId);
  const { data: project, isLoading: isProjectLoading } = useGetProjectById({
    projectId,
  });

  return (
    <div className="w-full mt-10 flex justify-between items-center">
      <div className="flex flex-col">
        <p className="text-start text-[var(--background)] text-3xl font-semibold mt-1">
          {isProjectLoading ? "..." : project?.title || "Project title"}
        </p>
      </div>
      <div className="flex justify-end gap-6">
        <div className="flex -space-x-2">
          {members.slice(0, 3).map((m: any) => (
            <div
              key={m.id}
              className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center"
            >
              {m.name?.slice(0, 2) || m.email?.slice(0, 2)}
            </div>
          ))}
        </div>
        <TaskFormDialog
          open={dialogOpen}
          setOpen={setDialogOpen}
          orgId={orgId}
        />
      </div>
    </div>
  );
}
