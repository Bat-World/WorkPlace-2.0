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

      try {
        const res = await sendRequest.post(
          '/api/graphql',
          {
            query: `
              query GetProjectById($projectId: ID!, $skip: Int, $take: Int, $userId: ID) {
                getProjectById(projectId: $projectId, skip: $skip, take: $take, userId: $userId) {
                  id
                  title
                  description
                  avatarUrl
                  members {
                    id
                    role
                    userId
                    user {
                      id
                      name
                      email
                      avatarUrl
                    }
                  }
                  tasks {
                    id
                    title
                    description
                    status
                    priority
                    dueDate
                  }
                        createdBy {
                     id
                      name
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

        if (res.data.errors) {
          throw new Error(res.data.errors[0]?.message || 'GraphQL error');
        }

        return res.data.data.getProjectById;
      } catch (error) {
        throw error;
      }
    },
    enabled: !!user?.id && !!projectId,
  });
};
