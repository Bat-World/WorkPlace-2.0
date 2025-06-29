import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth, useUser } from '@clerk/nextjs';
import { sendRequest } from '@/lib/sendRequest';

interface UseCancelInvitationProps {
  projectId: string;
}

export const useCancelInvitation = ({ projectId }: UseCancelInvitationProps) => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invitationId: string) => {
      const token = await getToken();
      const userId = user?.id;

      if (!userId) {
        throw new Error('User is not signed in');
      }

      const res = await sendRequest.post(
        '/api/graphql',
        {
          query: `
            mutation CancelInvitation($invitationId: ID!) {
              cancelInvitation(invitationId: $invitationId)
            }
          `,
          variables: {
            invitationId,
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

      return res.data.data.cancelInvitation;
    },
    onSuccess: () => {
      // Invalidate pending invitations query
      queryClient.invalidateQueries({ queryKey: ['pendingInvitations', projectId] });
    },
  });
}; 