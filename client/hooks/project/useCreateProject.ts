import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth, useUser } from '@clerk/nextjs';
import { sendRequest } from '@/lib/sendRequest';

export const useCreateProject = () => {
  const { getToken } = useAuth();
  const { user, isLoaded } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      title: string;
      description?: string;
      invitees?: string[];
      labels?: string[];
    }) => {
      if (!isLoaded || !user) {
        throw new Error('User not ready yet, please wait.');
      }

      const token = await getToken();
      const userId = user.id;

      if (!token) {
        throw new Error('Auth token missing.');
      }

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
            'x-user-id': userId,
          },
        }
      );

      const project = res?.data?.data?.createProject;

      if (!project) {
        console.error('Unexpected response from server:', res);
        throw new Error('Project creation failed. Try again.');
      }

      return project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};
