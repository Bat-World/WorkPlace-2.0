import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { EllipsisVertical, MessageCircleMore, User } from "lucide-react";
import { Paperclip } from "lucide-react";
import type { KanbanTask } from "@/lib/taskUtils";
import { formatDate } from "@/utils/DateFormatter";
import TaskAction from "./TaskAction";
import { formatTaskDate } from "@/utils/TaskDateFormatter";

const getPriorityText = (priority: string): string => {
  switch (priority) {
    case "high":
      return "Яаралтай";
    case "medium":
      return "Чухал";
    case "low":
      return "Энгийн";
    default:
      return priority;
  }
};

const getPriorityStyles = (priority: string): string => {
  switch (priority) {
    case "high":
      return "bg-[#450B2B] border border-[#5A2241] text-[#FCC3EC]";
    case "medium":
      return "bg-[#201302] border border-[#372B15] text-[#F9D769]";
    case "low":
      return "bg-[#191C45] border border-[#32316B] text-[#B5BFF3]";
    default:
      return "bg-[#272A33] text-[var(--background)]";
  }
};

const SortableItem = React.memo(
  ({
    task,
    index,
    isNew = false,
    isDragDisabled = false,
  }: {
    task: KanbanTask | undefined;
    index: number;
    isNew?: boolean;
    isDragDisabled?: boolean;
  }) => {
    if (!task) {
      return null;
    }

    const priorityText = getPriorityText(task.priority);
    const priorityStyles = getPriorityStyles(task.priority);

    return (
      <Draggable draggableId={task.id} index={index} isDragDisabled={isDragDisabled}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`bg-[#141318] rounded-3xl shadow p-5 mb-3 border border-[#3D3C41] select-none duration-0 ${
              snapshot.isDragging ? "ring-2 ring-blue-400" : ""
            } ${isNew ? "animate-fade-in scale-95 opacity-0" : ""}`}
          >
            <div className="w-full flex mb-3 items-center justify-between">
              <div className="flex gap-2">
                <span
                  className={`text-xs rounded-full px-3 py-1.5 ${priorityStyles}`}
                >
                  {priorityText}
                </span>
                {task.labels.slice(0, 2).map((label) => (
                  <span
                    key={label.id}
                    className="text-xs rounded-full px-3 py-1.5 bg-[#272A33] text-[var(--background)]"
                    style={{
                      backgroundColor: label.color + "20",
                      border: `1px solid ${label.color}`,
                      color: label.color,
                    }}
                  >
                    {label.name}
                  </span>
                ))}
              </div>
              <TaskAction taskId={task.id} />
            </div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-lg font-semibold text-[var(--background)]">
                {task.title}
              </span>
            </div>
            <div className="text-sm font-light text-[var(--background)]/50 mb-2">
              {task.description}
            </div>
            {task.dueDate && (
              <div className="text-xs font-light text-[var(--background)]/50 mb-2">
                {formatTaskDate(task.dueDate)}
              </div>
            )}
            <div className="flex items-center gap-4 mt-3">
              <span className="text-sm text-[var(--background)] flex items-center gap-1.5">
                <Paperclip className="w-4" /> {task.comments}
              </span>
              <span className="text-sm text-[var(--background)] flex items-center gap-1.5">
                <MessageCircleMore className="w-4" /> {task.attachments}
              </span>
              <div className="flex -space-x-2 ml-auto">
                {task.assignees.map((a) => (
                  <span
                    key={a.id}
                    className=" w-8 h-auto aspect-square rounded-full bg-gray-200 border-2 border-[#141318] flex items-center justify-center text-xs text-gray-600"
                    title={a.name}
                  >
                    {a.avatarUrl ? (
                      <img
                        src={a.avatarUrl}
                        alt={a.name}
                        className="w-full h-full rounded-full"
                      />
                    ) : (
                      <User size={16} />
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </Draggable>
    );
  }
);
SortableItem.displayName = "SortableItem";
export default SortableItem;
