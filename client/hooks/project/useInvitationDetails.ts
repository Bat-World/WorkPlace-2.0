import { useQuery } from '@tanstack/react-query';
import { useAuth, useUser } from '@clerk/nextjs';
import { sendRequest } from '@/lib/sendRequest';

interface InvitationDetails {
  projectId: string;
  projectTitle: string;
  invitedByEmail: string;
}

export const useInvitationDetails = (token: string | null) => {
  const { getToken } = useAuth();
  const { user } = useUser();

  return useQuery<InvitationDetails>({
    queryKey: ['invitationDetails', token],
    queryFn: async () => {
      if (!token) throw new Error('Token is missing');
      const authToken = await getToken();
      const userId = user?.id;

      if (!userId) throw new Error('User is not signed in');

      const res = await sendRequest.post(
        '/api/graphql',
        {
          query: `
            query GetInvitationByToken($token: String!) {
              getInvitationByToken(token: $token) {
                projectId
                projectTitle
                invitedByEmail
              }
            }
          `,
          variables: { token },
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
            'x-user-id': userId,
          },
        }
      );

      return res.data.data.getInvitationByToken;
    },
    enabled: !!token && !!user?.id,  
  });
};
