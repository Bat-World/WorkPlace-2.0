import { useQuery } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/nextjs";
import { sendRequest } from "@/lib/sendRequest";

export const useGetTasks = (projectId?: string, userId?: string) => {
  const { getToken } = useAuth();
  const { user } = useUser();

  return useQuery({
    queryKey: ["tasks", projectId, userId],
    queryFn: async () => {
      const token = await getToken();
      const currentUserId = userId || user?.id;
      if (!currentUserId)
        throw new Error("User is not loaded or not signed in");
      const res = await sendRequest.post(
        "/api/graphql",
        {
          query: `
            query GetTasks($projectId: ID, $userId: ID) {
              getTasks(projectId: $projectId, userId: $userId) {
                id
                title
                description
                status
                priority
                dueDate
                assignedTo {
                  id
                  name
                  avatarUrl
                }
                labels {
                  id
                  name
                  color
                }
                comments {
                  id
                  content
                  author {
                    id
                    name
                    avatarUrl
                  }
                  createdAt
                }
              }
            }
          `,
          variables: { projectId, userId: currentUserId },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "x-user-id": currentUserId,
          },
        }
      );
      return res.data.data.getTasks;
    },
    enabled: !!user?.id && !!projectId,
  });
};
