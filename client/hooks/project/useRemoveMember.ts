import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sendRequest } from '@/lib/sendRequest';
import { useAuth, useUser } from '@clerk/nextjs';

export const useRemoveMember = () => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orgId, memberId }: { orgId: string; memberId: string }) => {
      const token = await getToken();
      const userId = user?.id;
      if (!userId) throw new Error('User is not loaded or not signed in');
      const res = await sendRequest.post(
        '/api/graphql',
        {
          query: `
            mutation RemoveMember($orgId: ID!, $memberId: ID!) {
              removeMember(orgId: $orgId, memberId: $memberId)
            }
          `,
          variables: { orgId, memberId },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'x-user-id': userId,
          },
        }
      );
      return res.data.data.removeMember;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orgMembers', variables.orgId] });
    },
  });
}; 