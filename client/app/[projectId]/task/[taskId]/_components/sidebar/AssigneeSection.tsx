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
import { useManageAssignees } from "@/hooks/task/useManageAssignees";

interface AssigneeSectionProps {
  task: any;
  members: any[];
  selectedAssignees: string[];
  onAssigneesChange: (assigneeIds: string[]) => void;
  setIsUserUpdating: (updating: boolean) => void;
  userHasChangedAssignees: React.MutableRefObject<boolean>;
}

const AssigneeSection = ({
  task,
  members,
  selectedAssignees,
  onAssigneesChange,
  setIsUserUpdating,
  userHasChangedAssignees,
}: AssigneeSectionProps) => {
  const manageAssigneesMutation = useManageAssignees();

  const handleAssigneeChange = async (assigneeId: string, checked: boolean) => {
    let newAssignees: string[];

    if (checked) {
      // Add assignee
      newAssignees = [...selectedAssignees, assigneeId];
    } else {
      // Remove assignee
      newAssignees = selectedAssignees.filter((id) => id !== assigneeId);
    }

    // Set flag to prevent task data from overwriting local state
    setIsUserUpdating(true);
    userHasChangedAssignees.current = true;

    // Update local state immediately for instant UI feedback
    onAssigneesChange(newAssignees);

    try {
      await manageAssigneesMutation.mutateAsync({
        taskId: task.id,
        assigneeIds: newAssignees,
      });
      // Only reset flag after successful mutation
      setIsUserUpdating(false);
    } catch (error) {
      console.error("Failed to update assignees:", error);
      // Revert local state on error
      onAssigneesChange(selectedAssignees);
      // Reset flag on error too
      setIsUserUpdating(false);
      userHasChangedAssignees.current = false;
    }
  };

  const handleClearAll = async () => {
    // Set flag to prevent task data from overwriting local state
    setIsUserUpdating(true);
    userHasChangedAssignees.current = true;

    // Update local state immediately for instant UI feedback
    onAssigneesChange([]);

    try {
      await manageAssigneesMutation.mutateAsync({
        taskId: task.id,
        assigneeIds: [],
      });
      // Only reset flag after successful mutation
      setIsUserUpdating(false);
    } catch (error) {
      console.error("Failed to clear assignees:", error);
      // Revert local state on error
      onAssigneesChange(selectedAssignees);
      // Reset flag on error too
      setIsUserUpdating(false);
      userHasChangedAssignees.current = false;
    }
  };

  const getCurrentAssignees = () => {
    return members.filter((m) => selectedAssignees.includes(m.user?.id));
  };

  const currentAssignees = getCurrentAssignees();

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-[var(--background)]/50 text-sm">Гүйцэтгэгч</p>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Ellipsis className="stroke-[var(--background)]/50 w-5 cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="dark bg-black/10 backdrop-blur-sm rounded-2xl">
            <DropdownMenuLabel>Гүйцэтгэгч</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={selectedAssignees.length === 0}
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
                checked={selectedAssignees.includes(member.user.id)}
                onCheckedChange={(checked) =>
                  handleAssigneeChange(member.user.id, checked)
                }
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
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-3">
          {currentAssignees.length > 0 ? (
            <div className="flex flex-col gap-2">
              {currentAssignees.map((member) => (
                <div key={member.id} className="flex items-center gap-2">
                  <Avatar className="w-7 h-auto aspect-square">
                    <AvatarImage
                      src={member.user.avatarUrl}
                      alt={member.user.name || member.user.email}
                    />
                    <AvatarFallback>
                      {(member.user.name || member.user.email || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-[var(--background)] text-sm">
                    {member.user.name || member.user.email}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[var(--background)]/30 text-sm">Хоосон байна.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default AssigneeSection;
