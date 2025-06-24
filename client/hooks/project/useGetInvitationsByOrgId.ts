import { useQuery } from '@tanstack/react-query';
import { useAuth, useUser } from '@clerk/nextjs';
import { sendRequest } from '@/lib/sendRequest';

export const useGetInvitationsByOrgId = (orgId: string) => {
  const { getToken } = useAuth();
  const { user } = useUser();

  return useQuery({
    queryKey: ['invitations', orgId],
    queryFn: async () => {
      const token = await getToken();
      const userId = user?.id;
      if (!userId) throw new Error('User is not loaded or not signed in');
      const res = await sendRequest.post(
        '/api/graphql',
        {
          query: `
            query GetInvitationsByOrgId($orgId: ID!) {
              getInvitationsByOrgId(orgId: $orgId) {
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
          variables: { orgId },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'x-user-id': userId,
          },
        }
      );
      return res.data.data.getInvitationsByOrgId;
    },
    enabled: !!user?.id && !!orgId,
  });
}; 