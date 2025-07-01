'use client';

import { useParams } from "next/navigation";
import { useGetReviewTasksByProject } from "@/hooks/project/useGetReviewTasksByProject";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";

export default function ReviewTasksCard() {
  const { projectId } = useParams();
  const { data: tasks, isLoading, error } = useGetReviewTasksByProject(projectId as string);

  return (
    <div className="bg-[#141318] rounded-2xl p-4 w-full max-w-[420px] shadow-md border border-[#2A2A2A]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="bg-[#F9D769] rounded-full w-2 h-2" />
          <div className="text-white text-lg font-semibold leading-[22px]">
            Шалгуулах бэлэн таскууд
          </div>
        </div>
        <div className="text-white text-xl">•••</div>
      </div>

      {isLoading && <p className="text-muted-foreground text-sm">Loading...</p>}
      {error && <p className="text-red-500 text-sm">Failed to load tasks</p>}

      <div className="space-y-5">
        {tasks?.map((task: any) => {
          const shortDescription = task.description
            ?.split(" ")
            .slice(0, 3)
            .join(" ") + (task.description?.split(" ").length > 3 ? "..." : "");

          return (
            <div
              key={task.id}
              className="bg-[#1c1b22] p-5 rounded-2xl border border-transparent hover:border-[#4085ff] transition-all duration-200"
              style={{ height: 117 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-white text-[16px] font-semibold leading-[22px] truncate max-w-[200px]">
                    {task.title}
                  </div>
                  <p className="text-sm text-white/60 truncate max-w-[240px] mt-0.5 leading-[20px]">
                    {shortDescription}
                  </p>
                </div>

                <div className="flex gap-2">
                  {task.labels?.slice(0, 1).map((label: any) => (
                    <Badge
                      key={label.id}
                      variant="outline"
                      style={{ backgroundColor: label.color || '#292932' }}
                      className="text-xs font-medium px-3 py-1 rounded-full border-none text-white bg-[#292932]"
                    >
                      {label.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex justify-between items-center">
                <div className="flex items-center text-white/60 text-sm gap-2">
                  <CalendarDays className="w-4 h-4" />
                  <span>
                    {new Date(Number(task.createdAt)).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex gap-1">
                  {task.assignees?.slice(0, 1).map((user: any, index: number) => (
                    <img
                      key={`assignee-${index}`}
                      src={user.avatarUrl}
                      alt="Assignee"
                      className="w-6 h-6 rounded-full object-cover -ml-2 first:ml-0"
                      title="Assignee"
                    />
                  ))}
                  {task.reviewers?.slice(0, 1).map((user: any, index: number) => (
                    <img
                      key={`reviewer-${index}`}
                      src={user.avatarUrl}
                      alt="Reviewer"
                      className="w-6 h-6 rounded-full object-cover -ml-2 first:ml-0"
                      title={user.name}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
