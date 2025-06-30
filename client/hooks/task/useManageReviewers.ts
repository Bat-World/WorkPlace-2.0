import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth, useUser } from '@clerk/nextjs';
import { sendRequest } from '@/lib/sendRequest';

export const useManageReviewers = () => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, reviewerIds }: { taskId: string; reviewerIds: string[] }) => {
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
    onSuccess: (data, variables) => {
      // Temporarily disable invalidation to prevent state overwrite
      // queryClient.invalidateQueries({ queryKey: ['task', variables.taskId] });
      // queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}; 