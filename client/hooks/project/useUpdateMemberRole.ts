import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sendRequest } from '@/lib/sendRequest';
import { useAuth, useUser } from '@clerk/nextjs';

export const useUpdateMemberRole = () => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orgId, memberId, role }: { orgId: string; memberId: string; role: string }) => {
      const token = await getToken();
      const userId = user?.id;
      if (!userId) throw new Error('User is not loaded or not signed in');
      const res = await sendRequest.post(
        '/api/graphql',
        {
          query: `
            mutation UpdateMemberRole($orgId: ID!, $memberId: ID!, $role: Role!) {
              updateMemberRole(orgId: $orgId, memberId: $memberId, role: $role) {
                id
                role
              }
            }
          `,
          variables: { orgId, memberId, role },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'x-user-id': userId,
          },
        }
      );
      return res.data.data.updateMemberRole;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orgMembers', variables.orgId] });
    },
  });
}; 