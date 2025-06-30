import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/nextjs";
import { sendRequest } from "@/lib/sendRequest";

interface CreateTaskInput {
  title: string;
  description?: string;
  body?: string;
  attachments?: string[];
  projectId: string;
  assigneeIds?: string[];
  dueDate?: string;
  priority?: string;
  status?: string;
  userId?: string;
  labels?: string[];
}

export const useCreateTask = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateTaskInput) => {
      const token = await getToken();
      const userId = user?.id;

      if (!userId) {
        throw new Error("User is not authenticated.");
      }

      const res = await sendRequest.post(
        "/api/graphql",
        {
          query: `
            mutation CreateTask($input: CreateTaskInput!) {
              createTask(input: $input) {
                id
                title
                description
                dueDate
                priority
                status
                createdAt
                labels {
                  id
                  name
                  color
                }
              }
            }
          `,
          variables: {
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

      return res.data.data.createTask;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch tasks for the specific project
      queryClient.invalidateQueries({
        queryKey: ["tasks", variables.projectId],
      });
    },
  });
};
