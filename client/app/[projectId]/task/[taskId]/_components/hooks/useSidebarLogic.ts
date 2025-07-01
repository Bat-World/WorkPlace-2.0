import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useGetTaskById } from "@/hooks/task/useGetTaskById";
import { useGetProjectMembers } from "@/hooks/project/useGetProjectMembers";
import { useUser } from "@clerk/nextjs";

export const useSidebarLogic = () => {
  const params = useParams();
  const taskId = params.taskId as string;
  const projectId = params.projectId as string;

  const { data: task } = useGetTaskById(taskId);
  const { data: members = [] } = useGetProjectMembers(projectId);
  const { user } = useUser();

  const [labels, setLabels] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [selectedReviewers, setSelectedReviewers] = useState<string[]>([]);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [isUserUpdating, setIsUserUpdating] = useState(false);
  
  // Use refs to track if user has made changes
  const userHasChangedReviewers = useRef(false);
  const userHasChangedAssignees = useRef(false);

  // Initialize data from task
  useEffect(() => {
    if (task) {
      console.log('Task data updated, isUserUpdating:', isUserUpdating);
      
      // Set labels from task
      if (task.labels && task.labels.length > 0) {
        const taskLabels = task.labels.map((label: any) => label.name);
        setLabels(taskLabels);
      }

      // Set due date from task
      if (task.dueDate) {
        try {
          let taskDueDate: Date;
          
          // Handle different date formats
          if (typeof task.dueDate === 'number') {
            // If it's a number (Unix timestamp), convert it
            if (task.dueDate < 10000000000) {
              // It's in seconds, convert to milliseconds
              taskDueDate = new Date(task.dueDate * 1000);
            } else {
              // It's already in milliseconds
              taskDueDate = new Date(task.dueDate);
            }
          } else if (typeof task.dueDate === 'string') {
            // If it's a string, try to parse it
            const parsed = parseInt(task.dueDate);
            if (!isNaN(parsed)) {
              // It's a numeric string (timestamp)
              if (parsed < 10000000000) {
                taskDueDate = new Date(parsed * 1000);
              } else {
                taskDueDate = new Date(parsed);
              }
            } else {
              // It's a regular date string
              taskDueDate = new Date(task.dueDate);
            }
          } else {
            taskDueDate = new Date(task.dueDate);
          }
          
          // Check if the date is valid
          if (!isNaN(taskDueDate.getTime())) {
            setDueDate(taskDueDate);
          } else {
            console.error('Invalid due date after parsing:', task.dueDate);
            setDueDate(undefined);
          }
        } catch (error) {
          console.error('Invalid due date:', task.dueDate, error);
          setDueDate(undefined);
        }
      } else {
        setDueDate(undefined);
      }

      // Only update assignees/reviewers if user hasn't made changes
      if (!userHasChangedReviewers.current) {
        console.log('Updating reviewers from task data');
        // Set reviewers from task
        if (task.reviewers && task.reviewers.length > 0) {
          const reviewerIds = task.reviewers.map((reviewer: any) => reviewer.id);
          setSelectedReviewers(reviewerIds);
        } else {
          setSelectedReviewers([]);
        }
      } else {
        console.log('Skipping reviewers update - user has made changes');
      }

      if (!userHasChangedAssignees.current) {
        console.log('Updating assignees from task data');
        // Set assignees from task
        if (task.assignees && task.assignees.length > 0) {
          const assigneeIds = task.assignees.map((assignee: any) => assignee.id);
          setSelectedAssignees(assigneeIds);
        } else {
          setSelectedAssignees([]);
        }
      } else {
        console.log('Skipping assignees update - user has made changes');
      }
    }
  }, [task]);

  // Check if current user is ADMIN and reviewer
  const currentUser = members.find((m) => m.user.id === user?.id);
  const isCurrentUserAdmin = currentUser?.role === "ADMIN";
  const isCurrentUserReviewer = task?.reviewers?.some(
    (r: any) => r.id === user?.id
  );
  const canApprove =
    (isCurrentUserAdmin || isCurrentUserReviewer) &&
    (task?.status === "REVIEW" || task?.status === "DOING");

  return {
    task,
    members,
    user,
    labels,
    setLabels,
    dueDate,
    setDueDate,
    selectedReviewers,
    setSelectedReviewers,
    selectedAssignees,
    setSelectedAssignees,
    isUserUpdating,
    setIsUserUpdating,
    userHasChangedReviewers,
    userHasChangedAssignees,
    isCurrentUserAdmin,
    canApprove,
  };
}; 