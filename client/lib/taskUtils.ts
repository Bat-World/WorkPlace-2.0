export const formatTaskForKanban = (task: any) => {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate,
    assignees: task.assignees || [],
    labels: task.labels || [],
    project: task.project,
  };
};

export const formatAssigneeForDisplay = (assignee: any) => {
  return {
    id: assignee.id,
    name: assignee.name || assignee.email,
    avatarUrl: assignee.avatarUrl || undefined,
  };
};

// Types for Kanban board
export interface KanbanTask {
  id: string;
  title: string;
  description: string;
  priority: string;
  label: string;
  comments: number;
  attachments: number;
  assignees: Array<{
    id: string;
    name: string;
    avatarUrl?: string;
  }>;
  labels: Array<{
    id: string;
    name: string;
    color: string;
  }>;
  dueDate?: string;
  status: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  taskIds: string[];
}

export const organizeTasksByStatus = (tasks: any[]) => {
  const kanbanTasks: Record<string, KanbanTask> = {};
  const columns: Record<string, KanbanColumn> = {
    todo: { id: "todo", title: "Шинэ хүсэлтүүд", taskIds: [] },
    doing: { id: "doing", title: "Хийгдэж байгаа", taskIds: [] },
    review: { id: "review", title: "Шалгуулхад бэлэн", taskIds: [] },
    done: { id: "done", title: "Дууссан", taskIds: [] },
  };

  tasks.forEach((task) => {
    const kanbanTask: KanbanTask = {
      id: task.id,
      title: task.title,
      description: task.description || "",
      priority: task.priority?.toLowerCase() || "medium",
      label: task.labels?.[0]?.name || "No Label",
      comments: 0, // This would need to be fetched separately
      attachments: task.attachments?.length || 0,
      assignees:
        task.assignees?.map((assignee: any) => ({
          id: assignee.id,
          name: assignee.name || assignee.email,
          avatarUrl: assignee.avatarUrl,
        })) || [],
      labels:
        task.labels?.map((label: any) => ({
          id: label.id,
          name: label.name,
          color: label.color,
        })) || [],
      dueDate: task.dueDate,
      status: task.status,
    };

    kanbanTasks[task.id] = kanbanTask;

    // Map task status to column
    const statusToColumn: Record<string, string> = {
      TODO: "todo",
      DOING: "doing",
      REVIEW: "review",
      DONE: "done",
      APPROVED: "done",
    };

    const columnId = statusToColumn[task.status] || "todo";
    if (columns[columnId]) {
      columns[columnId].taskIds.push(task.id);
    }
  });

  return { tasks: kanbanTasks, columns };
};
