import { useQuery } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/nextjs";
import { sendRequest } from "@/lib/sendRequest";
import { GetCommentsResponse } from "@/lib/types";
import { Comment } from "@/lib/types";

export const useGetComments = (taskId: string) => {
  const { user } = useUser();
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["comments", taskId],
    queryFn: async (): Promise<Comment[]> => {
      const token = await getToken();
      const userId = user?.id;

      if (!userId) {
        throw new Error("User is not authenticated.");
      }

      const res = await sendRequest.post<{ data: GetCommentsResponse }>(
        "/api/graphql",
        {
          query: `
            query GetComments($taskId: ID!, $userId: ID) {
              getComments(taskId: $taskId, userId: $userId) {
                id
                content
                createdAt
                parentId
                likeCount
                isLikedByUser
                author {
                  id
                  name
                  email
                  avatarUrl
                }
                replies {
                  id
                  content
                  createdAt
                  parentId
                  likeCount
                  isLikedByUser
                  author {
                    id
                    name
                    email
                    avatarUrl
                  }
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

      return res.data.data.getComments;
    },
    enabled: !!taskId && !!user?.id,
  });
}; 

export type { Comment };
