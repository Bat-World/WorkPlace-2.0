import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/nextjs";
import { sendRequest } from "@/lib/sendRequest";

interface UpdateTaskInput {
  taskId: string;
  input: {
    title?: string;
    description?: string;
    status?: "TODO" | "DOING" | "REVIEW" | "DONE";
    dueDate?: string;
    priority?: string;
    assignedToId?: string;
    userId?: string;
  };
}

export const useUpdateTask = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, input }: UpdateTaskInput) => {
      const token = await getToken();
      const userId = user?.id;
      if (!userId) throw new Error("User is not authenticated.");
      const res = await sendRequest.post(
        "/api/graphql",
        {
          query: `
            mutation UpdateTask($taskId: ID!, $input: UpdateTaskInput!) {
              updateTask(taskId: $taskId, input: $input) {
                id
                status
              }
            }
          `,
          variables: {
            taskId,
            input: { ...input, userId },
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
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}; 