import { useQuery } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/nextjs";
import { sendRequest } from "@/lib/sendRequest";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  assignees: Array<{
    id: string;
    email: string;
    name: string | null;
    avatarUrl: string | null;
  }>;
  project: {
    id: string;
    title: string;
  };
  labels: Array<{
    id: string;
    name: string;
    color: string;
  }>;
}

interface GetTasksByProjectResponse {
  getTasks: Task[];
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string; locations?: any[]; path?: string[] }>;
}

export const useGetTasksByProject = (projectId: string) => {
  const { user } = useUser();
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["tasks", projectId],
    queryFn: async (): Promise<Task[]> => {
      const token = await getToken();
      const userId = user?.id;

      if (!userId) {
        throw new Error("User is not authenticated.");
      }

      console.log('Making GraphQL request with:', { projectId, userId });

      const res = await sendRequest.post<GraphQLResponse<GetTasksByProjectResponse>>(
        "/api/graphql",
        {
          query: `
            query GetTasksByProject($projectId: ID!, $userId: ID) {
              getTasks(userId: $userId, projectId: $projectId) {
                id
                title
                description
                status
                priority
                dueDate
                createdAt
                updatedAt
                assignees {
                  id
                  email
                  name
                  avatarUrl
                }
                project {
                  id
                  title
                }
                labels {
                  id
                  name
                  color
                }
              }
            }
          `,
          variables: {
            projectId,
            userId,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "x-user-id": userId,
          },
        }
      );

      console.log('GraphQL response:', res.data);

      if (res.data.errors) {
        console.error('GraphQL errors:', res.data.errors);
        throw new Error(`GraphQL Error: ${res.data.errors[0]?.message || 'Unknown error'}`);
      }

      if (!res.data.data) {
        console.error('No data in response:', res.data);
        throw new Error('No data received from server');
      }

      if (!res.data.data.getTasks) {
        console.error('getTasks is undefined in response:', res.data.data);
        throw new Error('getTasks is undefined in response');
      }

      return res.data.data.getTasks;
    },
    enabled: !!projectId && !!user?.id,
  });
}; 