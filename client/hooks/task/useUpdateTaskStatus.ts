import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/nextjs";
import { sendRequest } from "@/lib/sendRequest";
import type { Task } from "./useGetTasksByProject";

interface UpdateTaskInput {
  status?: string;
  title?: string;
  description?: string;
  priority?: string;
  dueDate?: string;
  assignedToId?: string;
}

interface UpdateTaskResponse {
  updateTask: Task;
}

export const useUpdateTaskStatus = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, input, projectId }: { taskId: string; input: UpdateTaskInput; projectId: string }) => {
      const token = await getToken();
      const userId = user?.id;

      if (!userId) {
        throw new Error("User is not authenticated.");
      }

      const res = await sendRequest.post<{ data: UpdateTaskResponse }>(
        "/api/graphql",
        {
          query: `
            mutation UpdateTask($taskId: ID!, $input: UpdateTaskInput!) {
              updateTask(taskId: $taskId, input: $input) {
                id
                title
                description
                status
                priority
                dueDate
                assignedTo {
                  id
                  email
                  name
                  avatarUrl
                }
                project {
                  id
                  title
                }
              }
            }
          `,
          variables: {
            taskId,
            input: {
              ...input,
              userId,
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "x-user-id": userId,
          },
        }
      );

      return res.data.data.updateTask;
    },
    // Optimistic update
    onMutate: async ({ taskId, input, projectId }) => {
      const queryKey = ["tasks", projectId];
      await queryClient.cancelQueries({ queryKey });
      const previousTasks = queryClient.getQueryData<Task[]>(queryKey);
      queryClient.setQueryData(queryKey, (tasks: Task[] = []) =>
        tasks.map((task) =>
          task.id === taskId ? { ...task, ...input } : task
        )
      );
      return { previousTasks, queryKey };
    },
    onError: (err, variables, context) => {
      if (context?.previousTasks && context?.queryKey) {
        queryClient.setQueryData(context.queryKey, context.previousTasks);
      }
    },
    onSettled: (data, error, variables) => {
      const queryKey = ["tasks", variables.projectId];
      queryClient.invalidateQueries({ queryKey });
    },
  });
}; 