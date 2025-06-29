import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth, useUser } from '@clerk/nextjs';
import { sendRequest } from '@/lib/sendRequest';

export const useManageAssignees = () => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, assigneeIds }: { taskId: string; assigneeIds: string[] }) => {
      const token = await getToken();
      const userId = user?.id;

      if (!userId) {
        throw new Error('User is not signed in');
      }

      const res = await sendRequest.post(
        '/api/graphql',
        {
          query: `
            mutation ManageAssignees($taskId: ID!, $assigneeIds: [ID!]!, $actingUserId: ID) {
              manageAssignees(taskId: $taskId, assigneeIds: $assigneeIds, actingUserId: $actingUserId) {
                id
                title
                assignees {
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
            assigneeIds,
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

      return res.data.data.manageAssignees;
    },
    onSuccess: (data, variables) => {
      // Temporarily disable invalidation to prevent state overwrite
      // queryClient.invalidateQueries({ queryKey: ['task', variables.taskId] });
      // queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}; 