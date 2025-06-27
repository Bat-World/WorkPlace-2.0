"use client";
import React, { useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import KanbanColumn from "./_components/KanbanColumn";
import type { Task, Column, Assignee } from "./_components/types";
import Info from "./_components/Info";

const mockAssignees: Assignee[] = [
  { id: "1", name: "Alice" },
  { id: "2", name: "Bob" },
  { id: "3", name: "Charlie" },
];
const initialTasks: Record<string, Task> = {
  "12": {
    id: "12",
    title: "Deploy to Vercel",
    description:
      "Lets do the exact opposite of the first concept. Light theme, minimalism and the...",
    priority: "medium",
    label: "Tinder",
    comments: 5,
    attachments: 2,
    assignees: [mockAssignees[0], mockAssignees[2]],
  },
  "13": {
    id: "13",
    title: "Design Landing Page",
    description: "Create a modern landing page.",
    priority: "high",
    label: "Design",
    comments: 2,
    attachments: 1,
    assignees: [mockAssignees[1]],
  },
  "14": {
    id: "14",
    title: "Setup Database",
    description: "Initialize PostgreSQL instance.",
    priority: "medium",
    label: "Backend",
    comments: 0,
    attachments: 0,
    assignees: [mockAssignees[2]],
  },
  "15": {
    id: "15",
    title: "Write Unit Tests",
    description: "Increase test coverage.",
    priority: "low",
    label: "QA",
    comments: 3,
    attachments: 2,
    assignees: [mockAssignees[0], mockAssignees[1]],
  },
};
const initialColumns: Record<string, Column> = {
  new: { id: "new", title: "New Requests", taskIds: ["12", "13"] },
  progress: { id: "progress", title: "In Progress", taskIds: ["14"] },
  review: { id: "review", title: "Review", taskIds: ["15"] },
  done: { id: "done", title: "Done", taskIds: [] },
};
const columnOrder = ["new", "progress", "review", "done"];

export default function KanbanPage() {
  const [tasks, setTasks] = useState(initialTasks);
  const [columns, setColumns] = useState(initialColumns);
  const [newTaskId, setNewTaskId] = useState<string | null>(null);

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
  }

  function handleAddTask() {
    const id = String(Date.now());
    const newTask: Task = {
      id,
      title: "New Dynamic Task",
      description: "Added manually in between.",
      priority: "medium",
      label: "Added",
      comments: 0,
      attachments: 0,
      assignees: [mockAssignees[0]],
    };
    setTasks((prev) => ({ ...prev, [id]: newTask }));
    setColumns((prev) => {
      const col = prev["progress"];
      const newIds = [...col.taskIds];
      newIds.splice(1, 0, id);
      return { ...prev, ["progress"]: { ...col, taskIds: newIds } };
    });
    setNewTaskId(id);
    setTimeout(() => setNewTaskId(null), 500);
  }

  return (
    <div className="min-h-screen px-20">
      <Info />
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
