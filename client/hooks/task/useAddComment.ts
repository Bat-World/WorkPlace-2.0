import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/nextjs";
import { sendRequest } from "@/lib/sendRequest";
import { Comment } from "./useGetComments";

interface AddCommentInput {
  taskId: string;
  content: string;
  parentId?: string;
}

export const useAddComment = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: AddCommentInput) => {
      const token = await getToken();
      const userId = user?.id;

      if (!userId) {
        throw new Error("User is not authenticated.");
      }

      const res = await sendRequest.post(
        "/api/graphql",
        {
          query: `
            mutation AddComment($taskId: ID!, $content: String!, $actingUserId: ID, $parentId: ID) {
              addComment(taskId: $taskId, content: $content, actingUserId: $actingUserId, parentId: $parentId) {
                id
                content
                createdAt
                parentId
                author {
                  id
                  name
                  email
                  avatarUrl
                }
              }
            }
          `,
          variables: {
            taskId: input.taskId,
            content: input.content,
            actingUserId: userId,
            parentId: input.parentId,
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

      return res.data.data.addComment;
    },
    onMutate: async (newComment) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["comments", newComment.taskId] });

      // Snapshot the previous value
      const previousComments = queryClient.getQueryData(["comments", newComment.taskId]);

      // Optimistically update to the new value
      const optimisticComment: Comment = {
        id: `temp-${Date.now()}`,
        content: newComment.content,
        createdAt: new Date().toISOString(),
        parentId: newComment.parentId,
        author: {
          id: user?.id || "",
          name: user?.firstName || user?.emailAddresses[0]?.emailAddress || "",
          email: user?.emailAddresses[0]?.emailAddress || "",
          avatarUrl: user?.imageUrl || null,
        },
        likeCount: 0,
        isLikedByUser: false,
        replies: [],
      };

      queryClient.setQueryData(["comments", newComment.taskId], (old: Comment[] = []) => {
        if (newComment.parentId) {
          // This is a reply - add it to the parent comment
          return old.map(comment => 
            comment.id === newComment.parentId 
              ? { ...comment, replies: [...(comment.replies || []), optimisticComment] }
              : comment
          );
        } else {
          // This is a top-level comment - add it to the beginning
          return [optimisticComment, ...old];
        }
      });

      // Return a context object with the snapshotted value
      return { previousComments, optimisticComment };
    },
    onError: (err, newComment, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousComments) {
        queryClient.setQueryData(["comments", newComment.taskId], context.previousComments);
      }
    },
    onSettled: (data, error, variables) => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.taskId],
      });
    },
  });
}; 