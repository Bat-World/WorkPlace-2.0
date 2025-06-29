import { useMutation } from '@tanstack/react-query';
import { useAuth, useUser } from '@clerk/nextjs';
import { sendRequest } from '@/lib/sendRequest';

export const useUpdateProjectAvatar = () => {
  const { getToken } = useAuth();
  const { user } = useUser();

  return useMutation({
    mutationFn: async ({ projectId, avatarUrl }: { projectId: string; avatarUrl: string }) => {
      const token = await getToken();
      const userId = user?.id;
      if (!userId) throw new Error('User is not signed in');
      const res = await sendRequest.post(
        '/api/graphql',
        {
          query: `
            mutation UpdateProjectAvatar($projectId: ID!, $avatarUrl: String!) {
              updateProjectAvatar(projectId: $projectId, avatarUrl: $avatarUrl) {
                id
                avatarUrl
              }
            }
          `,
          variables: { projectId, avatarUrl },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-user-id': userId,
          },
        }
      );
      return res.data.data.updateProjectAvatar;
    },
  });
}; 