import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/nextjs";
import { sendRequest } from "@/lib/sendRequest";

interface UpdateTaskInput {
  title?: string;
  description?: string;
  body?: string;
  attachments?: string[];
  status?: string;
  dueDate?: string;
  priority?: string;
  assigneeIds?: string[];
  userId?: string;
}

export const useUpdateTask = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, input }: { taskId: string; input: UpdateTaskInput }) => {
      const token = await getToken();
      const userId = user?.id;

      if (!userId) {
        throw new Error("User is not authenticated.");
      }

      const res = await sendRequest.post(
        "/api/graphql",
        {
          query: `
            mutation UpdateTask($taskId: ID!, $input: UpdateTaskInput!) {
              updateTask(taskId: $taskId, input: $input) {
                id
                title
                description
                body
                attachments
                dueDate
                priority
                status
                createdAt
                updatedAt
                labels {
                  id
                  name
                  color
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
    onSuccess: (data, variables) => {
      // Invalidate and refetch the specific task
      queryClient.invalidateQueries({
        queryKey: ["task", variables.taskId],
      });
      
      // Also invalidate tasks list if we have projectId
      if (data?.project?.id) {
        queryClient.invalidateQueries({
          queryKey: ["tasks", data.project.id],
        });
      }
    },
  });
}; 