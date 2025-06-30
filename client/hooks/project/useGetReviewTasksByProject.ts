import { useQuery } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/nextjs";
import { sendRequest } from "@/lib/sendRequest";

export const useGetReviewTasksByProject = (projectId: string) => {
    const { getToken } = useAuth();
    const { user } = useUser();

    return useQuery({
        queryKey: ["reviewTasks", projectId],
        enabled: !!user?.id && !!projectId,
        queryFn: async () => {
            const token = await getToken();
            const userId = user?.id;

            if (!userId) throw new Error("User not authenticated");

            const res = await sendRequest.post(
                "/api/graphql",
                {
                    query: `
            query GetReviewTasksByProject($projectId: ID!, $userId: ID!) {
              getReviewTasksByProject(projectId: $projectId, userId: $userId) {
               id
    title
    id
    title
    status
    createdAt
    description
    reviewers {
      id
      name
      avatarUrl
    }
    assignees{
      avatarUrl
    }
    labels {
      id
      name
      color
    }
              }
            }
          `,
                    variables: { projectId, userId },
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        "x-user-id": userId,
                    },
                }
            );

            return res.data.data.getReviewTasksByProject;
        },
    });
};
