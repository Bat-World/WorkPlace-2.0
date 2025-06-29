import React from "react";
import { Button } from "@/components/ui/button";
import { Check, BookmarkX } from "lucide-react";
import { useApproveTask } from "@/hooks/task/useApproveTask";

interface ActionButtonsProps {
  task: any;
  canApprove: boolean;
  isCurrentUserAdmin: boolean;
}

const ActionButtons = ({ task, canApprove, isCurrentUserAdmin }: ActionButtonsProps) => {
  const approveTaskMutation = useApproveTask();

  const handleApproveTask = async () => {
    try {
      await approveTaskMutation.mutateAsync({ taskId: task.id });
    } catch (error) {
      console.error("Failed to approve task:", error);
    }
  };

  return (
    <>
      {canApprove && (
        <Button
          onClick={handleApproveTask}
          disabled={approveTaskMutation.isPending}
          variant="secondary"
          className="mt-5 py-6 rounded-lg text-[var(--background)]"
        >
          <Check
            strokeWidth={2}
            className="stroke-[var(--background)] w-5! h-5!"
          />
          {approveTaskMutation.isPending ? "Батлаж байна..." : "Таскыг батлах"}
        </Button>
      )}

      <Button className="mt-5 py-5 bg-[#1D1B22] border border-[#3D3C41] hover:bg-[#232029] rounded-lg">
        <BookmarkX strokeWidth={1.5} className="stroke-[#EA3E3E] w-5! h-5!" />
        Таскыг хаах
      </Button>
    </>
  );
};

export default ActionButtons; 