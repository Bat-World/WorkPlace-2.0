import { useQuery } from '@tanstack/react-query';
import { useAuth, useUser } from '@clerk/nextjs';
import { sendRequest } from '@/lib/sendRequest';

export const useGetProjects = () => {
  const { getToken } = useAuth();
  const { user } = useUser();

  return useQuery({
    queryKey: ['projects'],
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
  query GetProjects {
    getProjects {
      id
      title
      description
      createdAt
      updatedAt
      labels {
        id
        name
      }
      members {
        role
        user {
          id
          email
          avatarUrl
        }
      }
      createdBy {
        id
        name
        avatarUrl
      }
    }
  }
`
,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'x-user-id': userId,
          },
        }
      );

      return res.data.data.getProjects;
    },
    enabled: !!user?.id,
  });
};
