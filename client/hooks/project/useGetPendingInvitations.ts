import { useQuery } from '@tanstack/react-query';
import { useAuth, useUser } from '@clerk/nextjs';
import { sendRequest } from '@/lib/sendRequest';

interface UseGetPendingInvitationsProps {
  projectId: string;
}

export const useGetPendingInvitations = ({ projectId }: UseGetPendingInvitationsProps) => {
  const { getToken } = useAuth();
  const { user } = useUser();

  return useQuery({
    queryKey: ['pendingInvitations', projectId],
    queryFn: async () => {
      const token = await getToken();
      const userId = user?.id;

      if (!userId) {
        throw new Error('User is not loaded or not signed in');
      }

      const res = await sendRequest.post(
        '/api/graphql',
        {
          query: `
            query GetPendingInvitations($projectId: ID!, $userId: ID) {
              getPendingInvitations(projectId: $projectId, userId: $userId) {
                id
                email
                token
                accepted
                createdAt
              }
            }
          `,
          variables: {
            projectId,
            userId,
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

      return res.data.data.getPendingInvitations;
    },
    enabled: !!user?.id && !!projectId,
  });
}; 