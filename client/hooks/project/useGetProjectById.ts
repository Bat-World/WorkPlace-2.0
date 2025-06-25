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
            query GetTasksByProject($projectId: ID!) {
              getProjectById(projectId: $projectId) {
                id
                title
                tasks {
                  id
                  title
                  description
                  status
                  priority
                  dueDate
                  assignedTo {
                    id
                    name
                    avatarUrl
                  }
                  labels {
                    id
                    name
                    color
                  }
                  comments {
                    id
                    content
                    author {
                      id
                      name
                      avatarUrl
                    }
                    createdAt
                  }
                }
              }
            }
          `,
          variables: {
            projectId,
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
