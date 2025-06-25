"use client";
import React, { useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import KanbanColumn from "./_components/KanbanColumn";
import type { Task, Column, Assignee } from "./_components/types";
import Info from "./_components/Info";
import { useParams } from "next/navigation";
import { useGetProjectById } from "@/hooks/project/useGetProjectById";
import { useUpdateTask } from "@/hooks/task/useUpdateTask";
import { toast } from "react-toastify";
import { useGetTasks } from "@/hooks/task/useGetTasks";

// Helper: Map backend task data to Task type
function mapTasks(fetchedTasks: any[]): Record<string, Task> {
  const taskMap: Record<string, Task> = {};
  fetchedTasks.forEach((t: any) => {
    taskMap[t.id] = {
      id: t.id,
      title: t.title,
      description: t.description || "",
      priority: t.priority ? t.priority.toLowerCase() : "medium",
      label: t.labels && t.labels.length > 0 ? t.labels[0].name : "",
      comments: t.comments?.length || 0,
      attachments: 0,
      assignees: t.assignedTo
        ? [
            {
              id: t.assignedTo.id,
              name: t.assignedTo.name || "",
              avatarUrl: t.assignedTo.avatarUrl,
            },
          ]
        : [],
      status: t.status || "TODO",
      dueDate: t.dueDate || null,
    };
  });
  return taskMap;
}

// Helper: Build Kanban columns from tasks
function buildColumns(
  tasks: Record<string, Task>,
  statusList: string[],
  statusTitles: Record<string, string>
): Record<string, Column> {
  const cols: Record<string, Column> = {};
  statusList.forEach((status) => {
    cols[status] = {
      id: status,
      title: statusTitles[status] || status,
      taskIds: Object.values(tasks)
        .filter((t: any) => t.status === status)
        .map((t) => t.id),
    };
  });
  return cols;
}

export default function KanbanPage() {
  const params = useParams();
  const projectId = params?.projectId as string;
  const {
    data: project,
    isLoading: isProjectLoading,
    isError: isProjectError,
  } = useGetProjectById({ projectId });
  const { data: fetchedTasks, isLoading, isError } = useGetTasks(projectId);
  const { mutate: updateTask } = useUpdateTask();

  // Kanban status and titles
  const statusList = ["TODO", "DOING", "REVIEW", "DONE"];
  const statusTitles: Record<string, string> = {
    TODO: "Шинэ хүсэлтүүд",
    DOING: "Хийгдэж байгаа",
    REVIEW: "Шалгуулхад бэлэн",
    DONE: "Хаагдсан таскууд",
  };

  const tasks = React.useMemo(
    () => mapTasks(fetchedTasks || []),
    [fetchedTasks]
  );
  const columns = React.useMemo(
    () => buildColumns(tasks, statusList, statusTitles),
    [tasks]
  );

  const [initialized, setInitialized] = useState(false);
  const [localTasks, setLocalTasks] = useState<Record<string, Task>>({});
  const [localColumns, setLocalColumns] = useState<Record<string, Column>>({});

  React.useEffect(() => {
    console.log("[DEBUG] fetchedTasks:", fetchedTasks);
  }, [fetchedTasks]);

  // Update local state whenever fetchedTasks changes (for real-time update)
  React.useEffect(() => {
    if (Object.keys(tasks).length > 0) {
      setLocalTasks(tasks);
      setLocalColumns(columns);
      setInitialized(true);
    }
  }, [tasks, columns]);

  React.useEffect(() => {
    console.log("[DEBUG] tasks data:", localTasks);
  }, [localTasks]);

  function handleDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === "DONE" || source.droppableId === "DONE") {
      toast.error("Алдаа гарлаа");
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;
    const task = localTasks[draggableId];
    const prevStatus = task.status;
    const newStatus = destination.droppableId as Task["status"];
    if (prevStatus === newStatus) return;
    const newColumns = { ...localColumns };
    newColumns[prevStatus] = {
      ...newColumns[prevStatus],
      taskIds: newColumns[prevStatus].taskIds.filter(
        (id) => id !== draggableId
      ),
    };
    newColumns[newStatus] = {
      ...newColumns[newStatus],
      taskIds: [
        ...newColumns[newStatus].taskIds.slice(0, destination.index),
        draggableId,
        ...newColumns[newStatus].taskIds.slice(destination.index),
      ],
    };
    setLocalColumns(newColumns);
    setLocalTasks({
      ...localTasks,
      [draggableId]: { ...task, status: newStatus },
    });
    updateTask(
      {
        taskId: draggableId,
        input: { status: newStatus },
      },
      {
        onError: () => {
          setLocalColumns(localColumns);
          setLocalTasks(localTasks);
          toast.error("Статус өөрчлөхөд алдаа гарлаа!");
        },
      }
    );
  }

  if (isLoading || isProjectLoading) return <div>Loading...</div>;
  if (isError || isProjectError || !project)
    return <div>Error loading project or tasks.</div>;

  return (
    <div className="min-h-screen px-20">
      <Info />
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-4 mt-10">
          {statusList.map((status) =>
            localColumns[status] ? (
              <KanbanColumn
                key={status}
                column={localColumns[status]}
                tasks={localTasks}
                newTaskId={null}
              />
            ) : null
          )}
        </div>
      </DragDropContext>
    </div>
  );
}
