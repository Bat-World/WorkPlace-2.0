'use client';

import { useParams } from "next/navigation";
import { useGetDashboardStats } from "@/hooks/project/useGetDashboardStats";
import { useGetReviewTasksByProject } from "@/hooks/project/useGetReviewTasksByProject";
import { useGetProjectById } from "@/hooks/project/useGetProjectById";
import { DashboardStatsCards } from "./_components/StatsCards";
import ClosedTasksAreaChart from "./_components/Chart";
import ReviewTasksCard from "./_components/TasksToReview";
import DashboardSkeleton from "./_components/Skeleton";
import { Lock } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { Projects } from "@/app/projects/_components/Projects";


export default function DashboardPage() {
  const { projectId } = useParams() as { projectId: string };
  const { data: statsData, isPending: isStatsLoading } = useGetDashboardStats(projectId);
  const { data: reviewData, isPending: isReviewLoading } = useGetReviewTasksByProject(projectId);
  const { data: projectData, isLoading: isProjectLoading } = useGetProjectById({ projectId });
  const user = useUser();

  const isLoading = isStatsLoading || isReviewLoading;
  const isAdmin = projectData?.createdBy?.id === user.user?.id;


  if (isLoading) {
    return (
      <div className="w-full px-6 pt-6">
        <div className="w-full min-w-[1290px] max-w-[1290px] mx-auto">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

if (!isAdmin) {
  return <Projects />;
}

  return (
    <div className="w-full px-6">
      <div className="w-full min-w-[1290px] max-w-[1290px] mx-auto">
        <div className="mt-6">
          <div className="text-[16px] font-light mb-2 text-muted-foreground">
            Өдрийн мэнд,{" "}
            <span className="font-normal tracking-wide">
              {user.user?.firstName || "Хэрэглэгч"} 👋
            </span>
          </div>
          <div className="flex items-center gap-4">
            <h2 className="text-white text-[40px] font-medium leading-none">
              Төслийн хураангуй
            </h2>
            <div className="px-3 py-1 rounded-full bg-[#292A37] text-white text-sm flex items-center gap-2 h-[33px]">
              <Lock className="w-4 h-4 text-white" />
              <span className="text-xs">Админ-д харагдана</span>
            </div>
          </div>
        </div>

        <DashboardStatsCards
          totalTasks={statsData.totalTasks}
          inProgressTasks={statsData.inProgressTasks}
          reviewReadyTasks={statsData.reviewReadyTasks}
          doneTasks={statsData.doneTasks}
        />

        <div className="overflow-x-auto">
          <div className="mt-6 grid grid-cols-[850px_416px] gap-[24px] justify-center">
            <ClosedTasksAreaChart />
            <ReviewTasksCard />
          </div>
        </div>
      </div>
    </div>
  );
}
