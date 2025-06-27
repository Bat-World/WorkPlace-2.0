import { Task as APITask } from '@/hooks/task/useGetTasksByProject';

export interface KanbanTask {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  label: string;
  comments: number;
  attachments: number;
  assignees: Array<{ id: string; name: string; avatarUrl?: string }>;
}

export interface KanbanColumn {
  id: string;
  title: string;
  taskIds: string[];
}

export const transformAPITaskToKanban = (task: APITask): KanbanTask => {
  return {
    id: task.id,
    title: task.title,
    description: task.description || "",
    priority: (task.priority.toLowerCase() as "low" | "medium" | "high") || "medium",
    label: task.project.title,
    comments: 0, // TODO: Add comments count when available
    attachments: 0, // TODO: Add attachments count when available
    assignees: task.assignedTo ? [{
      id: task.assignedTo.id,
      name: task.assignedTo.name || task.assignedTo.email,
      avatarUrl: task.assignedTo.avatarUrl || undefined,
    }] : [],
  };
};

export const organizeTasksByStatus = (tasks: APITask[]) => {
  const kanbanTasks: Record<string, KanbanTask> = {};
  const columns: Record<string, KanbanColumn> = {
    todo: { id: "todo", title: "To Do", taskIds: [] },
    doing: { id: "doing", title: "In Progress", taskIds: [] },
    review: { id: "review", title: "Review", taskIds: [] },
    done: { id: "done", title: "Done", taskIds: [] },
  };

  tasks.forEach(task => {
    const kanbanTask = transformAPITaskToKanban(task);
    kanbanTasks[task.id] = kanbanTask;

    // Map API status to column
    const status = task.status.toLowerCase();
    if (status === 'todo' || status === 'not_started') {
      columns.todo.taskIds.push(task.id);
    } else if (status === 'doing' || status === 'in_progress') {
      columns.doing.taskIds.push(task.id);
    } else if (status === 'review') {
      columns.review.taskIds.push(task.id);
    } else if (status === 'done' || status === 'completed') {
      columns.done.taskIds.push(task.id);
    } else {
      // Default to todo for unknown statuses
      columns.todo.taskIds.push(task.id);
    }
  });

  return { tasks: kanbanTasks, columns };
}; 