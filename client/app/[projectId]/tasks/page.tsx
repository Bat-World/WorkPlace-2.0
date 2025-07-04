"use client";
import React, { useState, useEffect } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import KanbanColumn from "./_components/KanbanColumn";
import Info from "./_components/Info";
import { useGetTasksByProject } from "@/hooks/task/useGetTasksByProject";
import { useUpdateTaskStatus } from "@/hooks/task/useUpdateTaskStatus";
import {
  organizeTasksByStatus,
  KanbanTask,
  KanbanColumn as KanbanColumnType,
} from "@/lib/taskUtils";
import { useParams } from "next/navigation";
import KanbanSkeleton from "@/components/Skeletons/KanbanSekeleton";

const columnOrder = ["todo", "doing", "review", "done"];
const columnToStatus: Record<string, string> = {
  todo: "TODO",
  doing: "DOING",
  review: "REVIEW",
  done: "DONE",
};

export default function KanbanPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { data: apiTasks, isLoading, error } = useGetTasksByProject(projectId);
  const updateTaskStatus = useUpdateTaskStatus();
  const [tasks, setTasks] = useState<Record<string, KanbanTask>>({});
  const [columns, setColumns] = useState<Record<string, KanbanColumnType>>({
    todo: { id: "todo", title: "Хийх", taskIds: [] },
    doing: { id: "doing", title: "Яг одоо хийгдэж байна", taskIds: [] },
    review: { id: "review", title: "Шалгах", taskIds: [] },
    done: { id: "done", title: "Дууссан", taskIds: [] },
  });
  const [newTaskId, setNewTaskId] = useState<string | null>(null);

  const projectTitle = apiTasks?.[0]?.project?.title ?? "Төслийн нэр";

  useEffect(() => {
    if (apiTasks) {
      const { tasks: kanbanTasks, columns: kanbanColumns } =
        organizeTasksByStatus(apiTasks);
      setTasks(kanbanTasks);
      setColumns(kanbanColumns);
    }
  }, [apiTasks]);

  function onDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === "done" && source.droppableId !== "done")
      return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const startCol = columns[source.droppableId];
    const endCol = columns[destination.droppableId];

    // Optimistically update the UI
    if (startCol === endCol) {
      const newTaskIds = [...startCol.taskIds];
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
      setColumns({
        ...columns,
        [startCol.id]: { ...startCol, taskIds: newTaskIds },
      });
    } else {
      const startTaskIds = [...startCol.taskIds];
      startTaskIds.splice(source.index, 1);
      const endTaskIds = [...endCol.taskIds];
      endTaskIds.splice(destination.index, 0, draggableId);
      setColumns({
        ...columns,
        [startCol.id]: { ...startCol, taskIds: startTaskIds },
        [endCol.id]: { ...endCol, taskIds: endTaskIds },
      });
    }

    // Update task status in the backend if moved to a different column
    if (startCol !== endCol) {
      const newStatus = columnToStatus[destination.droppableId];
      if (newStatus) {
        updateTaskStatus.mutate({
          taskId: draggableId,
          input: { status: newStatus },
          projectId,
        });
      }
    }
  }

  function handleAddTask() {
    const id = String(Date.now());
    const newTask: KanbanTask = {
      id,
      title: "New Dynamic Task",
      description: "Added manually in between.",
      priority: "medium",
      label: "Added",
      comments: 0,
      attachments: 0,
      assignees: [],
      labels: [],
      status: "DOING",
    };
    setTasks((prev) => ({ ...prev, [id]: newTask }));
    setColumns((prev) => {
      const col = prev["doing"];
      const newIds = [...col.taskIds];
      newIds.splice(1, 0, id);
      return { ...prev, ["doing"]: { ...col, taskIds: newIds } };
    });
    setNewTaskId(id);
    setTimeout(() => setNewTaskId(null), 500);
  }

  if (isLoading) {
    return (
      <div className="px-20 flex flex-col items-center justify-center">
        <Info projectName={projectTitle} />
        <KanbanSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-20 flex flex-col items-center justify-center">
        <KanbanSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-20">
      <Info projectName={apiTasks?.[0]?.project?.title || "Төслийн нэр"} />

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-4 mt-10">
          {columnOrder.map((colId) => (
            <KanbanColumn
              key={colId}
              column={columns[colId]}
              tasks={tasks}
              newTaskId={newTaskId}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
