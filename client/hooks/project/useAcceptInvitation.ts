import { useMutation } from '@tanstack/react-query';
import { useAuth, useUser } from '@clerk/nextjs';
import { sendRequest } from '@/lib/sendRequest';

interface AcceptInviteInput {
  token: string;
}

interface AcceptInviteResponse {
  message: string;
  projectId: string;
}

export const useAcceptInvite = () => {
  const { getToken } = useAuth();
  const { user } = useUser();

  return useMutation({
    mutationFn: async (input: AcceptInviteInput): Promise<AcceptInviteResponse> => {
      const token = await getToken();
      const userId = user?.id;

      if (!userId) {
        throw new Error('User is not loaded or not signed in');
      }

      const res = await sendRequest.post(
        '/api/graphql',
        {
          query: `
            mutation AcceptInvite($input: AcceptInviteInput!) {
              acceptInvite(input: $input) {
                message
                projectId
              }
            }
          `,
          variables: { input },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'x-user-id': userId,
          },
        }
      );

      return res.data.data.acceptInvite;
    },
  });
};
