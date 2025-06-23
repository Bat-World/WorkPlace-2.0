import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import SortableItem from "./SortableItem";
import type { Column, Task } from "./types";

const KanbanColumn = ({
  column,
  tasks,
  newTaskId,
}: {
  column: Column;
  tasks: Record<string, Task>;
  newTaskId: string | null;
}) => (
  <div className="rounded-xl p-3 min-h-[400px] flex flex-col">
    <h2 className="font-semibold text-lg mb-4 text-[var(--background)] flex items-center gap-2">
      {column.title}
      <span className="text-base text-[var(--background)]/50">
        {column.taskIds.length}
      </span>
      {/* {column.id === "done" && (
        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
          Батлагдсан таскууд
        </span>
      )} */}
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
            <div className="text-sm text-gray-400 mb-2">
              Одоогоор таск байхгүй байна.
            </div>
          )}
          {column.taskIds.map((taskId, idx) => (
            <SortableItem
              key={taskId}
              task={tasks[taskId]}
              index={idx}
              isNew={newTaskId === taskId}
            />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </div>
);
export default KanbanColumn;
