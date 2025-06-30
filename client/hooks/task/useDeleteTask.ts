import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/nextjs";
import { sendRequest } from "@/lib/sendRequest";

export const useDeleteTask = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      const token = await getToken();
      const userId = user?.id;

      if (!userId) {
        throw new Error("User is not authenticated.");
      }

      const res = await sendRequest.post(
        "/api/graphql",
        {
          query: `
            mutation DeleteTask($taskId: ID!, $userId: ID) {
              deleteTask(taskId: $taskId, userId: $userId) {
                id
                title
              }
            }
          `,
          variables: {
            taskId,
            userId,
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

      return res.data.data.deleteTask;
    },
    onSuccess: () => {
      // Invalidate all task queries to refresh the lists
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });
}; 