"use client";

import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Eye, PencilRuler, Trash2 } from "lucide-react";
import { useDeleteTask } from "@/hooks/task/useDeleteTask";
import { toast } from "react-toastify";

type Checked = DropdownMenuCheckboxItemProps["checked"];

interface TaskActionProps {
  taskId: string;
}

export default function TaskAction({ taskId }: TaskActionProps) {
  const params = useParams();
  const projectId = params.projectId as string;
  const deleteTaskMutation = useDeleteTask();

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTaskMutation.mutateAsync(taskId);
        // No success toast - it's instant now!
      } catch (error: any) {
        console.error("Error deleting task:", error);
        toast.error("Таск устгахад алдаа гарлаа");
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <EllipsisVertical className="w-5 stroke-[var(--background)] cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-56 dark bg-black/10 backdrop-blur-lg rounded-2xl"
      >
        <DropdownMenuItem asChild>
          <Link href={`/${projectId}/task/${taskId}`}>
            <Eye />
            Үзэх
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="group focus:text-red-400 transition-all duration-200"
          onClick={handleDelete}
          disabled={deleteTaskMutation.isPending}
        >
          <Trash2 className="group-focus:stroke-red-400" />
          {deleteTaskMutation.isPending ? "Устгаж байна..." : "Устгах"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
