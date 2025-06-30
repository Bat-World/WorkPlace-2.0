'use client';

import { useParams } from "next/navigation";
import { useGetDashboardStats } from "@/hooks/project/useGetDashboardStats";
import { useGetReviewTasksByProject } from "@/hooks/project/useGetReviewTasksByProject";
import { DashboardStatsCards } from "./_components/StatsCards";
import ClosedTasksAreaChart from "./_components/Chart";
import ReviewTasksCard from "./_components/TasksToReview";
import DashboardSkeleton from "./_components/Skeleton";

export default function DashboardPage() {
  const { projectId } = useParams() as { projectId: string };

  const { data: statsData, isPending: isStatsLoading } = useGetDashboardStats(projectId);
  const { data: reviewData, isPending: isReviewLoading } = useGetReviewTasksByProject(projectId);

  const isLoading = isStatsLoading || isReviewLoading;

  return (
    <div className="w-full px-6 flex justify-center">
      <div className="max-w-6xl w-full">
        <h2 className="text-white text-2xl font-semibold mt-6">Dashboard Overview</h2>

        {isLoading ? (
          <DashboardSkeleton />
        ) : (
          <>
            <DashboardStatsCards
              totalTasks={statsData.totalTasks}
              inProgressTasks={statsData.inProgressTasks}
              reviewReadyTasks={statsData.reviewReadyTasks}
            />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
              <div className="col-span-1 xl:col-span-2">
                <ClosedTasksAreaChart />
              </div>
              <div className="col-span-1">
                <ReviewTasksCard />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
