import React from "react";
import { useParams } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CreateTaskDialog from "./CreateTaskDialog";
import { useGetProjectMembers } from "@/hooks/project/useGetProjectMembers";

interface InfoProps {
  projectName: string;
}

const Info = ({ projectName }: InfoProps) => {
  const params = useParams();
  const projectId = params.projectId as string;
  const { data: members, isLoading } = useGetProjectMembers(projectId);
  return (
    <div className="w-full mt-10 flex justify-between items-center">
      <div className="flex flex-col">
        <Breadcrumb className="dark" />
        <p className="text-start text-[var(--background)] text-3xl font-semibold mt-1">
          {projectName}
        </p>
      </div>
      <div className="flex justify-end gap-6">
        <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale dark">
          {isLoading ? (
            <>
              <Avatar>
                <AvatarFallback className="animate-pulse bg-gray-300">
                  ...
                </AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback className="animate-pulse bg-gray-300">
                  ...
                </AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback className="animate-pulse bg-gray-300">
                  ...
                </AvatarFallback>
              </Avatar>
            </>
          ) : (
            members?.slice(0, 5).map((member) => (
              <Avatar key={member.id}>
                <AvatarImage
                  src={member.user.avatarUrl || undefined}
                  alt={member.user.name || member.user.email}
                />
                <AvatarFallback>
                  {member.user.name
                    ? member.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    : member.user.email.split("@")[0].toUpperCase().slice(0, 2)}
                </AvatarFallback>
              </Avatar>
            ))
          )}
        </div>
        <CreateTaskDialog />
      </div>
    </div>
  );
};

export default Info;
