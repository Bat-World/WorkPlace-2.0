import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/nextjs";
import { sendRequest } from "@/lib/sendRequest";

interface ApproveTaskInput {
  taskId: string;
}

export const useApproveTask = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId }: ApproveTaskInput) => {
      const token = await getToken();
      const userId = user?.id;

      if (!userId) {
        throw new Error("User is not authenticated.");
      }

      const res = await sendRequest.post(
        "/api/graphql",
        {
          query: `
            mutation ApproveTask($taskId: ID!, $userId: ID) {
              approveTask(taskId: $taskId, userId: $userId) {
                id
                title
                status
                assignees {
                  id
                  email
                  name
                  avatarUrl
                }
                reviewers {
                  id
                  email
                  name
                  avatarUrl
                }
                createdBy {
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

      return res.data.data.approveTask;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["task", variables.taskId],
      });
      
      if (data?.project?.id) {
        queryClient.invalidateQueries({
          queryKey: ["tasks", data.project.id],
        });
      }
    },
  });
}; 