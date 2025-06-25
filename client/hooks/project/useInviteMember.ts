import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sendRequest } from '@/lib/sendRequest';
import { useAuth, useUser } from '@clerk/nextjs';

export const useInviteMember = () => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orgId, email }: { orgId: string; email: string }) => {
      const token = await getToken();
      const userId = user?.id;
      if (!userId) throw new Error('User is not loaded or not signed in');
      const res = await sendRequest.post(
        '/api/graphql',
        {
          query: `
            mutation InviteMember($orgId: ID!, $email: String!) {
              inviteMember(input: { orgId: $orgId, email: $email }) {
                id
                email
                organizationId
                invitedById
                token
                accepted
                createdAt
                acceptedAt
                role
              }
            }
          `,
          variables: { orgId, email },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'x-user-id': userId,
          },
        }
      );
      return res.data.data.inviteMember;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['invitations', variables.orgId] });
    },
  });
}; 