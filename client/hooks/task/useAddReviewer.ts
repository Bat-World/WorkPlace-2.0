import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/nextjs";
import { sendRequest } from "@/lib/sendRequest";

interface AddReviewerInput {
  taskId: string;
  reviewerId: string;
}

export const useAddReviewer = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, reviewerId }: AddReviewerInput) => {
      const token = await getToken();
      const userId = user?.id;

      if (!userId) {
        throw new Error("User is not authenticated.");
      }

      const res = await sendRequest.post(
        "/api/graphql",
        {
          query: `
            mutation AddReviewer($taskId: ID!, $userId: ID!, $actingUserId: ID) {
              addReviewer(taskId: $taskId, userId: $userId, actingUserId: $actingUserId) {
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
            userId: reviewerId,
            actingUserId: userId,
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

      return res.data.data.addReviewer;
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