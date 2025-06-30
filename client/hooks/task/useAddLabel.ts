import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/nextjs";
import { sendRequest } from "@/lib/sendRequest";

interface AddLabelInput {
  taskId: string;
  labelName: string;
  labelColor?: string;
}

export const useAddLabel = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, labelName, labelColor = "#cccccc" }: AddLabelInput) => {
      const token = await getToken();
      const userId = user?.id;

      if (!userId) {
        throw new Error("User is not authenticated.");
      }

      const res = await sendRequest.post(
        "/api/graphql",
        {
          query: `
            mutation AddLabel($taskId: ID!, $labelName: String!, $labelColor: String!, $actingUserId: ID!) {
              addLabel(taskId: $taskId, labelName: $labelName, labelColor: $labelColor, actingUserId: $actingUserId) {
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
            labelName,
            labelColor,
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

      return res.data.data.addLabel;
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