import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth, useUser } from '@clerk/nextjs';
import { sendRequest } from '@/lib/sendRequest';

export const useCreateOrganization = () => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { name: string; image?: string }) => {
      const token = await getToken();
      const userId = user?.id;
      if (!userId) throw new Error('User is not loaded or not signed in');
      const res = await sendRequest.post(
        '/api/graphql',
        {
          query: `
            mutation CreateOrganization($input: CreateOrganizationInput!) {
              createOrganization(input: $input) {
                id
                name
                image
              }
            }
          `,
          variables: { input: { ...input, userId } },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'x-user-id': userId,
          },
        }
      );
      return res.data.data.createOrganization;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations", user?.id] });
    },
  });
}; 