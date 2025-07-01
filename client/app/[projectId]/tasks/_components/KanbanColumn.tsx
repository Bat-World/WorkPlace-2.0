import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import SortableItem from "./SortableItem";
import type {
  KanbanColumn as KanbanColumnType,
  KanbanTask,
} from "@/lib/taskUtils";

const getColumnColor = (columnId: string): string => {
  switch (columnId) {
    case "todo":
      return "bg-[#BA3E3E]";
    case "doing":
      return "bg-[#F9D769]";
    case "review":
      return "bg-[#6B83FF]";
    case "done":
      return "bg-[#2FC285]";
    default:
      return "bg-gray-500";
  }
};

const KanbanColumn = ({
  column,
  tasks,
  newTaskId,
}: {
  column: KanbanColumnType | undefined;
  tasks: Record<string, KanbanTask>;
  newTaskId: string | null;
}) => {
  if (!column) {
    return (
      <div className="rounded-xl p-3 min-h-[400px] flex flex-col">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl p-3 min-h-[400px] flex flex-col">
      <h2 className="font-semibold text-lg mb-4 text-[var(--background)] flex items-center gap-2">
        <div
          className={`w-2 h-auto aspect-square rounded-full ${getColumnColor(
            column.id
          )}`}
        ></div>
        {column.title}
        <span className="text-base text-[var(--background)]/50">
          {column.taskIds.length}
        </span>
      </h2>
      <Droppable droppableId={column.id} isDropDisabled={column.id === "done"}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 space-y-3 min-h-[80px] transition-all ${
              snapshot.isDraggingOver
                ? column.id === "done"
                  ? "border-2 border-red-300 bg-red-400"
                  : "border-2 border-blue-400 rounded-2xl border-dashed"
                : "border-transparent"
            }`}
          >
            {column.taskIds.length === 0 && (
              <div className="text-sm text-gray-400 mb-2"></div>
            )}
            {column.taskIds.map((taskId, idx) => (
              <SortableItem
                key={taskId}
                task={tasks[taskId]}
                index={idx}
                isNew={newTaskId === taskId}
                isDragDisabled={column.id === "done"}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};
export default KanbanColumn;
