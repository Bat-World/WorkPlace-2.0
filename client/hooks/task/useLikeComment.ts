import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/nextjs";
import { sendRequest } from "@/lib/sendRequest";

export const useLikeComment = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: string) => {
      const token = await getToken();
      const userId = user?.id;

      if (!userId) {
        throw new Error("User is not authenticated.");
      }

      const res = await sendRequest.post(
        "/api/graphql",
        {
          query: `
            mutation LikeComment($commentId: ID!, $actingUserId: ID) {
              likeComment(commentId: $commentId, actingUserId: $actingUserId) {
                id
                user {
                  id
                  name
                  email
                }
                comment {
                  id
                }
                createdAt
              }
            }
          `,
          variables: {
            commentId,
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

      return res.data.data.likeComment;
    },
    onMutate: async (commentId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["comments"] });

      // Snapshot the previous value
      const previousComments = queryClient.getQueriesData({ queryKey: ["comments"] });

      // Optimistically update the like count and status
      queryClient.setQueriesData({ queryKey: ["comments"] }, (old: any) => {
        if (!old) return old;
        
        const updateCommentLikes = (comments: any[]): any[] => {
          return comments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                likeCount: comment.likeCount + 1,
                isLikedByUser: true,
              };
            }
            if (comment.replies && comment.replies.length > 0) {
              return {
                ...comment,
                replies: updateCommentLikes(comment.replies),
              };
            }
            return comment;
          });
        };

        return updateCommentLikes(old);
      });

      // Return a context object with the snapshotted value
      return { previousComments };
    },
    onError: (err, commentId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousComments) {
        context.previousComments.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({
        queryKey: ["comments"],
      });
    },
  });
}; 