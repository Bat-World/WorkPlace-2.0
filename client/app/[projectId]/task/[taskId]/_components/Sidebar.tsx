"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";
import ReviewersSection from "./sidebar/ReviewersSection";
import AssigneeSection from "./sidebar/AssigneeSection";
import LabelsSection from "./sidebar/LabelsSection";
import DueDateSection from "./sidebar/DueDateSection";
import ActionButtons from "./sidebar/ActionButtons";
import { useSidebarLogic } from "./hooks/useSidebarLogic";
import SidebarSkeleton from "@/components/Skeletons/SidebarSkeleton";

const Sidebar = () => {
  const {
    task,
    members,
    labels,
    setLabels,
    dueDate,
    setDueDate,
    selectedReviewers,
    setSelectedReviewers,
    selectedAssignees,
    setSelectedAssignees,
    setIsUserUpdating,
    userHasChangedReviewers,
    userHasChangedAssignees,
    isCurrentUserAdmin,
    canApprove,
  } = useSidebarLogic();

  if (!task) {
    return (
      <div className="w-3/14 flex flex-col">
        <SidebarSkeleton />
      </div>
    );
  }

  return (
    <div className="w-3/14 flex flex-col">
      <div className="w-full h-auto rounded-3xl bg-[#141318] border border-[#3D3C41] flex flex-col p-6">
        <ReviewersSection
          task={task}
          members={members}
          selectedReviewers={selectedReviewers}
          onReviewersChange={setSelectedReviewers}
          setIsUserUpdating={setIsUserUpdating}
          userHasChangedReviewers={userHasChangedReviewers}
        />

        <Separator className="my-5 dark" />

        <AssigneeSection
          task={task}
          members={members}
          selectedAssignees={selectedAssignees}
          onAssigneesChange={setSelectedAssignees}
          setIsUserUpdating={setIsUserUpdating}
          userHasChangedAssignees={userHasChangedAssignees}
        />

        <Separator className="my-5 dark" />

        <LabelsSection task={task} labels={labels} onLabelsChange={setLabels} />

        <Separator className="my-5 dark" />

        <DueDateSection
          task={task}
          dueDate={dueDate}
          onDueDateChange={setDueDate}
        />
      </div>

      <ActionButtons
        task={task}
        canApprove={canApprove || false}
        isCurrentUserAdmin={isCurrentUserAdmin || false}
      />
    </div>
  );
};

export default Sidebar;
