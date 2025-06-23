import { useMutation } from '@tanstack/react-query';
import { useAuth, useUser } from '@clerk/nextjs';
import { sendRequest } from '@/lib/sendRequest';

export const useCreateProject = () => {
  const { getToken } = useAuth();
  const { user } = useUser(); 

  return useMutation({
    mutationFn: async (input: {
      title: string;
      description: string;
      organizationId: string;
    }) => {
      const token = await getToken();
      const userId = user?.id;

      if (!userId) {
        throw new Error('User is not loaded or not signed in');
      }

      console.log('✅ sending userId:', userId);

      const res = await sendRequest.post(
        '/api/graphql',
        {
          query: `
            mutation CreateProject($input: CreateProjectInput!) {
              createProject(input: $input) {
                id
                title
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

      return res.data.data.createProject;
    },
  });
};

