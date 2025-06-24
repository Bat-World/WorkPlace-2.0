import { useQuery } from '@tanstack/react-query';
import { useAuth, useUser } from '@clerk/nextjs';
import { sendRequest } from '@/lib/sendRequest';

export const useGetMembersByOrgId = (orgId: string) => {
  const { getToken } = useAuth();
  const { user } = useUser();

  return useQuery({
    queryKey: ['orgMembers', orgId],
    queryFn: async () => {
      const token = await getToken();
      const userId = user?.id;
      if (!userId) throw new Error('User is not loaded or not signed in');
      const res = await sendRequest.post(
        '/api/graphql',
        {
          query: `
            query GetMembersByOrgId($orgId: ID!, $userId: ID) {
              getMembersByOrgId(orgId: $orgId, userId: $userId) {
                id
                name
                email
                avatarUrl
                role
              }
            }
          `,
          variables: { orgId, userId },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'x-user-id': userId,
          },
        }
      );
      return res.data.data.getMembersByOrgId;
    },
    enabled: !!user?.id && !!orgId,
  });
}; 