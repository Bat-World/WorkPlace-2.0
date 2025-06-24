import { useQuery } from '@tanstack/react-query';
import { useAuth, useUser } from '@clerk/nextjs';
import { sendRequest } from '@/lib/sendRequest';

interface UseGetProjectByIdProps {
  projectId: string;
  skip?: number;
  take?: number;
}

export const useGetProjectById = ({
  projectId,
  skip = 0,
  take = 10,
}: UseGetProjectByIdProps) => {
  const { getToken } = useAuth();
  const { user } = useUser();

  return useQuery({
    queryKey: ['project', projectId, skip, take],
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
            query GetProjectById($projectId: ID!, $skip: Int, $take: Int, $userId: ID) {
              getProjectById(projectId: $projectId, skip: $skip, take: $take, userId: $userId) {
                id
                title
                description
                tasks {
                  id
                  title
                  description
                  status
                  priority
                  dueDate
                }
              }
            }
          `,
          variables: {
            projectId,
            skip,
            take,
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

      return res.data.data.getProjectById;
    },
    enabled: !!user?.id && !!projectId,
  });
};
