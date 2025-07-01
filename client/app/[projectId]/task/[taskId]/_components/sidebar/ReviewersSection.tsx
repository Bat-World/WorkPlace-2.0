import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, Check } from "lucide-react";
import { useManageReviewers } from "@/hooks/task/useManageReviewers";

interface ReviewersSectionProps {
  task: any;
  members: any[];
  selectedReviewers: string[];
  onReviewersChange: (reviewerIds: string[]) => void;
  setIsUserUpdating: (updating: boolean) => void;
  userHasChangedReviewers: React.MutableRefObject<boolean>;
}

const ReviewersSection = ({
  task,
  members,
  selectedReviewers,
  onReviewersChange,
  setIsUserUpdating,
  userHasChangedReviewers,
}: ReviewersSectionProps) => {
  const manageReviewersMutation = useManageReviewers();

  const handleReviewerChange = async (reviewerId: string, checked: boolean) => {
    let newReviewers: string[];
    
    if (checked) {
      // Add reviewer
      newReviewers = [...selectedReviewers, reviewerId];
    } else {
      // Remove reviewer
      newReviewers = selectedReviewers.filter(id => id !== reviewerId);
    }
    
    console.log('Setting isUserUpdating to true');
    // Set flag to prevent task data from overwriting local state
    setIsUserUpdating(true);
    userHasChangedReviewers.current = true;
    
    // Update local state immediately for instant UI feedback
    onReviewersChange(newReviewers);
    
    try {
      await manageReviewersMutation.mutateAsync({
        taskId: task.id,
        reviewerIds: newReviewers,
        members,
      });
      console.log('Setting isUserUpdating to false (success)');
      // Only reset flag after successful mutation
      setIsUserUpdating(false);
    } catch (error) {
      console.error("Failed to update reviewers:", error);
      // Revert local state on error
      onReviewersChange(selectedReviewers);
      console.log('Setting isUserUpdating to false (error)');
      // Reset flag on error too
      setIsUserUpdating(false);
      userHasChangedReviewers.current = false;
    }
  };

  const handleClearAll = async () => {
    // Set flag to prevent task data from overwriting local state
    setIsUserUpdating(true);
    userHasChangedReviewers.current = true;
    
    // Update local state immediately for instant UI feedback
    onReviewersChange([]);
    
    try {
      await manageReviewersMutation.mutateAsync({
        taskId: task.id,
        reviewerIds: [],
        members,
      });
      // Only reset flag after successful mutation
      setIsUserUpdating(false);
    } catch (error) {
      console.error("Failed to clear reviewers:", error);
      // Revert local state on error
      onReviewersChange(selectedReviewers);
      // Reset flag on error too
      setIsUserUpdating(false);
      userHasChangedReviewers.current = false;
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-[var(--background)]/50 text-sm">Шалгагч</p>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Ellipsis className="stroke-[var(--background)]/50 w-5 cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="dark bg-black/10 backdrop-blur-sm rounded-2xl">
            <DropdownMenuLabel>Шалгагч</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={selectedReviewers.length === 0}
              onCheckedChange={(checked) => {
                if (checked) {
                  handleClearAll();
                }
              }}
            >
              Хоосон
            </DropdownMenuCheckboxItem>
            {members.map((member) => (
              <DropdownMenuCheckboxItem
                key={member.id}
                checked={selectedReviewers.includes(member.user.id)}
                onCheckedChange={(checked) => handleReviewerChange(member.user.id, checked)}
              >
                <span className="flex items-center gap-2">
                  {member.user.avatarUrl && (
                    <img
                      src={member.user.avatarUrl}
                      alt={member.user.name || member.user.email}
                      className="w-5 h-5 rounded-full"
                    />
                  )}
                  {member.user.name || member.user.email}
                </span>
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {task?.reviewers && task.reviewers.length > 0 ? (
        <div className="mt-3 space-y-2">
          {task.reviewers.map((reviewer: any) => {
            const isApproved = task?.status === "APPROVED";
            return (
              <div key={reviewer.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-7 h-auto aspect-square">
                    <AvatarImage
                      src={reviewer.avatarUrl}
                      alt={reviewer.name || reviewer.email}
                    />
                    <AvatarFallback>
                      {(reviewer.name || reviewer.email || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-[var(--background)] text-sm">
                    {reviewer.name || reviewer.email}
                  </p>
                </div>
                <div className={`w-1.5 h-auto aspect-square rounded-full flex items-center justify-center ${
                  isApproved ? 'bg-[#2FC285]' : 'bg-[#F9D769]'
                }`}>
                  {isApproved && (
                    <Check className="w-1 h-1 text-white stroke-2" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center justify-between mt-3">
          <p className="text-[var(--background)]/30 text-sm">
            Хоосон байна
          </p>
        </div>
      )}
    </>
  );
};

export default ReviewersSection; 