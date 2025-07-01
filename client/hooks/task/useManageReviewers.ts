import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth, useUser } from '@clerk/nextjs';
import { sendRequest } from '@/lib/sendRequest';

export const useManageReviewers = () => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, reviewerIds, members }: { taskId: string; reviewerIds: string[]; members: any[] }) => {
      const token = await getToken();
      const userId = user?.id;

      if (!userId) {
        throw new Error('User is not signed in');
      }

      const res = await sendRequest.post(
        '/api/graphql',
        {
          query: `
            mutation ManageReviewers($taskId: ID!, $reviewerIds: [ID!]!, $actingUserId: ID) {
              manageReviewers(taskId: $taskId, reviewerIds: $reviewerIds, actingUserId: $actingUserId) {
                id
                title
                reviewers {
                  id
                  name
                  email
                  avatarUrl
                }
              }
            }
          `,
          variables: {
            taskId,
            reviewerIds,
            actingUserId: userId,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'x-user-id': userId,
          },
        }
      );

      if (res.data.errors) {
        throw new Error(res.data.errors[0]?.message || 'GraphQL error');
      }

      return res.data.data.manageReviewers;
    },
    onMutate: async ({ taskId, reviewerIds, members }) => {
      await queryClient.cancelQueries({ queryKey: ['task', taskId] });
      const previousTask = queryClient.getQueryData(['task', taskId]);
      // Find the full reviewer objects from members
      const newReviewers = members
        ? members.filter((member) => reviewerIds.includes(member.user.id)).map((member) => member.user)
        : [];
      queryClient.setQueryData(['task', taskId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          reviewers: newReviewers,
        };
      });
      return { previousTask };
    },
    onError: (err, variables, context) => {
      if (context?.previousTask) {
        queryClient.setQueryData(['task', variables.taskId], context.previousTask);
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['task', variables.taskId] });
    },
  });
}; 