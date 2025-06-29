"use client";

import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useGetTaskById } from "@/hooks/task/useGetTaskById";
import { useParams } from "next/navigation";

const Header = () => {
  const params = useParams();
  const taskId = params.taskId as string;
  const { data: task } = useGetTaskById(taskId);

  const getStatusText = () => {
    if (!task) return "Нээлттэй таск";

    switch (task.status) {
      case "DONE":
        return "Дууссан таск";
      case "APPROVED":
        return "Хаагдсан таск";
      default:
        return "Нээлттэй таск";
    }
  };

  const getStatusColor = () => {
    if (!task) return "bg-[#0A8451]";

    switch (task.status) {
      case "DONE":
        return "bg-[#0A8451] hover:bg-[#0A8451]";
      case "APPROVED":
        return "bg-[#F9D769] hover:bg-[#F9D769] text-black";
      default:
        return "bg-[#0A8451] hover:bg-[#0A8451]";
    }
  };

  return (
    <div className="flex gap-5 items-end">
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
              <BreadcrumbLink asChild>
                <Link href="/">Swipe</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Projects</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center justify-start gap-6 mt-5">
          <p className="text-start text-[var(--background)] text-3xl font-semibold mt-1">
            {task?.title || (
              <Skeleton className="h-10 w-50 bg-gray-400 rounded-xl" />
            )}
          </p>
          <Button
            className={`text-[var(--background)] rounded-full hover:opacity-90 ${getStatusColor()}`}
          >
            {getStatusText()}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
